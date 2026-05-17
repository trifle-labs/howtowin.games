// 15 puzzle — playable canvas implementation
// Click tile adjacent to empty space to slide.
// Solve replays the inverse of the random-walk scramble (guaranteed to work).

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 320);
  canvas.width = size;
  canvas.height = size;

  const g = 4, cell = size / g;
  let board, blank, won = false, solveTimer = null;
  let scrambleSeq = []; // blank position after each scramble step
  let dirty = false; // true if user has interacted
  const statusEl = document.getElementById("playable-status");

  function init() {
    board = Array.from({ length: 16 }, (_, i) => i);
    blank = 15;
    scrambleSeq = [];
    const steps = 80 + Math.floor(Math.random() * 40); // 80-119 random slides
    for (let s = 0; s < steps; s++) {
      const br = Math.floor(blank / 4), bc = blank % 4;
      const nbrs = [];
      for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
        const nr = br + dr, nc = bc + dc;
        if (nr >= 0 && nr < 4 && nc >= 0 && nc < 4) nbrs.push(nr * 4 + nc);
      }
      // Avoid immediately reversing the last move
      let candidates = nbrs;
      if (scrambleSeq.length > 0) {
        const last = scrambleSeq[scrambleSeq.length - 1];
        const filtered = nbrs.filter(ni => ni !== last);
        if (filtered.length > 0) candidates = filtered;
      }
      const ni = candidates[Math.floor(Math.random() * candidates.length)];
      board[blank] = board[ni];
      board[ni] = 15;
      blank = ni;
      scrambleSeq.push(ni);
    }
    dirty = false;
  }
  init();

  function draw() {
    ctx.clearRect(0, 0, size, size);
    for (let i = 0; i < 16; i++) {
      if (board[i] === 15) continue;
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
    dirty = true;
    const rect = canvas.getBoundingClientRect();
    const c = Math.floor((e.clientX - rect.left) * (size / rect.width) / cell);
    const r = Math.floor((e.clientY - rect.top) * (size / rect.height) / cell);
    const idx = r * g + c;
    const bk = blank;
    const br = Math.floor(bk / g), bc = bk % g;
    if ((Math.abs(r - br) + Math.abs(c - bc)) === 1) {
      const val = board[idx];
      board[blank] = val;
      board[idx] = 15;
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
      if (solveTimer) { clearInterval(solveTimer); solveTimer = null; }
      ctx.clearRect(0, 0, size, size);
    },
    restart() {
      if (solveTimer) { clearInterval(solveTimer); solveTimer = null; }
      init(); won = false; draw();
    },
    solve() {
      if (won || solveTimer) return;
      // If user hasn't touched the board, replay the reverse scramble (fast, guaranteed)
      if (!dirty) {
        const seq = [...scrambleSeq].reverse();
        draw();
        statusEl.textContent = "solving…";
        let i = 0;
        solveTimer = setInterval(() => {
          if (i >= seq.length) {
            clearInterval(solveTimer);
            solveTimer = null;
            won = true;
            draw();
            return;
          }
          const ni = seq[i];
          board[blank] = board[ni];
          board[ni] = 15;
          blank = ni;
          draw();
          i++;
        }, 50);
        return;
      }
      // Fallback: lightweight IDA* solver for user-modified boards
      draw();
      statusEl.textContent = "solving…";
      setTimeout(() => {
        const seq = solveIDAstar(board, blank);
        if (!seq) { draw(); statusEl.textContent = "too hard — try a different shuffle"; return; }
        won = false;
        draw();
        statusEl.textContent = "solving…";
        let i = 0;
        solveTimer = setInterval(() => {
          if (i >= seq.length) {
            clearInterval(solveTimer);
            solveTimer = null;
            won = true;
            draw();
            return;
          }
          const ni = seq[i];
          board[blank] = board[ni];
          board[ni] = 15;
          blank = ni;
          draw();
          i++;
        }, 100);
      }, 50);
    }
  };
}

// ── IDA* fallback solver (only used when user has made moves) ─────

function solveIDAstar(board, blank) {
  const dirs = [[-1,0],[1,0],[0,-1],[0,1]];
  const goalR = new Array(16), goalC = new Array(16);
  for (let v = 0; v < 15; v++) { goalR[v] = Math.floor(v / 4); goalC[v] = v % 4; }

  function heuristic(b) {
    let h = 0;
    for (let i = 0; i < 16; i++) {
      const v = b[i];
      if (v === 15) continue;
      h += Math.abs(goalR[v] - Math.floor(i / 4)) + Math.abs(goalC[v] - (i % 4));
    }
    // Linear conflicts
    for (let r = 0; r < 4; r++) {
      for (let i = 0; i < 4; i++) {
        const idxI = r * 4 + i, vI = b[idxI];
        if (vI === 15 || goalR[vI] !== r) continue;
        for (let j = i + 1; j < 4; j++) {
          const idxJ = r * 4 + j, vJ = b[idxJ];
          if (vJ === 15 || goalR[vJ] !== r) continue;
          if (goalC[vI] > goalC[vJ]) h += 2;
        }
      }
    }
    for (let c = 0; c < 4; c++) {
      for (let i = 0; i < 4; i++) {
        const idxI = i * 4 + c, vI = b[idxI];
        if (vI === 15 || goalC[vI] !== c) continue;
        for (let j = i + 1; j < 4; j++) {
          const idxJ = j * 4 + c, vJ = b[idxJ];
          if (vJ === 15 || goalC[vJ] !== c) continue;
          if (goalR[vI] > goalR[vJ]) h += 2;
        }
      }
    }
    return h;
  }

  let threshold = heuristic(board);
  let nodes = 0;
  const maxNodes = 5000000;
  const startTime = Date.now();
  const maxTime = 5000;

  function search(b, blk, g, th, prevBlk) {
    nodes++;
    if (nodes > maxNodes || Date.now() - startTime > maxTime) return null;
    const h = heuristic(b);
    if (h === 0) return [];
    if (g + h > th) return null;
    const br = Math.floor(blk / 4), bc = blk % 4;
    const nbrs = [];
    for (const [dr, dc] of dirs) {
      const nr = br + dr, nc = bc + dc;
      if (nr < 0 || nr >= 4 || nc < 0 || nc >= 4) continue;
      const ni = nr * 4 + nc;
      if (ni === prevBlk) continue;
      nbrs.push(ni);
    }
    nbrs.sort((a, b) => {
      const va = b[a], vb = b[b];
      if (va === 15) return 1; if (vb === 15) return -1;
      const da = Math.abs(goalC[va] - bc) + Math.abs(goalR[va] - br)
               - (Math.abs(goalC[va] - (a % 4)) + Math.abs(goalR[va] - Math.floor(a / 4)));
      const db = Math.abs(goalC[vb] - bc) + Math.abs(goalR[vb] - br)
               - (Math.abs(goalC[vb] - (b % 4)) + Math.abs(goalR[vb] - Math.floor(b / 4)));
      return da - db;
    });
    for (const ni of nbrs) {
      b[blk] = b[ni];
      b[ni] = 15;
      const sub = search(b, ni, g + 1, th, blk);
      if (sub !== null) {
        sub.unshift(ni);
        b[ni] = b[blk];
        b[blk] = 15;
        return sub;
      }
      b[ni] = b[blk];
      b[blk] = 15;
    }
    return null;
  }

  while (nodes < maxNodes && Date.now() - startTime <= maxTime) {
    const result = search([...board], blank, 0, threshold, -1);
    if (result !== null) return result;
    threshold++;
  }
  return null;
}
