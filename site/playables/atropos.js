// Atropos — graph-colouring game on a small triangular board. Three colours
// (red, green, blue) on the boundary; players alternate colouring an interior
// vertex with any colour subject to: if the vertex you colour is adjacent to
// two differently-coloured vertices, your colour must be the THIRD distinct
// colour (else you LOSE immediately by forming a monochromatic triangle).
// Last legal move wins. AI: heuristic — avoid creating losing positions.

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = size + 40;
  const W = canvas.width, H = canvas.height;
  const statusEl = document.getElementById("playable-status");

  // Triangular grid: rows 0..N with row r having (r+1) vertices. Boundary
  // assigned R/G/B in fixed pattern; interior is empty.
  const N = 4;
  let cells, neighbors, turn, winner, sel;
  function newGame(){
    cells = [];
    // cells[r][c] for r in 0..N, c in 0..r
    for (let r = 0; r <= N; r++){
      cells.push(new Array(r + 1).fill(null));
    }
    // boundary colours: top corner = R, left edge = G, right edge = B, bottom mix
    cells[0][0] = 'R';
    for (let r = 1; r <= N; r++){
      cells[r][0] = 'G';
      cells[r][r] = 'B';
    }
    // bottom row interior alternating R,G
    for (let c = 1; c < N; c++) cells[N][c] = c % 2 === 1 ? 'R' : 'G';
    // build neighbours: each cell has up to 6 neighbours in triangle grid
    neighbors = new Map();
    for (let r = 0; r <= N; r++) for (let c = 0; c <= r; c++){
      const key = `${r},${c}`;
      const adj = [];
      // upper, left/right
      for (const [dr, dc] of [[-1,-1],[-1,0],[0,-1],[0,1],[1,0],[1,1]]){
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nr > N || nc < 0 || nc > nr) continue;
        adj.push(`${nr},${nc}`);
      }
      neighbors.set(key, adj);
    }
    turn = "you"; winner = null; sel = null;
  }
  newGame();

  function emptyVertices(){
    const out = [];
    for (let r = 1; r < N; r++) for (let c = 1; c < r; c++){
      if (!cells[r][c]) out.push([r, c]);
    }
    return out;
  }

  function get(r, c){ if (r < 0 || r > N || c < 0 || c > r) return null; return cells[r][c]; }

  function wouldLose(r, c, color){
    // check if placing color creates a monochromatic triangle. A triangle is a
    // pair of adjacent neighbours (e.g., (r-1,c-1)&(r-1,c), (r-1,c)&(r,c-1), etc.).
    const PAIRS = [
      [[-1,-1],[-1,0]],
      [[-1,0],[0,1]],
      [[0,1],[1,1]],
      [[1,1],[1,0]],
      [[1,0],[0,-1]],
      [[0,-1],[-1,-1]],
    ];
    for (const [[d1r, d1c], [d2r, d2c]] of PAIRS){
      const n1 = get(r + d1r, c + d1c); const n2 = get(r + d2r, c + d2c);
      if (!n1 || !n2) continue;
      if (n1 === color && n2 === color) return true;
      // also "rainbow" forced rule: if n1 != n2 both colored, your color must be the third
      if (n1 && n2 && n1 !== n2){
        const required = ['R','G','B'].find(x => x !== n1 && x !== n2);
        if (color !== required) return true;
      }
    }
    return false;
  }

  function aiMove(){
    if (winner) return;
    const empty = emptyVertices();
    if (!empty.length){ winner = "you"; draw(); return; }
    // pick any (r, c, color) that doesn't lose
    for (const [r, c] of empty){
      for (const color of ['R','G','B']){
        if (!wouldLose(r, c, color)){
          cells[r][c] = color;
          if (!emptyVertices().length){ winner = "ai"; draw(); return; }
          turn = "you"; draw(); return;
        }
      }
    }
    // forced losing
    const [r, c] = empty[0];
    cells[r][c] = 'R'; winner = "you"; draw();
  }

  function vertexPos(r, c){
    const margin = 30, vstep = (size - 2*margin) / N;
    const cx = W/2;
    return { x: cx - r * vstep/2 + c * vstep, y: 40 + r * vstep * 0.866 };
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "13px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";

    // edges
    for (let r = 0; r <= N; r++) for (let c = 0; c <= r; c++){
      const p = vertexPos(r, c);
      for (const dir of [[1,0],[1,1],[0,1]]){
        const nr = r + dir[0], nc = c + dir[1];
        if (nr > N || nc > nr) continue;
        const p2 = vertexPos(nr, nc);
        ctx.strokeStyle = "#888"; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
      }
    }
    // vertices
    for (let r = 0; r <= N; r++) for (let c = 0; c <= r; c++){
      const p = vertexPos(r, c);
      ctx.beginPath(); ctx.arc(p.x, p.y, 10, 0, Math.PI*2);
      const v = cells[r][c];
      ctx.fillStyle = v === 'R' ? "#e44" : v === 'G' ? "#4a4" : v === 'B' ? "#39c" : "#fff";
      ctx.fill(); ctx.strokeStyle = "#222"; ctx.stroke();
    }

    // colour picker for player
    if (turn === "you" && !winner && sel){
      ctx.fillStyle = "#444"; ctx.textAlign = "center"; ctx.fillText(`selected vertex — choose colour`, W/2, H - 18);
      for (let k = 0; k < 3; k++){
        const x = W/2 - 60 + k * 60, y = H - 4 - 12;
        ctx.beginPath(); ctx.arc(x, y, 12, 0, Math.PI*2);
        ctx.fillStyle = k === 0 ? "#e44" : k === 1 ? "#4a4" : "#39c"; ctx.fill();
        ctx.strokeStyle = "#222"; ctx.stroke();
      }
    }

    if (winner) statusEl.textContent = winner === "you" ? "you win!" : "AI wins";
    else statusEl.textContent = turn === "you" ? (sel ? "click R/G/B circle below" : "click an empty interior vertex") : "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }

  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e);
    if (sel){
      for (let k = 0; k < 3; k++){
        const cx = W/2 - 60 + k * 60, cy = H - 16;
        if (Math.hypot(x - cx, y - cy) < 14){
          const color = k === 0 ? 'R' : k === 1 ? 'G' : 'B';
          const [r, c] = sel; sel = null;
          if (wouldLose(r, c, color)){ cells[r][c] = color; winner = "ai"; draw(); return; }
          cells[r][c] = color;
          if (!emptyVertices().length){ winner = "you"; draw(); return; }
          turn = "ai"; draw(); setTimeout(aiMove, 400); return;
        }
      }
      return;
    }
    for (let r = 1; r < N; r++) for (let c = 1; c < r; c++){
      const p = vertexPos(r, c);
      if (Math.hypot(x - p.x, y - p.y) < 14 && !cells[r][c]){
        sel = [r, c]; draw(); return;
      }
    }
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve() {
      if (winner || turn !== "you") return;
      const __empty = emptyVertices();
      if (!__empty.length) { winner = "you"; draw(); return; }
      // Find a (vertex, color) pair that doesn't lose; pick randomly
      const __opts = [];
      for (const [r, c] of __empty) {
        for (const color of ['R', 'G', 'B']) {
          if (!wouldLose(r, c, color)) __opts.push([r, c, color]);
        }
      }
      if (!__opts.length) {
        // forced loss — make any move
        const [r, c] = __empty[0];
        cells[r][c] = 'R'; winner = "ai"; draw(); return;
      }
      const [__r, __c, __color] = __opts[Math.floor(Math.random() * __opts.length)];
      cells[__r][__c] = __color;
      if (!emptyVertices().length) { winner = "you"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 80);
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
