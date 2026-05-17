// King of the Hill — standard chess board/pieces. WIN: move king safely to
// one of the 4 central squares (d4, e4, d5, e5 — board rows 3/4, cols 3/4),
// OR achieve normal checkmate (we just allow king capture). Simplified: no
// check enforcement / castling / en passant. AI: depth-1 search, prefers
// putting its king onto a center square; also captures.

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
  const HILL = [[3,3],[3,4],[4,3],[4,4]];
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
    const push = (nr, nc) => { if (nr<0||nr>=N||nc<0||nc>=N) return false; if (mine(b[nr][nc])) return false; out.push({ from:[r,c], to:[nr,nc] }); return b[nr][nc] === '.'; };
    const ray = (dr, dc) => { let nr=r+dr, nc=c+dc; while(nr>=0&&nr<N&&nc>=0&&nc<N){ if (mine(b[nr][nc])) return; out.push({ from:[r,c], to:[nr,nc] }); if (b[nr][nc] !== '.') return; nr+=dr; nc+=dc; } };
    const t = p.toLowerCase();
    if (t === 'p'){
      const dir = isYou(p) ? -1 : 1;
      const startRow = isYou(p) ? 6 : 1;
      if (r+dir >= 0 && r+dir < N && b[r+dir][c] === '.'){ out.push({ from:[r,c], to:[r+dir,c] }); if (r === startRow && b[r+2*dir][c] === '.') out.push({ from:[r,c], to:[r+2*dir,c] }); }
      for (const dc of [-1, 1]){ const nr = r+dir, nc = c+dc; if (nr>=0&&nr<N&&nc>=0&&nc<N && enemy(b[nr][nc])) out.push({ from:[r,c], to:[nr,nc] }); }
    } else if (t === 'n'){ for (const [dr, dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]) push(r+dr, c+dc); }
    else if (t === 'b'){ for (const [dr,dc] of [[-1,-1],[-1,1],[1,-1],[1,1]]) ray(dr,dc); }
    else if (t === 'r'){ for (const [dr,dc] of [[-1,0],[1,0],[0,-1],[0,1]]) ray(dr,dc); }
    else if (t === 'q'){ for (const [dr,dc] of [[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]]) ray(dr,dc); }
    else if (t === 'k'){ for (const [dr, dc] of [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]) push(r+dr, c+dc); }
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
    if (p === 'P' && m.to[0] === 0) np = 'Q';
    else if (p === 'p' && m.to[0] === N-1) np = 'q';
    b[m.to[0]][m.to[1]] = np;
  }
  function kingAt(b, side){
    const tgt = side === "you" ? 'K' : 'k';
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (b[r][c] === tgt) return [r, c];
    return null;
  }
  function onHill(pos){ return pos && HILL.some(([r, c]) => r === pos[0] && c === pos[1]); }

  const VAL = { p:1, n:3, b:3, r:5, q:9, k:0 };
  function evalB(b){
    let s = 0;
    for (const row of b) for (const v of row){ if (v === '.') continue; const val = VAL[v.toLowerCase()] || 0; s += isAI(v) ? val : -val; }
    const kY = kingAt(b, "you"); const kA = kingAt(b, "ai");
    if (kA){ for (const [hr, hc] of HILL) s -= Math.abs(kA[0] - hr) + Math.abs(kA[1] - hc); }
    if (kY){ for (const [hr, hc] of HILL) s += Math.abs(kY[0] - hr) + Math.abs(kY[1] - hc); }
    return s;
  }

  function aiMove(){
    if (winner) return;
    const moves = allMoves(board, "ai");
    if (!moves.length){ winner = "you"; draw(); return; }
    let best = moves[0], bestScore = -Infinity;
    for (const m of moves){
      const b2 = board.map(row => row.slice()); apply(b2, m);
      const aiK = kingAt(b2, "ai");
      let score;
      if (onHill(aiK)) score = 100000;
      else if (!kingAt(b2, "you")) score = 100000;
      else score = evalB(b2);
      if (score > bestScore){ bestScore = score; best = m; }
    }
    apply(board, best);
    if (onHill(kingAt(board, "ai"))){ winner = "ai"; draw(); return; }
    if (!kingAt(board, "you")){ winner = "ai"; draw(); return; }
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
    _fit(ctx, "King of the Hill — move your king to a centre square (highlighted) to win", W/2, 18, W - 8);
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const rc = cellRect(r, c);
      ctx.fillStyle = (r + c) % 2 === 0 ? "#f6e3b4" : "#b58863";
      ctx.fillRect(rc.x, rc.y, rc.w, rc.h);
      if (HILL.some(([hr, hc]) => hr === r && hc === c)){ ctx.fillStyle = "rgba(255,200,40,0.35)"; ctx.fillRect(rc.x, rc.y, rc.w, rc.h); }
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
          if (onHill(kingAt(board, "you"))){ winner = "you"; draw(); return; }
          if (!kingAt(board, "ai")){ winner = "you"; draw(); return; }
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
