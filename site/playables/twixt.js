// Twixt — 8×8 mini board of holes. Place a peg; whenever two of your pegs are
// a chess-knight's-move apart with no enemy peg blocking the link's crossing,
// the link is automatically drawn. Black connects top↔bottom; orange connects
// left↔right. (Edge rows: black's edges are top row 0 and bottom row N-1;
// orange's edges are left col 0 and right col N-1.)
// AI: greedy — peg near the "shortest path" gap.

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = size + 40;
  const W = canvas.width, H = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) { canvas.style.width = W + 'px'; canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr); }
  const statusEl = document.getElementById("playable-status");

  const N = 8;
  let pegs, links, turn, winner;
  function newGame(){
    pegs = new Array(N*N).fill('.');
    links = []; // [r1, c1, r2, c2, side]
    turn = "you"; winner = null;
  }
  newGame();

  // Black (you) owns rows 0 and N-1 except corner cells (which are nobody's).
  // Orange (ai) owns cols 0 and N-1 except corners.
  function canPlace(r, c, side){
    if (r < 0 || r >= N || c < 0 || c >= N) return false;
    if (pegs[r*N + c] !== '.') return false;
    // corners belong to nobody
    if ((r === 0 || r === N-1) && (c === 0 || c === N-1)) return false;
    if (side === 'b' && (c === 0 || c === N-1)) return false; // your end rows are top/bottom; orange owns left/right
    if (side === 'w' && (r === 0 || r === N-1)) return false;
    return true;
  }

  // Knight-move deltas: 8 possibilities
  const KNIGHT = [[1,2],[2,1],[-1,2],[-2,1],[1,-2],[2,-1],[-1,-2],[-2,-1]];

  function linkSegments(r1, c1, r2, c2){
    // Returns the two cells that the link "passes over". For a knight move, the
    // link crosses the cell at (r1 + dr/2 rounded?). Actually proper twixt rule:
    // the link crosses through 4 mid-cells (the square the knight traverses).
    // Simplification: check the bounding 2x3 (or 3x2) rectangle for any blocker.
    const cells = [];
    const minR = Math.min(r1, r2), maxR = Math.max(r1, r2);
    const minC = Math.min(c1, c2), maxC = Math.max(c1, c2);
    for (let r = minR; r <= maxR; r++) for (let c = minC; c <= maxC; c++){
      if ((r === r1 && c === c1) || (r === r2 && c === c2)) continue;
      cells.push([r, c]);
    }
    return cells;
  }

  function linkBlocked(r1, c1, r2, c2, side){
    // a link is blocked if any prior link crosses it geometrically.
    // For minimal demo, we just check no enemy peg sits in the bounding cells.
    const enemy = side === 'b' ? 'w' : 'b';
    for (const [r, c] of linkSegments(r1, c1, r2, c2)){
      if (pegs[r*N + c] === enemy) return true;
    }
    return false;
  }

  function addLinksFor(r, c, side){
    for (const [dr, dc] of KNIGHT){
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nr >= N || nc < 0 || nc >= N) continue;
      if (pegs[nr*N + nc] !== side) continue;
      if (linkBlocked(r, c, nr, nc, side)) continue;
      // already linked?
      const exists = links.some(l => l[4] === side && ((l[0]===r&&l[1]===c&&l[2]===nr&&l[3]===nc) || (l[0]===nr&&l[1]===nc&&l[2]===r&&l[3]===c)));
      if (!exists) links.push([r, c, nr, nc, side]);
    }
  }

  function connected(side){
    // BFS via links from one edge to the other
    const startCells = [];
    if (side === 'b'){
      for (let c = 1; c < N - 1; c++) if (pegs[0*N + c] === 'b') startCells.push(0*N + c);
    } else {
      for (let r = 1; r < N - 1; r++) if (pegs[r*N + 0] === 'w') startCells.push(r*N + 0);
    }
    if (!startCells.length) return false;
    const visited = new Set(startCells); const q = startCells.slice();
    while (q.length){
      const i = q.shift();
      const r = Math.floor(i / N), c = i % N;
      if (side === 'b' && r === N - 1) return true;
      if (side === 'w' && c === N - 1) return true;
      for (const l of links){
        if (l[4] !== side) continue;
        let nr = -1, nc = -1;
        if (l[0] === r && l[1] === c){ nr = l[2]; nc = l[3]; }
        else if (l[2] === r && l[3] === c){ nr = l[0]; nc = l[1]; }
        if (nr < 0) continue;
        const ni = nr * N + nc;
        if (visited.has(ni)) continue;
        visited.add(ni); q.push(ni);
      }
    }
    return false;
  }

  function aiPick(){
    // greedy: pick cell that maximises number of new links (and reaches toward goal)
    const cells = [];
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (canPlace(r, c, 'w')) cells.push([r, c]);
    if (!cells.length) return null;
    let best = cells[0], bv = -Infinity;
    for (const [r, c] of cells){
      let count = 0;
      for (const [dr, dc] of KNIGHT){
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nr >= N || nc < 0 || nc >= N) continue;
        if (pegs[nr*N + nc] === 'w' && !linkBlocked(r, c, nr, nc, 'w')) count++;
      }
      // prefer central c progressing rightward (toward c = N-1)
      const v = count * 10 + c;
      if (v > bv){ bv = v; best = [r, c]; }
    }
    return best;
  }

  function aiMove(){
    if (winner) return;
    const m = aiPick(); if (!m){ winner = "draw"; draw(); return; }
    pegs[m[0]*N + m[1]] = 'w'; addLinksFor(m[0], m[1], 'w');
    if (connected('w')){ winner = "ai"; draw(); return; }
    turn = "you"; draw();
  }

  function cellPos(r, c){
    const margin = 24, cs = (size - 2*margin) / (N - 1);
    return { x: margin + c * cs, y: 40 + r * cs };
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);

    // border strips
    const cs = (size - 48) / (N - 1);
    ctx.fillStyle = "#bcd9f0"; ctx.fillRect(24 - cs/2, 40 - cs/2, (N-1)*cs + cs, cs);
    ctx.fillRect(24 - cs/2, 40 + (N-1)*cs - cs/2, (N-1)*cs + cs, cs);
    ctx.fillStyle = "#f4cfb4"; ctx.fillRect(24 - cs/2, 40 - cs/2, cs, (N-1)*cs + cs);
    ctx.fillRect(24 + (N-1)*cs - cs/2, 40 - cs/2, cs, (N-1)*cs + cs);

    // holes
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const p = cellPos(r, c);
      ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI*2);
      ctx.fillStyle = "#888"; ctx.fill();
    }

    // links
    for (const l of links){
      const p1 = cellPos(l[0], l[1]), p2 = cellPos(l[2], l[3]);
      ctx.strokeStyle = l[4] === 'b' ? "#39c" : "#e60"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
    }
    ctx.lineWidth = 1;

    // pegs
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const v = pegs[r*N + c]; if (v === '.') continue;
      const p = cellPos(r, c);
      ctx.beginPath(); ctx.arc(p.x, p.y, 7, 0, Math.PI*2);
      ctx.fillStyle = v === 'b' ? "#222" : "#fa3"; ctx.fill();
      ctx.strokeStyle = "#000"; ctx.stroke();
    }

    if (winner) statusEl.textContent = winner === "you" ? "you connected top↔bottom!" : winner === "ai" ? "AI connected left↔right" : "draw";
    else statusEl.textContent = turn === "you" ? "click a hole to place a black peg" : "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }
  function findCell(x, y){
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const p = cellPos(r, c);
      if (Math.hypot(x - p.x, y - p.y) < 12) return [r, c];
    }
    return null;
  }

  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e); const m = findCell(x, y); if (!m) return;
    if (!canPlace(m[0], m[1], 'b')) return;
    pegs[m[0]*N + m[1]] = 'b'; addLinksFor(m[0], m[1], 'b');
    if (connected('b')){ winner = "you"; draw(); return; }
    turn = "ai"; draw(); setTimeout(aiMove, 500);
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve(){
      if (winner || turn !== "you") return;
      const __cells = [];
      for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (canPlace(r, c, 'b')) __cells.push([r, c]);
      if (!__cells.length){ winner = "ai"; draw(); return; }
      const [r, c] = __cells[Math.floor(Math.random() * __cells.length)];
      pegs[r*N + c] = 'b'; addLinksFor(r, c, 'b');
      if (connected('b')){ winner = "you"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 80);
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
