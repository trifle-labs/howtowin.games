// Gomoku — 9×9 mini variant of five-in-a-row (free Gomoku, no forbidden moves).
// AI: heuristic scoring of all open k-in-row windows around the candidate cell.

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = size + 50;
  const W = canvas.width, H = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) { canvas.style.width = W + 'px'; canvas.style.height = H + 'px'; canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr); }
  const statusEl = document.getElementById("playable-status");

  const N = 9;
  let board, turn, winner;
  function newGame(){ board = new Array(N*N).fill('.'); turn = "you"; winner = null; }
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
        if (op === 0 && my > 0) s += [0, 1, 5, 30, 250, 10000][my];
      }
    }
    return s;
  }

  function aiBest(){
    const moves = [];
    for (let i = 0; i < N*N; i++) if (board[i] === '.') moves.push(i);
    if (!moves.length) return -1;
    for (const i of moves){ const nb = board.slice(); nb[i] = 'w'; if (fiveInRow(nb, 'w')) return i; }
    for (const i of moves){ const nb = board.slice(); nb[i] = 'b'; if (fiveInRow(nb, 'b')) return i; }
    let best = moves[0], bv = -Infinity;
    for (const i of moves){
      const nb = board.slice(); nb[i] = 'w';
      const v = score(nb, 'w') - score(nb, 'b');
      if (v > bv){ bv = v; best = i; }
    }
    return best;
  }

  function aiMove(){
    if (winner) return;
    const i = aiBest(); if (i < 0){ winner = "draw"; draw(); return; }
    board[i] = 'w';
    if (fiveInRow(board, 'w')){ winner = "ai"; draw(); return; }
    turn = "you"; draw();
  }

  function cellRect(r, c){
    const margin = 20, cw = (size - 2*margin) / N;
    return { x: margin + c*cw, y: 30 + r*cw, w: cw, h: cw };
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);

    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const rc = cellRect(r, c), i = r*N + c;
      ctx.fillStyle = "#f0e2c0"; ctx.fillRect(rc.x, rc.y, rc.w, rc.h);
      ctx.strokeStyle = "#888"; ctx.strokeRect(rc.x, rc.y, rc.w, rc.h);
      if (board[i] !== '.'){
        ctx.beginPath(); ctx.arc(rc.x + rc.w/2, rc.y + rc.h/2, rc.w*0.38, 0, Math.PI*2);
        ctx.fillStyle = board[i] === 'b' ? "#222" : "#eee"; ctx.fill();
        ctx.strokeStyle = "#444"; ctx.stroke();
      }
    }
    if (winner) statusEl.textContent = winner === "you" ? "you win!" : winner === "ai" ? "AI wins" : "draw";
    else statusEl.textContent = turn === "you" ? "click an empty cell to place a black stone" : "AI thinking…";
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
    const { x, y } = pos(e); const i = findCell(x, y); if (i < 0) return;
    if (board[i] !== '.') return;
    board[i] = 'b';
    if (fiveInRow(board, 'b')){ winner = "you"; draw(); return; }
    turn = "ai"; draw(); setTimeout(aiMove, 500);
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve(){
      if (winner || turn !== "you") return;
      const __mvs = []; for (let i = 0; i < N*N; i++) if (board[i] === '.') __mvs.push(i);
      if (!__mvs.length){ winner = "draw"; draw(); return; }
      const __mv = __mvs[Math.floor(Math.random() * __mvs.length)];
      board[__mv] = 'b';
      if (fiveInRow(board, 'b')){ winner = "you"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 80);
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
