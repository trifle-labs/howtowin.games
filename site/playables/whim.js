// Whim — Conway's variation on Nim: any turn, a player may instead declare
// "whim" (changes the game from normal to misère). Whim can be declared only
// once in the entire game. Solver follows Conway's analysis: play Nim normally,
// but when the position would be a Nim P-position, optionally use the whim.

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = 340;
  const W = canvas.width, H = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) { canvas.style.width = W + 'px'; canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr); }
  const statusEl = document.getElementById("playable-status");

  let heaps, whimUsed, misere, turn, winner;
  function newGame(){ heaps = [3, 4, 5]; whimUsed = false; misere = false; turn = "you"; winner = null; }
  newGame();

  function xorAll(hs){ let x = 0; for (const h of hs) x ^= h; return x; }

  function endsHere(hs){ return hs.every(h => h === 0); }

  // Heuristic AI:
  // - If misère is active and all heaps ≤ 1: standard misère move (leave odd count of 1-heaps).
  // - Else: standard Nim move to zero XOR.
  // - If no winning Nim move and whim still available, declare whim (flip rules).
  function nimMove(hs){
    const x = xorAll(hs);
    if (x === 0) return null;
    for (let i = 0; i < hs.length; i++){
      const target = hs[i] ^ x;
      if (target < hs[i]) return { kind: "take", i, n: hs[i] - target };
    }
    return null;
  }
  function misereMove(hs){
    // misère Nim: if all heaps ≤ 1, leave odd number of 1-heaps for opponent
    const big = hs.filter(h => h > 1).length;
    if (big === 0){
      const ones = hs.filter(h => h === 1).length;
      // leave opponent with odd ones → take to make ones - 1 odd → take one 1
      if (ones >= 1) {
        const i = hs.indexOf(1);
        return { kind: "take", i, n: 1 };
      }
      return null;
    }
    // standard Nim until only 1 big heap, then adjust
    const x = xorAll(hs);
    if (big === 1){
      // find the big heap; reduce so remaining ones-count flips parity correctly
      const bigIx = hs.findIndex(h => h > 1);
      const onesCount = hs.filter(h => h === 1).length;
      // we want opponent to face: all 1s with EVEN count of 1s (then they're stuck losing). So make ones-after = onesCount, parity even.
      const target = (onesCount % 2 === 0) ? 1 : 0;
      return { kind: "take", i: bigIx, n: hs[bigIx] - target };
    }
    if (x === 0) return null;
    for (let i = 0; i < hs.length; i++){
      const target = hs[i] ^ x;
      if (target < hs[i]) return { kind: "take", i, n: hs[i] - target };
    }
    return null;
  }

  function aiMove(){
    if (winner) return;
    const mv = misere ? misereMove(heaps) : nimMove(heaps);
    if (mv){
      heaps[mv.i] -= mv.n;
    } else if (!whimUsed){
      // No winning move under current rules — declare whim
      whimUsed = true;
      misere = !misere;
      statusEl.textContent = "AI declares WHIM! Rules flipped.";
      turn = "you"; draw(); return;
    } else {
      // forced to take 1 from some heap
      const i = heaps.findIndex(h => h > 0);
      if (i < 0){ winner = misere ? "ai" : "you"; draw(); return; }
      heaps[i] -= 1;
    }
    if (endsHere(heaps)){
      // last to move wins (normal) or loses (misère)
      winner = misere ? "you" : "ai";
      draw(); return;
    }
    turn = "you"; draw();
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "13px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";
    ctx.fillText(misere ? "MISÈRE: last to take LOSES" : "NORMAL: last to take WINS", W/2, 42);
    ctx.fillText("whim " + (whimUsed ? "USED" : "available"), W/2, 60);

    // heaps as columns of dots
    const baseY = 230, dotR = 8;
    for (let i = 0; i < heaps.length; i++){
      const cx = 80 + i*100;
      ctx.fillStyle = "#888"; ctx.fillText(`heap ${i+1}`, cx, 90);
      for (let k = 0; k < heaps[i]; k++){
        const y = baseY - k*20;
        ctx.beginPath(); ctx.arc(cx, y, dotR, 0, Math.PI*2);
        ctx.fillStyle = "#444"; ctx.fill();
      }
      // take-1 button
      ctx.fillStyle = (turn === "you" && !winner && heaps[i] > 0) ? "#5a7" : "#bbb";
      ctx.fillRect(cx - 36, 260, 72, 24);
      ctx.fillStyle = "#fff"; ctx.font = "12px sans-serif"; ctx.textBaseline = "middle";
      ctx.fillText(`take 1 from ${i+1}`, cx, 272);
      ctx.textBaseline = "alphabetic";
    }
    // whim button
    ctx.fillStyle = (turn === "you" && !winner && !whimUsed) ? "#a75" : "#bbb";
    ctx.fillRect(W/2 - 60, 300, 120, 26);
    ctx.fillStyle = "#fff"; ctx.font = "13px sans-serif"; ctx.textBaseline = "middle";
    ctx.fillText("declare WHIM", W/2, 313);
    ctx.textBaseline = "alphabetic";

    if (winner) statusEl.textContent = winner === "you" ? "you win!" : "AI wins";
    else statusEl.textContent = turn === "you" ? "take 1 from any heap, or declare whim" : "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }
  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e);
    // heap take buttons
    for (let i = 0; i < heaps.length; i++){
      const cx = 80 + i*100;
      if (x >= cx - 36 && x <= cx + 36 && y >= 260 && y <= 284 && heaps[i] > 0){
        heaps[i] -= 1;
        if (endsHere(heaps)){ winner = misere ? "ai" : "you"; draw(); return; }
        turn = "ai"; draw(); setTimeout(aiMove, 500); return;
      }
    }
    if (!whimUsed && x >= W/2 - 60 && x <= W/2 + 60 && y >= 300 && y <= 326){
      whimUsed = true; misere = !misere;
      turn = "ai"; draw(); setTimeout(aiMove, 500);
    }
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
    solve(){
      if (winner || turn !== "you") return;
      const mv = misere ? misereMove(heaps) : nimMove(heaps);
      if (mv){ heaps[mv.i] -= mv.n; }
      else if (!whimUsed){ whimUsed = true; misere = !misere; turn = "ai"; draw(); setTimeout(aiMove, 500); return; }
      else { const i = heaps.findIndex(h => h > 0); if (i >= 0) heaps[i] -= 1; }
      if (endsHere(heaps)){ winner = misere ? "ai" : "you"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 500);
    },
  };
}
