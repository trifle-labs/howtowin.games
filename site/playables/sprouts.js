// Sprouts — pencil-and-paper game.
// Start with n spots. On a turn, draw a curve joining two spots (or a spot to
// itself) without crossing any existing line, then place a new spot on that
// line. Each spot may have at most 3 lines. Player unable to move loses.
// Partially solved: first player wins when n mod 6 = 3, 4, or 5.
//
// UI: Before each game, a clickable selector lets the user pick 3–6 spots.
// Click a spot to begin a line, then click another (or the same) to complete
// it. The AI picks a random legal move.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = size;
  const W = canvas.width, H = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) {
    canvas.style.width = W + 'px';
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);
  }
  const statusEl = document.getElementById("playable-status");

  // ── constants ──────────────────────────────────────────────────────────────
  const MIN_SPOTS = 3;
  const MAX_SPOTS = 6;
  const HIT_RADIUS = 14;
  const SPOT_R = 6;
  const MAX_DEG = 3;
  const NSEG = 16; // segments per curve for crossing detection
  const TITLE_Y = 16;
  const CENTER_Y = H * 0.48;
  const RING_R = Math.min(W, H) * 0.32;

  // ── state ──────────────────────────────────────────────────────────────────
  let mode = "select"; // "select" | "play" | "over"
  let startN = 0;
  let spots = [];   // { x, y, degree }
  let lines = [];   // { from, to, x1, y1, cx, cy, x2, y2, newSpot }
  let turn = 0;     // 0 = human, 1 = AI
  let winner = null;
  let selected = -1;
  let moveCount = 0;
  let maxMoves = 0;

  // ── geometry helpers ───────────────────────────────────────────────────────

  function dist(x1, y1, x2, y2) {
    return Math.hypot(x2 - x1, y2 - y1);
  }

  // Control point for a quadratic Bezier between two points.
  // When `rnd` is true the offset distance and side are randomised.
  function computeCP(x1, y1, x2, y2, rnd) {
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.hypot(dx, dy) || 1;
    const base = len * 0.35;
    const extra = rnd ? Math.random() * 20 + 5 : 0;
    const offset = base + extra;
    // deterministic side for crossing checks, random for visual variety
    const side = rnd
      ? (Math.random() > 0.5 ? 1 : -1)
      : ((Math.floor(x1 + y1 + x2 + y2) * 7 + 13) % 2 === 0 ? 1 : -1);
    return {
      cx: mx + (-dy / len) * offset * side,
      cy: my + (dx / len) * offset * side,
    };
  }

  // Control point for a loop (spot to itself).
  function computeLoopCP(x, y, rnd) {
    const angle = ((Math.floor(x + y) * 7 + 13) % 360) * (Math.PI / 180);
    const baseDist = 22;
    const extra = rnd ? Math.random() * 12 : 0;
    // deterministic vs random direction
    const a = rnd ? angle + (Math.random() - 0.5) * 0.6 : angle;
    return {
      cx: x + Math.cos(a) * (baseDist + extra),
      cy: y + Math.sin(a) * (baseDist + extra),
    };
  }

  // Sample N+1 points along a quadratic Bezier.
  function sampleCurve(x1, y1, cx, cy, x2, y2, n) {
    const pts = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const u = 1 - t;
      pts.push({
        x: u * u * x1 + 2 * u * t * cx + t * t * x2,
        y: u * u * y1 + 2 * u * t * cy + t * t * y2,
      });
    }
    return pts;
  }

  function orient(ax, ay, bx, by, cx, cy) {
    return (bx - ax) * (cy - ay) - (by - ay) * (cx - ax);
  }

  function onSeg(px, py, ax, ay, bx, by) {
    return (
      Math.min(ax, bx) - 1 <= px &&
      px <= Math.max(ax, bx) + 1 &&
      Math.min(ay, by) - 1 <= py &&
      py <= Math.max(ay, by) + 1
    );
  }

  // True if segment A–B crosses segment C–D at an interior point.
  function segsCross(a, b, c, d) {
    const o1 = orient(a.x, a.y, b.x, b.y, c.x, c.y);
    const o2 = orient(a.x, a.y, b.x, b.y, d.x, d.y);
    const o3 = orient(c.x, c.y, d.x, d.y, a.x, a.y);
    const o4 = orient(c.x, c.y, d.x, d.y, b.x, b.y);

    // Endpoint touching is not crossing.
    if (o1 === 0 && onSeg(c.x, c.y, a.x, a.y, b.x, b.y)) return false;
    if (o2 === 0 && onSeg(d.x, d.y, a.x, a.y, b.x, b.y)) return false;
    if (o3 === 0 && onSeg(a.x, a.y, c.x, c.y, d.x, d.y)) return false;
    if (o4 === 0 && onSeg(b.x, b.y, c.x, c.y, d.x, d.y)) return false;

    return Math.sign(o1) !== Math.sign(o2) && Math.sign(o3) !== Math.sign(o4);
  }

  // True if the given curve would cross any existing line.
  function curveCrossesExisting(x1, y1, cx, cy, x2, y2) {
    const myPts = sampleCurve(x1, y1, cx, cy, x2, y2, NSEG);
    for (const ln of lines) {
      const ePts = sampleCurve(ln.x1, ln.y1, ln.cx, ln.cy, ln.x2, ln.y2, NSEG);
      for (let i = 0; i < NSEG; i++) {
        for (let j = 0; j < NSEG; j++) {
          if (segsCross(myPts[i], myPts[i + 1], ePts[j], ePts[j + 1]))
            return true;
        }
      }
    }
    return false;
  }

  // ── game logic ─────────────────────────────────────────────────────────────

  function canConnect(from, to) {
    if (spots[from].degree >= MAX_DEG) return false;
    if (spots[to].degree >= MAX_DEG) return false;
    // loop needs 2 free connections
    if (from === to && spots[from].degree > MAX_DEG - 2) return false;
    return true;
  }

  function isMoveLegal(from, to) {
    if (!canConnect(from, to)) return false;
    const s = spots[from];
    const t = spots[to];
    let cx, cy;
    if (from === to) {
      const cp = computeLoopCP(s.x, s.y, false);
      cx = cp.cx; cy = cp.cy;
    } else {
      const cp = computeCP(s.x, s.y, t.x, t.y, false);
      cx = cp.cx; cy = cp.cy;
    }
    return !curveCrossesExisting(s.x, s.y, cx, cy, from === to ? s.x : t.x, from === to ? s.y : t.y);
  }

  function findLegalMoves() {
    const moves = [];
    for (let i = 0; i < spots.length; i++) {
      for (let j = i; j < spots.length; j++) {
        if (isMoveLegal(i, j)) moves.push([i, j]);
      }
    }
    return moves;
  }

  function makeMove(from, to) {
    const s = spots[from];
    const t = spots[to];
    let cx, cy;
    if (from === to) {
      const cp = computeLoopCP(s.x, s.y, true);
      cx = cp.cx; cy = cp.cy;
    } else {
      const cp = computeCP(s.x, s.y, t.x, t.y, true);
      cx = cp.cx; cy = cp.cy;
    }

    // Place new spot near the midpoint of the curve.
    const midT = 0.4 + Math.random() * 0.2;
    const u = 1 - midT;
    const nx = u * u * s.x + 2 * u * midT * cx + midT * midT * t.x;
    const ny = u * u * s.y + 2 * u * midT * cy + midT * midT * t.y;

    const newIdx = spots.length;
    spots.push({ x: nx, y: ny, degree: 2 }); // line passes through

    if (from === to) {
      spots[from].degree += 2;
    } else {
      spots[from].degree += 1;
      spots[to].degree += 1;
    }

    const endX = from === to ? s.x : t.x;
    const endY = from === to ? s.y : t.y;
    lines.push({ from, to, x1: s.x, y1: s.y, cx, cy, x2: endX, y2: endY, newSpot: newIdx });
    moveCount++;
  }

  function hasNoLegalMoves() {
    return findLegalMoves().length === 0;
  }

  function aiMove() {
    if (mode !== "play" || winner) return;
    const moves = findLegalMoves();
    if (moves.length === 0) {
      winner = "you";
      mode = "over";
      draw();
      statusEl.textContent = `you win! (${moveCount} of max ${maxMoves} moves)`;
      return;
    }
    const m = moves[Math.floor(Math.random() * moves.length)];
    makeMove(m[0], m[1]);
    if (hasNoLegalMoves()) {
      winner = "ai";
      mode = "over";
      draw();
      statusEl.textContent = `AI wins (${moveCount} of max ${maxMoves} moves)`;
      return;
    }
    turn = 0;
    selected = -1;
    draw();
  }

  function newGame(n) {
    startN = n;
    spots = [];
    lines = [];
    selected = -1;
    turn = 0;
    winner = null;
    moveCount = 0;
    maxMoves = 3 * startN - 1;
    mode = "play";

    const cx = W / 2;
    const cy = CENTER_Y;
    for (let i = 0; i < startN; i++) {
      const angle = (i / startN) * Math.PI * 2 - Math.PI / 2;
      spots.push({
        x: cx + Math.cos(angle) * RING_R,
        y: cy + Math.sin(angle) * RING_R,
        degree: 0,
      });
    }
    draw();
  }

  // ── rendering ──────────────────────────────────────────────────────────────

  function draw() {
    ctx.fillStyle = "#fafaf7";
    ctx.fillRect(0, 0, W, H);

    if (mode === "select") {
      drawSelector();
      return;
    }
    drawGame();
  }

  function drawSelector() {
    // Title
    ctx.fillStyle = "#444";
    ctx.font = "bold 24px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Sprouts", W / 2, H * 0.26);

    ctx.font = "14px sans-serif";
    ctx.fillStyle = "#666";
    ctx.fillText("Choose starting spots:", W / 2, H * 0.37);

    // Four clickable circles
    const cR = 26;
    const gap = 72;
    const x0 = W / 2 - ((MAX_SPOTS - MIN_SPOTS) * gap) / 2;
    const cY = H * 0.52;

    for (let n = MIN_SPOTS; n <= MAX_SPOTS; n++) {
      const x = x0 + (n - MIN_SPOTS) * gap;

      ctx.beginPath();
      ctx.arc(x, cY, cR, 0, Math.PI * 2);
      ctx.fillStyle = "#2a2";
      ctx.fill();
      ctx.strokeStyle = "#1a1";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = "#fff";
      ctx.font = "bold 20px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(n), x, cY);

      // Preview dots below
      const dR = 2.5;
      const dGap = 10;
      const dY = cY + cR + 16;
      const dX0 = x - ((n - 1) * dGap) / 2;
      for (let j = 0; j < n; j++) {
        ctx.beginPath();
        ctx.arc(dX0 + j * dGap, dY, dR, 0, Math.PI * 2);
        ctx.fillStyle = "#555";
        ctx.fill();
      }
    }

    ctx.font = "11px sans-serif";
    ctx.fillStyle = "#999";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("First player wins when n mod 6 = 3, 4, or 5", W / 2, H * 0.76);

    statusEl.textContent = "click a number of spots to start";
  }

  function drawGame() {
    // Title
    ctx.fillStyle = "#444";
    ctx.font = "13px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(`Sprouts — n = ${startN}  (move ${moveCount}/${maxMoves})`, W / 2, TITLE_Y);

    // Lines
    ctx.lineWidth = 2;
    for (const ln of lines) {
      ctx.strokeStyle = "#555";
      ctx.beginPath();
      ctx.moveTo(ln.x1, ln.y1);
      ctx.quadraticCurveTo(ln.cx, ln.cy, ln.x2, ln.y2);
      ctx.stroke();
    }
    ctx.lineWidth = 1;

    // Spots
    const isHumanTurn = mode === "play" && turn === 0 && !winner;
    for (let i = 0; i < spots.length; i++) {
      const s = spots[i];
      const dead = s.degree >= MAX_DEG;
      const canSelect = isHumanTurn && !dead;
      const r = i === selected ? SPOT_R + 3 : SPOT_R + (canSelect ? 1 : 0);

      if (dead) {
        // Dead spot: grey ring with a cross
        ctx.strokeStyle = "#ccc";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
        ctx.stroke();
        const hr = r * 0.5;
        ctx.beginPath();
        ctx.moveTo(s.x - hr, s.y - hr);
        ctx.lineTo(s.x + hr, s.y + hr);
        ctx.moveTo(s.x + hr, s.y - hr);
        ctx.lineTo(s.x - hr, s.y + hr);
        ctx.stroke();
        ctx.lineWidth = 1;
      } else {
        ctx.beginPath();
        ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
        ctx.fillStyle = i === selected ? "#2a2" : "#222";
        ctx.fill();
        if (canSelect) {
          ctx.strokeStyle = "#0a0";
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
        ctx.lineWidth = 1;
      }

      // Degree badge
      ctx.font = "8px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillStyle = dead ? "#bbb" : "#888";
      ctx.fillText(`${s.degree}/${MAX_DEG}`, s.x, s.y - r - 3);
    }

    // Highlight legal targets when a spot is selected
    if (selected >= 0 && isHumanTurn) {
      for (let j = 0; j < spots.length; j++) {
        if (j === selected) continue;
        if (isMoveLegal(selected, j)) {
          const s = spots[j];
          ctx.beginPath();
          ctx.arc(s.x, s.y, SPOT_R + 5, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(0,180,0,0.35)";
          ctx.lineWidth = 2.5;
          ctx.stroke();
          ctx.lineWidth = 1;
        }
      }
    }

    // Status
    if (mode === "over") {
      // Message already set in aiMove / onClick
    } else if (turn === 0) {
      const moves = findLegalMoves();
      if (moves.length === 0) {
        // Shouldn't reach here, but safety net
        winner = "ai";
        mode = "over";
        draw();
        return;
      }
      const parity = startN % 6;
      const firstWins = parity === 3 || parity === 4 || parity === 5;
      const hint = firstWins
        ? `first player should win (n%6=${parity})`
        : `second player should win (n%6=${parity})`;
      statusEl.textContent =
        selected < 0
          ? `your turn — click a spot  —  ${hint}`
          : "click another spot (or same spot for a loop)";
    } else {
      statusEl.textContent = "AI thinking...";
    }
  }

  // ── input ──────────────────────────────────────────────────────────────────

  function pos(e) {
    const r = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - r.left) * (W / r.width),
      y: (e.clientY - r.top) * (H / r.height),
    };
  }

  function hitSpot(x, y) {
    for (let i = 0; i < spots.length; i++) {
      if (dist(x, y, spots[i].x, spots[i].y) < HIT_RADIUS) return i;
    }
    return -1;
  }

  function hitSelector(x, y) {
    if (mode !== "select") return -1;
    const cR = 26;
    const gap = 72;
    const x0 = W / 2 - ((MAX_SPOTS - MIN_SPOTS) * gap) / 2;
    const cY = H * 0.52;
    for (let n = MIN_SPOTS; n <= MAX_SPOTS; n++) {
      const cx = x0 + (n - MIN_SPOTS) * gap;
      if (dist(x, y, cx, cY) < cR + 5) return n;
    }
    return -1;
  }

  function onClick(e) {
    const p = pos(e);

    // ── selector mode ──
    if (mode === "select") {
      const n = hitSelector(p.x, p.y);
      if (n >= MIN_SPOTS && n <= MAX_SPOTS) newGame(n);
      return;
    }

    // ── game over or AI turn guard ──
    if (mode !== "play" || winner || turn !== 0) return;

    const i = hitSpot(p.x, p.y);
    if (i < 0) return;
    if (spots[i].degree >= MAX_DEG) return;

    // First selection
    if (selected < 0) {
      selected = i;
      draw();
      return;
    }

    // Click the same spot → try a loop
    if (i === selected) {
      if (isMoveLegal(i, i)) {
        makeMove(i, i);
        selected = -1;
        if (hasNoLegalMoves()) {
          winner = "you";
          mode = "over";
          statusEl.textContent = `you win! (${moveCount} of max ${maxMoves} moves)`;
          draw();
          return;
        }
        turn = 1;
        draw();
        setTimeout(aiMove, 400);
      } else {
        selected = -1;
        draw();
      }
      return;
    }

    // Connect two different spots
    if (isMoveLegal(selected, i)) {
      makeMove(selected, i);
      selected = -1;
      if (hasNoLegalMoves()) {
        winner = "you";
        mode = "over";
        statusEl.textContent = `you win! (${moveCount} of max ${maxMoves} moves)`;
        draw();
        return;
      }
      turn = 1;
      draw();
      setTimeout(aiMove, 400);
    } else {
      // Switch selection to the newly clicked spot
      selected = i;
      draw();
    }
  }

  canvas.addEventListener("click", onClick);
  draw();

  // ── public API ─────────────────────────────────────────────────────────────

  return {
    destroy() {
      canvas.removeEventListener("click", onClick);
      ctx.clearRect(0, 0, W, H);
    },
    restart() {
      mode = "select";
      startN = 0;
      spots = [];
      lines = [];
      selected = -1;
      turn = 0;
      winner = null;
      moveCount = 0;
      maxMoves = 0;
      draw();
    },
    solve() {
      if (mode !== "play" || turn !== 0 || winner) return;
      const moves = findLegalMoves();
      if (moves.length === 0) {
        mode = "over";
        winner = "ai";
        statusEl.textContent = `AI wins (${moveCount} of max ${maxMoves} moves)`;
        draw();
        return;
      }

      // Show parity hint
      const parity = startN % 6;
      const firstWins = parity === 3 || parity === 4 || parity === 5;
      const hint = firstWins
        ? `hint: you move first and n%6=${parity} — you should win!`
        : `hint: you move first but n%6=${parity} — second player should win`;
      statusEl.textContent = hint;

      // Make a reasonable move (prefer short connections).
      let best = moves[0];
      let bestD = Infinity;
      for (const m of moves) {
        const d = dist(spots[m[0]].x, spots[m[0]].y, spots[m[1]].x, spots[m[1]].y);
        if (d < bestD) {
          bestD = d;
          best = m;
        }
      }
      makeMove(best[0], best[1]);
      selected = -1;
      if (hasNoLegalMoves()) {
        winner = "you";
        mode = "over";
        statusEl.textContent = `you win! (${moveCount} of max ${maxMoves} moves)`;
        draw();
        return;
      }
      turn = 1;
      draw();
      setTimeout(aiMove, 400);
    },
  };
}
