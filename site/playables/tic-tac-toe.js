// Tic-Tac-Toe — playable canvas implementation
// Complexity: ~150 lines, single file, pure canvas 2D.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 360);
  const cell = size / 3;
  canvas.width = size;
  canvas.height = size;

  let board = Array(9).fill(null);
  let turn = "X";
  let winner = null;
  let statusEl = document.getElementById("playable-status");

  function draw() {
    ctx.clearRect(0, 0, size, size);

    // grid lines (2px, dark)
    ctx.strokeStyle = "#222";
    ctx.lineWidth = 2;
    for (let i = 1; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cell, 0);
      ctx.lineTo(i * cell, size);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cell);
      ctx.lineTo(size, i * cell);
      ctx.stroke();
    }

    // marks
    ctx.font = `${Math.round(cell * 0.6)}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let i = 0; i < 9; i++) {
      if (!board[i]) continue;
      const x = (i % 3) * cell + cell / 2;
      const y = Math.floor(i / 3) * cell + cell / 2;
      if (board[i] === "X") {
        ctx.fillStyle = "#e66";
        ctx.fillText("×", x, y + 2);
      } else {
        ctx.fillStyle = "#48a";
        ctx.fillText("○", x, y + 2);
      }
    }

    // status
    if (winner) {
      statusEl.textContent = winner === "draw" ? "draw!" : `${winner} wins!`;
    } else {
      statusEl.textContent = `${turn} to play`;
    }
  }

  function checkWinner() {
    const lines = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    for (const [a,b,c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
    }
    return board.every(Boolean) ? "draw" : null;
  }

  function handleClick(e) {
    if (winner) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (size / rect.width);
    const y = (e.clientY - rect.top) * (size / rect.height);
    const col = Math.floor(x / cell);
    const row = Math.floor(y / cell);
    const idx = row * 3 + col;
    if (board[idx]) return;
    board[idx] = turn;
    winner = checkWinner();
    if (!winner) turn = turn === "X" ? "O" : "X";
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
      board = Array(9).fill(null);
      turn = "X";
      winner = null;
      draw();
    }
  };
}
