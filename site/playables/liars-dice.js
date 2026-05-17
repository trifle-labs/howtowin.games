// Liar's Dice — 2-player, 3 dice each (hidden from opponent). Each round both
// players roll. You bid by stating "N dice show face F" — the next bid must
// raise either N or F. Alternatively, call "Liar!" and the cup is opened. If
// the previous bid was correct, the caller loses a die; otherwise the bidder
// does. First to lose all dice loses the game.

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = 320;
  const W = canvas.width, H = canvas.height;
  const statusEl = document.getElementById("playable-status");

  let youDice, aiDice, lastBid, bidder, winner, msg, showAI;
  function roll(n){ return Array.from({ length: n }, () => 1 + Math.floor(Math.random() * 6)); }
  function newGame(){
    youDice = roll(3); aiDice = roll(3);
    lastBid = null; // { qty, face, by }
    bidder = "you"; winner = null; msg = "you start the bidding"; showAI = false;
  }
  newGame();

  function newRound(loser){
    if (loser === 'you') youDice.pop(); else aiDice.pop();
    if (!youDice.length){ winner = "ai"; return; }
    if (!aiDice.length){ winner = "you"; return; }
    youDice = roll(youDice.length); aiDice = roll(aiDice.length);
    lastBid = null; bidder = loser === 'you' ? "you" : "ai";
    showAI = false;
  }

  function expectedTotal(face){
    const knownMine = youDice.filter(d => d === face).length;
    const expectedAI = aiDice.length / 6; // expected count of any face among AI dice
    return knownMine + expectedAI;
  }

  function aiTurn(){
    if (winner) return;
    if (!lastBid){
      // open bid
      const face = 2 + Math.floor(Math.random() * 5);
      lastBid = { qty: 2, face, by: 'ai' };
      bidder = "you"; msg = `AI opens with: 2 dice of face ${face}`;
      draw(); return;
    }
    // decide call vs raise. AI sees its own dice. Total dice = youDice.length + aiDice.length.
    const totalDice = youDice.length + aiDice.length;
    const knownMine = aiDice.filter(d => d === lastBid.face).length;
    const expectedOther = (totalDice - aiDice.length) / 6;
    const expectedTotalAI = knownMine + expectedOther;
    if (lastBid.qty > expectedTotalAI + 1){
      // call liar
      callLiar('ai');
      return;
    }
    // raise: bump qty by 1 (or face by 1)
    if (Math.random() < 0.5 && lastBid.face < 6){
      lastBid = { qty: lastBid.qty, face: lastBid.face + 1, by: 'ai' };
    } else {
      lastBid = { qty: lastBid.qty + 1, face: lastBid.face, by: 'ai' };
    }
    bidder = "you"; msg = `AI bids: ${lastBid.qty} dice of face ${lastBid.face}`;
    draw();
  }

  function callLiar(caller){
    if (!lastBid){ return; }
    const total = [...youDice, ...aiDice].filter(d => d === lastBid.face).length;
    showAI = true;
    const truth = total >= lastBid.qty;
    let loser;
    if (truth) loser = caller; // bid was correct → caller wrong
    else loser = lastBid.by;
    msg = `Open: ${lastBid.qty}×${lastBid.face} — actual ${total}. ${truth ? "bid was true" : "bid was a lie"}. ${loser === 'you' ? "you lose a die" : "AI loses a die"}.`;
    draw();
    setTimeout(() => {
      newRound(loser);
      draw();
      if (winner) return;
      if (bidder === 'ai') setTimeout(aiTurn, 700);
    }, 1400);
  }

  function drawDie(x, y, sz, face, hidden){
    ctx.fillStyle = hidden ? "#888" : "#fff"; ctx.fillRect(x - sz/2, y - sz/2, sz, sz);
    ctx.strokeStyle = "#222"; ctx.strokeRect(x - sz/2, y - sz/2, sz, sz);
    if (hidden){ ctx.fillStyle = "#fff"; ctx.font = "16px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("?", x, y); ctx.textBaseline = "alphabetic"; return; }
    // dots
    const pip = (px, py) => { ctx.beginPath(); ctx.arc(x + px, y + py, sz*0.08, 0, Math.PI*2); ctx.fillStyle = "#222"; ctx.fill(); };
    const o = sz * 0.25;
    const layout = {
      1: [[0,0]], 2: [[-o,-o],[o,o]], 3: [[-o,-o],[0,0],[o,o]],
      4: [[-o,-o],[o,-o],[-o,o],[o,o]], 5: [[-o,-o],[o,-o],[0,0],[-o,o],[o,o]],
      6: [[-o,-o],[o,-o],[-o,0],[o,0],[-o,o],[o,o]],
    }[face];
    for (const [px, py] of layout) pip(px, py);
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "13px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";

    // ai dice
    ctx.textAlign = "left"; ctx.fillText("AI:", 16, 50);
    for (let k = 0; k < aiDice.length; k++) drawDie(60 + k*42, 50, 32, aiDice[k], !showAI);
    // your dice
    ctx.fillText("You:", 16, 110);
    for (let k = 0; k < youDice.length; k++) drawDie(60 + k*42, 110, 32, youDice[k], false);

    // last bid
    ctx.fillStyle = "#444"; ctx.textAlign = "center";
    ctx.fillText(lastBid ? `Last bid: ${lastBid.qty}×face ${lastBid.face} (by ${lastBid.by})` : "no bid yet", W/2, 150);
    ctx.fillText(msg || "", W/2, 170);

    // controls
    if (bidder === 'you' && !winner){
      ctx.fillStyle = "#444"; ctx.fillText("Your bid:", W/2, 200);
      // qty buttons
      const minQty = lastBid ? lastBid.qty : 1;
      const minFace = lastBid ? lastBid.face : 1;
      ctx.fillText("Quantity:", 60, 226); ctx.fillText("Face:", 60, 256);
      for (let q = minQty; q <= minQty + 3; q++){
        ctx.fillStyle = "#cef2cf"; ctx.fillRect(120 + (q - minQty)*42, 212, 36, 22);
        ctx.strokeStyle = "#222"; ctx.strokeRect(120 + (q - minQty)*42, 212, 36, 22);
        ctx.fillStyle = "#222"; ctx.fillText(q.toString(), 138 + (q - minQty)*42, 228);
      }
      for (let f = 1; f <= 6; f++){
        ctx.fillStyle = (lastBid && f <= minFace) ? "#eee" : "#cef2cf";
        ctx.fillRect(120 + (f - 1)*36, 244, 30, 22);
        ctx.strokeStyle = "#222"; ctx.strokeRect(120 + (f - 1)*36, 244, 30, 22);
        ctx.fillStyle = "#222"; ctx.fillText(f.toString(), 135 + (f - 1)*36, 260);
      }
      if (lastBid){
        ctx.fillStyle = "#fcd"; ctx.fillRect(W/2 - 50, 280, 100, 24);
        ctx.strokeStyle = "#222"; ctx.strokeRect(W/2 - 50, 280, 100, 24);
        ctx.fillStyle = "#222"; ctx.fillText("LIAR!", W/2, 296);
      }
    }

    if (winner) statusEl.textContent = winner === "you" ? "you win the game!" : "AI wins the game";
    else statusEl.textContent = bidder === "you" ? "your turn — bid or call liar" : "AI thinking…";
  }

  // pending bid choice
  let pendQty = null, pendFace = null;
  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }

  function submitIfReady(){
    if (pendQty !== null && pendFace !== null){
      // validate raise
      if (lastBid){
        if (pendQty < lastBid.qty || (pendQty === lastBid.qty && pendFace <= lastBid.face)){
          msg = "bid must increase quantity or face"; draw(); pendQty = null; pendFace = null; return;
        }
      }
      lastBid = { qty: pendQty, face: pendFace, by: 'you' };
      msg = `you bid: ${pendQty} dice of face ${pendFace}`;
      pendQty = null; pendFace = null;
      bidder = "ai"; draw(); setTimeout(aiTurn, 700);
    }
  }

  function onClick(e){
    if (winner || bidder !== 'you') return;
    const { x, y } = pos(e);
    const minQty = lastBid ? lastBid.qty : 1;
    const minFace = lastBid ? lastBid.face : 1;
    for (let q = minQty; q <= minQty + 3; q++){
      const bx = 120 + (q - minQty)*42;
      if (x >= bx && x <= bx + 36 && y >= 212 && y <= 234){ pendQty = q; msg = `qty=${q}`; submitIfReady(); draw(); return; }
    }
    for (let f = 1; f <= 6; f++){
      if (lastBid && f <= minFace) continue;
      const bx = 120 + (f - 1)*36;
      if (x >= bx && x <= bx + 30 && y >= 244 && y <= 266){ pendFace = f; msg = `face=${f}`; submitIfReady(); draw(); return; }
    }
    if (lastBid && x >= W/2 - 50 && x <= W/2 + 50 && y >= 280 && y <= 304){
      callLiar('you'); return;
    }
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve(){
      if (winner || bidder !== "you") return;
      if (lastBid && Math.random() < 0.25){
        // call liar
        callLiar('you'); return;
      }
      // make a random valid raise
      const minQty = lastBid ? lastBid.qty : 1;
      const minFace = lastBid ? lastBid.face : 1;
      // pick qty and face that form a legal raise
      const opts = [];
      for (let q = minQty; q <= minQty + 3; q++){
        for (let f = 1; f <= 6; f++){
          if (lastBid && (q < lastBid.qty || (q === lastBid.qty && f <= lastBid.face))) continue;
          opts.push({ q, f });
        }
      }
      if (!opts.length){ if (lastBid) callLiar('you'); return; }
      const pick = opts[Math.floor(Math.random() * opts.length)];
      lastBid = { qty: pick.q, face: pick.f, by: 'you' };
      msg = `you bid: ${pick.q} dice of face ${pick.f}`;
      pendQty = null; pendFace = null;
      bidder = "ai"; draw(); setTimeout(aiTurn, 80);
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
