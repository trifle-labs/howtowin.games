// Hexapawn — 3x3 pawns; chess pawn rules. Win by reaching opposite rank,
// capturing all opponent pawns, or leaving opponent with no legal move.
// Strongly solved: second player has a winning strategy in 3x3.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 320);
  canvas.width = size;
  canvas.height = size;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) {
    const w = canvas.width, h = canvas.height;
    canvas.style.width = w + 'px';    canvas.width = w * dpr; canvas.height = h * dpr; ctx.scale(dpr, dpr);
  }
  const cell = size / 3;
  const statusEl = document.getElementById("playable-status");

  // board: 3x3, row 0 = top. "W" = white pawn moves up (toward row 0), "B" = black pawn moves down.
  // You play white (bottom). AI plays black.
  let board, turn, winner, selected;

  function newGame() {
    board = [
      ["B", "B", "B"],
      [null, null, null],
      ["W", "W", "W"],
    ];
    turn = "W";
    winner = null;
    selected = null;
  }
  newGame();

  function clone(b) { return b.map(r => r.slice()); }
  function dir(p) { return p === "W" ? -1 : 1; }
  function enemy(p) { return p === "W" ? "B" : "W"; }

  function legalMoves(b, side) {
    const moves = [];
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
      if (b[r][c] !== side) continue;
      const d = dir(side);
      const nr = r + d;
      if (nr < 0 || nr > 2) continue;
      // forward to empty
      if (b[nr][c] === null) moves.push({ fr: r, fc: c, tr: nr, tc: c });
      // diagonal capture
      for (const dc of [-1, 1]) {
        const nc = c + dc;
        if (nc < 0 || nc > 2) continue;
        if (b[nr][nc] === enemy(side)) moves.push({ fr: r, fc: c, tr: nr, tc: nc });
      }
    }
    return moves;
  }

  function terminalScore(b, sideToMove) {
    // Win conditions: a pawn reached far side, or opponent has no pieces, or sideToMove has no moves
    for (let c = 0; c < 3; c++) {
      if (b[0][c] === "W") return { winner: "W" };
      if (b[2][c] === "B") return { winner: "B" };
    }
    const whiteCount = b.flat().filter(x => x === "W").length;
    const blackCount = b.flat().filter(x => x === "B").length;
    if (whiteCount === 0) return { winner: "B" };
    if (blackCount === 0) return { winner: "W" };
    const moves = legalMoves(b, sideToMove);
    if (moves.length === 0) return { winner: enemy(sideToMove) };
    return null;
  }

  function applyMove(b, m) {
    const nb = clone(b);
    nb[m.tr][m.tc] = nb[m.fr][m.fc];
    nb[m.fr][m.fc] = null;
    return nb;
  }

  // minimax: returns +1 if W wins, -1 if B wins, with perfect play
  const memo = new Map();
  function key(b, side) { return b.flat().map(v => v || ".").join("") + side; }
  function minimax(b, sideToMove) {
    const k = key(b, sideToMove);
    if (memo.has(k)) return memo.get(k);
    const t = terminalScore(b, sideToMove);
    if (t) { const v = t.winner === "W" ? 1 : -1; memo.set(k, v); return v; }
    const moves = legalMoves(b, sideToMove);
    let best = sideToMove === "W" ? -Infinity : Infinity;
    for (const m of moves) {
      const score = minimax(applyMove(b, m), enemy(sideToMove));
      best = sideToMove === "W" ? Math.max(best, score) : Math.min(best, score);
    }
    memo.set(k, best);
    return best;
  }

  function bestMoveFor(side) {
    const moves = legalMoves(board, side);
    if (moves.length === 0) return null;
    let bestScore = side === "W" ? -Infinity : Infinity;
    let best = moves[0];
    for (const m of moves) {
      const s = minimax(applyMove(board, m), enemy(side));
      if (side === "W" ? s > bestScore : s < bestScore) { bestScore = s; best = m; }
    }
    return best;
  }

  function draw() {
    ctx.fillStyle = "#fafaf7";
    ctx.fillRect(0, 0, size, size);
    // squares
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
      ctx.fillStyle = (r + c) % 2 === 0 ? "#e8e4d4" : "#9d8e6e";
      ctx.fillRect(c * cell, r * cell, cell, cell);
    }
    // selection highlight
    if (selected) {
      ctx.fillStyle = "rgba(255,220,90,0.45)";
      ctx.fillRect(selected.c * cell, selected.r * cell, cell, cell);
      // move targets
      const moves = legalMoves(board, "W").filter(m => m.fr === selected.r && m.fc === selected.c);
      for (const m of moves) {
        ctx.beginPath();
        ctx.arc(m.tc * cell + cell / 2, m.tr * cell + cell / 2, cell * 0.15, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(60,150,60,0.65)";
        ctx.fill();
      }
    }
    // pawns
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
      const p = board[r][c];
      if (!p) continue;
      const cx = c * cell + cell / 2;
      const cy = r * cell + cell / 2;
      ctx.beginPath();
      ctx.arc(cx, cy, cell * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = p === "W" ? "#f8f4e8" : "#1a1a1a";
      ctx.fill();
      ctx.strokeStyle = "#000"; ctx.lineWidth = 2; ctx.stroke();
    }

    if (winner) statusEl.textContent = winner === "W" ? "you win!" : "AI wins";
    else statusEl.textContent = turn === "W" ? "your turn — click a pawn" : "AI thinking…";
  }

  function clickPos(e) {
    const r = canvas.getBoundingClientRect();
    const x = (e.clientX - r.left) * (size / r.width);
    const y = (e.clientY - r.top) * (size / r.height);
    return { r: Math.floor(y / cell), c: Math.floor(x / cell) };
  }

  function checkEnd() {
    const t = terminalScore(board, turn);
    if (t) { winner = t.winner; return true; }
    return false;
  }

  function doAi() {
    if (winner) return;
    const m = bestMoveFor("B");
    if (!m) { winner = "W"; draw(); return; }
    board = applyMove(board, m);
    turn = "W";
    if (!checkEnd()) {/* keep going */}
    draw();
  }

  function onClick(e) {
    if (winner || turn !== "W") return;
    const { r, c } = clickPos(e);
    if (r < 0 || r > 2 || c < 0 || c > 2) return;
    if (board[r][c] === "W") { selected = { r, c }; draw(); return; }
    if (!selected) return;
    const moves = legalMoves(board, "W").filter(m => m.fr === selected.r && m.fc === selected.c);
    const m = moves.find(mm => mm.tr === r && mm.tc === c);
    if (!m) return;
    board = applyMove(board, m);
    selected = null;
    turn = "B";
    if (!checkEnd()) { draw(); setTimeout(doAi, 400); }
    else draw();
  }

  canvas.addEventListener("click", onClick);
  draw();

  return {
    destroy() { canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, size, size); },
    restart() { newGame(); draw(); },
    solve() {
      if (winner || turn !== "W") return;
      const m = bestMoveFor("W");
      if (!m) return;
      board = applyMove(board, m);
      selected = null;
      turn = "B";
      if (!checkEnd()) { draw(); setTimeout(doAi, 600); }
      else draw();
    },
  };
}
