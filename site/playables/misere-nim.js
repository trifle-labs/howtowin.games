// Misère Nim — like Nim but the player taking the last stone LOSES.
// Optimal strategy: play standard Nim (XOR to 0) UNLESS doing so would leave
// all remaining heaps of size ≤ 1 — then leave an ODD number of size-1 heaps.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 360);
  canvas.width = size;
  canvas.height = size;
  const statusEl = document.getElementById("playable-status");

  let heaps, turn, selected, winner;
  function newGame() {
    heaps = [3, 4, 5];
    turn = "you"; selected = { heap: -1, count: 0 }; winner = null;
  }
  newGame();

  function nimSum(h) { return h.reduce((a,b)=>a^b,0); }
  function total(h) { return h.reduce((a,b)=>a+b,0); }
  function allSmall(h) { return h.every(x => x <= 1); }

  function applyMisereMove(h) {
    // Pick optimal move for misère nim.
    // Special endgame: if all remaining heaps are 0 or 1, target an EVEN count of 1s
    //   (so opponent moves to ODD, eventually has to take last).
    // Otherwise: standard Nim — XOR to 0 if possible; but if XOR-to-0 would
    //   leave heaps all ≤ 1, instead make ODD number of 1-heaps.
    const sumOnes = h.filter(x => x === 1).length;
    const bigHeaps = h.filter(x => x > 1);
    if (bigHeaps.length === 0) {
      // pure 1-heaps: misère strategy is "leave opponent with ODD number of 1s"
      // i.e., take a 1 — we want sumOnes-1 to be ODD for opponent => want sumOnes EVEN currently
      // If current sumOnes is even, we are stuck losing — just take any.
      for (let i = 0; i < h.length; i++) if (h[i] === 1) return { i, take: 1 };
      return null;
    }
    if (bigHeaps.length === 1) {
      // exactly one heap > 1. Reduce it to make 1-heap count come out right.
      const idx = h.findIndex(x => x > 1);
      // After move, we want: sumOnes_after to be EVEN+0 or 1 such that opponent is stuck.
      // Standard misère rule: leave opponent with odd number of nonempty heaps each of size 1.
      const desiredOnes = (sumOnes % 2 === 0) ? 1 : 0;
      const take = h[idx] - desiredOnes;
      return { i: idx, take };
    }
    // 2+ heaps > 1: standard nim — make XOR = 0
    const ns = nimSum(h);
    if (ns !== 0) {
      for (let i = 0; i < h.length; i++) {
        const target = h[i] ^ ns;
        if (target < h[i]) return { i, take: h[i] - target };
      }
    }
    // No winning move (XOR already 0). Take 1 from largest.
    let best = 0;
    for (let i = 1; i < h.length; i++) if (h[i] > h[best]) best = i;
    return { i: best, take: 1 };
  }

  function aiMove() {
    if (winner) return;
    const mv = applyMisereMove(heaps);
    if (!mv) return;
    heaps[mv.i] -= mv.take;
    if (total(heaps) === 0) { winner = "you"; draw(); return; } // AI took last → you win!
    turn = "you"; draw();
  }

  function stonePos(h, s) {
    const cols = heaps.length;
    const colW = size / cols;
    const stoneR = Math.min(colW * 0.32, 16);
    const maxStack = size - 80;
    const y0 = size - 60 - Math.min(maxStack, heaps[h] * (stoneR*2+3));
    return { cx: h * colW + colW/2, cy: y0 + s * (stoneR*2+3) + stoneR, r: stoneR };
  }

  function draw() {
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0,0,size,size);
    ctx.font = "11px monospace"; ctx.textAlign = "center";
    ctx.fillStyle = "#a44";
    ctx.fillText("misère: taking the last stone LOSES", size/2, 18);

    ctx.font = "12px sans-serif"; ctx.fillStyle = "#444";
    for (let h = 0; h < heaps.length; h++) ctx.fillText(`heap ${h+1}: ${heaps[h]}`, h * (size/heaps.length) + (size/heaps.length)/2, 36);

    for (let h = 0; h < heaps.length; h++) {
      for (let s = 0; s < heaps[h]; s++) {
        const { cx, cy, r } = stonePos(h, s);
        const fromTop = heaps[h] - 1 - s;
        const willRemove = selected.heap === h && fromTop < selected.count;
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2);
        ctx.fillStyle = willRemove ? "#e88" : "#5a7"; ctx.fill();
        ctx.strokeStyle = "#222"; ctx.lineWidth = 1.5; ctx.stroke();
      }
    }
    // base
    ctx.strokeStyle = "#bbb"; ctx.lineWidth = 1;
    for (let h = 0; h < heaps.length; h++) {
      const cw = size/heaps.length;
      ctx.beginPath();
      ctx.moveTo(h*cw + 20, size - 40); ctx.lineTo((h+1)*cw - 20, size - 40);
      ctx.stroke();
    }
    ctx.fillStyle = "#666"; ctx.font = "11px sans-serif";
    ctx.fillText("click base to confirm", size/2, size - 18);

    if (winner) statusEl.textContent = winner === "you" ? "you win!" : "AI wins";
    else if (selected.count > 0) statusEl.textContent = `take ${selected.count} from heap ${selected.heap+1} — click base to confirm`;
    else statusEl.textContent = turn === "you" ? "your turn" : "AI thinking…";
  }

  function clickPos(e) {
    const r = canvas.getBoundingClientRect();
    return { x: (e.clientX - r.left) * (size / r.width), y: (e.clientY - r.top) * (size / r.height) };
  }

  function findStone(x, y) {
    for (let h = 0; h < heaps.length; h++) {
      for (let s = 0; s < heaps[h]; s++) {
        const { cx, cy, r } = stonePos(h, s);
        if ((x-cx)**2 + (y-cy)**2 <= (r+2)**2) return { h, fromTop: heaps[h]-1-s };
      }
    }
    return null;
  }

  function commit() {
    if (selected.heap < 0 || selected.count <= 0) return;
    heaps[selected.heap] -= selected.count;
    selected = { heap:-1, count:0 };
    if (total(heaps) === 0) { winner = turn === "you" ? "ai" : "you"; draw(); return; }
    turn = turn === "you" ? "ai" : "you";
    draw();
    if (turn === "ai") setTimeout(aiMove, 400);
  }

  function onClick(e) {
    if (winner || turn !== "you") return;
    const { x, y } = clickPos(e);
    if (y > size - 50 && selected.count > 0) { commit(); return; }
    const hit = findStone(x, y);
    if (!hit) return;
    if (selected.heap !== hit.h) selected = { heap: hit.h, count: hit.fromTop + 1 };
    else if (selected.count === hit.fromTop + 1) { commit(); return; }
    else selected.count = hit.fromTop + 1;
    draw();
  }

  canvas.addEventListener("click", onClick);
  draw();

  return {
    destroy() { canvas.removeEventListener("click", onClick); ctx.clearRect(0,0,size,size); },
    restart() { newGame(); draw(); },
    solve() {
      if (winner || turn !== "you") return;
      const mv = applyMisereMove(heaps);
      if (!mv) return;
      selected = { heap: mv.i, count: mv.take };
      draw();
      setTimeout(commit, 600);
    },
  };
}
