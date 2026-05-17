// Poker Nim — multi-heap Nim with a personal reserve. You may take from a heap
// (into your reserve), or add from your reserve back to a heap. Optimal play
// ignores the reserve and follows ordinary Nim: leave XOR=0; mirror any
// opponent "add" by removing the same number from the same heap.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 520);
  canvas.width = size;
  canvas.height = 280;
  const statusEl = document.getElementById("playable-status");

  let heaps, youReserve, aiReserve, turn, winner, sel, mode;
  function newGame(){
    heaps = [3, 4, 5];
    youReserve = 0; aiReserve = 0;
    turn = "you"; winner = null; sel = -1; mode = "take";
  }
  newGame();

  function xor(){ return heaps.reduce((a,b)=>a^b, 0); }
  function over(){ return heaps.every(h => h === 0); }

  function aiTake(){
    // Ignore reserve; pick a take that zeros the XOR.
    const x = xor();
    if (x === 0){
      // Random move that minimizes own loss (just take 1 from largest).
      let maxI = 0; for (let i=1;i<heaps.length;i++) if (heaps[i] > heaps[maxI]) maxI = i;
      if (heaps[maxI] === 0) return null;
      heaps[maxI] -= 1; aiReserve += 1;
      return {action: "take", heap: maxI, n: 1};
    }
    for (let i=0; i<heaps.length; i++){
      const target = heaps[i] ^ x;
      if (target < heaps[i]){
        const take = heaps[i] - target;
        heaps[i] = target; aiReserve += take;
        return {action: "take", heap: i, n: take};
      }
    }
    return null;
  }

  function aiMove(){
    if (winner) return;
    aiTake();
    if (over()){ winner = "ai"; draw(); return; }
    turn = "you"; draw();
  }

  function heapRect(i){
    const margin = 40, gap = 30;
    const totalW = size - 2*margin;
    const cw = (totalW - (heaps.length-1)*gap) / heaps.length;
    return { x: margin + i*(cw+gap), y: 90, w: cw, h: 100 };
  }

  function draw(){
    ctx.fillStyle="#fafaf7"; ctx.fillRect(0,0,size,280);
    ctx.font="13px sans-serif"; ctx.textAlign="center"; ctx.fillStyle="#444";
    ctx.fillText(`Poker Nim — take from a heap, or add from reserve. XOR=${xor()}`, size/2, 22);
    ctx.fillText(`your reserve: ${youReserve}  •  AI reserve: ${aiReserve}`, size/2, 42);

    for (let i=0; i<heaps.length; i++){
      const r = heapRect(i);
      ctx.fillStyle = sel === i ? "#ffe9b0" : "#fff";
      ctx.fillRect(r.x, r.y, r.w, r.h);
      ctx.strokeStyle = "#888"; ctx.strokeRect(r.x, r.y, r.w, r.h);
      // stack of dots
      const stack = heaps[i];
      const dotR = Math.min(r.w/2 - 4, 10);
      const perRow = Math.max(1, Math.floor((r.w - 8) / (dotR*2 + 4)));
      for (let k=0; k<stack; k++){
        const row = Math.floor(k / perRow), col = k % perRow;
        const cx = r.x + 4 + dotR + col*(dotR*2 + 4);
        const cy = r.y + r.h - 4 - dotR - row*(dotR*2 + 4);
        ctx.beginPath(); ctx.arc(cx, cy, dotR, 0, Math.PI*2);
        ctx.fillStyle = "#5a7"; ctx.fill();
      }
      ctx.fillStyle = "#444"; ctx.font="12px sans-serif";
      ctx.fillText(`heap ${i+1}: ${heaps[i]}`, r.x + r.w/2, r.y + r.h + 16);
    }

    ctx.fillStyle = "#666"; ctx.font="12px sans-serif"; ctx.textAlign="center";
    ctx.fillText(`mode: ${mode === "take" ? "TAKE from heap" : "ADD from reserve"}  •  toggle with [T]/[A]`, size/2, 240);
    ctx.fillText(`click a heap to ${mode === "take" ? "take 1" : "add 1"}  •  press solve for optimal`, size/2, 258);

    if (winner) statusEl.textContent = winner === "you" ? "you win — all heaps empty!" : "AI wins — all heaps empty!";
    else statusEl.textContent = turn === "you" ? "your turn — click a heap or press T/A to switch mode" : "AI thinking…";
  }

  function clickPos(e){ const r=canvas.getBoundingClientRect(); return {x:(e.clientX-r.left)*(size/r.width), y:(e.clientY-r.top)*(280/r.height)}; }
  function findHeap(x, y){
    for (let i=0;i<heaps.length;i++){ const r=heapRect(i); if (x>=r.x&&x<=r.x+r.w&&y>=r.y&&y<=r.y+r.h) return i; }
    return -1;
  }

  function onClick(e){
    if (winner || turn !== "you") return;
    const {x,y} = clickPos(e); const i = findHeap(x, y);
    if (i < 0) return;
    if (mode === "take"){
      if (heaps[i] <= 0) return;
      heaps[i] -= 1; youReserve += 1;
    } else {
      if (youReserve <= 0) return;
      heaps[i] += 1; youReserve -= 1;
    }
    if (over()){ winner = "you"; draw(); return; }
    turn = "ai"; draw(); setTimeout(aiMove, 500);
  }
  function onKey(e){
    if (e.key === "t" || e.key === "T"){ mode = "take"; draw(); }
    if (e.key === "a" || e.key === "A"){ mode = "add"; draw(); }
  }

  canvas.addEventListener("click", onClick);
  window.addEventListener("keydown", onKey);
  draw();
  return {
    destroy(){
      canvas.removeEventListener("click", onClick);
      window.removeEventListener("keydown", onKey);
      ctx.clearRect(0,0,size,280);
    },
    restart(){ newGame(); draw(); },
    solve(){
      if (winner || turn !== "you") return;
      // Ignore reserve; play optimal nim.
      const x = xor();
      if (x !== 0){
        for (let i=0; i<heaps.length; i++){
          const target = heaps[i] ^ x;
          if (target < heaps[i]){
            const take = heaps[i] - target;
            heaps[i] = target; youReserve += take;
            break;
          }
        }
      } else {
        let maxI = 0; for (let i=1;i<heaps.length;i++) if (heaps[i] > heaps[maxI]) maxI = i;
        if (heaps[maxI] > 0){ heaps[maxI] -= 1; youReserve += 1; }
      }
      if (over()){ winner = "you"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 500);
    },
  };
}
