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
    board = Array.from({ length: g * g }, () => false);
    // Generate solvable board via random button presses from solved state
    const presses = 5 + Math.floor(Math.random() * 20);
    for (let p = 0; p < presses; p++) {
      const i = Math.floor(Math.random() * g * g);
      neighbors(i).forEach(j => board[j] = !board[j]);
    }
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

  function gaussSolve() {
    // Build A matrix (25x25) and b vector over GF(2)
    const N = g * g;
    // augmented matrix [A | b], row operations in-place
    const aug = [];
    for (let i = 0; i < N; i++) {
      const row = new Array(N + 1).fill(0);
      for (const j of neighbors(i)) row[j] = 1;
      row[N] = board[i] ? 1 : 0;
      aug.push(row);
    }
    // Gaussian elimination
    let col = 0;
    for (let row = 0; row < N && col < N; col++) {
      // Find pivot
      let pivot = -1;
      for (let r = row; r < N; r++) {
        if (aug[r][col]) { pivot = r; break; }
      }
      if (pivot < 0) continue;
      [aug[row], aug[pivot]] = [aug[pivot], aug[row]];
      // Eliminate other rows
      for (let r = 0; r < N; r++) {
        if (r !== row && aug[r][col]) {
          for (let c = col; c <= N; c++) aug[r][c] ^= aug[row][c];
        }
      }
      row++;
    }
    // Extract solution (x = last column of augmented matrix)
    const x = [];
    for (let r = 0; r < N; r++) x.push(aug[r][N]);
    return x;
  }

  canvas.addEventListener("click", handleClick);
  draw();

  return {
    destroy() {
      canvas.removeEventListener("click", handleClick);
      ctx.clearRect(0, 0, size, size);
    },
    restart() { init(); won = false; draw(); },
    solve() {
      if (won) return;
      const sol = gaussSolve();
      // Press each solution button (animate)
      let idx = 0;
      const timer = setInterval(() => {
        while (idx < g * g && !sol[idx]) idx++;
        if (idx >= g * g) {
          clearInterval(timer);
          draw();
          return;
        }
        neighbors(idx).forEach(i => board[i] = !board[i]);
        if (board.every(c => !c)) won = true;
        draw();
        idx++;
      }, 120);
    }
  };
}
