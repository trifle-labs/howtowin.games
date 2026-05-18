// Pentago — 6×6 board, four 3×3 quadrants. Each turn: place a marble, then
// rotate any quadrant 90°. Win = 5-in-a-row (post-rotation).
// AI: heuristic — pick the (placement, rotation) that maximises score.

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = size + 60;
  const W = canvas.width, H = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) { canvas.style.width = W + 'px'; canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr); }
  const statusEl = document.getElementById("playable-status");

  const N = 6;
  let board, turn, winner, phase, lastPlaced;
  function newGame(){
    board = new Array(N*N).fill('.'); turn = "you"; winner = null;
    phase = "place"; lastPlaced = -1;
  }
  newGame();

  function rotateQuad(b, qr, qc, dir){
    // qr, qc in {0, 1}; dir +1 = clockwise, -1 = ccw
    const nb = b.slice();
    const r0 = qr*3, c0 = qc*3;
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++){
      const sr = (dir > 0) ? c : (2 - c);
      const sc = (dir > 0) ? (2 - r) : r;
      nb[(r0 + r)*N + c0 + c] = b[(r0 + sr)*N + c0 + sc];
    }
    return nb;
  }

  function fiveInRow(b, side){
    const dirs = [[0,1],[1,0],[1,1],[1,-1]];
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      for (const [dr, dc] of dirs){
        const r4 = r + 4*dr, c4 = c + 4*dc;
        if (r4 < 0 || r4 >= N || c4 < 0 || c4 >= N) continue;
        let ok = true;
        for (let k = 0; k < 5; k++) if (b[(r+k*dr)*N + c + k*dc] !== side){ ok = false; break; }
        if (ok) return true;
      }
    }
    return false;
  }

  function score(b, side){
    let s = 0; const dirs = [[0,1],[1,0],[1,1],[1,-1]];
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      for (const [dr, dc] of dirs){
        const r4 = r + 4*dr, c4 = c + 4*dc;
        if (r4 < 0 || r4 >= N || c4 < 0 || c4 >= N) continue;
        let my = 0, op = 0;
        for (let k = 0; k < 5; k++){
          const v = b[(r+k*dr)*N + c + k*dc];
          if (v === side) my++; else if (v !== '.') op++;
        }
        if (op === 0 && my > 0) s += [0, 1, 5, 30, 200, 10000][my];
      }
    }
    return s;
  }

  function aiBest(){
    let best = null, bv = -Infinity;
    for (let i = 0; i < N*N; i++) if (board[i] === '.'){
      const placed = board.slice(); placed[i] = 'w';
      for (let qr = 0; qr < 2; qr++) for (let qc = 0; qc < 2; qc++) for (const dir of [1, -1]){
        const rotated = rotateQuad(placed, qr, qc, dir);
        if (fiveInRow(rotated, 'w')) return { i, qr, qc, dir };
        if (fiveInRow(rotated, 'b')) continue;
        const v = score(rotated, 'w') - score(rotated, 'b');
        if (v > bv){ bv = v; best = { i, qr, qc, dir }; }
      }
    }
    return best;
  }

  function aiMove(){
    if (winner) return;
    const mv = aiBest(); if (!mv){ winner = "draw"; draw(); return; }
    board[mv.i] = 'w';
    board = rotateQuad(board, mv.qr, mv.qc, mv.dir);
    if (fiveInRow(board, 'w')){ winner = "ai"; draw(); return; }
    if (fiveInRow(board, 'b')){ winner = "you"; draw(); return; }
    turn = "you"; phase = "place"; draw();
  }

  function cellRect(r, c){
    const margin = 20, cw = (size - 2*margin) / N;
    return { x: margin + c*cw, y: 30 + r*cw, w: cw, h: cw };
  }

  function quadBtnRect(qr, qc, dir){
    // small buttons placed below the board for rotating each quadrant
    const cw = cellRect(0,0).w;
    const x = 20 + qc*3*cw + (dir > 0 ? 2*cw : 0), y = 30 + 6*cw + 6 + qr*22;
    return { x, y, w: cw, h: 18 };
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "13px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";

    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const rc = cellRect(r, c), i = r*N + c;
      const qr = Math.floor(r/3), qc = Math.floor(c/3);
      ctx.fillStyle = ((qr + qc) % 2 === 0) ? "#eef" : "#dde";
      if (lastPlaced === i) ctx.fillStyle = "#ffe9b0";
      ctx.fillRect(rc.x, rc.y, rc.w, rc.h);
      ctx.strokeStyle = "#888"; ctx.strokeRect(rc.x, rc.y, rc.w, rc.h);
      if (board[i] !== '.'){
        ctx.beginPath(); ctx.arc(rc.x + rc.w/2, rc.y + rc.h/2, rc.w*0.35, 0, Math.PI*2);
        ctx.fillStyle = board[i] === 'b' ? "#39c" : "#e60"; ctx.fill();
      }
    }
    // rotation buttons (only when phase is "rotate")
    if (phase === "rotate"){
      ctx.font = "11px sans-serif"; ctx.textBaseline = "middle";
      for (let qr = 0; qr < 2; qr++) for (let qc = 0; qc < 2; qc++) for (const dir of [1, -1]){
        const b = quadBtnRect(qr, qc, dir);
        ctx.fillStyle = "#5a7"; ctx.fillRect(b.x, b.y, b.w, b.h);
        ctx.fillStyle = "#fff"; ctx.fillText(`Q${qr}${qc} ${dir>0?'↻':'↺'}`, b.x + b.w/2, b.y + b.h/2);
      }
      ctx.textBaseline = "alphabetic";
    }
    if (winner) statusEl.textContent = winner === "you" ? "you win!" : winner === "ai" ? "AI wins" : "draw";
    else if (phase === "place") statusEl.textContent = turn === "you" ? "click an empty cell to place" : "AI placing…";
    else statusEl.textContent = "click a rotation button below the board";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }
  function findCell(x, y){
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const rc = cellRect(r, c);
      if (x >= rc.x && x <= rc.x + rc.w && y >= rc.y && y <= rc.y + rc.h) return r*N + c;
    }
    return -1;
  }

  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e);
    if (phase === "place"){
      const i = findCell(x, y); if (i < 0 || board[i] !== '.') return;
      board[i] = 'b'; lastPlaced = i; phase = "rotate"; draw();
      return;
    }
    // rotate phase
    for (let qr = 0; qr < 2; qr++) for (let qc = 0; qc < 2; qc++) for (const dir of [1, -1]){
      const b = quadBtnRect(qr, qc, dir);
      if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h){
        board = rotateQuad(board, qr, qc, dir);
        if (fiveInRow(board, 'b')){ winner = "you"; draw(); return; }
        if (fiveInRow(board, 'w')){ winner = "ai"; draw(); return; }
        turn = "ai"; lastPlaced = -1; draw(); setTimeout(aiMove, 500);
        return;
      }
    }
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve(){
      if (winner || turn !== "you") return;
      // place phase
      if (phase === "place"){
        const __empty = [];
        for (let i = 0; i < N*N; i++) if (board[i] === '.') __empty.push(i);
        if (!__empty.length) { winner = "draw"; draw(); return; }
        const __i = __empty[Math.floor(Math.random() * __empty.length)];
        board[__i] = 'b'; lastPlaced = __i; phase = "rotate"; draw();
      }
      // rotate phase (immediately follow up)
      if (phase === "rotate"){
        const __rots = [];
        for (let qr = 0; qr < 2; qr++) for (let qc = 0; qc < 2; qc++) for (const dir of [1, -1]) __rots.push({qr, qc, dir});
        const __r = __rots[Math.floor(Math.random() * __rots.length)];
        board = rotateQuad(board, __r.qr, __r.qc, __r.dir);
        if (fiveInRow(board, 'b')){ winner = "you"; draw(); return; }
        if (fiveInRow(board, 'w')){ winner = "ai"; draw(); return; }
        turn = "ai"; phase = "place"; lastPlaced = -1; draw(); setTimeout(aiMove, 80);
      }
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
