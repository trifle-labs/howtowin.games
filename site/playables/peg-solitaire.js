// Peg solitaire — playable canvas implementation
// ~100 lines, click peg then click destination to jump.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 340);
  canvas.width = size;
  canvas.height = size;

  const grid = 7, cell = size / grid;
  const board = Array.from({ length: grid }, () => Array(grid).fill(-1));
  let selected = null, won = false, solveTimer = null;
  const statusEl = document.getElementById("playable-status");

  // Set up English board (cross shape, 33 holes)
  for (let r = 0; r < grid; r++) {
    for (let c = 0; c < grid; c++) {
      const corner = (r < 2 || r > 4) && (c < 2 || c > 4);
      board[r][c] = corner ? -1 : 1;
    }
  }
  board[3][3] = 0; // center empty

  function valid(r, c) { return r >= 0 && r < grid && c >= 0 && c < grid && board[r][c] !== -1; }

  function canJump(r, c, dr, dc) {
    const r2 = r + dr, c2 = c + dc, r3 = r + 2 * dr, c3 = c + 2 * dc;
    return valid(r3, c3) && board[r][c] === 1 && board[r2][c2] === 1 && board[r3][c3] === 0;
  }

  function getValidJumps(r, c) {
    const jumps = [];
    for (const [dr, dc] of [[-2,0],[2,0],[0,-2],[0,2]]) {
      const nr = r + dr, nc = c + dc;
      const mr = r + dr/2, mc = c + dc/2;
      if (nr >= 0 && nr < grid && nc >= 0 && nc < grid &&
          board[mr][mc] === 1 && board[nr][nc] === 0 && board[r][c] === 1) {
        jumps.push([nr, nc]);
      }
    }
    return jumps;
  }

  function countPegs() {
    let n = 0;
    for (let r = 0; r < grid; r++) for (let c = 0; c < grid; c++) if (board[r][c] === 1) n++;
    return n;
  }

  function draw() {
    ctx.clearRect(0, 0, size, size);
    const r = cell * 0.4;

    for (let rw = 0; rw < grid; rw++) {
      for (let cl = 0; cl < grid; cl++) {
        if (board[rw][cl] === -1) continue;
        const cx = cl * cell + cell / 2, cy = rw * cell + cell / 2;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        if (board[rw][cl] === 1) {
          ctx.fillStyle = selected && selected[0] === rw && selected[1] === cl ? "#eb0" : "#e66";
          ctx.fill();
          ctx.strokeStyle = "#222";
          ctx.lineWidth = 1.5;
          ctx.stroke();
        } else {
          ctx.fillStyle = "#444";
          ctx.fill();
          ctx.strokeStyle = "#222";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    // Valid jump targets
    if (selected) {
      const targets = getValidJumps(selected[0], selected[1]);
      for (const [tr, tc] of targets) {
        const tx = tc * cell + cell / 2, ty = tr * cell + cell / 2;
        ctx.beginPath();
        ctx.arc(tx, ty, cell * 0.12, 0, Math.PI * 2);
        ctx.fillStyle = "#4a4";
        ctx.fill();
      }
    }

    const pegs = countPegs();
    statusEl.textContent = won ? `solved! (${pegs} peg${pegs > 1 ? "s" : ""})` : `${pegs} pegs`;
  }

  function handleClick(e) {
    if (won) return;
    const rect = canvas.getBoundingClientRect();
    const c = Math.floor((e.clientX - rect.left) * (size / rect.width) / cell);
    const r = Math.floor((e.clientY - rect.top) * (size / rect.height) / cell);
    if (!valid(r, c) || board[r][c] === -1) return;

    if (selected === null) {
      if (board[r][c] === 1) selected = [r, c];
    } else {
      const [sr, sc] = selected;
      const dr = r - sr, dc = c - sc;
      if ((Math.abs(dr) === 2 && dc === 0) || (Math.abs(dc) === 2 && dr === 0)) {
        const dirR = dr / 2, dirC = dc / 2;
        if (canJump(sr, sc, dirR, dirC)) {
          board[sr][sc] = 0;
          board[sr + dirR][sc + dirC] = 0;
          board[r][c] = 1;
          if (countPegs() === 1) won = true;
        }
      }
      selected = null;
    }
    draw();
  }

  // ── DFS solver ────────────────────────────────────────────

  function findAllMoves(b) {
    const moves = [];
    for (let r = 0; r < grid; r++) {
      for (let c = 0; c < grid; c++) {
        if (b[r][c] !== 1) continue;
        for (const [dr, dc] of [[-2,0],[2,0],[0,-2],[0,2]]) {
          const r2 = r + dr/2, c2 = c + dc/2, r3 = r + dr, c3 = c + dc;
          if (r3 >= 0 && r3 < grid && c3 >= 0 && c3 < grid &&
              b[r2][c2] === 1 && b[r3][c3] === 0 && b[r][c] === 1) {
            // Only add unique (r3, c3) destination to avoid duplicate moves
            // Actually include source too for dedup
            moves.push({ sr: r, sc: c, mr: r2, mc: c2, dr: r3, dc: c3 });
          }
        }
      }
    }
    return moves;
  }

  function dfsSolve(b, path, visited, nodes) {
    if (nodes.val > 3000000) return null;
    nodes.val++;
    const pegs = b.flat().filter(v => v === 1).length;
    if (pegs === 1) return path;
    const moves = findAllMoves(b);
    // Shuffle for variety
    for (let i = moves.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [moves[i], moves[j]] = [moves[j], moves[i]];
    }
    for (const m of moves) {
      b[m.sr][m.sc] = 0;
      b[m.mr][m.mc] = 0;
      b[m.dr][m.dc] = 1;
      const key = b.map(r => r.join("")).join("|");
      if (!visited.has(key)) {
        visited.add(key);
        const result = dfsSolve(b, path.concat(m), visited, nodes);
        if (result) return result;
      }
      // Undo
      b[m.sr][m.sc] = 1;
      b[m.mr][m.mc] = 1;
      b[m.dr][m.dc] = 0;
    }
    return null;
  }

  canvas.addEventListener("click", handleClick);
  draw();

  return {
    destroy() {
      canvas.removeEventListener("click", handleClick);
      if (solveTimer) { clearInterval(solveTimer); solveTimer = null; }
      ctx.clearRect(0, 0, size, size);
    },
    restart() {
      if (solveTimer) { clearInterval(solveTimer); solveTimer = null; }
      for (let r = 0; r < grid; r++) {
        for (let c = 0; c < grid; c++) {
          board[r][c] = (r < 2 || r > 4) && (c < 2 || c > 4) ? -1 : 1;
        }
      }
      board[3][3] = 0;
      selected = null; won = false;
      draw();
    },
    solve() {
      if (won || solveTimer) return;
      statusEl.textContent = "solving…";
      draw();
      // Copy current board state and solve
      const copy = board.map(row => [...row]);
      const visited = new Set();
      visited.add(copy.map(r => r.join("")).join("|"));
      const path = dfsSolve(copy, [], visited, { val: 0 });
      if (!path) { draw(); statusEl.textContent = "no solution found"; return; }
      selected = null;
      draw();
      let i = 0;
      solveTimer = setInterval(() => {
        if (i >= path.length) {
          clearInterval(solveTimer);
          solveTimer = null;
          won = true;
          draw();
          return;
        }
        const m = path[i];
        board[m.sr][m.sc] = 0;
        board[m.mr][m.mc] = 0;
        board[m.dr][m.dc] = 1;
        draw();
        i++;
      }, 300);
    }
  };
}
