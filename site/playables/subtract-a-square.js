// Subtract-a-square — one heap; remove a positive perfect-square number of stones.
// AI uses precomputed Grundy values (mex recurrence) to play optimally.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 360);
  canvas.width = size;
  canvas.height = size;
  const statusEl = document.getElementById("playable-status");

  const N = 30;
  // Grundy values: g[0]=0; g[n] = mex{ g[n-k^2] : k^2 <= n }
  const g = new Array(N + 1).fill(0);
  for (let n = 1; n <= N; n++) {
    const reachable = new Set();
    for (let k = 1; k * k <= n; k++) reachable.add(g[n - k * k]);
    let m = 0; while (reachable.has(m)) m++;
    g[n] = m;
  }

  let heap, turn, winner;
  function newGame() {
    // pick a heap size that is an N-position (winning for mover)
    const winners = [];
    for (let i = 8; i <= N; i++) if (g[i] !== 0) winners.push(i);
    heap = winners[Math.floor(Math.random() * winners.length)];
    turn = "you"; winner = null;
  }
  newGame();

  function squareButtons() {
    const buttons = [];
    const max = Math.floor(Math.sqrt(heap));
    const btnW = 50, btnH = 30, gap = 8;
    const total = max * btnW + (max - 1) * gap;
    const x0 = (size - total) / 2;
    const y0 = size - 50;
    for (let k = 1; k <= max; k++) {
      buttons.push({ k, label: `−${k * k}`, x: x0 + (k - 1) * (btnW + gap), y: y0, w: btnW, h: btnH });
    }
    return buttons;
  }

  function draw() {
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, size, size);

    // heap header
    ctx.fillStyle = "#333"; ctx.font = "16px sans-serif"; ctx.textAlign = "center";
    ctx.fillText(`heap: ${heap}`, size / 2, 26);
    ctx.font = "11px monospace";
    ctx.fillStyle = g[heap] === 0 ? "#a44" : "#484";
    ctx.fillText(g[heap] === 0 ? "(P-position: you lose with perfect play)" : `(N-position, nim-value ${g[heap]})`, size / 2, 44);

    // stones grid
    const cols = 10;
    const rows = Math.ceil(heap / cols);
    const stoneR = 9;
    const xStart = size / 2 - (cols * (stoneR * 2 + 4) - 4) / 2 + stoneR;
    const yStart = 70;
    for (let i = 0; i < heap; i++) {
      const r = Math.floor(i / cols), c = i % cols;
      const cx = xStart + c * (stoneR * 2 + 4);
      const cy = yStart + r * (stoneR * 2 + 4);
      ctx.beginPath(); ctx.arc(cx, cy, stoneR, 0, Math.PI * 2);
      ctx.fillStyle = "#5a7"; ctx.fill();
      ctx.strokeStyle = "#222"; ctx.lineWidth = 1; ctx.stroke();
    }

    // buttons
    const btns = squareButtons();
    ctx.font = "13px sans-serif";
    for (const b of btns) {
      ctx.fillStyle = "#eef0e8"; ctx.fillRect(b.x, b.y, b.w, b.h);
      ctx.strokeStyle = "#888"; ctx.lineWidth = 1; ctx.strokeRect(b.x, b.y, b.w, b.h);
      ctx.fillStyle = "#222"; ctx.textBaseline = "middle";
      ctx.fillText(b.label, b.x + b.w / 2, b.y + b.h / 2);
    }
    ctx.textBaseline = "alphabetic";

    if (winner) statusEl.textContent = winner === "you" ? "you win!" : "AI wins";
    else statusEl.textContent = turn === "you" ? "your turn — click a button to remove" : "AI thinking…";
  }

  function clickPos(e) {
    const r = canvas.getBoundingClientRect();
    return { x: (e.clientX - r.left) * (size / r.width), y: (e.clientY - r.top) * (size / r.height) };
  }

  function aiMove() {
    if (winner) return;
    const max = Math.floor(Math.sqrt(heap));
    let bestK = 1;
    for (let k = 1; k <= max; k++) {
      if (g[heap - k * k] === 0) { bestK = k; break; }
    }
    heap -= bestK * bestK;
    if (heap === 0) winner = "ai";
    else turn = "you";
    draw();
  }

  function applyMove(k) {
    if (turn !== "you" || winner) return;
    heap -= k * k;
    if (heap === 0) { winner = "you"; draw(); return; }
    turn = "ai";
    draw();
    setTimeout(aiMove, 500);
  }

  function onClick(e) {
    if (turn !== "you" || winner) return;
    const { x, y } = clickPos(e);
    for (const b of squareButtons()) {
      if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) { applyMove(b.k); return; }
    }
  }

  canvas.addEventListener("click", onClick);
  draw();

  return {
    destroy() { canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, size, size); },
    restart() { newGame(); draw(); },
    solve() {
      if (turn !== "you" || winner) return;
      const max = Math.floor(Math.sqrt(heap));
      let bestK = 0;
      for (let k = 1; k <= max; k++) if (g[heap - k * k] === 0) { bestK = k; break; }
      if (!bestK) { statusEl.textContent = "no winning move (P-position)"; return; }
      applyMove(bestK);
    },
  };
}
