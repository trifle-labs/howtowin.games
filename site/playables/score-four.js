// Score Four — 4×4×4 cube with gravity. Pick a column (x, y); your bead falls
// to the lowest empty z on that peg. Win = 4-in-a-line anywhere in the cube.
// AI: 1-ply scoring of all 76 lines.

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = size + 40;
  const W = canvas.width, H = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) { canvas.style.width = W + 'px'; canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr); }
  const statusEl = document.getElementById("playable-status");

  const N = 4;
  // board[z][y*N + x] — 4 layers
  let cube, turn, winner;
  function newGame(){
    cube = [0, 1, 2, 3].map(() => new Array(N*N).fill('.'));
    turn = "you"; winner = null;
  }
  newGame();

  function drop(x, y, side){
    for (let z = 0; z < N; z++) if (cube[z][y*N + x] === '.'){ cube[z][y*N + x] = side; return z; }
    return -1;
  }

  // Generate all 76 lines in 4×4×4: 16 in each of 3 axes (48 axis lines) + 24 face diagonals + 4 space diagonals = 76.
  function genLines(){
    const lines = [];
    // axis: x varies
    for (let z = 0; z < N; z++) for (let y = 0; y < N; y++){ const l = []; for (let x = 0; x < N; x++) l.push([x,y,z]); lines.push(l); }
    for (let z = 0; z < N; z++) for (let x = 0; x < N; x++){ const l = []; for (let y = 0; y < N; y++) l.push([x,y,z]); lines.push(l); }
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++){ const l = []; for (let z = 0; z < N; z++) l.push([x,y,z]); lines.push(l); }
    // face diagonals
    for (let z = 0; z < N; z++){ const l1 = [], l2 = []; for (let i = 0; i < N; i++){ l1.push([i, i, z]); l2.push([i, N-1-i, z]); } lines.push(l1); lines.push(l2); }
    for (let y = 0; y < N; y++){ const l1 = [], l2 = []; for (let i = 0; i < N; i++){ l1.push([i, y, i]); l2.push([i, y, N-1-i]); } lines.push(l1); lines.push(l2); }
    for (let x = 0; x < N; x++){ const l1 = [], l2 = []; for (let i = 0; i < N; i++){ l1.push([x, i, i]); l2.push([x, i, N-1-i]); } lines.push(l1); lines.push(l2); }
    // space diagonals
    const sd = [[],[],[],[]];
    for (let i = 0; i < N; i++){
      sd[0].push([i, i, i]);
      sd[1].push([i, i, N-1-i]);
      sd[2].push([i, N-1-i, i]);
      sd[3].push([N-1-i, i, i]);
    }
    for (const s of sd) lines.push(s);
    return lines;
  }
  const LINES = genLines();

  function get(b, x, y, z){ return b[z][y*N + x]; }

  function wins(b, side){
    for (const line of LINES){
      let ok = true;
      for (const [x, y, z] of line) if (get(b, x, y, z) !== side){ ok = false; break; }
      if (ok) return true;
    }
    return false;
  }

  function score(b, side){
    let s = 0;
    for (const line of LINES){
      let my = 0, op = 0;
      for (const [x, y, z] of line){
        const v = get(b, x, y, z);
        if (v === side) my++; else if (v !== '.') op++;
      }
      if (op === 0 && my > 0) s += [0, 1, 5, 50, 10000][my];
    }
    return s;
  }

  function clone(){ return cube.map(l => l.slice()); }

  function legalCols(b){
    const out = [];
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++){
      if (b[N-1][y*N + x] === '.') out.push([x, y]);
    }
    return out;
  }

  function aiBest(){
    const cols = legalCols(cube);
    if (!cols.length) return null;
    // immediate win
    for (const [x, y] of cols){
      const nb = clone(); let z = -1; for (let zz = 0; zz < N; zz++) if (nb[zz][y*N + x] === '.'){ nb[zz][y*N + x] = 'w'; z = zz; break; }
      if (wins(nb, 'w')) return [x, y];
    }
    // block
    for (const [x, y] of cols){
      const nb = clone(); for (let zz = 0; zz < N; zz++) if (nb[zz][y*N + x] === '.'){ nb[zz][y*N + x] = 'b'; break; }
      if (wins(nb, 'b')) return [x, y];
    }
    let best = cols[0], bv = -Infinity;
    for (const [x, y] of cols){
      const nb = clone(); for (let zz = 0; zz < N; zz++) if (nb[zz][y*N + x] === '.'){ nb[zz][y*N + x] = 'w'; break; }
      const v = score(nb, 'w') - score(nb, 'b');
      if (v > bv){ bv = v; best = [x, y]; }
    }
    return best;
  }

  function aiMove(){
    if (winner) return;
    const c = aiBest(); if (!c){ winner = "draw"; draw(); return; }
    drop(c[0], c[1], 'w');
    if (wins(cube, 'w')){ winner = "ai"; draw(); return; }
    turn = "you"; draw();
  }

  function pegRect(x, y){
    const margin = 20, gap = 6, totW = size - 2*margin;
    const cellW = (totW - (N-1)*gap) / N;
    return { x: margin + x*(cellW + gap), y: 60 + y*(cellW + gap), w: cellW, h: cellW };
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "13px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";

    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++){
      const rc = pegRect(x, y);
      ctx.fillStyle = "#fff"; ctx.fillRect(rc.x, rc.y, rc.w, rc.h);
      ctx.strokeStyle = "#888"; ctx.strokeRect(rc.x, rc.y, rc.w, rc.h);
      // stack of 4 disks (z=0 bottom shown smallest)
      for (let z = 0; z < N; z++){
        const v = cube[z][y*N + x];
        if (v === '.') continue;
        const px = rc.x + 6 + z * (rc.w - 12) / (N - 1);
        const py = rc.y + rc.h - 8;
        ctx.beginPath(); ctx.arc(px, py - 4, 4, 0, Math.PI*2);
        ctx.fillStyle = v === 'b' ? "#39c" : "#e60"; ctx.fill();
      }
      // height number
      const filled = cube.filter(l => l[y*N + x] !== '.').length;
      ctx.font = "10px sans-serif"; ctx.fillStyle = "#888"; ctx.textAlign = "center";
      ctx.fillText(`${filled}/4`, rc.x + rc.w/2, rc.y + 12);
    }
    if (winner) statusEl.textContent = winner === "you" ? "you win!" : winner === "ai" ? "AI wins" : "draw";
    else statusEl.textContent = turn === "you" ? "click a peg to drop your bead" : "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }
  function findPeg(x, y){
    for (let yy = 0; yy < N; yy++) for (let xx = 0; xx < N; xx++){
      const rc = pegRect(xx, yy);
      if (x >= rc.x && x <= rc.x + rc.w && y >= rc.y && y <= rc.y + rc.h) return [xx, yy];
    }
    return null;
  }

  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e); const c = findPeg(x, y); if (!c) return;
    if (cube[N-1][c[1]*N + c[0]] !== '.') return;
    drop(c[0], c[1], 'b');
    if (wins(cube, 'b')){ winner = "you"; draw(); return; }
    turn = "ai"; draw(); setTimeout(aiMove, 500);
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve(){
      if (winner || turn !== "you") return;
      const __mvs = legalCols(cube);
      if (!__mvs.length) { winner = "ai"; draw(); return; }
      const [__x, __y] = __mvs[Math.floor(Math.random() * __mvs.length)];
      drop(__x, __y, 'b');
      if (wins(cube, 'b')){ winner = "you"; draw(); return; }
      turn = "ai"; draw();
      setTimeout(aiMove, 80);
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
