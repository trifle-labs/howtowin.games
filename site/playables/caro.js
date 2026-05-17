// Caro — Vietnamese 5-in-a-row. A line of 5 is only a win if NOT blocked at
// both ends by enemy stones (or board edge). 11×11 mini board.
// AI: heuristic line scoring with caro-aware blocking.

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = size + 40;
  const W = canvas.width, H = canvas.height;
  const statusEl = document.getElementById("playable-status");

  const N = 11;
  let board, turn, winner;
  function newGame(){ board = new Array(N*N).fill('.'); turn = "you"; winner = null; }
  newGame();

  const DIRS = [[1,0],[0,1],[1,1],[1,-1]];

  function get(b, r, c){
    if (r < 0 || r >= N || c < 0 || c >= N) return '#'; // off-board treated as block
    return b[r*N + c];
  }

  function wins(b, side){
    const enemy = side === 'b' ? 'w' : 'b';
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      if (b[r*N + c] !== side) continue;
      for (const [dr, dc] of DIRS){
        // count consecutive stones starting here
        let k = 0;
        while (get(b, r + dr*k, c + dc*k) === side) k++;
        if (k < 5) continue;
        // check both ends
        const left = get(b, r - dr, c - dc);
        const right = get(b, r + dr*k, c + dc*k);
        const blocked = (left === enemy || left === '#') && (right === enemy || right === '#');
        if (!blocked) return true;
      }
    }
    return false;
  }

  function lineScore(b, side){
    const enemy = side === 'b' ? 'w' : 'b';
    let s = 0;
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      for (const [dr, dc] of DIRS){
        const nr = r + dr*4, nc = c + dc*4;
        if (nr < 0 || nr >= N || nc < 0 || nc >= N) continue;
        let my = 0, op = 0;
        for (let i = 0; i < 5; i++){
          const v = b[(r+dr*i)*N + (c+dc*i)];
          if (v === side) my++; else if (v !== '.') op++;
        }
        if (op === 0 && my > 0){
          // caro: only counts if at least one end is open
          const left = get(b, r - dr, c - dc);
          const right = get(b, r + dr*5, c + dc*5);
          if (left === enemy || left === '#') if (right === enemy || right === '#') continue;
          s += [0, 1, 5, 25, 100, 5000][my];
        }
      }
    }
    return s;
  }

  function neighborhood(){
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
    const cand = neighborhood(); if (!cand.length) return -1;
    for (const i of cand){ board[i] = 'w'; if (wins(board, 'w')){ board[i] = '.'; return i; } board[i] = '.'; }
    for (const i of cand){ board[i] = 'b'; if (wins(board, 'b')){ board[i] = '.'; return i; } board[i] = '.'; }
    let best = cand[0], bv = -Infinity;
    for (const i of cand){
      board[i] = 'w';
      const v = lineScore(board, 'w') - lineScore(board, 'b');
      if (v > bv){ bv = v; best = i; }
      board[i] = '.';
    }
    return best;
  }

  function aiMove(){
    if (winner) return;
    const i = aiBest(); if (i < 0){ winner = "draw"; draw(); return; }
    board[i] = 'w';
    if (wins(board, 'w')){ winner = "ai"; draw(); return; }
    turn = "you"; draw();
  }

  function cellPos(r, c){
    const margin = 20, cs = (size - 2*margin) / (N - 1);
    return { x: margin + c*cs, y: 40 + r*cs, cs };
  }

  function draw(){
    ctx.fillStyle = "#f5e0b8"; ctx.fillRect(0, 0, W, H);
    ctx.font = "13px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#222";

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

    if (winner) statusEl.textContent = winner === "you" ? "you win!" : winner === "ai" ? "AI wins" : "draw";
    else statusEl.textContent = turn === "you" ? "click an intersection to place a black stone" : "AI thinking…";
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
    board[i] = 'b';
    if (wins(board, 'b')){ winner = "you"; draw(); return; }
    turn = "ai"; draw(); setTimeout(aiMove, 500);
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve() {
      if (winner || turn !== "you") return;
      const __mvs = neighborhood();
      if (!__mvs || !__mvs.length) { winner = "ai"; draw(); return; }
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
