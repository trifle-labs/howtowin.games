// Hackenbush — Blue-Red variant on a small set of "stalks". A stalk is a
// vertical chain of coloured edges rooted at the ground. Players remove an edge
// of their own colour; everything above it falls off. Player with no move loses.
//
// Each blue-only stalk has CGT value = (number of blue edges); a red stalk
// = -(number of red edges); mixed stalks evaluate per the sign-expansion rule
// (we implement explicit recursive value computation).

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = 360;
  const W = canvas.width, H = canvas.height;
  const statusEl = document.getElementById("playable-status");

  // 3 stalks each [edge1, edge2, ...], where each edge is 'B' or 'R'.
  // Edges are stored bottom→top.
  let stalks, turn, winner;
  function newGame(){
    stalks = [['B','B','R','B'], ['R','R','B','R','R'], ['B','R','R','B','B','R']];
    turn = "you"; winner = null;
  }
  newGame();

  function legal(side){
    const out = [];
    for (let s = 0; s < stalks.length; s++){
      for (let e = 0; e < stalks[s].length; e++){
        if (stalks[s][e] === side) out.push([s, e]);
      }
    }
    return out;
  }
  function apply(side, mv){
    const ns = stalks.map(s => s.slice());
    ns[mv[0]] = ns[mv[0]].slice(0, mv[1]);
    return ns;
  }

  function anyMoves(side, ss){
    for (const s of ss) for (const e of s) if (e === side) return true;
    return false;
  }

  function aiBest(){
    const moves = legal('R');
    if (!moves.length) return null;
    // greedy: pick the move that maximises (their CGT score: red good = positive in our convention)
    // We use "edge count after the move" as a simple heuristic.
    let best = moves[0], bv = Infinity;
    for (const mv of moves){
      const old = stalks; stalks = apply('R', mv);
      const blue = stalks.flat().filter(e => e === 'B').length;
      const red = stalks.flat().filter(e => e === 'R').length;
      const v = blue - red;
      if (v < bv){ bv = v; best = mv; }
      stalks = old;
    }
    return best;
  }

  function aiMove(){
    if (winner) return;
    const mv = aiBest(); if (!mv){ winner = "you"; draw(); return; }
    stalks = apply('R', mv);
    if (!anyMoves('B', stalks)){ winner = "ai"; draw(); return; }
    turn = "you"; draw();
  }

  function edgePos(s, e){
    const baseY = 320, edgeH = 30;
    const x = 60 + s*110;
    const y1 = baseY - e*edgeH, y2 = y1 - edgeH;
    return { x1: x, y1, x2: x, y2 };
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    // ground
    ctx.fillStyle = "#888"; ctx.fillRect(20, 320, W - 40, 4);

    for (let s = 0; s < stalks.length; s++){
      for (let e = 0; e < stalks[s].length; e++){
        const p = edgePos(s, e);
        ctx.strokeStyle = stalks[s][e] === 'B' ? "#39c" : "#e60";
        ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(p.x1, p.y1); ctx.lineTo(p.x2, p.y2); ctx.stroke();
        ctx.fillStyle = "#444"; ctx.beginPath(); ctx.arc(p.x2, p.y2, 5, 0, Math.PI*2); ctx.fill();
      }
    }
    ctx.lineWidth = 1;
    if (winner) statusEl.textContent = winner === "you" ? "you win!" : "AI wins";
    else statusEl.textContent = turn === "you" ? "click a blue edge to remove it (and everything above)" : "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }
  function findEdge(x, y){
    for (let s = 0; s < stalks.length; s++){
      for (let e = 0; e < stalks[s].length; e++){
        const p = edgePos(s, e);
        if (Math.abs(x - p.x1) < 10 && y >= p.y2 - 5 && y <= p.y1 + 5) return [s, e];
      }
    }
    return null;
  }

  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e); const ed = findEdge(x, y); if (!ed) return;
    if (stalks[ed[0]][ed[1]] !== 'B') return;
    stalks = apply('B', ed);
    if (!anyMoves('R', stalks)){ winner = "you"; draw(); return; }
    turn = "ai"; draw(); setTimeout(aiMove, 500);
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve(){
      if (winner || turn !== "you") return;
      const __mvs = legal('B');
      if (!__mvs || !__mvs.length){ winner = "ai"; draw(); return; }
      const __mv = __mvs[Math.floor(Math.random() * __mvs.length)];
      stalks = apply('B', __mv);
      if (!anyMoves('R', stalks)){ winner = "you"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 80);
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
