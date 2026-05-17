// Conway's Soldiers — playable canvas implementation
// ~100 lines, click peg to select, green dots show valid jump targets.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 340);
  canvas.width = size;
  canvas.height = size;
  const statusEl = document.getElementById("playable-status");

  const COLS = 9, ROWS = 8;
  const cell = size / COLS;
  const board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  let selected = null, solveTimer = null;

  // Optimal 20-soldier triangular formation.
  const tri = (row, start, end) => { for (let c = start; c <= end; c++) board[row][c] = 1; };
  tri(4, 3, 5);          //  3 pegs
  tri(5, 2, 6);          //  5 pegs
  tri(6, 1, 7);          //  7 pegs
  tri(7, 2, 6);          //  5 pegs

  // ── Beam-search solver ─────────────────────────────────
  let solvePath = null, solveBestRow = 99;

  function boardKey(b) {
    let k = "";
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) k += b[r][c] ? "1" : "0";
    return k;
  }

  function findAllJumps(b) {
    const jumps = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (b[r][c] !== 1) continue;
        for (const [dr, dc] of [[-2,0],[2,0],[0,-2],[0,2]]) {
          const nr = r + dr, nc = c + dc;
          const mr = r + dr / 2, mc = c + dc / 2;
          if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS &&
              b[nr][nc] === 0 && b[mr][mc] === 1) {
            jumps.push({ sr: r, sc: c, mr, mc, dr: nr, dc: nc });
          }
        }
      }
    }
    return jumps;
  }

  function highestPegRow(b) {
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++)
        if (b[r][c] === 1) return r;
    return ROWS;
  }

  function pegsAboveLine(b) {
    let n = 0;
    for (let r = 0; r <= 3; r++)
      for (let c = 0; c < COLS; c++)
        if (b[r][c] === 1) n++;
    return n;
  }

  // Conway potential: sum of φ^(-r) for each peg at row r
  // φ = golden ratio ≈ 1.618, rows below firing line get weight 1
  function boardPotential(b) {
    const phi = 1.61803398875;
    let p = 0;
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++)
        if (b[r][c] === 1) p += r <= 3 ? Math.pow(phi, -r) : 1;
    return p;
  }

  function beamSearch(b, beamWidth, maxDepth, timeLimitMs) {
    const startTime = Date.now();
    let bestRow = 99, bestPath = null;

    const startHash = boardKey(b);
    let states = [{ b: b.map(r => r.slice()), path: [], hash: startHash }];
    const visited = new Set([startHash]);

    for (let depth = 0; depth < maxDepth && states.length > 0; depth++) {
      if (Date.now() - startTime > timeLimitMs) break;

      const next = [];

      for (const st of states) {
        const jumps = findAllJumps(st.b);
        for (const j of jumps) {
          const nb = st.b.map(r => r.slice());
          nb[j.sr][j.sc] = 0;
          nb[j.mr][j.mc] = 0;
          nb[j.dr][j.dc] = 1;

          const hash = boardKey(nb);
          if (visited.has(hash)) continue;
          visited.add(hash);

          const hr = highestPegRow(nb);

          if (hr < bestRow) {
            bestRow = hr;
            bestPath = st.path.concat([j]);
            if (hr === 0) return { path: bestPath, row: 0 };
          }

          next.push({ b: nb, path: st.path.concat([j]), hash, hr });
        }
      }

      if (next.length === 0) break;

      // Score by (highest row, potential above line, center proximity, peg count above line)
      for (const s of next) {
        s.pot = boardPotential(s.b);
        s.above = pegsAboveLine(s.b);
        let dist = 0;
        for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++)
          if (s.b[r][c] === 1) dist += Math.abs(c - 4);
        s.dist = dist;
      }

      next.sort((a, b) => {
        if (a.hr !== b.hr) return a.hr - b.hr;
        if (a.above !== b.above) return b.above - a.above;
        if (Math.abs(a.pot - b.pot) > 0.001) return b.pot - a.pot;
        return a.dist - b.dist;
      });

      states = next.slice(0, beamWidth);
    }

    return { path: bestPath, row: bestRow };
  }

  // ── Random-restart solver ─────────────────────
  function randomRestartSolve(b, restarts, maxMoves) {
    let bestRow = 99, bestPath = null;
    for (let t = 0; t < restarts; t++) {
      const nb = b.map(r => r.slice());
      const path = [];
      for (let m = 0; m < maxMoves; m++) {
        const jumps = findAllJumps(nb);
        if (jumps.length === 0) break;
        // Score jumps by destination row (upward = better), pick from top 3 randomly
        jumps.sort((a, b2) => a.dr - b2.dr);
        const topK = Math.min(5, jumps.length);
        const idx = Math.floor(Math.random() * topK);
        const j = jumps[idx];
        nb[j.sr][j.sc] = 0; nb[j.mr][j.mc] = 0; nb[j.dr][j.dc] = 1;
        path.push(j);
      }
      for (let r = 0; r < ROWS; r++)
        for (let c = 0; c < COLS; c++)
          if (nb[r][c] === 1 && r < bestRow) {
            bestRow = r; bestPath = [...path];
            if (r === 0) return { path: bestPath, row: 0 };
            break;
          }
    }
    return { path: bestPath, row: bestRow };
  }

  function countPegs() {
    let n = 0;
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) if (board[r][c] === 1) n++;
    return n;
  }

  function getValidMoves(r, c) {
    const moves = [];
    for (const [dr, dc] of [[-2,0],[2,0],[0,-2],[0,2]]) {
      const nr = r + dr, nc = c + dc;
      const mr = r + dr / 2, mc = c + dc / 2;
      if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS &&
          board[nr][nc] === 0 && board[mr][mc] === 1) {
        moves.push([nr, nc]);
      }
    }
    return moves;
  }

  function highestRow() {
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) if (board[r][c] === 1) return r;
    return ROWS;
  }

  function draw() {
    ctx.clearRect(0, 0, size, size);

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const x = c * cell, y = r * cell;
        ctx.fillStyle = "#ccc";
        ctx.fillRect(x, y, cell, cell);
        ctx.strokeStyle = "#888";
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x, y, cell, cell);

        if (board[r][c] === 1) {
          const cx = x + cell / 2, cy = y + cell / 2;
          ctx.beginPath();
          ctx.arc(cx, cy, cell * 0.35, 0, Math.PI * 2);
          ctx.fillStyle = selected && selected[0] === r && selected[1] === c ? "#eb0" : "#e66";
          ctx.fill();
          ctx.strokeStyle = "#333";
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }
    }

    // Valid move targets
    if (selected) {
      const targets = getValidMoves(selected[0], selected[1]);
      for (const [tr, tc] of targets) {
        const tx = tc * cell + cell / 2, ty = tr * cell + cell / 2;
        ctx.beginPath();
        ctx.arc(tx, ty, cell * 0.15, 0, Math.PI * 2);
        ctx.fillStyle = "#4a4";
        ctx.fill();
      }
    }

    // Firing line between row 3 and 4
    const lineY = 4 * cell;
    ctx.strokeStyle = "#e66";
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(0, lineY);
    ctx.lineTo(size, lineY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#e66";
    ctx.font = "10px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText("firing line", size - 4, lineY - 3);

    const hRow = highestRow();
    const pegs = countPegs();
    statusEl.textContent = pegs === 0 ? "no pegs!" : `topmost peg: row ${hRow} (0=top, ${pegs} peg${pegs > 1 ? "s" : ""})`;
  }

  function handleClick(e) {
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (size / rect.width);
    const my = (e.clientY - rect.top) * (size / rect.height);
    const c = Math.floor(mx / cell);
    const r = Math.floor(my / cell);
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return;

    if (selected === null) {
      if (board[r][c] === 1) selected = [r, c];
    } else {
      const [sr, sc] = selected;
      if (board[r][c] === 1) {
        selected = (r === sr && c === sc) ? null : [r, c];
      } else if (board[r][c] === 0) {
        const dr = r - sr, dc = c - sc;
        if ((Math.abs(dr) === 2 && dc === 0) || (Math.abs(dc) === 2 && dr === 0)) {
          const mr = sr + dr / 2, mc = sc + dc / 2;
          if (board[mr][mc] === 1) {
            board[sr][sc] = 0;
            board[mr][mc] = 0;
            board[r][c] = 1;
          }
        }
        selected = null;
      } else {
        selected = null;
      }
    }
    draw();
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
      for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) board[r][c] = 0;
      tri(4, 3, 5);
      tri(5, 2, 6);
      tri(6, 1, 7);
      tri(7, 2, 6);
      selected = null;
      draw();
    },
    solve() {
      if (solveTimer) return;
      statusEl.textContent = "solving… (beam search)";
      draw();
      const copy = board.map(r => r.slice());
      solvePath = null;
      solveBestRow = 99;

      // Phase 1: beam search with increasing width
      const deadlines = [
        { beam: 500, depth: 25, time: 3000 },
        { beam: 2000, depth: 30, time: 5000 },
      ];
      for (const { beam, depth, time } of deadlines) {
        const result = beamSearch(copy, beam, depth, time);
        if (result.row < solveBestRow) {
          solveBestRow = result.row;
          solvePath = result.path;
          if (solveBestRow === 0) break;
        }
      }

      // Phase 2: random-restart search for deeper exploration
      if (solveBestRow > 0) {
        statusEl.textContent = "solving… (random restart)";
        draw();
        const result = randomRestartSolve(copy, 20000, 30);
        if (result.row < solveBestRow) {
          solveBestRow = result.row;
          solvePath = result.path;
        }
      }

      if (!solvePath || solvePath.length === 0) {
        draw();
        statusEl.textContent = "no solution found (theoretical max is row 0)";
        return;
      }
      selected = null;
      draw();
      let i = 0;
      solveTimer = setInterval(() => {
        if (i >= solvePath.length) {
          clearInterval(solveTimer);
          solveTimer = null;
          draw();
          statusEl.textContent = `topmost peg: row ${highestRow()} (theoretical max is row 0)`;
          return;
        }
        const j = solvePath[i];
        board[j.sr][j.sc] = 0;
        board[j.mr][j.mc] = 0;
        board[j.dr][j.dc] = 1;
        draw();
        i++;
      }, 200);
    }
  };
}
