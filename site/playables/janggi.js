// Janggi (Korean chess) — 9×10 board, no river, palace-diagonal general.
// AI: depth-1 material search.
export function create(canvas) {
  const ctx = canvas.getContext("2d");
  function _fit(ctx, t, x, y, maxW){
    let f = parseFloat(ctx.font) || 12;
    while (f > 8 && ctx.measureText(t).width > maxW){ f--; ctx.font = ctx.font.replace(/[\d.]+px/, f + 'px'); }
    ctx.fillText(t, x, y);
  }

  const size = Math.min(canvas.parentElement.clientWidth - 24, 360);
  canvas.width = size;
  canvas.height = Math.floor(size * 10 / 9) + 30;
  const W = canvas.width, H = canvas.height;
  const statusEl = document.getElementById("playable-status");
  const COLS = 9, ROWS = 10;

  let board, turn, winner, sel;
  function newGame() {
    board = Array.from({ length: ROWS }, () => new Array(COLS).fill('.'));
    // AI top: uppercase (following convention: AI = uppercase for janggi)
    board[0] = ['R','N','E','A','K','A','E','N','R'];
    board[2][1] = 'C'; board[2][7] = 'C';
    for (const c of [0,2,4,6,8]) board[3][c] = 'S';
    // You bottom: lowercase
    board[ROWS-1] = ['r','n','e','a','k','a','e','n','r'];
    board[ROWS-3][1] = 'c'; board[ROWS-3][7] = 'c';
    for (const c of [0,2,4,6,8]) board[ROWS-4][c] = 's';
    turn = "you"; winner = null; sel = null; solveClicks = 0;
  }
  let solveClicks = 0;
  newGame();

  const isYou = (p) => p !== '.' && p === p.toLowerCase();
  const isAI = (p) => p !== '.' && p === p.toUpperCase();

  function inPalace(side, r, c) {
    if (c < 3 || c > 5) return false;
    return side === 'y' ? r >= ROWS - 3 : r <= 2;
  }

  function genMoves(b, side) {
    const out = [];
    const own = (p) => side === 'y' ? isYou(p) : isAI(p);
    const en = (p) => p !== '.' && !own(p);
    const add = (r, c, nr, nc) => {
      if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) return false;
      const t = b[nr][nc];
      if (own(t)) return false;
      out.push({ from: [r, c], to: [nr, nc] });
      return t === '.';
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
    const cannonMoves = (r, c) => {
      for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
        let nr = r + dr, nc = c + dc;
        while (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && b[nr][nc] === '.') {
          out.push({ from: [r, c], to: [nr, nc] });
          nr += dr; nc += dc;
        }
        if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) continue;
        nr += dr; nc += dc;
        while (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
          if (b[nr][nc] !== '.') {
            if (en(b[nr][nc])) out.push({ from: [r, c], to: [nr, nc] });
            break;
          }
          nr += dr; nc += dc;
        }
      }
    };

    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      const p = b[r][c]; if (p === '.') continue; if (!own(p)) continue;
      const t = p.toLowerCase();
      if (t === 'k') {
        for (const [dr, dc] of [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]) {
          const nr = r + dr, nc = c + dc;
          if (inPalace(side, nr, nc)) add(r, c, nr, nc);
        }
      } else if (t === 'a') {
        for (const [dr, dc] of [[-1,-1],[-1,1],[1,-1],[1,1]]) {
          const nr = r + dr, nc = c + dc;
          if (inPalace(side, nr, nc)) add(r, c, nr, nc);
        }
      } else if (t === 'e') {
        for (const [step, diags] of [[[-1,0],[[-2,-2],[-2,2]]],[[1,0],[[2,-2],[2,2]]],[[0,-1],[[-2,-2],[2,-2]]],[[0,1],[[-2,2],[2,2]]]]) {
          const sr = r + step[0], sc = c + step[1];
          if (sr < 0 || sr >= ROWS || sc < 0 || sc >= COLS || b[sr][sc] !== '.') continue;
          for (const [dr, dc] of diags) add(r, c, r + dr, c + dc);
        }
      } else if (t === 'n') {
        for (const [step, jumps] of [[[-1,0],[[-2,-1],[-2,1]]],[[1,0],[[2,-1],[2,1]]],[[0,-1],[[-1,-2],[1,-2]]],[[0,1],[[-1,2],[1,2]]]]) {
          const sr = r + step[0], sc = c + step[1];
          if (sr < 0 || sr >= ROWS || sc < 0 || sc >= COLS || b[sr][sc] !== '.') continue;
          for (const [dr, dc] of jumps) add(r, c, r + dr, c + dc);
        }
      } else if (t === 'r') {
        for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]) ray(r, c, dr, dc);
      } else if (t === 'c') {
        cannonMoves(r, c);
      } else if (t === 's') {
        const fwd = side === 'y' ? -1 : 1;
        add(r, c, r + fwd, c);
        add(r, c, r, c - 1); add(r, c, r, c + 1);
      }
    }
    return out;
  }

  function applyMove(b, mv) {
    const [fr, fc] = mv.from, [tr, tc] = mv.to;
    b[tr][tc] = b[fr][fc]; b[fr][fc] = '.';
  }

  function findKing(b, side) {
    const target = side === 'y' ? 'k' : 'K';
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) if (b[r][c] === target) return [r, c];
    return null;
  }

  const VAL = { k: 1000, a: 2, e: 3, n: 5, r: 9, c: 7, s: 2 };

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
      const snap = board.map(r => r.slice());
      applyMove(board, mv);
      const v = material(board);
      board = snap;
      if (v > bestScore) { bestScore = v; best = mv; }
    }
    applyMove(board, best);
    if (!findKing(board, 'y')) { winner = "ai"; draw(); return; }
    turn = "you"; draw();
  }

  // ── Drawing ──
  function cellRect(r, c) {
    const margin = 16, cw = (size - 2 * margin) / (COLS - 1);
    const ch = (H - 60) / (ROWS - 1);
    return { x: margin + c * cw, y: 30 + r * ch, w: cw, h: ch };
  }

  const GLYPH = {
    K:'將', A:'士', E:'象', N:'馬', R:'車', C:'包', S:'兵',
    k:'將', a:'士', e:'象', n:'馬', r:'車', c:'包', s:'兵'
  };

  function draw() {
    ctx.fillStyle = "#fdfae6"; ctx.fillRect(0, 0, W, H);
    ctx.font = "12px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";
    _fit(ctx, "Janggi — Korean chess. No river. Capture the general to win.", W / 2, 18, W - 8);
    ctx.strokeStyle = "#888";
    for (let r = 0; r < ROWS; r++) {
      const a = cellRect(r, 0), b = cellRect(r, COLS - 1);
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    }
    for (let c = 0; c < COLS; c++) {
      const a = cellRect(0, c), b = cellRect(ROWS - 1, c);
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    }
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      const v = board[r][c]; if (v === '.') continue;
      const rc = cellRect(r, c);
      ctx.beginPath(); ctx.arc(rc.x, rc.y, 14, 0, Math.PI * 2);
      ctx.fillStyle = "#fff5d5"; ctx.fill(); ctx.strokeStyle = "#222"; ctx.stroke();
      if (sel && sel.r === r && sel.c === c) {
        ctx.beginPath(); ctx.arc(rc.x, rc.y, 14, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(120,220,120,0.5)"; ctx.fill(); ctx.stroke();
      }
      ctx.font = "bold 14px sans-serif"; ctx.fillStyle = isYou(v) ? "#222" : "#c33";
      ctx.fillText(GLYPH[v], rc.x, rc.y + 5);
    }
    if (winner) statusEl.textContent = winner === "you" ? "You win!" : "AI wins!";
    else statusEl.textContent = turn === "you" ? (sel ? "click destination intersection" : "click your piece (black)") : "AI thinking…";
  }

  function pos(e) {
    const r = canvas.getBoundingClientRect();
    return { x: (e.clientX - r.left) * (W / r.width), y: (e.clientY - r.top) * (H / r.height) };
  }

  function nodeAt(x, y) {
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      const rc = cellRect(r, c);
      if ((x - rc.x) * (x - rc.x) + (y - rc.y) * (y - rc.y) <= 225) return [r, c];
    }
    return null;
  }

  function onClick(e) {
    if (winner || turn !== "you") return;
    const { x, y } = pos(e);
    const hit = nodeAt(x, y); if (!hit) return;
    const [r, c] = hit;
    if (sel) {
      if (sel.r === r && sel.c === c) { sel = null; draw(); return; }
      if (isYou(board[r][c])) { sel = { r, c }; draw(); return; }
      const moves = genMoves(board, 'y');
      const mv = moves.find(m => m.from[0] === sel.r && m.from[1] === sel.c && m.to[0] === r && m.to[1] === c);
      if (!mv) { sel = null; draw(); return; }
      applyMove(board, mv); sel = null;
      if (!findKing(board, 'a')) { winner = "you"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 400);
    } else {
      if (isYou(board[r][c])) { sel = { r, c }; draw(); }
    }
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve(){
      if (winner) return;
      solveClicks++;
      if (solveClicks >= 80) { winner = "draw"; statusEl.textContent = "draw — move limit"; draw(); return; }
      if (turn !== "you") return;
      const __mvs = genMoves(board, "y");
      if (!__mvs.length) { winner = "ai"; draw(); return; }
      const __mv = __mvs[Math.floor(Math.random() * __mvs.length)];
      applyMove(board, __mv);
      turn = "ai"; draw();
      setTimeout(aiMove, 80);
    },

    destroy() { canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart() { newGame(); draw(); },
  };
}
