// Nim — playable canvas with optimal AI (XOR / nim-sum strategy).

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 360);
  canvas.width = size;
  canvas.height = size;

  let heaps;
  let turn;
  let selected;
  let winner;
  const statusEl = document.getElementById("playable-status");

  function newGame() {
    heaps = [3, 5, 7];
    turn = "you";
    selected = { heap: -1, count: 0 };
    winner = null;
  }
  newGame();

  function nimSum(h) { return h.reduce((a, b) => a ^ b, 0); }
  function totalStones(h) { return h.reduce((a, b) => a + b, 0); }

  function layout() {
    const cols = heaps.length;
    const colW = size / cols;
    return { cols, colW };
  }

  function stoneRect(h, s) {
    const { cols, colW } = layout();
    const cx = h * colW + colW / 2;
    const stoneR = Math.min(colW * 0.35, 18);
    const maxH = size - 60;
    const total = heaps[h];
    const stackH = Math.min(maxH, total * (stoneR * 2 + 4));
    const y0 = size - 30 - stackH;
    const y = y0 + s * (stoneR * 2 + 4) + stoneR;
    return { cx, cy: y, r: stoneR };
  }

  function draw() {
    ctx.fillStyle = "#fafaf7";
    ctx.fillRect(0, 0, size, size);
    const { cols, colW } = layout();

    // heap base lines
    ctx.strokeStyle = "#bbb";
    ctx.lineWidth = 1;
    for (let h = 0; h < cols; h++) {
      ctx.beginPath();
      ctx.moveTo(h * colW + 20, size - 20);
      ctx.lineTo((h + 1) * colW - 20, size - 20);
      ctx.stroke();
    }

    // stones (top of each heap is "to remove" if selected.heap === h)
    for (let h = 0; h < cols; h++) {
      for (let s = 0; s < heaps[h]; s++) {
        const { cx, cy, r } = stoneRect(h, s);
        const fromTop = heaps[h] - 1 - s; // 0 = topmost
        const willRemove = selected.heap === h && fromTop < selected.count;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fillStyle = willRemove ? "#e88" : "#5a7";
        ctx.fill();
        ctx.strokeStyle = "#222";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }

    // heap labels
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#444";
    for (let h = 0; h < cols; h++) {
      ctx.fillText(`heap ${h + 1}: ${heaps[h]}`, h * colW + colW / 2, 18);
    }

    if (winner) {
      statusEl.textContent = winner === "you" ? "you win!" : "AI wins";
    } else if (selected.heap >= 0 && selected.count > 0) {
      statusEl.textContent = `take ${selected.count} from heap ${selected.heap + 1} — click base to confirm, or another stone`;
    } else {
      statusEl.textContent = turn === "you" ? "your turn — click stones from one heap" : "AI thinking…";
    }
  }

  function clickToCell(e) {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (size / rect.width);
    const y = (e.clientY - rect.top) * (size / rect.height);
    return { x, y };
  }

  function findClicked(x, y) {
    for (let h = 0; h < heaps.length; h++) {
      for (let s = 0; s < heaps[h]; s++) {
        const { cx, cy, r } = stoneRect(h, s);
        const dx = x - cx, dy = y - cy;
        if (dx * dx + dy * dy <= (r + 2) * (r + 2)) {
          return { h, fromTop: heaps[h] - 1 - s };
        }
      }
    }
    return null;
  }

  function commitMove() {
    if (selected.heap < 0 || selected.count <= 0) return;
    heaps[selected.heap] -= selected.count;
    selected = { heap: -1, count: 0 };
    if (totalStones(heaps) === 0) {
      winner = turn;
      draw();
      return;
    }
    turn = turn === "you" ? "ai" : "you";
    draw();
    if (turn === "ai") setTimeout(aiMove, 400);
  }

  function aiMove() {
    if (winner) return;
    const ns = nimSum(heaps);
    let move = null;
    if (ns !== 0) {
      // winning: pick heap H such that H ^ ns < H
      for (let h = 0; h < heaps.length; h++) {
        const target = heaps[h] ^ ns;
        if (target < heaps[h]) {
          move = { h, take: heaps[h] - target };
          break;
        }
      }
    }
    if (!move) {
      // losing: take 1 from largest non-empty heap (delay)
      let bestH = 0;
      for (let h = 1; h < heaps.length; h++) if (heaps[h] > heaps[bestH]) bestH = h;
      if (heaps[bestH] === 0) return;
      move = { h: bestH, take: 1 };
    }
    heaps[move.h] -= move.take;
    if (totalStones(heaps) === 0) {
      winner = "ai";
    } else {
      turn = "you";
    }
    draw();
  }

  function onClick(e) {
    if (winner || turn !== "you") return;
    const { x, y } = clickToCell(e);
    // click below the heaps: commit
    if (y > size - 25 && selected.count > 0) { commitMove(); return; }
    const hit = findClicked(x, y);
    if (!hit) return;
    if (selected.heap !== hit.h) {
      selected = { heap: hit.h, count: hit.fromTop + 1 };
    } else {
      // toggle: clicking same stone again confirms
      if (selected.count === hit.fromTop + 1) {
        commitMove();
        return;
      }
      selected.count = hit.fromTop + 1;
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
      // play the AI's winning move for "you" — preview a perfect move
      const ns = nimSum(heaps);
      if (ns === 0) {
        statusEl.textContent = "position lost — any move loses to perfect play";
        return;
      }
      for (let h = 0; h < heaps.length; h++) {
        const target = heaps[h] ^ ns;
        if (target < heaps[h]) {
          selected = { heap: h, count: heaps[h] - target };
          draw();
          setTimeout(commitMove, 600);
          return;
        }
      }
    },
  };
}
