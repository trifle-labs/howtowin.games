// Maharajah and the Sepoys — asymmetric chess: full army vs Amazon (Q+N).
// The Sepoys (you) move first. Capture the Maharajah (⛃) to win.
// AI: depth-1 material search for the Maharajah.
export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 400);
  canvas.width = size; canvas.height = size + 30;
  const W = canvas.width, H = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) { canvas.style.width = W + 'px'; canvas.style.height = H + 'px'; canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr); }
  const statusEl = document.getElementById("playable-status");
  const N = 8;
  let board, turn, winner, sel;
  function newGame() {
    board = Array.from({ length: N }, () => new Array(N).fill('.'));
    // AI top: uppercase — single Maharajah (amazon = Q+N)
    board[0][4] = 'M';
    // You bottom: lowercase — full chess army
    board[N-1] = ['r','n','b','q','k','b','n','r'];
    for (let c = 0; c < N; c++) board[N-2][c] = 'p';
    turn = "you"; winner = null; sel = null;
  }
  newGame();

  const isYou = (p) => p !== '.' && p === p.toLowerCase();
  const isAI = (p) => p !== '.' && p === p.toUpperCase();
  const VAL = { p:1, n:3, b:3, r:5, q:9, k:100, m:12 };

  function genMoves(b, side) {
    const out = [];
    const own = (p) => side === 'y' ? isYou(p) : isAI(p);
    const isEn = (p) => p !== '.' && !own(p);
    const add = (r, c, nr, nc) => {
      if (nr < 0 || nr >= N || nc < 0 || nc >= N) return false;
      if (own(b[nr][nc])) return false;
      out.push({ from: [r, c], to: [nr, nc] });
      return b[nr][nc] === '.';
    };
    const ray = (r, c, dr, dc) => {
      let nr = r + dr, nc = c + dc;
      while (nr >= 0 && nr < N && nc >= 0 && nc < N) {
        if (own(b[nr][nc])) return;
        out.push({ from: [r, c], to: [nr, nc] });
        if (b[nr][nc] !== '.') return;
        nr += dr; nc += dc;
      }
    };
    const knightMoves = (r, c) => {
      for (const [dr, dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]) add(r, c, r + dr, c + dc);
    };

    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
      const p = b[r][c]; if (p === '.') continue; if (!own(p)) continue;
      const t = p.toLowerCase();
      if (t === 'm') {
        // Amazon = queen + knight
        for (const [dr, dc] of [[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]]) ray(r, c, dr, dc);
        knightMoves(r, c);
      } else if (t === 'k') {
        for (const [dr, dc] of [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]) add(r, c, r + dr, c + dc);
      } else if (t === 'q') {
        for (const [dr, dc] of [[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]]) ray(r, c, dr, dc);
      } else if (t === 'r') {
        for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]) ray(r, c, dr, dc);
      } else if (t === 'b') {
        for (const [dr, dc] of [[-1,-1],[-1,1],[1,-1],[1,1]]) ray(r, c, dr, dc);
      } else if (t === 'n') {
        knightMoves(r, c);
      } else if (t === 'p') {
        const dir = side === 'y' ? -1 : 1;
        const startRow = side === 'y' ? N - 2 : 1;
        if (r + dir >= 0 && r + dir < N && b[r + dir][c] === '.')
          out.push({ from: [r, c], to: [r + dir, c] });
        if (r === startRow && r + 2 * dir >= 0 && r + 2 * dir < N && b[r + dir][c] === '.' && b[r + 2 * dir][c] === '.')
          out.push({ from: [r, c], to: [r + 2 * dir, c] });
        for (const dc of [-1, 1]) {
          const nr = r + dir, nc = c + dc;
          if (nr >= 0 && nr < N && nc >= 0 && nc < N && isEn(b[nr][nc]))
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
    const pt = nb[m.to[0]][m.to[1]];
    if (pt.toLowerCase() === 'p' && (m.to[0] === 0 || m.to[0] === N - 1))
      nb[m.to[0]][m.to[1]] = isAI(pt) ? 'Q' : 'q';
    return nb;
  }

  function aiMove() {
    if (winner) return;
    const moves = genMoves(board, 'a');
    if (!moves.length) { winner = "you"; draw(); return; }
    let best = null, bestScore = -Infinity;
    for (const mv of moves) {
      const nb = apply(board, mv);
      let score = 0;
      for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
        const v = nb[r][c];
        if (v === '.') continue;
        score += isAI(v) ? VAL[v.toLowerCase()] : -VAL[v.toLowerCase()];
      }
      score += Math.random() * 0.1;
      if (score > bestScore) { bestScore = score; best = mv; }
    }
    board = apply(board, best);
    let hasKing = false;
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (board[r][c] === 'k') hasKing = true;
    if (!hasKing) { winner = "ai"; draw(); return; }
    turn = "you"; draw();
  }

  // ── Drawing ──
  const GLYPH = {
    K:'♔', Q:'♕', R:'♖', B:'♗', N:'♘', M:'⛃', P:'♙',
    k:'♚', q:'♛', r:'♜', b:'♝', n:'♞', p:'♟'
  };

  function draw() {
    const cell = size / N;
    ctx.clearRect(0, 0, W, H);
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
      const x = c * cell, y = r * cell + 28;
      ctx.fillStyle = (r + c) % 2 === 0 ? "#f0d9b5" : "#b58863";
      ctx.fillRect(x, y, cell, cell);
      if (sel && sel.r === r && sel.c === c) {
        ctx.fillStyle = "rgba(120,220,120,0.4)"; ctx.fillRect(x, y, cell, cell);
      }
      const p = board[r][c];
      if (p !== '.') {
        const g = GLYPH[p] || '?';
        ctx.font = `${cell * 0.6}px serif`;
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillStyle = isYou(p) ? "#222" : "#fff";
        ctx.strokeStyle = isYou(p) ? "#fff" : "#000";
        ctx.lineWidth = 1.5;
        ctx.strokeText(g, x + cell / 2, y + cell / 2 + 1);
        ctx.fillText(g, x + cell / 2, y + cell / 2 + 1);
      }
    }
    ctx.textBaseline = "alphabetic";
    ctx.font = "11px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";

    if (winner) statusEl.textContent = winner === "you" ? "You win! (captured the Maharajah)" : "AI wins! (Maharajah captured your king)";
    else statusEl.textContent = turn === "you" ? (sel ? "click destination" : "click your piece") : "AI thinking…";
  }

  function pos(e) {
    const r = canvas.getBoundingClientRect();
    return { x: (e.clientX - r.left) * (W / r.width), y: (e.clientY - r.top) * (H / r.height) - 28 };
  }

  function onClick(e) {
    if (winner || turn !== "you") return;
    const { x, y } = pos(e);
    if (y < 0) return;
    const c = Math.floor(x / (size / N));
    const r = Math.floor(y / (size / N));
    if (r < 0 || r >= N || c < 0 || c >= N) return;
    const moves = genMoves(board, 'y');
    if (sel) {
      const m = moves.find(mv => mv.from[0] === sel.r && mv.from[1] === sel.c && mv.to[0] === r && mv.to[1] === c);
      if (m) {
        board = apply(board, m); sel = null;
        // Check if Maharajah captured
        let hasM = false;
        for (let rr = 0; rr < N; rr++) for (let cc = 0; cc < N; cc++) if (board[rr][cc] === 'M') hasM = true;
        if (!hasM) { winner = "you"; draw(); return; }
        turn = "ai"; draw(); setTimeout(aiMove, 300);
        return;
      }
      if (isYou(board[r][c]) && moves.some(mv => mv.from[0] === r && mv.from[1] === c)) { sel = { r, c }; draw(); return; }
      sel = null; draw(); return;
    } else {
      if (isYou(board[r][c]) && moves.some(mv => mv.from[0] === r && mv.from[1] === c)) { sel = { r, c }; draw(); }
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
