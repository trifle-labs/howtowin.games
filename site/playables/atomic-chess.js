// Atomic chess — standard chess, but every capture "explodes" the captured
// square plus all 8 non-pawn neighbours (the capturing piece also dies). Pawn
// captures still remove only the pawns on the captured square (the pawn that
// captured also dies). Kings cannot capture. Win by exploding the enemy king
// (or normal mate). Simplified: no castling/en passant/check rules — kings
// can move into "check" since detonation is the only path to victory here.
// AI: depth-1 search, evaluates blasting opponent king.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  function _fit(ctx, t, x, y, maxW){
    let f = parseFloat(ctx.font) || 12;
    while (f > 8 && ctx.measureText(t).width > maxW){ f--; ctx.font = ctx.font.replace(/[\d.]+px/, f + 'px'); }
    ctx.fillText(t, x, y);
  }

  const size = Math.min(canvas.parentElement.clientWidth - 24, 400);
  canvas.width = size; canvas.height = size + 30;
  const W = canvas.width, H = canvas.height;
  const statusEl = document.getElementById("playable-status");

  const N = 8;
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

  function genMovesFor(b, r, c){
    const p = b[r][c]; if (p === '.') return [];
    const out = [];
    const mine = isYou(p) ? isYou : isAI;
    const enemy = isYou(p) ? isAI : isYou;
    const push = (nr, nc) => { if (nr<0||nr>=N||nc<0||nc>=N) return false; if (mine(b[nr][nc])) return false; const cap = enemy(b[nr][nc]); if (cap && p.toLowerCase() === 'k') return false; out.push({ from:[r,c], to:[nr,nc], cap }); return b[nr][nc] === '.'; };
    const ray = (dr, dc) => { let nr=r+dr, nc=c+dc; while(nr>=0&&nr<N&&nc>=0&&nc<N){ if (mine(b[nr][nc])) return; const cap = enemy(b[nr][nc]); if (cap && p.toLowerCase() === 'k') return; out.push({ from:[r,c], to:[nr,nc], cap }); if (b[nr][nc] !== '.') return; nr+=dr; nc+=dc; } };
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
      const p = b[r][c]; if (p === '.') continue;
      if (side === "you" ? isYou(p) : isAI(p)) out.push(...genMovesFor(b, r, c));
    }
    return out;
  }
  function apply(b, m){
    const movingPiece = b[m.from[0]][m.from[1]];
    b[m.from[0]][m.from[1]] = '.';
    if (m.cap){
      // explosion: remove captured square, the moving piece, and all non-pawn pieces on 8 neighbours
      b[m.to[0]][m.to[1]] = '.';
      for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++){
        if (dr === 0 && dc === 0) continue;
        const nr = m.to[0] + dr, nc = m.to[1] + dc;
        if (nr<0||nr>=N||nc<0||nc>=N) continue;
        const v = b[nr][nc];
        if (v !== '.' && v.toLowerCase() !== 'p') b[nr][nc] = '.';
      }
      return;
    }
    let np = movingPiece;
    if (movingPiece === 'P' && m.to[0] === 0) np = 'Q';
    else if (movingPiece === 'p' && m.to[0] === N-1) np = 'q';
    b[m.to[0]][m.to[1]] = np;
  }
  function kingPresent(b, side){
    const tgt = side === "you" ? 'K' : 'k';
    for (const row of b) for (const v of row) if (v === tgt) return true;
    return false;
  }
  const VAL = { p:1, n:3, b:3, r:5, q:9, k:0 };
  function evalB(b){
    let s = 0;
    for (const row of b) for (const v of row){ if (v === '.') continue; const val = VAL[v.toLowerCase()] || 0; s += isAI(v) ? val : -val; }
    return s;
  }

  function aiMove(){
    if (winner) return;
    const moves = allMoves(board, "ai");
    if (!moves.length){ winner = "you"; draw(); return; }
    let best = moves[0], bestScore = -Infinity;
    for (const m of moves){
      const b2 = board.map(row => row.slice()); apply(b2, m);
      let score;
      if (!kingPresent(b2, "you")) score = 100000;
      else if (!kingPresent(b2, "ai")) score = -100000;
      else {
        const reply = allMoves(b2, "you");
        let worst = Infinity;
        for (const r2 of reply){
          const b3 = b2.map(row => row.slice()); apply(b3, r2);
          let s;
          if (!kingPresent(b3, "ai")) s = -100000;
          else if (!kingPresent(b3, "you")) s = 100000;
          else s = evalB(b3);
          worst = Math.min(worst, s);
        }
        score = reply.length ? worst : evalB(b2);
      }
      if (score > bestScore){ bestScore = score; best = m; }
    }
    apply(board, best);
    if (!kingPresent(board, "you")){ winner = "ai"; draw(); return; }
    if (!kingPresent(board, "ai")){ winner = "you"; draw(); return; }
    turn = "you"; draw();
  }

  function cellRect(r, c){
    const margin = 16, cs = (size - 2*margin) / N;
    return { x: margin + c*cs, y: 30 + r*cs, w: cs, h: cs };
  }
  const glyph = { p:'♟', n:'♞', b:'♝', r:'♜', q:'♛', k:'♚' };

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "12px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";
    _fit(ctx, "Atomic chess — captures EXPLODE 3×3 area; king cannot capture; blow up enemy king", W/2, 18, W - 8);
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const rc = cellRect(r, c);
      ctx.fillStyle = (r + c) % 2 === 0 ? "#f6e3b4" : "#b58863";
      ctx.fillRect(rc.x, rc.y, rc.w, rc.h);
      if (sel && sel.r === r && sel.c === c){ ctx.fillStyle = "rgba(120,220,120,0.5)"; ctx.fillRect(rc.x, rc.y, rc.w, rc.h); }
      const p = board[r][c]; if (p === '.') continue;
      ctx.fillStyle = isYou(p) ? "#222" : "#fff"; ctx.strokeStyle = isYou(p) ? "#fff" : "#000";
      ctx.font = `${rc.w*0.7}px serif`; ctx.textBaseline = "middle";
      const g = glyph[p.toLowerCase()];
      ctx.lineWidth = 2; ctx.strokeText(g, rc.x + rc.w/2, rc.y + rc.h/2 + 2);
      ctx.fillText(g, rc.x + rc.w/2, rc.y + rc.h/2 + 2);
    }
    ctx.textBaseline = "alphabetic";
    if (winner) statusEl.textContent = winner === "you" ? "you win!" : "AI wins";
    else statusEl.textContent = turn === "you" ? (sel ? "click destination" : "click your piece") : "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }

  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e);
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const rc = cellRect(r, c);
      if (x < rc.x || x > rc.x + rc.w || y < rc.y || y > rc.y + rc.h) continue;
      const moves = allMoves(board, "you");
      if (sel){
        const m = moves.find(mv => mv.from[0] === sel.r && mv.from[1] === sel.c && mv.to[0] === r && mv.to[1] === c);
        if (m){
          apply(board, m); sel = null;
          if (!kingPresent(board, "ai")){ winner = "you"; draw(); return; }
          if (!kingPresent(board, "you")){ winner = "ai"; draw(); return; }
          turn = "ai"; draw(); setTimeout(aiMove, 300); return;
        }
        if (isYou(board[r][c])){ sel = { r, c }; draw(); return; }
        sel = null; draw(); return;
      } else {
        if (isYou(board[r][c])){ sel = { r, c }; draw(); }
        return;
      }
    }
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve(){
      if (winner || turn !== "you") return;
      const __mvs = allMoves(board, "you");
      if (!__mvs.length) { winner = "ai"; draw(); return; }
      const __mv = __mvs[Math.floor(Math.random() * __mvs.length)];
      apply(board, __mv);
      turn = "ai"; draw();
      setTimeout(aiMove, 80);
    },

    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
