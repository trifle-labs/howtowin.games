// Lights Out — playable canvas implementation
// ~80 lines, click to toggle lights and orthogonal neighbors.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 320);
  canvas.width = size;
  canvas.height = size;

  const g = 5, cell = size / g;
  let board, won = false;
  const statusEl = document.getElementById("playable-status");

  function init() {
    board = Array.from({ length: g * g }, () => Math.random() < 0.4);
    // ensure solvable — if by chance it starts solved, redo
    if (board.every(c => !c)) init();
  }
  init();

  function neighbors(i) {
    const r = Math.floor(i / g), c = i % g;
    const ns = [i];
    if (r > 0) ns.push(i - g);
    if (r < g - 1) ns.push(i + g);
    if (c > 0) ns.push(i - 1);
    if (c < g - 1) ns.push(i + 1);
    return ns;
  }

  function draw() {
    ctx.clearRect(0, 0, size, size);
    for (let i = 0; i < g * g; i++) {
      const x = (i % g) * cell, y = Math.floor(i / g) * cell;
      ctx.fillStyle = board[i] ? "#e66" : "#222";
      ctx.fillRect(x + 2, y + 2, cell - 4, cell - 4);
      ctx.fillStyle = board[i] ? "#f99" : "#333";
      ctx.fillRect(x + 4, y + 4, cell - 8, cell - 8);
    }
    statusEl.textContent = won ? "all off!" : `${board.filter(Boolean).length} lights on`;
  }

  function handleClick(e) {
    if (won) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) * (size / rect.width) / cell);
    const y = Math.floor((e.clientY - rect.top) * (size / rect.height) / cell);
    neighbors(y * g + x).forEach(i => board[i] = !board[i]);
    if (board.every(c => !c)) won = true;
    draw();
  }

  canvas.addEventListener("click", handleClick);
  draw();

  return {
    destroy() {
      canvas.removeEventListener("click", handleClick);
      ctx.clearRect(0, 0, size, size);
    },
    restart() { init(); won = false; draw(); }
  };
}
