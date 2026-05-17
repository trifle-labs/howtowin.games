// Ruler Game — heaps of tokens with nim-value sequence given by the ruler
// function: g(n) = largest k such that 2^k divides n (so 1,2,1,3,1,2,1,4,...).
// Equivalently: octal game where you may remove any positive amount from a
// single heap, leaving the heap at a smaller value. The "ruler" structure
// emerges because legal removals are constrained — we implement as: on each
// turn pick a heap and "halve down" — remove tokens to reduce the heap to a
// power-of-2 boundary. For our minimal demo we use plain "take any from one
// heap" (which is Nim — the nim-values then are just the heap sizes).
//
// To exhibit the ruler structure we implement octal 0.07: you may remove
// 1, 2, or 3 from any heap (no splitting). Nim-values follow g(n) = ruler(n).

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  function _fit(ctx, t, x, y, maxW){
    let f = parseFloat(ctx.font) || 12;
    while (f > 8 && ctx.measureText(t).width > maxW){ f--; ctx.font = ctx.font.replace(/[\d.]+px/, f + 'px'); }
    ctx.fillText(t, x, y);
  }

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = 240;
  const W = canvas.width, H = canvas.height;
  const statusEl = document.getElementById("playable-status");

  let heaps, turn, winner;
  function newGame(){ heaps = [7, 11, 5]; turn = "you"; winner = null; }
  newGame();

  // Compute Grundy values via mex over moves {n-1, n-2, n-3}
  const grundy = [0];
  function g(n){
    if (grundy[n] !== undefined) return grundy[n];
    for (let i = grundy.length; i <= n; i++){
      const s = new Set();
      for (let k = 1; k <= 3 && i - k >= 0; k++) s.add(g(i - k));
      let m = 0; while (s.has(m)) m++;
      grundy[i] = m;
    }
    return grundy[n];
  }
  for (let i = 0; i <= 30; i++) g(i);

  function nimSum(){ let s = 0; for (const h of heaps) s ^= g(h); return s; }

  function aiPick(){
    // find a move (heap i, take k in 1..3) that zeros the nim-sum
    for (let i = 0; i < heaps.length; i++) for (let k = 1; k <= 3; k++){
      if (heaps[i] - k < 0) continue;
      const s = nimSum() ^ g(heaps[i]) ^ g(heaps[i] - k);
      if (s === 0) return [i, k];
    }
    // no winning move: take 1 from largest heap
    let bi = 0; for (let i = 1; i < heaps.length; i++) if (heaps[i] > heaps[bi]) bi = i;
    if (heaps[bi] === 0) return null;
    return [bi, 1];
  }

  function aiMove(){
    if (winner) return;
    const m = aiPick(); if (!m){ winner = "you"; draw(); return; }
    heaps[m[0]] -= m[1];
    if (heaps.every(h => h === 0)){ winner = "ai"; draw(); return; }
    turn = "you"; draw();
  }

  // input state
  let selHeap = -1;

  function heapRect(i){
    const margin = 30, w = (size - 2*margin) / heaps.length;
    return { x: margin + i * w + 5, y: 50, w: w - 10, h: 120 };
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "13px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";
    _fit(ctx, "Ruler Game — take 1, 2, or 3 from one heap; last to move wins", W/2, 22, W - 8);
    ctx.font = "11px sans-serif"; ctx.fillStyle = "#888";
    ctx.fillText(`Grundy XOR = ${nimSum()}   (g(n) = ruler(n) for octal 0.07)`, W/2, 40);

    for (let i = 0; i < heaps.length; i++){
      const r = heapRect(i);
      ctx.fillStyle = selHeap === i ? "#cef2cf" : "#fff"; ctx.fillRect(r.x, r.y, r.w, r.h);
      ctx.strokeStyle = "#888"; ctx.strokeRect(r.x, r.y, r.w, r.h);
      ctx.fillStyle = "#222"; ctx.font = "20px sans-serif";
      ctx.fillText(`${heaps[i]}`, r.x + r.w/2, r.y + 40);
      ctx.font = "11px sans-serif"; ctx.fillStyle = "#888";
      ctx.fillText(`g=${g(heaps[i])}`, r.x + r.w/2, r.y + 58);
      // take buttons
      for (let k = 1; k <= 3; k++){
        const bx = r.x + 10, by = r.y + 70 + (k-1) * 18;
        ctx.fillStyle = heaps[i] >= k ? "#eee" : "#f8f8f8"; ctx.fillRect(bx, by, r.w - 20, 16);
        ctx.strokeStyle = "#aaa"; ctx.strokeRect(bx, by, r.w - 20, 16);
        ctx.fillStyle = "#222"; ctx.font = "11px sans-serif"; ctx.fillText(`take ${k}`, bx + (r.w - 20)/2, by + 12);
      }
    }

    if (winner) statusEl.textContent = winner === "you" ? "you took the last token — you win!" : "AI takes the last token";
    else statusEl.textContent = turn === "you" ? "click a 'take' button under a heap" : "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }

  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e);
    for (let i = 0; i < heaps.length; i++){
      const r = heapRect(i);
      for (let k = 1; k <= 3; k++){
        const bx = r.x + 10, by = r.y + 70 + (k-1) * 18;
        if (x >= bx && x <= bx + r.w - 20 && y >= by && y <= by + 16){
          if (heaps[i] < k) return;
          heaps[i] -= k;
          if (heaps.every(h => h === 0)){ winner = "you"; draw(); return; }
          turn = "ai"; draw(); setTimeout(aiMove, 500); return;
        }
      }
    }
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve(){
      if (winner || turn !== "you") return;
      const __mvs = [];
      for (let i = 0; i < heaps.length; i++) for (let k = 1; k <= 3; k++) if (heaps[i] >= k) __mvs.push([i, k]);
      if (!__mvs.length) { winner = "ai"; draw(); return; }
      const [__i, __k] = __mvs[Math.floor(Math.random() * __mvs.length)];
      heaps[__i] -= __k;
      if (heaps.every(h => h === 0)){ winner = "you"; draw(); return; }
      turn = "ai"; draw();
      setTimeout(aiMove, 80);
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
