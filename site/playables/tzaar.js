// TZAAR — simplified capture game on 30-cell hex board with 3 piece types.
// Players capture by moving along a straight line in one direction by their
// height (all intermediate cells must be empty). Two actions per turn (first
// turn gets 1 capture action). Lose if any piece type count reaches 0.
// AI: heuristic — prioritise capturing rarer types and stacking defensively.

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = size + 50;
  const W = canvas.width, H = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) { canvas.style.width = W + 'px'; canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr); }
  const statusEl = document.getElementById("playable-status");

  // Build 30-cell board: 6 rows with counts 3-5-7-7-5-3 in even-r offset coords
  // converted to axial (q, r) where r is row index.
  const ROW_LENS = [3, 5, 7, 7, 5, 3];
  const CELLS = [];
  for (let r = 0; r < ROW_LENS.length; r++) {
    const shift = Math.floor(r / 2);
    for (let c = 0; c < ROW_LENS[r]; c++) {
      CELLS.push([c - shift, r]);
    }
  }
  const N = CELLS.length; // 30
  const idx = (q, r) => {
    for (let i = 0; i < N; i++) {
      if (CELLS[i][0] === q && CELLS[i][1] === r) return i;
    }
    return -1;
  };
  const DIRS = [[1,0],[1,-1],[0,-1],[-1,0],[-1,1],[0,1]];

  // Precompute bounding box for dynamic hex sizing
  const pts = CELLS.map(([q, r]) => ({
    x: 1.5 * q,
    y: Math.sqrt(3) * (r + q / 2)
  }));
  const minX = Math.min(...pts.map(p => p.x));
  const maxX = Math.max(...pts.map(p => p.x));
  const minY = Math.min(...pts.map(p => p.y));
  const maxY = Math.max(...pts.map(p => p.y));
  const boardW = maxX - minX;
  const boardH = maxY - minY;

  // --- Game State ---

  let board; // array of { owner, type, height }
  let turn, winner, phase, selPiece, validMoves;
  let actionsLeft, youFirstDone;
  let youCounts, aiCounts; // { Z, A, T }

  function newGame() {
    // Initialise board with alternating placement
    board = new Array(N);
    const youTypes = shuffle(['Z','Z','Z','A','A','A','A','A','T','T','T','T','T','T','T']);
    const aiTypes = shuffle(['Z','Z','Z','A','A','A','A','A','T','T','T','T','T','T','T']);
    let yi = 0, ai = 0;
    for (let i = 0; i < N; i++) {
      if (i % 2 === 0) {
        board[i] = { owner: 'B', type: youTypes[yi++], height: 1 };
      } else {
        board[i] = { owner: 'W', type: aiTypes[ai++], height: 1 };
      }
    }
    turn = "you";
    winner = null;
    phase = "select-piece";
    selPiece = -1;
    validMoves = [];
    actionsLeft = 0;
    youFirstDone = false;
    youCounts = { Z: 3, A: 5, T: 7 };
    aiCounts = { Z: 3, A: 5, T: 7 };
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Recompute type counts from board state
  function recomputeCounts() {
    youCounts = { Z: 0, A: 0, T: 0 };
    aiCounts = { Z: 0, A: 0, T: 0 };
    for (let i = 0; i < N; i++) {
      const p = board[i];
      if (p.owner === 'B') youCounts[p.type] += p.height;
      else if (p.owner === 'W') aiCounts[p.type] += p.height;
    }
  }

  // Get valid moves for a piece at index `i` belonging to `owner`.
  // Moves: travel exactly height cells in a straight line (one of 6 directions),
  // all intermediate cells empty. Target must be enemy (capture) or friendly
  // same-type (stack). Capture only when target height <= your height.
  function getValidMoves(i, owner) {
    const p = board[i];
    if (p.owner !== owner) return [];
    const [q, r] = CELLS[i];
    const h = p.height;
    const moves = [];

    for (const [dq, dr] of DIRS) {
      let blocked = false;
      for (let k = 1; k < h; k++) {
        const ni = idx(q + k * dq, r + k * dr);
        if (ni < 0 || board[ni].height > 0) { blocked = true; break; }
      }
      if (blocked) continue;

      const ti = idx(q + h * dq, r + h * dr);
      if (ti < 0) continue;
      const t = board[ti];
      if (t.height === 0) continue;

      if (t.owner === owner) {
        // Same type required for stacking in this simplified version
        if (t.type === p.type) {
          moves.push({ to: ti, type: 'stack', dir: [dq, dr] });
        }
      } else if (t.height <= h) {
        moves.push({ to: ti, type: 'capture', dir: [dq, dr] });
      }
    }
    return moves;
  }

  // Get all moves for a player's entire team
  function getAllMoves(owner) {
    const all = [];
    for (let i = 0; i < N; i++) {
      if (board[i].owner !== owner) continue;
      const moves = getValidMoves(i, owner);
      for (const m of moves) all.push({ from: i, ...m });
    }
    return all;
  }

  function executeAction(from, to, type) {
    const p = board[from];
    const t = board[to];

    if (type === 'capture') {
      // Enemy stack removed — subtract from the captured piece's owner
      if (t.owner === 'B') {
        youCounts[t.type] -= t.height;
        if (youCounts[t.type] < 0) youCounts[t.type] = 0;
      } else {
        aiCounts[t.type] -= t.height;
        if (aiCounts[t.type] < 0) aiCounts[t.type] = 0;
      }
      // Mover occupies target cell
      board[to] = { owner: p.owner, type: p.type, height: p.height };
    } else {
      // Stack: combine heights, mover's type stays on top
      board[to] = {
        owner: p.owner,
        type: p.type,
        height: p.height + t.height
      };
      // Type counts unchanged (pieces combined, not removed)
    }
    board[from] = { owner: '.', type: null, height: 0 };
  }

  function hasAnyMoves(owner) {
    return getAllMoves(owner).length > 0;
  }

  function checkLossAtStart() {
    if (turn === "you") {
      if (youCounts.Z <= 0 || youCounts.A <= 0 || youCounts.T <= 0) {
        winner = "ai"; return true;
      }
    } else {
      if (aiCounts.Z <= 0 || aiCounts.A <= 0 || aiCounts.T <= 0) {
        winner = "you"; return true;
      }
    }
    return false;
  }

  function startTurn() {
    recomputeCounts();
    if (checkLossAtStart()) { draw(); return; }

    if (turn === "you") {
      if (!youFirstDone) {
        actionsLeft = 1;
        // youFirstDone stays false until first action completes
      } else {
        actionsLeft = 2;
      }
      if (!hasAnyMoves('B')) { winner = "ai"; draw(); return; }
      phase = "select-piece";
      selPiece = -1;
      validMoves = [];
      draw();
    } else {
      actionsLeft = 2;
      if (!hasAnyMoves('W')) { winner = "you"; draw(); return; }
      phase = "ai";
      draw();
      setTimeout(doAIActions, 350);
    }
  }

  // --- AI ---

  function doAIActions() {
    if (winner || turn !== "ai") return;

    const allMoves = getAllMoves('W');
    if (!allMoves.length) {
      winner = "you"; draw(); return;
    }

    let best = allMoves[0], bestScore = -Infinity;
    for (const m of allMoves) {
      let score = 0;
      if (m.type === 'capture') {
        const t = board[m.to].type;
        // Rarer types are more valuable to capture
        if (t === 'Z') score += 30;
        else if (t === 'A') score += 20;
        else score += 10;
        score += board[m.to].height * 3;
      } else {
        // Stacking: taller is stronger, defensively valuable
        score += 8;
        score += board[m.from].height * 2;
      }
      // Prefer central positions
      const [q, r] = CELLS[m.to];
      score -= (Math.abs(q) + Math.abs(r)) * 2;
      // Prefer moving with taller stacks
      score += board[m.from].height * 2;

      if (score > bestScore) { bestScore = score; best = m; }
    }

    executeAction(best.from, best.to, best.type);
    actionsLeft--;

    if (actionsLeft <= 0) {
      turn = "you";
      startTurn();
    } else {
      setTimeout(doAIActions, 250);
    }
  }

  // --- Drawing ---

  // Compute hex scale to fit board in canvas
  const padR = 1.8;
  const availW = size - 40;
  const availH = size - 50 - 40;
  let hexScale = Math.min(availW / (boardW + 2 * padR), availH / (boardH + 2 * padR));
  if (hexScale > 20) hexScale = 20;

  function cellCenter(q, r) {
    const cx = W / 2 - hexScale * (minX + maxX) / 2;
    const cy = 40 + (size - 50) / 2 - hexScale * (minY + maxY) / 2;
    return {
      x: cx + hexScale * 1.5 * q,
      y: cy + hexScale * Math.sqrt(3) * (r + q / 2),
      r: hexScale * 0.85
    };
  }

  function drawHex(cx, cy, s) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = i * Math.PI / 3;
      const px = cx + s * Math.cos(a), py = cy + s * Math.sin(a);
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
  }

  function draw() {
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);

    const movableSet = new Set();
    if (phase === "select-piece" && turn === "you") {
      for (let i = 0; i < N; i++) {
        if (board[i].owner !== 'B') continue;
        const mv = getValidMoves(i, 'B');
        const allowed = (!youFirstDone)
          ? mv.filter(m => m.type === 'capture')
          : mv;
        if (allowed.length > 0) movableSet.add(i);
      }
    }
    const targetSet = new Set();
    const captureSet = new Set();
    const stackSet = new Set();
    if (phase === "select-target") {
      for (const m of validMoves) {
        targetSet.add(m.to);
        if (m.type === 'capture') captureSet.add(m.to);
        else stackSet.add(m.to);
      }
    }

    for (let i = 0; i < N; i++) {
      const [q, r] = CELLS[i];
      const c = cellCenter(q, r);
      const hs = hexScale;

      drawHex(c.x, c.y, hs);

      // Background tint
      if (i === selPiece) {
        ctx.fillStyle = "#d8e8d8";
      } else if (captureSet.has(i)) {
        ctx.fillStyle = "#fce8e0";
      } else if (stackSet.has(i)) {
        ctx.fillStyle = "#e0f0e0";
      } else if (movableSet.has(i)) {
        ctx.fillStyle = "#eef4ee";
      } else {
        ctx.fillStyle = "#fff";
      }
      ctx.fill();
      ctx.strokeStyle = (i === selPiece) ? "#090" : "#999";
      ctx.lineWidth = (i === selPiece) ? 2.5 : 1;
      ctx.stroke();
      ctx.lineWidth = 1;

      // Piece rendering
      const p = board[i];
      if (p.height > 0) {
        const radius = c.r * 0.7;
        ctx.beginPath();
        ctx.arc(c.x, c.y, radius, 0, Math.PI * 2);

        // Color by owner and type
        if (p.owner === 'B') {
          if (p.type === 'Z') ctx.fillStyle = "#1a4b7c";
          else if (p.type === 'A') ctx.fillStyle = "#2980b9";
          else ctx.fillStyle = "#6bb5e0";
        } else {
          if (p.type === 'Z') ctx.fillStyle = "#8b3a0f";
          else if (p.type === 'A') ctx.fillStyle = "#d9722a";
          else ctx.fillStyle = "#e8a86a";
        }
        ctx.fill();
        ctx.strokeStyle = "#222";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Type letter
        ctx.fillStyle = "#fff";
        ctx.font = "bold " + Math.round(radius * 0.9) + "px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(p.type, c.x, c.y - 1);

        // Height indicator
        if (p.height > 1) {
          ctx.font = Math.round(radius * 0.45) + "px sans-serif";
          ctx.fillStyle = "#fff";
          ctx.fillText("x" + p.height, c.x + radius * 0.6, c.y - radius * 0.4);
        }
      }
    }

    // Type counts display
    ctx.font = "11px sans-serif";
    ctx.textAlign = "left";
    ctx.fillStyle = "#39c";
    ctx.fillText("B: Z" + youCounts.Z + " A" + youCounts.A + " T" + youCounts.T, 8, 16);
    ctx.textAlign = "right";
    ctx.fillStyle = "#e60";
    ctx.fillText("W: Z" + aiCounts.Z + " A" + aiCounts.A + " T" + aiCounts.T, W - 8, 16);

    // Status
    if (winner) {
      statusEl.textContent = winner === "you"
        ? "You win! AI lost all pieces of one type or has no moves."
        : "AI wins. You lost all pieces of one type or have no moves.";
    } else if (turn === "you") {
      if (phase === "select-piece") {
        const label = !youFirstDone ? "(1 capture action)" : "(" + actionsLeft + " actions)";
        statusEl.textContent = "Select your piece " + label;
      } else if (phase === "select-target") {
        statusEl.textContent = "Click highlighted target (capture or stack)";
      }
    } else {
      statusEl.textContent = "AI thinking...";
    }
  }

  // --- Interaction ---

  function pos(e) {
    const r = canvas.getBoundingClientRect();
    return { x: (e.clientX - r.left) * (W / r.width), y: (e.clientY - r.top) * (H / r.height) };
  }

  function cellAt(x, y) {
    for (let i = 0; i < N; i++) {
      const [q, r] = CELLS[i];
      const c = cellCenter(q, r);
      if (Math.hypot(x - c.x, y - c.y) < c.r) return i;
    }
    return -1;
  }

  function onClick(e) {
    if (winner || turn !== "you") return;
    const { x, y } = pos(e);
    const clicked = cellAt(x, y);
    if (clicked < 0) return;

    // --- Select-piece phase ---
    if (phase === "select-piece") {
      if (board[clicked].owner !== 'B') return;
      const moves = getValidMoves(clicked, 'B');
      const allowed = (!youFirstDone)
        ? moves.filter(m => m.type === 'capture')
        : moves;
      if (!allowed.length) return;
      selPiece = clicked;
      validMoves = allowed;
      phase = "select-target";
      draw();
      return;
    }

    // --- Select-target phase ---
    if (phase === "select-target") {
      // Click own piece to reselect
      if (board[clicked].owner === 'B' && clicked !== selPiece) {
        const moves = getValidMoves(clicked, 'B');
        const allowed = (!youFirstDone)
          ? moves.filter(m => m.type === 'capture')
          : moves;
        if (allowed.length) {
          selPiece = clicked;
          validMoves = allowed;
          draw();
          return;
        }
      }
      // Check if this is a valid target
      const mv = validMoves.find(m => m.to === clicked);
      if (!mv) return;

      executeAction(selPiece, mv.to, mv.type);
      selPiece = -1;
      validMoves = [];
      actionsLeft--;

      if (actionsLeft <= 0) {
        if (!youFirstDone) youFirstDone = true;
        turn = "ai";
        startTurn();
      } else {
        phase = "select-piece";
        if (!hasAnyMoves('B')) {
          winner = "ai"; draw(); return;
        }
        draw();
      }
    }
  }

  // --- Lifecycle ---

  canvas.addEventListener("click", onClick);
  newGame();
  startTurn();

  return {
    solve() {
      if (winner || turn !== "you") return;

      // Make a random legal move for the player
      if (phase === "select-piece") {
        const candidates = [];
        for (let i = 0; i < N; i++) {
          if (board[i].owner !== 'B') continue;
          const moves = getValidMoves(i, 'B');
          const allowed = (!youFirstDone)
            ? moves.filter(m => m.type === 'capture')
            : moves;
          if (allowed.length) candidates.push(i);
        }
        if (!candidates.length) { winner = "ai"; draw(); return; }
        selPiece = candidates[Math.floor(Math.random() * candidates.length)];
        const moves = getValidMoves(selPiece, 'B');
        validMoves = (!youFirstDone)
          ? moves.filter(m => m.type === 'capture')
          : moves;
        phase = "select-target";
        // fall through
      }

      if (phase === "select-target") {
        if (!validMoves.length) return;
        const mv = validMoves[Math.floor(Math.random() * validMoves.length)];
        executeAction(selPiece, mv.to, mv.type);
        selPiece = -1;
        validMoves = [];
        actionsLeft--;

        if (actionsLeft <= 0) {
          if (!youFirstDone) youFirstDone = true;
          turn = "ai";
          startTurn();
        } else {
          phase = "select-piece";
          if (!hasAnyMoves('B')) { winner = "ai"; draw(); return; }
          draw();
        }
      }
    },
    destroy() { canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart() { newGame(); startTurn(); },
  };
}
