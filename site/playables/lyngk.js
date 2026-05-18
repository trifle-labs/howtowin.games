// LYNGK — simplified stacking game on a side-3 hex board (19 cells). Two players
// alternate placing colored discs on empty cells or existing stacks. When a stack
// reaches height 5, the player with more discs of their color captures it and
// wins immediately (3-2 majority, 4-1, or 5-0). Ties are impossible at odd height.
// AI: heuristic — prioritise winning captures, block opponent's threats.

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = size + 30;
  const W = canvas.width, H = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) { canvas.style.width = W + 'px'; canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr); }
  const statusEl = document.getElementById("playable-status");

  const S = 3;
  const CELLS = [];
  for (let q = -(S-1); q <= S-1; q++) for (let r = -(S-1); r <= S-1; r++) if (Math.abs(q + r) <= S-1) CELLS.push([q, r]);
  const idx = (q, r) => CELLS.findIndex(c => c[0] === q && c[1] === r);

  const MAX_H = 5;

  // stacks[i] = array of 'B' or 'W' (bottom to top)
  // locked[i] = true when stack is complete (height 5)
  let stacks, locked, turn, winner;

  function newGame() {
    stacks = Array.from({ length: CELLS.length }, () => []);
    locked = new Array(CELLS.length).fill(false);
    turn = "you";
    winner = null;
  }
  newGame();

  // Determine capture owner ('B', 'W', or null = tie/deadlock)
  function captureOwner(st) {
    if (st.length < MAX_H) return null;
    const b = st.filter(c => c === 'B').length;
    const w = st.filter(c => c === 'W').length;
    if (b > w) return 'B';
    if (w > b) return 'W';
    return null;
  }

  // Place a disc on a cell. Returns true if game state changed.
  function placeDisc(idx, color) {
    if (locked[idx] || stacks[idx].length >= MAX_H) return false;
    stacks[idx].push(color);
    if (stacks[idx].length === MAX_H) {
      const owner = captureOwner(stacks[idx]);
      if (owner) {
        locked[idx] = true;
        winner = owner === 'B' ? "you" : "ai";
      } else {
        locked[idx] = true; // deadlock at 3-2 (shouldn't happen with odd height, but safety)
      }
    }
    return true;
  }

  function aiMove() {
    if (winner) return;
    const playable = [];
    for (let i = 0; i < CELLS.length; i++) if (!locked[i] && stacks[i].length < MAX_H) playable.push(i);
    if (!playable.length) { draw(); return; }

    // 1. Immediate winning move
    for (const i of playable) {
      stacks[i].push('W');
      if (captureOwner(stacks[i]) === 'W') { locked[i] = true; winner = "ai"; draw(); return; }
      stacks[i].pop();
    }

    // 2. Block opponent's winning move
    for (const i of playable) {
      stacks[i].push('B');
      const wouldLose = captureOwner(stacks[i]) === 'B';
      stacks[i].pop();
      if (!wouldLose) continue;

      // Try to disrupt by placing our disc here
      stacks[i].push('W');
      const after = captureOwner(stacks[i]);
      if (after === 'W') { locked[i] = true; winner = "ai"; draw(); return; }
      if (after === null) { locked[i] = true; draw(); checkEnd(); if (winner) return; const ycm = stacks.some((st, j) => !locked[j] && st.length < MAX_H); if (!ycm) return; turn = "you"; draw(); return; }
      // after === 'B' — opponent still wins at height 5, can't block
      stacks[i].pop(); // undo our placement; opponent wins elsewhere
    }

    // 3. Evaluate each cell heuristically
    let best = playable[0], bestScore = -Infinity;
    for (const i of playable) {
      const wc = stacks[i].filter(c => c === 'W').length;
      const bc = stacks[i].filter(c => c === 'B').length;
      let score = 0;

      // Simulate placing here
      stacks[i].push('W');
      const nWc = stacks[i].filter(c => c === 'W').length;
      const nBc = stacks[i].filter(c => c === 'B').length;
      const remaining = MAX_H - stacks[i].length;

      if (stacks[i].length === MAX_H) {
        const owner = captureOwner(stacks[i]);
        if (owner === 'W') score += 500; // immediate win (shouldn't reach here, but safety)
      }

      // Value the majority position
      if (nWc > nBc) {
        score += 30;
        // Close to capture? If we have majority and only need to survive
        if (remaining === 0) score += 100; // cap at 5 with majority
        else score += (nWc - nBc) * 5; // advantage magnitude
      } else if (nWc === nBc) {
        score += 10; // tied — next placer wins
      } else {
        score -= 5; // behind
      }

      // Disruption value: if opponent is ahead and stack is nearly full
      if (nBc > nWc && remaining === 0 && stacks[i].length === MAX_H) {
        // Our placement made it 3-2, we don't capture but opponent doesn't either
        if (nWc === 2 && nBc === 3) score += 40; // successful disruption
      }

      // If opponent has a strong stack we can disrupt
      if (bc > wc && remaining === 1) score += 20; // opponent close to capture, place to sabotage

      stacks[i].pop();

      // Central cells are more valuable
      const [q, r] = CELLS[i];
      score += 4 - Math.abs(q) - Math.abs(r);

      if (score > bestScore) { bestScore = score; best = i; }
    }

    placeDisc(best, 'W');
    checkEnd();
    if (winner) { draw(); return; }
    const youCanMove = stacks.some((st, j) => !locked[j] && st.length < MAX_H);
    if (!youCanMove) { draw(); return; }
    turn = "you"; draw();
  }

  function checkEnd() {
    if (winner) return;
    const allLocked = locked.every(l => l);
    if (allLocked) {
      // Shouldn't normally reach here since first capture ends the game,
      // but handle deadlock case just in case
      winner = "draw";
    }
  }

  const HR = size / 10;
  function hexCenter(q, r) {
    const cx = W/2, cy = 30 + (size - 30)/2;
    return { x: cx + 1.5 * HR * q, y: cy + Math.sqrt(3) * HR * (r + q/2), r: HR };
  }
  function drawHex(cx, cy, r) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; const px = cx + r * Math.cos(a), py = cy + r * Math.sin(a); if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py); }
    ctx.closePath();
  }

  function draw() {
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);

    for (let i = 0; i < CELLS.length; i++) {
      const [q, r] = CELLS[i]; const c = hexCenter(q, r);
      const st = stacks[i];
      const isFull = st.length >= MAX_H;
      const ownL = isFull ? captureOwner(st) : null;

      drawHex(c.x, c.y, c.r);

      if (isFull) {
        // Render locked stack
        ctx.fillStyle = ownL === 'B' ? "#d4e8f4" : ownL === 'W' ? "#f4e0d0" : "#f0ece5";
        ctx.fill();
        ctx.strokeStyle = ownL === 'B' ? "#39c" : ownL === 'W' ? "#e60" : "#888";
        ctx.lineWidth = 2; ctx.stroke(); ctx.lineWidth = 1;

        // Draw stack discs
        for (let j = 0; j < st.length; j++) {
          const dy = -2 * j;
          ctx.beginPath(); ctx.arc(c.x, c.y + dy, c.r * 0.28, 0, Math.PI * 2);
          ctx.fillStyle = st[j] === 'B' ? "#39c" : "#e60";
          ctx.fill();
          ctx.strokeStyle = "#333"; ctx.stroke();
        }

        // Captured indicator
        ctx.fillStyle = "#333";
        ctx.font = "bold 10px sans-serif";
        ctx.textAlign = "center";
        if (ownL) {
          ctx.fillText("CAPTURED", c.x, c.y + c.r + 8);
        } else if (st.length >= MAX_H) {
          ctx.fillText("DEADLOCK", c.x, c.y + c.r + 8);
        }
      } else {
        // Active stack
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.strokeStyle = "#222"; ctx.stroke();

        // Draw discs
        for (let j = 0; j < st.length; j++) {
          const dy = -1.5 * j;
          ctx.beginPath(); ctx.arc(c.x, c.y + dy, c.r * 0.28, 0, Math.PI * 2);
          ctx.fillStyle = st[j] === 'B' ? "#39c" : "#e60";
          ctx.fill();
          ctx.strokeStyle = "#555"; ctx.stroke();
        }

        // Height label
        if (st.length > 0) {
          ctx.fillStyle = "#444";
          ctx.font = "bold 10px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(String(st.length), c.x, c.y + c.r * 0.25 + 12);
        }
      }
    }

    if (winner) {
      statusEl.textContent = winner === "draw" ? "draw — all stacks locked" : winner === "you" ? "you captured a stack!" : "AI captured a stack";
    } else {
      statusEl.textContent = turn === "you" ? "click a hex to place your disc" : "AI thinking...";
    }
  }

  function pos(e) { const r = canvas.getBoundingClientRect(); return { x: (e.clientX - r.left) * (W / r.width), y: (e.clientY - r.top) * (H / r.height) }; }

  function onClick(e) {
    if (winner || turn !== "you") return;
    const { x, y } = pos(e);
    for (let i = 0; i < CELLS.length; i++) {
      const [q, r] = CELLS[i]; const c = hexCenter(q, r);
      if (Math.hypot(x - c.x, y - c.y) < c.r * 0.6) {
        if (locked[i] || stacks[i].length >= MAX_H) return;
        placeDisc(i, 'B');
        if (winner) { draw(); return; }
        const aiCanMove = stacks.some((st, j) => !locked[j] && st.length < MAX_H);
        if (!aiCanMove) { checkEnd(); draw(); return; }
        turn = "ai"; draw(); setTimeout(aiMove, 350); return;
      }
    }
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve() {
      if (winner || turn !== "you") return;
      const __playable = [];
      for (let i = 0; i < CELLS.length; i++) if (!locked[i] && stacks[i].length < MAX_H) __playable.push(i);
      if (!__playable.length) { checkEnd(); draw(); return; }
      const __i = __playable[Math.floor(Math.random() * __playable.length)];
      placeDisc(__i, 'B');
      if (winner) { draw(); return; }
      const __aiCanMove = stacks.some((st, j) => !locked[j] && st.length < MAX_H);
      if (!__aiCanMove) { checkEnd(); draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 80);
    },
    destroy() { canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart() { newGame(); draw(); },
  };
}
