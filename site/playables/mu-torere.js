// Mū tōrere — 8-pointed star with center. Each player has 4 pieces on
// adjacent outer points. Slide to adjacent empty point; moving into the
// center requires at least one neighbor to be an enemy piece. No-move = lose.
// With perfect play the game is a draw. AI uses memoized minimax.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 360);
  canvas.width = size;
  canvas.height = size;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) {
    const w = canvas.width, h = canvas.height;
    canvas.style.width = w + 'px';    canvas.width = w * dpr; canvas.height = h * dpr; ctx.scale(dpr, dpr);
  }
  const statusEl = document.getElementById("playable-status");

  // Cells 0..7 = outer points (in order), 8 = center.
  // Adjacency: outer i <-> outer (i±1)%8, outer i <-> center 8.
  const ADJ = (() => {
    const a = Array.from({ length: 9 }, () => []);
    for (let i = 0; i < 8; i++) {
      a[i].push((i + 1) % 8, (i + 7) % 8, 8);
      a[8].push(i);
    }
    return a;
  })();

  // board: 9 cells, values 'W' (you), 'B' (ai), or null
  let board, turn, winner, selected, history, __solveCount;
  function newGame() {
    board = Array(9).fill(null);
    // W on points 0..3, B on points 4..7, center empty.
    for (let i = 0; i < 4; i++) board[i] = "W";
    for (let i = 4; i < 8; i++) board[i] = "B";
    turn = "W"; winner = null; selected = null; __solveCount = 0;
    history = new Set();
    history.add(key(board, turn));
  }
  newGame();

  function key(b, t) { return b.map(v => v || ".").join("") + t; }

  function legalMoves(b, side) {
    const moves = [];
    for (let i = 0; i < 9; i++) {
      if (b[i] !== side) continue;
      for (const j of ADJ[i]) {
        if (b[j] !== null) continue;
        // moving into center requires a neighbor of source to be enemy
        if (j === 8) {
          const neighbors = ADJ[i].filter(x => x !== 8);
          if (!neighbors.some(n => b[n] && b[n] !== side)) continue;
        }
        moves.push({ from: i, to: j });
      }
    }
    return moves;
  }

  function apply(b, m) { const nb = b.slice(); nb[m.to] = nb[m.from]; nb[m.from] = null; return nb; }

  // Minimax with memoization + draw cap to handle cycles
  const memo = new Map();
  function score(b, side, depth) {
    if (depth > 30) return 0; // draw by repetition
    const k = key(b, side) + depth;
    if (memo.has(k)) return memo.get(k);
    const moves = legalMoves(b, side);
    if (moves.length === 0) {
      const v = side === "W" ? -1 : 1; // current player loses
      memo.set(k, v); return v;
    }
    let best = side === "W" ? -Infinity : Infinity;
    for (const m of moves) {
      const s = score(apply(b, m), side === "W" ? "B" : "W", depth + 1);
      best = side === "W" ? Math.max(best, s) : Math.min(best, s);
      if (side === "W" && best === 1) break;
      if (side === "B" && best === -1) break;
    }
    memo.set(k, best); return best;
  }

  function bestMove(side) {
    const moves = legalMoves(board, side);
    if (moves.length === 0) return null;
    let best = moves[0];
    let bestS = side === "W" ? -Infinity : Infinity;
    for (const m of moves) {
      const s = score(apply(board, m), side === "W" ? "B" : "W", 0);
      if ((side === "W" && s > bestS) || (side === "B" && s < bestS)) { bestS = s; best = m; }
    }
    return best;
  }

  function cellPos(i) {
    const cx = size / 2, cy = size / 2;
    if (i === 8) return { x: cx, y: cy };
    const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
    const R = size * 0.35;
    return { x: cx + Math.cos(angle) * R, y: cy + Math.sin(angle) * R };
  }

  function draw() {
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, size, size);

    // edges
    ctx.strokeStyle = "#aaa"; ctx.lineWidth = 2;
    for (let i = 0; i < 8; i++) {
      const a = cellPos(i), b = cellPos((i + 1) % 8);
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      const c = cellPos(8);
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(c.x, c.y); ctx.stroke();
    }

    // pieces
    for (let i = 0; i < 9; i++) {
      const p = cellPos(i);
      ctx.beginPath(); ctx.arc(p.x, p.y, size * 0.06, 0, Math.PI * 2);
      ctx.fillStyle = board[i] === "W" ? "#f8f4e8" : board[i] === "B" ? "#1a1a1a" : "#e8e4d4";
      ctx.fill();
      ctx.strokeStyle = "#222"; ctx.lineWidth = 2; ctx.stroke();
    }

    if (selected !== null) {
      const p = cellPos(selected);
      ctx.beginPath(); ctx.arc(p.x, p.y, size * 0.075, 0, Math.PI * 2);
      ctx.strokeStyle = "#dc8"; ctx.lineWidth = 3; ctx.stroke();
      const moves = legalMoves(board, "W").filter(m => m.from === selected);
      for (const m of moves) {
        const q = cellPos(m.to);
        ctx.beginPath(); ctx.arc(q.x, q.y, size * 0.025, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(60,150,60,0.7)"; ctx.fill();
      }
    }

    if (winner) statusEl.textContent = winner === "W" ? "you win!" : "AI wins";
    else statusEl.textContent = turn === "W" ? "your turn — click a piece" : "AI thinking…";
  }

  function clickPos(e) {
    const r = canvas.getBoundingClientRect();
    return { x: (e.clientX - r.left) * (size / r.width), y: (e.clientY - r.top) * (size / r.height) };
  }

  function findCell(x, y) {
    for (let i = 0; i < 9; i++) {
      const p = cellPos(i);
      if ((x - p.x) ** 2 + (y - p.y) ** 2 <= (size * 0.075) ** 2) return i;
    }
    return -1;
  }

  function endIfStuck() {
    const moves = legalMoves(board, turn);
    if (moves.length === 0) { winner = turn === "W" ? "B" : "W"; return true; }
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
    const c = findCell(x, y);
    if (c < 0) return;
    if (board[c] === "W") { selected = c; draw(); return; }
    if (selected === null) return;
    const moves = legalMoves(board, "W").filter(m => m.from === selected);
    const m = moves.find(mm => mm.to === c);
    if (!m) return;
    board = apply(board, m); selected = null; turn = "B";
    if (endIfStuck()) { draw(); return; }
    draw();
    setTimeout(doAi, 400);
  }

  canvas.addEventListener("click", onClick);
  draw();

  return {
    destroy() { canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, size, size); memo.clear(); },
    restart() { newGame(); draw(); },
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
