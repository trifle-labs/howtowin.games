// YINSH — simplified: hex board side 4 (37 cells), 3 rings per player.
// Place markers, slide rings in straight lines, flip markers passed over.
// 5-in-a-row removes markers; matching player removes one ring.
// First to remove 2 rings (of 3) wins.
// AI: random legal moves with simple heuristics.

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = size + 50;
  const W = canvas.width, H = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) { canvas.style.width = W + 'px'; canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr); }
  const statusEl = document.getElementById("playable-status");

  const S = 4; // side => 37 cells
  const CELLS = [];
  for (let q = -(S - 1); q <= S - 1; q++) {
    for (let r = -(S - 1); r <= S - 1; r++) {
      if (Math.abs(q + r) <= S - 1) CELLS.push([q, r]);
    }
  }
  const idx = (q, r) => CELLS.findIndex(c => c[0] === q && c[1] === r);
  const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, -1], [-1, 1]];

  const RINGS = 3;
  let board, youRings, aiRings;
  let turn, winner;
  // phase: "setup-you" | "setup-ai" | "select-ring" | "select-target" | "remove-ring" | "ai" | "done"
  let phase, selRingIdx, validTargets, pendingWasAI;

  function newGame() {
    board = new Array(CELLS.length).fill('.');
    youRings = [-1, -1, -1];
    aiRings = [-1, -1, -1];
    turn = "you";
    winner = null;
    phase = "setup-you";
    selRingIdx = -1;
    validTargets = [];
    pendingWasAI = null;
  }
  newGame();

  // --- Mechanics ---

  function isRing(i) { return youRings.includes(i) || aiRings.includes(i); }

  function emptyCells() {
    const out = [];
    for (let i = 0; i < board.length; i++) if (board[i] === '.' && !isRing(i)) out.push(i);
    return out;
  }

  // Valid slide targets for a ring at ringPos.
  // Ring slides in a straight line (one of 6 hex directions).
  // - Can pass through empty cells (free slide)
  // - Can pass through markers (they flip)
  // - Cannot pass through rings
  // - If markers are encountered, must land on FIRST empty cell beyond them
  // - If no markers, can land on any empty cell in the line
  function getValidMoves(ringPos) {
    const moves = [];
    for (const [dq, dr] of DIRS) {
      let cf = CELLS[ringPos][0] + dq, cr = CELLS[ringPos][1] + dr;
      let seenMarker = false;
      while (true) {
        const i = idx(cf, cr);
        if (i < 0) break;
        if (isRing(i)) break;
        if (board[i] !== '.') { seenMarker = true; cf += dq; cr += dr; continue; }
        moves.push(i);
        if (seenMarker) break; // must land on first empty after marker
        cf += dq; cr += dr;
      }
    }
    return moves;
  }

  // Place marker at 'from', flip markers between from and to, move ring.
  function applyRingMove(from, to, ringIdx, isAI) {
    board[from] = isAI ? 'W' : 'B';
    const [qf, rf] = CELLS[from];
    const [qt, rt] = CELLS[to];
    const dq = Math.sign(qt - qf), dr = Math.sign(rt - rf);
    let cf = qf + dq, cr = rf + dr;
    while (cf !== qt || cr !== rt) {
      const i = idx(cf, cr);
      if (i >= 0 && board[i] !== '.') board[i] = board[i] === 'B' ? 'W' : 'B';
      cf += dq; cr += dr;
    }
    if (isAI) aiRings[ringIdx] = to;
    else youRings[ringIdx] = to;
  }

  // Find and remove all 5+ in a row. Returns set of colors found.
  function findAndRemoveRows() {
    const axes = [[1, 0], [0, 1], [1, -1]];
    const toRemove = new Set();
    const found = new Set();

    for (let i = 0; i < board.length; i++) {
      if (board[i] === '.') continue;
      const col = board[i];
      const [q, r] = CELLS[i];
      for (const [dq, dr] of axes) {
        let count = 1;
        let fq = q + dq, fr = r + dr;
        while (idx(fq, fr) >= 0 && board[idx(fq, fr)] === col) { count++; fq += dq; fr += dr; }
        let bq = q - dq, br = r - dr;
        while (idx(bq, br) >= 0 && board[idx(bq, br)] === col) { count++; bq -= dq; br -= dr; }
        if (count >= 5) {
          found.add(col);
          let sq = bq + dq, sr = br + dr;
          for (let k = 0; k < count; k++) {
            const ci = idx(sq, sr); if (ci >= 0) toRemove.add(ci);
            sq += dq; sr += dr;
          }
        }
      }
    }
    for (const i of toRemove) board[i] = '.';
    return found;
  }

  function youRingCount() { return youRings.filter(r => r >= 0).length; }
  function aiRingCount() { return aiRings.filter(r => r >= 0).length; }

  function checkWinCondition() {
    const yr = RINGS - youRingCount();
    const ar = RINGS - aiRingCount();
    if (yr >= 2 && ar >= 2) { winner = "draw"; phase = "done"; return true; }
    if (yr >= 2) { winner = "you"; phase = "done"; return true; }
    if (ar >= 2) { winner = "ai"; phase = "done"; return true; }
    return false;
  }

  function aiRemoveRing() {
    const valid = [];
    for (let i = 0; i < RINGS; i++) if (aiRings[i] >= 0) valid.push(i);
    if (!valid.length) return;
    // Remove ring with fewest moves (most trapped)
    let best = valid[0], bm = getValidMoves(aiRings[best]).length;
    for (const ri of valid) {
      const m = getValidMoves(aiRings[ri]).length;
      if (m < bm) { bm = m; best = ri; }
    }
    aiRings[best] = -1;
  }

  // --- After-move processing ---

  function afterMove(wasAI) {
    pendingWasAI = wasAI;
    const colors = findAndRemoveRows();

    // Handle white rows (AI removes ring)
    if (colors.has('W')) {
      aiRemoveRing();
      if (checkWinCondition()) { draw(); return; }
    }

    // Handle black rows (player removes ring)
    if (colors.has('B')) {
      phase = "remove-ring";
      statusEl.textContent = "5 black in a row! Click one of your rings to remove it";
      selRingIdx = -1;
      draw();
      return;
    }

    // No ring removal needed — pass turn
    if (wasAI) { turn = "you"; }
    else { turn = "ai"; }
    startPlay();
  }

  function finishPlayerRingRemoval(clicked) {
    const ri = youRings.indexOf(clicked);
    if (ri < 0) return;
    youRings[ri] = -1;
    if (checkWinCondition()) { draw(); return; }
    if (pendingWasAI) { turn = "you"; }
    else { turn = "ai"; }
    startPlay();
  }

  // --- Turn management ---

  function startSetup() {
    if (turn === "you") {
      phase = "setup-you";
      statusEl.textContent = "Place ring " + (youRings.filter(r => r >= 0).length + 1) + "/3 on an empty cell";
    } else {
      phase = "setup-ai";
      statusEl.textContent = "AI placing rings...";
      setTimeout(doAISetup, 300);
    }
    draw();
  }

  function doAISetup() {
    if (winner || phase !== "setup-ai") return;
    const empty = emptyCells();
    if (!empty.length) return;
    // AI places ring at a random empty cell
    const cell = empty[Math.floor(Math.random() * empty.length)];
    const slot = aiRings.indexOf(-1);
    if (slot >= 0) aiRings[slot] = cell;

    if (youRings.every(r => r >= 0) && aiRings.every(r => r >= 0)) {
      turn = "you";
      phase = "select-ring";
      statusEl.textContent = "All rings placed! Click a ring (cyan) to select it";
      draw();
      return;
    }
    turn = "you";
    startSetup();
  }

  function startPlay() {
    if (checkWinCondition()) { draw(); return; }
    if (turn === "you") {
      if (!youRings.some(r => r >= 0 && getValidMoves(r).length > 0)) {
        winner = "ai";
        phase = "done";
        draw();
        return;
      }
      phase = "select-ring";
      selRingIdx = -1;
      validTargets = [];
      statusEl.textContent = "Click a cyan ring to select it";
    } else {
      phase = "ai";
      statusEl.textContent = "AI thinking...";
      setTimeout(doAIMove, 350);
    }
    draw();
  }

  function doAIMove() {
    if (winner || phase !== "ai") return;

    const candidates = [];
    for (let i = 0; i < RINGS; i++) {
      if (aiRings[i] < 0) continue;
      const moves = getValidMoves(aiRings[i]);
      if (moves.length > 0) candidates.push({ ringIdx: i, moves });
    }
    if (!candidates.length) {
      // AI has no moves; try to pass or lose
      if (youRings.some(r => r >= 0 && getValidMoves(r).length > 0)) {
        winner = "you";
      } else {
        winner = "draw";
      }
      phase = "done";
      draw();
      return;
    }

    // Simple heuristic: prefer moves that flip many markers
    let bestPick = candidates[0], bestScore = -Infinity;
    for (const c of candidates) {
      for (const t of c.moves) {
        let score = 0;
        const [qf, rf] = CELLS[aiRings[c.ringIdx]];
        const [qt, rt] = CELLS[t];
        const dq = Math.sign(qt - qf), dr = Math.sign(rt - rf);
        let cf = qf + dq, cr = rf + dr;
        while (cf !== qt || cr !== rt) {
          const i = idx(cf, cr);
          if (i >= 0 && board[i] === 'B') score += 3; // flip opponent markers
          cf += dq; cr += dr;
        }
        // Prefer central landing
        const [lq, lr] = CELLS[t];
        score -= Math.abs(lq) * 0.5 + Math.abs(lr) * 0.5;
        if (score > bestScore) { bestScore = score; bestPick = { ringIdx: c.ringIdx, target: t }; }
      }
    }

    const ringIdx = bestPick.ringIdx;
    const target = bestPick.target;
    applyRingMove(aiRings[ringIdx], target, ringIdx, true);
    afterMove(true);
  }

  // --- Drawing ---

  function hexCenter(q, r) {
    const s = Math.min(W, size) / 16;
    const cx = W / 2;
    const cy = 50 + (size - 50) / 2;
    const x = cx + (s * 1.5) * q;
    const y = cy + s * Math.sqrt(3) * (r + q / 2);
    return { x, y, s };
  }

  function drawHex(cx, cy, s) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = Math.PI / 3 * i;
      const px = cx + s * Math.cos(a), py = cy + s * Math.sin(a);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
  }

  function draw() {
    ctx.fillStyle = "#fafaf7";
    ctx.fillRect(0, 0, W, H);

    // Compute valid ring moves highlight set
    const targetSet = new Set(validTargets);
    const hasValidTargets = phase === "select-target" && validTargets.length > 0;

    for (let i = 0; i < CELLS.length; i++) {
      const [q, r] = CELLS[i];
      const c = hexCenter(q, r);
      const s = c.s;

      // Hex cell
      drawHex(c.x, c.y, s);
      const isTarget = targetSet.has(i);
      ctx.fillStyle = isTarget ? "#e4f0db" : "#fff";
      ctx.fill();
      ctx.strokeStyle = "#bbb";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Rings (open circles) vs markers (filled circles)
      const youRI = youRings.indexOf(i);
      const aiRI = aiRings.indexOf(i);
      const hasRing = youRI >= 0 || aiRI >= 0;

      if (hasRing) {
        // Ring — thick stroke circle with white center
        ctx.beginPath();
        ctx.arc(c.x, c.y, s * 0.55, 0, Math.PI * 2);
        ctx.strokeStyle = youRI >= 0 ? "#39c" : "#c96";
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.lineWidth = 1;

        // Selected ring indicator
        if (selRingIdx === youRI || (phase === "remove-ring" && youRI >= 0)) {
          ctx.beginPath();
          ctx.arc(c.x, c.y, s * 0.62, 0, Math.PI * 2);
          ctx.strokeStyle = phase === "remove-ring" ? "#c33" : "#090";
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.lineWidth = 1;
        }

        // Ring inner highlight
        ctx.beginPath();
        ctx.arc(c.x, c.y, s * 0.45, 0, Math.PI * 2);
        ctx.fillStyle = youRI >= 0 ? "#d8ecfa" : "#fae0d0";
        ctx.fill();
      } else if (board[i] !== '.') {
        // Marker — solid filled circle
        ctx.beginPath();
        ctx.arc(c.x, c.y, s * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = board[i] === 'B' ? "#39c" : "#c96";
        ctx.fill();
        ctx.strokeStyle = board[i] === 'B' ? "#277" : "#844";
        ctx.stroke();
      }
    }

    // Ring count indicators
    ctx.font = "bold 12px sans-serif";
    ctx.fillStyle = "#39c";
    ctx.textAlign = "left";
    ctx.fillText("You: " + youRingCount() + " rings", 8, 18);
    ctx.fillStyle = "#c96";
    ctx.textAlign = "right";
    ctx.fillText("AI: " + aiRingCount() + " rings", W - 8, 18);

    if (winner) {
      statusEl.textContent = winner === "you"
        ? "You removed 2 rings! You win!"
        : winner === "ai"
          ? "AI removed 2 rings. AI wins."
          : "Draw";
    }
  }

  // --- Interaction ---

  function pos(e) {
    const r = canvas.getBoundingClientRect();
    return { x: (e.clientX - r.left) * (W / r.width), y: (e.clientY - r.top) * (H / r.height) };
  }

  function findCell(x, y) {
    for (let i = 0; i < CELLS.length; i++) {
      const [q, r] = CELLS[i];
      const c = hexCenter(q, r);
      if (Math.hypot(x - c.x, y - c.y) < c.s * 0.8) return i;
    }
    return -1;
  }

  function onClick(e) {
    if (winner || phase === "done") return;
    const { x, y } = pos(e);
    const clicked = findCell(x, y);
    if (clicked < 0) return;

    // --- Setup phase: place a ring ---
    if (phase === "setup-you") {
      if (board[clicked] !== '.' || isRing(clicked)) return;
      const slot = youRings.indexOf(-1);
      if (slot < 0) return;
      youRings[slot] = clicked;

      if (youRings.every(r => r >= 0) && aiRings.every(r => r >= 0)) {
        turn = "you";
        phase = "select-ring";
        statusEl.textContent = "All rings placed! Click a cyan ring to select it";
        draw();
        return;
      }
      turn = "ai";
      startSetup();
      return;
    }

    // --- Remove-ring phase: player removes a ring ---
    if (phase === "remove-ring") {
      if (youRings.indexOf(clicked) < 0) return;
      finishPlayerRingRemoval(clicked);
      return;
    }

    if (turn !== "you") return;

    // --- Select-ring phase: click your ring ---
    if (phase === "select-ring") {
      const ri = youRings.indexOf(clicked);
      if (ri < 0) return;
      const moves = getValidMoves(clicked);
      if (moves.length === 0) return;
      selRingIdx = ri;
      validTargets = moves;
      // Place the marker at the ring's position
      board[clicked] = 'B';
      phase = "select-target";
      statusEl.textContent = "Click a highlighted cell to slide the ring";
      draw();
      return;
    }

    // --- Select-target phase: click where to slide ---
    if (phase === "select-target") {
      const ri = youRings.indexOf(clicked);
      // Click the same ring to deselect? But marker already placed...
      // Allow clicking another ring to undo/re-select
      if (ri >= 0 && ri !== selRingIdx) {
        const moves = getValidMoves(clicked);
        if (moves.length > 0) {
          // Undo current selection: remove the marker placed earlier
          board[youRings[selRingIdx]] = '.';
          selRingIdx = ri;
          validTargets = moves;
          board[clicked] = 'B';
          draw();
          return;
        }
      }

      if (!validTargets.includes(clicked)) return;

      // Execute the move: from current ring position to target
      const fromPos = youRings[selRingIdx];
      applyRingMove(fromPos, clicked, selRingIdx, false);
      selRingIdx = -1;
      validTargets = [];
      afterMove(false);
    }
  }

  // --- Lifecycle ---

  canvas.addEventListener("click", onClick);
  newGame();
  startSetup();

  return {
    solve() {
      if (winner || phase === "done") return;

      // Handle setup phase
      if (phase === "setup-you") {
        const empty = emptyCells();
        if (empty.length) {
          const slot = youRings.indexOf(-1);
          if (slot >= 0) youRings[slot] = empty[Math.floor(Math.random() * empty.length)];
          if (youRings.every(r => r >= 0) && aiRings.every(r => r >= 0)) {
            turn = "you";
            phase = "select-ring";
            statusEl.textContent = "All rings placed! Click a cyan ring to select it";
            draw();
            return;
          }
          turn = "ai";
          startSetup();
        }
        return;
      }

      if (phase === "remove-ring") {
        const valid = youRings.filter(r => r >= 0);
        if (valid.length) {
          finishPlayerRingRemoval(valid[Math.floor(Math.random() * valid.length)]);
        }
        return;
      }

      if (turn !== "you") return;

      // Select a ring with valid moves
      if (phase === "select-ring") {
        const validRings = [];
        for (let i = 0; i < RINGS; i++) {
          if (youRings[i] < 0) continue;
          const m = getValidMoves(youRings[i]);
          if (m.length > 0) validRings.push(i);
        }
        if (!validRings.length) {
          winner = "ai";
          phase = "done";
          draw();
          return;
        }
        const pick = validRings[Math.floor(Math.random() * validRings.length)];
        selRingIdx = pick;
        const pos = youRings[pick];
        validTargets = getValidMoves(pos);
        board[pos] = 'B';
        phase = "select-target";
        // fall through
      }

      // Select a target
      if (phase === "select-target") {
        if (!validTargets.length) return;
        const target = validTargets[Math.floor(Math.random() * validTargets.length)];
        const fromPos = youRings[selRingIdx];
        applyRingMove(fromPos, target, selRingIdx, false);
        selRingIdx = -1;
        validTargets = [];
        afterMove(false);
      }
    },
    destroy() { canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart() { newGame(); startSetup(); },
  };
}
