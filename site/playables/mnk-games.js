// m,n,k-games — generalised tic-tac-toe. We show a 4×4 board with k=3 in-a-row
// to win (first-player win by simple threat-tree). Standard minimax with
// memoization.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 400);
  canvas.width = size;
  canvas.height = size + 60;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) {
    const w = canvas.width, h = canvas.height;
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    canvas.width = w * dpr; canvas.height = h * dpr; ctx.scale(dpr, dpr);
  }
  const H = canvas.height;
  const statusEl = document.getElementById("playable-status");

  const M = 4, N = 4, K = 3;
  let board, turn, winner;
  function newGame(){ board = Array(M*N).fill(0); turn="you"; winner=null; }
  newGame();

  function idx(r, c){ return r*N + c; }

  function checkWin(b, sym){
    for (let r=0; r<M; r++) for (let c=0; c<N; c++){
      if (b[idx(r, c)] !== sym) continue;
      const ds = [[0,1],[1,0],[1,1],[1,-1]];
      for (const [dr,dc] of ds){
        let ok = true;
        for (let k=0; k<K; k++){
          const nr = r + k*dr, nc = c + k*dc;
          if (nr<0||nr>=M||nc<0||nc>=N||b[idx(nr,nc)]!==sym){ ok = false; break; }
        }
        if (ok) return true;
      }
    }
    return false;
  }

  function legal(b){ const o = []; for (let i=0; i<M*N; i++) if (!b[i]) o.push(i); return o; }

  const memo = new Map();
  // returns 1 if to-move wins, -1 loses, 0 draws.
  function value(b, sym){
    if (checkWin(b, sym === "X" ? "O" : "X")) return -1; // prev move won
    const opts = legal(b);
    if (!opts.length) return 0;
    const k = b.join("") + sym;
    if (memo.has(k)) return memo.get(k);
    let best = -1;
    for (const i of opts){
      const nb = b.slice(); nb[i] = sym;
      const v = -value(nb, sym === "X" ? "O" : "X");
      if (v > best) best = v;
      if (best === 1) break;
    }
    memo.set(k, best); return best;
  }

  function bestMove(b, sym){
    const opts = legal(b);
    if (!opts.length) return -1;
    let chosen = opts[0], bestV = -2;
    for (const i of opts){
      const nb = b.slice(); nb[i] = sym;
      if (checkWin(nb, sym)) return i;
      const v = -value(nb, sym === "X" ? "O" : "X");
      if (v > bestV){ bestV = v; chosen = i; if (bestV === 1) break; }
    }
    return chosen;
  }

  function aiMove(){
    if (winner) return;
    const i = bestMove(board, "O");
    if (i < 0){ winner = "draw"; draw(); return; }
    board[i] = "O";
    if (checkWin(board, "O")){ winner = "ai"; draw(); return; }
    if (!legal(board).length){ winner = "draw"; draw(); return; }
    turn = "you"; draw();
  }

  function cellRect(r, c){
    const margin = 20, gap = 4;
    const cw = (size - 2*margin - (N-1)*gap) / N;
    return { x: margin + c*(cw+gap), y: 50 + r*(cw+gap), w: cw, h: cw };
  }

  function draw(){
    ctx.fillStyle="#fafaf7"; ctx.fillRect(0,0,size,H);
    ctx.font="13px sans-serif"; ctx.textAlign="center"; ctx.fillStyle="#444";
    ctx.fillText(`m,n,k-game — 4×4 board, ${K} in a row to win  (you=X, AI=O)`, size/2, 22);
    for (let r=0; r<M; r++) for (let c=0; c<N; c++){
      const rc = cellRect(r, c);
      ctx.fillStyle = "#fff"; ctx.fillRect(rc.x, rc.y, rc.w, rc.h);
      ctx.strokeStyle = "#888"; ctx.lineWidth = 1; ctx.strokeRect(rc.x, rc.y, rc.w, rc.h);
      const v = board[idx(r, c)];
      if (v){
        ctx.fillStyle = v === "X" ? "#3a6db8" : "#c14b4b";
        ctx.font = `bold ${Math.floor(rc.w*0.6)}px sans-serif`;
        ctx.textAlign="center"; ctx.textBaseline="middle";
        ctx.fillText(v, rc.x + rc.w/2, rc.y + rc.h/2);
        ctx.textBaseline = "alphabetic";
      }
    }
    if (winner === "you") statusEl.textContent = "you win!";
    else if (winner === "ai") statusEl.textContent = "AI wins!";
    else if (winner === "draw") statusEl.textContent = "draw";
    else statusEl.textContent = turn === "you" ? "click an empty cell to place X" : "AI thinking…";
  }

  function clickPos(e){ const r=canvas.getBoundingClientRect(); return {x:(e.clientX-r.left)*(size/r.width), y:(e.clientY-r.top)*(H/r.height)}; }
  function findCell(x, y){
    for (let r=0; r<M; r++) for (let c=0; c<N; c++){
      const rc = cellRect(r, c); if (x>=rc.x&&x<=rc.x+rc.w&&y>=rc.y&&y<=rc.y+rc.h) return idx(r, c);
    }
    return -1;
  }

  function onClick(e){
    if (winner || turn !== "you") return;
    const {x,y} = clickPos(e); const i = findCell(x, y);
    if (i < 0 || board[i]) return;
    board[i] = "X";
    if (checkWin(board, "X")){ winner = "you"; draw(); return; }
    if (!legal(board).length){ winner = "draw"; draw(); return; }
    turn = "ai"; draw(); setTimeout(aiMove, 400);
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0,0,size,H); memo.clear(); },
    restart(){ newGame(); memo.clear(); draw(); },
    solve(){
      if (winner || turn !== "you") return;
      const i = bestMove(board, "X");
      if (i < 0) return;
      board[i] = "X";
      if (checkWin(board, "X")){ winner = "you"; draw(); return; }
      if (!legal(board).length){ winner = "draw"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 400);
    },
  };
}
