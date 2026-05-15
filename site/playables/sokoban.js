// Sokoban — playable canvas implementation
// ~120 lines, arrow keys to push boxes onto targets.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 340);
  canvas.width = size;
  canvas.height = size;

  const statusEl = document.getElementById("playable-status");

  // Simple level: #=wall, .=target, $=box, @=player, *=box on target, +=player on target
  const level = [
    "#####",
    "#  .#",
    "# $ #",
    "# @ #",
    "#####"
  ];

  let rows = level.length, cols = level[0].length;
  let cell, board, playerR, playerC, targets, won, moves;

  function reset() {
    rows = level.length; cols = level[0].length;
    cell = size / cols;
    board = [];
    targets = [];
    for (let r = 0; r < rows; r++) {
      board[r] = [];
      for (let c = 0; c < cols; c++) {
        const ch = level[r][c];
        board[r][c] = ch === "#" ? -1 : 0;
        if (ch === "." || ch === "+" || ch === "*") targets.push(r * cols + c);
        if (ch === "$" || ch === "*") board[r][c] = 2; // box
        if (ch === "@" || ch === "+") { playerR = r; playerC = c; }
      }
    }
    won = false; moves = 0;
  }
  reset();

  function allBoxesOnTargets() {
    for (const t of targets) {
      const r = Math.floor(t / cols), c = t % cols;
      if (board[r][c] !== 2) return false;
    }
    return true;
  }

  function draw() {
    ctx.clearRect(0, 0, size, size);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * cell, y = r * cell;
        if (board[r][c] === -1) {
          ctx.fillStyle = "#444";
          ctx.fillRect(x, y, cell, cell);
        } else {
          ctx.fillStyle = "#eee";
          ctx.fillRect(x, y, cell, cell);
        }
        ctx.strokeStyle = "#ccc";
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x, y, cell, cell);
      }
    }
    // Targets
    for (const t of targets) {
      const r = Math.floor(t / cols), c = t % cols;
      ctx.fillStyle = "#4a4";
      ctx.beginPath();
      ctx.arc(c * cell + cell / 2, r * cell + cell / 2, cell * 0.15, 0, Math.PI * 2);
      ctx.fill();
    }
    // Boxes
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (board[r][c] === 2) {
          ctx.fillStyle = "#e66";
          ctx.fillRect(c * cell + 3, r * cell + 3, cell - 6, cell - 6);
          ctx.strokeStyle = "#a44";
          ctx.lineWidth = 1.5;
          ctx.strokeRect(c * cell + 3, r * cell + 3, cell - 6, cell - 6);
        }
      }
    }
    // Player
    ctx.fillStyle = "#48a";
    ctx.beginPath();
    ctx.arc(playerC * cell + cell / 2, playerR * cell + cell / 2, cell * 0.35, 0, Math.PI * 2);
    ctx.fill();

    statusEl.textContent = won ? `solved in ${moves} moves!` : `moves: ${moves}`;
  }

  function move(dr, dc) {
    if (won) return;
    const nr = playerR + dr, nc = playerC + dc;
    if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) return;
    if (board[nr][nc] === -1) return;
    if (board[nr][nc] === 2) {
      const br = nr + dr, bc = nc + dc;
      if (br < 0 || br >= rows || bc < 0 || bc >= cols) return;
      if (board[br][bc] !== 0) return;
      board[nr][nc] = 0;
      board[br][bc] = 2;
    }
    playerR = nr; playerC = nc;
    moves++;
    if (allBoxesOnTargets()) won = true;
    draw();
  }

  function handleKey(e) {
    switch (e.key) {
      case "ArrowUp": e.preventDefault(); move(-1, 0); break;
      case "ArrowDown": e.preventDefault(); move(1, 0); break;
      case "ArrowLeft": e.preventDefault(); move(0, -1); break;
      case "ArrowRight": e.preventDefault(); move(0, 1); break;
    }
  }

  // Focus canvas for keyboard
  canvas.setAttribute("tabindex", "0");
  canvas.addEventListener("keydown", handleKey);
  // Click to focus
  canvas.addEventListener("click", () => canvas.focus());
  canvas.focus();
  draw();

  return {
    destroy() {
      canvas.removeEventListener("keydown", handleKey);
      canvas.removeAttribute("tabindex");
      ctx.clearRect(0, 0, size, size);
    },
    restart() { reset(); draw(); canvas.focus(); }
  };
}
