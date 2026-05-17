// Sungka — mancala variant with 7 pits per side, 7 shells each. Sow
// counterclockwise; landing in your own home (store) gives another turn.
// Last shell in your own empty pit captures your shell plus all shells in
// the opposite enemy pit. Most shells at end wins.
// AI: depth-3 alpha-beta on store difference + side-shell heuristic.

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = 220;
  const W = canvas.width, H = canvas.height;
  const statusEl = document.getElementById("playable-status");

  // Indices: 0..6 = your pits (left→right), 7 = your home,
  //          8..14 = AI pits (right→left as seen on top), 15 = AI home.
  // Counterclockwise traversal: 0→1→…→6→7(yourHome)→8→…→14→back to 0.
  let pits, turn, winner;
  function newGame(){
    pits = new Array(16).fill(0);
    for (let i = 0; i < 7; i++){ pits[i] = 7; pits[8 + i] = 7; }
    turn = "you"; winner = null;
  }
  newGame();

  const YOUR_PITS = [0,1,2,3,4,5,6];
  const AI_PITS = [8,9,10,11,12,13,14];
  const YOUR_HOME = 7, AI_HOME = 15;
  const OPPOSITE = { 0:14, 1:13, 2:12, 3:11, 4:10, 5:9, 6:8, 8:6, 9:5, 10:4, 11:3, 12:2, 13:1, 14:0 };

  function sow(state, idx, side){
    const ns = state.slice();
    let shells = ns[idx]; ns[idx] = 0;
    let pos = idx;
    while (shells > 0){
      pos = (pos + 1) % 16;
      if (side === "you" && pos === AI_HOME) continue;
      if (side === "ai" && pos === YOUR_HOME) continue;
      ns[pos]++; shells--;
    }
    let extraTurn = false;
    const ownHome = side === "you" ? YOUR_HOME : AI_HOME;
    if (pos === ownHome) extraTurn = true;
    else {
      const ownPits = side === "you" ? YOUR_PITS : AI_PITS;
      if (ownPits.includes(pos) && ns[pos] === 1){
        const opp = OPPOSITE[pos];
        if (ns[opp] > 0){
          ns[ownHome] += ns[opp] + 1; ns[opp] = 0; ns[pos] = 0;
        }
      }
    }
    return { state: ns, extraTurn };
  }
  function legalMoves(state, side){
    const pits = side === "you" ? YOUR_PITS : AI_PITS;
    return pits.filter(i => state[i] > 0);
  }
  function gameOver(state){
    return legalMoves(state, "you").length === 0 || legalMoves(state, "ai").length === 0;
  }
  function finalize(state){
    let s = state.slice();
    for (const i of YOUR_PITS){ s[YOUR_HOME] += s[i]; s[i] = 0; }
    for (const i of AI_PITS){ s[AI_HOME] += s[i]; s[i] = 0; }
    return s;
  }

  function evalState(state){
    // From AI's perspective: positive = AI ahead.
    return state[AI_HOME] - state[YOUR_HOME] + (state.slice(8,15).reduce((a,b)=>a+b,0) - state.slice(0,7).reduce((a,b)=>a+b,0)) * 0.1;
  }
  function alphabeta(state, depth, alpha, beta, side){
    if (gameOver(state)){ const f = finalize(state); return f[AI_HOME] - f[YOUR_HOME]; }
    if (depth === 0) return evalState(state);
    const moves = legalMoves(state, side);
    if (!moves.length) return alphabeta(state, depth - 1, alpha, beta, side === "you" ? "ai" : "you");
    if (side === "ai"){
      let best = -Infinity;
      for (const m of moves){
        const { state: ns, extraTurn } = sow(state, m, "ai");
        const v = alphabeta(ns, depth - 1, alpha, beta, extraTurn ? "ai" : "you");
        if (v > best) best = v; alpha = Math.max(alpha, v); if (beta <= alpha) break;
      }
      return best;
    } else {
      let best = Infinity;
      for (const m of moves){
        const { state: ns, extraTurn } = sow(state, m, "you");
        const v = alphabeta(ns, depth - 1, alpha, beta, extraTurn ? "you" : "ai");
        if (v < best) best = v; beta = Math.min(beta, v); if (beta <= alpha) break;
      }
      return best;
    }
  }

  function aiPick(){
    const moves = legalMoves(pits, "ai");
    if (!moves.length) return -1;
    let best = moves[0], bestV = -Infinity;
    for (const m of moves){
      const { state: ns, extraTurn } = sow(pits, m, "ai");
      const v = alphabeta(ns, 3, -Infinity, Infinity, extraTurn ? "ai" : "you");
      if (v > bestV){ bestV = v; best = m; }
    }
    return best;
  }

  function aiMove(){
    if (winner) return;
    const m = aiPick();
    if (m < 0){ endGame(); return; }
    const { state: ns, extraTurn } = sow(pits, m, "ai");
    pits = ns;
    if (gameOver(pits)){ endGame(); return; }
    if (extraTurn){ draw(); setTimeout(aiMove, 500); return; }
    turn = "you"; draw();
  }

  function endGame(){
    pits = finalize(pits);
    if (pits[YOUR_HOME] > pits[AI_HOME]) winner = "you";
    else if (pits[AI_HOME] > pits[YOUR_HOME]) winner = "ai";
    else winner = "draw";
    draw();
  }

  function pitRect(i){
    const pw = 38, ph = 38;
    const margin = 24;
    if (i === YOUR_HOME) return { x: W - margin - pw, y: H/2 - ph/2, w: pw, h: ph * 2 };
    if (i === AI_HOME) return { x: margin, y: H/2 - ph/2, w: pw, h: ph * 2 };
    if (YOUR_PITS.includes(i)){
      const k = i; const cellW = (W - 2*margin - 2*pw - 20) / 7;
      return { x: margin + pw + 10 + k * cellW, y: H/2 + 10, w: cellW - 4, h: ph };
    }
    // ai pits: 8..14, displayed right→left on top
    const k = i - 8; const cellW = (W - 2*margin - 2*pw - 20) / 7;
    return { x: margin + pw + 10 + (6 - k) * cellW, y: H/2 - 10 - ph, w: cellW - 4, h: ph };
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "13px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";
    ctx.fillText(`you ${pits[YOUR_HOME]} : ${pits[AI_HOME]} AI`, W/2, H - 6);

    for (let i = 0; i < 16; i++){
      const r = pitRect(i);
      ctx.fillStyle = (i === YOUR_HOME || i === AI_HOME) ? "#fff2dc" : "#fff";
      ctx.fillRect(r.x, r.y, r.w, r.h);
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
    for (const i of YOUR_PITS){
      const r = pitRect(i);
      if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h && pits[i] > 0){
        const { state: ns, extraTurn } = sow(pits, i, "you"); pits = ns;
        if (gameOver(pits)){ endGame(); return; }
        if (extraTurn){ draw(); return; }
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
      const __mv = __mvs[Math.floor(Math.random() * __mvs.length)];
      const { state: ns, extraTurn } = sow(pits, __mv, "you"); pits = ns;
      if (gameOver(pits)){ endGame(); return; }
      if (extraTurn){ draw(); return; }
      turn = "ai"; draw();
      setTimeout(aiMove, 80);
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
