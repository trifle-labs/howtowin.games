// Courier chess — 12×8 medieval chess variant.
// Pieces: King, Mann (1-step queen), Courier (bishop), Alfil (jump-2 diag),
//         Knight, Rook, Schleich (1 ortho/forward-diag), Pawn.
// AI: depth-1 material search.
export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 420);
  canvas.width = size; canvas.height = Math.floor(size * 8 / 12) + 30;
  const W = canvas.width, H = canvas.height;
  const statusEl = document.getElementById("playable-status");
  const COLS = 12, ROWS = 8;
  let board, turn, winner, sel;
  function newGame() {
    board = Array.from({ length: ROWS }, () => new Array(COLS).fill('.'));
    // AI top: uppercase
    const back = ['R','N','B','C','S','Q','K','Q','C','B','N','R'];
    board[0] = back;
    for (let c = 0; c < COLS; c++) board[1][c] = 'P';
    // You bottom: lowercase
    board[ROWS-1] = back.map(v => v.toLowerCase());
    for (let c = 0; c < COLS; c++) board[ROWS-2][c] = 'p';
    turn = "you"; winner = null; sel = null;
  }
  newGame();

  const isYou = (p) => p !== '.' && p === p.toLowerCase();
  const isAI = (p) => p !== '.' && p === p.toUpperCase();
  const en = (p, side) => side === 'y' ? isAI(p) : isYou(p);

  function genMoves(b, side) {
    const out = [];
    const own = (p) => side === 'y' ? isYou(p) : isAI(p);
    const isEn = (p) => p !== '.' && !own(p);
    const add = (r, c, nr, nc) => {
      if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) return false;
      if (own(b[nr][nc])) return false;
      out.push({ from: [r, c], to: [nr, nc] });
      return b[nr][nc] === '.';
    };
    const ray = (r, c, dr, dc) => {
      let nr = r + dr, nc = c + dc;
      while (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
        if (own(b[nr][nc])) return;
        out.push({ from: [r, c], to: [nr, nc] });
        if (b[nr][nc] !== '.') return;
        nr += dr; nc += dc;
      }
    };

    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      const p = b[r][c]; if (p === '.') continue; if (!own(p)) continue;
      const t = p.toLowerCase();
      if (t === 'k' || t === 'q') {
        for (const [dr, dc] of [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]) add(r, c, r + dr, c + dc);
      } else if (t === 'c') {
        for (const [dr, dc] of [[-1,-1],[-1,1],[1,-1],[1,1]]) ray(r, c, dr, dc);
      } else if (t === 'b') {
        for (const [dr, dc] of [[-2,-2],[-2,2],[2,-2],[2,2]]) add(r, c, r + dr, c + dc);
      } else if (t === 'n') {
        for (const [dr, dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]) add(r, c, r + dr, c + dc);
      } else if (t === 'r') {
        for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]) ray(r, c, dr, dc);
      } else if (t === 's') {
        add(r, c, r - 1, c); add(r, c, r + 1, c); add(r, c, r, c - 1); add(r, c, r, c + 1);
        const dir = side === 'y' ? -1 : 1;
        add(r, c, r + dir, c - 1); add(r, c, r + dir, c + 1);
      } else if (t === 'p') {
        const dir = side === 'y' ? -1 : 1;
        if (r + dir >= 0 && r + dir < ROWS && b[r + dir][c] === '.') out.push({ from: [r, c], to: [r + dir, c] });
        for (const dc of [-1, 1]) {
          const nr = r + dir, nc = c + dc;
          if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && isEn(b[nr][nc]))
            out.push({ from: [r, c], to: [nr, nc] });
        }
      }
    }
    return out;
  }

  function apply(b, m) {
    const nb = b.map(row => row.slice());
    nb[m.to[0]][m.to[1]] = nb[m.from[0]][m.from[1]];
    nb[m.from[0]][m.from[1]] = '.';
    // Pawn promotion to Ferz (Q)
    const pt = nb[m.to[0]][m.to[1]];
    if (pt.toLowerCase() === 'p' && (m.to[0] === 0 || m.to[0] === ROWS - 1)) {
      nb[m.to[0]][m.to[1]] = isAI(pt) ? 'Q' : 'q';
    }
    return nb;
  }

  function findKing(b, side) {
    const k = side === 'y' ? 'k' : 'K';
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) if (b[r][c] === k) return [r, c];
    return null;
  }

  const VAL = { k: 1000, q: 3, c: 5, b: 2, n: 4, r: 7, s: 2, p: 1 };

  function material(b) {
    let s = 0;
    for (const row of b) for (const v of row) {
      if (v === '.') continue;
      s += (isAI(v) ? VAL[v.toLowerCase()] : -VAL[v.toLowerCase()]);
    }
    return s;
  }

  function aiMove() {
    if (winner) return;
    const moves = genMoves(board, 'a');
    if (!moves.length) { winner = "you"; draw(); return; }
    let best = null, bestScore = -Infinity;
    for (const mv of moves) {
      const nb = apply(board, mv);
      let score = material(nb) + Math.random() * 0.1;
      if (score > bestScore) { bestScore = score; best = mv; }
    }
    board = apply(board, best);
    if (!findKing(board, 'y')) { winner = "ai"; draw(); return; }
    turn = "you"; draw();
  }

  // ── Drawing ──
  function cellRect(r, c) {
    const margin = 10;
    const cw = (size - 2 * margin) / COLS;
    const ch = (H - 30) / ROWS;
    return { x: margin + c * cw, y: 28 + r * ch, w: cw, h: ch };
  }

  const GLYPH = {
    K:'♔', Q:'♕', R:'♖', N:'♘', B:'♗', C:'⛀', S:'⛃', P:'♙',
    k:'♚', q:'♛', r:'♜', n:'♞', b:'♝', c:'⛁', s:'⛂', p:'♟'
  };

  const PIECE_NAMES = {
    K:'King', Q:'Mann', R:'Rook', N:'Knight', B:'Alfil', C:'Courier', S:'Schleich', P:'Pawn'
  };

  function draw() {
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "11px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";

    const cell = cellRect(0, 0);
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      const rc = cellRect(r, c);
      ctx.fillStyle = (r + c) % 2 === 0 ? "#f0d9b5" : "#b58863";
      ctx.fillRect(rc.x, rc.y, rc.w, rc.h);
      if (sel && sel.r === r && sel.c === c) {
        ctx.fillStyle = "rgba(120,220,120,0.4)"; ctx.fillRect(rc.x, rc.y, rc.w, rc.h);
      }
      const p = board[r][c];
      if (p === '.') continue;
      const g = GLYPH[p];
      ctx.font = `${rc.w * 0.65}px serif`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillStyle = isYou(p) ? "#222" : "#fff";
      ctx.strokeStyle = isYou(p) ? "#fff" : "#000";
      ctx.lineWidth = 1.5;
      ctx.strokeText(g, rc.x + rc.w / 2, rc.y + rc.h / 2 + 1);
      ctx.fillText(g, rc.x + rc.w / 2, rc.y + rc.h / 2 + 1);
    }
    ctx.textBaseline = "alphabetic";

    if (winner) statusEl.textContent = winner === "you" ? "You win!" : "AI wins!";
    else statusEl.textContent = turn === "you" ? (sel ? "click destination" : "click your piece") : "AI thinking…";
  }

  function pos(e) {
    const r = canvas.getBoundingClientRect();
    return { x: (e.clientX - r.left) * (W / r.width), y: (e.clientY - r.top) * (H / r.height) };
  }

  function onClick(e) {
    if (winner || turn !== "you") return;
    const { x, y } = pos(e);
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      const rc = cellRect(r, c);
      if (x < rc.x || x > rc.x + rc.w || y < rc.y || y > rc.y + rc.h) continue;
      const moves = genMoves(board, 'y');
      if (sel) {
        const m = moves.find(mv => mv.from[0] === sel.r && mv.from[1] === sel.c && mv.to[0] === r && mv.to[1] === c);
        if (m) {
          board = apply(board, m); sel = null;
          if (!findKing(board, 'a')) { winner = "you"; draw(); return; }
          turn = "ai"; draw(); setTimeout(aiMove, 300);
          return;
        }
        if (isYou(board[r][c]) && moves.some(mv => mv.from[0] === r && mv.from[1] === c)) { sel = { r, c }; draw(); return; }
        sel = null; draw(); return;
      } else {
        if (isYou(board[r][c]) && moves.some(mv => mv.from[0] === r && mv.from[1] === c)) { sel = { r, c }; draw(); }
        return;
      }
    }
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve(){
      if (winner || turn !== "you") return;
      const __mvs = genMoves(board, "y");
      if (!__mvs.length) { winner = "ai"; draw(); return; }
      const __mv = __mvs[Math.floor(Math.random() * __mvs.length)];
      apply(board, __mv);
      turn = "ai"; draw();
      setTimeout(aiMove, 80);
    },

    destroy() { canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart() { newGame(); draw(); },
  };
}
