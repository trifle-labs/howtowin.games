// 15 puzzle — playable canvas implementation
// ~100 lines, click tile adjacent to empty space to slide.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 320);
  canvas.width = size;
  canvas.height = size;

  const g = 4, cell = size / g;
  let board, blank, won = false;
  const statusEl = document.getElementById("playable-status");

  function init() {
    board = Array.from({ length: 16 }, (_, i) => i);
    blank = 15;
    // Fisher-Yates shuffle
    for (let i = board.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [board[i], board[j]] = [board[j], board[i]];
    }
    // Ensure solvable by counting inversions
    let inv = 0;
    for (let i = 0; i < 16; i++) {
      for (let j = i + 1; j < 16; j++) {
        if (board[i] && board[j] && board[i] > board[j]) inv++;
      }
    }
    const blankRow = Math.floor(board.indexOf(15) / 4);
    if ((inv + blankRow) % 2 !== 0) {
      // swap first two non-blank tiles to change parity
      const a = board[0] === 15 ? 1 : board[1] === 15 ? 2 : 0;
      const b = board[a + 1] === 15 ? a + 2 : a + 1;
      [board[a], board[b]] = [board[b], board[a]];
    }
    blank = board.indexOf(15);
  }
  init();

  function draw() {
    ctx.clearRect(0, 0, size, size);
    for (let i = 0; i < 16; i++) {
      if (board[i] === 15) continue; // blank
      const x = (i % g) * cell, y = Math.floor(i / g) * cell;
      ctx.fillStyle = "#e66";
      ctx.fillRect(x + 2, y + 2, cell - 4, cell - 4);
      ctx.fillStyle = "#fff";
      ctx.font = `bold ${Math.round(cell * 0.35)}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(board[i] + 1, x + cell / 2, y + cell / 2);
    }
    statusEl.textContent = won ? "solved!" : "";
  }

  function handleClick(e) {
    if (won) return;
    const rect = canvas.getBoundingClientRect();
    const c = Math.floor((e.clientX - rect.left) * (size / rect.width) / cell);
    const r = Math.floor((e.clientY - rect.top) * (size / rect.height) / cell);
    const idx = r * g + c;
    const bk = blank;
    const br = Math.floor(bk / g), bc = bk % g;
    if ((Math.abs(r - br) + Math.abs(c - bc)) === 1) {
      board[idx] = 15;
      board[blank] = idx;
      blank = idx;
      if (board.every((v, i) => v === i)) won = true;
      draw();
    }
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
