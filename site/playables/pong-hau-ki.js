// Pong hau k'i — 5-point board: square (0–3) with diagonal (0–3, 1–2) + apex (4).
// Each player has 2 pieces; 1 empty. Slide a piece along a line into the empty
// point. A player who cannot move loses. Strongly solved: draw with perfect play.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 340);
  canvas.width = size;
  canvas.height = size;
  const statusEl = document.getElementById("playable-status");

  // Points: 0 top-left, 1 top-right, 2 bottom-right, 3 bottom-left, 4 apex (top).
  // Edges: square + one diagonal (0–2) + apex connects to 0 and 1.
  const ADJ = [
    [1, 3, 2, 4], // 0
    [0, 2, 4],    // 1
    [0, 1, 3],    // 2 (connects to 0 via diagonal)
    [0, 2],       // 3
    [0, 1],       // 4 apex
  ];

  let board, turn, winner, selected, history, __solveCount;
  function newGame() {
    // Initial: W on 0,3 (left side); B on 1,2 (right side); 4 empty.
    board = ["W","B","B","W",null];
    turn = "W"; winner = null; selected = null; __solveCount = 0;
    history = new Map();
    history.set(key(board, turn), 1);
  }
  newGame();

  function key(b, t) { return b.map(v => v || ".").join("") + t; }

  function legalMoves(b, side) {
    const moves = [];
    for (let i = 0; i < 5; i++) if (b[i] === side) for (const j of ADJ[i]) if (b[j] === null) moves.push({from:i, to:j});
    return moves;
  }

  function apply(b, m) { const nb = b.slice(); nb[m.to] = nb[m.from]; nb[m.from] = null; return nb; }

  const memo = new Map();
  function scoreFn(b, side, depth) {
    if (depth > 18) return 0; // draw cap (cycles)
    const moves = legalMoves(b, side);
    if (moves.length === 0) return side === "W" ? -1 : 1;
    const k = key(b, side) + depth;
    if (memo.has(k)) return memo.get(k);
    let best = side === "W" ? -Infinity : Infinity;
    for (const m of moves) {
      const s = scoreFn(apply(b, m), side === "W" ? "B" : "W", depth + 1);
      best = side === "W" ? Math.max(best, s) : Math.min(best, s);
      if (side === "W" && best === 1) break;
      if (side === "B" && best === -1) break;
    }
    memo.set(k, best); return best;
  }

  function bestMove(side) {
    const moves = legalMoves(board, side);
    if (!moves.length) return null;
    // Prefer non-suicide moves
    let best = moves[0], bestS = side === "W" ? -Infinity : Infinity;
    for (const m of moves) {
      const s = scoreFn(apply(board, m), side === "W" ? "B" : "W", 0);
      if ((side === "W" && s > bestS) || (side === "B" && s < bestS)) { bestS = s; best = m; }
    }
    return best;
  }

  function ptPos(i) {
    const cx = size/2, cy = size*0.55;
    const r = size * 0.32;
    const positions = [
      { x: cx - r, y: cy - r*0.6 }, // 0 top-left
      { x: cx + r, y: cy - r*0.6 }, // 1 top-right
      { x: cx + r, y: cy + r*0.6 }, // 2 bottom-right
      { x: cx - r, y: cy + r*0.6 }, // 3 bottom-left
      { x: cx,     y: cy - r*1.3 }, // 4 apex
    ];
    return positions[i];
  }

  function drawBoard() {
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0,0,size,size);
    ctx.strokeStyle = "#aaa"; ctx.lineWidth = 2;
    const drawn = new Set();
    for (let i = 0; i < 5; i++) for (const j of ADJ[i]) {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (drawn.has(key)) continue;
      drawn.add(key);
      const a = ptPos(i), b = ptPos(j);
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    }
    if (selected !== null) {
      const p = ptPos(selected);
      ctx.beginPath(); ctx.arc(p.x, p.y, size*0.075, 0, Math.PI*2);
      ctx.strokeStyle = "#dc8"; ctx.lineWidth = 3; ctx.stroke();
      for (const m of legalMoves(board, "W").filter(mm => mm.from === selected)) {
        const q = ptPos(m.to);
        ctx.beginPath(); ctx.arc(q.x, q.y, size*0.025, 0, Math.PI*2);
        ctx.fillStyle = "rgba(60,150,60,0.7)"; ctx.fill();
      }
    }
    for (let i = 0; i < 5; i++) {
      const p = ptPos(i);
      ctx.beginPath(); ctx.arc(p.x, p.y, size*0.06, 0, Math.PI*2);
      ctx.fillStyle = board[i] === "W" ? "#f8f4e8" : board[i] === "B" ? "#1a1a1a" : "#e8e4d4";
      ctx.fill();
      ctx.strokeStyle = "#000"; ctx.lineWidth = 2; ctx.stroke();
    }

    if (winner) statusEl.textContent = `${winner === "W" ? "you" : "AI"} wins!`;
    else statusEl.textContent = turn === "W" ? "your turn — click your piece" : "AI thinking…";
  }
  const draw = drawBoard;

  function clickPos(e) {
    const r = canvas.getBoundingClientRect();
    return { x: (e.clientX - r.left) * (size / r.width), y: (e.clientY - r.top) * (size / r.height) };
  }

  function findPoint(x, y) {
    for (let i = 0; i < 5; i++) {
      const p = ptPos(i);
      if ((x - p.x) ** 2 + (y - p.y) ** 2 <= (size*0.075)**2) return i;
    }
    return -1;
  }

  function endIfStuck() {
    if (legalMoves(board, turn).length === 0) { winner = turn === "W" ? "B" : "W"; return true; }
    return false;
  }

  function doAi() {
    if (winner) return;
    const m = bestMove("B");
    if (!m) { winner = "W"; draw(); return; }
    board = apply(board, m); turn = "W";
    if (endIfStuck()) { draw(); return; }
    draw();
  }

  function onClick(e) {
    if (winner || turn !== "W") return;
    const { x, y } = clickPos(e);
    const i = findPoint(x, y);
    if (i < 0) return;
    if (board[i] === "W") { selected = i; draw(); return; }
    if (selected === null) return;
    const ms = legalMoves(board, "W").filter(mm => mm.from === selected && mm.to === i);
    if (!ms.length) return;
    board = apply(board, ms[0]); selected = null; turn = "B";
    if (endIfStuck()) { draw(); return; }
    draw(); setTimeout(doAi, 400);
  }

  canvas.addEventListener("click", onClick);
  draw();

  return {
    destroy() { canvas.removeEventListener("click", onClick); ctx.clearRect(0,0,size,size); memo.clear(); },
    restart() { newGame(); memo.clear(); draw(); },
    solve() {
      if (winner) return;
      __solveCount++;
      if (__solveCount > 40) {
        winner = "draw";
        statusEl.textContent = "draw — game length capped";
        return;
      }
      if (turn !== "W") return;
      const m = bestMove("W");
      if (!m) { winner = "B"; draw(); return; }
      board = apply(board, m); selected = null; turn = "B";
      if (endIfStuck()) { draw(); return; }
      draw();
      // Run AI synchronously so next solve() click finds turn==="W"
      doAi();
    },
  };
}
