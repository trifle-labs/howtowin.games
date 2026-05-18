// ZERTZ — simplified capture game on hex board (side 3, 19 cells).
// Players (you=black, AI=white) place marbles and jump-capture opponent pieces.
// Captures are mandatory (when available) and chain. First to capture 3 wins.
// AI: greedy capture, else central placement.

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = size + 40;
  const W = canvas.width, H = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) { canvas.style.width = W + 'px'; canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr); }
  const statusEl = document.getElementById("playable-status");

  const S = 3; // side length => 19 cells
  const CELLS = [];
  for (let q = -(S - 1); q <= S - 1; q++) {
    for (let r = -(S - 1); r <= S - 1; r++) {
      if (Math.abs(q + r) <= S - 1) CELLS.push([q, r]);
    }
  }
  const idx = (q, r) => CELLS.findIndex(c => c[0] === q && c[1] === r);
  const NEI = CELLS.map(([q, r]) => {
    const out = [];
    for (const [dq, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, -1], [-1, 1]]) {
      const i = idx(q + dq, r + dr);
      if (i >= 0) out.push(i);
    }
    return out;
  });

  let board, turn, winner, youScore, aiScore;
  // phase: "place" | "cs" (capture-select) | "ct" (capture-target) | "ai" | "done"
  let phase, selPiece, selTargets;

  function newGame() {
    board = new Array(CELLS.length).fill('.');
    turn = "you";
    winner = null;
    youScore = 0;
    aiScore = 0;
    phase = "place";
    selPiece = null;
    selTargets = [];
  }
  newGame();

  // --- Mechanics ---

  function getJumpsFrom(pos) {
    const who = board[pos];
    if (who === '.') return [];
    const jumps = [];
    for (const n of NEI[pos]) {
      if (board[n] === '.' || board[n] === who) continue;
      const [qi, ri] = CELLS[pos];
      const [qn, rn] = CELLS[n];
      const t = idx(qn + (qn - qi), rn + (rn - ri));
      if (t >= 0 && board[t] === '.') {
        jumps.push({ from: pos, over: n, to: t });
      }
    }
    return jumps;
  }

  function getAllJumps(who) {
    const jumps = [];
    for (let i = 0; i < board.length; i++) {
      if (board[i] !== who) continue;
      jumps.push(...getJumpsFrom(i));
    }
    return jumps;
  }

  function doJump(j) {
    board[j.to] = board[j.from];
    board[j.from] = '.';
    board[j.over] = '.';
    return j.to; // new position of the jumping piece
  }

  function checkWin() {
    if (youScore >= 3) { winner = "you"; return true; }
    if (aiScore >= 3) { winner = "ai"; return true; }
    return false;
  }

  // --- Turn management ---

  function startTurn() {
    if (checkWin()) { phase = "done"; draw(); return; }
    if (turn === "you") {
      const jumps = getAllJumps('B');
      if (jumps.length > 0) {
        phase = "cs";
        selPiece = null;
        selTargets = [];
        statusEl.textContent = "You must capture! Click a black piece to jump with";
      } else {
        if (!board.some(c => c === '.')) { winner = "draw"; phase = "done"; draw(); return; }
        phase = "place";
        statusEl.textContent = "Place a black marble on an empty cell";
      }
    } else {
      phase = "ai";
      statusEl.textContent = "AI thinking...";
      setTimeout(doAIMove, 350);
    }
    draw();
  }

  function doAIMove() {
    if (winner || phase !== "ai") return;

    // Check for captures first
    const jumps = getAllJumps('W');
    if (jumps.length > 0) {
      let pos = doJump(jumps[0]);
      aiScore++;
      // Chain
      while (true) {
        const chain = getJumpsFrom(pos);
        if (chain.length === 0) break;
        pos = doJump(chain[0]);
        aiScore++;
      }
      if (checkWin()) { draw(); return; }
      turn = "you";
      startTurn();
      return;
    }

    // No captures — place a marble
    const empty = [];
    for (let i = 0; i < board.length; i++) if (board[i] === '.') empty.push(i);
    if (!empty.length) { winner = "draw"; phase = "done"; draw(); return; }

    let best = empty[0], bestScore = -Infinity;
    for (const i of empty) {
      const [q, r] = CELLS[i];
      let sc = -(Math.abs(q) + Math.abs(r)); // prefer center
      for (const n of NEI[i]) if (board[n] === 'B') sc += 2; // near opponent
      if (sc > bestScore) { bestScore = sc; best = i; }
    }
    board[best] = 'W';
    turn = "you";
    startTurn();
  }

  // --- Drawing ---

  function hexCenter(q, r) {
    const s = Math.min(W, size) / 14;
    const cx = W / 2;
    const cy = 40 + (size - 40) / 2;
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

    const capPieces = new Set();
    const capTargets = new Set();

    if (phase === "cs") {
      for (const j of getAllJumps('B')) capPieces.add(j.from);
    }
    if (phase === "ct" && selTargets) {
      for (const j of selTargets) capTargets.add(j.to);
    }

    for (let i = 0; i < CELLS.length; i++) {
      const [q, r] = CELLS[i];
      const c = hexCenter(q, r);
      const s = c.s;

      drawHex(c.x, c.y, s);
      if (capPieces.has(i)) ctx.fillStyle = "#e2ecd9";
      else if (capTargets.has(i)) ctx.fillStyle = "#ecdcb8";
      else ctx.fillStyle = "#fff";
      ctx.fill();

      ctx.strokeStyle = selPiece === i ? "#090" : "#999";
      ctx.lineWidth = selPiece === i ? 2.5 : 1;
      ctx.stroke();
      ctx.lineWidth = 1;

      // Marble
      if (board[i] === 'B') {
        ctx.beginPath();
        ctx.arc(c.x, c.y, s * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = "#39c";
        ctx.fill();
        ctx.strokeStyle = "#277";
        ctx.stroke();
      } else if (board[i] === 'W') {
        ctx.beginPath();
        ctx.arc(c.x, c.y, s * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = "#c96";
        ctx.fill();
        ctx.strokeStyle = "#844";
        ctx.stroke();
      }
    }

    // Scores
    ctx.fillStyle = "#39c";
    ctx.font = "bold 12px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("You: " + youScore, 8, 18);
    ctx.fillStyle = "#c96";
    ctx.textAlign = "right";
    ctx.fillText("AI: " + aiScore, W - 8, 18);

    if (winner) {
      statusEl.textContent = winner === "you"
        ? "You captured 3! You win!"
        : winner === "ai"
          ? "AI captured 3. AI wins."
          : "Draw — board full";
    }
  }

  // --- Interaction ---

  function pos(e) {
    const r = canvas.getBoundingClientRect();
    return { x: (e.clientX - r.left) * (W / r.width), y: (e.clientY - r.top) * (H / r.height) };
  }

  function onClick(e) {
    if (winner || phase === "done" || turn !== "you") return;
    const { x, y } = pos(e);

    let clicked = -1;
    for (let i = 0; i < CELLS.length; i++) {
      const [q, r] = CELLS[i];
      const c = hexCenter(q, r);
      if (Math.hypot(x - c.x, y - c.y) < c.s) { clicked = i; break; }
    }
    if (clicked < 0) return;

    // --- Place a marble ---
    if (phase === "place") {
      if (board[clicked] !== '.') return;
      board[clicked] = 'B';
      if (!board.some(c => c === '.')) { winner = "draw"; phase = "done"; draw(); return; }
      turn = "ai";
      startTurn();
      return;
    }

    // --- Capture-select: pick your piece to jump ---
    if (phase === "cs") {
      if (board[clicked] !== 'B') return;
      const jumps = getJumpsFrom(clicked);
      if (jumps.length === 0) return;
      selPiece = clicked;
      selTargets = jumps;
      phase = "ct";
      draw();
      return;
    }

    // --- Capture-target: click where to jump ---
    if (phase === "ct") {
      // Deselect
      if (clicked === selPiece) { selPiece = null; selTargets = []; phase = "cs"; draw(); return; }
      const j = selTargets.find(t => t.to === clicked);
      if (!j) return;

      const newPos = doJump(j);
      youScore++;
      if (checkWin()) { phase = "done"; draw(); return; }

      // Chain capture?
      const chain = getJumpsFrom(newPos);
      if (chain.length > 0) {
        selPiece = newPos;
        selTargets = chain;
        phase = "ct";
        draw();
        return;
      }

      // Chain complete
      selPiece = null;
      selTargets = [];
      if (!board.some(c => c === '.')) { winner = "draw"; phase = "done"; draw(); return; }
      turn = "ai";
      startTurn();
    }
  }

  // --- Lifecycle ---

  canvas.addEventListener("click", onClick);
  newGame();
  startTurn();

  return {
    solve() {
      if (winner || turn !== "you") return;
      // Make a random valid move on the player's behalf
      const jumps = getAllJumps('B');
      if (jumps.length > 0) {
        let pos = doJump(jumps[0]);
        youScore++;
        if (checkWin()) { phase = "done"; draw(); return; }
        while (true) {
          const chain = getJumpsFrom(pos);
          if (chain.length === 0) break;
          pos = doJump(chain[0]);
          youScore++;
          if (checkWin()) { phase = "done"; draw(); return; }
        }
        selPiece = null; selTargets = [];
        if (!board.some(c => c === '.')) { winner = "draw"; phase = "done"; draw(); return; }
        turn = "ai"; startTurn(); return;
      }
      const empty = [];
      for (let i = 0; i < board.length; i++) if (board[i] === '.') empty.push(i);
      if (!empty.length) { winner = "draw"; phase = "done"; draw(); return; }
      board[empty[Math.floor(Math.random() * empty.length)]] = 'B';
      if (!board.some(c => c === '.')) { winner = "draw"; phase = "done"; draw(); return; }
      turn = "ai";
      startTurn();
    },
    destroy() { canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart() { newGame(); startTurn(); },
  };
}
