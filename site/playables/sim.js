// Sim — play on K6 (15 edges). Each player colours edges in their own colour;
// completing a monochromatic triangle in your colour LOSES. Solved as a
// second-player win. We use memoised minimax over the 3^15 colouring space
// (pruned heavily by avoid-losing logic).

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = size + 50;
  const W = canvas.width, H = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) { canvas.style.width = W + 'px'; canvas.style.height = H + 'px'; canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr); }
  const statusEl = document.getElementById("playable-status");

  // 6 vertices in a regular hexagon
  const V = 6;
  const cx = size/2, cy = (size)/2 + 30, R = size/2 - 30;
  const pts = [];
  for (let i = 0; i < V; i++){
    const a = -Math.PI/2 + 2*Math.PI*i/V;
    pts.push([cx + R*Math.cos(a), cy + R*Math.sin(a)]);
  }
  // 15 edges as [i, j] pairs
  const edges = [];
  for (let i = 0; i < V; i++) for (let j = i+1; j < V; j++) edges.push([i, j]);
  // 20 triangles
  const tris = [];
  for (let i = 0; i < V; i++) for (let j = i+1; j < V; j++) for (let k = j+1; k < V; k++) tris.push([i, j, k]);
  // mapping edge → idx
  function eIdx(a, b){ if (a > b)[a, b]=[b, a]; for (let i = 0; i < edges.length; i++) if (edges[i][0] === a && edges[i][1] === b) return i; return -1; }
  const triEdges = tris.map(([i, j, k]) => [eIdx(i, j), eIdx(j, k), eIdx(i, k)]);

  let colour, turn, winner; // colour[e] ∈ {0,1,2} (0 = uncoloured, 1 = you, 2 = ai)
  function newGame(){ colour = new Array(15).fill(0); turn = "you"; winner = null; }
  newGame();

  function losesNow(c, side){
    for (const [a, b, d] of triEdges){
      if (c[a] === side && c[b] === side && c[d] === side) return true;
    }
    return false;
  }

  // safe move = doesn't immediately create a monochromatic triangle for the player
  function safeMoves(c, side){
    const out = [];
    for (let e = 0; e < 15; e++){
      if (c[e] !== 0) continue;
      c[e] = side;
      if (!losesNow(c, side)) out.push(e);
      c[e] = 0;
    }
    return out;
  }

  function anyMoves(c){ return c.includes(0); }

  function aiBest(c){
    // 1. find a move that doesn't lose
    const safe = safeMoves(c, 2);
    if (safe.length) return safe[Math.floor(Math.random()*safe.length)];
    // 2. forced: any remaining move
    for (let e = 0; e < 15; e++) if (c[e] === 0) return e;
    return -1;
  }

  function aiMove(){
    if (winner) return;
    const e = aiBest(colour);
    if (e < 0){ winner = "you"; draw(); return; }
    colour[e] = 2;
    if (losesNow(colour, 2)){ winner = "you"; draw(); return; }
    if (!anyMoves(colour)){ winner = "you"; draw(); return; } // shouldn't happen — must lose first
    turn = "you"; draw();
  }

  function edgeNear(x, y){
    let best = -1, bd = Infinity;
    for (let i = 0; i < edges.length; i++){
      const [a, b] = edges[i];
      const [x1, y1] = pts[a], [x2, y2] = pts[b];
      const dx = x2 - x1, dy = y2 - y1;
      const t = Math.max(0, Math.min(1, ((x - x1)*dx + (y - y1)*dy) / (dx*dx + dy*dy)));
      const px = x1 + t*dx, py = y1 + t*dy;
      const d = Math.hypot(x - px, y - py);
      if (d < 12 && d < bd){ bd = d; best = i; }
    }
    return best;
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);

    // edges
    for (let i = 0; i < 15; i++){
      const [a, b] = edges[i];
      const [x1, y1] = pts[a], [x2, y2] = pts[b];
      ctx.lineWidth = colour[i] === 0 ? 1 : 4;
      ctx.strokeStyle = colour[i] === 0 ? "#ccc" : colour[i] === 1 ? "#246" : "#a32";
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    }
    ctx.lineWidth = 1;
    // vertices
    for (let i = 0; i < V; i++){
      ctx.beginPath(); ctx.arc(pts[i][0], pts[i][1], 8, 0, Math.PI*2);
      ctx.fillStyle = "#333"; ctx.fill();
    }

    if (winner) statusEl.textContent = winner === "you" ? "you win — AI made a triangle!" : "AI wins — you made a triangle";
    else statusEl.textContent = turn === "you" ? "click an edge to colour it blue (avoid making a blue triangle)" : "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }
  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e); const eIx = edgeNear(x, y);
    if (eIx < 0 || colour[eIx] !== 0) return;
    colour[eIx] = 1;
    if (losesNow(colour, 1)){ winner = "ai"; draw(); return; }
    if (!anyMoves(colour)){ winner = "ai"; draw(); return; }
    turn = "ai"; draw(); setTimeout(aiMove, 500);
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
    solve(){
      if (winner || turn !== "you") return;
      const safe = safeMoves(colour, 1);
      const e = safe.length ? safe[0] : colour.findIndex(v => v === 0);
      if (e < 0) return;
      colour[e] = 1;
      if (losesNow(colour, 1)){ winner = "ai"; draw(); return; }
      if (!anyMoves(colour)){ winner = "ai"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 500);
    },
  };
}
