// Notakto — impartial misère tic-tac-toe. Both players mark a cell with X.
// Completing a three-in-a-row LOSES. Single 3×3 board: first player loses
// with perfect play; AI uses memoized minimax.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 320);
  canvas.width = size;
  canvas.height = size;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) {
    const w = canvas.width, h = canvas.height;
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    canvas.width = w * dpr; canvas.height = h * dpr; ctx.scale(dpr, dpr);
  }
  const statusEl = document.getElementById("playable-status");

  const LINES = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6],
  ];

  let mask, turn, winner;
  function newGame(){ mask = 0; turn = "you"; winner = null; }
  newGame();

  function isLine(m){ for (const L of LINES) if (L.every(i => (m>>i)&1)) return true; return false; }

  // From state m (no line yet), is current mover winning (i.e., can avoid losing)?
  const memo = new Map();
  function isWinning(m){
    if (memo.has(m)) return memo.get(m);
    let any = false;
    for (let i=0; i<9; i++){
      if ((m>>i)&1) continue;
      any = true;
      const nm = m | (1<<i);
      if (isLine(nm)) continue; // this move loses for current mover
      if (!isWinning(nm)){ memo.set(m, true); return true; }
    }
    // No move avoids losing.
    memo.set(m, false); return false;
  }

  function bestMove(m){
    // Prefer move to P-position (opponent loses).
    let any = -1;
    for (let i=0; i<9; i++){
      if ((m>>i)&1) continue;
      const nm = m | (1<<i);
      if (isLine(nm)){ any = i; continue; } // losing move, skip unless forced
    }
    for (let i=0; i<9; i++){
      if ((m>>i)&1) continue;
      const nm = m | (1<<i);
      if (isLine(nm)) continue;
      if (!isWinning(nm)) return i;
    }
    // All moves losing; pick the one that doesn't immediately complete a line if possible.
    for (let i=0; i<9; i++){
      if ((m>>i)&1) continue;
      const nm = m | (1<<i);
      if (!isLine(nm)) return i;
    }
    return any; // forced into losing line
  }

  function aiMove(){
    if (winner) return;
    const i = bestMove(mask);
    if (i < 0){ winner = "you"; draw(); return; }
    mask |= (1<<i);
    if (isLine(mask)){ winner = "you"; draw(); return; }
    turn = "you"; draw();
  }

  function cellRect(i){
    const margin = 30, cs = (size - 2*margin) / 3;
    const r = Math.floor(i/3), c = i%3;
    return { x: margin + c*cs, y: margin + r*cs, w: cs, h: cs };
  }

  function draw(){
    ctx.fillStyle="#fafaf7"; ctx.fillRect(0,0,size,size);
    ctx.font="13px sans-serif"; ctx.textAlign="center"; ctx.fillStyle="#444";
    ctx.fillText(`Notakto — both play X, completing a line LOSES`, size/2, 18);

    for (let i=0; i<9; i++){
      const c = cellRect(i);
      ctx.fillStyle = "#fff"; ctx.fillRect(c.x, c.y, c.w, c.h);
      ctx.strokeStyle="#888"; ctx.lineWidth=1; ctx.strokeRect(c.x, c.y, c.w, c.h);
      if ((mask>>i)&1){
        ctx.fillStyle="#222"; ctx.font="bold 36px sans-serif"; ctx.textAlign="center"; ctx.textBaseline="middle";
        ctx.fillText("✕", c.x + c.w/2, c.y + c.h/2);
        ctx.textBaseline="alphabetic";
      }
    }

    if (winner === "you") statusEl.textContent = "you win — AI completed a line!";
    else if (winner === "ai") statusEl.textContent = "AI wins — you completed a line!";
    else statusEl.textContent = turn === "you" ? "your turn — click an empty cell" : "AI thinking…";
  }

  function clickPos(e){ const r=canvas.getBoundingClientRect(); return {x:(e.clientX-r.left)*(size/r.width), y:(e.clientY-r.top)*(size/r.height)}; }
  function findCell(x, y){ for (let i=0;i<9;i++){ const c=cellRect(i); if (x>=c.x&&x<=c.x+c.w&&y>=c.y&&y<=c.y+c.h) return i; } return -1; }

  function onClick(e){
    if (winner || turn !== "you") return;
    const {x,y} = clickPos(e); const i = findCell(x,y);
    if (i < 0 || (mask>>i)&1) return;
    mask |= (1<<i);
    if (isLine(mask)){ winner = "ai"; draw(); return; }
    turn = "ai"; draw(); setTimeout(aiMove, 500);
  }

  canvas.addEventListener("click", onClick); draw();
  return {
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0,0,size,size); memo.clear(); },
    restart(){ newGame(); memo.clear(); draw(); },
    solve(){
      if (winner || turn !== "you") return;
      const i = bestMove(mask);
      if (i < 0) return;
      mask |= (1<<i);
      if (isLine(mask)){ winner = "ai"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 500);
    },
  };
}
