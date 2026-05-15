// Peg solitaire — playable canvas implementation
// ~100 lines, click peg then click destination to jump.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 340);
  canvas.width = size;
  canvas.height = size;

  const grid = 7, cell = size / grid;
  const board = Array.from({ length: grid }, () => Array(grid).fill(-1));
  let selected = null, won = false;
  const statusEl = document.getElementById("playable-status");

  // Set up English board (cross shape, 33 holes)
  for (let r = 0; r < grid; r++) {
    for (let c = 0; c < grid; c++) {
      const corner = (r < 2 || r > 4) && (c < 2 || c > 4);
      board[r][c] = corner ? -1 : 1;
    }
  }
  board[3][3] = 0; // center empty

  function valid(r, c) { return r >= 0 && r < grid && c >= 0 && c < grid && board[r][c] !== -1; }

  function canJump(r, c, dr, dc) {
    const r2 = r + dr, c2 = c + dc, r3 = r + 2 * dr, c3 = c + 2 * dc;
    return valid(r3, c3) && board[r][c] === 1 && board[r2][c2] === 1 && board[r3][c3] === 0;
  }

  function countPegs() {
    let n = 0;
    for (let r = 0; r < grid; r++) for (let c = 0; c < grid; c++) if (board[r][c] === 1) n++;
    return n;
  }

  function draw() {
    ctx.clearRect(0, 0, size, size);
    const r = cell * 0.4;

    for (let rw = 0; rw < grid; rw++) {
      for (let cl = 0; cl < grid; cl++) {
        if (board[rw][cl] === -1) continue;
        const cx = cl * cell + cell / 2, cy = rw * cell + cell / 2;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        if (board[rw][cl] === 1) {
          ctx.fillStyle = selected && selected[0] === rw && selected[1] === cl ? "#eb0" : "#e66";
          ctx.fill();
          ctx.strokeStyle = "#222";
          ctx.lineWidth = 1.5;
          ctx.stroke();
        } else {
          ctx.fillStyle = "#444";
          ctx.fill();
          ctx.strokeStyle = "#222";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    const pegs = countPegs();
    statusEl.textContent = won ? `solved! (${pegs} peg${pegs > 1 ? "s" : ""})` : `${pegs} pegs`;
  }

  function handleClick(e) {
    if (won) return;
    const rect = canvas.getBoundingClientRect();
    const c = Math.floor((e.clientX - rect.left) * (size / rect.width) / cell);
    const r = Math.floor((e.clientY - rect.top) * (size / rect.height) / cell);
    if (!valid(r, c) || board[r][c] === -1) return;

    if (selected === null) {
      if (board[r][c] === 1) selected = [r, c];
    } else {
      const [sr, sc] = selected;
      const dr = r - sr, dc = c - sc;
      if ((Math.abs(dr) === 2 && dc === 0) || (Math.abs(dc) === 2 && dr === 0)) {
        const dirR = dr / 2, dirC = dc / 2;
        if (canJump(sr, sc, dirR, dirC)) {
          board[sr][sc] = 0;
          board[sr + dirR][sc + dirC] = 0;
          board[r][c] = 1;
          if (countPegs() === 1) won = true;
        }
      }
      selected = null;
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
      for (let r = 0; r < grid; r++) {
        for (let c = 0; c < grid; c++) {
          board[r][c] = (r < 2 || r > 4) && (c < 2 || c > 4) ? -1 : 1;
        }
      }
      board[3][3] = 0;
      selected = null; won = false;
      draw();
    }
  };
}
