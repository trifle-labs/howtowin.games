// Nonograms — playable canvas implementation
// ~160 lines, click to fill, right-click/Ctrl+click to mark X.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 340);
  canvas.width = size;
  canvas.height = size;
  const statusEl = document.getElementById("playable-status");

  const n = 10;
  const solution = [
    [0,0,1,1,1,1,1,0,0,0],
    [0,1,0,0,0,0,0,1,0,0],
    [1,0,0,1,0,1,0,0,1,0],
    [1,0,1,1,1,1,1,1,0,1],
    [1,0,0,1,1,1,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,1,0,0,0,1,0,0,1],
    [0,1,0,1,1,1,0,1,0,0],
    [0,0,0,1,0,1,0,0,0,0],
    [0,0,0,0,1,0,0,0,0,0],
  ];

  // cell state: 0 = empty, 1 = filled (black), 2 = X mark
  const cells = Array.from({ length: n }, () => Array(n).fill(0));

  function computeClues(grid) {
    return grid.map(row => {
      const cl = [];
      let run = 0;
      for (const v of row) {
        if (v) run++;
        else if (run) { cl.push(run); run = 0; }
      }
      if (run) cl.push(run);
      if (!cl.length) cl.push(0);
      return cl;
    });
  }

  const rowClues = computeClues(solution);
  const colClues = computeClues(solution[0].map((_, c) => solution.map(r => r[c])));

  const maxRowClueLen = Math.max(...rowClues.map(c => c.length));
  const maxColClueLen = Math.max(...colClues.map(c => c.length));
  const maxClueLen = Math.max(maxRowClueLen, maxColClueLen);
  const margin = Math.max(16, maxClueLen * 14 + 4);
  const gridSize = size - margin;
  const cellSize = Math.floor(gridSize / n);
  const ox = margin;
  const oy = margin;

  let won = false;

  function checkWin() {
    for (let r = 0; r < n; r++)
      for (let c = 0; c < n; c++)
        if ((cells[r][c] === 1) !== (solution[r][c] === 1)) return false;
    return true;
  }

  function draw() {
    ctx.clearRect(0, 0, size, size);

    const clueSize = Math.min(11, cellSize * 0.38);

    // cell backgrounds
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        const x = ox + c * cellSize, y = oy + r * cellSize;
        const state = cells[r][c];
        if (state === 1) {
          ctx.fillStyle = "#222";
          ctx.fillRect(x, y, cellSize, cellSize);
        } else if (state === 2) {
          ctx.fillStyle = "#eee";
          ctx.fillRect(x, y, cellSize, cellSize);
          ctx.strokeStyle = "#999";
          ctx.lineWidth = 2;
          const p = cellSize * 0.2;
          ctx.beginPath();
          ctx.moveTo(x + p, y + p);
          ctx.lineTo(x + cellSize - p, y + cellSize - p);
          ctx.moveTo(x + cellSize - p, y + p);
          ctx.lineTo(x + p, y + cellSize - p);
          ctx.stroke();
        } else {
          ctx.fillStyle = "#fafafa";
          ctx.fillRect(x, y, cellSize, cellSize);
        }
      }
    }

    // grid lines
    ctx.strokeStyle = "#ccc";
    ctx.lineWidth = 1;
    for (let i = 0; i <= n; i++) {
      ctx.beginPath(); ctx.moveTo(ox, oy + i * cellSize); ctx.lineTo(ox + gridSize, oy + i * cellSize); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(ox + i * cellSize, oy); ctx.lineTo(ox + i * cellSize, oy + gridSize); ctx.stroke();
    }

    // row clues (right-aligned in left margin)
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.font = `bold ${clueSize}px monospace`;
    ctx.fillStyle = "#000";
    for (let r = 0; r < n; r++) {
      const y = oy + r * cellSize + cellSize / 2;
      const cl = rowClues[r];
      let x = ox - 4;
      for (let i = cl.length - 1; i >= 0; i--) {
        ctx.fillText(String(cl[i]), x, y);
        x -= ctx.measureText(String(cl[i])).width + 3;
      }
    }

    // column clues (stacked above each column)
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.font = `bold ${clueSize}px monospace`;
    for (let c = 0; c < n; c++) {
      const x = ox + c * cellSize + cellSize / 2;
      const cl = colClues[c];
      const lineH = clueSize + 2;
      let y = oy - 4;
      for (let i = cl.length - 1; i >= 0; i--) {
        ctx.fillText(String(cl[i]), x, y);
        y -= lineH;
      }
    }

    statusEl.textContent = won ? "solved!" : "Click to fill, right-click for X";
  }

  function handleMouse(e) {
    if (won) return;
    const rect = canvas.getBoundingClientRect();
    const px = (e.clientX - rect.left) * (size / rect.width);
    const py = (e.clientY - rect.top) * (size / rect.height);
    const col = Math.floor((px - ox) / cellSize);
    const row = Math.floor((py - oy) / cellSize);
    if (row < 0 || row >= n || col < 0 || col >= n) return;

    if (e.button === 2 || e.ctrlKey || e.metaKey) {
      cells[row][col] = cells[row][col] === 2 ? 0 : 2;
    } else if (e.button === 0) {
      cells[row][col] = (cells[row][col] + 1) % 3;
    }

    if (checkWin()) won = true;
    draw();
  }

  const preventCtx = e => e.preventDefault();
  canvas.addEventListener("mousedown", handleMouse);
  canvas.addEventListener("contextmenu", preventCtx);

  draw();

  return {
    destroy() {
      canvas.removeEventListener("mousedown", handleMouse);
      canvas.removeEventListener("contextmenu", preventCtx);
      ctx.clearRect(0, 0, size, size);
    },
    restart() {
      for (let r = 0; r < n; r++)
        for (let c = 0; c < n; c++)
          cells[r][c] = 0;
      won = false;
      draw();
    },
    solve() {
      if (won) return;
      for (let r = 0; r < n; r++)
        for (let c = 0; c < n; c++)
          cells[r][c] = solution[r][c] ? 1 : 0;
      won = true;
      draw();
    },
  };
}
