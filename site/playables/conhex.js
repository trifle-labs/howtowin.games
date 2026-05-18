// ConHex — 5×5 tile grid (6×6 corner grid). You play black (connect top
// to bottom); AI plays white (connect left to right). Claim tiles by
// filling a majority of their corner-point pegs.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  const H = size + 48;
  canvas.width = size;
  canvas.height = H;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) {
    const w = canvas.width, h = canvas.height;
    canvas.style.width = w + 'px';    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);
  }
  const statusEl = document.getElementById("playable-status");

  const GRID = 6; // 6×6 corner grid → 5×5 tiles
  const MARGIN = 30;
  const TOP = 44;
  const SPACING = (size - 2 * MARGIN) / (GRID - 1);

  let corners, turn, winner;

  function newGame() {
    corners = Array.from({ length: GRID }, () => Array(GRID).fill(null));
    turn = "you";
    winner = null;
  }
  newGame();

  // ---- geometry helpers ----

  function cornerPx(r, c) {
    return { x: MARGIN + c * SPACING, y: TOP + r * SPACING };
  }

  function tileCorners(r, c) {
    return [
      [r, c],
      [r, c + 1],
      [r + 1, c],
      [r + 1, c + 1],
    ];
  }

  // ---- game logic ----

  function tileClaim(r, c) {
    const crns = tileCorners(r, c);
    let b = 0, w = 0;
    for (const [cr, cc] of crns) {
      if (corners[cr][cc] === "B") b++;
      else if (corners[cr][cc] === "W") w++;
    }
    if (b > w) return "B";
    if (w > b) return "W";
    return null;
  }

  function adjacentTiles(r, c) {
    const out = [];
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < 5 && nc >= 0 && nc < 5) out.push([nr, nc]);
      }
    }
    return out;
  }

  function checkWin(sym) {
    const seen = Array.from({ length: 5 }, () => Array(5).fill(false));
    const q = [];
    if (sym === "B") {
      // Black (you): top row → bottom row
      for (let c = 0; c < 5; c++) {
        if (tileClaim(0, c) === "B") {
          q.push([0, c]);
          seen[0][c] = true;
        }
      }
    } else {
      // White (AI): left col → right col
      for (let r = 0; r < 5; r++) {
        if (tileClaim(r, 0) === "W") {
          q.push([r, 0]);
          seen[r][0] = true;
        }
      }
    }
    while (q.length) {
      const [r, c] = q.shift();
      if (sym === "B" && r === 4) return true;
      if (sym === "W" && c === 4) return true;
      for (const [nr, nc] of adjacentTiles(r, c)) {
        if (seen[nr][nc] || tileClaim(nr, nc) !== sym) continue;
        seen[nr][nc] = true;
        q.push([nr, nc]);
      }
    }
    return false;
  }

  function emptyCorners() {
    const out = [];
    for (let r = 0; r < GRID; r++) {
      for (let c = 0; c < GRID; c++) {
        if (corners[r][c] === null) out.push([r, c]);
      }
    }
    return out;
  }

  // ---- AI ----

  // Generic best-move finder: given which side to play for ("B" or "W"),
  // returns [row, col] of the best empty corner.
  function bestMove(sym) {
    const opts = emptyCorners();
    if (!opts.length) return null;
    const opp = sym === "B" ? "W" : "B";

    // 1. Win immediately
    for (const [r, c] of opts) {
      corners[r][c] = sym;
      const wins = checkWin(sym);
      corners[r][c] = null;
      if (wins) return [r, c];
    }

    // 2. Block opponent win
    for (const [r, c] of opts) {
      corners[r][c] = opp;
      const wins = checkWin(opp);
      corners[r][c] = null;
      if (wins) return [r, c];
    }

    // 3. Heuristic scoring: shared-corner bonus + tiles claimed + tiles blocked
    let best = opts[0],
        bestScore = -Infinity;
    for (const [r, c] of opts) {
      // How many tiles share this corner? (1–4; higher = more strategic)
      let shared = 0;
      for (let tr = Math.max(0, r - 1); tr <= Math.min(4, r); tr++) {
        for (let tc = Math.max(0, c - 1); tc <= Math.min(4, c); tc++) {
          shared++;
        }
      }

      // Value of placing our own peg here
      corners[r][c] = sym;
      let ourCount = 0;
      for (let tr = 0; tr < 5; tr++) {
        for (let tc = 0; tc < 5; tc++) {
          if (tileClaim(tr, tc) === sym) ourCount++;
        }
      }
      corners[r][c] = null;

      // Blocking value: what the opponent would gain if they took this spot
      corners[r][c] = opp;
      let oppCount = 0;
      for (let tr = 0; tr < 5; tr++) {
        for (let tc = 0; tc < 5; tc++) {
          if (tileClaim(tr, tc) === opp) oppCount++;
        }
      }
      corners[r][c] = null;

      const score = shared * 3 + ourCount * 15 + oppCount * 12;
      if (score > bestScore) {
        bestScore = score;
        best = [r, c];
      }
    }

    return best;
  }

  function aiMove() {
    if (winner) return;
    const m = bestMove("W");
    if (!m) return;
    corners[m[0]][m[1]] = "W";
    if (checkWin("W")) {
      winner = "ai";
      draw();
      return;
    }
    turn = "you";
    draw();
  }

  // ---- drawing ----

  function draw() {
    ctx.fillStyle = "#fafaf7";
    ctx.fillRect(0, 0, size, H);

    // Title
    ctx.font = "13px sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#555";
    ctx.fillText(
      "ConHex 5×5 — you = ● (top↔bottom); AI = ○ (left↔right)",
      size / 2,
      16,
    );

    // Side markers — Black connects top↔bottom
    ctx.fillStyle = "#222";
    ctx.font = "bold 10px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("▼ BLACK", size / 2, TOP - 6);
    ctx.fillText("▲ BLACK", size / 2, TOP + (GRID - 1) * SPACING + 16);

    // Side markers — White connects left↔right
    ctx.save();
    ctx.translate(10, TOP + ((GRID - 1) * SPACING) / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.font = "bold 10px sans-serif";
    ctx.fillStyle = "#999";
    ctx.textAlign = "center";
    ctx.fillText("WHITE ▶", 0, 0);
    ctx.restore();

    ctx.save();
    ctx.translate(size - 10, TOP + ((GRID - 1) * SPACING) / 2);
    ctx.rotate(Math.PI / 2);
    ctx.fillText("WHITE ◀", 0, 0);
    ctx.restore();

    // Draw tiles (filled quadrilaterals)
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        const claim = tileClaim(r, c);
        const crns = tileCorners(r, c);
        const pts = crns.map(([cr, cc]) => cornerPx(cr, cc));

        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        ctx.lineTo(pts[1].x, pts[1].y);
        ctx.lineTo(pts[3].x, pts[3].y);
        ctx.lineTo(pts[2].x, pts[2].y);
        ctx.closePath();

        let fill = "#e8e8e3",
            stroke = "#c0c0b8";
        if (claim === "B") {
          fill = "#3a3a3a";
          stroke = "#222";
        } else if (claim === "W") {
          fill = "#d0d0d0";
          stroke = "#aaa";
        }
        ctx.fillStyle = fill;
        ctx.fill();
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    // Draw corner pegs (circles)
    for (let r = 0; r < GRID; r++) {
      for (let c = 0; c < GRID; c++) {
        const p = cornerPx(r, c);
        const v = corners[r][c];
        const R = 5;

        ctx.beginPath();
        ctx.arc(p.x, p.y, R, 0, Math.PI * 2);

        if (v === "B") {
          ctx.fillStyle = "#111";
          ctx.fill();
          ctx.strokeStyle = "#000";
          ctx.lineWidth = 1.5;
          ctx.stroke();
          // Subtle specular highlight
          ctx.beginPath();
          ctx.arc(p.x - 1.5, p.y - 1.5, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255,255,255,0.2)";
          ctx.fill();
        } else if (v === "W") {
          ctx.fillStyle = "#f8f8f8";
          ctx.fill();
          ctx.strokeStyle = "#777";
          ctx.lineWidth = 1.5;
          ctx.stroke();
        } else {
          ctx.fillStyle = "#ddd";
          ctx.fill();
          ctx.strokeStyle = "#bbb";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    // Status
    if (winner) {
      statusEl.textContent =
        winner === "you"
          ? "You win — connected top to bottom!"
          : "AI wins — connected left to right!";
    } else {
      statusEl.textContent =
        turn === "you"
          ? "Click an empty corner to place a black peg"
          : "AI thinking…";
    }
  }

  // ---- interaction ----

  function canvasCoords(e) {
    const r = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - r.left) * (size / r.width),
      y: (e.clientY - r.top) * (H / r.height),
    };
  }

  function pickCorner(px, py) {
    let best = null,
        bestD = Infinity;
    const threshold = SPACING * 0.45;
    for (let r = 0; r < GRID; r++) {
      for (let c = 0; c < GRID; c++) {
        const p = cornerPx(r, c);
        const d = Math.hypot(px - p.x, py - p.y);
        if (d < threshold && d < bestD) {
          bestD = d;
          best = [r, c];
        }
      }
    }
    return best;
  }

  function onClick(e) {
    if (winner || turn !== "you") return;
    const { x, y } = canvasCoords(e);
    const corner = pickCorner(x, y);
    if (!corner) return;
    const [r, c] = corner;
    if (corners[r][c] !== null) return;

    corners[r][c] = "B";
    if (checkWin("B")) {
      winner = "you";
      draw();
      return;
    }
    turn = "ai";
    draw();
    setTimeout(aiMove, 400);
  }

  canvas.addEventListener("click", onClick);
  draw();

  return {
    destroy() {
      canvas.removeEventListener("click", onClick);
      ctx.clearRect(0, 0, size, H);
    },
    restart() {
      newGame();
      draw();
    },
    solve() {
      if (winner || turn !== "you") return;
      const m = bestMove("B");
      if (!m) return;

      corners[m[0]][m[1]] = "B";
      if (checkWin("B")) {
        winner = "you";
        draw();
        return;
      }
      turn = "ai";
      draw();
      setTimeout(aiMove, 400);
    },
  };
}
