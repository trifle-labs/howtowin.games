// Pente — 9×9 mini version. 5-in-a-row wins; custodial capture of an enemy
// pair flanked by your stones removes them; 5 captures (10 stones) also wins.
// AI: heuristic-based search picking the move with the best score.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = size + 50;
  const W = canvas.width, H = canvas.height;
  const statusEl = document.getElementById("playable-status");

  const N = 9;
  let board, turn, winner, captures;
  function newGame(){
    board = new Array(N*N).fill('.'); turn = "you"; winner = null;
    captures = { b: 0, w: 0 };
  }
  newGame();

  const DIRS = [[0,1],[1,0],[1,1],[1,-1]];

  function place(b, r, c, side, caps){
    b[r*N + c] = side;
    const enemy = side === 'b' ? 'w' : 'b';
    for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[1,1],[-1,1],[1,-1]]){
      const r1 = r + dr, c1 = c + dc, r2 = r + 2*dr, c2 = c + 2*dc, r3 = r + 3*dr, c3 = c + 3*dc;
      if (r3 < 0 || r3 >= N || c3 < 0 || c3 >= N) continue;
      if (b[r1*N+c1] === enemy && b[r2*N+c2] === enemy && b[r3*N+c3] === side){
        b[r1*N+c1] = '.'; b[r2*N+c2] = '.';
        if (caps) caps[side]++;
      }
    }
  }

  function fiveInRow(b, side){
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      for (const [dr, dc] of DIRS){
        const r4 = r + 4*dr, c4 = c + 4*dc;
        if (r4 < 0 || r4 >= N || c4 < 0 || c4 >= N) continue;
        let ok = true;
        for (let k = 0; k < 5; k++){
          if (b[(r + k*dr)*N + (c + k*dc)] !== side){ ok = false; break; }
        }
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
          const v = b[(r + k*dr)*N + (c + k*dc)];
          if (v === side) my++; else if (v !== '.') op++;
        }
        if (op === 0 && my > 0) s += [0, 1, 4, 30, 200, 10000][my];
      }
    }
    return s;
  }

  function aiBest(){
    const moves = [];
    for (let i = 0; i < N*N; i++) if (board[i] === '.') moves.push(i);
    if (!moves.length) return -1;
    // immediate win
    for (const i of moves){
      const nb = board.slice(); const nc = { b: captures.b, w: captures.w };
      place(nb, Math.floor(i/N), i%N, 'w', nc);
      if (fiveInRow(nb, 'w') || nc.w >= 5) return i;
    }
    // block immediate win
    for (const i of moves){
      const nb = board.slice(); const nc = { b: captures.b, w: captures.w };
      place(nb, Math.floor(i/N), i%N, 'b', nc);
      if (fiveInRow(nb, 'b') || nc.b >= 5) return i;
    }
    // heuristic
    let best = moves[0], bv = -Infinity;
    for (const i of moves){
      const nb = board.slice(); const nc = { b: captures.b, w: captures.w };
      place(nb, Math.floor(i/N), i%N, 'w', nc);
      const v = score(nb, 'w') - score(nb, 'b') + 50*(nc.w - captures.w);
      if (v > bv){ bv = v; best = i; }
    }
    return best;
  }

  function aiMove(){
    if (winner) return;
    const i = aiBest(); if (i < 0){ winner = "draw"; draw(); return; }
    place(board, Math.floor(i/N), i%N, 'w', captures);
    if (fiveInRow(board, 'w') || captures.w >= 5){ winner = "ai"; draw(); return; }
    turn = "you"; draw();
  }

  function cellRect(r, c){
    const margin = 20, cw = (size - 2*margin) / N;
    return { x: margin + c*cw, y: 30 + r*cw, w: cw, h: cw };
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "13px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";
    ctx.fillText(`Pente — 9×9 mini · captures you ${captures.b} / 5 · ai ${captures.w} / 5`, W/2, 22);

    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const rc = cellRect(r, c), i = r*N + c;
      ctx.fillStyle = "#f0e2c0"; ctx.fillRect(rc.x, rc.y, rc.w, rc.h);
      ctx.strokeStyle = "#888"; ctx.strokeRect(rc.x, rc.y, rc.w, rc.h);
      if (board[i] !== '.'){
        ctx.beginPath(); ctx.arc(rc.x + rc.w/2, rc.y + rc.h/2, rc.w*0.4, 0, Math.PI*2);
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
    place(board, Math.floor(i/N), i%N, 'b', captures);
    if (fiveInRow(board, 'b') || captures.b >= 5){ winner = "you"; draw(); return; }
    turn = "ai"; draw(); setTimeout(aiMove, 500);
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve(){
      if (winner || turn !== "you") return;
      const __mvs = [];
      for (let i = 0; i < N*N; i++) if (board[i] === '.') __mvs.push(i);
      if (!__mvs.length) { winner = "draw"; draw(); return; }
      const __i = __mvs[Math.floor(Math.random() * __mvs.length)];
      place(board, Math.floor(__i/N), __i%N, 'b', captures);
      if (fiveInRow(board, 'b') || captures.b >= 5){ winner = "you"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 80);
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
