// Sudoku — playable canvas implementation
// Click to select, keyboard to fill. Generates random puzzles
// from a seed for reproducibility.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 340);
  canvas.width = size;
  canvas.height = size;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) {
    const w = canvas.width, h = canvas.height;
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    canvas.width = w * dpr; canvas.height = h * dpr; ctx.scale(dpr, dpr);
  }
  const statusEl = document.getElementById("playable-status");

  const n = 9, cell = size / n;

  let board = Array(81).fill(0);
  let given = Array(81).fill(false);
  let selected = -1, won = false;

  // ── Seeded PRNG (mulberry32) ────────────────────────────
  function mulberry32(a) {
    return function() {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
  }

  function hashSeed(s) {
    let h = 0;
    for (let i = 0; i < s.length; i++) {
      h = ((h << 5) - h) + s.charCodeAt(i);
      h |= 0;
    }
    return h >>> 0;
  }

  function randomId() { return Math.random().toString(36).slice(2, 8); }

  // ── Complete grid generation (backtracking) ─────────────
  function generateComplete(rng) {
    const b = Array(81).fill(0);

    function candidates(idx) {
      const r = Math.floor(idx / 9), c = idx % 9;
      const used = new Set();
      for (let i = 0; i < 9; i++) {
        used.add(b[r * 9 + i]);
        used.add(b[i * 9 + c]);
      }
      const br = Math.floor(r / 3) * 3, bc = Math.floor(c / 3) * 3;
      for (let dr = 0; dr < 3; dr++)
        for (let dc = 0; dc < 3; dc++)
          used.add(b[(br + dr) * 9 + (bc + dc)]);
      const opts = [];
      for (let v = 1; v <= 9; v++) if (!used.has(v)) opts.push(v);
      for (let i = opts.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [opts[i], opts[j]] = [opts[j], opts[i]];
      }
      return opts;
    }

    function solve(idx) {
      if (idx >= 81) return true;
      if (b[idx] !== 0) return solve(idx + 1);
      for (const v of candidates(idx)) {
        b[idx] = v;
        if (solve(idx + 1)) return true;
        b[idx] = 0;
      }
      return false;
    }

    solve(0);
    return b;
  }

  // ── Solver (for verification) ──────────────────────────
  function backtrackSolve(cells) {
    let idx = -1;
    for (let i = 0; i < 81; i++) { if (cells[i] === 0) { idx = i; break; } }
    if (idx < 0) return true;
    const r = Math.floor(idx / 9), c = idx % 9;
    const used = new Set();
    for (let i = 0; i < 9; i++) {
      used.add(cells[r * 9 + i]);
      used.add(cells[i * 9 + c]);
    }
    const br = Math.floor(r / 3) * 3, bc = Math.floor(c / 3) * 3;
    for (let dr = 0; dr < 3; dr++)
      for (let dc = 0; dc < 3; dc++)
        used.add(cells[(br + dr) * 9 + (bc + dc)]);
    for (let v = 1; v <= 9; v++) {
      if (!used.has(v)) {
        cells[idx] = v;
        if (backtrackSolve(cells)) return true;
        cells[idx] = 0;
      }
    }
    return false;
  }

  // ── Puzzle creation (remove cells while staying solvable) ─
  function createPuzzle(complete, rng) {
    const puzzle = [...complete];
    const indices = [...Array(81).keys()];
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    const targetClues = 32;
    let removed = 0;

    for (const idx of indices) {
      if (81 - removed <= targetClues) break;
      const saved = puzzle[idx];
      puzzle[idx] = 0;
      const copy = [...puzzle];
      if (backtrackSolve(copy)) {
        removed++;
      } else {
        puzzle[idx] = saved;
      }
    }

    return puzzle;
  }

  function loadPuzzle(seed) {
    const rng = mulberry32(hashSeed(seed));
    const complete = generateComplete(rng);
    const puzzle = createPuzzle(complete, rng);
    board = [...puzzle];
    given = puzzle.map(v => v !== 0);
    selected = -1; won = false;
    draw();
  }

  // ── Drawing ──────────────────────────────────────────────
  function draw() {
    ctx.clearRect(0, 0, size, size);

    if (selected >= 0) {
      const r = Math.floor(selected / 9), c = selected % 9;
      ctx.fillStyle = "#dde";
      ctx.fillRect(c * cell, r * cell, cell, cell);
    }

    ctx.strokeStyle = "#333";
    ctx.lineWidth = 1;
    for (let i = 0; i <= n; i++) {
      ctx.beginPath(); ctx.moveTo(i * cell, 0); ctx.lineTo(i * cell, size); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * cell); ctx.lineTo(size, i * cell); ctx.stroke();
    }

    ctx.lineWidth = 3;
    for (let i = 0; i <= 3; i++) {
      ctx.beginPath(); ctx.moveTo(i * 3 * cell, 0); ctx.lineTo(i * 3 * cell, size); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * 3 * cell); ctx.lineTo(size, i * 3 * cell); ctx.stroke();
    }

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `${Math.round(cell * 0.5)}px sans-serif`;
    for (let i = 0; i < 81; i++) {
      const v = board[i];
      if (v === 0) continue;
      ctx.fillStyle = given[i] ? "#222" : "#48a";
      ctx.fillText(v, (i % 9) * cell + cell / 2, Math.floor(i / 9) * cell + cell / 2 + 1);
    }

    statusEl.textContent = won ? "solved!" : "click cell, type 1-9";
  }

  // ── Event handlers ──────────────────────────────────────
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
    if ((e.key === "Backspace" || e.key === "Delete") && selected >= 0) e.preventDefault();
    if (selected < 0 || won || given[selected]) return;

    if (e.key >= "1" && e.key <= "9") {
      board[selected] = parseInt(e.key, 10);
      won = checkComplete();
      draw();
    } else if (e.key === "Backspace" || e.key === "Delete") {
      board[selected] = 0;
      won = false;
      draw();
    }
  }

  function checkComplete() {
    for (let i = 0; i < 81; i++) if (board[i] === 0) return false;
    for (let r = 0; r < 9; r++) {
      const s = new Set();
      for (let c = 0; c < 9; c++) { const v = board[r * 9 + c]; if (s.has(v)) return false; s.add(v); }
    }
    for (let c = 0; c < 9; c++) {
      const s = new Set();
      for (let r = 0; r < 9; r++) { const v = board[r * 9 + c]; if (s.has(v)) return false; s.add(v); }
    }
    for (let br = 0; br < 3; br++) {
      for (let bc = 0; bc < 3; bc++) {
        const s = new Set();
        for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) { const v = board[(br * 3 + r) * 9 + (bc * 3 + c)]; if (s.has(v)) return false; s.add(v); }
      }
    }
    return true;
  }

  // ── Wire up seed input ─────────────────────────────────
  const seedRow = document.getElementById("playable-seed-row");
  const seedInput = document.getElementById("playable-seed");
  const newGameBtn = document.getElementById("playable-new-game");

  if (seedRow) seedRow.classList.remove("hidden");

  function newGame() {
    let seed = seedInput ? seedInput.value.trim() : "";
    if (!seed) {
      seed = randomId();
      if (seedInput) seedInput.value = seed;
    }
    loadPuzzle(seed);
  }

  if (newGameBtn) newGameBtn.addEventListener("click", newGame);
  // Also generate new game when enter is pressed in the seed input
  if (seedInput) seedInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") newGame();
  });

  // Initialize with a random puzzle
  const initSeed = randomId();
  if (seedInput) seedInput.value = initSeed;
  loadPuzzle(initSeed);

  canvas.setAttribute("tabindex", "0");
  canvas.addEventListener("click", handleClick);
  canvas.addEventListener("keydown", handleKey);

  return {
    destroy() {
      canvas.removeEventListener("click", handleClick);
      canvas.removeEventListener("keydown", handleKey);
      if (seedRow) seedRow.classList.add("hidden");
      if (newGameBtn) newGameBtn.removeEventListener("click", newGame);
      ctx.clearRect(0, 0, size, size);
    },
    restart() {
      const seed = randomId();
      if (seedInput) seedInput.value = seed;
      loadPuzzle(seed);
    },
    solve() {
      if (won) return;
      const copy = [...board];
      if (backtrackSolve(copy)) {
        for (let i = 0; i < 81; i++) board[i] = copy[i];
        won = true;
        draw();
      }
    }
  };
}
