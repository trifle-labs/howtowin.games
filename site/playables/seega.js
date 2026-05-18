// Seega — 5×5 grid. Placement phase: each player drops 2 stones per turn into
// empty non-centre cells until 24 stones placed (centre stays empty). Movement
// phase: orthogonal one-step moves; sandwiching an opponent's stone between two
// of yours captures it. Eliminate all enemy stones to win. AI: greedy capture.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = size + 30;
  const W = canvas.width, H = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) { canvas.style.width = W + 'px'; canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr); }
  const statusEl = document.getElementById("playable-status");

  const N = 5;
  let board, phase, placed, turn, winner, sel, dropsLeft;
  let solveClicks = 0;
  function newGame(){
    board = Array.from({ length: N }, () => new Array(N).fill('.'));
    phase = "place"; placed = { you: 0, ai: 0 }; turn = "you"; winner = null; sel = null;
    dropsLeft = 2; solveClicks = 0;
  }
  newGame();

  function checkCapAt(b, r, c, side){
    const enemy = side === "you" ? 'W' : 'B';
    const my = side === "you" ? 'B' : 'W';
    const removed = [];
    for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]){
      const nr = r + dr, nc = c + dc;
      const fr = r + 2*dr, fc = c + 2*dc;
      if (nr < 0 || nr >= N || nc < 0 || nc >= N) continue;
      if (fr < 0 || fr >= N || fc < 0 || fc >= N) continue;
      if (b[nr][nc] === enemy && b[fr][fc] === my && !(fr === 2 && fc === 2)){
        // also: centre is safe; never capture from centre placement
        removed.push([nr, nc]);
      }
    }
    return removed;
  }
  function countSide(b, ch){ let n = 0; for (const row of b) for (const v of row) if (v === ch) n++; return n; }

  function legalMoves(b, side){
    const my = side === "you" ? 'B' : 'W';
    const out = [];
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      if (b[r][c] !== my) continue;
      for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]){
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nr >= N || nc < 0 || nc >= N) continue;
        if (b[nr][nc] === '.') out.push({ from: [r, c], to: [nr, nc] });
      }
    }
    return out;
  }

  function aiTurn(){
    if (winner) return;
    if (phase === "place"){
      for (let k = 0; k < 2; k++){
        let chosen = null;
        for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
          if (board[r][c] === '.' && !(r === 2 && c === 2)){ chosen = [r, c]; }
        }
        // prefer corner-adjacent for capture potential
        for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
          if (board[r][c] !== '.' || (r === 2 && c === 2)) continue;
          // pick if adjacent to two B with one W between? Heuristic
        }
        if (!chosen) break;
        const [r, c] = chosen; board[r][c] = 'W'; placed.ai++;
      }
      if (placed.you >= 12 && placed.ai >= 12){ phase = "move"; }
      turn = "you"; dropsLeft = 2; draw();
      return;
    }
    const moves = legalMoves(board, "ai");
    if (!moves.length){ winner = "you"; draw(); return; }
    let best = moves[0], bestCap = -1;
    for (const mv of moves){
      const [fr, fc] = mv.from, [tr, tc] = mv.to;
      board[fr][fc] = '.'; board[tr][tc] = 'W';
      const caps = checkCapAt(board, tr, tc, "ai").length;
      board[fr][fc] = 'W'; board[tr][tc] = '.';
      if (caps > bestCap){ bestCap = caps; best = mv; }
    }
    const [fr, fc] = best.from, [tr, tc] = best.to;
    board[fr][fc] = '.'; board[tr][tc] = 'W';
    for (const [r, c] of checkCapAt(board, tr, tc, "ai")) board[r][c] = '.';
    if (countSide(board, 'B') === 0){ winner = "ai"; draw(); return; }
    if (!legalMoves(board, "you").length){ winner = "ai"; draw(); return; }
    turn = "you"; draw();
  }

  function cellRect(r, c){
    const margin = 20, cs = (size - 2*margin) / N;
    return { x: margin + c*cs, y: 30 + r*cs, w: cs, h: cs };
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "13px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";
    ctx.fillText(`Seega — ${phase === "place" ? `placement (you ${placed.you}/12, ai ${placed.ai}/12)` : "movement: sandwich to capture"}`, W/2, 18);

    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const rc = cellRect(r, c);
      ctx.fillStyle = (r === 2 && c === 2) ? "#ffe9c8" : "#fff";
      ctx.fillRect(rc.x, rc.y, rc.w, rc.h);
      ctx.strokeStyle = "#888"; ctx.strokeRect(rc.x, rc.y, rc.w, rc.h);
      const v = board[r][c]; if (v === '.') continue;
      ctx.beginPath(); ctx.arc(rc.x + rc.w/2, rc.y + rc.h/2, rc.w * 0.35, 0, Math.PI*2);
      ctx.fillStyle = v === 'B' ? "#39c" : "#e60";
      if (sel && sel.r === r && sel.c === c) ctx.fillStyle = "#cef2cf";
      ctx.fill(); ctx.strokeStyle = "#222"; ctx.stroke();
    }
    if (winner) statusEl.textContent = winner === "you" ? "you win!" : "AI wins";
    else if (turn === "you"){
      if (phase === "place") statusEl.textContent = `place a stone (${dropsLeft} left this turn); centre is forbidden`;
      else statusEl.textContent = sel ? "click an adjacent empty cell" : "click your blue piece";
    } else statusEl.textContent = "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }

  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e);
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const rc = cellRect(r, c);
      if (x < rc.x || x > rc.x + rc.w || y < rc.y || y > rc.y + rc.h) continue;
      if (phase === "place"){
        if (board[r][c] !== '.' || (r === 2 && c === 2)) return;
        board[r][c] = 'B'; placed.you++; dropsLeft--;
        if (dropsLeft <= 0){
          if (placed.you >= 12 && placed.ai >= 12){ phase = "move"; }
          turn = "ai"; draw(); setTimeout(aiTurn, 400); return;
        }
        draw(); return;
      }
      if (sel){
        if (sel.r === r && sel.c === c){ sel = null; draw(); return; }
        if (board[r][c] === 'B'){ sel = { r, c }; draw(); return; }
        const dr = r - sel.r, dc = c - sel.c;
        if (Math.abs(dr) + Math.abs(dc) !== 1 || board[r][c] !== '.'){ sel = null; draw(); return; }
        board[sel.r][sel.c] = '.'; board[r][c] = 'B';
        for (const [rr, cc] of checkCapAt(board, r, c, "you")) board[rr][cc] = '.';
        sel = null;
        if (countSide(board, 'W') === 0){ winner = "you"; draw(); return; }
        if (!legalMoves(board, "ai").length){ winner = "you"; draw(); return; }
        turn = "ai"; draw(); setTimeout(aiTurn, 400); return;
      } else {
        if (board[r][c] === 'B'){ sel = { r, c }; draw(); }
        return;
      }
    }
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve(){
      if (winner) return;
      solveClicks++;
      if (solveClicks >= 50){ winner = "draw"; statusEl.textContent = "draw — too many moves"; draw(); return; }
      if (turn !== "you") return;
      if (phase === "place"){
        const __cells = [];
        for (let r = 0; r < N; r++) for (let c = 0; c < N; c++)
          if (board[r][c] === '.' && !(r === 2 && c === 2)) __cells.push([r, c]);
        if (!__cells.length) return;
        const [__r, __c] = __cells[Math.floor(Math.random() * __cells.length)];
        board[__r][__c] = 'B'; placed.you++; dropsLeft--;
        if (dropsLeft <= 0){
          if (placed.you >= 12 && placed.ai >= 12) phase = "move";
          turn = "ai"; draw(); setTimeout(aiTurn, 80);
        } else { draw(); }
        return;
      }
      const __mvs = legalMoves(board, "you");
      if (!__mvs.length) { winner = "ai"; draw(); return; }
      const __mv = __mvs[Math.floor(Math.random() * __mvs.length)];
      const [__fr, __fc] = __mv.from, [__tr, __tc] = __mv.to;
      board[__fr][__fc] = '.'; board[__tr][__tc] = 'B';
      for (const [rr, cc] of checkCapAt(board, __tr, __tc, "you")) board[rr][cc] = '.';
      sel = null;
      if (countSide(board, 'W') === 0){ winner = "you"; draw(); return; }
      if (!legalMoves(board, "ai").length){ winner = "you"; draw(); return; }
      turn = "ai"; draw();
      setTimeout(aiTurn, 80);
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
