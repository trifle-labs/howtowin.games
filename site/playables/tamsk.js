// TAMSK — simplified: 3-in-a-row on a hex board (side 3, 19 cells). Two players
// alternate placing pieces. First to get 3 in a straight line along any of the 3
// hex axes wins. If the board fills, it's a draw.
// The original timer mechanic is replaced with pure placement.
// AI: heuristic — score each empty cell by own/opponent line potential.

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = size + 30;
  const W = canvas.width, H = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) { canvas.style.width = W + 'px'; canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr); }
  const statusEl = document.getElementById("playable-status");

  // Generate hex cells (axial coords) for side 3
  const S = 3;
  const CELLS = [];
  for (let q = -(S-1); q <= S-1; q++) for (let r = -(S-1); r <= S-1; r++) if (Math.abs(q + r) <= S-1) CELLS.push([q, r]);
  const idx = (q, r) => CELLS.findIndex(c => c[0] === q && c[1] === r);
  const NEI = CELLS.map(([q, r]) => {
    const out = [];
    for (const [dq, dr] of [[1,0],[-1,0],[0,1],[0,-1],[1,-1],[-1,1]]) { const i = idx(q+dq, r+dr); if (i >= 0) out.push(i); }
    return out;
  });
  // 3 hex axes — lines run along (1,0), (0,1), (1,-1)
  const AXES = [[1,0],[0,1],[1,-1]];

  let board, turn, winner;
  function newGame() { board = new Array(CELLS.length).fill('.'); turn = "you"; winner = null; }
  newGame();

  // Check if player 'ch' has 3+ in a row along any hex axis
  function checkWin(b, ch) {
    for (let i = 0; i < b.length; i++) {
      if (b[i] !== ch) continue;
      const [q, r] = CELLS[i];
      for (const [dq, dr] of AXES) {
        let cnt = 1;
        for (const sign of [-1, 1]) {
          for (let step = 1; step < 3; step++) {
            const ni = idx(q + dq*step*sign, r + dr*step*sign);
            if (ni === -1 || b[ni] !== ch) break;
            cnt++;
          }
        }
        if (cnt >= 3) return true;
      }
    }
    return false;
  }

  function aiMove() {
    if (winner) return;
    const empty = []; for (let i = 0; i < CELLS.length; i++) if (board[i] === '.') empty.push(i);
    if (!empty.length) { winner = "draw"; draw(); return; }

    // Immediate win
    for (const i of empty) { board[i] = 'W'; if (checkWin(board, 'W')) { draw(); winner = "ai"; return; } board[i] = '.'; }

    // Block opponent win
    for (const i of empty) { board[i] = 'B'; if (checkWin(board, 'B')) { board[i] = 'W'; draw(); winner = "ai"; return; } board[i] = '.'; }

    // Score remaining cells by line potential
    let best = empty[0], bestScore = -Infinity;
    for (const i of empty) {
      let score = 0;
      const [q, r] = CELLS[i];
      for (const [dq, dr] of AXES) {
        // Count own (W) pieces in line through i (no opponent breaks)
        let own = 1;
        for (const sign of [-1, 1]) {
          for (let step = 1; step < 3; step++) {
            const ni = idx(q + dq*step*sign, r + dr*step*sign);
            if (ni === -1 || board[ni] !== 'W') break;
            own++;
          }
        }
        // Count opponent (B) pieces in line through i
        let opp = 1;
        for (const sign of [-1, 1]) {
          for (let step = 1; step < 3; step++) {
            const ni = idx(q + dq*step*sign, r + dr*step*sign);
            if (ni === -1 || board[ni] !== 'B') break;
            opp++;
          }
        }
        score += own * 10 + opp * 8;
      }
      if (q === 0 && r === 0) score += 5; // center bias
      if (score > bestScore) { bestScore = score; best = i; }
    }

    board[best] = 'W';
    if (checkWin(board, 'W')) { winner = "ai"; draw(); return; }
    if (!board.includes('.')) { winner = "draw"; draw(); return; }
    turn = "you"; draw();
  }

  const HR = size / 10;
  function hexCenter(q, r) {
    const cx = W/2, cy = 30 + (size - 30)/2;
    return { x: cx + 1.5 * HR * q, y: cy + Math.sqrt(3) * HR * (r + q/2), r: HR };
  }
  function drawHex(cx, cy, r) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; const px = cx + r * Math.cos(a), py = cy + r * Math.sin(a); if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py); }
    ctx.closePath();
  }

  function draw() {
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < CELLS.length; i++) {
      const [q, r] = CELLS[i]; const c = hexCenter(q, r);
      drawHex(c.x, c.y, c.r);
      ctx.fillStyle = board[i] === 'B' ? "#39c" : board[i] === 'W' ? "#e60" : "#fff";
      ctx.fill();
      ctx.strokeStyle = "#222"; ctx.stroke();
    }
    if (winner) statusEl.textContent = winner === "draw" ? "draw!" : winner === "you" ? "you win! (3 in a row)" : "AI wins";
    else statusEl.textContent = turn === "you" ? "click an empty hex to place" : "AI thinking...";
  }

  function pos(e) { const r = canvas.getBoundingClientRect(); return { x: (e.clientX - r.left) * (W / r.width), y: (e.clientY - r.top) * (H / r.height) }; }

  function onClick(e) {
    if (winner || turn !== "you") return;
    const { x, y } = pos(e);
    for (let i = 0; i < CELLS.length; i++) {
      const [q, r] = CELLS[i]; const c = hexCenter(q, r);
      if (Math.hypot(x - c.x, y - c.y) < c.r * 0.6 && board[i] === '.') {
        board[i] = 'B';
        if (checkWin(board, 'B')) { winner = "you"; draw(); return; }
        if (!board.includes('.')) { winner = "draw"; draw(); return; }
        turn = "ai"; draw(); setTimeout(aiMove, 350); return;
      }
    }
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve() {
      if (winner || turn !== "you") return;
      const __empty = []; for (let i = 0; i < CELLS.length; i++) if (board[i] === '.') __empty.push(i);
      if (!__empty.length) { winner = "draw"; draw(); return; }
      const __i = __empty[Math.floor(Math.random() * __empty.length)];
      board[__i] = 'B';
      if (checkWin(board, 'B')) { winner = "you"; draw(); return; }
      if (!board.includes('.')) { winner = "draw"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 80);
    },
    destroy() { canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart() { newGame(); draw(); },
  };
}
