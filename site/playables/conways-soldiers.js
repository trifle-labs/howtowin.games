// Conway's Soldiers — playable canvas implementation
// ~100 lines, click peg then click empty cell two steps diagonally away to jump.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 340);
  canvas.width = size;
  canvas.height = size;
  const statusEl = document.getElementById("playable-status");

  const COLS = 9, ROWS = 8;
  const cell = size / COLS;
  const board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  let selected = null;

  // Initial pegs: rows 4-7, cols 1-7 (edges empty)
  for (let r = 4; r < ROWS; r++) {
    for (let c = 1; c < COLS - 1; c++) {
      board[r][c] = 1;
    }
  }

  function countPegs() {
    let n = 0;
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) if (board[r][c] === 1) n++;
    return n;
  }

  function highestRow() {
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) if (board[r][c] === 1) return r;
    return ROWS;
  }

  function draw() {
    ctx.clearRect(0, 0, size, size);

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const x = c * cell, y = r * cell;
        ctx.fillStyle = "#ccc";
        ctx.fillRect(x, y, cell, cell);
        ctx.strokeStyle = "#888";
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x, y, cell, cell);

        if (board[r][c] === 1) {
          const cx = x + cell / 2, cy = y + cell / 2;
          ctx.beginPath();
          ctx.arc(cx, cy, cell * 0.35, 0, Math.PI * 2);
          ctx.fillStyle = selected && selected[0] === r && selected[1] === c ? "#eb0" : "#e66";
          ctx.fill();
          ctx.strokeStyle = "#333";
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }
    }

    // Firing line between row 3 and 4
    const lineY = 4 * cell;
    ctx.strokeStyle = "#e66";
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(0, lineY);
    ctx.lineTo(size, lineY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#e66";
    ctx.font = "10px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText("firing line", size - 4, lineY - 3);

    const hRow = highestRow();
    const pegs = countPegs();
    statusEl.textContent = pegs === 0 ? "no pegs!" : `highest row: ${hRow} (${pegs} peg${pegs > 1 ? "s" : ""})`;
  }

  function handleClick(e) {
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (size / rect.width);
    const my = (e.clientY - rect.top) * (size / rect.height);
    const c = Math.floor(mx / cell);
    const r = Math.floor(my / cell);
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return;

    if (selected === null) {
      if (board[r][c] === 1) selected = [r, c];
    } else {
      const [sr, sc] = selected;
      if (board[r][c] === 1) {
        // Clicked another peg — reselect (deselect if same peg)
        selected = (r === sr && c === sc) ? null : [r, c];
      } else if (board[r][c] === 0) {
        const dr = r - sr, dc = c - sc;
        if (Math.abs(dr) === 2 && Math.abs(dc) === 2) {
          const mr = sr + dr / 2, mc = sc + dc / 2;
          if (board[mr][mc] === 1) {
            board[sr][sc] = 0;
            board[mr][mc] = 0;
            board[r][c] = 1;
          }
        }
        selected = null;
      } else {
        selected = null;
      }
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
    restart() {
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          board[r][c] = (r >= 4 && c >= 1 && c < COLS - 1) ? 1 : 0;
        }
      }
      selected = null;
      draw();
    }
  };
}
