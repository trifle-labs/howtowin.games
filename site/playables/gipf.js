// GIPF — Players push pieces onto a hex board from the edges.
// Four in a row captures them. First player unable to push loses.
// AI: heuristic — simulate each push, pick the one maximizing reserve advantage.

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = size + 30;
  const W = canvas.width, H = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) { canvas.style.width = W + 'px'; canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr); }
  const statusEl = document.getElementById("playable-status");

  const S = 4; // side length => 37 cells (standard GIPF)
  const CELLS = [];
  for (let q = -(S-1); q <= S-1; q++) {
    for (let r = -(S-1); r <= S-1; r++) {
      if (Math.abs(q + r) <= S-1) CELLS.push([q, r]);
    }
  }
  const N = CELLS.length;
  const idx = (q, r) => {
    const k = q + ',' + r;
    return idxMap.has(k) ? idxMap.get(k) : -1;
  };
  const idxMap = new Map();
  for (let i = 0; i < N; i++) idxMap.set(CELLS[i][0] + ',' + CELLS[i][1], i);
  const DIRS = [[1,0],[1,-1],[0,-1],[-1,0],[-1,1],[0,1]];

  function isEdge(q, r) {
    return Math.abs(q) === S-1 || Math.abs(r) === S-1 || Math.abs(q + r) === S-1;
  }

  // Push direction: pick the direction that moves closest to the board center (0,0).
  // For corner cells (on 2+ edges), this avoids pushing along the edge.
  function getPushDir(q, r) {
    let best = null, bestDist = Infinity;
    for (const [dq, dr] of DIRS) {
      const nq = q + dq, nr = r + dr;
      if (idx(nq, nr) < 0) continue;
      const dist = Math.max(Math.abs(nq), Math.abs(nr), Math.abs(nq + nr));
      if (dist < bestDist) { bestDist = dist; best = [dq, dr]; }
    }
    return best;
  }

  function getPushLine(q, r) {
    const dir = getPushDir(q, r);
    if (!dir) return { dir: null, cells: [] };
    const [dq, dr] = dir;
    const cells = [[q, r]];
    let cq = q + dq, cr = r + dr;
    while (idx(cq, cr) >= 0) {
      cells.push([cq, cr]);
      cq += dq;
      cr += dr;
    }
    return { dir, cells };
  }

  // Detect 4-in-a-row captures. Returns Set of cell indices to remove.
  function checkCaptures(b) {
    const captured = new Set();
    for (let i = 0; i < N; i++) {
      if (b[i] === '.') continue;
      const [q, r] = CELLS[i];
      for (const [dq, dr] of DIRS) {
        const pieces = [i];
        for (let k = 1; k < 4; k++) {
          const ni = idx(q + k*dq, r + k*dr);
          if (ni < 0 || b[ni] !== b[i]) break;
          pieces.push(ni);
        }
        if (pieces.length === 4) {
          for (const pi of pieces) captured.add(pi);
          // Opponent pieces at either end are also captured
          const bi = idx(q - dq, r - dr);
          if (bi >= 0 && b[bi] !== '.' && b[bi] !== b[i]) captured.add(bi);
          const ai = idx(q + 4*dq, r + 4*dr);
          if (ai >= 0 && b[ai] !== '.' && b[ai] !== b[i]) captured.add(ai);
        }
      }
    }
    return captured;
  }

  let board, reserves, turn, winner, hoverEdge;

  function newGame() {
    board = new Array(N).fill('.');
    reserves = { B: 12, W: 12 };
    turn = "you";
    winner = null;
    hoverEdge = null;
  }
  newGame();

  // Get all valid push entries for a player
  function getValidPushes(color) {
    const pushes = [];
    if (reserves[color] <= 0) return pushes;
    for (let i = 0; i < N; i++) {
      const [q, r] = CELLS[i];
      if (!isEdge(q, r)) continue;
      const { dir, cells } = getPushLine(q, r);
      if (!dir) continue;
      pushes.push({ idx: i, q, r, dir, cells });
    }
    return pushes;
  }

  function executePush(p) {
    const color = turn === "you" ? 'B' : 'W';
    const line = p.cells;
    // Piece at last cell falls off -> returned to owner's reserve
    const lastCoord = line[line.length - 1];
    const lastIdx = idx(lastCoord[0], lastCoord[1]);
    if (board[lastIdx] !== '.') {
      reserves[board[lastIdx]]++;
    }
    // Shift pieces along the line
    for (let i = line.length - 1; i > 0; i--) {
      const fromI = idx(line[i-1][0], line[i-1][1]);
      const toI = idx(line[i][0], line[i][1]);
      board[toI] = board[fromI];
    }
    // Place new piece at entry
    const entryIdx = idx(p.q, p.r);
    board[entryIdx] = color;
    reserves[color]--;
  }

  function resolveCaptures() {
    const captured = checkCaptures(board);
    if (captured.size > 0) {
      for (const ci of captured) {
        reserves[board[ci]]++;
        board[ci] = '.';
      }
      // Check for chain captures (one round only)
      const chained = checkCaptures(board);
      for (const ci of chained) {
        reserves[board[ci]]++;
        board[ci] = '.';
      }
      return true;
    }
    return false;
  }

  function checkEndgame() {
    const next = turn === "you" ? 'W' : 'B';
    if (reserves[next] <= 0) {
      winner = turn === "you" ? "you" : "ai";
      return true;
    }
    return false;
  }

  function aiMove() {
    if (winner || turn !== "ai") return;
    const pushes = getValidPushes('W');
    if (!pushes.length) {
      winner = "you"; draw(); return;
    }
    if (reserves.W <= 0) { winner = "you"; draw(); return; }

    let best = pushes[0], bestScore = -Infinity;
    for (const p of pushes) {
      const snapB = board.slice();
      const snapR = { B: reserves.B, W: reserves.W };
      const color = 'W';
      const line = p.cells;
      const lastCoord = line[line.length - 1];
      const lastIdx = idx(lastCoord[0], lastCoord[1]);
      if (snapB[lastIdx] !== '.') snapR[snapB[lastIdx]]++;
      for (let i = line.length - 1; i > 0; i--) {
        const fi = idx(line[i-1][0], line[i-1][1]);
        const ti = idx(line[i][0], line[i][1]);
        snapB[ti] = snapB[fi];
      }
      snapB[idx(p.q, p.r)] = color;
      snapR.W--;
      // Resolve captures on clone
      const captured = checkCaptures(snapB);
      for (const ci of captured) { snapR[snapB[ci]]++; snapB[ci] = '.'; }
      const chained = checkCaptures(snapB);
      for (const ci of chained) { snapR[snapB[ci]]++; snapB[ci] = '.'; }
      // Score: net reserve advantage + central placement bonus
      const score = (snapR.W - snapR.B) * 10 - (Math.abs(p.q) + Math.abs(p.r));
      if (score > bestScore) { bestScore = score; best = p; }
    }

    executePush(best);
    resolveCaptures();
    if (checkEndgame()) { draw(); return; }
    turn = "you"; draw();
  }

  // --- Drawing ---

  function hexCenter(q, r) {
    const s = Math.min(W, size) / 14;
    const cx = W/2, cy = 30 + (size - 30)/2;
    const x = cx + (s * 1.5) * q;
    const y = cy + s * Math.sqrt(3) * (r + q/2);
    return { x, y, s };
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

    // Draw hover line first (under board)
    if (hoverEdge && turn === "you" && !winner) {
      const c0 = hexCenter(hoverEdge.q, hoverEdge.r);
      ctx.beginPath();
      for (const [cq, cr] of hoverEdge.cells) {
        const cc = hexCenter(cq, cr);
        if (cq === hoverEdge.q && cr === hoverEdge.r) ctx.moveTo(cc.x, cc.y);
        else ctx.lineTo(cc.x, cc.y);
      }
      ctx.strokeStyle = "rgba(46, 204, 113, 0.35)";
      ctx.lineWidth = 6;
      ctx.stroke();

      // Dot markers along the line
      for (const [cq, cr] of hoverEdge.cells) {
        const cc = hexCenter(cq, cr);
        ctx.beginPath();
        ctx.arc(cc.x, cc.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(46, 204, 113, 0.3)";
        ctx.fill();
      }
    }

    for (let i = 0; i < N; i++) {
      const [q, r] = CELLS[i];
      const c = hexCenter(q, r);
      drawHex(c.x, c.y, c.s);
      const onEdge = isEdge(q, r);
      ctx.fillStyle = onEdge ? "#ede8dc" : "#fff";
      ctx.fill();
      ctx.strokeStyle = onEdge ? "#a99" : "#bbb";
      ctx.lineWidth = onEdge ? 1.5 : 1;
      ctx.stroke();
      ctx.lineWidth = 1;

      if (board[i] !== '.') {
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.s * 0.55, 0, Math.PI * 2);
        ctx.fillStyle = board[i] === 'B' ? "#39c" : "#e60";
        ctx.fill();
        ctx.strokeStyle = board[i] === 'B' ? "#277" : "#844";
        ctx.stroke();
      }
    }

    // Reserve counts
    ctx.font = "bold 12px sans-serif";
    ctx.textAlign = "left";
    ctx.fillStyle = "#39c";
    ctx.fillText("You: " + reserves.B, 8, 18);
    ctx.textAlign = "right";
    ctx.fillStyle = "#e60";
    ctx.fillText("AI: " + reserves.W, W - 8, 18);

    if (winner) {
      statusEl.textContent = winner === "you" ? "You win! AI ran out of pieces!" : "AI wins. You ran out of pieces.";
    } else {
      statusEl.textContent = turn === "you"
        ? (reserves.B > 0 ? "Click an edge cell to push a piece inward" : "No pieces left — you lose!")
        : "AI thinking...";
    }
  }

  // --- Interaction ---

  function pos(e) {
    const r = canvas.getBoundingClientRect();
    return { x: (e.clientX - r.left) * (W / r.width), y: (e.clientY - r.top) * (H / r.height) };
  }

  function onClick(e) {
    if (winner || turn !== "you") return;
    const { x, y } = pos(e);
    for (let i = 0; i < N; i++) {
      const [q, r] = CELLS[i];
      if (!isEdge(q, r)) continue;
      const c = hexCenter(q, r);
      if (Math.hypot(x - c.x, y - c.y) < c.s * 0.85) {
        const { dir, cells } = getPushLine(q, r);
        if (!dir) return;
        if (reserves.B <= 0) { winner = "ai"; draw(); return; }
        executePush({ idx: i, q, r, dir, cells });
        resolveCaptures();
        if (checkEndgame()) { draw(); return; }
        turn = "ai"; draw(); setTimeout(aiMove, 350);
        return;
      }
    }
  }

  function onMove(e) {
    if (turn !== "you" || winner) { hoverEdge = null; draw(); return; }
    const { x, y } = pos(e);
    let found = null;
    for (let i = 0; i < N; i++) {
      const [q, r] = CELLS[i];
      if (!isEdge(q, r)) continue;
      const c = hexCenter(q, r);
      if (Math.hypot(x - c.x, y - c.y) < c.s * 0.85) {
        const { dir, cells } = getPushLine(q, r);
        if (dir) { found = { q, r, cells }; break; }
      }
    }
    if ((found && !hoverEdge) || (!found && hoverEdge) || (found && hoverEdge && (found.q !== hoverEdge.q || found.r !== hoverEdge.r))) {
      hoverEdge = found;
      draw();
    }
  }

  canvas.addEventListener("click", onClick);
  canvas.addEventListener("mousemove", onMove);
  draw();

  return {
    solve() {
      if (winner || turn !== "you") return;
      const pushes = getValidPushes('B');
      if (!pushes.length) { winner = "ai"; draw(); return; }
      const p = pushes[Math.floor(Math.random() * pushes.length)];
      executePush(p);
      resolveCaptures();
      if (checkEndgame()) { draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 80);
    },
    destroy() { canvas.removeEventListener("click", onClick); canvas.removeEventListener("mousemove", onMove); ctx.clearRect(0, 0, W, H); },
    restart() { newGame(); draw(); },
  };
}
