// Three Men's Morris — 3x3 board with 8 lines (rows, cols, diagonals).
// Each player has 3 pieces. Placement phase first, then movement (slide
// to adjacent point along a line). Forming 3-in-a-row wins.
// Strongly solved: draw with perfect play.

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

  // 9 points (0..8) in row-major order.
  const LINES = [
    [0,1,2],[3,4,5],[6,7,8],   // rows
    [0,3,6],[1,4,7],[2,5,8],   // cols
    [0,4,8],[2,4,6],           // diagonals
  ];

  // Adjacency for the movement phase: union over LINES of immediate neighbors.
  const ADJ = (() => {
    const a = Array.from({length:9}, () => new Set());
    for (const L of LINES) {
      for (let i=0; i<L.length-1; i++) { a[L[i]].add(L[i+1]); a[L[i+1]].add(L[i]); }
    }
    return a.map(s => Array.from(s));
  })();

  let board, turn, winner, placed, selected;
  function newGame() {
    board = Array(9).fill(null);
    turn = "W"; winner = null; placed = { W:0, B:0 }; selected = null;
  }
  newGame();

  function won(b, side) {
    for (const L of LINES) if (L.every(i => b[i] === side)) return true;
    return false;
  }

  function legalMoves(b, side, placedSide) {
    const moves = [];
    if (placedSide < 3) {
      for (let i=0; i<9; i++) if (!b[i]) moves.push({type:'place', to:i});
    } else {
      for (let i=0; i<9; i++) if (b[i] === side) {
        for (const j of ADJ[i]) if (!b[j]) moves.push({type:'move', from:i, to:j});
      }
    }
    return moves;
  }

  function apply(b, m, side) {
    const nb = b.slice();
    if (m.type === 'place') nb[m.to] = side;
    else { nb[m.to] = nb[m.from]; nb[m.from] = null; }
    return nb;
  }

  // Memoized minimax (with draw cap on movement-phase cycles)
  const memo = new Map();
  function key(b, side, placedW, placedB, depth) {
    return b.map(v => v || ".").join("") + side + placedW + placedB + depth;
  }
  function score(b, side, placedW, placedB, depth) {
    if (won(b, "W")) return 1;
    if (won(b, "B")) return -1;
    if (depth > 16) return 0; // draw cap
    const k = key(b, side, placedW, placedB, depth);
    if (memo.has(k)) return memo.get(k);
    const placedSide = side === "W" ? placedW : placedB;
    const moves = legalMoves(b, side, placedSide);
    if (moves.length === 0) {
      const v = side === "W" ? -1 : 1;
      memo.set(k, v); return v;
    }
    let best = side === "W" ? -Infinity : Infinity;
    for (const m of moves) {
      const nb = apply(b, m, side);
      const nW = placedW + (side === "W" && m.type === 'place' ? 1 : 0);
      const nB = placedB + (side === "B" && m.type === 'place' ? 1 : 0);
      const s = score(nb, side === "W" ? "B" : "W", nW, nB, depth + 1);
      best = side === "W" ? Math.max(best, s) : Math.min(best, s);
      if (side === "W" && best === 1) break;
      if (side === "B" && best === -1) break;
    }
    memo.set(k, best); return best;
  }

  function bestMove(side) {
    const placedSide = side === "W" ? placed.W : placed.B;
    const moves = legalMoves(board, side, placedSide);
    if (!moves.length) return null;
    let bestS = side === "W" ? -Infinity : Infinity;
    let best = moves[0];
    for (const m of moves) {
      const nb = apply(board, m, side);
      const nW = placed.W + (side === "W" && m.type === 'place' ? 1 : 0);
      const nB = placed.B + (side === "B" && m.type === 'place' ? 1 : 0);
      const s = score(nb, side === "W" ? "B" : "W", nW, nB, 0);
      if ((side === "W" && s > bestS) || (side === "B" && s < bestS)) { bestS = s; best = m; }
    }
    return best;
  }

  function cellPos(i) {
    const margin = size * 0.15;
    const step = (size - margin * 2) / 2;
    const r = Math.floor(i/3), c = i%3;
    return { x: margin + c*step, y: margin + r*step };
  }

  function draw() {
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0,0,size,size);
    // lines
    ctx.strokeStyle = "#bbb"; ctx.lineWidth = 2;
    for (const L of LINES) {
      const a = cellPos(L[0]), b = cellPos(L[L.length-1]);
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    }
    // selection highlight + targets
    if (selected !== null) {
      const p = cellPos(selected);
      ctx.beginPath(); ctx.arc(p.x, p.y, size*0.08, 0, Math.PI*2);
      ctx.strokeStyle = "#dc8"; ctx.lineWidth = 3; ctx.stroke();
      const placedSide = placed.W;
      const moves = placedSide >= 3 ? legalMoves(board, "W", placedSide).filter(m => m.type === 'move' && m.from === selected) : [];
      for (const m of moves) {
        const q = cellPos(m.to);
        ctx.beginPath(); ctx.arc(q.x, q.y, size*0.03, 0, Math.PI*2);
        ctx.fillStyle = "rgba(60,150,60,0.7)"; ctx.fill();
      }
    }
    // points + pieces
    for (let i=0; i<9; i++) {
      const p = cellPos(i);
      if (board[i]) {
        ctx.beginPath(); ctx.arc(p.x, p.y, size*0.06, 0, Math.PI*2);
        ctx.fillStyle = board[i] === "W" ? "#f8f4e8" : "#1a1a1a";
        ctx.fill();
        ctx.strokeStyle = "#000"; ctx.lineWidth = 2; ctx.stroke();
      } else {
        ctx.beginPath(); ctx.arc(p.x, p.y, size*0.018, 0, Math.PI*2);
        ctx.fillStyle = "#888"; ctx.fill();
      }
    }

    if (winner) statusEl.textContent = `${winner === "W" ? "you" : "AI"} wins!`;
    else {
      const phase = placed.W >= 3 && placed.B >= 3 ? "move" : "place";
      statusEl.textContent = (turn === "W" ? "your turn" : "AI thinking…") + ` (${phase} phase — W:${3-placed.W} B:${3-placed.B} to place)`;
    }
  }

  function clickPos(e) {
    const r = canvas.getBoundingClientRect();
    return { x: (e.clientX - r.left) * (size / r.width), y: (e.clientY - r.top) * (size / r.height) };
  }

  function findPoint(x, y) {
    for (let i = 0; i < 9; i++) {
      const p = cellPos(i);
      if ((x - p.x) ** 2 + (y - p.y) ** 2 <= (size * 0.08) ** 2) return i;
    }
    return -1;
  }

  function commitMove(m, side) {
    board = apply(board, m, side);
    if (m.type === 'place') placed[side]++;
    if (won(board, side)) { winner = side; draw(); return true; }
    return false;
  }

  function doAi() {
    if (winner) return;
    const m = bestMove("B");
    if (!m) { winner = "W"; draw(); return; }
    if (commitMove(m, "B")) return;
    turn = "W"; draw();
  }

  function onClick(e) {
    if (winner || turn !== "W") return;
    const { x, y } = clickPos(e);
    const i = findPoint(x, y);
    if (i < 0) return;
    if (placed.W < 3) {
      // place phase
      if (board[i]) return;
      if (commitMove({type:'place', to:i}, "W")) return;
      turn = "B"; draw(); setTimeout(doAi, 400); return;
    }
    // move phase
    if (board[i] === "W") { selected = i; draw(); return; }
    if (selected === null) return;
    const ms = legalMoves(board, "W", placed.W).filter(m => m.type === 'move' && m.from === selected && m.to === i);
    if (!ms.length) return;
    if (commitMove(ms[0], "W")) { selected = null; return; }
    selected = null; turn = "B"; draw(); setTimeout(doAi, 400);
  }

  canvas.addEventListener("click", onClick);
  draw();

  return {
    destroy() { canvas.removeEventListener("click", onClick); ctx.clearRect(0,0,size,size); memo.clear(); },
    restart() { newGame(); memo.clear(); draw(); },
    solve() {
      if (winner || turn !== "W") return;
      const m = bestMove("W");
      if (!m) return;
      if (commitMove(m, "W")) return;
      selected = null; turn = "B"; draw(); setTimeout(doAi, 500);
    },
  };
}
