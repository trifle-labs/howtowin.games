// Bridg-it — Two interleaved 4×4 grids of dots (blue and red). Players draw
// short edges connecting two dots of their colour; cannot cross enemy edges.
// Blue connects top↔bottom; Red connects left↔right.
// AI: simple shortest-path heuristic (block opponent's shortest connection, build own).

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = size + 40;
  const W = canvas.width, H = canvas.height;
  const statusEl = document.getElementById("playable-status");

  // We use 4 rows × 4 cols of blue dots (interleaved with red dots).
  // Blue edges connect (r, c) ↔ (r±1, c) or (r, c±1) within blue grid;
  // Red edges connect within red grid (offset by 0.5).
  // Edges cross diagonally: a blue vertical edge (r,c)–(r+1,c) crosses the
  // red horizontal edge (r,c-1)–(r,c) only when those happen to overlap geometrically.
  // For simplicity, we just enforce: each "cell" between 4 dots contains exactly one
  // edge (blue or red diagonal). We model this as a 3×3 grid of cells, each occupied
  // by 'b' (blue NW-SE) or 'w' (red NE-SW) or '.'.

  const N = 4; // blue grid 4×4
  const CELLS = N - 1; // 3×3 of "edge cells"
  let cell, turn, winner;
  function newGame(){ cell = new Array(CELLS*CELLS).fill('.'); turn = "you"; winner = null; }
  newGame();

  // Blue path: connects top row to bottom row.
  // Build a graph: blue nodes are the 4×4 blue dots. Two blue dots are connected if
  // a cell between them is 'b' (meaning the blue diagonal in that cell — which connects
  // either both vertical neighbours or both horizontal neighbours? We'll say a 'b' cell
  // at (r,c) connects (r,c)-(r+1,c+1) diagonally for blue, and 'w' connects (r,c+1)-(r+1,c).
  // Actually let's use a simpler "edge model":
  //   Each cell has two diagonals. Placing 'b' at cell (r,c) makes a blue
  //   connection between blue dots (r,c)-(r+1,c+1). Placing 'w' connects
  //   red dots equivalently. Each cell has exactly one diagonal.

  function blueConnected(){
    // BFS from top row dots; check if reaches any bottom row dot
    // Dots are at (r, c) for r, c in 0..N-1
    const visited = new Set(); const q = [];
    for (let c = 0; c < N; c++){ const k = `0,${c}`; visited.add(k); q.push([0, c]); }
    while (q.length){
      const [r, c] = q.shift();
      if (r === N - 1) return true;
      // neighbours via blue diagonals
      // a 'b' at cell (cr, cc) connects (cr, cc) ↔ (cr+1, cc+1)
      for (const [cr, cc, nr, nc] of [
        [r, c, r+1, c+1],   // cell at (r,c)
        [r-1, c-1, r-1, c-1] /* placeholder removed */,
      ]) { /* skipping placeholder */ }
      // enumerate the 4 cells touching this dot
      for (const [dr, dc] of [[-1,-1],[-1,0],[0,-1],[0,0]]){
        const cr = r + dr, cc = c + dc;
        if (cr < 0 || cr >= CELLS || cc < 0 || cc >= CELLS) continue;
        if (cell[cr*CELLS + cc] !== 'b') continue;
        // blue diagonal connects (cr,cc) ↔ (cr+1, cc+1)
        // does it touch (r, c)?
        if ((r === cr && c === cc) || (r === cr+1 && c === cc+1)){
          const other = (r === cr) ? [cr+1, cc+1] : [cr, cc];
          const ok = `${other[0]},${other[1]}`;
          if (!visited.has(ok)){ visited.add(ok); q.push(other); }
        }
      }
    }
    return false;
  }

  function redConnected(){
    // Red dots at the centres of cells: same coordinate system but we view 'w' as
    // connecting (cr, cc+1) ↔ (cr+1, cc) — the NE-SW diagonal.
    // For the red player, the dots are the same blue-corner dots but for paths we
    // treat 'w' as connecting different pair. Red goal: left column ↔ right column.
    const visited = new Set(); const q = [];
    for (let r = 0; r < N; r++){ const k = `${r},0`; visited.add(k); q.push([r, 0]); }
    while (q.length){
      const [r, c] = q.shift();
      if (c === N - 1) return true;
      for (const [dr, dc] of [[-1,-1],[-1,0],[0,-1],[0,0]]){
        const cr = r + dr, cc = c + dc;
        if (cr < 0 || cr >= CELLS || cc < 0 || cc >= CELLS) continue;
        if (cell[cr*CELLS + cc] !== 'w') continue;
        // red diagonal connects (cr, cc+1) ↔ (cr+1, cc)
        if ((r === cr && c === cc+1) || (r === cr+1 && c === cc)){
          const other = (r === cr) ? [cr+1, cc] : [cr, cc+1];
          const ok = `${other[0]},${other[1]}`;
          if (!visited.has(ok)){ visited.add(ok); q.push(other); }
        }
      }
    }
    return false;
  }

  function aiBest(){
    // pick any cell, prefer one that wins
    for (let i = 0; i < cell.length; i++){
      if (cell[i] !== '.') continue;
      cell[i] = 'w';
      if (redConnected()){ cell[i] = '.'; return i; }
      cell[i] = '.';
    }
    // block immediate blue win
    for (let i = 0; i < cell.length; i++){
      if (cell[i] !== '.') continue;
      cell[i] = 'b';
      const wins = blueConnected();
      cell[i] = '.';
      if (wins){ return i; }
    }
    // first empty (centre-out)
    const order = []; for (let i = 0; i < cell.length; i++) order.push(i);
    order.sort((a, b) => Math.abs((a%CELLS) - 1) + Math.abs(Math.floor(a/CELLS) - 1) - (Math.abs((b%CELLS) - 1) + Math.abs(Math.floor(b/CELLS) - 1)));
    for (const i of order) if (cell[i] === '.') return i;
    return -1;
  }

  function aiMove(){
    if (winner) return;
    const i = aiBest(); if (i < 0){ winner = "draw"; draw(); return; }
    cell[i] = 'w';
    if (redConnected()){ winner = "ai"; draw(); return; }
    turn = "you"; draw();
  }

  function dotPos(r, c){
    const margin = 30, cs = (size - 2*margin) / (N - 1);
    return { x: margin + c*cs, y: 30 + r*cs };
  }
  function cellRect(cr, cc){
    const p1 = dotPos(cr, cc), p2 = dotPos(cr+1, cc+1);
    return { x: p1.x, y: p1.y, w: p2.x - p1.x, h: p2.y - p1.y };
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);

    // diagonals
    for (let cr = 0; cr < CELLS; cr++) for (let cc = 0; cc < CELLS; cc++){
      const rc = cellRect(cr, cc); const v = cell[cr*CELLS + cc];
      ctx.lineWidth = 4;
      if (v === 'b'){
        ctx.strokeStyle = "#39c";
        ctx.beginPath(); ctx.moveTo(rc.x, rc.y); ctx.lineTo(rc.x + rc.w, rc.y + rc.h); ctx.stroke();
      } else if (v === 'w'){
        ctx.strokeStyle = "#e60";
        ctx.beginPath(); ctx.moveTo(rc.x + rc.w, rc.y); ctx.lineTo(rc.x, rc.y + rc.h); ctx.stroke();
      } else {
        // hint: clickable
        ctx.strokeStyle = "#eee";
        ctx.beginPath(); ctx.moveTo(rc.x, rc.y); ctx.lineTo(rc.x + rc.w, rc.y + rc.h); ctx.stroke();
      }
    }
    ctx.lineWidth = 1;
    // dots
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const p = dotPos(r, c);
      ctx.beginPath(); ctx.arc(p.x, p.y, 6, 0, Math.PI*2);
      ctx.fillStyle = "#333"; ctx.fill();
    }
    if (winner) statusEl.textContent = winner === "you" ? "you connected top↔bottom!" : "AI connected left↔right";
    else statusEl.textContent = turn === "you" ? "click a cell to draw a BLUE NW-SE diagonal there" : "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }
  function findCell(x, y){
    for (let cr = 0; cr < CELLS; cr++) for (let cc = 0; cc < CELLS; cc++){
      const rc = cellRect(cr, cc);
      if (x >= rc.x && x <= rc.x + rc.w && y >= rc.y && y <= rc.y + rc.h) return cr*CELLS + cc;
    }
    return -1;
  }

  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e); const i = findCell(x, y);
    if (i < 0 || cell[i] !== '.') return;
    cell[i] = 'b';
    if (blueConnected()){ winner = "you"; draw(); return; }
    turn = "ai"; draw(); setTimeout(aiMove, 500);
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve() {
      if (winner || turn !== "you") return;
      const __opts = [];
      for (let i = 0; i < cell.length; i++) if (cell[i] === '.') __opts.push(i);
      if (!__opts.length) { winner = "draw"; draw(); return; }
      const __i = __opts[Math.floor(Math.random() * __opts.length)];
      cell[__i] = 'b';
      if (blueConnected()) { winner = "you"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 80);
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
