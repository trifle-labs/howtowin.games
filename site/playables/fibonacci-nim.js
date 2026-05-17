// Fibonacci Nim — single heap. First move: 1..n-1 stones.
// Subsequent moves: 1..min(2 * previous_move, remaining).
// AI: optimal Zeckendorf-based strategy.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 360);
  canvas.width = size;
  canvas.height = size;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) {
    const w = canvas.width, h = canvas.height;
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    canvas.width = w * dpr; canvas.height = h * dpr; ctx.scale(dpr, dpr);
  }
  const statusEl = document.getElementById("playable-status");

  const FIB = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89];
  function isFib(n) { return FIB.includes(n); }
  function zeckendorfSmallest(n) {
    // Greedy: subtract largest Fib ≤ n until n=0; smallest piece is the last subtracted.
    const parts = [];
    while (n > 0) {
      let f = FIB[0];
      for (const x of FIB) if (x <= n) f = x;
      parts.push(f); n -= f;
    }
    return parts[parts.length - 1]; // smallest
  }

  let heap, lastMove, turn, winner;
  function newGame() {
    // Pick a non-Fibonacci heap so first move (yours) is a winning N-position
    const candidates = [];
    for (let n = 12; n <= 50; n++) if (!isFib(n)) candidates.push(n);
    heap = candidates[Math.floor(Math.random() * candidates.length)];
    lastMove = 0; // first move limit handled separately
    turn = "you"; winner = null;
  }
  newGame();

  function maxTake() {
    if (lastMove === 0) return heap - 1; // first move can't take all
    return Math.min(2 * lastMove, heap);
  }

  function aiMove() {
    if (winner) return;
    const limit = maxTake();
    if (limit >= heap) { heap = 0; winner = "ai"; draw(); return; }
    // Optimal: aim to leave a Fibonacci number, and within the limit.
    // Strategy: find smallest k in [1, limit] such that heap - k is a Fibonacci number.
    let take = null;
    for (let k = 1; k <= limit; k++) {
      const rem = heap - k;
      if (rem === 0) { take = k; break; }
      if (isFib(rem) && k <= 2 * Math.max(k, 1)) { take = k; break; }
    }
    if (take === null) take = 1;
    heap -= take; lastMove = take;
    if (heap === 0) winner = "ai";
    else turn = "you";
    draw();
  }

  function applyTake(k) {
    heap -= k; lastMove = k;
    if (heap === 0) { winner = "you"; draw(); return; }
    turn = "ai"; draw();
    setTimeout(aiMove, 500);
  }

  function buttons() {
    const limit = maxTake();
    const out = [];
    const maxBtns = Math.min(limit, 12);
    const btnW = Math.min(40, (size - 40) / maxBtns - 4);
    const btnH = 28, gap = 4;
    const total = maxBtns * btnW + (maxBtns - 1) * gap;
    const x0 = (size - total) / 2;
    const y0 = size - 50;
    for (let k = 1; k <= maxBtns; k++) {
      out.push({ k, x: x0 + (k-1) * (btnW + gap), y: y0, w: btnW, h: btnH });
    }
    return out;
  }

  function draw() {
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0,0,size,size);
    ctx.fillStyle = "#333"; ctx.font = "16px sans-serif"; ctx.textAlign = "center";
    ctx.fillText(`heap: ${heap}    last move: ${lastMove || "—"}    limit: ${maxTake()}`, size/2, 24);
    ctx.font = "11px monospace";
    ctx.fillStyle = isFib(heap) ? "#a44" : "#484";
    ctx.fillText(isFib(heap) ? `(Fibonacci heap — P-position for mover)` : `(non-Fibonacci — winning move exists)`, size/2, 42);

    // stones
    const cols = 12;
    const stoneR = 8;
    const xStart = size/2 - (cols * (stoneR*2+3) - 3)/2 + stoneR;
    const yStart = 70;
    for (let i = 0; i < heap; i++) {
      const r = Math.floor(i/cols), c = i%cols;
      ctx.beginPath(); ctx.arc(xStart + c*(stoneR*2+3), yStart + r*(stoneR*2+3), stoneR, 0, Math.PI*2);
      ctx.fillStyle = "#5a7"; ctx.fill();
      ctx.strokeStyle = "#222"; ctx.lineWidth = 1; ctx.stroke();
    }

    // buttons
    ctx.font = "12px sans-serif";
    for (const b of buttons()) {
      ctx.fillStyle = "#eef0e8"; ctx.fillRect(b.x, b.y, b.w, b.h);
      ctx.strokeStyle = "#888"; ctx.lineWidth = 1; ctx.strokeRect(b.x, b.y, b.w, b.h);
      ctx.fillStyle = "#222"; ctx.textBaseline = "middle"; ctx.textAlign = "center";
      ctx.fillText(`−${b.k}`, b.x + b.w/2, b.y + b.h/2);
    }
    ctx.textBaseline = "alphabetic";

    if (winner) statusEl.textContent = winner === "you" ? "you win!" : "AI wins";
    else statusEl.textContent = turn === "you" ? "your turn — click a button" : "AI thinking…";
  }

  function clickPos(e) {
    const r = canvas.getBoundingClientRect();
    return { x: (e.clientX - r.left) * (size / r.width), y: (e.clientY - r.top) * (size / r.height) };
  }

  function onClick(e) {
    if (turn !== "you" || winner) return;
    const { x, y } = clickPos(e);
    for (const b of buttons()) {
      if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) { applyTake(b.k); return; }
    }
  }

  canvas.addEventListener("click", onClick);
  draw();

  return {
    destroy() { canvas.removeEventListener("click", onClick); ctx.clearRect(0,0,size,size); },
    restart() { newGame(); draw(); },
    solve() {
      if (turn !== "you" || winner) return;
      // Find a k in [1, maxTake] leaving a Fibonacci heap (or zero).
      const limit = maxTake();
      let take = null;
      for (let k = 1; k <= limit; k++) {
        const rem = heap - k;
        if (rem === 0 || isFib(rem)) { take = k; break; }
      }
      if (take === null) { statusEl.textContent = "no winning move (Fibonacci heap)"; return; }
      applyTake(take);
    },
  };
}
