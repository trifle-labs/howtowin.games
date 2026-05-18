// Peg solitaire — English board. Jump pegs orthogonally over an adjacent peg
// into an empty hole. Goal: end with one peg in the centre.
// Solver: DFS with symmetry pruning (finds a solution quickly for standard start).

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 360);
  canvas.width = size;
  canvas.height = size;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) {
    const w = canvas.width, h = canvas.height;
    canvas.style.width = w + 'px';    canvas.width = w * dpr; canvas.height = h * dpr; ctx.scale(dpr, dpr);
  }
  const W = size, H = size;
  const statusEl = document.getElementById("playable-status");

  // English board: 7x7 with corners removed (cross shape)
  // true = valid hole, false = no hole
  const valid = [];
  for (let r = 0; r < 7; r++) {
    valid[r] = [];
    for (let c = 0; c < 7; c++) {
      valid[r][c] = (r < 2 || r > 4) ? (c >= 2 && c <= 4) : true;
    }
  }

  const cell = W / 7;
  const offset = cell / 2;

  let board, sel, moves, won, history;

  function init() {
    board = [];
    for (let r = 0; r < 7; r++) {
      board[r] = [];
      for (let c = 0; c < 7; c++) {
        board[r][c] = valid[r][c] ? 1 : -1;
      }
    }
    board[3][3] = 0; // centre empty
    sel = null;
    moves = [];
    won = false;
    history = [];
  }
  init();

  function idx(r, c) { return r * 7 + c; }

  function getJumps(r, c) {
    const jumps = [];
    if (board[r][c] !== 1) return jumps;
    for (const [dr, dc] of [[-2,0],[2,0],[0,-2],[0,2]]) {
      const mr = r + dr/2, mc = c + dc/2;
      const tr = r + dr, tc = c + dc;
      if (tr < 0 || tr >= 7 || tc < 0 || tc >= 7) continue;
      if (!valid[tr][tc] || !valid[mr][mc]) continue;
      if (board[mr][mc] === 1 && board[tr][tc] === 0) jumps.push([tr, tc]);
    }
    return jumps;
  }

  function allJumps() {
    const jmps = [];
    for (let r = 0; r < 7; r++)
      for (let c = 0; c < 7; c++)
        if (valid[r][c] && board[r][c] === 1)
          for (const [tr, tc] of getJumps(r, c))
            jmps.push({ fr: r, fc: c, tr, tc, mr: r + (tr - r) / 2, mc: c + (tc - c) / 2 });
    return jmps;
  }

  function doJump(r, c, tr, tc) {
    const mr = r + (tr - r) / 2, mc = c + (tc - c) / 2;
    history.push({ fr: r, fc: c, tr, tc, mr, mc, jumped: board[mr][mc] });
    board[r][c] = 0;
    board[mr][mc] = 0;
    board[tr][tc] = 1;
  }

  function undoJump() {
    const h = history.pop();
    if (!h) return;
    board[h.fr][h.fc] = 1;
    board[h.mr][h.mc] = h.jumped;
    board[h.tr][h.tc] = 0;
  }

  function undoSolve() {
    while (history.length > 0) undoJump();
    won = false;
    board[3][3] = 0;
  }

  function countPegs() {
    let n = 0;
    for (let r = 0; r < 7; r++)
      for (let c = 0; c < 7; c++)
        if (board[r][c] === 1) n++;
    return n;
  }

  function checkWon() {
    return countPegs() === 1 && board[3][3] === 1;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#fafaf7";
    ctx.fillRect(0, 0, W, H);

    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (!valid[r][c]) continue;
        const x = c * cell + offset, y = r * cell + offset;
        const rad = cell * 0.38;
        const highlighted = moves.some(([tr, tc]) => tr === r && tc === c);

        // Hole
        ctx.beginPath();
        ctx.arc(x, y, rad + 2, 0, Math.PI * 2);
        ctx.fillStyle = "#ede8dc";
        ctx.fill();
        ctx.strokeStyle = "#cbb";
        ctx.lineWidth = 1;
        ctx.stroke();

        if (board[r][c] === 1) {
          // Peg
          ctx.beginPath();
          ctx.arc(x, y, rad - 1, 0, Math.PI * 2);
          const isSel = sel && sel[0] === r && sel[1] === c;
          ctx.fillStyle = isSel ? "#e66" : "#c44";
          ctx.fill();
          ctx.strokeStyle = isSel ? "#c33" : "#922";
          ctx.lineWidth = 1.5;
          ctx.stroke();
        } else if (board[r][c] === 0 && highlighted) {
          // Highlight target
          ctx.beginPath();
          ctx.arc(x, y, rad * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(46, 204, 113, 0.5)";
          ctx.fill();
        }
      }
    }

    if (won) {
      statusEl.textContent = "solved! single peg in centre";
    } else {
      const jmps = allJumps();
      statusEl.textContent = jmps.length === 0
        ? "no moves left — " + countPegs() + " pegs remain"
        : countPegs() + " pegs — click a peg to see moves";
    }
  }

  function onClick(e) {
    if (won) return;
    const rect = canvas.getBoundingClientRect();
    const px = (e.clientX - rect.left) * (W / rect.width);
    const py = (e.clientY - rect.top) * (H / rect.height);
    const c = Math.floor(px / cell);
    const r = Math.floor(py / cell);
    if (r < 0 || r >= 7 || c < 0 || c >= 7 || !valid[r][c]) return;

    if (board[r][c] === 1) {
      // Select peg
      const jmps = getJumps(r, c);
      if (jmps.length > 0) {
        sel = [r, c];
        moves = jmps;
        draw();
      } else {
        sel = null;
        moves = [];
        draw();
      }
    } else if (board[r][c] === 0 && sel) {
      // Try to jump
      const match = moves.find(([tr, tc]) => tr === r && tc === c);
      if (match) {
        doJump(sel[0], sel[1], match[0], match[1]);
        sel = null;
        moves = [];
        if (checkWon()) { won = true; draw(); return; }
        draw();
      }
    }
  }

  canvas.addEventListener("click", onClick);
  draw();

  return {
    destroy() { canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart() { init(); sel = null; moves = []; won = false; _solveState = null; draw(); },
    solve() {
      if (won) return;
      undoSolve();
      sel = null; moves = []; _solveState = null;
      draw();
      statusEl.textContent = "solving…";

      setTimeout(() => {
        const result = pegSolveChunk(board, 10000000);
        if (!result) { draw(); statusEl.textContent = "no solution found"; return; }

        let i = 0;
        function step() {
          if (i >= result.length) { won = true; draw(); return; }
          const { fr, fc, tr, tc } = result[i];
          doJump(fr, fc, tr, tc);
          draw();
          i++;
          setTimeout(step, 250);
        }
        step();
      }, 50);
    }
  };
}

