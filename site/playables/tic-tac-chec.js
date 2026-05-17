// Tic-Tac-Chec — 4×4 board. Each player has 4 chess pieces (P,N,B,R) off-board.
// Turn options: BRING a piece onto any empty square (pawn cannot enter back-
// rank for own colour... we ignore this for simplicity) OR MOVE a piece using
// chess movement (captured enemy returns to their pool). 4-in-a-row of YOUR
// pieces (any 4 of your colour, on the board, in line — orthogonal or diagonal)
// wins. You play blue. AI: heuristic — prefer wins, blocks, and bringing more pieces.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  function _fit(ctx, t, x, y, maxW){
    let f = parseFloat(ctx.font) || 12;
    while (f > 8 && ctx.measureText(t).width > maxW){ f--; ctx.font = ctx.font.replace(/[\d.]+px/, f + 'px'); }
    ctx.fillText(t, x, y);
  }

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = size + 80;
  const W = canvas.width, H = canvas.height;
  const statusEl = document.getElementById("playable-status");

  const N = 4;
  // pieces: 'P','N','B','R' for you ('B' colour blue); lowercase for AI.
  let board, pool, turn, winner, sel, bringSel, __solveCount;
  function newGame(){
    board = Array.from({ length: N }, () => new Array(N).fill('.'));
    pool = { you: ['P','N','B','R'], ai: ['p','n','b','r'] };
    turn = "you"; winner = null; sel = null; bringSel = null; __solveCount = 0;
  }
  newGame();

  const isYou = (p) => p !== '.' && p === p.toUpperCase();
  const isAI = (p) => p !== '.' && p === p.toLowerCase();

  function genMovesFor(b, r, c){
    const p = b[r][c]; if (p === '.') return [];
    const side = isYou(p) ? 'y' : 'a';
    const out = [];
    const dirsR = [[-1,0],[1,0],[0,-1],[0,1]];
    const dirsB = [[-1,-1],[-1,1],[1,-1],[1,1]];
    const knight = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
    const lower = p.toLowerCase();
    function add(nr, nc){
      if (nr < 0 || nr >= N || nc < 0 || nc >= N) return false;
      const t = b[nr][nc];
      if (t === '.'){ out.push({ to: [nr, nc] }); return true; }
      if (side === 'y' ? isAI(t) : isYou(t)){ out.push({ to: [nr, nc] }); }
      return false;
    }
    function slide(dirs){
      for (const [dr, dc] of dirs){
        let nr = r + dr, nc = c + dc;
        while (add(nr, nc)){ nr += dr; nc += dc; }
      }
    }
    if (lower === 'p'){
      const dir = side === 'y' ? -1 : 1;
      const fr = r + dir;
      if (fr >= 0 && fr < N && b[fr][c] === '.') out.push({ to: [fr, c] });
      for (const dc of [-1, 1]){
        const nc = c + dc;
        if (fr < 0 || fr >= N || nc < 0 || nc >= N) continue;
        const t = b[fr][nc];
        if (t === '.') continue;
        if (side === 'y' ? isAI(t) : isYou(t)) out.push({ to: [fr, nc] });
      }
    } else if (lower === 'n'){
      for (const [dr, dc] of knight) add(r + dr, c + dc);
    } else if (lower === 'b'){
      slide(dirsB);
    } else if (lower === 'r'){
      slide(dirsR);
    }
    return out;
  }

  function checkWin(b, side){
    // 4 in a row of your colour (any piece type)
    const isYours = side === 'y' ? isYou : isAI;
    for (let r = 0; r < N; r++){
      if ([0,1,2,3].every(c => isYours(b[r][c]))) return true;
    }
    for (let c = 0; c < N; c++){
      if ([0,1,2,3].every(r => isYours(b[r][c]))) return true;
    }
    if ([0,1,2,3].every(i => isYours(b[i][i]))) return true;
    if ([0,1,2,3].every(i => isYours(b[i][N-1-i]))) return true;
    return false;
  }

  function aiAct(){
    if (winner) return;
    // bring first if pool non-empty AND opportunity
    // try every move (move existing or bring new) and pick the first that wins; else block; else random
    const tryMoves = [];
    // move existing pieces
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      if (isAI(board[r][c])){
        for (const m of genMovesFor(board, r, c)) tryMoves.push({ type: 'move', from: [r, c], to: m.to });
      }
    }
    // bring new pieces
    for (const p of pool.ai){
      for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
        if (board[r][c] === '.') tryMoves.push({ type: 'bring', piece: p, to: [r, c] });
      }
    }
    if (!tryMoves.length){ winner = "you"; draw(); return; }
    // win first
    for (const mv of tryMoves){
      const snap = board.map(rr => rr.slice()); const poolSnap = { you: [...pool.you], ai: [...pool.ai] };
      applyAIMove(mv);
      const w = checkWin(board, 'a');
      board = snap; pool = poolSnap;
      if (w){ applyAIMove(mv); winner = "ai"; draw(); return; }
    }
    // block
    for (const mv of tryMoves){
      const snap = board.map(rr => rr.slice()); const poolSnap = { you: [...pool.you], ai: [...pool.ai] };
      applyAIMove(mv);
      // does any you-move win next?
      let youCanWin = false;
      for (let r = 0; r < N && !youCanWin; r++) for (let c = 0; c < N && !youCanWin; c++){
        if (isYou(board[r][c])){
          for (const m of genMovesFor(board, r, c)){
            const snap2 = board.map(rr => rr.slice());
            const p = board[r][c]; const t = board[m.to[0]][m.to[1]];
            board[m.to[0]][m.to[1]] = p; board[r][c] = '.';
            if (checkWin(board, 'y')) youCanWin = true;
            board = snap2;
            if (youCanWin) break;
          }
        }
      }
      board = snap; pool = poolSnap;
      if (!youCanWin){
        applyAIMove(mv);
        if (checkWin(board, 'a')){ winner = "ai"; draw(); return; }
        turn = "you"; draw(); return;
      }
    }
    // random
    const mv = tryMoves[Math.floor(Math.random() * tryMoves.length)];
    applyAIMove(mv);
    if (checkWin(board, 'a')){ winner = "ai"; draw(); return; }
    turn = "you"; draw();
  }
  function applyAIMove(mv){
    if (mv.type === 'bring'){
      const i = pool.ai.indexOf(mv.piece);
      if (i >= 0) pool.ai.splice(i, 1);
      board[mv.to[0]][mv.to[1]] = mv.piece;
    } else {
      const [fr, fc] = mv.from, [tr, tc] = mv.to;
      const captured = board[tr][tc];
      if (captured !== '.' && isYou(captured)) pool.you.push(captured);
      board[tr][tc] = board[fr][fc]; board[fr][fc] = '.';
    }
  }

  function cellRect(r, c){
    const margin = 30, cs = (size - 2*margin) / N;
    return { x: margin + c*cs, y: 30 + r*cs, w: cs, h: cs };
  }
  const GLYPH = { P:'♙', N:'♘', B:'♗', R:'♖', p:'♟', n:'♞', b:'♝', r:'♜' };

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "12px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";
    _fit(ctx, "Tic-Tac-Chec — bring or move chess pieces; line up 4 of your colour", W/2, 18, W - 8);
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const rc = cellRect(r, c);
      ctx.fillStyle = (r + c) % 2 === 0 ? "#f6e3b4" : "#b58863";
      ctx.fillRect(rc.x, rc.y, rc.w, rc.h);
      if (sel && sel.r === r && sel.c === c){ ctx.fillStyle = "rgba(120,220,120,0.5)"; ctx.fillRect(rc.x, rc.y, rc.w, rc.h); }
      const p = board[r][c]; if (p === '.') continue;
      ctx.font = `${Math.floor(rc.w * 0.7)}px sans-serif`;
      ctx.fillStyle = isYou(p) ? "#39c" : "#e60";
      ctx.fillText(GLYPH[p], rc.x + rc.w/2, rc.y + rc.h * 0.72);
    }
    // pool display
    ctx.font = "20px sans-serif"; ctx.textAlign = "left"; ctx.fillStyle = "#39c";
    let x = 20;
    for (const p of pool.you){
      ctx.fillText(GLYPH[p], x, H - 35);
      if (bringSel === p) { ctx.strokeStyle = "#39c"; ctx.strokeRect(x - 2, H - 55, 24, 24); }
      x += 26;
    }
    ctx.fillStyle = "#e60"; x = 20;
    for (const p of pool.ai){ ctx.fillText(GLYPH[p], x, H - 8); x += 26; }
    ctx.font = "10px sans-serif"; ctx.fillStyle = "#444"; ctx.textAlign = "left";
    ctx.fillText("your pool (click to bring)", 20, H - 56);
    ctx.fillText("AI pool", 20, H - 22);

    if (winner) statusEl.textContent = winner === "you" ? "you win!" : "AI wins";
    else statusEl.textContent = turn === "you" ? (bringSel ? `place ${bringSel} on empty cell` : sel ? "click target square" : "click your piece on board, or click a pool piece below") : "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }

  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e);
    // pool click
    if (y >= H - 60 && y <= H - 25){
      const idx = Math.floor((x - 20) / 26);
      if (idx >= 0 && idx < pool.you.length){ bringSel = pool.you[idx]; sel = null; draw(); return; }
    }
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const rc = cellRect(r, c);
      if (x < rc.x || x > rc.x + rc.w || y < rc.y || y > rc.y + rc.h) continue;
      if (bringSel){
        if (board[r][c] !== '.') return;
        const i = pool.you.indexOf(bringSel); if (i >= 0) pool.you.splice(i, 1);
        board[r][c] = bringSel; bringSel = null;
        if (checkWin(board, 'y')){ winner = "you"; draw(); return; }
        turn = "ai"; draw(); setTimeout(aiAct, 400); return;
      }
      if (sel){
        if (sel.r === r && sel.c === c){ sel = null; draw(); return; }
        if (isYou(board[r][c])){ sel = { r, c }; draw(); return; }
        const moves = genMovesFor(board, sel.r, sel.c);
        const mv = moves.find(m => m.to[0] === r && m.to[1] === c);
        if (!mv){ sel = null; draw(); return; }
        const captured = board[r][c];
        if (captured !== '.' && isAI(captured)) pool.ai.push(captured);
        board[r][c] = board[sel.r][sel.c]; board[sel.r][sel.c] = '.'; sel = null;
        if (checkWin(board, 'y')){ winner = "you"; draw(); return; }
        turn = "ai"; draw(); setTimeout(aiAct, 400); return;
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
      if (winner) return;
      __solveCount++;
      if (__solveCount > 60) {
        winner = "draw";
        statusEl.textContent = "draw — game length capped";
        return;
      }
      if (turn !== "you") return;
      const __mvs = [];
      for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
        if (isYou(board[r][c])){
          for (const m of genMovesFor(board, r, c)) __mvs.push({ type: 'move', from: [r, c], to: m.to });
        }
      }
      for (const p of pool.you){
        for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
          if (board[r][c] === '.') __mvs.push({ type: 'bring', piece: p, to: [r, c] });
        }
      }
      if (!__mvs.length){ winner = "ai"; draw(); return; }
      const __mv = __mvs[Math.floor(Math.random() * __mvs.length)];
      if (__mv.type === 'bring'){
        const i = pool.you.indexOf(__mv.piece); if (i >= 0) pool.you.splice(i, 1);
        board[__mv.to[0]][__mv.to[1]] = __mv.piece;
      } else {
        const [fr, fc] = __mv.from, [tr, tc] = __mv.to;
        const captured = board[tr][tc];
        if (captured !== '.' && isAI(captured)) pool.ai.push(captured);
        board[tr][tc] = board[fr][fc]; board[fr][fc] = '.';
      }
      if (checkWin(board, 'y')){ winner = "you"; draw(); return; }
      bringSel = null; sel = null;
      turn = "ai"; draw();
      // Run AI synchronously so next solve() click finds turn==="you"
      aiAct();
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
