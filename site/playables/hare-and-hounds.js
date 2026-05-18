// Hare and Hounds (French Military Game) — 11-point pursuit board. You play
// the 3 hounds (left side), AI plays the hare (right side). Hounds may move
// forward or vertically (never backward); hare moves any direction. Hounds win
// by trapping the hare. Hare wins by reaching the leftmost column.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 540);
  canvas.width = size;
  canvas.height = 260;
  const H = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) {
    const w = canvas.width, h = canvas.height;
    canvas.style.width = w + 'px';    canvas.width = w * dpr; canvas.height = h * dpr; ctx.scale(dpr, dpr);
  }
  const statusEl = document.getElementById("playable-status");

  // 11 points: M0 (left tip), then a 3×3 grid in cols 1..3, then M4 (right tip).
  //   col0 col1 col2 col3 col4
  //         T1   T2   T3
  //   M0    M1   M2   M3    M4
  //         B1   B2   B3
  //
  // Indices: M0=0, T1=1, T2=2, T3=3, M1=4, M2=5, M3=6, B1=7, B2=8, B3=9, M4=10
  const N = 11;
  const POS = [
    [0, 1],  // 0  M0
    [1, 0],  // 1  T1
    [2, 0],  // 2  T2
    [3, 0],  // 3  T3
    [1, 1],  // 4  M1
    [2, 1],  // 5  M2
    [3, 1],  // 6  M3
    [1, 2],  // 7  B1
    [2, 2],  // 8  B2
    [3, 2],  // 9  B3
    [4, 1],  // 10 M4
  ];
  // Adjacencies (undirected): orthogonal + diagonals through the middle row.
  const ADJ_LIST = [
    [0,1],[0,4],[0,7],          // M0 to T1, M1, B1
    [1,2],[1,4],[1,5],          // T1 to T2, M1, M2 (diagonal)
    [2,3],[2,5],                // T2 to T3, M2
    [3,5],[3,6],[3,10],         // T3 to M2 (diag), M3, M4
    [4,5],[4,7],                // M1 to M2, B1
    [5,6],[5,7],[5,8],[5,9],    // M2 to M3, B1, B2, B3 (diagonals + orthogonal)
    [6,9],[6,10],               // M3 to B3 (diag), M4
    [7,8],
    [8,9],
  ];
  const ADJ = Array.from({length: N}, () => new Set());
  for (const [a,b] of ADJ_LIST){ ADJ[a].add(b); ADJ[b].add(a); }
  const COL = i => POS[i][0];

  let pieces, turn, winner; // pieces[i] = "H" (hound), "h" (hare), "."
  function newGame(){
    pieces = Array(N).fill(".");
    pieces[1] = "H"; pieces[4] = "H"; pieces[7] = "H"; // 3 hounds on left col
    pieces[10] = "h"; // hare at right tip
    turn = "you"; winner = null;
  }
  newGame();

  function hareMoves(p){
    // any adjacency, target empty
    const i = p.indexOf("h"); if (i < 0) return [];
    const out = [];
    for (const j of ADJ[i]) if (p[j] === ".") out.push({ from: i, to: j });
    return out;
  }
  function houndMoves(p){
    // forward (col increases) or vertical (col same)
    const out = [];
    for (let i=0; i<N; i++){
      if (p[i] !== "H") continue;
      for (const j of ADJ[i]) if (p[j] === "." && COL(j) >= COL(i)) out.push({ from: i, to: j });
    }
    return out;
  }

  function apply(p, m){ const np = p.slice(); np[m.to] = np[m.from]; np[m.from] = "."; return np; }

  function hareEscaped(p){
    const i = p.indexOf("h");
    if (i < 0) return false;
    // hare wins if it's leftward of all hounds
    let minH = N;
    for (let j=0; j<N; j++) if (p[j] === "H") minH = Math.min(minH, COL(j));
    return COL(i) < minH;
  }

  function aiMoveHare(){
    if (winner) return;
    const moves = hareMoves(pieces);
    if (!moves.length){ winner = "you"; draw(); return; }
    // pick move that minimizes hare's col (advance leftward) and prefers leaving formation gaps
    let best = moves[0], bestVal = Infinity;
    for (const m of moves){
      const np = apply(pieces, m);
      let val = COL(m.to) * 10;
      // tie-break: prefer staying away from hounds (mobility)
      let nbCount = 0;
      for (const j of ADJ[m.to]) if (np[j] === "H") nbCount++;
      val += nbCount * 3;
      if (val < bestVal){ bestVal = val; best = m; }
    }
    pieces = apply(pieces, best);
    if (hareEscaped(pieces)){ winner = "ai"; draw(); return; }
    turn = "you"; draw();
  }

  function houndAdvance(){
    // Optimal-ish: advance the hound that has a forward move; prefer moves that
    // keep the 3 hounds on adjacent columns (no gap of 2+).
    const moves = houndMoves(pieces);
    if (!moves.length) return null;
    // prefer forward-advance over vertical
    moves.sort((a, b) => {
      const aFwd = COL(a.to) > COL(a.from) ? 0 : 1;
      const bFwd = COL(b.to) > COL(b.from) ? 0 : 1;
      return aFwd - bFwd;
    });
    return moves[0];
  }

  function nodePx(i){
    const margin = 30;
    const cellW = (size - 2*margin) / 5;
    const cellH = (H - 80) / 3;
    return { x: margin + POS[i][0]*cellW + cellW/2, y: 60 + POS[i][1]*cellH + cellH/2 };
  }

  function draw(){
    ctx.fillStyle="#fafaf7"; ctx.fillRect(0,0,size,H);
    ctx.font="13px sans-serif"; ctx.textAlign="center"; ctx.fillStyle="#444";
    ctx.fillText(`Hare and Hounds — you = 3 Hounds (move →/↑/↓); AI = Hare`, size/2, 22);
    ctx.fillText(`Hounds win by trapping the hare; hare wins by reaching col 0`, size/2, 42);
    // edges
    ctx.strokeStyle = "#aaa"; ctx.lineWidth = 1;
    for (const [a, b] of ADJ_LIST){
      const pa = nodePx(a), pb = nodePx(b);
      ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y); ctx.stroke();
    }
    for (let i=0; i<N; i++){
      const p = nodePx(i);
      ctx.beginPath(); ctx.arc(p.x, p.y, 18, 0, Math.PI*2);
      ctx.fillStyle = "#fff"; ctx.fill();
      ctx.strokeStyle = "#444"; ctx.stroke();
      if (pieces[i] === "H"){
        ctx.beginPath(); ctx.arc(p.x, p.y, 13, 0, Math.PI*2);
        ctx.fillStyle = "#2980b9"; ctx.fill(); ctx.strokeStyle = "#fff"; ctx.stroke();
      } else if (pieces[i] === "h"){
        ctx.beginPath(); ctx.arc(p.x, p.y, 13, 0, Math.PI*2);
        ctx.fillStyle = "#e74c3c"; ctx.fill(); ctx.strokeStyle = "#fff"; ctx.stroke();
      }
    }
    if (winner) statusEl.textContent = winner === "you" ? "you win — hare is trapped!" : "AI wins — hare escaped!";
    else statusEl.textContent = turn === "you" ? "click a Hound, then a connected empty node (no backward moves)" : "AI thinking…";
  }

  let sel = -1;
  function clickPos(e){ const r=canvas.getBoundingClientRect(); return {x:(e.clientX-r.left)*(size/r.width), y:(e.clientY-r.top)*(H/r.height)}; }
  function findNode(x, y){
    for (let i=0; i<N; i++){ const p = nodePx(i); if ((x-p.x)**2+(y-p.y)**2 <= 20*20) return i; }
    return -1;
  }

  function onClick(e){
    if (winner || turn !== "you") return;
    const {x,y} = clickPos(e); const i = findNode(x, y);
    if (i < 0) return;
    if (pieces[i] === "H"){ sel = i; draw(); return; }
    if (sel >= 0){
      const moves = houndMoves(pieces).filter(m => m.from === sel && m.to === i);
      if (moves.length){
        pieces = apply(pieces, moves[0]);
        sel = -1;
        if (hareEscaped(pieces)){ winner = "ai"; draw(); return; }
        if (!hareMoves(pieces).length){ winner = "you"; draw(); return; }
        turn = "ai"; draw(); setTimeout(aiMoveHare, 500);
      }
    }
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0,0,size,H); },
    restart(){ newGame(); draw(); },
    solve(){
      if (winner || turn !== "you") return;
      const m = houndAdvance();
      if (!m){ winner = "ai"; draw(); return; }
      pieces = apply(pieces, m); sel = -1;
      if (hareEscaped(pieces)){ winner = "ai"; draw(); return; }
      if (!hareMoves(pieces).length){ winner = "you"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMoveHare, 500);
    },
  };
}