// ── Bitboard DFS solver ─────────────────────────────────────────────────
// BigInt bitboard (49 bits for 7×7) + precomputed jump table + Map<bigint>.

const _BI = (r, c) => BigInt(r * 7 + c);
const _BMASK = (() => {
  let m = 0n;
  for (let r = 0; r < 7; r++)
    for (let c = 0; c < 7; c++)
      if ((r < 2 || r > 4) ? (c >= 2 && c <= 4) : true) m |= 1n << _BI(r, c);
  return m;
})();
const _WIN = 1n << _BI(3, 3);

// Precompute jump table: for each of the 49 cells, list valid { src, mid, tgt, tr, tc }
const _JUMPS = (() => {
  const j = [];
  for (let r = 0; r < 7; r++)
    for (let c = 0; c < 7; c++) {
      const list = [];
      const si = r * 7 + c;
      const src = _BI(r, c);
      if (!(_BMASK & (1n << src))) { j.push(list); continue; }
      for (const [dr, dc] of [[-2,0],[2,0],[0,-2],[0,2]]) {
        const mr = r + dr/2, mc = c + dc/2;
        const tr = r + dr, tc = c + dc;
        if (tr < 0 || tr >= 7 || tc < 0 || tc >= 7) continue;
        const mid = _BI(mr, mc), tgt = _BI(tr, tc);
        if (!(_BMASK & (1n << mid)) || !(_BMASK & (1n << tgt))) continue;
        list.push({ src, mid, tgt, tr, tc });
      }
      j.push(list);
    }
  return j;
})();

