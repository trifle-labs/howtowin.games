// Connect6 — 13×13 mini. Players place TWO stones per turn (except the
// opening: black's first turn places only ONE). 6-in-a-row wins.
// AI: line-scoring heuristic over all 2-stone placements (sampled).

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = size + 40;
  const W = canvas.width, H = canvas.height;
  const statusEl = document.getElementById("playable-status");

  const N = 13;
  let board, turn, winner, moveNum, pending;
  function newGame(){
    board = new Array(N*N).fill('.');
    turn = "you"; winner = null; moveNum = 0; pending = null;
  }
  newGame();

  const DIRS = [[1,0],[0,1],[1,1],[1,-1]];

  function wins(b, side){
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      if (b[r*N + c] !== side) continue;
      for (const [dr, dc] of DIRS){
        let k = 0;
        for (let i = 0; i < 6; i++){
          const nr = r + dr*i, nc = c + dc*i;
          if (nr < 0 || nr >= N || nc < 0 || nc >= N) break;
          if (b[nr*N + nc] !== side) break;
          k++;
        }
        if (k >= 6) return true;
      }
    }
    return false;
  }

  function lineScore(b, side){
    // count windows of 6 with own/enemy
    let s = 0;
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      for (const [dr, dc] of DIRS){
        const nr = r + dr*5, nc = c + dc*5;
        if (nr < 0 || nr >= N || nc < 0 || nc >= N) continue;
        let my = 0, op = 0;
        for (let i = 0; i < 6; i++){
          const v = b[(r+dr*i)*N + (c+dc*i)];
          if (v === side) my++; else if (v !== '.') op++;
        }
        if (op === 0 && my > 0) s += [0, 1, 5, 25, 100, 500, 100000][my];
      }
    }
    return s;
  }

  function neighborhoodMoves(){
    const set = new Set();
    let any = false;
    for (let i = 0; i < N*N; i++) if (board[i] !== '.'){
      any = true;
      const r = Math.floor(i/N), c = i%N;
      for (let dr = -2; dr <= 2; dr++) for (let dc = -2; dc <= 2; dc++){
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nr >= N || nc < 0 || nc >= N) continue;
        if (board[nr*N + nc] === '.') set.add(nr*N + nc);
      }
    }
    if (!any) return [Math.floor(N/2)*N + Math.floor(N/2)];
    return [...set];
  }

  function aiBest(){
    const cand = neighborhoodMoves();
    if (!cand.length) return null;
    // 2-stone placement: try best single, then best second given first
    const placeCount = (moveNum === 0) ? 1 : 2;
    // immediate win or block
    for (const i of cand){
      board[i] = 'w'; if (wins(board, 'w')){ board[i] = '.'; return [i, -1]; } board[i] = '.';
    }
    for (const i of cand){
      board[i] = 'b'; if (wins(board, 'b')){ board[i] = '.'; return [i, -1]; } board[i] = '.';
    }
    let best = [cand[0], placeCount === 2 ? cand[Math.min(1, cand.length-1)] : -1], bv = -Infinity;
    for (const i of cand){
      board[i] = 'w';
      if (placeCount === 1){
        const s = lineScore(board, 'w') - lineScore(board, 'b');
        if (s > bv){ bv = s; best = [i, -1]; }
        board[i] = '.';
        continue;
      }
      for (const j of cand){
        if (j === i) continue;
        board[j] = 'w';
        const s = lineScore(board, 'w') - lineScore(board, 'b');
        if (s > bv){ bv = s; best = [i, j]; }
        board[j] = '.';
      }
      board[i] = '.';
    }
    return best;
  }

  function aiMove(){
    if (winner) return;
    const m = aiBest(); if (!m){ winner = "draw"; draw(); return; }
    board[m[0]] = 'w';
    if (m[1] >= 0) board[m[1]] = 'w';
    if (wins(board, 'w')){ winner = "ai"; draw(); return; }
    moveNum++;
    turn = "you"; pending = null; draw();
  }

  function cellPos(r, c){
    const margin = 20, cs = (size - 2*margin) / (N - 1);
    return { x: margin + c*cs, y: 40 + r*cs, cs };
  }

  function draw(){
    ctx.fillStyle = "#f5e0b8"; ctx.fillRect(0, 0, W, H);

    // grid lines
    const cs = (size - 40) / (N - 1);
    ctx.strokeStyle = "#822"; ctx.lineWidth = 1;
    for (let i = 0; i < N; i++){
      const p1 = cellPos(0, i), p2 = cellPos(N-1, i);
      ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
      const q1 = cellPos(i, 0), q2 = cellPos(i, N-1);
      ctx.beginPath(); ctx.moveTo(q1.x, q1.y); ctx.lineTo(q2.x, q2.y); ctx.stroke();
    }

    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const v = board[r*N + c]; if (v === '.') continue;
      const p = cellPos(r, c);
      ctx.beginPath(); ctx.arc(p.x, p.y, cs*0.4, 0, Math.PI*2);
      ctx.fillStyle = v === 'b' ? "#222" : "#eee"; ctx.fill();
      ctx.strokeStyle = "#444"; ctx.stroke();
    }

    // pending first stone highlight
    if (pending !== null && pending !== undefined && pending >= 0){
      const r = Math.floor(pending/N), c = pending%N; const p = cellPos(r, c);
      ctx.strokeStyle = "#0a0"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(p.x, p.y, cs*0.5, 0, Math.PI*2); ctx.stroke(); ctx.lineWidth = 1;
    }

    if (winner) statusEl.textContent = winner === "you" ? "you win!" : winner === "ai" ? "AI wins" : "draw";
    else if (turn === "you"){
      const placeCount = (moveNum === 0) ? 1 : 2;
      const need = placeCount - (pending !== null ? 1 : 0);
      statusEl.textContent = `place ${need} more stone${need===1?'':'s'}`;
    }
    else statusEl.textContent = "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }
  function findCell(x, y){
    const cs = (size - 40) / (N - 1);
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const p = cellPos(r, c);
      if (Math.hypot(x - p.x, y - p.y) < cs * 0.45) return r*N + c;
    }
    return -1;
  }

  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e); const i = findCell(x, y); if (i < 0 || board[i] !== '.') return;
    const placeCount = (moveNum === 0) ? 1 : 2;
    board[i] = 'b';
    if (wins(board, 'b')){ winner = "you"; draw(); return; }
    if (placeCount === 1 || pending !== null){
      // turn complete
      pending = null; moveNum++;
      turn = "ai"; draw(); setTimeout(aiMove, 500);
    } else {
      pending = i; draw();
    }
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve() {
      if (winner || turn !== "you") return;
      const __placeCount = (moveNum === 0) ? 1 : 2;
      const __empty = [];
      for (let i = 0; i < N*N; i++) if (board[i] === '.') __empty.push(i);
      if (!__empty.length) { winner = "draw"; draw(); return; }
      // place required number of stones randomly
      const __shuffle = __empty.slice().sort(() => Math.random() - 0.5);
      for (let __k = 0; __k < __placeCount && __k < __shuffle.length; __k++) {
        board[__shuffle[__k]] = 'b';
        if (wins(board, 'b')) { winner = "you"; draw(); return; }
      }
      pending = null; moveNum++;
      turn = "ai"; draw();
      setTimeout(aiMove, 80);
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
