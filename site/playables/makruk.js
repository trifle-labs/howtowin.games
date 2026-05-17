// Makruk — Thai chess. 8×8 with weak pieces: Met (queen-like) moves one square
// diagonally; Khon (bishop) moves one diagonal OR one forward; pieces start
// one rank advanced; pawns promote to Met on the 6th rank (row 2 for you,
// row 5 for AI). King capture wins. Simplified: no counting rules, no
// promotion choice — auto-Met. AI: depth-1 material search.

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
  // r = rook, n = horse (knight), b = khon (bishop), m = met (queen), k = king, p = pawn (bia)
  let board, turn, winner, sel;
  function newGame(){
    board = [
      ['r','n','b','m','k','b','n','r'],
      ['.','.','.','.','.','.','.','.'],
      ['p','p','p','p','p','p','p','p'],
      ['.','.','.','.','.','.','.','.'],
      ['.','.','.','.','.','.','.','.'],
      ['P','P','P','P','P','P','P','P'],
      ['.','.','.','.','.','.','.','.'],
      ['R','N','B','M','K','B','N','R'],
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
    const dir = isYou(p) ? -1 : 1;
    const push = (nr, nc) => { if (nr<0||nr>=N||nc<0||nc>=N) return false; if (mine(b[nr][nc])) return false; out.push({ from:[r,c], to:[nr,nc] }); return b[nr][nc] === '.'; };
    const ray = (dr, dc) => { let nr=r+dr, nc=c+dc; while(nr>=0&&nr<N&&nc>=0&&nc<N){ if (mine(b[nr][nc])) return; out.push({ from:[r,c], to:[nr,nc] }); if (b[nr][nc] !== '.') return; nr+=dr; nc+=dc; } };
    const t = p.toLowerCase();
    if (t === 'p'){
      if (r+dir >= 0 && r+dir < N && b[r+dir][c] === '.') out.push({ from:[r,c], to:[r+dir,c] });
      for (const dc of [-1, 1]){ const nr = r+dir, nc = c+dc; if (nr>=0&&nr<N&&nc>=0&&nc<N && enemy(b[nr][nc])) out.push({ from:[r,c], to:[nr,nc] }); }
    } else if (t === 'n'){
      for (const [dr, dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]) push(r+dr, c+dc);
    } else if (t === 'b'){ // khon: 4 diag + 1 forward
      for (const [dr, dc] of [[-1,-1],[-1,1],[1,-1],[1,1]]) push(r+dr, c+dc);
      push(r+dir, c);
    } else if (t === 'm'){ // met: 4 diag, 1 sq
      for (const [dr, dc] of [[-1,-1],[-1,1],[1,-1],[1,1]]) push(r+dr, c+dc);
    } else if (t === 'r'){ for (const [dr,dc] of [[-1,0],[1,0],[0,-1],[0,1]]) ray(dr,dc); }
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
    const p = b[m.from[0]][m.from[1]];
    b[m.from[0]][m.from[1]] = '.';
    let np = p;
    if (p === 'P' && m.to[0] === 2) np = 'M';
    else if (p === 'p' && m.to[0] === 5) np = 'm';
    b[m.to[0]][m.to[1]] = np;
  }
  const VAL = { p:1, n:3, b:3, m:2, r:5, k:1000 };
  function evalB(b){
    let s = 0;
    for (const row of b) for (const v of row){ if (v === '.') continue; const val = VAL[v.toLowerCase()]; s += isAI(v) ? val : -val; }
    return s;
  }
  function kingPresent(b, side){
    for (const row of b) for (const v of row) if (v === (side === "you" ? 'K' : 'k')) return true;
    return false;
  }

  function aiMove(){
    if (winner) return;
    const moves = allMoves(board, "ai");
    if (!moves.length){ winner = "you"; draw(); return; }
    let best = moves[0], bestScore = -Infinity;
    for (const m of moves){
      const b2 = board.map(row => row.slice()); apply(b2, m);
      let score = evalB(b2);
      // depth-1 reply
      const reply = allMoves(b2, "you");
      if (reply.length){
        let worst = Infinity;
        for (const r2 of reply){
          const b3 = b2.map(row => row.slice()); apply(b3, r2);
          worst = Math.min(worst, evalB(b3));
        }
        score = worst;
      }
      if (score > bestScore){ bestScore = score; best = m; }
    }
    apply(board, best);
    if (!kingPresent(board, "you")){ winner = "ai"; draw(); return; }
    turn = "you"; draw();
  }

  function cellRect(r, c){
    const margin = 16, cs = (size - 2*margin) / N;
    return { x: margin + c*cs, y: 30 + r*cs, w: cs, h: cs };
  }
  const glyph = { p:'♟', n:'♞', b:'△', m:'◆', r:'♜', k:'♚' };

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "12px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";
    _fit(ctx, "Makruk — Met (◆) moves one diagonal; Khon (△) diag+forward; pawn→Met at row 6", W/2, 18, W - 8);
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const rc = cellRect(r, c);
      ctx.fillStyle = (r + c) % 2 === 0 ? "#f0d59c" : "#a07842";
      ctx.fillRect(rc.x, rc.y, rc.w, rc.h);
      if (sel && sel.r === r && sel.c === c){ ctx.fillStyle = "rgba(120,220,120,0.5)"; ctx.fillRect(rc.x, rc.y, rc.w, rc.h); }
      const p = board[r][c]; if (p === '.') continue;
      ctx.fillStyle = isYou(p) ? "#222" : "#fff"; ctx.strokeStyle = isYou(p) ? "#fff" : "#000";
      ctx.font = `${rc.w*0.65}px serif`; ctx.textBaseline = "middle";
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