// Precompute bit-value → cell-index map (avoids Math.log2 / Number conversion)
const _BIT_TO_IDX = (() => {
  const m = new Map();
  for (let r = 0; r < 7; r++)
    for (let c = 0; c < 7; c++)
      m.set(1n << _BI(r, c), r * 7 + c);
  return m;
})();

function _pegCount(b) {
  let n = 0, v = b;
  while (v) { n++; v &= (v - 1n); }
  return n;
}

function _boardFromArray(board) {
  let b = 0n;
  for (let r = 0; r < 7; r++)
    for (let c = 0; c < 7; c++)
      if (board[r][c] === 1) b |= 1n << _BI(r, c);
  return b;
}

function _findMoves(b) {
  const moves = [];
  let bits = b;
  while (bits) {
    const lsb = bits & -bits;
    const i = _BIT_TO_IDX.get(lsb);
    if (i !== undefined) {
      const jumps = _JUMPS[i];
      for (let k = 0; k < jumps.length; k++) {
        const j = jumps[k];
        if ((b & (1n << j.mid)) && !(b & (1n << j.tgt)))
          moves.push(j);
      }
    }
    bits &= (bits - 1n);
  }
  return moves;
}

let _solveState = null;

function pegSolveChunk(board, nodeBudget) {
  if (!_solveState) {
    const start = _boardFromArray(board);
    const visited = new Map();
    visited.set(start, true);
    _solveState = {
      stack: [{ b: start, path: [], moves: null, nextIdx: 0 }],
      visited,
      nodes: 0,
      best: null,
    };
  }

  const { stack, visited } = _solveState;
  const target = _solveState.nodes + nodeBudget;

  while (stack.length > 0 && _solveState.nodes < target && !_solveState.best) {
    const frame = stack[stack.length - 1];

    if (!frame.moves) {
      _solveState.nodes++;
      if (_pegCount(frame.b) === 1 && (frame.b & _WIN)) {
        _solveState.best = [...frame.path];
        break;
      }
      frame.moves = _findMoves(frame.b);
      if (frame.moves.length === 0) { stack.pop(); continue; }
      frame.moves.sort((a, b) => {
        const da = Math.abs(a.tr - 3) + Math.abs(a.tc - 3);
        const db = Math.abs(b.tr - 3) + Math.abs(b.tc - 3);
        return da - db;
      });
    }

    let advanced = false;
    while (frame.nextIdx < frame.moves.length && !advanced) {
      const j = frame.moves[frame.nextIdx];
      frame.nextIdx++;

      const nb = frame.b ^ (1n << j.src) ^ (1n << j.mid) ^ (1n << j.tgt);
      if (!visited.has(nb)) {
        visited.set(nb, true);
        stack.push({
          b: nb,
          path: [...frame.path, { fr: Number(j.src / 7n), fc: Number(j.src % 7n), tr: j.tr, tc: j.tc }],
          moves: null, nextIdx: 0
        });
        advanced = true;
      }
    }

    if (!advanced) stack.pop();
  }

  if (_solveState.best) {
    const result = _solveState.best;
    _solveState = null;
    return result;
  }
  if (stack.length === 0) {
    _solveState = null;
    return null;
  }
  return 'continue';
}
