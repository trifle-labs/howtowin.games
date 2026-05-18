// Slitherlink — a fixed 5×5 puzzle. Click an edge to toggle between dot/line/X.
// Click counts under each numbered cell must match exactly; the lines must form
// a single closed loop. SOLVED button reveals the solution.

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = size + 40;
  const W = canvas.width, H = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) { canvas.style.width = W + 'px'; canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr); }
  const statusEl = document.getElementById("playable-status");

  // A small 5×5 Slitherlink puzzle (rows=cells). Use -1 for blank.
  const PUZZLE = [
    [-1, 3, -1, -1, 2],
    [ 1, -1, -1, -1, -1],
    [-1, -1, 2, 3, -1],
    [-1, -1, -1, -1, 2],
    [ 3, -1, -1, 1, -1],
  ];
  // Hand-crafted solution loop expressed as horizontal edges (rows×(cols+1)... actually edges):
  // Horizontal edge between row r and row r+1 at column c is H[r][c] (r in 0..N, c in 0..N-1)
  // Vertical edge between col c and col c+1 at row r is V[r][c] (r in 0..N-1, c in 0..N)
  const N = 5;
  const SOL_H = [
    [0,1,1,1,1],
    [1,0,0,0,1],
    [1,1,0,1,0],
    [0,0,1,0,1],
    [0,0,0,1,1],
    [1,1,1,1,0],
  ];
  const SOL_V = [
    [1,0,0,0,0,1],
    [0,1,1,1,0,1],
    [0,1,0,0,1,1],
    [0,1,1,1,0,1],
    [1,0,0,0,0,1],
  ];

  // Collect all solution edges in a flat array for step-wise solving
  const SOL_EDGES = [];
  for (let r = 0; r <= N; r++) for (let c = 0; c < N; c++) if (SOL_H[r][c]) SOL_EDGES.push({ kind: 'H', r, c });
  for (let r = 0; r < N; r++) for (let c = 0; c <= N; c++) if (SOL_V[r][c]) SOL_EDGES.push({ kind: 'V', r, c });

  let H_state, V_state, showSol, solveEdgeIdx;
  function newGame(){
    H_state = Array.from({ length: N+1 }, () => new Array(N).fill(0)); // 0=blank, 1=line, 2=X
    V_state = Array.from({ length: N }, () => new Array(N+1).fill(0));
    showSol = false;
    solveEdgeIdx = 0;
  }
  newGame();

  function cellPos(){ const margin = 30, cs = (size - 2*margin) / N; return { margin, cs }; }
  function vertex(r, c){ const { margin, cs } = cellPos(); return { x: margin + c*cs, y: 30 + r*cs }; }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "13px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";

    const { cs } = cellPos();
    // numbers
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const v = PUZZLE[r][c]; if (v < 0) continue;
      const p1 = vertex(r, c), p2 = vertex(r+1, c+1);
      ctx.fillStyle = "#222"; ctx.font = "14px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(v.toString(), (p1.x + p2.x)/2, (p1.y + p2.y)/2);
    }
    ctx.textBaseline = "alphabetic";

    // grid dots
    for (let r = 0; r <= N; r++) for (let c = 0; c <= N; c++){
      const p = vertex(r, c);
      ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI*2); ctx.fillStyle = "#444"; ctx.fill();
    }

    // horizontal edges
    for (let r = 0; r <= N; r++) for (let c = 0; c < N; c++){
      const p1 = vertex(r, c), p2 = vertex(r, c+1);
      const v = showSol ? SOL_H[r][c] : H_state[r][c];
      if (v === 1){ ctx.strokeStyle = "#39c"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke(); }
      else if (v === 2 && !showSol){ ctx.fillStyle = "#c22"; ctx.font = "10px sans-serif"; ctx.fillText("×", (p1.x+p2.x)/2, p1.y + 4); }
    }
    // vertical edges
    for (let r = 0; r < N; r++) for (let c = 0; c <= N; c++){
      const p1 = vertex(r, c), p2 = vertex(r+1, c);
      const v = showSol ? SOL_V[r][c] : V_state[r][c];
      if (v === 1){ ctx.strokeStyle = "#39c"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke(); }
      else if (v === 2 && !showSol){ ctx.fillStyle = "#c22"; ctx.font = "10px sans-serif"; ctx.fillText("×", p1.x, (p1.y+p2.y)/2 + 4); }
    }
    ctx.lineWidth = 1;

    // SOLVE button
    ctx.fillStyle = "#cef2cf"; ctx.fillRect(W/2 - 50, H - 32, 100, 24);
    ctx.strokeStyle = "#444"; ctx.strokeRect(W/2 - 50, H - 32, 100, 24);
    ctx.fillStyle = "#222"; ctx.font = "13px sans-serif"; ctx.fillText(showSol ? "HIDE" : "SOLVE", W/2, H - 14);

    const playerSolved = !showSol && solveEdgeIdx >= SOL_EDGES.length && SOL_EDGES.length > 0;
    statusEl.textContent = showSol ? "showing solution" : playerSolved ? "solved!" : "click edges to toggle line / × / blank";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }

  function onClick(e){
    const { x, y } = pos(e);
    // solve button
    if (x >= W/2 - 50 && x <= W/2 + 50 && y >= H - 32 && y <= H - 8){
      showSol = !showSol; draw(); return;
    }
    if (showSol) return;
    const { cs, margin } = cellPos();
    // find closest edge
    let bestKind = null, bestR = 0, bestC = 0, bestD = Infinity;
    for (let r = 0; r <= N; r++) for (let c = 0; c < N; c++){
      const p1 = vertex(r, c), p2 = vertex(r, c+1);
      const mx = (p1.x+p2.x)/2, my = p1.y;
      const d = Math.hypot(x - mx, y - my);
      if (d < bestD){ bestD = d; bestKind = 'H'; bestR = r; bestC = c; }
    }
    for (let r = 0; r < N; r++) for (let c = 0; c <= N; c++){
      const p1 = vertex(r, c), p2 = vertex(r+1, c);
      const mx = p1.x, my = (p1.y+p2.y)/2;
      const d = Math.hypot(x - mx, y - my);
      if (d < bestD){ bestD = d; bestKind = 'V'; bestR = r; bestC = c; }
    }
    if (bestD > cs * 0.4) return;
    if (bestKind === 'H'){ H_state[bestR][bestC] = (H_state[bestR][bestC] + 1) % 3; }
    else { V_state[bestR][bestC] = (V_state[bestR][bestC] + 1) % 3; }
    draw();
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve(){
      if (showSol) return;
      if (solveEdgeIdx >= SOL_EDGES.length) { draw(); return; }
      // Place the next solution edge (set state to 1=line), skip if already set
      while (solveEdgeIdx < SOL_EDGES.length) {
        const e = SOL_EDGES[solveEdgeIdx];
        const cur = e.kind === 'H' ? H_state[e.r][e.c] : V_state[e.r][e.c];
        if (cur !== 1) {
          if (e.kind === 'H') H_state[e.r][e.c] = 1;
          else V_state[e.r][e.c] = 1;
          solveEdgeIdx++;
          draw(); return;
        }
        solveEdgeIdx++;
      }
      draw();
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
