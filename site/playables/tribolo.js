// Tribolo (Christian Freeling) — Area-capture game on a hex grid. Players place
// stones; when 3 mutually adjacent hexes form a "small triangle" of one colour,
// the completing player scores a point. Simplified to 2-player (you vs AI) on
// a side-4 hex board. Most triangle points wins.
// AI: greedy heuristic — maximise triangle completions; weight own points 1.5x
// over opponent blocking.

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = Math.ceil(size * 1.05);
  const W = canvas.width, H = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) { canvas.style.width = W + 'px'; canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr); }
  const statusEl = document.getElementById("playable-status");

  // Side-4 hex board
  const S = 4;
  const CELLS = [];
  for (let q = -(S-1); q <= S-1; q++) for (let r = -(S-1); r <= S-1; r++) {
    if (Math.abs(q + r) <= S - 1) CELLS.push([q, r]);
  }
  const idx = (q, r) => CELLS.findIndex(c => c[0] === q && c[1] === r);
  const NEI = CELLS.map(([q, r]) => {
    const out = [];
    for (const [dq, dr] of [[1,0],[0,1],[-1,1],[-1,0],[0,-1],[1,-1]]) {
      const i = idx(q + dq, r + dr); if (i >= 0) out.push(i);
    }
    return out;
  });

  // Pre-compute all small triangles (3 mutually adjacent cells)
  const TRIANGLES = [];       // each entry: [i, j, k] sorted
  const CELL_TO_TRIS = CELLS.map(() => []); // map cell -> triangle indices
  const triKeySeen = new Set();
  for (let i = 0; i < CELLS.length; i++) {
    const n = NEI[i];
    for (let j = 0; j < n.length; j++) {
      const a = n[j], b = n[(j + 1) % n.length];
      if (!NEI[a].includes(b)) continue;
      const tri = [i, a, b].sort((x, y) => x - y);
      const key = tri.join(',');
      if (triKeySeen.has(key)) continue;
      triKeySeen.add(key);
      const tIdx = TRIANGLES.length;
      TRIANGLES.push(tri);
      CELL_TO_TRIS[i].push(tIdx);
      CELL_TO_TRIS[a].push(tIdx);
      CELL_TO_TRIS[b].push(tIdx);
    }
  }

  // Hex geometry — pointy-top
  const hexR = size / (2 * Math.sqrt(3) * (S - 1) + 2);
  const drawR = hexR * 0.85;
  const cx = W / 2, cy = H / 2;
  function hexCenter(q, r) {
    return {
      x: cx + hexR * Math.sqrt(3) * (q + r / 2),
      y: cy + hexR * 1.5 * r
    };
  }

  let board, turn, winner, playerScore, aiScore, scoredTriangles;

  function newGame() {
    board = new Array(CELLS.length).fill('.');
    turn = 'you';
    winner = null;
    playerScore = 0;
    aiScore = 0;
    scoredTriangles = new Set();
  }
  newGame();

  function emptyCount() { let n = 0; for (const c of board) if (c === '.') n++; return n; }

  // Count new triangles completed by placing `color` at `cell`
  function newTriangleCount(cell, color) {
    let count = 0;
    for (const tIdx of CELL_TO_TRIS[cell]) {
      if (scoredTriangles.has(tIdx)) continue;
      const [i, j, k] = TRIANGLES[tIdx];
      if (board[i] === color && board[j] === color && board[k] === color) count++;
    }
    return count;
  }

  // Actually score triangles after placing `color` at `cell`
  function scoreTriangles(cell, color) {
    let pts = 0;
    for (const tIdx of CELL_TO_TRIS[cell]) {
      if (scoredTriangles.has(tIdx)) continue;
      const [i, j, k] = TRIANGLES[tIdx];
      if (board[i] === color && board[j] === color && board[k] === color) {
        scoredTriangles.add(tIdx);
        pts++;
      }
    }
    return pts;
  }

  function endGame() {
    if (playerScore > aiScore) winner = 'you';
    else if (aiScore > playerScore) winner = 'ai';
    else winner = 'draw';
  }

  function aiMove() {
    if (winner) return;
    const empties = [];
    for (let i = 0; i < CELLS.length; i++) if (board[i] === '.') empties.push(i);
    if (!empties.length) { endGame(); draw(); return; }

    let best = -1, bestScore = -Infinity;
    for (const i of empties) {
      board[i] = 'W'; const aiPts = newTriangleCount(i, 'W');
      board[i] = 'B'; const plPts = newTriangleCount(i, 'B');
      board[i] = '.';
      const score = aiPts * 1.5 + plPts;
      if (score > bestScore) { bestScore = score; best = i; }
    }

    board[best] = 'W';
    aiScore += scoreTriangles(best, 'W');

    if (emptyCount() === 0) { endGame(); draw(); return; }
    turn = 'you'; draw();
  }

  function drawHex(x, y, r) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = Math.PI / 180 * (60 * i - 30);
      const px = x + r * Math.cos(a), py = y + r * Math.sin(a);
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
  }

  function draw() {
    ctx.fillStyle = '#fafaf7'; ctx.fillRect(0, 0, W, H);

    // Draw hexes
    for (let i = 0; i < CELLS.length; i++) {
      const [q, r] = CELLS[i];
      const p = hexCenter(q, r);
      drawHex(p.x, p.y, drawR);
      if (board[i] === 'B') {
        ctx.fillStyle = '#39c'; ctx.fill();
        ctx.strokeStyle = '#159'; ctx.lineWidth = 1.5; ctx.stroke();
      } else if (board[i] === 'W') {
        ctx.fillStyle = '#e60'; ctx.fill();
        ctx.strokeStyle = '#b40'; ctx.lineWidth = 1.5; ctx.stroke();
      } else {
        ctx.fillStyle = '#fff'; ctx.fill();
        ctx.strokeStyle = '#bbb'; ctx.lineWidth = 1; ctx.stroke();
      }
    }

    // Draw completed triangle indicators
    for (const tIdx of scoredTriangles) {
      const [i, j, k] = TRIANGLES[tIdx];
      const color = board[i];
      if (color !== 'B' && color !== 'W') continue;
      const p1 = hexCenter(CELLS[i][0], CELLS[i][1]);
      const p2 = hexCenter(CELLS[j][0], CELLS[j][1]);
      const p3 = hexCenter(CELLS[k][0], CELLS[k][1]);
      const tcx = (p1.x + p2.x + p3.x) / 3;
      const tcy = (p1.y + p2.y + p3.y) / 3;
      ctx.globalAlpha = color === 'B' ? 0.5 : 0.6;
      ctx.fillStyle = color === 'B' ? '#39c' : '#e60';
      ctx.beginPath();
      ctx.arc(tcx, tcy, 4, 0, Math.PI * 2);
      ctx.fill();
      // Small triangle outline
      ctx.globalAlpha = 0.2;
      ctx.strokeStyle = color === 'B' ? '#39c' : '#e60';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.lineTo(p3.x, p3.y);
      ctx.closePath();
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.lineWidth = 1;

    if (winner) {
      statusEl.textContent = winner === 'draw' ? `Draw! ${playerScore}-${aiScore}` : winner === 'you' ? `You win ${playerScore}-${aiScore}!` : `AI wins ${aiScore}-${playerScore}`;
    } else if (turn === 'you') {
      statusEl.textContent = `Your turn (triangles — you: ${playerScore}, AI: ${aiScore})`;
    } else {
      statusEl.textContent = 'AI thinking…';
    }
  }

  function pos(e) { const r = canvas.getBoundingClientRect(); return { x: (e.clientX - r.left) * (W / r.width), y: (e.clientY - r.top) * (H / r.height) }; }

  function hexAt(mx, my) {
    let best = -1, bestD2 = Infinity;
    for (let i = 0; i < CELLS.length; i++) {
      const [q, r] = CELLS[i];
      const p = hexCenter(q, r);
      const d2 = (mx - p.x) * (mx - p.x) + (my - p.y) * (my - p.y);
      if (d2 < bestD2) { bestD2 = d2; best = i; }
    }
    return bestD2 <= drawR * drawR ? best : -1;
  }

  function onClick(e) {
    if (winner || turn !== 'you') return;
    const { x, y } = pos(e);
    const i = hexAt(x, y);
    if (i < 0 || board[i] !== '.') return;

    board[i] = 'B';
    playerScore += scoreTriangles(i, 'B');

    if (emptyCount() === 0) { endGame(); draw(); return; }
    turn = 'ai'; draw();
    setTimeout(aiMove, 350);
  }

  canvas.addEventListener('click', onClick);
  draw();

  return {
    solve() {
      if (winner || turn !== 'you') return;
      const empties = [];
      for (let i = 0; i < CELLS.length; i++) if (board[i] === '.') empties.push(i);
      if (!empties.length) { endGame(); draw(); return; }

      // Pick the cell that gives the most triangles (greedy for player)
      let best = empties[0], bestPts = -1;
      for (const i of empties) {
        board[i] = 'B';
        const pts = newTriangleCount(i, 'B');
        board[i] = '.';
        if (pts > bestPts) { bestPts = pts; best = i; }
      }
      board[best] = 'B';
      playerScore += scoreTriangles(best, 'B');

      if (emptyCount() === 0) { endGame(); draw(); return; }
      turn = 'ai'; draw();
      setTimeout(aiMove, 80);
    },
    destroy() { canvas.removeEventListener('click', onClick); ctx.clearRect(0, 0, W, H); },
    restart() { newGame(); draw(); }
  };
}
