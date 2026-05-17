// Shatranj — the medieval ancestor of chess. 8×8 board with chess setup. Key
// differences from modern chess: queen (Firzān) moves one square diagonally;
// bishop (Alfil) jumps exactly two squares diagonally; pawns no two-square
// move; no castling; no en passant; pawn promotes only to queen (Firzān).
// You play white. AI: 2-ply material.

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 400);
  canvas.width = size;
  canvas.height = size + 30;
  const W = canvas.width, H = canvas.height;
  const statusEl = document.getElementById("playable-status");

  const N = 8;
  let board, turn, winner, sel;
  function newGame(){
    board = Array.from({ length: N }, () => new Array(N).fill('.'));
    board[0] = ['r','n','b','q','k','b','n','r'];
    for (let c = 0; c < N; c++) board[1][c] = 'p';
    board[N-1] = ['R','N','B','Q','K','B','N','R'];
    for (let c = 0; c < N; c++) board[N-2][c] = 'P';
    turn = "you"; winner = null; sel = null;
  }
  newGame();

  const isWhite = (p) => p !== '.' && p === p.toUpperCase();
  const own = (p, side) => side === 'w' ? isWhite(p) : (p !== '.' && !isWhite(p));
  const enemy = (p, side) => side === 'w' ? (p !== '.' && !isWhite(p)) : isWhite(p);

  function genMoves(b, side){
    const out = [];
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const p = b[r][c]; if (p === '.') continue; if (!own(p, side)) continue;
      const lower = p.toLowerCase();
      function tryAdd(nr, nc){
        if (nr < 0 || nr >= N || nc < 0 || nc >= N) return false;
        const t = b[nr][nc];
        if (t === '.'){ out.push({ from: [r, c], to: [nr, nc] }); return true; }
        if (enemy(t, side)) out.push({ from: [r, c], to: [nr, nc] });
        return false;
      }
      function slide(dirs){
        for (const [dr, dc] of dirs){
          let nr = r + dr, nc = c + dc;
          while (tryAdd(nr, nc)){ nr += dr; nc += dc; }
        }
      }
      if (lower === 'p'){
        const dir = side === 'w' ? -1 : 1;
        const fr = r + dir;
        if (fr >= 0 && fr < N && b[fr][c] === '.') out.push({ from: [r, c], to: [fr, c] });
        for (const dc of [-1, 1]){
          const nc = c + dc;
          if (fr < 0 || fr >= N || nc < 0 || nc >= N) continue;
          if (enemy(b[fr][nc], side)) out.push({ from: [r, c], to: [fr, nc] });
        }
      } else if (lower === 'n'){
        for (const [dr, dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]) tryAdd(r + dr, c + dc);
      } else if (lower === 'b'){
        // alfil: jump exactly two diagonally, can leap
        for (const [dr, dc] of [[-2,-2],[-2,2],[2,-2],[2,2]]){
          const nr = r + dr, nc = c + dc;
          if (nr < 0 || nr >= N || nc < 0 || nc >= N) continue;
          const t = b[nr][nc];
          if (t === '.' || enemy(t, side)) out.push({ from: [r, c], to: [nr, nc] });
        }
      } else if (lower === 'r'){
        slide([[-1,0],[1,0],[0,-1],[0,1]]);
      } else if (lower === 'q'){
        // firzan: one square diagonally
        for (const [dr, dc] of [[-1,-1],[-1,1],[1,-1],[1,1]]) tryAdd(r + dr, c + dc);
      } else if (lower === 'k'){
        for (const [dr, dc] of [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]) tryAdd(r + dr, c + dc);
      }
    }
    return out;
  }
  function applyMove(b, mv){
    const [fr, fc] = mv.from, [tr, tc] = mv.to;
    let p = b[fr][fc];
    if (p === 'P' && tr === 0) p = 'Q';
    if (p === 'p' && tr === N-1) p = 'q';
    b[tr][tc] = p; b[fr][fc] = '.';
  }
  function findKing(b, side){
    const target = side === 'w' ? 'K' : 'k';
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (b[r][c] === target) return [r, c];
    return null;
  }
  const VAL = { p: 1, n: 3, b: 2, r: 5, q: 2, k: 100 };
  function material(b){
    let s = 0;
    for (const row of b) for (const v of row){
      if (v === '.') continue;
      const w = VAL[v.toLowerCase()];
      s += isWhite(v) ? -w : w;
    }
    return s;
  }
  function minimax(b, depth, side, alpha, beta){
    if (depth === 0 || !findKing(b, 'w') || !findKing(b, 'b')) return material(b);
    const moves = genMoves(b, side);
    if (!moves.length) return material(b);
    if (side === 'b'){
      let best = -Infinity;
      for (const mv of moves){
        const snap = b.map(r => r.slice());
        applyMove(b, mv);
        const v = minimax(b, depth-1, 'w', alpha, beta);
        b.forEach((r, i) => snap[i].forEach((x, j) => r[j] = x));
        if (v > best) best = v;
        if (best > alpha) alpha = best;
        if (alpha >= beta) break;
      }
      return best;
    } else {
      let best = Infinity;
      for (const mv of moves){
        const snap = b.map(r => r.slice());
        applyMove(b, mv);
        const v = minimax(b, depth-1, 'b', alpha, beta);
        b.forEach((r, i) => snap[i].forEach((x, j) => r[j] = x));
        if (v < best) best = v;
        if (best < beta) beta = best;
        if (alpha >= beta) break;
      }
      return best;
    }
  }
  function aiMove(){
    if (winner) return;
    const moves = genMoves(board, 'b');
    if (!moves.length){ winner = "you"; draw(); return; }
    let best = null, bestScore = -Infinity;
    for (const mv of moves){
      const snap = board.map(r => r.slice());
      applyMove(board, mv);
      const v = minimax(board, 1, 'w', -Infinity, Infinity);
      board = snap;
      if (v > bestScore){ bestScore = v; best = mv; }
    }
    applyMove(board, best);
    if (!findKing(board, 'w')){ winner = "ai"; draw(); return; }
    turn = "you"; draw();
  }

  function cellRect(r, c){
    const margin = 16, cs = (size - 2*margin) / N;
    return { x: margin + c*cs, y: 30 + r*cs, w: cs, h: cs };
  }
  const GLYPH = { K:'♔', Q:'♕', R:'♖', B:'♗', N:'♘', P:'♙', k:'♚', q:'♛', r:'♜', b:'♝', n:'♞', p:'♟' };

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "12px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const rc = cellRect(r, c);
      ctx.fillStyle = (r + c) % 2 === 0 ? "#f6e3b4" : "#b58863";
      ctx.fillRect(rc.x, rc.y, rc.w, rc.h);
      if (sel && sel.r === r && sel.c === c){ ctx.fillStyle = "rgba(120,220,120,0.5)"; ctx.fillRect(rc.x, rc.y, rc.w, rc.h); }
      const p = board[r][c]; if (p === '.') continue;
      ctx.font = `${Math.floor(rc.w * 0.7)}px sans-serif`;
      ctx.fillStyle = isWhite(p) ? "#fff" : "#000";
      ctx.fillText(GLYPH[p], rc.x + rc.w/2, rc.y + rc.h * 0.72);
    }
    if (winner) statusEl.textContent = winner === "you" ? "you win!" : "AI wins";
    else statusEl.textContent = turn === "you" ? (sel ? "click target square" : "click your piece") : "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }
  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e);
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const rc = cellRect(r, c);
      if (x < rc.x || x > rc.x + rc.w || y < rc.y || y > rc.y + rc.h) continue;
      if (sel){
        if (sel.r === r && sel.c === c){ sel = null; draw(); return; }
        if (isWhite(board[r][c])){ sel = { r, c }; draw(); return; }
        const moves = genMoves(board, 'w');
        const mv = moves.find(m => m.from[0] === sel.r && m.from[1] === sel.c && m.to[0] === r && m.to[1] === c);
        if (!mv){ sel = null; draw(); return; }
        applyMove(board, mv); sel = null;
        if (!findKing(board, 'b')){ winner = "you"; draw(); return; }
        turn = "ai"; draw(); setTimeout(aiMove, 350); return;
      } else {
        if (isWhite(board[r][c])){ sel = { r, c }; draw(); }
        return;
      }
    }
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve(){
      if (winner || turn !== "you") return;
      const __mvs = genMoves(board, 'w');
      if (!__mvs || !__mvs.length) { winner = "ai"; draw(); return; }
      const __mv = __mvs[Math.floor(Math.random() * __mvs.length)];
      applyMove(board, __mv);
      if (!findKing(board, 'b')){ winner = "you"; draw(); return; }
      turn = "ai"; draw();
      setTimeout(aiMove, 80);
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
