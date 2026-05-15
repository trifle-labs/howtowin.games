// SameGame — playable canvas implementation
// ~130 lines, click a group of 2+ same-color blocks to clear them.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 340);
  canvas.width = size;
  canvas.height = size;

  const cols = 10, rows = 10, cell = size / cols;
  const clrs = ["#e66", "#e90", "#48a", "#6b4"];
  let board, won = false;
  const statusEl = document.getElementById("playable-status");

  function init() {
    board = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => Math.floor(Math.random() * clrs.length))
    );
  }
  init();

  function flood(r, c, color, visited) {
    if (r < 0 || r >= rows || c < 0 || c >= cols) return;
    const k = r * cols + c;
    if (visited.has(k) || board[r][c] !== color) return;
    visited.add(k);
    flood(r - 1, c, color, visited);
    flood(r + 1, c, color, visited);
    flood(r, c - 1, color, visited);
    flood(r, c + 1, color, visited);
  }

  function collapse() {
    // Gravity: drop blocks down
    for (let c = 0; c < cols; c++) {
      let wr = rows - 1;
      for (let r = rows - 1; r >= 0; r--) {
        if (board[r][c] !== -1) board[wr--][c] = board[r][c];
      }
      for (let r = wr; r >= 0; r--) board[r][c] = -1;
    }
    // Shift columns left
    let wc = 0;
    for (let c = 0; c < cols; c++) {
      if (board[rows - 1][c] !== -1) {
        if (c !== wc) for (let r = 0; r < rows; r++) { board[r][wc] = board[r][c]; board[r][c] = -1; }
        wc++;
      }
    }
  }

  function hasGroups() {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (board[r][c] === -1) continue;
        const v = new Set();
        flood(r, c, board[r][c], v);
        if (v.size >= 2) return true;
      }
    }
    return false;
  }

  function draw() {
    ctx.clearRect(0, 0, size, size);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (board[r][c] === -1) continue;
        ctx.fillStyle = clrs[board[r][c]];
        ctx.fillRect(c * cell + 1, r * cell + 1, cell - 2, cell - 2);
        ctx.fillStyle = "rgba(255,255,255,0.15)";
        ctx.fillRect(c * cell + 1, r * cell + 1, cell - 2, cell / 3);
      }
    }
    const remaining = board.flat().filter(v => v !== -1).length;
    statusEl.textContent = won ? "cleared!" : remaining ? `${remaining} blocks` : "click to start";
  }

  function handleClick(e) {
    if (won) return;
    const rect = canvas.getBoundingClientRect();
    const c = Math.floor((e.clientX - rect.left) * (size / rect.width) / cell);
    const r = Math.floor((e.clientY - rect.top) * (size / rect.height) / cell);
    if (r < 0 || r >= rows || c < 0 || c >= cols || board[r][c] === -1) return;

    const group = new Set();
    flood(r, c, board[r][c], group);
    if (group.size < 2) return;

    group.forEach(k => { board[Math.floor(k / cols)][k % cols] = -1; });
    collapse();
    if (!hasGroups()) {
      const remaining = board.flat().filter(v => v !== -1).length;
      if (remaining === 0) won = true;
    }
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
