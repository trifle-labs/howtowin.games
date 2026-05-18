// Toguz Kumalak — 9 pits per side, 9 pebbles each. Sow counterclockwise;
// capture: last pebble lands in opponent's pit making it even → capture all.
// Tuzdyk: last pebble making opponent's pit exactly 3 claims a permanent
// capturing pit (pebbles sown there go to claimer's kazan). Game ends when
// one side has no legal moves. AI: depth-2 alpha-beta + heuristic.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = 260;
  const W = canvas.width, H = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) { canvas.style.width = W + 'px'; canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr); }
  const statusEl = document.getElementById("playable-status");

  // 0..8 = your pits, 9 = your kazan, 10..18 = AI pits, 19 = AI kazan,
  // 20 = your tuzdyk index (in AI row, -1 if none), 21 = AI tuzdyk index
  // (in your row, -1 if none).
  // Counterclockwise circuit: your left→right, then AI right→left.
  const CIRCUIT = [0,1,2,3,4,5,6,7,8,18,17,16,15,14,13,12,11,10];
  const CL = 18;
  const YR = [0,1,2,3,4,5,6,7,8];       // your pits
  const AR = [10,11,12,13,14,15,16,17,18]; // AI pits
  const MY_TUZ = 20, AI_TUZ = 21;

  let pits, turn, winner;

  function newGame() {
    pits = new Array(22).fill(0);
    for (let i = 0; i < 9; i++) { pits[i] = 9; pits[10 + i] = 9; }
    pits[MY_TUZ] = -1; pits[AI_TUZ] = -1;
    turn = "you"; winner = null;
  }
  newGame();

  function ci(pit) { return pit <= 8 ? pit : 27 - pit; }

  // tuzdyk owner for a pit — reads from state
  function tuzOwner(state, p) {
    if (p === state[MY_TUZ]) return "P";
    if (p === state[AI_TUZ]) return "A";
    return null;
  }

  function sow(state, idx, side) {
    const ns = state.slice();
    const isP = side === "you";
    const store = isP ? 9 : 19;
    const n = ns[idx];
    ns[idx] = 0;
    let pos = ci(idx);
    let rem = n;
    let first = true;

    while (rem > 0) {
      if (first && n > 1) {
        const o = tuzOwner(ns, idx);
        if (o === "P") ns[9]++; else if (o === "A") ns[19]++; else ns[idx] = 1;
        rem--; first = false;
        pos = (pos + 1) % CL;
        continue;
      }
      if (first) { first = false; pos = (pos + 1) % CL; }

      const t = CIRCUIT[pos];
      const isLast = rem === 1;
      const o = tuzOwner(ns, t);

      if (o === "P") { ns[9]++; }
      else if (o === "A") { ns[19]++; }
      else { ns[t]++; }

      rem--;

      if (isLast && !o) {
        const isOpp = isP ? (t >= 10 && t <= 18) : (t >= 0 && t <= 8);
        if (isOpp) {
          const cnt = ns[t];
          if (cnt % 2 === 0) { ns[store] += cnt; ns[t] = 0; }
          else if (cnt === 3) {
            if (isP && ns[MY_TUZ] === -1) {
              const opp = t - 10;
              if (ns[AI_TUZ] === -1 || ns[AI_TUZ] !== opp) ns[MY_TUZ] = t;
            } else if (!isP && ns[AI_TUZ] === -1) {
              const opp = t;
              if (ns[MY_TUZ] === -1 || (ns[MY_TUZ] - 10) !== opp) ns[AI_TUZ] = t;
            }
          }
        }
      }

      if (rem > 0) pos = (pos + 1) % CL;
    }
    return { state: ns };
  }

  function hasMoves(state, side) {
    const pp = side === "you" ? YR : AR;
    return pp.some(i => state[i] > 0);
  }

  function sweep(state, side) {
    const ns = state.slice();
    const pp = side === "you" ? YR : AR;
    const kz = side === "you" ? 9 : 19;
    for (const i of pp) { ns[kz] += ns[i]; ns[i] = 0; }
    return ns;
  }

  function endGame() {
    if (!hasMoves(pits, "you")) pits = sweep(pits, "ai");
    else if (!hasMoves(pits, "ai")) pits = sweep(pits, "you");
    if (pits[9] > pits[19]) winner = "you";
    else if (pits[19] > pits[9]) winner = "ai";
    else winner = "draw";
    draw();
  }

  // --- Heuristic evaluation (positive = good for AI) ---
  function evalState(state) {
    const kd = state[19] - state[9];
    let youP = 0, aiP = 0;
    for (let i = 0; i < 9; i++) { youP += state[i]; aiP += state[10 + i]; }
    const bd = aiP - youP;
    let tb = 0;
    if (state[MY_TUZ] >= 0) tb -= 12;
    if (state[AI_TUZ] >= 0) { tb += 12; tb += state[state[AI_TUZ]] * 0.5; }
    return kd * 100 + bd + tb;
  }

  function minimax(state, depth, side, alpha, beta) {
    if (!hasMoves(state, side) || !hasMoves(state, side === "you" ? "ai" : "you")) {
      const s = !hasMoves(state, "you") ? sweep(state, "ai") : sweep(state, "you");
      return s[19] - s[9];
    }
    if (depth === 0) return evalState(state);
    const pp = side === "you" ? YR : AR;
    const moves = pp.filter(i => state[i] > 0);
    if (side === "ai") {
      let best = -Infinity;
      for (const m of moves) {
        const r = sow(state, m, "ai");
        const v = minimax(r.state, depth - 1, "you", alpha, beta);
        if (v > best) best = v;
        alpha = Math.max(alpha, v);
        if (beta <= alpha) break;
      }
      return best;
    } else {
      let best = Infinity;
      for (const m of moves) {
        const r = sow(state, m, "you");
        const v = minimax(r.state, depth - 1, "ai", alpha, beta);
        if (v < best) best = v;
        beta = Math.min(beta, v);
        if (beta <= alpha) break;
      }
      return best;
    }
  }

  function aiPick() {
    const mv = AR.filter(i => pits[i] > 0);
    if (!mv.length) return -1;
    let best = mv[0], bv = -Infinity;
    for (const m of mv) {
      const r = sow(pits, m, "ai");
      const v = minimax(r.state, 2, "you", -Infinity, Infinity);
      if (v > bv) { bv = v; best = m; }
    }
    return best;
  }

  function aiMove() {
    if (winner) return;
    const m = aiPick();
    if (m < 0 || !hasMoves(pits, "ai")) { endGame(); return; }
    pits = sow(pits, m, "ai").state;
    if (!hasMoves(pits, "you")) { endGame(); return; }
    turn = "you"; draw();
  }

  // --- Drawing ---
  function storeRects() {
    const m = 12, sw = 22, gap = 8, pw = (W - 2*m - 2*sw - 2*gap) / 9;
    const topY = 40, botY = 40 + 70 + 20, ph = 70;
    return { aiStore: { x: m, y: topY, w: sw, h: ph }, plStore: { x: W - m - sw, y: botY, w: sw, h: ph }, pitW: pw, topY, botY, ph, sw, m, gap };
  }

  function pitRect(idx) {
    const s = storeRects();
    if (idx === 9) return { x: W - s.m - s.sw, y: s.botY, w: s.sw, h: s.ph };
    if (idx === 19) return { x: s.m, y: s.topY, w: s.sw, h: s.ph };
    if (idx <= 8) {
      const x = s.m + s.sw + s.gap + idx * (s.pitW + 2);
      return { x, y: s.botY, w: s.pitW, h: s.ph };
    }
    const aiIdx = idx - 10;
    const x = s.m + s.sw + s.gap + aiIdx * (s.pitW + 2);
    return { x, y: s.topY, w: s.pitW, h: s.ph };
  }

  function draw() {
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "13px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";
    ctx.fillText(`Toguz Kumalak — you ${pits[9]}  ai ${pits[19]}`, W / 2, 22);

    for (let i = 0; i < 20; i++) {
      if ((i >= 0 && i <= 8) || (i >= 10 && i <= 18) || i === 9 || i === 19) {
        const r = pitRect(i);
        const isStore = (i === 9 || i === 19);
        const isPlayer = (i <= 8 || i === 9);
        ctx.fillStyle = isStore ? (isPlayer ? "#bcd9f0" : "#f4cfb4") : "#fff";
        ctx.fillRect(r.x, r.y, r.w, r.h);
        ctx.strokeStyle = "#888"; ctx.strokeRect(r.x, r.y, r.w, r.h);
        if (i === pits[MY_TUZ] || i === pits[AI_TUZ]) {
          ctx.fillStyle = "#e74c3c"; ctx.font = "12px sans-serif";
          ctx.fillText("T", r.x + r.w / 2, r.y - 4);
        }
        ctx.fillStyle = "#222"; ctx.font = isStore ? "16px sans-serif" : "13px sans-serif";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(String(pits[i]), r.x + r.w / 2, r.y + r.h / 2);
        ctx.textBaseline = "alphabetic";
      }
    }

    if (winner) statusEl.textContent = winner === "you" ? "you win!" : winner === "ai" ? "AI wins" : "draw";
    else statusEl.textContent = turn === "you" ? "click one of your pits (bottom row)" : "AI thinking…";
  }

  function pos(e) {
    const r = canvas.getBoundingClientRect();
    return { x: (e.clientX - r.left) * (W / r.width), y: (e.clientY - r.top) * (H / r.height) };
  }

  function findPit(x, y) {
    for (let i = 0; i <= 8; i++) {
      const r = pitRect(i);
      if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) return i;
    }
    return -1;
  }

  function onClick(e) {
    if (winner || turn !== "you") return;
    const { x, y } = pos(e);
    const i = findPit(x, y);
    if (i < 0 || pits[i] === 0) return;
    pits = sow(pits, i, "you").state;
    if (!hasMoves(pits, "ai")) { endGame(); return; }
    if (!hasMoves(pits, "you")) { endGame(); return; }
    turn = "ai"; draw(); setTimeout(aiMove, 500);
  }

  canvas.addEventListener("click", onClick);
  draw();

  return {
    solve() {
      if (winner || turn !== "you") return;
      const mvs = YR.filter(i => pits[i] > 0);
      if (!mvs.length) { endGame(); return; }
      pits = sow(pits, mvs[Math.floor(Math.random() * mvs.length)], "you").state;
      if (!hasMoves(pits, "ai")) { endGame(); return; }
      if (!hasMoves(pits, "you")) { endGame(); return; }
      turn = "ai"; draw();
      setTimeout(aiMove, 80);
    },
    destroy() { canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart() { newGame(); draw(); }
  };
}
