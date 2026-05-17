// Minesweeper — playable canvas implementation
// ~150 lines, click to reveal, Shift+click to flag.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 340);
  canvas.width = size;
  canvas.height = size;

  const g = 9, mines = 10, cell = size / g;
  let board, revealed, flags, over, won;
  const statusEl = document.getElementById("playable-status");

  function init() {
    board = Array.from({ length: g * g }, () => 0);
    revealed = Array(g * g).fill(false);
    flags = Array(g * g).fill(false);
    over = false; won = false;

    // Place mines (avoid first click)
    let placed = 0;
    while (placed < mines) {
      const i = Math.floor(Math.random() * g * g);
      if (board[i] === -1) continue;
      board[i] = -1;
      placed++;
    }
    // Compute numbers
    for (let i = 0; i < g * g; i++) {
      if (board[i] === -1) continue;
      const r = Math.floor(i / g), c = i % g;
      let n = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < g && nc >= 0 && nc < g && board[nr * g + nc] === -1) n++;
        }
      }
      board[i] = n;
    }
  }
  init();

  function reveal(i) {
    if (revealed[i] || flags[i]) return;
    revealed[i] = true;
    if (board[i] === 0) {
      const r = Math.floor(i / g), c = i % g;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < g && nc >= 0 && nc < g) reveal(nr * g + nc);
        }
      }
    }
  }

  function checkWin() {
    let safe = 0, rev = 0;
    for (let i = 0; i < g * g; i++) {
      if (board[i] !== -1) safe++;
      if (revealed[i]) rev++;
    }
    return rev === safe;
  }

  function draw() {
    ctx.clearRect(0, 0, size, size);
    for (let i = 0; i < g * g; i++) {
      const x = (i % g) * cell, y = Math.floor(i / g) * cell;
      ctx.fillStyle = "#ccc";
      ctx.fillRect(x, y, cell, cell);
      ctx.strokeStyle = "#999";
      ctx.lineWidth = 0.5;
      ctx.strokeRect(x, y, cell, cell);

      if (revealed[i]) {
        ctx.fillStyle = over && board[i] === -1 ? "#e66" : "#ddd";
        ctx.fillRect(x + 1, y + 1, cell - 2, cell - 2);
        if (board[i] === -1) {
          ctx.fillStyle = "#222";
          ctx.font = `${Math.round(cell * 0.5)}px sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("✱", x + cell / 2, y + cell / 2);
        } else if (board[i] > 0) {
          const clrs = ["#48a", "#6b4", "#e66", "#a3c", "#a35", "#3aa", "#222", "#666"];
          ctx.fillStyle = clrs[board[i] - 1] || "#222";
          ctx.font = `bold ${Math.round(cell * 0.45)}px sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(board[i], x + cell / 2, y + cell / 2);
        }
      } else if (flags[i]) {
        ctx.fillStyle = "#e66";
        ctx.font = `${Math.round(cell * 0.45)}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("⚑", x + cell / 2, y + cell / 2 + 1);
      } else {
        ctx.fillStyle = "#bbb";
        ctx.fillRect(x + 2, y + 2, cell - 4, cell - 4);
        ctx.fillStyle = "#ddd";
        ctx.fillRect(x + 2, y + 2, cell - 4, (cell - 4) * 0.4);
      }
    }
    if (over) statusEl.textContent = "boom!";
    else if (won) statusEl.textContent = "all clear!";
    else statusEl.textContent = `${flags.filter(Boolean).length}⚑ / ${mines}`;
  }

  function handleClick(e) {
    if (over || won) return;
    const rect = canvas.getBoundingClientRect();
    const c = Math.floor((e.clientX - rect.left) * (size / rect.width) / cell);
    const r = Math.floor((e.clientY - rect.top) * (size / rect.height) / cell);
    const i = r * g + c;
    if (i < 0 || i >= g * g) return;

    if (e.shiftKey) {
      if (!revealed[i]) { flags[i] = !flags[i]; draw(); return; }
    }
    if (flags[i]) return;
    if (board[i] === -1) { over = true; reveal(i); draw(); return; }
    reveal(i);
    if (checkWin()) won = true;
    draw();
  }

  // ── Solver (simple constraint-based) ──────────────────────
  function solverStep() {
    let changed = false;
    for (let i = 0; i < g * g; i++) {
      if (!revealed[i] || board[i] <= 0) continue;
      const r = Math.floor(i / g), c = i % g;
      const hidden = [], flagged = [];
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr, nc = c + dc;
          if (nr < 0 || nr >= g || nc < 0 || nc >= g) continue;
          const ni = nr * g + nc;
          if (revealed[ni]) continue;
          if (flags[ni]) flagged.push(ni);
          else hidden.push(ni);
        }
      }
      // Rule 1: if all mines are flagged, reveal rest
      if (flagged.length === board[i] && hidden.length > 0) {
        for (const hi of hidden) {
          reveal(hi);
          if (board[hi] === -1) { over = true; return false; }
          changed = true;
        }
        if (checkWin()) { won = true; return false; }
      }
      // Rule 2: number of hidden cells equals remaining mine count → flag them all
      const remaining = board[i] - flagged.length;
      if (remaining === hidden.length && hidden.length > 0) {
        for (const hi of hidden) flags[hi] = true;
        changed = true;
      }
    }
    return changed;
  }

  canvas.addEventListener("click", handleClick);
  draw();

  return {
    destroy() {
      canvas.removeEventListener("click", handleClick);
      ctx.clearRect(0, 0, size, size);
    },
    restart() { init(); over = false; won = false; draw(); },
    solve() {
      if (over || won) return;
      // Try constraint deduction first; if stuck, reveal a random unrevealed non-mine cell
      const changed = solverStep();
      draw();
      if (over || won) return;
      if (!changed) {
        // Find unrevealed non-flagged cells; prefer ones we know are safe (board value >= 0)
        const safe = [];
        const unknown = [];
        for (let i = 0; i < g * g; i++) {
          if (!revealed[i] && !flags[i]) {
            if (board[i] !== -1) safe.push(i);
            else unknown.push(i);
          }
        }
        const pool = safe.length ? safe : unknown;
        if (!pool.length) return;
        const idx = pool[Math.floor(Math.random() * pool.length)];
        if (board[idx] === -1) { over = true; reveal(idx); draw(); return; }
        reveal(idx);
        if (checkWin()) won = true;
        draw();
      }
    }
  };
}
