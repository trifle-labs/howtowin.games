// Treblecross — 1×N strip. Both players mark a cell with X (shared symbol).
// A player who creates three consecutive X's WINS immediately. Impartial game
// (octal 0.007). Strongly solved via Grundy. For small N we use exact minimax.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 480);
  canvas.width = size;
  canvas.height = 180;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) {
    const w = canvas.width, h = canvas.height;
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    canvas.width = w * dpr; canvas.height = h * dpr; ctx.scale(dpr, dpr);
  }
  const statusEl = document.getElementById("playable-status");

  const N = 10;
  let mask, turn, winner;
  function newGame(){ mask = 0; turn = "you"; winner = null; }
  newGame();

  function hasThree(m){
    for (let i=0; i<=N-3; i++){
      const k = (1<<i) | (1<<(i+1)) | (1<<(i+2));
      if ((m & k) === k) return true;
    }
    return false;
  }

  // Memoized: is the player to move winning given mask m? If hasThree(m) already, the previous mover won — so the current mover LOST. We assume this isn't called on terminal states.
  const memo = new Map();
  function isWinning(m){
    if (memo.has(m)) return memo.get(m);
    // No moves left → cannot move; in this game, no-moves = full mask without 3-in-a-row (impossible for N>=3?). Treat as loss.
    let any = false;
    for (let i=0; i<N; i++){
      if (m & (1<<i)) continue;
      any = true;
      const nm = m | (1<<i);
      if (hasThree(nm)){ memo.set(m, true); return true; }
      if (!isWinning(nm)){ memo.set(m, true); return true; }
    }
    memo.set(m, !any ? false : false); // no winning move
    return false;
  }

  function bestMove(m){
    // Prefer immediate-win move; else move to a P-position; else any move.
    let pMove = null, fallback = -1;
    for (let i=0; i<N; i++){
      if (m & (1<<i)) continue;
      const nm = m | (1<<i);
      if (hasThree(nm)) return i;
      if (!isWinning(nm)) pMove = i;
      fallback = i;
    }
    if (pMove !== null) return pMove;
    return fallback;
  }

  function applyMark(i, who){
    mask |= (1<<i);
    if (hasThree(mask)){ winner = who; draw(); return true; }
    return false;
  }

  function aiMove(){
    if (winner) return;
    const i = bestMove(mask);
    if (i < 0){ winner = "draw"; draw(); return; }
    if (applyMark(i, "ai")) return;
    turn = "you"; draw();
  }

  function cellRect(i){
    const margin = 30, gap = 4;
    const cellW = (size - 2*margin - (N-1)*gap) / N;
    return { x: margin + i*(cellW + gap), y: 60, w: cellW, h: 60 };
  }

  function draw(){
    ctx.fillStyle="#fafaf7"; ctx.fillRect(0,0,size,180);
    ctx.font="14px sans-serif"; ctx.textAlign="center"; ctx.fillStyle="#444";
    ctx.fillText(`Treblecross 1×${N} — three X's in a row WINS`, size/2, 24);
    for (let i=0; i<N; i++){
      const c = cellRect(i);
      ctx.fillStyle="#fff"; ctx.fillRect(c.x, c.y, c.w, c.h);
      ctx.strokeStyle="#888"; ctx.lineWidth=1; ctx.strokeRect(c.x, c.y, c.w, c.h);
      if (mask & (1<<i)){
        ctx.fillStyle="#222"; ctx.font="bold 28px sans-serif"; ctx.textAlign="center"; ctx.textBaseline="middle";
        ctx.fillText("✕", c.x + c.w/2, c.y + c.h/2);
        ctx.textBaseline="alphabetic";
      }
    }
    if (winner === "you") statusEl.textContent = "you win — three in a row!";
    else if (winner === "ai") statusEl.textContent = "AI wins — three in a row!";
    else statusEl.textContent = turn === "you" ? "your turn — click an empty cell" : "AI thinking…";
  }

  function clickPos(e){ const r=canvas.getBoundingClientRect(); return {x:(e.clientX-r.left)*(size/r.width), y:(e.clientY-r.top)*(180/r.height)}; }
  function findCell(x,y){ for (let i=0;i<N;i++){ const c=cellRect(i); if (x>=c.x&&x<=c.x+c.w&&y>=c.y&&y<=c.y+c.h) return i; } return -1; }

  function onClick(e){
    if (winner || turn !== "you") return;
    const {x,y} = clickPos(e); const i = findCell(x,y);
    if (i < 0 || (mask & (1<<i))) return;
    if (applyMark(i, "you")) return;
    turn = "ai"; draw(); setTimeout(aiMove, 500);
  }

  canvas.addEventListener("click", onClick); draw();
  return {
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0,0,size,180); memo.clear(); },
    restart(){ newGame(); memo.clear(); draw(); },
    solve(){
      if (winner || turn !== "you") return;
      const i = bestMove(mask);
      if (i < 0) return;
      if (applyMark(i, "you")) return;
      turn = "ai"; draw(); setTimeout(aiMove, 500);
    },
  };
}
