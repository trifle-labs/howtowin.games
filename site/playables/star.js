// *Star — connection scoring game on a hex board (Ea Ea, 1980s).
// Place stones to create connected groups that touch perimeter scoring cells (peries).
// Each group scores max(0, peries_touched − 2). Most points wins.
// Click empty hex to place. Click PASS to skip. Both pass consecutively = game ends.

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 460);
  const S = 5; // board radius → 61 cells
  canvas.width = size;
  canvas.height = Math.ceil(size * 1.35);
  const W = canvas.width, H = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) {
    canvas.style.width = W + "px";
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);
  }
  const statusEl = document.getElementById("playable-status");

  // Label the pass button
  const solveBtn = document.getElementById("playable-solve");
  if (solveBtn) solveBtn.textContent = "⏭ pass";

  // ── Board ────────────────────────────────────────────────────────
  const cells = [];
  for (let q = -S + 1; q <= S - 1; q++)
    for (let r = -S + 1; r <= S - 1; r++)
      if (Math.abs(q + r) <= S - 1) cells.push([q, r]);
  const key = (q, r) => `${q},${r}`;

  // Peries = number of outward-facing sides (adjacent coordinates outside the board)
  function periesAt(q, r) {
    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, -1], [-1, 1]];
    let n = 0;
    for (const [dq, dr] of dirs) {
      const a = q + dq, b = r + dr;
      if (Math.abs(a) > S - 1 || Math.abs(b) > S - 1 || Math.abs(a + b) > S - 1) n++;
    }
    return n;
  }
  const perieMap = {};
  for (const [q, r] of cells) perieMap[key(q, r)] = periesAt(q, r);

  function neighbours(q, r) {
    return [[1, 0], [-1, 0], [0, 1], [0, -1], [1, -1], [-1, 1]]
      .map(([dq, dr]) => [q + dq, r + dr])
      .filter(([a, b]) => Math.abs(a) <= S - 1 && Math.abs(b) <= S - 1 && Math.abs(a + b) <= S - 1);
  }

  let board, turn, winner, passed;

  function newGame() {
    board = {};
    for (const [q, r] of cells) board[key(q, r)] = ".";
    turn = "you";
    winner = null;
    passed = false;
  }
  newGame();

  // ── Scoring ──────────────────────────────────────────────────────
  function scoreFor(ch) {
    const seen = new Set();
    let total = 0;
    for (const [q, r] of cells) {
      const k = key(q, r);
      if (seen.has(k) || board[k] !== ch) continue;
      const stack = [[q, r]];
      seen.add(k);
      let p = 0;
      while (stack.length) {
        const [a, b] = stack.pop();
        p += perieMap[key(a, b)];
        for (const [na, nb] of neighbours(a, b)) {
          const k2 = key(na, nb);
          if (!seen.has(k2) && board[k2] === ch) {
            seen.add(k2);
            stack.push([na, nb]);
          }
        }
      }
      total += Math.max(0, p - 2);
    }
    return total;
  }

  function emptyCount() {
    let n = 0;
    for (const k of Object.keys(board)) if (board[k] === ".") n++;
    return n;
  }

  function endGame() {
    const sy = scoreFor("B"), sa = scoreFor("W");
    winner = sy > sa ? "you" : sa > sy ? "ai" : "draw";
    draw();
  }

  // ── AI ───────────────────────────────────────────────────────────
  function aiTurn() {
    if (winner || turn !== "ai") return;

    const current = scoreFor("W") - scoreFor("B");

    // 1-ply: find the move that maximizes AI score − player score
    let bestMove = null, bestScore = -Infinity;
    for (const [q, r] of cells) {
      const k = key(q, r);
      if (board[k] !== ".") continue;
      board[k] = "W";
      const s = scoreFor("W") - scoreFor("B");
      board[k] = ".";
      if (s > bestScore) {
        bestScore = s;
        bestMove = [q, r];
      }
    }

    if (bestMove && bestScore > current) {
      // Move that directly improves the score differential
      board[key(bestMove[0], bestMove[1])] = "W";
      passed = false;
    } else if (bestMove) {
      // No immediate scoring gain — play the empty cell with highest perie value
      // (edge/corner cells have scoring potential for future groups)
      let potMove = null, potPeries = -1;
      for (const [q, r] of cells) {
        const k = key(q, r);
        if (board[k] !== ".") continue;
        const p = perieMap[k];
        if (p > potPeries) { potPeries = p; potMove = [q, r]; }
      }
      if (potMove) {
        board[key(potMove[0], potMove[1])] = "W";
        passed = false;
      } else {
        if (passed) { endGame(); draw(); return; }
        passed = true;
        turn = "you";
        draw();
        return;
      }
    } else {
      if (passed) { endGame(); draw(); return; }
      passed = true;
      turn = "you";
      draw();
      return;
    }

    if (emptyCount() === 0) { endGame(); draw(); return; }
    turn = "you";
    draw();
  }

  // ── Rendering ────────────────────────────────────────────────────
  const maxCoord = S - 1;
  const geoExtentX = 2 * maxCoord; // number of "columns" of hexes
  const geoExtentY = 2 * maxCoord;
  const s = Math.min(
    (W - 16) / ((geoExtentX + 1) * Math.sqrt(3)),
    (H - 70) / (geoExtentY * 1.5 + 2)
  );

  function hexPos(q, r) {
    const cx = W / 2, cy = (H - 60) / 2;
    return {
      x: cx + s * Math.sqrt(3) * (q + r / 2),
      y: cy + s * 1.5 * r,
    };
  }

  // Pass button geometry (stored for hit-testing)
  const passBtn = { x: 0, y: 0, w: 0, h: 0 };

  function draw() {
    ctx.fillStyle = "#fafaf7";
    ctx.fillRect(0, 0, W, H);

    // Hex grid
    for (const [q, r] of cells) {
      const p = hexPos(q, r);
      const pv = perieMap[key(q, r)];
      const stone = board[key(q, r)];

      // Hex path
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 180) * (60 * i - 30);
        const px = p.x + s * Math.cos(a), py = p.y + s * Math.sin(a);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();

      // Fill
      if (stone === "B") ctx.fillStyle = "#39c";
      else if (stone === "W") ctx.fillStyle = "#e60";
      else if (pv > 0) { ctx.fillStyle = "#fffbee"; }
      else ctx.fillStyle = "#fff";
      ctx.fill();

      ctx.lineWidth = pv > 0 ? 1.5 : 0.5;
      ctx.strokeStyle = pv > 0 ? "#c90" : "#aaa";
      ctx.stroke();

      // Peries value on empty perimeter cells
      if (stone === "." && pv > 0) {
        ctx.fillStyle = "#c90";
        ctx.font = `bold ${Math.round(s * 0.38)}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(pv, p.x, p.y + 1);
      }

      // Stone circle
      if (stone !== ".") {
        ctx.beginPath();
        ctx.arc(p.x, p.y, s * 0.62, 0, Math.PI * 2);
        ctx.fillStyle = stone === "B" ? "#39c" : "#e60";
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    // Bottom bar: scores + pass button
    const bx = 10, by = H - 52, bw = W - 20, bh = 40;
    ctx.fillStyle = "#e8e4df";
    ctx.beginPath();
    ctx.roundRect(bx, by, bw, bh, 6);
    ctx.fill();

    const sy = scoreFor("B"), sa = scoreFor("W");

    ctx.fillStyle = "#333";
    ctx.font = "bold 14px sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(`You: ${sy}`, bx + 12, by + bh / 2);

    ctx.textAlign = "center";
    ctx.fillText("vs", bx + bw / 2, by + bh / 2);

    ctx.textAlign = "right";
    ctx.fillText(`AI: ${sa}`, bx + bw - 12, by + bh / 2);

    // PASS button
    const pbw = 72, pbh = 28;
    const pbx = bx + bw - pbw - 8, pby = by + (bh - pbh) / 2;
    passBtn.x = pbx;
    passBtn.y = pby;
    passBtn.w = pbw;
    passBtn.h = pbh;

    ctx.fillStyle = "#c90";
    ctx.beginPath();
    ctx.roundRect(pbx, pby, pbw, pbh, 4);
    ctx.fill();

    ctx.fillStyle = "#fff";
    ctx.font = "bold 13px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("PASS", pbx + pbw / 2, pby + pbh / 2);

    // Status
    if (winner) {
      statusEl.textContent =
        winner === "draw"
          ? `draw ${sy}–${sa}`
          : winner === "you"
            ? `you win ${sy}–${sa}`
            : `AI wins ${sa}–${sy}`;
    } else {
      statusEl.textContent =
        turn === "you"
          ? passed
            ? "AI passed — your turn"
            : "click a hex or PASS"
          : "AI thinking…";
    }
  }

  // ── Input ────────────────────────────────────────────────────────
  function onClick(e) {
    if (winner || turn !== "you") return;

    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (W / rect.width);
    const my = (e.clientY - rect.top) * (H / rect.height);

    // Pass button hit test
    if (
      mx >= passBtn.x &&
      mx <= passBtn.x + passBtn.w &&
      my >= passBtn.y &&
      my <= passBtn.y + passBtn.h
    ) {
      if (passed) { endGame(); draw(); return; }
      passed = true;
      turn = "ai";
      draw();
      setTimeout(aiTurn, 300);
      return;
    }

    // Find clicked hex
    let bestHit = null, bestD = Infinity;
    for (const [q, r] of cells) {
      const p = hexPos(q, r);
      const d = (mx - p.x) * (mx - p.x) + (my - p.y) * (my - p.y);
      if (d < bestD) {
        bestD = d;
        bestHit = [q, r];
      }
    }
    if (!bestHit || bestD > s * s * 1.3) return;
    const [q, r] = bestHit;
    const k = key(q, r);
    if (board[k] !== ".") return;

    board[k] = "B";
    passed = false;
    if (emptyCount() === 0) { endGame(); draw(); return; }
    turn = "ai";
    draw();
    setTimeout(aiTurn, 350);
  }

  canvas.addEventListener("click", onClick);
  draw();

  return {
    solve() {
      if (winner || turn !== "you") return;
      if (passed) { endGame(); draw(); return; }
      passed = true;
      turn = "ai";
      draw();
      setTimeout(aiTurn, 300);
    },
    destroy() {
      canvas.removeEventListener("click", onClick);
      ctx.clearRect(0, 0, W, H);
    },
    restart() {
      newGame();
      draw();
    },
  };
}
