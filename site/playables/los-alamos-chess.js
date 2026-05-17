// Los Alamos chess — 6×6 board, no bishops, no castling, no en passant.
// AI: depth-1 material search.
export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 340);
  canvas.width = size; canvas.height = size + 30;
  const W = canvas.width, H = canvas.height;
  const statusEl = document.getElementById("playable-status");
  const N = 6;
  let board, turn, winner, sel;
  function newGame() {
    board = [
      ['r','n','.','.','n','r'],
      ['q','.','.','.','.','k'],
      ['p','p','p','p','p','p'],
      ['.','.','.','.','.','.'],
      ['.','.','.','.','.','.'],
      ['.','.','.','.','.','.'],
      ['.','.','.','.','.','.'],
      ['.','.','.','.','.','.'],
      ['P','P','P','P','P','P'],
      ['Q','.','.','.','.','K'],
      ['R','N','.','.','N','R'],
    ].slice(0, N).concat([
      ['.','.','.','.','.','.'],
      ['.','.','.','.','.','.'],
    ]).slice(0, N);
    // Actually let me do this properly:
    board = [
      ['r','n','.','.','n','r'],
      ['q','.','.','.','.','k'],
      ['p','p','p','p','p','p'],
      ['.','.','.','.','.','.'],
      ['.','.','.','.','.','.'],
      ['.','.','.','.','.','.'],
    ];
    // Wait, that's wrong too. Let me use proper setup:
    board = [
      ['r','n','q','k','n','r'],  // AI (top, lowercase)
      ['p','p','p','p','p','p'],
      ['.','.','.','.','.','.'],
      ['.','.','.','.','.','.'],
      ['P','P','P','P','P','P'],  // You (bottom, uppercase)
      ['R','N','Q','K','N','R'],
    ];
    turn = "you"; winner = null; sel = null;
  }
  newGame();

  const isYou = (p) => p !== '.' && p === p.toUpperCase();
  const isAI = (p) => p !== '.' && p === p.toLowerCase();
  const opp = (s) => s === "you" ? "ai" : "you";

  function genMovesFor(b, r, c) {
    const p = b[r][c]; if (p === '.') return [];
    const out = [];
    const mine = isYou(p) ? isYou : isAI;
    const en = isYou(p) ? isAI : isYou;
    const push = (nr, nc) => {
      if (nr < 0 || nr >= N || nc < 0 || nc >= N) return false;
      if (mine(b[nr][nc])) return false;
      out.push({ from: [r, c], to: [nr, nc], cap: en(b[nr][nc]) });
      return b[nr][nc] === '.';
    };
    const ray = (dr, dc) => {
      let nr = r + dr, nc = c + dc;
      while (nr >= 0 && nr < N && nc >= 0 && nc < N) {
        if (mine(b[nr][nc])) return;
        out.push({ from: [r, c], to: [nr, nc], cap: en(b[nr][nc]) });
        if (b[nr][nc] !== '.') return;
        nr += dr; nc += dc;
      }
    };
    const t = p.toLowerCase();
    if (t === 'p') {
      const dir = isYou(p) ? -1 : 1;
      if (r + dir >= 0 && r + dir < N && b[r + dir][c] === '.')
        out.push({ from: [r, c], to: [r + dir, c] });
      for (const dc of [-1, 1]) {
        const nr = r + dir, nc = c + dc;
        if (nr >= 0 && nr < N && nc >= 0 && nc < N && en(b[nr][nc]))
          out.push({ from: [r, c], to: [nr, nc], cap: true });
      }
    } else if (t === 'n') {
      for (const [dr, dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]])
        push(r + dr, c + dc);
    } else if (t === 'r') {
      for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]) ray(dr, dc);
    } else if (t === 'q') {
      for (const [dr, dc] of [[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]]) ray(dr, dc);
    } else if (t === 'k') {
      for (const [dr, dc] of [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]])
        push(r + dr, c + dc);
    }
    return out;
  }

  function genMoves(b, side) {
    const out = [];
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
      const p = b[r][c]; if (p === '.') continue;
      if (side === "you" ? isYou(p) : isAI(p)) out.push(...genMovesFor(b, r, c));
    }
    return out;
  }

  function apply(b, m) {
    const nb = b.map(r => [...r]);
    nb[m.to[0]][m.to[1]] = nb[m.from[0]][m.from[1]];
    nb[m.from[0]][m.from[1]] = '.';
    // Promotion on rank 0 (AI) or rank N-1 (you)
    const pt = nb[m.to[0]][m.to[1]];
    if (pt.toLowerCase() === 'p' && (m.to[0] === 0 || m.to[0] === N - 1)) {
      nb[m.to[0]][m.to[1]] = isYou(pt) ? 'Q' : 'q';
    }
    return nb;
  }

  function hasKing(b, side) {
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++)
      if (side === "you" ? b[r][c] === 'K' : b[r][c] === 'k') return true;
    return false;
  }

  function aiMove() {
    const moves = genMoves(board, "ai");
    if (moves.length === 0) { winner = "you"; return; }
    let best = null, bestScore = -Infinity;
    for (const m of moves) {
      const nb = apply(board, m);
      let score = 0;
      for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
        const v = { 'p': 1, 'n': 3, 'r': 5, 'q': 9, 'k': 100 };
        if (isAI(nb[r][c])) score += v[nb[r][c]] || 1;
        if (isYou(nb[r][c])) score -= v[nb[r][c].toLowerCase()] || 1;
      }
      // Add randomness to break ties
      score += Math.random() * 0.1;
      if (score > bestScore) { bestScore = score; best = m; }
    }
    board = apply(board, best);
    if (!hasKing(board, "you")) winner = "ai";
    const ym = genMoves(board, "you");
    if (ym.length === 0) { winner = winner || "ai"; }
  }

  function draw() {
    const cell = size / N;
    ctx.clearRect(0, 0, W, H);
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
      const x = c * cell, y = r * cell;
      ctx.fillStyle = (r + c) % 2 === 0 ? "#f0d9b5" : "#b58863";
      ctx.fillRect(x, y, cell, cell);
      ctx.strokeStyle = "#888"; ctx.lineWidth = 0.5;
      ctx.strokeRect(x, y, cell, cell);
      const p = board[r][c];
      if (p !== '.') {
        const u = { 'k': '♔', 'q': '♕', 'r': '♖', 'n': '♘', 'p': '♙',
                    'K': '♚', 'Q': '♛', 'R': '♜', 'N': '♞', 'P': '♟' };
        ctx.font = `${cell * 0.7}px serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = isYou(p) ? "#222" : "#eee";
        ctx.fillText(u[board[r][c]] || p, x + cell / 2, y + cell / 2 + 2);
      }
    }
    if (sel !== null) {
      const x = sel[1] * cell, y = sel[0] * cell;
      ctx.strokeStyle = "#ff0"; ctx.lineWidth = 3;
      ctx.strokeRect(x + 1, y + 1, cell - 2, cell - 2);
    }
    if (winner) statusEl.textContent = winner === "you" ? "You win!" : "AI wins!";
    else statusEl.textContent = turn === "you" ? "Your turn" : "AI thinking…";
  }

  function handleClick(e) {
    if (winner || turn !== "you") return;
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (W / rect.width);
    const my = (e.clientY - rect.top) * (H / rect.height);
    const c = Math.floor(mx / (size / N));
    const r = Math.floor(my / (size / N));
    if (r < 0 || r >= N || c < 0 || c >= N) return;
    if (sel === null) {
      if (isYou(board[r][c])) sel = [r, c];
    } else {
      if (isYou(board[r][c])) { sel = [r, c]; draw(); return; }
      const moves = genMovesFor(board, sel[0], sel[1]);
      const m = moves.find(mv => mv.to[0] === r && mv.to[1] === c);
      if (m) {
        board = apply(board, m);
        if (!hasKing(board, "ai")) { winner = "you"; draw(); return; }
        turn = "ai"; sel = null; draw();
        if (!winner && turn === "ai") setTimeout(() => { aiMove(); turn = "you"; draw(); }, 100);
        return;
      }
      sel = null;
    }
    draw();
  }

  canvas.addEventListener("click", handleClick);
  draw();

  return {
    destroy() { canvas.removeEventListener("click", handleClick); ctx.clearRect(0, 0, W, H); },
    restart() { newGame(); draw(); },
    solve() {
      if (winner || turn !== "you") return;
      const moves = genMoves(board, "you");
      if (!moves.length) { winner = "ai"; draw(); return; }
      // Prefer captures, else random
      const caps = moves.filter(m => m.cap);
      const m = (caps.length ? caps : moves)[Math.floor(Math.random() * (caps.length || moves.length))];
      board = apply(board, m); sel = null;
      if (!hasKing(board, "ai")) { winner = "you"; draw(); return; }
      turn = "ai"; draw();
      setTimeout(() => { aiMove(); turn = "you"; draw(); }, 100);
    }
  };
}
