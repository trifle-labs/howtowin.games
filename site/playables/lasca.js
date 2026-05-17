// Lasca — Emanuel Lasker's draughts variant on a 7×7 board (25 playing squares).
// Defining rule: captured pieces are NOT removed — they go *under* the jumper,
// forming a tower; only the top piece determines colour and movement. Win by
// stalemating the opponent. AI: heuristic — prefer captures, then advance.

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = size + 30;
  const W = canvas.width, H = canvas.height;
  const statusEl = document.getElementById("playable-status");

  const N = 7;
  // playing squares: those with (r+c) even (light squares used). Each square
  // holds a tower: array of { side: 'B'|'W', officer: bool }, top = last.
  let board, turn, winner, sel;
  function newGame(){
    board = Array.from({ length: N }, () => new Array(N).fill(null));
    for (let r = 0; r < 3; r++) for (let c = 0; c < N; c++){
      if ((r + c) % 2 === 0) board[r][c] = [{ side: 'W', officer: false }];
    }
    for (let r = N - 3; r < N; r++) for (let c = 0; c < N; c++){
      if ((r + c) % 2 === 0) board[r][c] = [{ side: 'B', officer: false }];
    }
    turn = "you"; winner = null; sel = null;
  }
  newGame();

  function top(t){ return t && t.length ? t[t.length - 1] : null; }
  function ownerSide(t){ const x = top(t); return x ? (x.side === 'B' ? 'you' : 'ai') : null; }
  function isOfficer(t){ const x = top(t); return x?.officer; }

  function forwardDirs(side, officer){
    if (officer) return [[-1,-1],[-1,1],[1,-1],[1,1]];
    return side === 'B' ? [[-1,-1],[-1,1]] : [[1,-1],[1,1]];
  }

  function generateMovesFor(b, side){
    const my = side === "you" ? 'B' : 'W';
    const captures = [];
    const quiet = [];
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const t = b[r][c]; if (!t || top(t).side !== my) continue;
      const dirs = forwardDirs(my, top(t).officer);
      // captures: jump over enemy-topped square to empty square
      for (const [dr, dc] of dirs){
        const mr = r + dr, mc = c + dc;
        const nr = r + 2*dr, nc = c + 2*dc;
        if (nr < 0 || nr >= N || nc < 0 || nc >= N) continue;
        if ((nr + nc) % 2 !== 0) continue;
        const mt = b[mr]?.[mc]; if (!mt || !mt.length) continue;
        if (top(mt).side === my) continue;
        if (b[nr][nc] && b[nr][nc].length) continue;
        captures.push({ from: [r, c], to: [nr, nc], over: [mr, mc] });
      }
      for (const [dr, dc] of dirs){
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nr >= N || nc < 0 || nc >= N) continue;
        if ((nr + nc) % 2 !== 0) continue;
        if (b[nr][nc] && b[nr][nc].length) continue;
        quiet.push({ from: [r, c], to: [nr, nc] });
      }
    }
    return captures.length ? captures : quiet;
  }

  function applyMove(b, mv, side){
    const my = side === "you" ? 'B' : 'W';
    const [fr, fc] = mv.from, [tr, tc] = mv.to;
    const tower = b[fr][fc]; b[fr][fc] = null;
    if (mv.over){
      const [or, oc] = mv.over;
      const captured = b[or][oc];
      // top of captured goes under our tower
      const captTop = captured.pop();
      // place under our top piece
      const ourTop = tower.pop();
      tower.push(captTop); tower.push(ourTop);
      // remaining captured tower stays at its square
      if (captured.length === 0) b[or][oc] = null;
      else b[or][oc] = captured;
    }
    // crown: officer if reached far row
    const lastRow = my === 'B' ? 0 : N - 1;
    if (tr === lastRow) tower[tower.length - 1].officer = true;
    b[tr][tc] = tower;
  }

  function aiMove(){
    if (winner) return;
    const moves = generateMovesFor(board, "ai");
    if (!moves.length){ winner = "you"; draw(); return; }
    // pick first capture, else heuristic = advance (max row toward N-1)
    let best = moves[0];
    for (const mv of moves){ if (mv.over){ best = mv; break; } }
    if (!best.over){
      let bestScore = -Infinity;
      for (const mv of moves){
        const s = mv.to[0]; // ai advances by increasing row index
        if (s > bestScore){ bestScore = s; best = mv; }
      }
    }
    applyMove(board, best, "ai");
    if (!generateMovesFor(board, "you").length){ winner = "ai"; draw(); return; }
    turn = "you"; draw();
  }

  function cellRect(r, c){
    const margin = 6, cs = (size - 2*margin) / N;
    return { x: margin + c*cs, y: 30 + r*cs, w: cs, h: cs };
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "13px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";

    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const rc = cellRect(r, c);
      ctx.fillStyle = (r + c) % 2 === 0 ? "#f8eecf" : "#7a5333";
      ctx.fillRect(rc.x, rc.y, rc.w, rc.h);
      const t = board[r][c]; if (!t || !t.length) continue;
      const tt = top(t);
      ctx.beginPath(); ctx.arc(rc.x + rc.w/2, rc.y + rc.h/2, rc.w * 0.35, 0, Math.PI*2);
      ctx.fillStyle = tt.side === 'B' ? "#39c" : "#e60";
      if (sel && sel.r === r && sel.c === c) ctx.fillStyle = "#cef2cf";
      ctx.fill(); ctx.strokeStyle = "#222"; ctx.stroke();
      if (tt.officer){ ctx.fillStyle = "#fff"; ctx.font = "bold 14px sans-serif"; ctx.textBaseline = "middle"; ctx.fillText("O", rc.x + rc.w/2, rc.y + rc.h/2); ctx.textBaseline = "alphabetic"; }
      if (t.length > 1){
        ctx.fillStyle = "#222"; ctx.font = "11px sans-serif"; ctx.fillText(String(t.length), rc.x + rc.w - 6, rc.y + rc.h - 4);
      }
    }
    if (sel && turn === "you" && !winner){
      const targets = generateMovesFor(board, "you").filter(mv => mv.from[0] === sel.r && mv.from[1] === sel.c);
      for (const mv of targets){
        const rc = cellRect(mv.to[0], mv.to[1]);
        ctx.strokeStyle = "#0a0"; ctx.lineWidth = 3; ctx.strokeRect(rc.x + 2, rc.y + 2, rc.w - 4, rc.h - 4); ctx.lineWidth = 1;
      }
    }

    if (winner) statusEl.textContent = winner === "you" ? "you win!" : "AI wins";
    else statusEl.textContent = turn === "you" ? (sel ? "click a green-outlined cell" : "click your blue tower (captures are forced when available)") : "AI thinking…";
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
        const mv = generateMovesFor(board, "you").find(m => m.from[0] === sel.r && m.from[1] === sel.c && m.to[0] === r && m.to[1] === c);
        if (!mv){
          const t = board[r][c]; if (t && top(t).side === 'B'){ sel = { r, c }; draw(); }
          return;
        }
        applyMove(board, mv, "you"); sel = null;
        if (!generateMovesFor(board, "ai").length){ winner = "you"; draw(); return; }
        turn = "ai"; draw(); setTimeout(aiMove, 400);
        return;
      } else {
        const t = board[r][c]; if (t && top(t).side === 'B'){ sel = { r, c }; draw(); }
        return;
      }
    }
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve(){
      if (winner || turn !== "you") return;
      const moves = generateMovesFor(board, "you");
      if (!moves.length){ winner = "ai"; draw(); return; }
      const mv = moves[Math.floor(Math.random() * moves.length)];
      applyMove(board, mv, "you"); sel = null;
      if (!generateMovesFor(board, "ai").length){ winner = "you"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 80);
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
