// Sudoku — playable canvas implementation
// ~150 lines, click to select, keyboard to fill.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 340);
  canvas.width = size;
  canvas.height = size;
  const statusEl = document.getElementById("playable-status");

  const n = 9;
  const cell = size / n;

  const puzzle = [
    [5,3,0,0,7,0,0,0,0],
    [6,0,0,1,9,5,0,0,0],
    [0,9,8,0,0,0,0,6,0],
    [8,0,0,0,6,0,0,0,3],
    [4,0,0,8,0,3,0,0,1],
    [7,0,0,0,2,0,0,0,6],
    [0,6,0,0,0,0,2,8,0],
    [0,0,0,4,1,9,0,0,5],
    [0,0,0,0,8,0,0,7,9],
  ];

  const puzzleData = puzzle.flat();
  const board = [...puzzleData];
  const given = puzzleData.map(v => v !== 0);

  let selected = -1;
  let won = false;

  function checkComplete() {
    for (let i = 0; i < 81; i++) if (board[i] === 0) return false;
    // rows
    for (let r = 0; r < 9; r++) {
      const s = new Set();
      for (let c = 0; c < 9; c++) { const v = board[r * 9 + c]; if (s.has(v)) return false; s.add(v); }
    }
    // columns
    for (let c = 0; c < 9; c++) {
      const s = new Set();
      for (let r = 0; r < 9; r++) { const v = board[r * 9 + c]; if (s.has(v)) return false; s.add(v); }
    }
    // boxes
    for (let br = 0; br < 3; br++) {
      for (let bc = 0; bc < 3; bc++) {
        const s = new Set();
        for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) { const v = board[(br * 3 + r) * 9 + (bc * 3 + c)]; if (s.has(v)) return false; s.add(v); }
      }
    }
    return true;
  }

  function draw() {
    ctx.clearRect(0, 0, size, size);

    // selection highlight
    if (selected >= 0) {
      const r = Math.floor(selected / 9), c = selected % 9;
      ctx.fillStyle = "#dde";
      ctx.fillRect(c * cell, r * cell, cell, cell);
    }

    // thin grid lines
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 1;
    for (let i = 0; i <= n; i++) {
      ctx.beginPath(); ctx.moveTo(i * cell, 0); ctx.lineTo(i * cell, size); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * cell); ctx.lineTo(size, i * cell); ctx.stroke();
    }

    // thick 3x3 block borders
    ctx.lineWidth = 3;
    for (let i = 0; i <= 3; i++) {
      ctx.beginPath(); ctx.moveTo(i * 3 * cell, 0); ctx.lineTo(i * 3 * cell, size); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * 3 * cell); ctx.lineTo(size, i * 3 * cell); ctx.stroke();
    }

    // numbers
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `${Math.round(cell * 0.5)}px sans-serif`;
    for (let i = 0; i < 81; i++) {
      const v = board[i];
      if (v === 0) continue;
      ctx.fillStyle = given[i] ? "#222" : "#48a";
      ctx.fillText(v, (i % 9) * cell + cell / 2, Math.floor(i / 9) * cell + cell / 2 + 1);
    }

    statusEl.textContent = won ? "solved!" : "Click cell, type 1-9";
  }

  function handleClick(e) {
    if (won) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (size / rect.width);
    const y = (e.clientY - rect.top) * (size / rect.height);
    const c = Math.floor(x / cell), r = Math.floor(y / cell);
    if (r >= 0 && r < n && c >= 0 && c < n) {
      selected = r * 9 + c;
      canvas.focus({ preventScroll: true });
      draw();
    }
  }

  function handleKey(e) {
    if (e.key === "Backspace" || e.key === "Delete") e.preventDefault();
    if (selected < 0 || won) return;
    if (given[selected]) return;

    if (e.key >= "1" && e.key <= "9") {
      board[selected] = parseInt(e.key, 10);
      if (checkComplete()) won = true;
      draw();
    } else if (e.key === "Backspace" || e.key === "Delete") {
      board[selected] = 0;
      won = false;
      draw();
    }
  }

  canvas.setAttribute("tabindex", "0");
  canvas.addEventListener("click", handleClick);
  canvas.addEventListener("keydown", handleKey);

  draw();

  return {
    destroy() {
      canvas.removeEventListener("click", handleClick);
      canvas.removeEventListener("keydown", handleKey);
      ctx.clearRect(0, 0, size, size);
    },
    restart() {
      for (let i = 0; i < 81; i++) board[i] = puzzleData[i];
      selected = -1;
      won = false;
      draw();
    },
  };
}
