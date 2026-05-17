// Pallanguzhi — 2×7 mancala with chain sowing. Pick up a pit's seeds and sow
// counterclockwise. After sowing, pick up the next pit and continue. Chain
// stops when last seed lands in an empty pit; the seeds in the pit beyond
// are captured. Most seeds at end wins. AI: 2-ply greedy on capture diff.

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = 220;
  const W = canvas.width, H = canvas.height;
  const statusEl = document.getElementById("playable-status");

  // Indices: 0..6 your pits (left→right). 7..13 ai pits (right→left on top).
  // Counterclockwise traversal: 0,1,...,6,7,8,...,13,0,...
  let pits, captures, turn, winner;
  function newGame(){
    pits = new Array(14).fill(6);
    captures = { you: 0, ai: 0 };
    turn = "you"; winner = null;
  }
  newGame();

  function sowChain(state, idx, side){
    const ns = state.slice();
    let captured = 0;
    let pos = idx;
    while (true){
      let shells = ns[pos]; ns[pos] = 0;
      if (shells === 0) break;
      while (shells > 0){
        pos = (pos + 1) % 14;
        ns[pos]++; shells--;
      }
      // chain continues if next pit non-empty
      const nextPit = (pos + 1) % 14;
      if (ns[nextPit] > 0){ pos = nextPit; continue; }
      // chain ends. Capture seeds in pit beyond (pos+2)
      const capPit = (pos + 2) % 14;
      // Only capture if we are picking seeds — and only if cap pit has seeds
      // and is on either side (Pallanguzhi captures from either side in many variants).
      captured += ns[capPit]; ns[capPit] = 0;
      break;
    }
    return { state: ns, captured };
  }
  function legalMoves(state, side){
    const start = side === "you" ? 0 : 7;
    const out = [];
    for (let i = 0; i < 7; i++) if (state[start + i] > 0) out.push(start + i);
    return out;
  }
  function sideEmpty(state, side){
    const start = side === "you" ? 0 : 7;
    for (let i = 0; i < 7; i++) if (state[start + i] > 0) return false;
    return true;
  }

  function aiPick(){
    const moves = legalMoves(pits, "ai");
    if (!moves.length) return -1;
    let best = moves[0], bestCap = -1;
    for (const m of moves){
      const { captured } = sowChain(pits, m, "ai");
      if (captured > bestCap){ bestCap = captured; best = m; }
    }
    return best;
  }

  function aiMove(){
    if (winner) return;
    if (sideEmpty(pits, "ai")){ endGame(); return; }
    const m = aiPick(); if (m < 0){ endGame(); return; }
    const { state, captured } = sowChain(pits, m, "ai"); pits = state; captures.ai += captured;
    if (sideEmpty(pits, "you") || sideEmpty(pits, "ai")){ endGame(); return; }
    turn = "you"; draw();
  }

  function endGame(){
    // remaining seeds go to that side's owner
    for (let i = 0; i < 7; i++){ captures.you += pits[i]; pits[i] = 0; }
    for (let i = 7; i < 14; i++){ captures.ai += pits[i]; pits[i] = 0; }
    if (captures.you > captures.ai) winner = "you";
    else if (captures.ai > captures.you) winner = "ai";
    else winner = "draw";
    draw();
  }

  function pitRect(i){
    const pw = 38, ph = 38;
    const margin = 20;
    const cellW = (W - 2*margin) / 7;
    if (i < 7){
      return { x: margin + i * cellW, y: H/2 + 10, w: cellW - 6, h: ph };
    }
    const k = i - 7;
    return { x: margin + (6 - k) * cellW, y: H/2 - 10 - ph, w: cellW - 6, h: ph };
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "13px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";
    ctx.fillText(`captures: you ${captures.you} : ${captures.ai} AI`, W/2, H - 6);

    for (let i = 0; i < 14; i++){
      const r = pitRect(i);
      ctx.fillStyle = "#fff"; ctx.fillRect(r.x, r.y, r.w, r.h);
      ctx.strokeStyle = "#222"; ctx.strokeRect(r.x, r.y, r.w, r.h);
      ctx.fillStyle = "#222"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(String(pits[i]), r.x + r.w/2, r.y + r.h/2);
      ctx.textBaseline = "alphabetic";
    }

    if (winner) statusEl.textContent = winner === "draw" ? "draw" : winner === "you" ? "you win!" : "AI wins";
    else statusEl.textContent = turn === "you" ? "click one of YOUR (lower) pits to sow" : "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }

  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e);
    for (let i = 0; i < 7; i++){
      const r = pitRect(i);
      if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h && pits[i] > 0){
        const { state, captured } = sowChain(pits, i, "you"); pits = state; captures.you += captured;
        if (sideEmpty(pits, "you") || sideEmpty(pits, "ai")){ endGame(); return; }
        turn = "ai"; draw(); setTimeout(aiMove, 400); return;
      }
    }
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve(){
      if (winner || turn !== "you") return;
      const __mvs = legalMoves(pits, "you");
      if (!__mvs.length) { endGame(); return; }
      const __m = __mvs[Math.floor(Math.random() * __mvs.length)];
      const { state, captured } = sowChain(pits, __m, "you"); pits = state; captures.you += captured;
      if (sideEmpty(pits, "you") || sideEmpty(pits, "ai")){ endGame(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 80);
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
