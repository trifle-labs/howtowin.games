// Volo (Nick Bentley) — Flock-formation game on a hex grid. Each player places
// 2 stones per turn, trying to form the largest connected flock. Simplified:
// side-3 hex board, placement only (no group movement). Largest connected group
// wins; ties broken by total stones on the board.
// AI: greedy heuristic — maximise own flock growth + block opponent growth.

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = size;
  const W = canvas.width, H = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) { canvas.style.width = W + 'px'; canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr); }
  const statusEl = document.getElementById("playable-status");

  const S = 3; // side-3 hex board
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

  // Hex geometry — pointy-top orientation
  const hexR = size / (2 * Math.sqrt(3) * (S - 1) + 2);
  const drawR = hexR * 0.85;
  const cx = W / 2, cy = H / 2;
  function hexCenter(q, r) {
    return {
      x: cx + hexR * Math.sqrt(3) * (q + r / 2),
      y: cy + hexR * 1.5 * r
    };
  }

  let board, turn, winner, placeCount;
  // Player = 'B' (blue), AI = 'W' (orange)
  function newGame() {
    board = new Array(CELLS.length).fill('.');
    turn = 'you';
    winner = null;
    placeCount = 0;
  }
  newGame();

  function largestGroup(color) {
    const seen = new Array(CELLS.length).fill(false);
    let maxSize = 0;
    for (let i = 0; i < CELLS.length; i++) {
      if (board[i] !== color || seen[i]) continue;
      const stack = [i]; seen[i] = true;
      let count = 0;
      while (stack.length) {
        const x = stack.pop();
        count++;
        for (const n of NEI[x]) {
          if (!seen[n] && board[n] === color) { seen[n] = true; stack.push(n); }
        }
      }
      if (count > maxSize) maxSize = count;
    }
    return maxSize;
  }

  function totalStones(color) { let n = 0; for (const c of board) if (c === color) n++; return n; }
  function emptyCount() { let n = 0; for (const c of board) if (c === '.') n++; return n; }

  function endGame() {
    const myG = largestGroup('B'), aiG = largestGroup('W');
    if (myG > aiG) winner = 'you';
    else if (aiG > myG) winner = 'ai';
    else {
      const myT = totalStones('B'), aiT = totalStones('W');
      if (myT > aiT) winner = 'you';
      else if (aiT > myT) winner = 'ai';
      else winner = 'draw';
    }
  }

  function aiMove() {
    if (winner) return;
    const toPlace = Math.min(2, emptyCount());
    if (toPlace === 0) { endGame(); draw(); return; }
    for (let p = 0; p < toPlace; p++) {
      let best = -1, bestScore = -Infinity;
      for (let i = 0; i < CELLS.length; i++) {
        if (board[i] !== '.') continue;
        board[i] = 'W'; const aiSz = largestGroup('W');
        board[i] = 'B'; const plSz = largestGroup('B');
        board[i] = '.';
        const score = aiSz + plSz * 0.5;
        if (score > bestScore) { bestScore = score; best = i; }
      }
      if (best >= 0) board[best] = 'W';
    }
    if (emptyCount() === 0) { endGame(); draw(); return; }
    turn = 'you'; placeCount = 0; draw();
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

    if (winner) {
      const gU = largestGroup('B'), gAI = largestGroup('W');
      statusEl.textContent = winner === 'draw' ? 'Draw!' : winner === 'you' ? `You win! (group ${gU} vs ${gAI})` : `AI wins (group ${gAI} vs ${gU})`;
    } else if (turn === 'you') {
      if (placeCount === 0) statusEl.textContent = `Your turn: click first hex (groups — you: ${largestGroup('B')}, AI: ${largestGroup('W')})`;
      else statusEl.textContent = `Place stone 2/2 — click another empty hex`;
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
    placeCount++;
    if (emptyCount() === 0) { endGame(); draw(); return; }
    if (placeCount >= 2) {
      placeCount = 0;
      turn = 'ai'; draw();
      setTimeout(aiMove, 350);
    } else {
      draw();
    }
  }

  canvas.addEventListener('click', onClick);
  draw();

  return {
    solve() {
      if (winner || turn !== 'you') return;
      const empties = [];
      for (let i = 0; i < CELLS.length; i++) if (board[i] === '.') empties.push(i);
      if (!empties.length) { endGame(); draw(); return; }
      board[empties[Math.floor(Math.random() * empties.length)]] = 'B';
      placeCount++;
      if (placeCount >= 2 || emptyCount() === 0) {
        if (emptyCount() === 0) { endGame(); draw(); return; }
        placeCount = 0;
        turn = 'ai'; draw();
        setTimeout(aiMove, 80);
      } else {
        draw();
      }
    },
    destroy() { canvas.removeEventListener('click', onClick); ctx.clearRect(0, 0, W, H); },
    restart() { newGame(); draw(); }
  };
}
