// PUNCT — connection game on a side-4 hex board (37 cells). Two players place
// pieces of 3 shapes: circle (standard, unlimited), triangle (limited supply 5),
// square (limited supply 3, blocks 6 adjacent cells for opponent).
// Win by forming a contiguous chain of your pieces from the top edge (r=-3)
// to the bottom edge (r=3).
// AI: heuristic — shortest-path analysis, advancing own connection and blocking
// opponent. Keyboard C/T/S cycles selected shape; click shape-selector also works.

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 420);
  canvas.width = size;
  canvas.height = size + 30;
  const W = canvas.width, H = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) { canvas.style.width = W + 'px'; canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr); }
  const statusEl = document.getElementById("playable-status");

  const S = 4;
  const CELLS = [];
  for (let q = -(S-1); q <= S-1; q++) for (let r = -(S-1); r <= S-1; r++) if (Math.abs(q + r) <= S-1) CELLS.push([q, r]);
  const idx = (q, r) => CELLS.findIndex(c => c[0] === q && c[1] === r);
  const NEI = CELLS.map(([q, r]) => {
    const out = [];
    for (const [dq, dr] of [[1,0],[-1,0],[0,1],[0,-1],[1,-1],[-1,1]]) { const i = idx(q+dq, r+dr); if (i >= 0) out.push(i); }
    return out;
  });

  // board[i] = 'B' (you), 'W' (AI), '.' (empty)
  // shapes[i] = 'C', 'T', 'S', or '.'
  // A cell is "blocked for you" when an AI square is adjacent; vice versa.
  let board, shapes, blockedForYou, blockedForAI, remaining, currentShape;
  let turn, winner;

  function newGame() {
    board = new Array(CELLS.length).fill('.');
    shapes = new Array(CELLS.length).fill('.');
    blockedForYou = new Array(CELLS.length).fill(false);
    blockedForAI = new Array(CELLS.length).fill(false);
    remaining = { you: { C: 10, T: 5, S: 3 }, ai: { C: 10, T: 5, S: 3 } };
    currentShape = 'C';
    turn = "you";
    winner = null;
  }
  newGame();

  // Connection check: chain from top edge (r=-(S-1)) to bottom edge (r=S-1)
  function checkWin(b, sh, player) {
    const ch = player === "you" ? 'B' : 'W';
    const seen = new Array(b.length).fill(false);
    const stack = [];
    for (let i = 0; i < b.length; i++) {
      const [q, r] = CELLS[i];
      if (r === -(S-1) && b[i] === ch) { stack.push(i); seen[i] = true; }
    }
    while (stack.length) {
      const i = stack.pop();
      const [q, r] = CELLS[i];
      if (r === S-1) return true;
      for (const n of NEI[i]) if (!seen[n] && b[n] === ch) { seen[n] = true; stack.push(n); }
    }
    return false;
  }

  // Shortest path cost: min number of empty cells the player would need to fill
  // to connect the top edge to the bottom edge. Returns Infinity if impossible.
  function shortestPath(b, sh, player) {
    const ch = player === "you" ? 'B' : 'W';
    const opp = player === "you" ? 'W' : 'B';
    const dist = new Array(b.length).fill(Infinity);
    const queue = [];
    for (let i = 0; i < b.length; i++) {
      const [q, r] = CELLS[i];
      if (r === -(S-1) && b[i] !== opp) {
        dist[i] = b[i] === '.' ? 1 : 0;
        queue.push(i);
      }
    }
    let head = 0;
    while (head < queue.length) {
      const i = queue[head++];
      if (dist[i] === Infinity) continue;
      const [q, r] = CELLS[i];
      if (r === S-1) return dist[i];
      for (const n of NEI[i]) {
        if (b[n] === opp) continue;
        const nd = dist[i] + (b[n] === '.' ? 1 : 0);
        if (nd < dist[n]) { dist[n] = nd; queue.push(n); }
      }
    }
    return Infinity;
  }

  function isCellBlocked(idx, forPlayer) {
    if (forPlayer === "you") return blockedForYou[idx];
    return blockedForAI[idx];
  }

  function getLegalMoves(player) {
    const moves = [];
    for (let i = 0; i < CELLS.length; i++) {
      if (board[i] !== '.') continue;
      if (isCellBlocked(i, player)) continue;
      for (const shape of ['C', 'T', 'S']) {
        if (remaining[player][shape] > 0) moves.push({ idx: i, shape });
      }
    }
    return moves;
  }

  // Apply the blocking side-effect of placing a square
  function applySquareBlock(idx, player) {
    if (shapes[idx] !== 'S') return;
    const blockTgt = player === "you" ? blockedForAI : blockedForYou;
    const [q, r] = CELLS[idx];
    for (const [dq, dr] of [[1,0],[-1,0],[0,1],[0,-1],[1,-1],[-1,1]]) {
      const ni = idx(q + dq, r + dr);
      if (ni >= 0) blockTgt[ni] = true;
    }
  }

  // Attempt placing a piece. Returns true if move succeeded.
  function doPlace(mv, player) {
    const ch = player === "you" ? 'B' : 'W';
    if (board[mv.idx] !== '.') return false;
    if (isCellBlocked(mv.idx, player)) return false;
    if (remaining[player][mv.shape] <= 0) return false;
    board[mv.idx] = ch;
    shapes[mv.idx] = mv.shape;
    remaining[player][mv.shape]--;
    if (mv.shape === 'S') applySquareBlock(mv.idx, player);
    return true;
  }

  function aiMove() {
    if (winner) return;
    const moves = getLegalMoves("ai");
    if (!moves.length) { winner = "you"; draw(); return; }

    // Immediate win
    for (const mv of moves) {
      doPlace(mv, "ai");
      if (checkWin(board, shapes, "ai")) { winner = "ai"; draw(); return; }
      // Undo
      board[mv.idx] = '.'; shapes[mv.idx] = '.'; remaining.ai[mv.shape]++;
      if (mv.shape === 'S') { /* would need to undo block — just skip block undo for now, recompute */
        blockedForYou = new Array(CELLS.length).fill(false);
        for (let j = 0; j < CELLS.length; j++) if (shapes[j] === 'S' && board[j] === 'W') applySquareBlock(j, "ai");
      }
    }

    // Block opponent win
    for (const mv of moves) {
      board[mv.idx] = 'B'; shapes[mv.idx] = mv.shape;
      if (checkWin(board, shapes, "you")) {
        board[mv.idx] = '.'; shapes[mv.idx] = '.'; // undo simulate
        doPlace(mv, "ai");
        if (checkWin(board, shapes, "ai")) { winner = "ai"; draw(); return; }
        turn = "you"; draw(); return;
      }
      board[mv.idx] = '.'; shapes[mv.idx] = '.';
    }

    const baseMyDist = shortestPath(board, shapes, "ai");
    const baseOppDist = shortestPath(board, shapes, "you");

    let best = moves[0], bestScore = -Infinity;
    for (const mv of moves) {
      // Simulate AI placing
      board[mv.idx] = 'W'; shapes[mv.idx] = mv.shape;
      const newMyDist = shortestPath(board, shapes, "ai");
      board[mv.idx] = '.'; shapes[mv.idx] = '.';

      // Simulate opponent placing here
      board[mv.idx] = 'B'; shapes[mv.idx] = mv.shape;
      const newOppDist = shortestPath(board, shapes, "you");
      board[mv.idx] = '.'; shapes[mv.idx] = '.';

      let score = 0;
      if (newMyDist < baseMyDist) score += (baseMyDist - newMyDist) * 3;
      if (newOppDist < baseOppDist) score += (baseOppDist - newOppDist) * 2;
      if (mv.shape === 'S') score += 3;
      // Central cells are more strategic
      const [q, r] = CELLS[mv.idx];
      score += 3 - Math.abs(q) - Math.abs(r);
      if (score > bestScore) { bestScore = score; best = mv; }
    }

    doPlace(best, "ai");
    if (checkWin(board, shapes, "ai")) { winner = "ai"; draw(); return; }
    if (!getLegalMoves("you").length) { winner = "ai"; draw(); return; }
    turn = "you"; draw();
  }

  const HR = size / 14;
  function hexCenter(q, r) {
    const cx = W/2, cy = 30 + (size - 30)/2;
    return { x: cx + 1.5 * HR * q, y: cy + Math.sqrt(3) * HR * (r + q/2), r: HR };
  }
  function drawHex(cx, cy, r) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; const px = cx + r * Math.cos(a), py = cy + r * Math.sin(a); if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py); }
    ctx.closePath();
  }

  function drawShapeIcon(cx, cy, rr, shape, color) {
    ctx.fillStyle = color;
    if (shape === 'C') { ctx.beginPath(); ctx.arc(cx, cy, rr * 0.35, 0, Math.PI * 2); ctx.fill(); }
    else if (shape === 'T') {
      ctx.beginPath();
      for (let i = 0; i < 3; i++) { const a = -Math.PI/2 + i * 2*Math.PI/3; const px = cx + rr * 0.35 * Math.cos(a), py = cy + rr * 0.35 * Math.sin(a); if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py); }
      ctx.closePath(); ctx.fill();
    }
    else if (shape === 'S') { ctx.fillRect(cx - rr*0.3, cy - rr*0.3, rr*0.6, rr*0.6); }
  }

  function draw() {
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);

    // Edge labels
    ctx.font = "bold 9px sans-serif"; ctx.textAlign = "center";
    ctx.fillStyle = "#666";
    ctx.textBaseline = "top"; ctx.fillText("TOP", W/2, 6);

    // Board cells
    for (let i = 0; i < CELLS.length; i++) {
      const [q, r] = CELLS[i]; const c = hexCenter(q, r);
      const blockedForCurrent = turn === "you" ? blockedForYou[i] : blockedForAI[i];

      drawHex(c.x, c.y, c.r);
      if (board[i] === '.' && blockedForCurrent) {
        ctx.fillStyle = "#e8e0d8"; ctx.fill(); ctx.strokeStyle = "#999"; ctx.stroke();
        ctx.fillStyle = "#999"; ctx.font = "12px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText("X", c.x, c.y);
        continue;
      }
      ctx.fillStyle = board[i] === 'B' ? "#39c" : board[i] === 'W' ? "#e60" : "#fff";
      ctx.fill();
      ctx.strokeStyle = "#222"; ctx.stroke();

      if (board[i] !== '.') {
        drawShapeIcon(c.x, c.y, c.r, shapes[i], "#fff");
      }
    }

    ctx.textBaseline = "bottom"; ctx.fillStyle = "#666";
    ctx.font = "bold 9px sans-serif"; ctx.textAlign = "center";
    ctx.fillText("BOTTOM", W/2, H - 2);

    // Shape selector at bottom
    const shapesList = ['C', 'T', 'S'];
    const shapeNames = ['Circle', 'Triangle', 'Square'];
    const selectorY = H - 34;
    ctx.font = "10px sans-serif";

    for (let si = 0; si < 3; si++) {
      const sx = W/2 + (si - 1) * 90;
      const count = remaining.you[shapesList[si]];
      const isSelected = currentShape === shapesList[si];
      const canUse = count > 0 && turn === "you" && !winner;

      // Border ring
      ctx.strokeStyle = isSelected ? "#39c" : canUse ? "#888" : "#ccc";
      ctx.lineWidth = isSelected ? 2.5 : 1;
      const bw = 24, bh = 16;
      ctx.strokeRect(sx - bw/2, selectorY - bh/2, bw, bh);

      // Shape icon inside
      ctx.fillStyle = canUse ? "#222" : "#bbb";
      if (shapesList[si] === 'C') { ctx.beginPath(); ctx.arc(sx, selectorY, 5, 0, Math.PI*2); ctx.fill(); }
      else if (shapesList[si] === 'T') {
        ctx.beginPath();
        for (let j = 0; j < 3; j++) { const a = -Math.PI/2 + j*2*Math.PI/3; const px = sx + 6*Math.cos(a), py = selectorY + 6*Math.sin(a); if (j===0) ctx.moveTo(px,py); else ctx.lineTo(px,py); }
        ctx.closePath(); ctx.fill();
      }
      else { ctx.fillRect(sx - 5, selectorY - 5, 10, 10); }

      ctx.lineWidth = 1;
      ctx.textAlign = "center"; ctx.textBaseline = "top";
      ctx.fillStyle = canUse ? "#222" : "#999";
      ctx.fillText(`${shapeNames[si]} (${count})`, sx, selectorY + bh/2 + 4);
    }

    if (winner) {
      const text = winner === "draw" ? "draw" : winner === "you" ? "you connected top to bottom!" : "AI connected";
      statusEl.textContent = text;
    } else {
      const shapeName = { C: 'Circle', T: 'Triangle', S: 'Square' }[currentShape];
      const ct = remaining.you[currentShape];
      statusEl.textContent = `selected: ${shapeName} (${ct}). Click selector or press C/T/S, then click hex`;
    }
  }

  function pos(e) { const r = canvas.getBoundingClientRect(); return { x: (e.clientX - r.left) * (W / r.width), y: (e.clientY - r.top) * (H / r.height) }; }

  function onClick(e) {
    if (winner || turn !== "you") return;
    const { x, y } = pos(e);

    // Check shape selector clicks
    const shapesList = ['C', 'T', 'S'];
    const selectorY = H - 34;
    for (let si = 0; si < 3; si++) {
      const sx = W/2 + (si - 1) * 90;
      if (Math.abs(x - sx) < 18 && Math.abs(y - selectorY) < 14) {
        if (remaining.you[shapesList[si]] > 0) currentShape = shapesList[si];
        draw(); return;
      }
    }

    // Check cell clicks
    if (remaining.you[currentShape] <= 0) { statusEl.textContent = "no more of that shape!"; draw(); return; }
    for (let i = 0; i < CELLS.length; i++) {
      const [q, r] = CELLS[i]; const c = hexCenter(q, r);
      if (Math.hypot(x - c.x, y - c.y) < c.r * 0.6) {
        if (board[i] !== '.') return;
        if (blockedForYou[i]) { statusEl.textContent = "that cell is blocked!"; draw(); return; }
        const mv = { idx: i, shape: currentShape };
        doPlace(mv, "you");
        if (checkWin(board, shapes, "you")) { winner = "you"; draw(); return; }
        if (!getLegalMoves("ai").length) { winner = "you"; draw(); return; }
        turn = "ai"; draw(); setTimeout(aiMove, 350); return;
      }
    }
  }

  function onKeyDown(e) {
    const key = e.key.toUpperCase();
    if (!winner && turn === "you" && (key === 'C' || key === 'T' || key === 'S')) {
      if (remaining.you[key] > 0) { currentShape = key; draw(); }
    }
  }

  canvas.addEventListener("click", onClick);
  window.addEventListener("keydown", onKeyDown);
  draw();
  return {
    solve() {
      if (winner || turn !== "you") return;
      const __moves = getLegalMoves("you");
      if (!__moves.length) { winner = "ai"; draw(); return; }
      const __mv = __moves[Math.floor(Math.random() * __moves.length)];
      doPlace(__mv, "you");
      if (checkWin(board, shapes, "you")) { winner = "you"; draw(); return; }
      if (!getLegalMoves("ai").length) { winner = "you"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 80);
    },
    destroy() { canvas.removeEventListener("click", onClick); window.removeEventListener("keydown", onKeyDown); ctx.clearRect(0, 0, W, H); },
    restart() { newGame(); draw(); },
  };
}
