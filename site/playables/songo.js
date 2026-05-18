// Songo — West African mancala variant in the Oware family. Two rows of 6
// pits with 4 seeds each. Sow counter-clockwise. Capture: if last seed lands
// in an opponent pit and brings it to 2 or 3 seeds, capture those (and walk
// backwards capturing 2s and 3s in opponent territory). Win at majority of
// seeds. You play bottom side.

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 420);
  canvas.width = size;
  canvas.height = 220;
  const W = canvas.width, H = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) { canvas.style.width = W + 'px'; canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr); }
  const statusEl = document.getElementById("playable-status");

  // pits 0..5 = you (bottom, left-to-right), 6..11 = ai (top, right-to-left visually)
  let pits, scores, turn, winner;
  function newGame(){
    pits = new Array(12).fill(4);
    scores = { you: 0, ai: 0 };
    turn = "you"; winner = null;
  }
  newGame();

  function sow(state, side, pitIdx){
    // returns { pits, captured, lastIdx, ownSide } where state cloned
    const p = state.pits.slice();
    let seeds = p[pitIdx]; p[pitIdx] = 0;
    let i = pitIdx;
    while (seeds > 0){
      i = (i + 1) % 12;
      // skip own side capture-back rule? In standard oware-like Songo: skip the source pit if going round
      if (i === pitIdx) continue;
      p[i]++; seeds--;
    }
    return { pits: p, lastIdx: i };
  }
  function legalPits(side){
    const lo = side === "you" ? 0 : 6;
    const hi = side === "you" ? 6 : 12;
    const out = [];
    for (let i = lo; i < hi; i++) if (pits[i] > 0) out.push(i);
    return out;
  }
  function applyMove(side, pitIdx){
    const { pits: newPits, lastIdx } = sow({ pits }, side, pitIdx);
    pits = newPits;
    // capture from lastIdx walking back if in opponent territory and pit has 2 or 3
    let i = lastIdx;
    const oppLo = side === "you" ? 6 : 0;
    const oppHi = side === "you" ? 12 : 6;
    const myScore = side === "you" ? "you" : "ai";
    let captured = 0;
    while (i >= oppLo && i < oppHi && (pits[i] === 2 || pits[i] === 3)){
      captured += pits[i]; pits[i] = 0;
      // walk backwards
      i = (i - 1 + 12) % 12;
    }
    scores[myScore] += captured;
  }

  function aiMove(){
    if (winner) return;
    const opts = legalPits("ai");
    if (!opts.length){
      // collect remaining seeds and end
      for (let i = 0; i < 12; i++){ scores[i < 6 ? "you" : "ai"] += pits[i]; pits[i] = 0; }
      endGame(); return;
    }
    // try each: pick highest capture
    let best = opts[0], bestCap = -1;
    for (const idx of opts){
      const snap = pits.slice(); const ss = { ...scores };
      applyMove("ai", idx);
      const cap = scores.ai - ss.ai;
      if (cap > bestCap){ bestCap = cap; best = idx; }
      pits = snap; scores = ss;
    }
    applyMove("ai", best);
    if (!legalPits("you").length){
      for (let i = 0; i < 12; i++){ scores[i < 6 ? "you" : "ai"] += pits[i]; pits[i] = 0; }
      endGame(); return;
    }
    turn = "you"; draw();
  }
  function endGame(){
    winner = scores.you > scores.ai ? "you" : scores.ai > scores.you ? "ai" : "draw";
    draw();
  }

  function pitRect(i){
    const margin = 16;
    const pw = (W - 2*margin) / 6;
    const ph = 60;
    if (i < 6){
      return { x: margin + i * pw, y: 90 + 50, w: pw - 4, h: ph };
    } else {
      const c = 11 - i;
      return { x: margin + c * pw, y: 50, w: pw - 4, h: ph };
    }
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "12px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";
    for (let i = 0; i < 12; i++){
      const rc = pitRect(i);
      ctx.fillStyle = i < 6 ? "#cef2cf" : "#fff3c4";
      ctx.fillRect(rc.x, rc.y, rc.w, rc.h);
      ctx.strokeStyle = "#888"; ctx.strokeRect(rc.x, rc.y, rc.w, rc.h);
      ctx.fillStyle = "#222"; ctx.font = "18px sans-serif"; ctx.fillText(String(pits[i]), rc.x + rc.w/2, rc.y + rc.h/2 + 6);
    }
    ctx.font = "11px sans-serif"; ctx.fillStyle = "#444";
    ctx.textAlign = "left"; ctx.fillText(`AI ${scores.ai}`, 12, 40);
    ctx.textAlign = "right"; ctx.fillText(`you ${scores.you}`, W - 12, H - 18);
    if (winner) statusEl.textContent = winner === "draw" ? `draw ${scores.you}-${scores.ai}` : winner === "you" ? `you win ${scores.you}-${scores.ai}` : `AI wins ${scores.ai}-${scores.you}`;
    else statusEl.textContent = turn === "you" ? "click one of your (green) pits" : "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }

  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e);
    for (let i = 0; i < 6; i++){
      const rc = pitRect(i);
      if (x < rc.x || x > rc.x + rc.w || y < rc.y || y > rc.y + rc.h) continue;
      if (pits[i] === 0) return;
      applyMove("you", i);
      if (!legalPits("ai").length){
        for (let j = 0; j < 12; j++){ scores[j < 6 ? "you" : "ai"] += pits[j]; pits[j] = 0; }
        endGame(); return;
      }
      turn = "ai"; draw(); setTimeout(aiMove, 400); return;
    }
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve(){
      if (winner || turn !== "you") return;
      const __mvs = legalPits("you");
      if (!__mvs.length) { winner = "ai"; draw(); return; }
      const __mv = __mvs[Math.floor(Math.random() * __mvs.length)];
      applyMove("you", __mv);
      if (!legalPits("ai").length){
        for (let j = 0; j < 12; j++){ scores[j < 6 ? "you" : "ai"] += pits[j]; pits[j] = 0; }
        endGame(); return;
      }
      turn = "ai"; draw();
      setTimeout(aiMove, 80);
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
