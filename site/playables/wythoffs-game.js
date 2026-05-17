// Wythoff's game — two heaps; remove from one, or equal amount from both.
// P-positions: (⌊nφ⌋, ⌊nφ²⌋) for n = 0,1,2,…

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

  const PHI = (1 + Math.sqrt(5)) / 2;

  let A, B, turn, winner, mode, selA, selB;

  function newGame() {
    // start at a winning (N-) position so player has a real choice
    A = 8 + Math.floor(Math.random() * 4);
    B = 13 + Math.floor(Math.random() * 4);
    if (Math.random() < 0.5) [A, B] = [B, A];
    turn = "you"; winner = null; mode = "idle"; selA = 0; selB = 0;
  }
  newGame();

  function isP(a, b) {
    const [lo, hi] = a < b ? [a, b] : [b, a];
    // For n = hi - lo: P iff lo === floor(n*phi)
    const n = hi - lo;
    return lo === Math.floor(n * PHI);
  }

  function findWinningMove(a, b) {
    // Try one-heap reductions and diagonal reductions to reach a P-position.
    for (let x = a - 1; x >= 0; x--) if (isP(x, b)) return { a: x, b };
    for (let y = b - 1; y >= 0; y--) if (isP(a, y)) return { a, b: y };
    const maxD = Math.min(a, b);
    for (let d = 1; d <= maxD; d++) if (isP(a - d, b - d)) return { a: a - d, b: b - d };
    return null;
  }

  function layout() {
    const colW = size / 2;
    const baseY = size - 30;
    const stoneR = 10;
    return { colW, baseY, stoneR };
  }

  function stonePos(heap, idx, count) {
    const { colW, baseY, stoneR } = layout();
    const cx = heap * colW + colW / 2;
    const perRow = 3;
    const row = Math.floor(idx / perRow);
    const col = idx % perRow - 1;
    const cy = baseY - 10 - row * (stoneR * 2 + 3);
    return { cx: cx + col * (stoneR * 2 + 2), cy, r: stoneR };
  }

  function draw() {
    ctx.fillStyle = "#fafaf7";
    ctx.fillRect(0, 0, size, size);

    // labels
    ctx.font = "13px sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#333";
    ctx.fillText(`heap A: ${A}`, size * 0.25, 20);
    ctx.fillText(`heap B: ${B}`, size * 0.75, 20);

    // P-position indicator
    ctx.font = "11px monospace";
    ctx.fillStyle = isP(A, B) ? "#a44" : "#484";
    ctx.fillText(isP(A, B) ? "(P-position: you to move loses)" : "(N-position: a winning move exists)", size / 2, 40);

    // stones
    for (let i = 0; i < A; i++) {
      const { cx, cy, r } = stonePos(0, i, A);
      const willRemove = (mode === "selA" && i >= A - selA) || (mode === "selDiag" && i >= A - selA);
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = willRemove ? "#e88" : "#5a7";
      ctx.fill();
      ctx.strokeStyle = "#222"; ctx.lineWidth = 1.2; ctx.stroke();
    }
    for (let i = 0; i < B; i++) {
      const { cx, cy, r } = stonePos(1, i, B);
      const willRemove = (mode === "selB" && i >= B - selB) || (mode === "selDiag" && i >= B - selA);
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = willRemove ? "#e88" : "#5a7";
      ctx.fill();
      ctx.strokeStyle = "#222"; ctx.lineWidth = 1.2; ctx.stroke();
    }

    // controls row
    ctx.font = "12px sans-serif";
    ctx.fillStyle = "#444";
    ctx.fillText("click heap A or B to take; click both to take diagonally", size / 2, size - 10);

    if (winner) {
      statusEl.textContent = winner === "you" ? "you win!" : "AI wins";
    } else if (mode === "selA") {
      statusEl.textContent = `take ${selA} from heap A — click base to confirm`;
    } else if (mode === "selB") {
      statusEl.textContent = `take ${selB} from heap B — click base to confirm`;
    } else if (mode === "selDiag") {
      statusEl.textContent = `take ${selA} from both — click base to confirm`;
    } else {
      statusEl.textContent = turn === "you" ? "your turn — click stones to remove" : "AI thinking…";
    }
  }

  function clickPos(e) {
    const r = canvas.getBoundingClientRect();
    return { x: (e.clientX - r.left) * (size / r.width), y: (e.clientY - r.top) * (size / r.height) };
  }

  function findStone(x, y) {
    for (let i = 0; i < A; i++) {
      const { cx, cy, r } = stonePos(0, i, A);
      if ((x - cx) ** 2 + (y - cy) ** 2 <= (r + 2) ** 2) return { heap: 0, fromTop: A - 1 - i };
    }
    for (let i = 0; i < B; i++) {
      const { cx, cy, r } = stonePos(1, i, B);
      if ((x - cx) ** 2 + (y - cy) ** 2 <= (r + 2) ** 2) return { heap: 1, fromTop: B - 1 - i };
    }
    return null;
  }

  function commit() {
    if (mode === "selA") A -= selA;
    else if (mode === "selB") B -= selB;
    else if (mode === "selDiag") { A -= selA; B -= selA; }
    mode = "idle"; selA = 0; selB = 0;
    if (A === 0 && B === 0) { winner = turn; draw(); return; }
    turn = turn === "you" ? "ai" : "you";
    draw();
    if (turn === "ai") setTimeout(aiMove, 400);
  }

  function aiMove() {
    if (winner) return;
    let mv = findWinningMove(A, B);
    if (!mv) {
      // losing position — just play a default move
      if (A > 0) mv = { a: A - 1, b: B };
      else mv = { a: A, b: B - 1 };
    }
    A = mv.a; B = mv.b;
    if (A === 0 && B === 0) winner = "ai";
    else turn = "you";
    draw();
  }

  function onClick(e) {
    if (winner || turn !== "you") return;
    const { x, y } = clickPos(e);
    if (y > size - 25) { if (mode !== "idle") commit(); return; }
    const hit = findStone(x, y);
    if (!hit) return;
    if (mode === "idle") {
      if (hit.heap === 0) { mode = "selA"; selA = hit.fromTop + 1; }
      else { mode = "selB"; selB = hit.fromTop + 1; }
    } else if (mode === "selA") {
      if (hit.heap === 0) {
        if (selA === hit.fromTop + 1) { commit(); return; }
        selA = hit.fromTop + 1;
      } else {
        // converting to diagonal: need equal counts
        const k = Math.min(selA, hit.fromTop + 1);
        mode = "selDiag"; selA = k;
      }
    } else if (mode === "selB") {
      if (hit.heap === 1) {
        if (selB === hit.fromTop + 1) { commit(); return; }
        selB = hit.fromTop + 1;
      } else {
        const k = Math.min(selB, hit.fromTop + 1);
        mode = "selDiag"; selA = k;
      }
    } else if (mode === "selDiag") {
      // refine diagonal count
      const k = hit.fromTop + 1;
      const cap = Math.min(A, B);
      selA = Math.min(k, cap);
      if (selA === k) commit();
    }
    draw();
  }

  canvas.addEventListener("click", onClick);
  draw();

  return {
    destroy() {
      canvas.removeEventListener("click", onClick);
      ctx.clearRect(0, 0, size, size);
    },
    restart() { newGame(); draw(); },
    solve() {
      if (winner || turn !== "you") return;
      const mv = findWinningMove(A, B);
      if (!mv) { statusEl.textContent = "no winning move (P-position)"; return; }
      A = mv.a; B = mv.b;
      if (A === 0 && B === 0) { winner = "you"; draw(); return; }
      turn = "ai"; draw();
      setTimeout(aiMove, 600);
    },
  };
}
