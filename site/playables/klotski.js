// Klotski — playable canvas implementation
// ~130 lines, click block to select, click direction to slide.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 340);
  canvas.width = size;
  canvas.height = size;

  const cols = 4, cell = size / cols;
  const statusEl = document.getElementById("playable-status");

  // Block { id, r, c, w, h, color }
  let blocks, selected = null, won = false, moves = 0;

  // Classic "Heng Da Li Ma" — boss 2x2 must reach bottom-center exit
  function defaultPuzzle() {
    return [
      { id: 0, r: 0, c: 1, w: 2, h: 2, color: "#e44" }, // boss
      { id: 1, r: 0, c: 0, w: 1, h: 2, color: "#48a" },
      { id: 2, r: 0, c: 3, w: 1, h: 2, color: "#48a" },
      { id: 3, r: 2, c: 0, w: 2, h: 1, color: "#6b4" },
      { id: 4, r: 2, c: 2, w: 2, h: 1, color: "#6b4" },
      { id: 5, r: 3, c: 0, w: 1, h: 1, color: "#e90" },
      { id: 6, r: 3, c: 3, w: 1, h: 1, color: "#e90" },
      { id: 7, r: 4, c: 0, w: 1, h: 1, color: "#a6c" },
      { id: 8, r: 4, c: 3, w: 1, h: 1, color: "#a6c" },
    ];
  }
  const rows = 5;

  function reset() {
    blocks = defaultPuzzle().map(b => ({ ...b }));
    selected = null; won = false; moves = 0;
  }
  reset();

  function grid() {
    const g = Array.from({ length: rows * cols }, () => -1);
    for (const b of blocks) {
      for (let dr = 0; dr < b.h; dr++)
        for (let dc = 0; dc < b.w; dc++)
          g[(b.r + dr) * cols + (b.c + dc)] = b.id;
    }
    return g;
  }

  function canFit(b, nr, nc) {
    if (nr < 0 || nc < 0 || nr + b.h > rows || nc + b.w > cols) return false;
    const g = grid();
    for (let dr = 0; dr < b.h; dr++)
      for (let dc = 0; dc < b.w; dc++) {
        const gi = (nr + dr) * cols + (nc + dc);
        if (g[gi] !== -1 && g[gi] !== b.id) return false;
      }
    return true;
  }

  function draw() {
    ctx.clearRect(0, 0, size, size);
    for (let i = 0; i <= cols; i++) {
      ctx.beginPath(); ctx.moveTo(i * cell, 0); ctx.lineTo(i * cell, size); ctx.stroke();
    }
    for (let i = 0; i <= rows; i++) {
      ctx.beginPath(); ctx.moveTo(0, i * cell); ctx.lineTo(size, i * cell); ctx.stroke();
    }
    // Exit marker at bottom
    ctx.fillStyle = won ? "#4a4" : "#ccc";
    ctx.fillRect(cell, rows * cell - 2, cell * 2, 4);

    for (const b of blocks) {
      const x = b.c * cell, y = b.r * cell;
      ctx.fillStyle = selected === b.id ? "#ff8" : b.color;
      ctx.fillRect(x + 1, y + 1, b.w * cell - 2, b.h * cell - 2);
      ctx.strokeStyle = "#222";
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 1, y + 1, b.w * cell - 2, b.h * cell - 2);
    }
    statusEl.textContent = won ? `solved in ${moves} moves!` : `${moves} moves`;
  }

  function handleClick(e) {
    if (won) return;
    const rect = canvas.getBoundingClientRect();
    const c = Math.floor((e.clientX - rect.left) * (size / rect.width) / cell);
    const r = Math.floor((e.clientY - rect.top) * (size / rect.height) / cell);
    const gd = grid();
    const hit = r >= 0 && r < rows && c >= 0 && c < cols ? gd[r * cols + c] : -1;

    if (selected !== null) {
      const b = blocks[selected];
      if (hit === selected) { selected = null; draw(); return; }
      // Clicked empty — slide block toward click
      if (hit === -1) {
        const centerR = b.r + b.h / 2, centerC = b.c + b.w / 2;
        const dr = r + 0.5 - centerR, dc = c + 0.5 - centerC;
        if (Math.abs(dr) > Math.abs(dc)) {
          const dir = dr > 0 ? 1 : -1;
          if (canFit(b, b.r + dir, b.c)) { b.r += dir; moves++; }
        } else {
          const dir = dc > 0 ? 1 : -1;
          if (canFit(b, b.r, b.c + dir)) { b.c += dir; moves++; }
        }
        if (b.id === 0 && b.r === 3 && b.c === 1) won = true;
      }
      selected = null;
      draw();
      return;
    }

    if (hit >= 0) { selected = hit; draw(); }
  }

  canvas.addEventListener("click", handleClick);
  draw();

  return {
    destroy() { canvas.removeEventListener("click", handleClick); ctx.clearRect(0, 0, size, size); },
    restart() { reset(); draw(); }
  };
}
