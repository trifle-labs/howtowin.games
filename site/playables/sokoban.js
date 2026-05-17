// Sokoban — playable canvas implementation
// ~120 lines, arrow keys to push boxes onto targets.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 340);
  canvas.width = size;
  canvas.height = size;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) {
    const w = canvas.width, h = canvas.height;
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    canvas.width = w * dpr; canvas.height = h * dpr; ctx.scale(dpr, dpr);
  }

  const statusEl = document.getElementById("playable-status");

  // Simple level: #=wall, .=target, $=box, @=player, *=box on target, +=player on target
  const level = [
    "#####",
    "#  .#",
    "# $ #",
    "# @ #",
    "#####"
  ];

  let rows = level.length, cols = level[0].length;
  let cell, board, playerR, playerC, targets, won, moves;

  function reset() {
    rows = level.length; cols = level[0].length;
    cell = size / cols;
    board = [];
    targets = [];
    for (let r = 0; r < rows; r++) {
      board[r] = [];
      for (let c = 0; c < cols; c++) {
        const ch = level[r][c];
        board[r][c] = ch === "#" ? -1 : 0;
        if (ch === "." || ch === "+" || ch === "*") targets.push(r * cols + c);
        if (ch === "$" || ch === "*") board[r][c] = 2; // box
        if (ch === "@" || ch === "+") { playerR = r; playerC = c; }
      }
    }
    won = false; moves = 0;
  }
  reset();

  function allBoxesOnTargets() {
    for (const t of targets) {
      const r = Math.floor(t / cols), c = t % cols;
      if (board[r][c] !== 2) return false;
    }
    return true;
  }

  function draw() {
    ctx.clearRect(0, 0, size, size);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * cell, y = r * cell;
        if (board[r][c] === -1) {
          ctx.fillStyle = "#444";
          ctx.fillRect(x, y, cell, cell);
        } else {
          ctx.fillStyle = "#eee";
          ctx.fillRect(x, y, cell, cell);
        }
        ctx.strokeStyle = "#ccc";
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x, y, cell, cell);
      }
    }
    // Targets
    for (const t of targets) {
      const r = Math.floor(t / cols), c = t % cols;
      ctx.fillStyle = "#4a4";
      ctx.beginPath();
      ctx.arc(c * cell + cell / 2, r * cell + cell / 2, cell * 0.15, 0, Math.PI * 2);
      ctx.fill();
    }
    // Boxes
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (board[r][c] === 2) {
          ctx.fillStyle = "#e66";
          ctx.fillRect(c * cell + 3, r * cell + 3, cell - 6, cell - 6);
          ctx.strokeStyle = "#a44";
          ctx.lineWidth = 1.5;
          ctx.strokeRect(c * cell + 3, r * cell + 3, cell - 6, cell - 6);
        }
      }
    }
    // Player
    ctx.fillStyle = "#48a";
    ctx.beginPath();
    ctx.arc(playerC * cell + cell / 2, playerR * cell + cell / 2, cell * 0.35, 0, Math.PI * 2);
    ctx.fill();

    statusEl.textContent = won ? `solved in ${moves} moves!` : `moves: ${moves}`;
  }

  function move(dr, dc) {
    if (won) return;
    const nr = playerR + dr, nc = playerC + dc;
    if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) return;
    if (board[nr][nc] === -1) return;
    if (board[nr][nc] === 2) {
      const br = nr + dr, bc = nc + dc;
      if (br < 0 || br >= rows || bc < 0 || bc >= cols) return;
      if (board[br][bc] !== 0) return;
      board[nr][nc] = 0;
      board[br][bc] = 2;
    }
    playerR = nr; playerC = nc;
    moves++;
    if (allBoxesOnTargets()) won = true;
    draw();
  }

  function handleKey(e) {
    switch (e.key) {
      case "ArrowUp": e.preventDefault(); move(-1, 0); break;
      case "ArrowDown": e.preventDefault(); move(1, 0); break;
      case "ArrowLeft": e.preventDefault(); move(0, -1); break;
      case "ArrowRight": e.preventDefault(); move(0, 1); break;
    }
  }

  // ── BFS solver ───────────────────────────────────────────
  let solveTimer = null, solvePath = [];

  function stateKey(b, pr, pc) {
    let k = pr + "," + pc;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) if (b[r][c] === 2) k += "," + r + "," + c;
    return k;
  }

  function bfsSolve(b, pr, pc) {
    const startKey = stateKey(b, pr, pc);
    parent.clear();
    parent.set(startKey, null);
    const queue = [startKey];
    let qIdx = 0;
    while (qIdx < queue.length && qIdx < 200000) {
      const cur = queue[qIdx++];
      // Decode state
      const parts = cur.split(",").map(Number);
      const cr = parts[0], cc = parts[1];
      const boxes = new Set();
      for (let i = 2; i < parts.length; i += 2) boxes.add(parts[i] * cols + parts[i + 1]);
      // Check solved
      let solved = true;
      for (const t of targets) if (!boxes.has(t)) { solved = false; break; }
      if (solved) { return cur; }
      for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
        const nr = cr + dr, nc = cc + dc;
        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
        if (b[nr][nc] === -1) continue;
        const ni = nr * cols + nc;
        if (boxes.has(ni)) {
          // Push box
          const br = nr + dr, bc = nc + dc;
          if (br < 0 || br >= rows || bc < 0 || bc >= cols) continue;
          if (b[br][bc] === -1) continue;
          if (boxes.has(br * cols + bc)) continue;
          // New boxes set
          const newBoxes = new Set(boxes);
          newBoxes.delete(ni);
          newBoxes.add(br * cols + bc);
          const sortedBoxes = [...newBoxes].sort((a, b) => a - b);
          let nk = nr + "," + nc;
          for (const bv of sortedBoxes) nk += "," + Math.floor(bv / cols) + "," + (bv % cols);
          if (!parent.has(nk)) {
            parent.set(nk, { from: cur, dr, dc });
            queue.push(nk);
          }
        } else {
          const nk = nr + "," + nc;
          const parts = cur.split(",");
          const rest = "," + parts.slice(2).join(",");
          const fk = nk + rest;
          if (!parent.has(fk)) {
            parent.set(fk, { from: cur, dr, dc });
            queue.push(fk);
          }
        }
      }
    }
    return null;
  }

  function reconstructPath(endKey) {
    const seq = [];
    let cur = endKey;
    while (parent.get(cur) !== null) {
      const entry = parent.get(cur);
      seq.unshift(entry);
      cur = entry.from;
    }
    return seq;
  }

  const parent = new Map();

  // Focus canvas for keyboard
  canvas.setAttribute("tabindex", "0");
  canvas.addEventListener("keydown", handleKey);
  // Click to focus
  canvas.addEventListener("click", () => canvas.focus());
  canvas.focus();
  draw();

  return {
    destroy() {
      canvas.removeEventListener("keydown", handleKey);
      if (solveTimer) { clearInterval(solveTimer); solveTimer = null; }
      canvas.removeAttribute("tabindex");
      ctx.clearRect(0, 0, size, size);
    },
    restart() {
      if (solveTimer) { clearInterval(solveTimer); solveTimer = null; }
      reset(); draw(); canvas.focus();
    },
    solve() {
      if (won || solveTimer) return;
      statusEl.textContent = "solving…";
      draw();
      setTimeout(() => {
        parent.clear();
        const endKey = bfsSolve(board, playerR, playerC);
        if (!endKey) { draw(); statusEl.textContent = "no solution found"; return; }
        const path = reconstructPath(endKey);
        if (path.length === 0) { draw(); statusEl.textContent = "already solved?"; return; }
        solvePath = path;
        let i = 0;
        solveTimer = setInterval(() => {
          if (i >= solvePath.length) {
            clearInterval(solveTimer);
            solveTimer = null;
            won = true;
            draw();
            return;
          }
          const step = solvePath[i++];
          move(step.dr, step.dc);
        }, 300);
      }, 50);
    }
  };
}
