// Quixo — 5×5 cube grid. Take a blank or own-marked cube from the BORDER, set
// it to your mark, push it back into a row/column from the opposite end.
// First 5-in-a-row wins.
// AI: heuristic — score each (cube, direction) by lines created.

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = size + 60;
  const W = canvas.width, H = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) { canvas.style.width = W + 'px'; canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr); }
  const statusEl = document.getElementById("playable-status");

  const N = 5;
  let board, turn, winner, sel; // sel: chosen border cube index
  function newGame(){ board = new Array(N*N).fill('.'); turn = "you"; winner = null; sel = -1; }
  newGame();

  const DIRS = [[0,1],[1,0],[1,1],[1,-1]];
  function fiveInRow(b, side){
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      for (const [dr, dc] of DIRS){
        const r4 = r + 4*dr, c4 = c + 4*dc;
        if (r4 < 0 || r4 >= N || c4 < 0 || c4 >= N) continue;
        let ok = true;
        for (let k = 0; k < 5; k++) if (b[(r+k*dr)*N + c + k*dc] !== side){ ok = false; break; }
        if (ok) return true;
      }
    }
    return false;
  }

  function isBorder(r, c){ return r === 0 || r === N - 1 || c === 0 || c === N - 1; }

  function pushOptions(r, c){
    // returns array of directions you can push from this border cube
    const opts = [];
    if (r === 0 && r !== N - 1) opts.push("down"); else if (r === N - 1 && r !== 0) opts.push("up");
    else if (r > 0 && r < N - 1) { /* not a row endpoint */ }
    // Actually push direction is along the row/column away from the pick side.
    // Standard Quixo: take from border, push back IN from the opposite side.
    // If on top edge (r=0): push down (or sideways if on a column edge too).
    // If on bottom edge (r=N-1): push up.
    // If on left edge (c=0): push right.
    // If on right edge (c=N-1): push left.
    const out = [];
    if (r === 0) out.push("down");
    if (r === N - 1) out.push("up");
    if (c === 0) out.push("right");
    if (c === N - 1) out.push("left");
    return [...new Set(out)];
  }

  function apply(b, r, c, dir, side){
    const nb = b.slice(); nb[r*N + c] = side;
    const v = nb[r*N + c];
    if (dir === "down"){
      // remove from (r,c)=top; slide column down; insert at top? Wait — standard Quixo: pick up from border, slide ROW/COL, insert from opposite end.
      // Actually: you remove the cube from its border position, and slide that row/column to fill the gap, then insert the (now-yours) cube at the OPPOSITE end.
      // Implementation: shift along the chosen axis.
      // For simplicity: dir corresponds to "the side you push from" — opposite of pickup.
      // dir = "down" means pickup was top (r=0), insert at bottom; slide column up by 1.
      // Wait — let me redo: pick up from (r0, c0). Choose to push back into column c0 from the bottom: shift rows in column c0 up by one, place at (N-1, c0). Or push into row r0 from the right: shift row r0 left by one, place at (r0, N-1). Etc.
      // dir = "down" → pickup from top (r=0), push into column c, sliding column UP by 1, place at (N-1, c)
      for (let i = 0; i < N - 1; i++) nb[i*N + c] = nb[(i+1)*N + c];
      nb[(N-1)*N + c] = side;
    } else if (dir === "up"){
      for (let i = N - 1; i > 0; i--) nb[i*N + c] = nb[(i-1)*N + c];
      nb[0*N + c] = side;
    } else if (dir === "right"){
      for (let j = 0; j < N - 1; j++) nb[r*N + j] = nb[r*N + j + 1];
      nb[r*N + N - 1] = side;
    } else if (dir === "left"){
      for (let j = N - 1; j > 0; j--) nb[r*N + j] = nb[r*N + j - 1];
      nb[r*N + 0] = side;
    }
    return nb;
  }

  function legalCubes(side){
    const out = [];
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      if (!isBorder(r, c)) continue;
      if (board[r*N + c] !== '.' && board[r*N + c] !== side) continue;
      out.push([r, c]);
    }
    return out;
  }

  function score(b, side){
    let s = 0;
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      for (const [dr, dc] of DIRS){
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
    const cubes = legalCubes('w');
    let best = null, bv = -Infinity;
    for (const [r, c] of cubes){
      for (const dir of pushOptions(r, c)){
        const nb = apply(board, r, c, dir, 'w');
        if (fiveInRow(nb, 'w')) return { r, c, dir };
        if (fiveInRow(nb, 'b')) continue; // never make a move that gives opponent the win
        const v = score(nb, 'w') - score(nb, 'b');
        if (v > bv){ bv = v; best = { r, c, dir }; }
      }
    }
    if (!best && cubes.length){ const [r, c] = cubes[0]; best = { r, c, dir: pushOptions(r, c)[0] }; }
    return best;
  }

  function aiMove(){
    if (winner) return;
    const mv = aiBest(); if (!mv){ winner = "draw"; draw(); return; }
    board = apply(board, mv.r, mv.c, mv.dir, 'w');
    if (fiveInRow(board, 'w')){ winner = "ai"; draw(); return; }
    if (fiveInRow(board, 'b')){ winner = "you"; draw(); return; }
    turn = "you"; draw();
  }

  function cellSize(){ const margin = 20; return (size - 2*margin) / N; }
  function cellRect(r, c){ const margin = 20, cs = cellSize(); return { x: margin + c*cs, y: 30 + r*cs, w: cs, h: cs }; }

  function dirBtnRect(idx){ const by = 30 + N*cellSize() + 10; return { x: 20 + idx*70, y: by, w: 64, h: 24 }; }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "13px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";

    const legal = (turn === "you" && !winner && sel < 0) ? legalCubes('b') : [];
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const rc = cellRect(r, c), i = r*N + c;
      ctx.fillStyle = (sel === i) ? "#ffe9b0" : legal.some(([lr, lc]) => lr*N + lc === i) ? "#cef2cf" : "#fff";
      ctx.fillRect(rc.x, rc.y, rc.w, rc.h);
      ctx.strokeStyle = "#888"; ctx.strokeRect(rc.x, rc.y, rc.w, rc.h);
      if (board[i] !== '.'){
        ctx.font = "20px sans-serif"; ctx.textBaseline = "middle";
        ctx.fillStyle = board[i] === 'b' ? "#39c" : "#e60";
        ctx.fillText(board[i] === 'b' ? "X" : "O", rc.x + rc.w/2, rc.y + rc.h/2);
        ctx.textBaseline = "alphabetic";
      }
    }
    if (sel >= 0){
      const r = Math.floor(sel/N), c = sel%N;
      const dirs = pushOptions(r, c);
      ctx.font = "12px sans-serif"; ctx.textBaseline = "middle";
      dirs.forEach((d, ix) => {
        const b = dirBtnRect(ix);
        ctx.fillStyle = "#5a7"; ctx.fillRect(b.x, b.y, b.w, b.h);
        ctx.fillStyle = "#fff"; ctx.fillText(d, b.x + b.w/2, b.y + b.h/2);
      });
      ctx.textBaseline = "alphabetic";
    }
    if (winner) statusEl.textContent = winner === "you" ? "you win!" : winner === "ai" ? "AI wins" : "draw";
    else statusEl.textContent = turn === "you" ? (sel < 0 ? "click a green border cube" : "click a direction button below") : "AI thinking…";
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
    if (sel < 0){
      const i = findCell(x, y); if (i < 0) return;
      const r = Math.floor(i/N), c = i%N;
      if (!isBorder(r, c)) return;
      if (board[i] !== '.' && board[i] !== 'b') return;
      sel = i; draw(); return;
    }
    // direction button click
    const r = Math.floor(sel/N), c = sel%N;
    const dirs = pushOptions(r, c);
    for (let ix = 0; ix < dirs.length; ix++){
      const b = dirBtnRect(ix);
      if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h){
        board = apply(board, r, c, dirs[ix], 'b'); sel = -1;
        if (fiveInRow(board, 'b')){ winner = "you"; draw(); return; }
        if (fiveInRow(board, 'w')){ winner = "ai"; draw(); return; }
        turn = "ai"; draw(); setTimeout(aiMove, 500); return;
      }
    }
    // click elsewhere = cancel selection
    sel = -1; draw();
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve(){
      if (winner || turn !== "you") return;
      const __cubes = legalCubes('b');
      if (!__cubes.length) { winner = "ai"; draw(); return; }
      const [__r, __c] = __cubes[Math.floor(Math.random() * __cubes.length)];
      const __dirs = pushOptions(__r, __c);
      const __dir = __dirs[Math.floor(Math.random() * __dirs.length)];
      board = apply(board, __r, __c, __dir, 'b'); sel = -1;
      if (fiveInRow(board, 'b')){ winner = "you"; draw(); return; }
      if (fiveInRow(board, 'w')){ winner = "ai"; draw(); return; }
      turn = "ai"; draw();
      setTimeout(aiMove, 80);
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
