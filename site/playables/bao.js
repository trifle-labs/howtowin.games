// Bao la Kujifunza — 4 rows × 8 pits, 2 seeds per pit. Sow counterclockwise
// within your own two rows. Relay: last seed in a non-empty pit picks up and
// continues. Capture: relay ends in your front row across from a non-empty
// enemy front pit — those seeds go to your back row. Player who cannot move
// loses. AI: depth-2 alpha-beta on seed differential.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = 240;
  const W = canvas.width, H = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) { canvas.style.width = W + 'px'; canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr); }
  const statusEl = document.getElementById("playable-status");

  // Board: 4 rows × 8 columns. Row 0 = AI back, Row 1 = AI front,
  // Row 2 = player front, Row 3 = player back.
  // Pit index = row * 8 + col.
  const ROWS = 4, COLS = 8;
  const AI_FRONT = [8,9,10,11,12,13,14,15];
  const AI_BACK = [0,1,2,3,4,5,6,7];
  const PL_FRONT = [16,17,18,19,20,21,22,23];
  const PL_BACK = [24,25,26,27,28,29,30,31];
  const PL_ALL = PL_FRONT.concat(PL_BACK);
  const AI_ALL = AI_FRONT.concat(AI_BACK);

  // Circuits: front left→right, then back right→left (counterclockwise)
  const PLC = [16,17,18,19,20,21,22,23,31,30,29,28,27,26,25,24];
  const AIC = [8,9,10,11,12,13,14,15,7,6,5,4,3,2,1,0];
  const CL = 16;

  function pci(p) { return p <= 23 ? p - 16 : 39 - p; }
  function aci(p) { return p <= 15 ? p - 8 : 15 - p; }

  let pits, turn, winner;

  function newGame() {
    pits = new Array(32).fill(2);
    turn = "you"; winner = null;
  }
  newGame();

  function hasMoves(state, side) {
    const pp = side === "you" ? PL_ALL : AI_ALL;
    return pp.some(i => state[i] > 0);
  }

  function applyMove(state, idx, side) {
    const ns = state.slice();
    const isP = side === "you";
    const circuit = isP ? PLC : AIC;
    const ciFn = isP ? pci : aci;
    const frontRow = isP ? PL_FRONT : AI_FRONT;
    const backOrder = isP ? [31,30,29,28,27,26,25,24] : [7,6,5,4,3,2,1,0];

    let cur = idx;

    while (true) {
      const seeds = ns[cur];
      if (seeds === 0) break;
      ns[cur] = 0;
      let pos = (ciFn(cur) + 1) % CL;
      let s = seeds, last = cur;

      while (s > 0) {
        const t = circuit[pos];
        ns[t]++;
        s--;
        if (s === 0) { last = t; break; }
        pos = (pos + 1) % CL;
      }

      // Relay: if last seed landed in a pit that was non-empty (now ≥ 2)
      if (ns[last] >= 2) { cur = last; continue; }

      // Capture check: relay ended in front row, opposite enemy pit non-empty
      if (frontRow.includes(last)) {
        const opp = isP ? last - 8 : last + 8;
        if (ns[opp] > 0) {
          const captured = ns[opp];
          ns[opp] = 0;
          let rem = captured, bi = 0;
          while (rem > 0) {
            ns[backOrder[bi]]++;
            rem--;
            bi = (bi + 1) % 8;
          }
        }
      }
      break; // turn ends
    }
    return { state: ns };
  }

  // --- Heuristic AI ---
  function seedCount(state, side) {
    const pp = side === "you" ? PL_ALL : AI_ALL;
    return pp.reduce((a, i) => a + state[i], 0);
  }

  function evalState(state) {
    return seedCount(state, "ai") - seedCount(state, "you");
  }

  function minimax(state, depth, side, alpha, beta) {
    if (depth === 0) return evalState(state);
    if (!hasMoves(state, "you") || !hasMoves(state, "ai")) {
      return hasMoves(state, "ai") ? 64 : -64;
    }
    const pp = side === "you" ? PL_ALL : AI_ALL;
    const moves = pp.filter(i => state[i] > 0);
    if (!moves.length) return side === "ai" ? -64 : 64;

    if (side === "ai") {
      let best = -Infinity;
      for (const m of moves) {
        const r = applyMove(state, m, "ai");
        const v = minimax(r.state, depth - 1, "you", alpha, beta);
        if (v > best) best = v;
        alpha = Math.max(alpha, v);
        if (beta <= alpha) break;
      }
      return best;
    } else {
      let best = Infinity;
      for (const m of moves) {
        const r = applyMove(state, m, "you");
        const v = minimax(r.state, depth - 1, "ai", alpha, beta);
        if (v < best) best = v;
        beta = Math.min(beta, v);
        if (beta <= alpha) break;
      }
      return best;
    }
  }

  function aiPick() {
    const mv = AI_ALL.filter(i => pits[i] > 0);
    if (!mv.length) return -1;
    let best = mv[0], bv = -Infinity;
    for (const m of mv) {
      const r = applyMove(pits, m, "ai");
      const v = minimax(r.state, 2, "you", -Infinity, Infinity);
      if (v > bv) { bv = v; best = m; }
    }
    return best;
  }

  function aiMove() {
    if (winner) return;
    if (!hasMoves(pits, "ai")) { winner = "you"; draw(); return; }
    const m = aiPick();
    if (m < 0) { winner = "you"; draw(); return; }
    const r = applyMove(pits, m, "ai"); pits = r.state;
    if (!hasMoves(pits, "you")) { winner = "ai"; draw(); return; }
    if (!hasMoves(pits, "ai")) { winner = "you"; draw(); return; }
    turn = "you"; draw();
  }

  // --- Drawing ---
  function pitRect(row, col) {
    const margin = 14, gap = 4, centerGap = 16;
    const pw = (W - 2 * margin) / COLS;
    const ph = 30;
    const topY = 30;
    const rowGap = 6;
    const y = topY + row * (ph + rowGap) + (row >= 2 ? centerGap : 0);
    return { x: margin + col * pw, y, w: pw - gap, h: ph };
  }

  function draw() {
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);

    // Score
    const youTot = seedCount(pits, "you");
    const aiTot = seedCount(pits, "ai");
    ctx.font = "12px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";
    ctx.fillText(`Bao la Kujifunza — you ${youTot}  ai ${aiTot}`, W / 2, 18);

    // Center divider
    const mr = 14;
    const dividerY = pitRect(1, 0).y + 30 + 6;
    ctx.strokeStyle = "#bbb"; ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(mr, dividerY);
    ctx.lineTo(W - mr, dividerY);
    ctx.stroke();

    // Row labels
    ctx.font = "10px sans-serif"; ctx.textAlign = "left"; ctx.fillStyle = "#888";
    const y0 = pitRect(0, 0).y;
    ctx.fillText("ai back", mr, y0 - 4);
    const y1 = pitRect(1, 0).y;
    ctx.fillText("ai front", mr, y1 - 4);
    const y2 = pitRect(2, 0).y;
    ctx.fillText("your front", mr, y2 - 4);
    const y3 = pitRect(3, 0).y;
    ctx.fillText("your back", mr, y3 - 4);

    // Pits
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const i = r * 8 + c;
        const rc = pitRect(r, c);
        const isYou = r >= 2;
        ctx.fillStyle = isYou ? (r === 2 ? "#e3f0fa" : "#d1e6f7") : (r === 0 ? "#fae3d7" : "#f7d4c4");
        ctx.fillRect(rc.x, rc.y, rc.w, rc.h);
        ctx.strokeStyle = "#888"; ctx.lineWidth = 1;
        ctx.strokeRect(rc.x, rc.y, rc.w, rc.h);
        ctx.fillStyle = "#222"; ctx.font = "12px sans-serif";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(String(pits[i]), rc.x + rc.w / 2, rc.y + rc.h / 2);
        ctx.textBaseline = "alphabetic";
      }
    }

    if (winner) statusEl.textContent = winner === "you" ? "you win!" : "AI wins";
    else if (!hasMoves(pits, "you")) statusEl.textContent = "no moves left — game over";
    else statusEl.textContent = turn === "you" ? "click one of your pits (bottom two rows)" : "AI thinking…";
  }

  function pos(e) {
    const r = canvas.getBoundingClientRect();
    return { x: (e.clientX - r.left) * (W / r.width), y: (e.clientY - r.top) * (H / r.height) };
  }

  function onClick(e) {
    if (winner || turn !== "you") return;
    if (!hasMoves(pits, "you")) { winner = "ai"; draw(); return; }
    const { x, y } = pos(e);
    for (const i of PL_ALL) {
      const r = pitRect(Math.floor(i / 8), i % 8);
      if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h && pits[i] > 0) {
        const rs = applyMove(pits, i, "you"); pits = rs.state;
        if (!hasMoves(pits, "ai")) { winner = "you"; draw(); return; }
        if (!hasMoves(pits, "you")) { winner = "ai"; draw(); return; }
        turn = "ai"; draw(); setTimeout(aiMove, 500);
        return;
      }
    }
  }

  canvas.addEventListener("click", onClick);
  draw();

  return {
    solve() {
      if (winner || turn !== "you") return;
      const mvs = PL_ALL.filter(i => pits[i] > 0);
      if (!mvs.length) { winner = "ai"; draw(); return; }
      const mv = mvs[Math.floor(Math.random() * mvs.length)];
      const rs = applyMove(pits, mv, "you"); pits = rs.state;
      if (!hasMoves(pits, "ai")) { winner = "you"; draw(); return; }
      if (!hasMoves(pits, "you")) { winner = "ai"; draw(); return; }
      turn = "ai"; draw();
      setTimeout(aiMove, 80);
    },
    destroy() { canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart() { newGame(); draw(); }
  };
}
