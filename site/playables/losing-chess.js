// Losing chess (antichess) — 8×8 standard chess pieces. Capture is COMPULSORY;
// you win by losing all your pieces (or being stalemated). King has no royal
// status — captureable and no castling/check. Pawn promotion to any piece
// (we always promote to queen, but for losing chess promoting to a lesser
// piece is often strategic — kept simple here). AI: depth-1 search preferring
// moves that minimise its remaining material (since losing = winning).

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 400);
  canvas.width = size; canvas.height = size + 30;
  const W = canvas.width, H = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) { canvas.style.width = W + 'px'; canvas.style.height = H + 'px'; canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr); }
  const statusEl = document.getElementById("playable-status");

  const N = 8;
  // pieces: lowercase = AI (white), uppercase = you (black). Reverse from chess
  // here because in losing chess colour doesn't matter; we just call the user black-on-bottom.
  let board, turn, winner, sel;
  function newGame(){
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
  }
  newGame();

  const isYou = (p) => p !== '.' && p === p.toUpperCase();
  const isAI = (p) => p !== '.' && p === p.toLowerCase();
  const opp = (side) => side === "you" ? "ai" : "you";

  function genMovesFor(b, r, c){
    const p = b[r][c]; if (p === '.') return [];
    const out = [];
    const mine = isYou(p) ? isYou : isAI;
    const enemy = isYou(p) ? isAI : isYou;
    const push = (nr, nc) => { if (nr<0||nr>=N||nc<0||nc>=N) return false; if (mine(b[nr][nc])) return false; out.push({ from:[r,c], to:[nr,nc], cap: enemy(b[nr][nc]) }); return b[nr][nc] === '.'; };
    const ray = (dr, dc) => { let nr=r+dr, nc=c+dc; while(nr>=0&&nr<N&&nc>=0&&nc<N){ if (mine(b[nr][nc])) return; out.push({ from:[r,c], to:[nr,nc], cap: enemy(b[nr][nc]) }); if (b[nr][nc] !== '.') return; nr+=dr; nc+=dc; } };
    const t = p.toLowerCase();
    if (t === 'p'){
      const dir = isYou(p) ? -1 : 1;
      const startRow = isYou(p) ? 6 : 1;
      if (r+dir >= 0 && r+dir < N && b[r+dir][c] === '.'){ out.push({ from:[r,c], to:[r+dir,c] }); if (r === startRow && b[r+2*dir][c] === '.') out.push({ from:[r,c], to:[r+2*dir,c] }); }
      for (const dc of [-1, 1]){ const nr = r+dir, nc = c+dc; if (nr>=0&&nr<N&&nc>=0&&nc<N && enemy(b[nr][nc])) out.push({ from:[r,c], to:[nr,nc], cap:true }); }
    } else if (t === 'n'){
      for (const [dr, dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]) push(r+dr, c+dc);
    } else if (t === 'b'){ for (const [dr,dc] of [[-1,-1],[-1,1],[1,-1],[1,1]]) ray(dr,dc); }
    else if (t === 'r'){ for (const [dr,dc] of [[-1,0],[1,0],[0,-1],[0,1]]) ray(dr,dc); }
    else if (t === 'q'){ for (const [dr,dc] of [[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]]) ray(dr,dc); }
    else if (t === 'k'){
      for (const [dr, dc] of [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]) push(r+dr, c+dc);
    }
    return out;
  }

  function allMoves(b, side){
    const out = [];
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const p = b[r][c];
      if (side === "you" ? isYou(p) : isAI(p)) out.push(...genMovesFor(b, r, c));
    }
    return out;
  }
  function legal(b, side){
    const all = allMoves(b, side);
    const caps = all.filter(m => m.cap);
    return caps.length ? caps : all;
  }
  function apply(b, m){
    const p = b[m.from[0]][m.from[1]];
    b[m.from[0]][m.from[1]] = '.';
    let np = p;
    if (p === 'P' && m.to[0] === 0) np = 'Q';
    else if (p === 'p' && m.to[0] === N-1) np = 'q';
    b[m.to[0]][m.to[1]] = np;
  }
  function pieceCount(b, side){
    let n = 0; for (const row of b) for (const v of row) if (side === "you" ? isYou(v) : isAI(v)) n++; return n;
  }

  function checkEnd(){
    if (pieceCount(board, "you") === 0){ winner = "you"; return true; }
    if (pieceCount(board, "ai") === 0){ winner = "ai"; return true; }
    const moves = legal(board, turn);
    if (!moves.length){ winner = turn; return true; } // stalemated player wins in antichess
    return false;
  }

  function aiMove(){
    if (winner) return;
    const moves = legal(board, "ai");
    if (!moves.length){ winner = "ai"; draw(); return; }
    // pick move that gives away most material (best for the AI here = losing)
    let best = moves[0], bestScore = Infinity;
    for (const m of moves){
      const b2 = board.map(row => row.slice()); apply(b2, m);
      const score = pieceCount(b2, "ai") - pieceCount(b2, "you") * 0.5;
      if (score < bestScore){ bestScore = score; best = m; }
    }
    apply(board, best);
    if (checkEnd()){ draw(); return; }
    turn = "you"; draw();
  }

  function cellRect(r, c){
    const margin = 16, cs = (size - 2*margin) / N;
    return { x: margin + c*cs, y: 30 + r*cs, w: cs, h: cs };
  }
  const glyph = { p:'♟', n:'♞', b:'♝', r:'♜', q:'♛', k:'♚', P:'♟', N:'♞', B:'♝', R:'♜', Q:'♛', K:'♚' };

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "12px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const rc = cellRect(r, c);
      ctx.fillStyle = (r + c) % 2 === 0 ? "#f6e3b4" : "#b58863";
      ctx.fillRect(rc.x, rc.y, rc.w, rc.h);
      if (sel && sel.r === r && sel.c === c){ ctx.fillStyle = "rgba(120,220,120,0.5)"; ctx.fillRect(rc.x, rc.y, rc.w, rc.h); }
      const p = board[r][c]; if (p === '.') continue;
      ctx.fillStyle = isYou(p) ? "#222" : "#fff"; ctx.strokeStyle = isYou(p) ? "#fff" : "#000";
      ctx.font = `${rc.w*0.7}px serif`; ctx.textBaseline = "middle";
      const g = glyph[p];
      ctx.lineWidth = 2; ctx.strokeText(g, rc.x + rc.w/2, rc.y + rc.h/2 + 2);
      ctx.fillText(g, rc.x + rc.w/2, rc.y + rc.h/2 + 2);
    }
    ctx.textBaseline = "alphabetic";
    if (winner) statusEl.textContent = winner === "you" ? "you win!" : "AI wins";
    else statusEl.textContent = turn === "you" ? (sel ? "click destination" : "click your piece — captures mandatory") : "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }

  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e);
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const rc = cellRect(r, c);
      if (x < rc.x || x > rc.x + rc.w || y < rc.y || y > rc.y + rc.h) continue;
      const moves = legal(board, "you");
      if (sel){
        const m = moves.find(mv => mv.from[0] === sel.r && mv.from[1] === sel.c && mv.to[0] === r && mv.to[1] === c);
        if (m){
          apply(board, m); sel = null;
          if (checkEnd()){ draw(); return; }
          turn = "ai"; draw(); setTimeout(aiMove, 350); return;
        }
        if (isYou(board[r][c]) && moves.some(mv => mv.from[0] === r && mv.from[1] === c)){ sel = { r, c }; draw(); return; }
        sel = null; draw(); return;
      } else {
        if (isYou(board[r][c]) && moves.some(mv => mv.from[0] === r && mv.from[1] === c)){ sel = { r, c }; draw(); }
        return;
      }
    }
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve(){
      if (winner || turn !== "you") return;
      const moves = legal(board, "you");
      if (!moves.length){ winner = "you"; draw(); return; }
      const mv = moves[Math.floor(Math.random() * moves.length)];
      apply(board, mv); sel = null;
      if (checkEnd()){ draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 80);
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
