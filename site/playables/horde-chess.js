// Horde chess — 8×8. You play BLACK (standard chess army on top, ranks 0-1).
// The AI plays the white HORDE: 32 pawns filling ranks 4-7 (simplified from
// the 36-pawn rule — just full pawn formation). You win by capturing all
// horde pawns; horde wins by capturing your king. Simplified: no check,
// pawns promote to Q. AI moves a random pawn that captures, else advances.

export function create(canvas) {
  const ctx = canvas.getContext("2d");

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
      ['P','P','P','P','P','P','P','P'],
      ['P','P','P','P','P','P','P','P'],
      ['P','P','P','P','P','P','P','P'],
      ['P','P','P','P','P','P','P','P'],
    ];
    turn = "you"; winner = null; sel = null;
  }
  newGame();

  const isYou = (p) => p === 'p' || p === 'r' || p === 'n' || p === 'b' || p === 'q' || p === 'k'; // black lowercase
  const isAI = (p) => p !== '.' && p === p.toUpperCase(); // horde white uppercase

  function genMovesFor(b, r, c){
    const p = b[r][c]; if (p === '.') return [];
    const out = [];
    const mine = isYou(p) ? isYou : isAI;
    const enemy = isYou(p) ? isAI : isYou;
    const push = (nr, nc) => { if (nr<0||nr>=N||nc<0||nc>=N) return false; if (mine(b[nr][nc])) return false; out.push({ from:[r,c], to:[nr,nc] }); return b[nr][nc] === '.'; };
    const ray = (dr, dc) => { let nr=r+dr, nc=c+dc; while(nr>=0&&nr<N&&nc>=0&&nc<N){ if (mine(b[nr][nc])) return; out.push({ from:[r,c], to:[nr,nc] }); if (b[nr][nc] !== '.') return; nr+=dr; nc+=dc; } };
    const t = p.toLowerCase();
    if (t === 'p'){
      const dir = isYou(p) ? 1 : -1; // black moves down, white horde moves up
      const startRow = isYou(p) ? 1 : 6;
      if (r+dir >= 0 && r+dir < N && b[r+dir][c] === '.'){ out.push({ from:[r,c], to:[r+dir,c] }); if (r === startRow && b[r+2*dir][c] === '.') out.push({ from:[r,c], to:[r+2*dir,c] }); }
      for (const dc of [-1, 1]){ const nr = r+dir, nc = c+dc; if (nr>=0&&nr<N&&nc>=0&&nc<N && enemy(b[nr][nc])) out.push({ from:[r,c], to:[nr,nc], cap:true }); }
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
    if (p === 'p' && m.to[0] === N-1) np = 'q';
    else if (p === 'P' && m.to[0] === 0) np = 'Q';
    b[m.to[0]][m.to[1]] = np;
  }
  function countHorde(b){ let n = 0; for (const row of b) for (const v of row) if (isAI(v)) n++; return n; }
  function hasKing(b){ for (const row of b) for (const v of row) if (v === 'k') return true; return false; }

  function aiMove(){
    if (winner) return;
    const moves = allMoves(board, "ai");
    if (!moves.length){ winner = "you"; draw(); return; }
    const caps = moves.filter(m => board[m.to[0]][m.to[1]] !== '.');
    const pool = caps.length ? caps : moves;
    // prefer captures of higher value pieces, else random forward push
    const m = pool[Math.floor(Math.random() * pool.length)];
    apply(board, m);
    if (!hasKing(board)){ winner = "ai"; draw(); return; }
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
    ctx.fillStyle = "#444"; ctx.font = "11px sans-serif"; ctx.textAlign = "left";
    ctx.fillText(`horde pawns left: ${countHorde(board)}`, 12, H - 8);
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
          if (countHorde(board) === 0){ winner = "you"; draw(); return; }
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
