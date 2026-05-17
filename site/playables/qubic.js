// Qubic — free placement in a 4×4×4 cube (no gravity). 76 winning lines.
// AI: 1-ply scoring of all lines.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  function _fit(ctx, t, x, y, maxW){
    let f = parseFloat(ctx.font) || 12;
    while (f > 8 && ctx.measureText(t).width > maxW){ f--; ctx.font = ctx.font.replace(/[\d.]+px/, f + 'px'); }
    ctx.fillText(t, x, y);
  }

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = size + 40;
  const W = canvas.width, H = canvas.height;
  const statusEl = document.getElementById("playable-status");

  const N = 4;
  let board, turn, winner;
  function newGame(){ board = new Array(N*N*N).fill('.'); turn = "you"; winner = null; }
  newGame();

  function idx(x, y, z){ return z*N*N + y*N + x; }

  function genLines(){
    const lines = [];
    for (let z = 0; z < N; z++) for (let y = 0; y < N; y++){ const l = []; for (let x = 0; x < N; x++) l.push(idx(x,y,z)); lines.push(l); }
    for (let z = 0; z < N; z++) for (let x = 0; x < N; x++){ const l = []; for (let y = 0; y < N; y++) l.push(idx(x,y,z)); lines.push(l); }
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++){ const l = []; for (let z = 0; z < N; z++) l.push(idx(x,y,z)); lines.push(l); }
    for (let z = 0; z < N; z++){ const l1=[],l2=[]; for (let i=0;i<N;i++){ l1.push(idx(i,i,z)); l2.push(idx(i,N-1-i,z)); } lines.push(l1); lines.push(l2); }
    for (let y = 0; y < N; y++){ const l1=[],l2=[]; for (let i=0;i<N;i++){ l1.push(idx(i,y,i)); l2.push(idx(i,y,N-1-i)); } lines.push(l1); lines.push(l2); }
    for (let x = 0; x < N; x++){ const l1=[],l2=[]; for (let i=0;i<N;i++){ l1.push(idx(x,i,i)); l2.push(idx(x,i,N-1-i)); } lines.push(l1); lines.push(l2); }
    const sd = [[],[],[],[]];
    for (let i = 0; i < N; i++){ sd[0].push(idx(i,i,i)); sd[1].push(idx(i,i,N-1-i)); sd[2].push(idx(i,N-1-i,i)); sd[3].push(idx(N-1-i,i,i)); }
    for (const s of sd) lines.push(s);
    return lines;
  }
  const LINES = genLines();

  function wins(b, side){ for (const l of LINES){ let ok = true; for (const i of l) if (b[i] !== side){ ok = false; break; } if (ok) return true; } return false; }
  function score(b, side){
    let s = 0;
    for (const l of LINES){ let my = 0, op = 0; for (const i of l){ const v = b[i]; if (v === side) my++; else if (v !== '.') op++; } if (op === 0 && my > 0) s += [0, 1, 5, 50, 10000][my]; }
    return s;
  }
  function aiBest(){
    const moves = []; for (let i = 0; i < board.length; i++) if (board[i] === '.') moves.push(i);
    if (!moves.length) return -1;
    for (const i of moves){ const nb = board.slice(); nb[i] = 'w'; if (wins(nb, 'w')) return i; }
    for (const i of moves){ const nb = board.slice(); nb[i] = 'b'; if (wins(nb, 'b')) return i; }
    let best = moves[0], bv = -Infinity;
    for (const i of moves){ const nb = board.slice(); nb[i] = 'w'; const v = score(nb, 'w') - score(nb, 'b'); if (v > bv){ bv = v; best = i; } }
    return best;
  }
  function aiMove(){
    if (winner) return;
    const i = aiBest(); if (i < 0){ winner = "draw"; draw(); return; }
    board[i] = 'w';
    if (wins(board, 'w')){ winner = "ai"; draw(); return; }
    turn = "you"; draw();
  }

  function layerRect(z){
    const margin = 20, gap = 10;
    const layerW = (size - 2*margin - 3*gap) / N; // 4 layers side by side
    return { x: margin + z*(layerW + gap), y: 50, w: layerW, h: layerW };
  }
  function cellRect(x, y, z){
    const layer = layerRect(z); const cw = layer.w / N;
    return { x: layer.x + x*cw, y: layer.y + y*cw, w: cw, h: cw };
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "13px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";
    _fit(ctx, "Qubic — 4 layers of 4×4 (place freely); 4-in-line wins", W/2, 22, W - 8);
    ctx.font = "10px sans-serif";

    for (let z = 0; z < N; z++){
      const lr = layerRect(z);
      ctx.fillStyle = "#555"; ctx.fillText(`z=${z}`, lr.x + lr.w/2, lr.y - 4);
      for (let y = 0; y < N; y++) for (let x = 0; x < N; x++){
        const rc = cellRect(x, y, z);
        ctx.fillStyle = "#fff"; ctx.fillRect(rc.x, rc.y, rc.w, rc.h);
        ctx.strokeStyle = "#888"; ctx.strokeRect(rc.x, rc.y, rc.w, rc.h);
        const v = board[z*N*N + y*N + x];
        if (v !== '.'){
          ctx.beginPath(); ctx.arc(rc.x + rc.w/2, rc.y + rc.h/2, rc.w*0.32, 0, Math.PI*2);
          ctx.fillStyle = v === 'b' ? "#39c" : "#e60"; ctx.fill();
        }
      }
    }
    if (winner) statusEl.textContent = winner === "you" ? "you win!" : winner === "ai" ? "AI wins" : "draw";
    else statusEl.textContent = turn === "you" ? "click any empty cell across all 4 layers" : "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }
  function findCell(x, y){
    for (let z = 0; z < N; z++) for (let yy = 0; yy < N; yy++) for (let xx = 0; xx < N; xx++){
      const rc = cellRect(xx, yy, z);
      if (x >= rc.x && x <= rc.x + rc.w && y >= rc.y && y <= rc.y + rc.h) return z*N*N + yy*N + xx;
    }
    return -1;
  }
  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e); const i = findCell(x, y); if (i < 0 || board[i] !== '.') return;
    board[i] = 'b';
    if (wins(board, 'b')){ winner = "you"; draw(); return; }
    turn = "ai"; draw(); setTimeout(aiMove, 500);
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve(){
      if (winner || turn !== "you") return;
      const __mvs = []; for (let i = 0; i < board.length; i++) if (board[i] === '.') __mvs.push(i);
      if (!__mvs.length) { winner = "ai"; draw(); return; }
      const __mv = __mvs[Math.floor(Math.random() * __mvs.length)];
      board[__mv] = 'b';
      if (wins(board, 'b')){ winner = "you"; draw(); return; }
      turn = "ai"; draw();
      setTimeout(aiMove, 80);
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
