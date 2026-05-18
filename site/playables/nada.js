// Nada! — Dice matching game. Single-player version:
// 6 white dice on the left and 6 orange dice on the right.
// Click matching symbols to collect pairs; click "Nada!" when no match remains.
// 3 rounds, collect as many dice as possible.
// AI: random dice rolls; player plays solo for score.
// solve() gives a hint by highlighting a valid matching pair.

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

  // ---------------------------------------------------------------------------
  // Layout constants
  // ---------------------------------------------------------------------------
  const dieSize = 52;
  const dieGap = 8;
  const diceGridCols = 2;
  const diceGridRows = 3;
  const diceGroupW = diceGridCols * dieSize + (diceGridCols - 1) * dieGap; // 112

  // Center each group in its half of the canvas
  const leftSectionX  = (size / 2 - diceGroupW) / 2;
  const rightSectionX = size / 2 + (size / 2 - diceGroupW) / 2;

  const diceTopY = 48;
  const colW = dieSize + dieGap;  // 60
  const rowH = dieSize + dieGap;  // 60

  const btnW = 100, btnH = 34;
  const btnX = (size - btnW) / 2;
  const btnY = diceTopY + diceGridRows * rowH - dieGap + 16;

  // ---------------------------------------------------------------------------
  // Symbol definitions (0-5)
  // ---------------------------------------------------------------------------
  function drawSymbol(cx, cy, r, sym) {
    ctx.fillStyle = '#222';
    switch (sym) {
      case 0: // star (5-pointed)
        ctx.beginPath();
        for (let k = 0; k < 5; k++) {
          const oa = (k * 4 * Math.PI) / 5 - Math.PI / 2;
          const ia = oa + (2 * Math.PI) / 10;
          const ox = cx + r * 0.42 * Math.cos(oa);
          const oy = cy + r * 0.42 * Math.sin(oa);
          const ix = cx + r * 0.18 * Math.cos(ia);
          const iy = cy + r * 0.18 * Math.sin(ia);
          if (k === 0) ctx.moveTo(ox, oy); else ctx.lineTo(ox, oy);
          ctx.lineTo(ix, iy);
        }
        ctx.closePath(); ctx.fill(); break;

      case 1: // circle
        ctx.beginPath();
        ctx.arc(cx, cy, r * 0.35, 0, Math.PI * 2);
        ctx.fill(); break;

      case 2: // square
        const s2 = r * 0.32;
        ctx.fillRect(cx - s2, cy - s2, s2 * 2, s2 * 2); break;

      case 3: // triangle
        ctx.beginPath();
        ctx.moveTo(cx, cy - r * 0.36);
        ctx.lineTo(cx + r * 0.36, cy + r * 0.28);
        ctx.lineTo(cx - r * 0.36, cy + r * 0.28);
        ctx.closePath(); ctx.fill(); break;

      case 4: // cross (plus sign)
        const cw = r * 0.14, cl = r * 0.38;
        ctx.fillRect(cx - cw, cy - cl, cw * 2, cl * 2);
        ctx.fillRect(cx - cl, cy - cw, cl * 2, cw * 2); break;

      case 5: // heart
        ctx.beginPath();
        const h = r * 0.38;
        ctx.moveTo(cx, cy + h * 0.4);
        ctx.bezierCurveTo(cx, cy + h * 0.75, cx - h, cy + h * 0.15, cx, cy - h * 0.25);
        ctx.bezierCurveTo(cx + h, cy + h * 0.15, cx, cy + h * 0.75, cx, cy + h * 0.4);
        ctx.fill(); break;
    }
  }

  // ---------------------------------------------------------------------------
  // Game state
  // ---------------------------------------------------------------------------
  let whiteDice, orangeDice;
  let whiteCollected, orangeCollected;
  let selectedWhite = -1;
  let selectedOrange = -1;
  let round = 0;
  let scoreTotal = 0;
  let scoreThisRound = 0;
  let gameOver = false;
  let message = null;
  let messageTimer = null;
  let hintPair = null;          // { w, o } from solve()

  function rollDie() { return Math.floor(Math.random() * 6); }

  function hasMatch() {
    for (let wi = 0; wi < 6; wi++) {
      if (whiteCollected[wi]) continue;
      for (let oi = 0; oi < 6; oi++) {
        if (orangeCollected[oi]) continue;
        if (whiteDice[wi] === orangeDice[oi]) return true;
      }
    }
    return false;
  }

  function allCollected() {
    for (let i = 0; i < 6; i++) if (!whiteCollected[i]) return false;
    for (let i = 0; i < 6; i++) if (!orangeCollected[i]) return false;
    return true;
  }

  function showMessage(msg, duration) {
    message = msg;
    if (messageTimer) clearTimeout(messageTimer);
    messageTimer = setTimeout(() => {
      message = null;
      hintPair = null;
      draw();
    }, duration || 1500);
    draw();
  }

  function nextRound() {
    if (round >= 3) {
      gameOver = true;
      draw();
      return;
    }
    round++;
    whiteDice = [];
    orangeDice = [];
    for (let i = 0; i < 6; i++) {
      whiteDice.push(rollDie());
      orangeDice.push(rollDie());
    }
    whiteCollected = new Array(6).fill(false);
    orangeCollected = new Array(6).fill(false);
    selectedWhite = -1;
    selectedOrange = -1;
    scoreThisRound = 0;
    message = null;
    hintPair = null;
    draw();
  }

  function newGame() {
    round = 0;
    gameOver = false;
    scoreTotal = 0;
    scoreThisRound = 0;
    nextRound();
  }

  function callNada() {
    if (gameOver) return;
    if (hasMatch()) {
      showMessage('There are matches — keep looking!');
      return;
    }
    let collected = 0;
    for (let i = 0; i < 6; i++) {
      if (!whiteCollected[i]) { whiteCollected[i] = true; collected++; }
      if (!orangeCollected[i]) { orangeCollected[i] = true; collected++; }
    }
    scoreThisRound += collected;
    scoreTotal += collected;
    showMessage('Nada! +' + collected);
    setTimeout(() => {
      if (!gameOver) nextRound();
    }, 1000);
  }

  // ---------------------------------------------------------------------------
  // Die hit-test / position helper
  // ---------------------------------------------------------------------------
  function diePosition(side, index) {
    const col = index % diceGridCols;
    const row = Math.floor(index / diceGridCols);
    const xStart = side === 'white' ? leftSectionX : rightSectionX;
    return { x: xStart + col * colW, y: diceTopY + row * rowH };
  }

  // ---------------------------------------------------------------------------
  // Drawing
  // ---------------------------------------------------------------------------
  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
  }

  function draw() {
    ctx.fillStyle = '#fafaf7';
    ctx.fillRect(0, 0, W, H);

    // ---- Header ----
    ctx.fillStyle = '#333';
    ctx.font = 'bold 15px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    if (gameOver) {
      ctx.fillText('Game Over!', size / 2, 8);
    } else {
      ctx.fillText('Round ' + round + ' / 3', size / 2, 8);
    }

    // ---- Column labels ----
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#888';
    const labelCenterX  = leftSectionX  + (diceGroupW) / 2;
    const labelCenterY  = rightSectionX + (diceGroupW) / 2;
    ctx.fillText('White Dice', labelCenterX, diceTopY - 18);
    ctx.fillText('Orange Dice', labelCenterY, diceTopY - 18);

    // ---- White dice (left) ----
    for (let i = 0; i < 6; i++) {
      const { x, y } = diePosition('white', i);
      const collected = whiteCollected[i];
      const selected = i === selectedWhite;
      const hinted = hintPair && hintPair.w === i;

      ctx.fillStyle = collected ? '#e0e0e0' : (selected ? '#c8e6ff' : (hinted ? '#e8ffe8' : '#fff'));
      ctx.fillRect(x, y, dieSize, dieSize);
      ctx.strokeStyle = hinted ? '#090' : (selected ? '#39c' : (collected ? '#ccc' : '#888'));
      ctx.lineWidth = (selected || hinted) ? 3 : 1.5;
      ctx.strokeRect(x, y, dieSize, dieSize);

      if (!collected) {
        drawSymbol(x + dieSize / 2, y + dieSize / 2, dieSize / 2, whiteDice[i]);
      } else {
        ctx.fillStyle = '#bbb';
        ctx.font = '20px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('✓', x + dieSize / 2, y + dieSize / 2);
      }
    }

    // ---- Orange dice (right) ----
    for (let i = 0; i < 6; i++) {
      const { x, y } = diePosition('orange', i);
      const collected = orangeCollected[i];
      const selected = i === selectedOrange;
      const hinted = hintPair && hintPair.o === i;

      ctx.fillStyle = collected ? '#f5e6d0' : (selected ? '#fff0c8' : (hinted ? '#ffe8e8' : '#fff3e0'));
      ctx.fillRect(x, y, dieSize, dieSize);
      ctx.strokeStyle = hinted ? '#090' : (selected ? '#e60' : (collected ? '#dcc' : '#c90'));
      ctx.lineWidth = (selected || hinted) ? 3 : 1.5;
      ctx.strokeRect(x, y, dieSize, dieSize);

      if (!collected) {
        drawSymbol(x + dieSize / 2, y + dieSize / 2, dieSize / 2, orangeDice[i]);
      } else {
        ctx.fillStyle = '#ba9';
        ctx.font = '20px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('✓', x + dieSize / 2, y + dieSize / 2);
      }
    }

    // ---- Nada! button ----
    const btnDisabled = gameOver;
    ctx.fillStyle = btnDisabled ? '#bbb' : '#c33';
    roundRect(btnX, btnY, btnW, btnH, 8);
    ctx.fill();
    if (!btnDisabled) {
      ctx.strokeStyle = '#a22';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Nada!', btnX + btnW / 2, btnY + btnH / 2);

    // ---- Message (transient feedback) ----
    if (message) {
      ctx.fillStyle = '#c33';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(message, size / 2, btnY + btnH + 10);
    }

    // ---- Score ----
    const scoreY = message ? btnY + btnH + 30 : btnY + btnH + 10;
    ctx.fillStyle = '#333';
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('This round: ' + scoreThisRound + ' / 12  |  Total: ' + scoreTotal, size / 2, scoreY);

    // ---- Status bar ----
    if (gameOver) {
      statusEl.textContent = 'Game over! Total dice collected: ' + scoreTotal + ' / 36';
    } else {
      statusEl.textContent = 'Round ' + round + '/3 — click a die, then its match on the other side. Click "Nada!" when no matches remain.';
    }
  }

  // ---------------------------------------------------------------------------
  // Click handling
  // ---------------------------------------------------------------------------
  function getClickPos(e) {
    const r = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - r.left) * (W / r.width),
      y: (e.clientY - r.top) * (H / r.height)
    };
  }

  function findDie(x, y) {
    for (let i = 0; i < 6; i++) {
      const p = diePosition('white', i);
      if (x >= p.x && x <= p.x + dieSize && y >= p.y && y <= p.y + dieSize) {
        return { side: 'white', index: i };
      }
    }
    for (let i = 0; i < 6; i++) {
      const p = diePosition('orange', i);
      if (x >= p.x && x <= p.x + dieSize && y >= p.y && y <= p.y + dieSize) {
        return { side: 'orange', index: i };
      }
    }
    return null;
  }

  function tryMatch(whiteIdx, orangeIdx) {
    whiteCollected[whiteIdx] = true;
    orangeCollected[orangeIdx] = true;
    scoreThisRound += 2;
    scoreTotal += 2;
    selectedWhite = -1;
    selectedOrange = -1;
    hintPair = null;
    draw();
    if (allCollected()) {
      showMessage('All collected!');
      setTimeout(() => { if (!gameOver) nextRound(); }, 800);
    } else if (!hasMatch()) {
      showMessage('No more matches — click Nada!');
    }
  }

  function onClick(e) {
    if (gameOver) return;
    hintPair = null;
    const { x, y } = getClickPos(e);

    // Nada! button
    if (x >= btnX && x <= btnX + btnW && y >= btnY && y <= btnY + btnH) {
      callNada();
      return;
    }

    const hit = findDie(x, y);
    if (!hit) {
      // Click elsewhere — clear selection
      selectedWhite = -1;
      selectedOrange = -1;
      draw();
      return;
    }

    if (hit.side === 'white') {
      if (whiteCollected[hit.index]) return;
      // If an orange die is already selected, check for a match
      if (selectedOrange >= 0 && whiteDice[hit.index] === orangeDice[selectedOrange]) {
        tryMatch(hit.index, selectedOrange);
        return;
      }
      // Otherwise select this white die
      selectedWhite = hit.index;
      selectedOrange = -1;
      draw();
    } else {
      if (orangeCollected[hit.index]) return;
      // If a white die is already selected, check for a match
      if (selectedWhite >= 0 && orangeDice[hit.index] === whiteDice[selectedWhite]) {
        tryMatch(selectedWhite, hit.index);
        return;
      }
      // Otherwise select this orange die
      selectedOrange = hit.index;
      selectedWhite = -1;
      draw();
    }
  }

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------
  canvas.addEventListener('click', onClick);
  newGame();

  return {
    solve() {
      if (gameOver) return;

      // Clear prior hint / selection
      hintPair = null;
      selectedWhite = -1;
      selectedOrange = -1;

      // Find a valid matching pair and highlight it
      for (let wi = 0; wi < 6; wi++) {
        if (whiteCollected[wi]) continue;
        for (let oi = 0; oi < 6; oi++) {
          if (orangeCollected[oi]) continue;
          if (whiteDice[wi] === orangeDice[oi]) {
            hintPair = { w: wi, o: oi };
            draw();
            showMessage('Hint: match found!', 2000);
            return;
          }
        }
      }

      // No match — suggest Nada
      if (!gameOver) {
        showMessage('No matches — click Nada!', 2000);
      }
    },

    destroy() {
      canvas.removeEventListener('click', onClick);
      if (messageTimer) clearTimeout(messageTimer);
      ctx.clearRect(0, 0, W, H);
    },

    restart() {
      if (messageTimer) clearTimeout(messageTimer);
      hintPair = null;
      newGame();
    }
  };
}
