// Grundy's game — split any heap into two non-empty UNEQUAL parts. The player
// who cannot move loses (all heaps must be size 1 or 2). Impartial game; AI
// uses Grundy values computed by mex recurrence + nim-sum.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 420);
  canvas.width = size;
  canvas.height = 260;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) {
    const w = canvas.width, h = canvas.height;
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    canvas.width = w * dpr; canvas.height = h * dpr; ctx.scale(dpr, dpr);
  }
  const statusEl = document.getElementById("playable-status");

  let heaps, turn, winner, selected;
  function newGame(){ heaps = [10]; turn="you"; winner=null; selected={heap:-1,split:0}; }
  newGame();

  // Grundy(n): mex of G(a) ^ G(n-a) for splits a in [1, floor((n-1)/2)], a != n-a.
  const G = new Map(); G.set(1, 0); G.set(2, 0);
  function grundy(n){
    if (G.has(n)) return G.get(n);
    const s = new Set();
    for (let a=1; a < n; a++){
      const b = n - a;
      if (a >= b) continue; // avoid duplicates
      if (a === b) continue; // unequal split required
      s.add(grundy(a) ^ grundy(b));
    }
    let m = 0; while (s.has(m)) m++;
    G.set(n, m); return m;
  }

  function isPlayable(n){ return n >= 3; }
  function legalSplits(n){
    const out = [];
    for (let a=1; a < n; a++){
      const b = n - a;
      if (a >= b) continue;
      if (a === b) continue;
      out.push([a, b]);
    }
    return out;
  }

  function findWinningMove(){
    const total = heaps.reduce((acc, h) => acc ^ grundy(h), 0);
    if (total === 0) return null;
    for (let i=0; i<heaps.length; i++){
      const h = heaps[i];
      if (!isPlayable(h)) continue;
      for (const [a, b] of legalSplits(h)){
        const newG = grundy(a) ^ grundy(b);
        const replaced = total ^ grundy(h) ^ newG;
        if (replaced === 0) return { i, a, b };
      }
    }
    return null;
  }

  function applySplit(i, a, b){
    heaps.splice(i, 1, a, b);
    heaps.sort((x,y)=>y-x);
  }

  function noMoves(){ return heaps.every(h => h < 3); }

  function aiMove(){
    if (winner) return;
    if (noMoves()){ winner = "you"; draw(); return; }
    let mv = findWinningMove();
    if (!mv){
      // Any legal move; pick first playable heap with smallest split
      for (let i=0; i<heaps.length; i++) if (isPlayable(heaps[i])){
        const [a, b] = legalSplits(heaps[i])[0];
        mv = { i, a, b }; break;
      }
    }
    if (!mv){ winner = "you"; draw(); return; }
    applySplit(mv.i, mv.a, mv.b);
    if (noMoves()){ winner = turn === "ai" ? "you" : "ai"; draw(); return; }
    turn = "you"; draw();
  }

  function commit(i, a, b){
    applySplit(i, a, b);
    if (noMoves()){ winner = turn === "you" ? "ai" : "you"; draw(); return true; }
    return false;
  }

  function heapRect(i){
    const margin = 30;
    const w = (size - 2*margin) / Math.max(heaps.length, 1);
    return { x: margin + i*w, y: 50, w: w - 6, h: 140 };
  }

  function splitOptions(i){
    if (i < 0 || i >= heaps.length) return [];
    return legalSplits(heaps[i]);
  }

  function splitBtnRect(idx, n){
    // Lay out split buttons in a row at y=210
    const margin = 30, gap = 4;
    const w = Math.min(60, (size - 2*margin - (n-1)*gap) / Math.max(n, 1));
    return { x: margin + idx*(w+gap), y: 210, w, h: 32 };
  }

  function draw(){
    ctx.fillStyle="#fafaf7"; ctx.fillRect(0,0,size,260);
    ctx.font="14px sans-serif"; ctx.textAlign="center"; ctx.fillStyle="#444";
    ctx.fillText(`Grundy's game — split a heap into two UNEQUAL non-empty parts`, size/2, 22);
    ctx.font="12px monospace";
    const total = heaps.reduce((a,h)=>a^grundy(h),0);
    ctx.fillStyle = total === 0 ? "#a44" : "#484";
    ctx.fillText(`heaps: [${heaps.join(", ")}]   grundy nim-sum: ${total}${total===0?" (P-position)":" (N-position)"}`, size/2, 40);

    for (let i=0; i<heaps.length; i++){
      const r = heapRect(i);
      ctx.fillStyle = selected.heap === i ? "#dc8" : (isPlayable(heaps[i]) ? "#bcd" : "#ddd");
      ctx.fillRect(r.x, r.y, r.w, r.h);
      ctx.strokeStyle="#345"; ctx.lineWidth=1; ctx.strokeRect(r.x, r.y, r.w, r.h);
      ctx.fillStyle="#222"; ctx.font="bold 22px sans-serif"; ctx.textAlign="center"; ctx.textBaseline="middle";
      ctx.fillText(`${heaps[i]}`, r.x + r.w/2, r.y + r.h/2);
      ctx.font="10px monospace";
      ctx.fillText(`G=${grundy(heaps[i])}`, r.x + r.w/2, r.y + r.h - 10);
      ctx.textBaseline="alphabetic";
    }

    if (selected.heap >= 0 && isPlayable(heaps[selected.heap])){
      const ops = splitOptions(selected.heap);
      ops.forEach((pair, idx) => {
        const r = splitBtnRect(idx, ops.length);
        ctx.fillStyle="#eef0e8"; ctx.fillRect(r.x, r.y, r.w, r.h);
        ctx.strokeStyle="#888"; ctx.lineWidth=1; ctx.strokeRect(r.x, r.y, r.w, r.h);
        ctx.fillStyle="#222"; ctx.font="12px sans-serif"; ctx.textBaseline="middle"; ctx.textAlign="center";
        ctx.fillText(`${pair[0]}+${pair[1]}`, r.x + r.w/2, r.y + r.h/2);
      });
      ctx.textBaseline="alphabetic";
    }

    if (winner) statusEl.textContent = winner === "you" ? "you win!" : "AI wins";
    else if (selected.heap >= 0) statusEl.textContent = `click a split for heap ${heaps[selected.heap]}`;
    else statusEl.textContent = turn === "you" ? "your turn — click a heap (size ≥ 3) to split" : "AI thinking…";
  }

  function clickPos(e){ const r=canvas.getBoundingClientRect(); return {x:(e.clientX-r.left)*(size/r.width), y:(e.clientY-r.top)*(260/r.height)}; }
  function findHeap(x,y){ for (let i=0;i<heaps.length;i++){ const r=heapRect(i); if (x>=r.x&&x<=r.x+r.w&&y>=r.y&&y<=r.y+r.h) return i; } return -1; }
  function findSplitBtn(x,y){
    if (selected.heap < 0 || !isPlayable(heaps[selected.heap])) return -1;
    const ops = splitOptions(selected.heap);
    for (let i=0; i<ops.length; i++){ const r = splitBtnRect(i, ops.length); if (x>=r.x&&x<=r.x+r.w&&y>=r.y&&y<=r.y+r.h) return i; }
    return -1;
  }

  function onClick(e){
    if (winner || turn !== "you") return;
    const {x,y} = clickPos(e);
    const btnIdx = findSplitBtn(x, y);
    if (btnIdx >= 0){
      const ops = splitOptions(selected.heap);
      const [a, b] = ops[btnIdx];
      const i = selected.heap;
      selected = {heap:-1, split:0};
      if (commit(i, a, b)) return;
      turn = "ai"; draw(); setTimeout(aiMove, 500); return;
    }
    const i = findHeap(x, y);
    if (i >= 0 && isPlayable(heaps[i])){ selected = {heap:i, split:0}; draw(); return; }
  }

  canvas.addEventListener("click", onClick); draw();
  return {
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0,0,size,260); },
    restart(){ newGame(); draw(); },
    solve(){
      if (winner || turn !== "you") return;
      let mv = findWinningMove();
      if (!mv){
        // Fallback: pick any legal split so the game progresses
        const opts = [];
        for (let i=0;i<heaps.length;i++) if (isPlayable(heaps[i])) {
          for (const [a,b] of splitOptions(i)) opts.push({i,a,b});
        }
        if (!opts.length){ winner = "ai"; statusEl.textContent = "AI wins"; draw(); return; }
        mv = opts[Math.floor(Math.random()*opts.length)];
      }
      selected = {heap:-1, split:0};
      if (commit(mv.i, mv.a, mv.b)) return;
      turn = "ai"; draw(); setTimeout(aiMove, 80);
    },
  };
}
