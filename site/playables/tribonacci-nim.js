// Tribonacci Nim — single heap. First move: 1..n-1 stones.
// Subsequent moves: 1..min(3 * previous_move, remaining).
// P-positions are tribonacci numbers; optimal play uses tribonacci representation.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 360);
  canvas.width = size;
  canvas.height = size;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) {
    const w = canvas.width, h = canvas.height;
    canvas.style.width = w + 'px';    canvas.width = w * dpr; canvas.height = h * dpr; ctx.scale(dpr, dpr);
  }
  const statusEl = document.getElementById("playable-status");

  // Tribonacci: T(n) = T(n-1) + T(n-2) + T(n-3); 1,2,4,7,13,24,44,81,149,...
  const TRIB = (() => { const a=[1,2,4]; while (a[a.length-1] < 1000) a.push(a[a.length-1]+a[a.length-2]+a[a.length-3]); return a; })();
  function isTrib(n){ return TRIB.includes(n); }

  let heap, lastMove, turn, winner;
  function newGame(){
    const cands=[]; for (let n=10;n<=60;n++) if (!isTrib(n)) cands.push(n);
    heap = cands[Math.floor(Math.random()*cands.length)];
    lastMove = 0; turn="you"; winner=null;
  }
  newGame();

  function maxTake(){ if (lastMove===0) return heap-1; return Math.min(3*lastMove, heap); }

  function aiMove(){
    if (winner) return;
    const limit = maxTake();
    if (limit >= heap){ heap=0; winner="ai"; draw(); return; }
    // Aim to leave a tribonacci heap.
    let take=null;
    for (let k=1; k<=limit; k++){ const rem=heap-k; if (rem===0 || isTrib(rem)){ take=k; break; } }
    if (take===null) take=1;
    heap -= take; lastMove = take;
    if (heap===0) winner="ai"; else turn="you";
    draw();
  }

  function applyTake(k){ heap-=k; lastMove=k; if (heap===0){ winner="you"; draw(); return; } turn="ai"; draw(); setTimeout(aiMove,500); }

  function buttons(){
    const limit=maxTake(), out=[]; const maxBtns=Math.min(limit,12);
    const btnW=Math.min(40,(size-40)/maxBtns-4), btnH=28, gap=4;
    const total=maxBtns*btnW+(maxBtns-1)*gap, x0=(size-total)/2, y0=size-50;
    for (let k=1;k<=maxBtns;k++) out.push({k, x:x0+(k-1)*(btnW+gap), y:y0, w:btnW, h:btnH});
    return out;
  }

  function draw(){
    ctx.fillStyle="#fafaf7"; ctx.fillRect(0,0,size,size);
    ctx.fillStyle="#333"; ctx.font="16px sans-serif"; ctx.textAlign="center";
    ctx.fillText(`heap: ${heap}    last move: ${lastMove||"—"}    limit: ${maxTake()}`, size/2, 24);
    ctx.font="11px monospace";
    ctx.fillStyle = isTrib(heap)?"#a44":"#484";
    ctx.fillText(isTrib(heap)?`(tribonacci heap — P-position for mover)`:`(non-tribonacci — winning move exists)`, size/2, 42);
    const cols=12, stoneR=8, xStart=size/2-(cols*(stoneR*2+3)-3)/2+stoneR, yStart=70;
    for (let i=0;i<heap;i++){
      const r=Math.floor(i/cols), c=i%cols;
      ctx.beginPath(); ctx.arc(xStart+c*(stoneR*2+3), yStart+r*(stoneR*2+3), stoneR, 0, Math.PI*2);
      ctx.fillStyle="#5a7"; ctx.fill(); ctx.strokeStyle="#222"; ctx.lineWidth=1; ctx.stroke();
    }
    ctx.font="12px sans-serif";
    for (const b of buttons()){
      ctx.fillStyle="#eef0e8"; ctx.fillRect(b.x,b.y,b.w,b.h);
      ctx.strokeStyle="#888"; ctx.lineWidth=1; ctx.strokeRect(b.x,b.y,b.w,b.h);
      ctx.fillStyle="#222"; ctx.textBaseline="middle"; ctx.textAlign="center";
      ctx.fillText(`−${b.k}`, b.x+b.w/2, b.y+b.h/2);
    }
    ctx.textBaseline="alphabetic";
    if (winner) statusEl.textContent = winner==="you"?"you win!":"AI wins";
    else statusEl.textContent = turn==="you"?"your turn — click a button":"AI thinking…";
  }

  function clickPos(e){ const r=canvas.getBoundingClientRect(); return {x:(e.clientX-r.left)*(size/r.width), y:(e.clientY-r.top)*(size/r.height)}; }
  function onClick(e){
    if (turn!=="you"||winner) return;
    const {x,y}=clickPos(e);
    for (const b of buttons()) if (x>=b.x&&x<=b.x+b.w&&y>=b.y&&y<=b.y+b.h){ applyTake(b.k); return; }
  }
  canvas.addEventListener("click", onClick); draw();
  return {
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0,0,size,size); },
    restart(){ newGame(); draw(); },
    solve(){
      if (turn!=="you"||winner) return;
      const limit=maxTake();
      let take=null;
      for (let k=1;k<=limit;k++){ const rem=heap-k; if (rem===0||isTrib(rem)){ take=k; break; } }
      if (take===null){ statusEl.textContent="no winning move (tribonacci heap)"; return; }
      applyTake(take);
    },
  };
}
