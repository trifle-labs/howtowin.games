// Bao la Kujifunza — 4x8 simplified mancala learning game.
// Each player controls two rows (back + front). Sowing is counter-clockwise
// within the player's 16-pit loop. Relay sowing triggers when the last seed
// lands in a non-empty pit. Capture: when the relay ends in a front-row pit
// whose opposite enemy front pit is non-empty, both pits' seeds are captured
// and sown into the capturer's back row. A player who cannot move loses.
//
// Index layout (4 rows of 8 pits, shown top-to-bottom):
//   Row 0 (AI back):   indices 24-31, left to right
//   Row 1 (AI front):  indices 23-16, left to right
//   Row 2 (pl front):  indices 15-8,  left to right
//   Row 3 (pl back):   indices 0-7,   left to right
// CCW order for player: 0→1→…→15→0
// CCW order for AI:     16→17→…→31→16

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);

  // ---- layout constants ----
  const MARGIN = 12;
  const PIT_GAP = 2;
  const PIT_SIZE = Math.max(20, Math.floor((size - 2 * MARGIN - 7 * PIT_GAP) / 8));
  const ROW_GAP = 14;
  const TOP_PAD = 24;
  const BOTTOM_PAD = 6;
  const H = TOP_PAD + 4 * (PIT_SIZE + ROW_GAP) + BOTTOM_PAD;

  canvas.width = size;
  canvas.height = H;
  const W = canvas.width, H_ = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) { canvas.style.width = W + 'px'; canvas.width = W * dpr; canvas.height = H_ * dpr; ctx.scale(dpr, dpr); }
  const statusEl = document.getElementById("playable-status");

  // ---- row labels (labels above each row) ----
  const ROW_LABELS = ["AI back", "AI front", "Your front", "Your back"];

  // ---- state ----
  let pits, turn, winner;

  function newGame() {
    pits = new Array(32).fill(2);
    turn = "player";
    winner = null;
  }
  newGame();

  // ---- index helpers ----
  function isPlayerIdx(idx) { return idx < 16; }
  function isFrontRow(idx) { return (idx >= 8 && idx < 16) || (idx >= 16 && idx < 24); }

  function nextIdx(idx) {
    if (idx < 16) return (idx + 1) % 16;
    return ((idx - 15) % 16) + 16; // wraps 31→16
  }

  function oppositeIdx(idx) {
    // Only meaningful for front-row pits
    if (idx >= 8 && idx < 16) return idx + 8;  // player front → AI front
    if (idx >= 16 && idx < 24) return idx - 8; // AI front → player front
    return -1;
  }

  // ---- visual helpers ----
  function idxToRowCol(idx) {
    if (idx < 8)   return { row: 3, col: idx };
    if (idx < 16)  return { row: 2, col: 15 - idx };
    if (idx < 24)  return { row: 1, col: 23 - idx };
    return { row: 0, col: idx - 24 };
  }

  function rowY(r)   { return TOP_PAD + ROW_GAP + r * (PIT_SIZE + ROW_GAP); }
  function colX(c)   { return MARGIN + c * (PIT_SIZE + PIT_GAP); }
  function labelY(r) { return TOP_PAD + r * (PIT_SIZE + ROW_GAP) + ROW_GAP / 2; }

  function pitRect(idx) {
    const { row, col } = idxToRowCol(idx);
    return { x: colX(col), y: rowY(row), w: PIT_SIZE, h: PIT_SIZE };
  }

  // ---- game logic ----
  function legalMovesByTurn(state, isPlayer) {
    const start = isPlayer ? 0 : 16;
    const end   = isPlayer ? 15 : 31;
    const out = [];
    for (let i = start; i <= end; i++) if (state[i] > 0) out.push(i);
    return out;
  }

  function countSeeds(state, start, end) {
    let s = 0;
    for (let i = start; i <= end; i++) s += state[i];
    return s;
  }

  function hasNoMoves(state, isPlayer) {
    return legalMovesByTurn(state, isPlayer).length === 0;
  }

  /**
   * Simulate a complete move (with relays and capture) from the given pit.
   * Returns the new board state.
   */
  function simulateMove(state, idx) {
    const ns = state.slice();
    const pl = isPlayerIdx(idx);
    let seeds = ns[idx];
    ns[idx] = 0;
    let src = idx;
    let i = idx;

    while (seeds > 0) {
      i = nextIdx(i);
      if (i === src) i = nextIdx(i); // skip the just-emptied pit
      ns[i]++;
      seeds--;
      if (seeds === 0 && ns[i] > 1) {
        // relay — pick up all seeds from this pit and continue
        seeds = ns[i];
        ns[i] = 0;
        src = i;
      }
    }

    // ---- capture check ----
    // Capture triggers when the relay ends in a front-row pit whose opposite
    // enemy front pit is non-empty.  Both the landing pit and the enemy pit
    // are emptied and their combined seeds are sown into the capturer's back
    // row (left to right, no further relay).
    if (isFrontRow(i)) {
      const opp = oppositeIdx(i);
      if (opp >= 0 && ns[opp] > 0) {
        const landing = ns[i];
        const enemy   = ns[opp];
        ns[i] = 0;
        ns[opp] = 0;
        const total = landing + enemy;
        const backStart = pl ? 0 : 24;
        const backEnd   = pl ? 7 : 31;
        let j = backStart;
        let rem = total;
        while (rem > 0) {
          ns[j]++;
          rem--;
          if (j === backEnd) j = backStart;
          else j++;
        }
      }
    }

    return ns;
  }

  // ---- AI ----
  function evaluate(state) {
    // Simple heuristic: AI wants more seeds than player, back-row seeds are
    // safer, player front-row seeds are threatening.
    const plTotal = countSeeds(state, 0, 15);
    const aiTotal = countSeeds(state, 16, 31);
    const plBack  = countSeeds(state, 0, 7);
    const aiBack  = countSeeds(state, 24, 31);
    const plFront = countSeeds(state, 8, 15);
    const aiFront = countSeeds(state, 16, 23);

    return (aiTotal - plTotal)
         + 0.4 * (aiBack - plBack)
         - 0.3 * plFront
         + 0.2 * aiFront;
  }

  function aiPick(state) {
    const moves = legalMovesByTurn(state, false);
    if (moves.length === 0) return -1;
    let best = moves[0];
    let bestScore = -Infinity;
    for (const m of moves) {
      const ns = simulateMove(state, m);
      const sc = evaluate(ns);
      if (sc > bestScore) { bestScore = sc; best = m; }
    }
    return best;
  }

  function aiTurn() {
    if (winner) return;
    const m = aiPick(pits);
    if (m < 0) { winner = "player"; draw(); return; }
    pits = simulateMove(pits, m);
    turn = "player";
    if (hasNoMoves(pits, true)) { winner = "ai"; draw(); return; }
    draw();
  }

  // ---- drawing ----
  const ROW_COLORS = [
    { fill: "#f5e6d3", stroke: "#c78a5c" }, // row 0 — AI back
    { fill: "#ebd5b8", stroke: "#c78a5c" }, // row 1 — AI front
    { fill: "#d4ecf0", stroke: "#5d8aa8" }, // row 2 — player front
    { fill: "#e8f4f8", stroke: "#5d8aa8" }, // row 3 — player back
  ];

  function draw() {
    ctx.clearRect(0, 0, W, H_);
    ctx.fillStyle = "#fafaf7";
    ctx.fillRect(0, 0, W, H_);

    // title
    ctx.font = "bold 14px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#333";
    ctx.fillText("Bao la Kujifunza", W / 2, TOP_PAD / 2);

    // row labels
    ctx.font = "10px sans-serif";
    ctx.fillStyle = "#888";
    for (let r = 0; r < 4; r++) {
      ctx.fillText(ROW_LABELS[r], W / 2, labelY(r));
    }

    // pits
    ctx.textBaseline = "middle";
    for (let i = 0; i < 32; i++) {
      const { row } = idxToRowCol(i);
      const r = pitRect(i);
      const colors = ROW_COLORS[row];

      // fill
      if (pits[i] === 0) {
        ctx.fillStyle = "#f0ede8";
      } else {
        ctx.fillStyle = colors.fill;
      }
      ctx.fillRect(r.x, r.y, r.w, r.h);

      // stroke
      ctx.strokeStyle = colors.stroke;
      ctx.lineWidth = 1;
      ctx.strokeRect(r.x, r.y, r.w, r.h);

      // seed count
      if (pits[i] > 0) {
        ctx.fillStyle = "#222";
        ctx.font = "13px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(pits[i] > 99 ? "99+" : String(pits[i]), r.x + r.w / 2, r.y + r.h / 2);
      }
    }

    // status
    if (winner) {
      if (winner === "player") statusEl.textContent = "You win!";
      else if (winner === "ai") statusEl.textContent = "AI wins";
      else statusEl.textContent = "Draw";
    } else {
      statusEl.textContent = turn === "player"
        ? "Your turn — click a pit in your rows"
        : "AI thinking…";
    }
  }

  // ---- interaction ----
  function pos(e) {
    const r = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - r.left) * (W / r.width),
      y: (e.clientY - r.top) * (H_ / r.height),
    };
  }

  function findPlayerPit(x, y) {
    for (let i = 0; i < 16; i++) {
      const r = pitRect(i);
      if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) return i;
    }
    return -1;
  }

  function onClick(e) {
    if (winner || turn !== "player") return;
    const { x, y } = pos(e);
    const i = findPlayerPit(x, y);
    if (i < 0 || pits[i] === 0) return;

    pits = simulateMove(pits, i);
    turn = "ai";
    if (hasNoMoves(pits, false)) { winner = "player"; draw(); return; }
    draw();
    setTimeout(aiTurn, 400);
  }

  // ---- lifecycle ----
  canvas.addEventListener("click", onClick);
  draw();

  return {
    destroy() {
      canvas.removeEventListener("click", onClick);
      ctx.clearRect(0, 0, W, H_);
    },
    restart() { newGame(); draw(); },
    solve() {
      if (winner || turn !== "player") return;
      const moves = legalMovesByTurn(pits, true);
      if (moves.length === 0) { winner = "ai"; draw(); return; }
      // pick the best move for the player (lowest evaluation = worst for AI)
      let best = moves[0];
      let bestScore = Infinity;
      for (const m of moves) {
        const ns = simulateMove(pits, m);
        const sc = evaluate(ns);
        if (sc < bestScore) { bestScore = sc; best = m; }
      }
      pits = simulateMove(pits, best);
      turn = "ai";
      if (hasNoMoves(pits, false)) { winner = "player"; draw(); return; }
      draw();
      setTimeout(aiTurn, 80);
    },
  };
}
