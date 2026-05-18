// Three-check chess — standard 8×8 chess with an extra win condition:
// deliver check 3 times. You play white. AI: 2-ply alpha-beta.
// Win by: king captured (checkmate) or 3 checks delivered.

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 400);
  canvas.width = size; canvas.height = size + 30;
  const W = canvas.width, H = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) { canvas.style.width = W + 'px'; canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr); }
  const statusEl = document.getElementById("playable-status");

  const N = 8;
  let board, turn, winner, sel;
  let checkW = 0, checkB = 0;  // checks received by white / black
  let enPassant = null;        // { r, c } target square or null
  let castleRights = { K: true, Q: true, k: true, q: true };

  function newGame() {
    board = [
      ['r','n','b','q','k','b','n','r'],
      ['p','p','p','p','p','p','p','p'],
      ['.','.','.','.','.','.','.','.'],
      ['.','.','.','.','.','.','.','.'],
      ['.','.','.','.','.','.','.','.'],
      ['.','.','.','.','.','.','.','.'],
      ['P','P','P','P','P','P','P','P'],
      ['R','N','B','Q','K','B','N','R'],
    ];
    turn = "you"; winner = null; sel = null;
    checkW = 0; checkB = 0;
    enPassant = null;
    castleRights = { K: true, Q: true, k: true, q: true };
  }
  newGame();

  const isWhite = (p) => p !== '.' && p === p.toUpperCase();
  const isBlack = (p) => p !== '.' && p === p.toLowerCase();
  const own = (p, side) => side === 'w' ? isWhite(p) : isBlack(p);
  const enemy = (p, side) => side === 'w' ? isBlack(p) : isWhite(p);

  function findKing(b, side) {
    const k = side === 'w' ? 'K' : 'k';
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (b[r][c] === k) return [r, c];
    return null;
  }

  function inCheck(b, side) {
    const kp = findKing(b, side);
    if (!kp) return false;
    const enemySide = side === 'w' ? 'b' : 'w';
    const atkMoves = genAllMoves(b, enemySide);
    return atkMoves.some(m => m.cap && m.to[0] === kp[0] && m.to[1] === kp[1]);
  }

  function genMovesFor(b, r, c) {
    const p = b[r][c]; if (p === '.') return [];
    const out = [];
    const side = isWhite(p) ? 'w' : 'b';
    const en = (p2) => enemy(p2, side);
    const fr = (nr, nc) => { if (nr<0||nr>=N||nc<0||nc>=N) return false; if (own(b[nr][nc], side)) return false; out.push({ from:[r,c], to:[nr,nc], cap: en(b[nr][nc]) }); return b[nr][nc] === '.'; };
    const ray = (dr, dc) => { let nr=r+dr, nc=c+dc; while(nr>=0&&nr<N&&nc>=0&&nc<N){ if (own(b[nr][nc], side)) return; out.push({ from:[r,c], to:[nr,nc], cap: en(b[nr][nc]) }); if (b[nr][nc] !== '.') return; nr+=dr; nc+=dc; } };
    const t = p.toLowerCase();
    if (t === 'p') {
      const dir = isWhite(p) ? -1 : 1;
      const startRow = isWhite(p) ? 6 : 1;
      if (r+dir >= 0 && r+dir < N && b[r+dir][c] === '.') {
        out.push({ from:[r,c], to:[r+dir,c] });
        if (r === startRow && b[r+2*dir][c] === '.') out.push({ from:[r,c], to:[r+2*dir,c] });
      }
      for (const dc of [-1, 1]) { const nr = r+dir, nc = c+dc; if (nr>=0&&nr<N&&nc>=0&&nc<N && en(b[nr][nc])) out.push({ from:[r,c], to:[nr,nc], cap:true }); }
      // En passant
      if (enPassant && r === (isWhite(p) ? 3 : 4)) {
        for (const dc of [-1, 1]) if (c + dc === enPassant.c) out.push({ from:[r,c], to:[enPassant.r, enPassant.c], cap:true, ep:true });
      }
    } else if (t === 'n') {
      for (const [dr, dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]) fr(r+dr, c+dc);
    } else if (t === 'b') { for (const [dr,dc] of [[-1,-1],[-1,1],[1,-1],[1,1]]) ray(dr, dc); }
    else if (t === 'r') { for (const [dr,dc] of [[-1,0],[1,0],[0,-1],[0,1]]) ray(dr, dc); }
    else if (t === 'q') { for (const [dr,dc] of [[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]]) ray(dr, dc); }
    else if (t === 'k') {
      for (const [dr, dc] of [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]) fr(r+dr, c+dc);
      // Castling
      if (isWhite(p)) {
        if (castleRights.K && b[7][5] === '.' && b[7][6] === '.') out.push({ from:[7,4], to:[7,6], castle:'K' });
        if (castleRights.Q && b[7][1] === '.' && b[7][2] === '.' && b[7][3] === '.') out.push({ from:[7,4], to:[7,2], castle:'Q' });
      } else {
        if (castleRights.k && b[0][5] === '.' && b[0][6] === '.') out.push({ from:[0,4], to:[0,6], castle:'k' });
        if (castleRights.q && b[0][1] === '.' && b[0][2] === '.' && b[0][3] === '.') out.push({ from:[0,4], to:[0,2], castle:'q' });
      }
    }
    return out;
  }

  function genAllMoves(b, side) {
    const out = [];
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
      const p = b[r][c];
      if (own(p, side)) out.push(...genMovesFor(b, r, c));
    }
    return out;
  }

  function apply(b, m) {
    const p = b[m.from[0]][m.from[1]];
    b[m.from[0]][m.from[1]] = '.';
    // En passant capture
    if (m.ep) b[m.from[0]][m.to[1]] = '.';
    // Castling
    if (m.castle) {
      if (m.castle === 'K') { b[7][5] = 'R'; b[7][7] = '.'; }
      if (m.castle === 'Q') { b[7][3] = 'R'; b[7][0] = '.'; }
      if (m.castle === 'k') { b[0][5] = 'r'; b[0][7] = '.'; }
      if (m.castle === 'q') { b[0][3] = 'r'; b[0][0] = '.'; }
    }
    let np = p;
    if (p === 'P' && m.to[0] === 0) np = 'Q';
    else if (p === 'p' && m.to[0] === N-1) np = 'q';
    b[m.to[0]][m.to[1]] = np;
  }

  function makeMove(m) {
    const p = board[m.from[0]][m.from[1]];
    const side = isWhite(p) ? 'w' : 'b';

    // Update en passant
    if (p.toLowerCase() === 'p' && Math.abs(m.to[0] - m.from[0]) === 2) {
      enPassant = { r: (m.from[0] + m.to[0]) / 2, c: m.from[1] };
    } else {
      enPassant = null;
    }

    // Update castling rights
    if (p === 'K') { castleRights.K = false; castleRights.Q = false; }
    if (p === 'k') { castleRights.k = false; castleRights.q = false; }
    if (p === 'R') { if (m.from[1] === 0) castleRights.Q = false; if (m.from[1] === 7) castleRights.K = false; }
    if (p === 'r') { if (m.from[1] === 0) castleRights.q = false; if (m.from[1] === 7) castleRights.k = false; }

    apply(board, m);

    // Check for three-check win
    const enemySide = side === 'w' ? 'b' : 'w';
    if (inCheck(board, enemySide)) {
      if (enemySide === 'b') { checkB++; if (checkB >= 3) { winner = "you"; return; } }
      else { checkW++; if (checkW >= 3) { winner = "ai"; return; } }
    }

    // Check for king capture win
    if (!findKing(board, 'b')) { winner = "you"; return; }
    if (!findKing(board, 'w')) { winner = "ai"; return; }

    turn = (side === 'w') ? 'ai' : 'you';
  }

  const VAL = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 1000 };
  function evaluate(b) {
    let s = 0;
    for (const row of b) for (const v of row) {
      if (v === '.') continue;
      s += isWhite(v) ? -VAL[v.toLowerCase()] : VAL[v.toLowerCase()];
    }
    // Bonus for delivering check
    if (inCheck(b, 'w')) s += 0.5;
    if (inCheck(b, 'b')) s -= 0.5;
    return s; // positive = AI advantage
  }

  function minimax(b, depth, side, alpha, beta) {
    if (depth === 0 || !findKing(b, 'w') || !findKing(b, 'b')) return evaluate(b);
    const moves = genAllMoves(b, side);
    if (!moves.length) return evaluate(b);
    if (side === 'b') {
      let best = -Infinity;
      for (const mv of moves) {
        const snap = b.map(r => r.slice());
        const epSnap = enPassant; const crSnap = { ...castleRights };
        apply(b, mv);
        const v = minimax(b, depth - 1, 'w', alpha, beta);
        b.forEach((r, i) => snap[i].forEach((x, j) => r[j] = x));
        enPassant = epSnap; castleRights = crSnap;
        if (v > best) best = v;
        if (best > alpha) alpha = best;
        if (alpha >= beta) break;
      }
      return best;
    } else {
      let best = Infinity;
      for (const mv of moves) {
        const snap = b.map(r => r.slice());
        const epSnap = enPassant; const crSnap = { ...castleRights };
        apply(b, mv);
        const v = minimax(b, depth - 1, 'b', alpha, beta);
        b.forEach((r, i) => snap[i].forEach((x, j) => r[j] = x));
        enPassant = epSnap; castleRights = crSnap;
        if (v < best) best = v;
        if (best < beta) beta = best;
        if (alpha >= beta) break;
      }
      return best;
    }
  }

  function aiMove() {
    if (winner) return;
    const moves = genAllMoves(board, 'b');
    if (!moves.length) { winner = "you"; draw(); return; }
    let best = moves[0], bestScore = -Infinity;
    for (const mv of moves) {
      const snap = board.map(r => r.slice());
      const epSnap = enPassant; const crSnap = { ...castleRights };
      apply(board, mv);
      const v = minimax(board, 2, 'w', -Infinity, Infinity);
      board.forEach((r, i) => snap[i].forEach((x, j) => r[j] = x));
      enPassant = epSnap; castleRights = crSnap;
      if (v > bestScore) { bestScore = v; best = mv; }
    }
    const side = 'b';
    const p = board[best.from[0]][best.from[1]];
    const enemySide = side === 'w' ? 'b' : 'w';
    apply(board, best);
    if (inCheck(board, enemySide)) { checkW++; if (checkW >= 3) { winner = "ai"; draw(); return; } }
    if (!findKing(board, 'w')) { winner = "ai"; draw(); return; }
    if (!findKing(board, 'b')) { winner = "you"; draw(); return; }
    turn = "you"; draw();
  }

  function cellRect(r, c) {
    const margin = 16, cs = (size - 2 * margin) / N;
    return { x: margin + c * cs, y: 30 + r * cs, w: cs, h: cs };
  }
  const glyph = { p:'♟', n:'♞', b:'♝', r:'♜', q:'♛', k:'♚', P:'♙', N:'♘', B:'♗', R:'♖', Q:'♕', K:'♔' };

  function draw() {
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    const cs = (size - 32) / N;
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
      const rc = cellRect(r, c);
      ctx.fillStyle = (r + c) % 2 === 0 ? "#f0d9b5" : "#b58863";
      ctx.fillRect(rc.x, rc.y, rc.w, rc.h);
      if (sel && sel.r === r && sel.c === c) { ctx.fillStyle = "rgba(120,220,120,0.5)"; ctx.fillRect(rc.x, rc.y, rc.w, rc.h); }
      const p = board[r][c]; if (p === '.') continue;
      ctx.fillStyle = isWhite(p) ? "#fff" : "#000";
      ctx.strokeStyle = isWhite(p) ? "#666" : "#333";
      ctx.font = `${rc.w * 0.72}px serif`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      const g = glyph[p]; ctx.lineWidth = 1.5; ctx.strokeText(g, rc.x + rc.w/2, rc.y + rc.h/2 + 2);
      ctx.fillText(g, rc.x + rc.w/2, rc.y + rc.h/2 + 2);
    }
    ctx.textBaseline = "alphabetic";
    if (winner) {
      statusEl.textContent = winner === "you" ? "you win!" : "AI wins";
    } else {
      const wt = turn === "you" ? (sel ? "click destination" : "click your piece") : "AI thinking…";
      statusEl.textContent = `${wt}  —  checks: YOU ${checkB} / AI ${checkW}`;
    }
  }

  function pos(e) { const r = canvas.getBoundingClientRect(); return { x: (e.clientX - r.left) * (W / r.width), y: (e.clientY - r.top) * (H / r.height) }; }

  function onClick(e) {
    if (winner || turn !== "you") return;
    const { x, y } = pos(e);
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
      const rc = cellRect(r, c);
      if (x < rc.x || x > rc.x + rc.w || y < rc.y || y > rc.y + rc.h) continue;
      const moves = genAllMoves(board, 'w');
      if (sel) {
        const m = moves.find(mv => mv.from[0] === sel.r && mv.from[1] === sel.c && mv.to[0] === r && mv.to[1] === c);
        if (m) { sel = null; makeMove(m); if (winner) { draw(); return; } draw(); setTimeout(aiMove, 350); return; }
        if (isWhite(board[r][c]) && moves.some(mv => mv.from[0] === r && mv.from[1] === c)) { sel = { r, c }; draw(); return; }
        sel = null; draw(); return;
      } else {
        if (isWhite(board[r][c]) && moves.some(mv => mv.from[0] === r && mv.from[1] === c)) { sel = { r, c }; draw(); }
        return;
      }
    }
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve() {
      if (winner || turn !== "you") return;
      const moves = genAllMoves(board, 'w');
      if (!moves.length) { winner = "ai"; draw(); return; }
      const mv = moves[Math.floor(Math.random() * moves.length)];
      sel = null; makeMove(mv);
      if (winner) { draw(); return; }
      draw(); setTimeout(aiMove, 80);
    },
    destroy() { canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart() { newGame(); draw(); },
  };
}
