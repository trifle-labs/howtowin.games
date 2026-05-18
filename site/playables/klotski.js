// Klotski — playable canvas implementation
// ~130 lines, click block to select, click direction to slide.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 340);
  canvas.width = size;
  canvas.height = size;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) {
    const w = canvas.width, h = canvas.height;
    canvas.style.width = w + 'px';    canvas.width = w * dpr; canvas.height = h * dpr; ctx.scale(dpr, dpr);
  }

  const cols = 4, rows = 5;
  const cell = size / Math.max(cols, rows);
  const ox = (size - cols * cell) / 2;
  const statusEl = document.getElementById("playable-status");

  // Block { id, r, c, w, h, color }
  let blocks, selected = null, won = false, moves = 0, solveTimer = null;

  // Classic "Heng Da Li Ma" — boss 2x2 must reach bottom-center exit
  function defaultPuzzle() {
    return [
      { id: 0, r: 0, c: 1, w: 2, h: 2, color: "#e44" }, // boss
      { id: 1, r: 0, c: 0, w: 1, h: 2, color: "#48a" },
      { id: 2, r: 0, c: 3, w: 1, h: 2, color: "#48a" },
      { id: 3, r: 2, c: 0, w: 2, h: 1, color: "#6b4" },
      { id: 4, r: 2, c: 2, w: 2, h: 1, color: "#6b4" },
      { id: 5, r: 3, c: 0, w: 1, h: 1, color: "#e90" },
      { id: 6, r: 3, c: 3, w: 1, h: 1, color: "#e90" },
      { id: 7, r: 4, c: 0, w: 1, h: 1, color: "#a6c" },
      { id: 8, r: 4, c: 3, w: 1, h: 1, color: "#a6c" },
    ];
  }

  function reset() {
    blocks = defaultPuzzle().map(b => ({ ...b }));
    selected = null; won = false; moves = 0;
  }
  reset();

  function grid() {
    const g = Array.from({ length: rows * cols }, () => -1);
    for (const b of blocks) {
      for (let dr = 0; dr < b.h; dr++)
        for (let dc = 0; dc < b.w; dc++)
          g[(b.r + dr) * cols + (b.c + dc)] = b.id;
    }
    return g;
  }

  function canFit(b, nr, nc) {
    if (nr < 0 || nc < 0 || nr + b.h > rows || nc + b.w > cols) return false;
    const g = grid();
    for (let dr = 0; dr < b.h; dr++)
      for (let dc = 0; dc < b.w; dc++) {
        const gi = (nr + dr) * cols + (nc + dc);
        if (g[gi] !== -1 && g[gi] !== b.id) return false;
      }
    return true;
  }

  function draw() {
    ctx.clearRect(0, 0, size, size);
    for (let i = 0; i <= cols; i++) {
      const x = ox + i * cell;
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, rows * cell); ctx.stroke();
    }
    for (let i = 0; i <= rows; i++) {
      ctx.beginPath(); ctx.moveTo(ox, i * cell); ctx.lineTo(ox + cols * cell, i * cell); ctx.stroke();
    }
    // Exit gateway at bottom centre
    const exitH = Math.round(cell * 0.18);
    ctx.fillStyle = won ? "#4a4" : "#d88";
    ctx.fillRect(ox + cell, rows * cell - exitH, cell * 2, exitH);
    ctx.fillStyle = won ? "#4a4" : "#c44";
    ctx.font = `bold ${Math.round(cell * 0.16)}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText("▽ EXIT", ox + cell * 2, rows * cell - exitH - 2);

    for (const b of blocks) {
      const x = ox + b.c * cell, y = b.r * cell;
      ctx.fillStyle = selected === b.id ? "#ff8" : b.color;
      ctx.fillRect(x + 1, y + 1, b.w * cell - 2, b.h * cell - 2);
      ctx.strokeStyle = "#222";
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 1, y + 1, b.w * cell - 2, b.h * cell - 2);
    }

    // Direction indicators for selected block
    if (selected !== null) {
      const b = blocks[selected];
      for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
        if (!canFit(b, b.r + dr, b.c + dc)) continue;
        const cx = ox + (b.c + (dc ? (dc > 0 ? b.w : 0) : b.w / 2)) * cell;
        const cy = (b.r + (dr ? (dr > 0 ? b.h : 0) : b.h / 2)) * cell;
        const off = dr ? (dr > 0 ? 1 : -1) * cell * 0.45 : 0;
        const off2 = dc ? (dc > 0 ? 1 : -1) * cell * 0.45 : 0;
        const ax = cx + off2, ay = cy + off;
        const s = cell * 0.08;
        ctx.fillStyle = "#4a4";
        ctx.beginPath();
        if (dr === -1) { ctx.moveTo(ax, ay - s); ctx.lineTo(ax - s, ay + s); ctx.lineTo(ax + s, ay + s); }
        else if (dr === 1) { ctx.moveTo(ax, ay + s); ctx.lineTo(ax - s, ay - s); ctx.lineTo(ax + s, ay - s); }
        else if (dc === -1) { ctx.moveTo(ax - s, ay); ctx.lineTo(ax + s, ay - s); ctx.lineTo(ax + s, ay + s); }
        else if (dc === 1) { ctx.moveTo(ax + s, ay); ctx.lineTo(ax - s, ay - s); ctx.lineTo(ax - s, ay + s); }
        ctx.closePath();
        ctx.fill();
      }
    }
    statusEl.textContent = won ? `solved in ${moves} moves!` : `${moves} moves`;
  }

  function handleClick(e) {
    if (won) return;
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (size / rect.width);
    const my = (e.clientY - rect.top) * (size / rect.height);
    const c = Math.floor((mx - ox) / cell);
    const r = Math.floor(my / cell);
    const gd = grid();
    const hit = r >= 0 && r < rows && c >= 0 && c < cols ? gd[r * cols + c] : -1;

    if (selected !== null) {
      const b = blocks[selected];
      if (hit === selected) { selected = null; draw(); return; }
      // Clicked empty — slide block toward click
      if (hit === -1) {
        const centerR = b.r + b.h / 2, centerC = b.c + b.w / 2;
        const dr = r + 0.5 - centerR, dc = c + 0.5 - centerC;
        if (Math.abs(dr) > Math.abs(dc)) {
          const dir = dr > 0 ? 1 : -1;
          if (canFit(b, b.r + dir, b.c)) { b.r += dir; moves++; }
        } else {
          const dir = dc > 0 ? 1 : -1;
          if (canFit(b, b.r, b.c + dir)) { b.c += dir; moves++; }
        }
        if (b.id === 0 && b.r === 3 && b.c === 1) won = true;
      }
      selected = null;
      draw();
      return;
    }

    if (hit >= 0) { selected = hit; draw(); }
  }

  // ── BFS solver with canonical dedup ─────────────────────
  // Fold identical-shaped blocks into equivalence classes to
  // reduce the state space (distinct IDs inflate it ~6×).

  function dedupKey(g) {
    // boss (0): always unique
    let s = "b:" + g.indexOf(0);
    // vertical 1×2 blocks (IDs 1-2): sort top cells
    const verts = [];
    for (let i = 0; i < g.length; i++)
      if ((g[i] === 1 || g[i] === 2) && (i < cols || g[i - cols] !== g[i]))
        verts.push(i);
    verts.sort((a, b) => a - b);
    s += ";v:" + verts.join(",");
    // horizontal 2×1 blocks (IDs 3-4): sort leftmost cells
    const hors = [];
    for (let i = 0; i < g.length; i++)
      if ((g[i] === 3 || g[i] === 4) && (i % cols === 0 || g[i - 1] !== g[i]))
        hors.push(i);
    hors.sort((a, b) => a - b);
    s += ";h:" + hors.join(",");
    // single 1×1 blocks (IDs 5-8): sort positions
    const singles = [];
    for (let i = 0; i < g.length; i++)
      if (g[i] >= 5) singles.push(i);
    singles.sort((a, b) => a - b);
    s += ";s:" + singles.join(",");
    return s;
  }

  function bfsSolve(startBlocks) {
    const defs = startBlocks.map(b => ({ w: b.w, h: b.h }));
    const startGrid = Array.from({ length: rows * cols }, () => -1);
    for (const b of startBlocks)
      for (let dr = 0; dr < b.h; dr++)
        for (let dc = 0; dc < b.w; dc++)
          startGrid[(b.r + dr) * cols + (b.c + dc)] = b.id;
    const startKey = startGrid.join(",");
    const startDedup = dedupKey(startGrid);
    // parent: dedup key → { fromDedup, rawKey, blockId, dr, dc } | null
    const parent = new Map();
    parent.set(startDedup, null);
    const queue = [startKey];
    let qIdx = 0;
    const maxNodes = 500000;
    const startTime = Date.now();

    while (qIdx < queue.length && qIdx < maxNodes && Date.now() - startTime < 10000) {
      const curKey = queue[qIdx++];
      const g = curKey.split(",").map(Number);

      // Decode block positions from grid
      const pos = defs.map((_, bi) => {
        const idx = g.indexOf(bi);
        return { r: Math.floor(idx / cols), c: idx % cols };
      });

      // Check if solved (boss at exit)
      if (pos[0].r === 3 && pos[0].c === 1) {
        const path = [];
        let dk = dedupKey(g);
        while (parent.get(dk) !== null) {
          const entry = parent.get(dk);
          path.unshift(entry);
          dk = entry.fromDedup;
        }
        return path;
      }

      for (let bi = 0; bi < defs.length; bi++) {
        const { w, h } = defs[bi];
        const { r, c } = pos[bi];
        for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
          const nr = r + dr, nc = c + dc;
          if (nr < 0 || nc < 0 || nr + h > rows || nc + w > cols) continue;
          // Check cells in new position
          let ok = true;
          for (let dr2 = 0; dr2 < h && ok; dr2++)
            for (let dc2 = 0; dc2 < w && ok; dc2++)
              if (g[(nr + dr2) * cols + (nc + dc2)] !== -1 &&
                  g[(nr + dr2) * cols + (nc + dc2)] !== bi) ok = false;
          if (!ok) continue;
          // Build new grid: clear old, fill new
          const ng = g.slice();
          for (let dr2 = 0; dr2 < h; dr2++)
            for (let dc2 = 0; dc2 < w; dc2++)
              ng[(r + dr2) * cols + (c + dc2)] = -1;
          for (let dr2 = 0; dr2 < h; dr2++)
            for (let dc2 = 0; dc2 < w; dc2++)
              ng[(nr + dr2) * cols + (nc + dc2)] = bi;
          const rawKey = ng.join(",");
          const dKey = dedupKey(ng);
          if (!parent.has(dKey)) {
            parent.set(dKey, { fromDedup: dedupKey(g), rawKey, blockId: bi, dr, dc });
            queue.push(rawKey);
          }
        }
      }
    }
    console.log("klotski bfs: explored " + qIdx + "/" + parent.size + " states in " + (Date.now() - startTime) + "ms");
    return null;
  }

  canvas.addEventListener("click", handleClick);
  draw();

  return {
    destroy() {
      canvas.removeEventListener("click", handleClick);
      if (solveTimer) { clearInterval(solveTimer); solveTimer = null; }
      ctx.clearRect(0, 0, size, size);
    },
    restart() {
      if (solveTimer) { clearInterval(solveTimer); solveTimer = null; }
      reset(); draw();
    },
    solve() {
      if (won || solveTimer) return;
      statusEl.textContent = "solving…";
      draw();
      setTimeout(() => {
        // Reset to initial state BEFORE solving so the animation path matches
        reset();
        draw();
        const path = bfsSolve(blocks);
        if (!path) { draw(); statusEl.textContent = "no solution found"; return; }
        let i = 0;
        solveTimer = setInterval(() => {
          if (i >= path.length) {
            clearInterval(solveTimer);
            solveTimer = null;
            won = true;
            draw();
            return;
          }
          const step = path[i];
          const b = blocks[step.blockId];
          b.r += step.dr;
          b.c += step.dc;
          moves++;
          if (b.id === 0 && b.r === 3 && b.c === 1) won = true;
          draw();
          i++;
        }, 200);
      }, 50);
    }
  };
}
