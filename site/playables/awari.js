// Awari (Oware) — 6+6 pits, 4 seeds each, two 24-seed stores. Sow counter-
// clockwise. Capture: last seed lands in opponent's row bringing it to 2 or 3
// (chain back along contiguous 2/3 pits in opponent's row). No store grants
// extra turn. AI: depth-4 minimax.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = 220;
  const W = canvas.width, H = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) { canvas.style.width = W + 'px'; canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr); }
  const statusEl = document.getElementById("playable-status");

  // 0..5 = your pits, 6..11 = enemy pits. Stores held separately.
  let pits, stores, turn, winner;
  function newGame(){ pits = new Array(12).fill(4); stores = [0, 0]; turn = "you"; winner = null; }
  newGame();

  function legalMoves(state, side){
    const start = side === "you" ? 0 : 6, end = start + 5;
    const out = [];
    for (let i = start; i <= end; i++) if (state[i] > 0) out.push(i);
    return out;
  }

  function applyMove(state, st, idx, side){
    const ns = state.slice();
    const nst = st.slice();
    let seeds = ns[idx]; ns[idx] = 0;
    let i = idx;
    while (seeds > 0){
      i = (i + 1) % 12;
      if (i === idx) continue; // grand slam exception ignored
      ns[i]++; seeds--;
    }
    // capture: last seed in opponent row, makes it 2 or 3
    const oppStart = side === "you" ? 6 : 0, oppEnd = oppStart + 5;
    const storeIdx = side === "you" ? 0 : 1;
    if (i >= oppStart && i <= oppEnd && (ns[i] === 2 || ns[i] === 3)){
      // chain backwards
      let j = i;
      while (j >= oppStart && j <= oppEnd && (ns[j] === 2 || ns[j] === 3)){
        nst[storeIdx] += ns[j]; ns[j] = 0; j--;
      }
    }
    return { state: ns, stores: nst };
  }

  function done(state, st){
    const youEmpty = state.slice(0, 6).every(p => p === 0);
    const aiEmpty = state.slice(6, 12).every(p => p === 0);
    if (youEmpty || aiEmpty){
      // remaining seeds go to player whose side still has seeds
      let s = 0; for (let i = 0; i < 12; i++) s += state[i];
      if (youEmpty){ const ns = state.slice(); ns.fill(0); const nst = st.slice(); nst[1] += s; return { ns, nst }; }
      else { const ns = state.slice(); ns.fill(0); const nst = st.slice(); nst[0] += s; return { ns, nst }; }
    }
    if (st[0] > 24 || st[1] > 24) return { ns: state, nst: st };
    return null;
  }

  function evaluate(st){ return st[1] - st[0]; }

  function minimax(state, st, depth, side){
    if (depth === 0) return evaluate(st);
    const d = done(state, st); if (d) return evaluate(d.nst);
    const moves = legalMoves(state, side);
    if (!moves.length) return evaluate(st);
    if (side === "ai"){
      let best = -Infinity;
      for (const m of moves){
        const r = applyMove(state, st, m, "ai");
        const v = minimax(r.state, r.stores, depth - 1, "you");
        if (v > best) best = v;
      }
      return best;
    } else {
      let best = Infinity;
      for (const m of moves){
        const r = applyMove(state, st, m, "you");
        const v = minimax(r.state, r.stores, depth - 1, "ai");
        if (v < best) best = v;
      }
      return best;
    }
  }

  function aiPick(){
    const moves = legalMoves(pits, "ai"); if (!moves.length) return -1;
    let best = moves[0], bv = -Infinity;
    for (const m of moves){
      const r = applyMove(pits, stores, m, "ai");
      const v = minimax(r.state, r.stores, 4, "you");
      if (v > bv){ bv = v; best = m; }
    }
    return best;
  }

  function aiMove(){
    if (winner) return;
    const m = aiPick(); if (m < 0){ endGame(); return; }
    const r = applyMove(pits, stores, m, "ai"); pits = r.state; stores = r.stores;
    const d = done(pits, stores); if (d){ pits = d.ns; stores = d.nst; endGame(); return; }
    turn = "you"; draw();
  }

  function endGame(){
    if (stores[0] > stores[1]) winner = "you";
    else if (stores[1] > stores[0]) winner = "ai";
    else winner = "draw";
    draw();
  }

  function pitRect(idx){
    const margin = 30, pitW = (size - 2*margin) / 6, pitH = 60;
    if (idx <= 5) return { x: margin + idx * pitW, y: 40 + pitH + 20, w: pitW - 4, h: pitH };
    // 6..11 → enemy pits, drawn right-to-left
    const enemyIdx = 11 - idx;
    return { x: margin + enemyIdx * pitW, y: 40, w: pitW - 4, h: pitH };
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "13px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";
    ctx.fillText(`Awari — you ${stores[0]}   ai ${stores[1]}   (first to 25 wins)`, W/2, 22);

    for (let i = 0; i < 12; i++){
      const r = pitRect(i);
      ctx.fillStyle = "#fff"; ctx.fillRect(r.x, r.y, r.w, r.h);
      ctx.strokeStyle = "#888"; ctx.strokeRect(r.x, r.y, r.w, r.h);
      ctx.fillStyle = "#222"; ctx.font = "14px sans-serif";
      ctx.fillText(`${pits[i]}`, r.x + r.w/2, r.y + r.h/2 + 5);
    }
    if (winner) statusEl.textContent = winner === "you" ? "you win!" : winner === "ai" ? "AI wins" : "draw";
    else statusEl.textContent = turn === "you" ? "click one of your pits (bottom)" : "AI thinking…";
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
    const r = applyMove(pits, stores, i, "you"); pits = r.state; stores = r.stores;
    const d = done(pits, stores); if (d){ pits = d.ns; stores = d.nst; endGame(); return; }
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
      const __r = applyMove(pits, stores, __mv, "you"); pits = __r.state; stores = __r.stores;
      const __d = done(pits, stores); if (__d){ pits = __d.ns; stores = __d.nst; endGame(); return; }
      turn = "ai"; draw();
      setTimeout(aiMove, 80);
    },

    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
