// Kalah(6,4) — 6 pits per side, 4 seeds each. Sow counter-clockwise; landing in
// your own store grants an extra turn; landing in your own empty pit captures
// the opposite pit. Game ends when one side is empty. AI: depth-4 minimax.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = 220;
  const W = canvas.width, H = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) { canvas.style.width = W + 'px'; canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr); }
  const statusEl = document.getElementById("playable-status");

  // Pits indexed 0..5 = your pits (left→right bottom row), 6 = your store,
  // 7..12 = AI pits (right→left top row), 13 = AI store.
  let pits, turn, winner;
  function newGame(){
    pits = new Array(14).fill(4); pits[6] = 0; pits[13] = 0;
    turn = "you"; winner = null;
  }
  newGame();

  function legalMoves(state, side){
    const start = side === "you" ? 0 : 7, end = side === "you" ? 5 : 12;
    const out = [];
    for (let i = start; i <= end; i++) if (state[i] > 0) out.push(i);
    return out;
  }

  function sideEmpty(state, side){
    const start = side === "you" ? 0 : 7, end = side === "you" ? 5 : 12;
    for (let i = start; i <= end; i++) if (state[i] > 0) return false;
    return true;
  }

  function applyMove(state, idx, side){
    const ns = state.slice();
    let seeds = ns[idx]; ns[idx] = 0;
    let i = idx;
    const ownStore = side === "you" ? 6 : 13;
    const enemyStore = side === "you" ? 13 : 6;
    while (seeds > 0){
      i = (i + 1) % 14;
      if (i === enemyStore) continue;
      ns[i]++; seeds--;
    }
    // capture
    const ownStart = side === "you" ? 0 : 7, ownEnd = side === "you" ? 5 : 12;
    if (i >= ownStart && i <= ownEnd && ns[i] === 1){
      const opp = 12 - i;
      if (ns[opp] > 0){ ns[ownStore] += ns[opp] + 1; ns[opp] = 0; ns[i] = 0; }
    }
    const extra = (i === ownStore);
    // game end: if any side empty, sweep the OTHER side into that player's store
    if (sideEmpty(ns, "you") || sideEmpty(ns, "ai")){
      for (let k = 0; k <= 5; k++){ ns[6] += ns[k]; ns[k] = 0; }
      for (let k = 7; k <= 12; k++){ ns[13] += ns[k]; ns[k] = 0; }
      return { state: ns, extra: false, done: true };
    }
    return { state: ns, extra, done: false };
  }

  function evaluate(state){ return state[13] - state[6]; }

  function minimax(state, depth, side, alpha, beta){
    if (depth === 0 || sideEmpty(state, "you") || sideEmpty(state, "ai")) return evaluate(state);
    const moves = legalMoves(state, side);
    if (!moves.length) return evaluate(state);
    if (side === "ai"){
      let best = -Infinity;
      for (const m of moves){
        const r = applyMove(state, m, "ai");
        const v = r.done ? evaluate(r.state) : minimax(r.state, depth - 1, r.extra ? "ai" : "you", alpha, beta);
        if (v > best) best = v;
        alpha = Math.max(alpha, v);
        if (beta <= alpha) break;
      }
      return best;
    } else {
      let best = Infinity;
      for (const m of moves){
        const r = applyMove(state, m, "you");
        const v = r.done ? evaluate(r.state) : minimax(r.state, depth - 1, r.extra ? "you" : "ai", alpha, beta);
        if (v < best) best = v;
        beta = Math.min(beta, v);
        if (beta <= alpha) break;
      }
      return best;
    }
  }

  function aiPick(){
    const moves = legalMoves(pits, "ai"); if (!moves.length) return -1;
    let best = moves[0], bv = -Infinity;
    for (const m of moves){
      const r = applyMove(pits, m, "ai");
      const v = r.done ? evaluate(r.state) : minimax(r.state, 4, r.extra ? "ai" : "you", -Infinity, Infinity);
      if (v > bv){ bv = v; best = m; }
    }
    return best;
  }

  function aiMove(){
    if (winner) return;
    const m = aiPick(); if (m < 0){ endGame(); return; }
    const r = applyMove(pits, m, "ai"); pits = r.state;
    if (r.done){ endGame(); return; }
    draw();
    if (r.extra){ setTimeout(aiMove, 500); return; }
    turn = "you"; draw();
  }

  function endGame(){
    if (pits[6] > pits[13]) winner = "you";
    else if (pits[13] > pits[6]) winner = "ai";
    else winner = "draw";
    draw();
  }

  function pitRect(idx){
    const margin = 20, pitW = (size - 2*margin - 60) / 6, pitH = 60, storeW = 30;
    if (idx === 6) return { x: W - margin - storeW, y: 40, w: storeW, h: pitH * 2 + 20 };
    if (idx === 13) return { x: margin, y: 40, w: storeW, h: pitH * 2 + 20 };
    if (idx >= 0 && idx <= 5){
      return { x: margin + storeW + 10 + idx * pitW, y: 40 + pitH + 20, w: pitW - 4, h: pitH };
    }
    // 12..7 → ai pits left→right
    const aiIdx = 12 - idx;
    return { x: margin + storeW + 10 + aiIdx * pitW, y: 40, w: pitW - 4, h: pitH };
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "13px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";
    ctx.fillText(`Kalah — you ${pits[6]}  ai ${pits[13]}`, W/2, 22);

    for (let i = 0; i < 14; i++){
      const r = pitRect(i); const isStore = i === 6 || i === 13;
      const ours = i >= 0 && i <= 6;
      ctx.fillStyle = isStore ? (ours ? "#bcd9f0" : "#f4cfb4") : "#fff";
      ctx.fillRect(r.x, r.y, r.w, r.h);
      ctx.strokeStyle = "#888"; ctx.strokeRect(r.x, r.y, r.w, r.h);
      ctx.fillStyle = "#222"; ctx.font = isStore ? "16px sans-serif" : "14px sans-serif";
      ctx.fillText(`${pits[i]}`, r.x + r.w/2, r.y + r.h/2 + 5);
    }
    if (winner) statusEl.textContent = winner === "you" ? "you win!" : winner === "ai" ? "AI wins" : "draw";
    else statusEl.textContent = turn === "you" ? "click one of your pits (bottom row)" : "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }
  function findPit(x, y){
    for (let i = 0; i <= 5; i++){
      const r = pitRect(i);
      if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) return i;
    }
    return -1;
  }

  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e); const i = findPit(x, y); if (i < 0 || pits[i] === 0) return;
    const r = applyMove(pits, i, "you"); pits = r.state;
    if (r.done){ endGame(); return; }
    draw();
    if (r.extra){ return; }
    turn = "ai"; draw(); setTimeout(aiMove, 500);
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve(){
      if (winner || turn !== "you") return;
      const __mvs = legalMoves(pits, "you");
      if (!__mvs || !__mvs.length) { winner = "ai"; draw(); return; }
      const __mv = __mvs[Math.floor(Math.random() * __mvs.length)];
      const __r = applyMove(pits, __mv, "you"); pits = __r.state;
      if (__r.done) { endGame(); return; }
      if (__r.extra) { draw(); return; } // extra turn — let player click again
      turn = "ai"; draw();
      setTimeout(aiMove, 80);
    },

    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
