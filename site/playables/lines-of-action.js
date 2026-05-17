// Lines of Action — 8×8. Black starts on top/bottom edges (6 each minus corners),
// White on left/right. Each turn move a piece in a straight line exactly as
// many squares as there are pieces (any colour) on that line. May jump own,
// not enemy. May capture by landing on enemy. Win by connecting all your
// pieces into a single group (king or queen adjacency).
// AI: heuristic — minimise components + centralisation.

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = size + 30;
  const W = canvas.width, H = canvas.height;
  const statusEl = document.getElementById("playable-status");

  const N = 8;
  let board, turn, winner, sel;
  function newGame(){
    board = Array.from({ length: N }, () => new Array(N).fill('.'));
    for (let c = 1; c < N - 1; c++){ board[0][c] = 'B'; board[N-1][c] = 'B'; }
    for (let r = 1; r < N - 1; r++){ board[r][0] = 'W'; board[r][N-1] = 'W'; }
    turn = "you"; winner = null; sel = null;
  }
  newGame();

  function countOnLine(b, r, c, dr, dc){
    let n = 0;
    // step both directions
    for (let k = -N; k <= N; k++){
      const nr = r + dr*k, nc = c + dc*k;
      if (nr < 0 || nr >= N || nc < 0 || nc >= N) continue;
      if (b[nr][nc] !== '.') n++;
    }
    return n;
  }

  function legalMoves(b, side){
    const my = side === "you" ? 'B' : 'W';
    const enemy = side === "you" ? 'W' : 'B';
    const out = [];
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      if (b[r][c] !== my) continue;
      for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]]){
        const n = countOnLine(b, r, c, dr, dc);
        // line distance: count pieces on the unique line through r,c with dir (dr,dc)
        // but countOnLine above also counts via reverse dir. Use line:
        let count = 1; // self
        for (let k = 1; k < N; k++){
          const nr = r + dr*k, nc = c + dc*k;
          if (nr < 0 || nr >= N || nc < 0 || nc >= N) break;
          if (b[nr][nc] !== '.') count++;
        }
        for (let k = 1; k < N; k++){
          const nr = r - dr*k, nc = c - dc*k;
          if (nr < 0 || nr >= N || nc < 0 || nc >= N) break;
          if (b[nr][nc] !== '.') count++;
        }
        // walk count steps in (dr, dc)
        let blocked = false;
        for (let k = 1; k < count; k++){
          const nr = r + dr*k, nc = c + dc*k;
          if (nr < 0 || nr >= N || nc < 0 || nc >= N) { blocked = true; break; }
          if (b[nr][nc] === enemy) { blocked = true; break; }
        }
        if (blocked) continue;
        const tr = r + dr*count, tc = c + dc*count;
        if (tr < 0 || tr >= N || tc < 0 || tc >= N) continue;
        if (b[tr][tc] === my) continue;
        out.push({ from: [r, c], to: [tr, tc] });
      }
    }
    return out;
  }
  function apply(b, mv){
    const nb = b.map(row => row.slice());
    const [fr, fc] = mv.from, [tr, tc] = mv.to;
    nb[tr][tc] = nb[fr][fc]; nb[fr][fc] = '.';
    return nb;
  }
  function components(b, side){
    const ch = side === "you" ? 'B' : 'W';
    const seen = Array.from({ length: N }, () => new Array(N).fill(false));
    let comp = 0;
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      if (b[r][c] !== ch || seen[r][c]) continue;
      comp++;
      const stack = [[r, c]];
      while (stack.length){
        const [x, y] = stack.pop(); if (seen[x][y]) continue; seen[x][y] = true;
        for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++){
          if (!dr && !dc) continue;
          const nx = x + dr, ny = y + dc;
          if (nx < 0 || nx >= N || ny < 0 || ny >= N) continue;
          if (b[nx][ny] === ch && !seen[nx][ny]) stack.push([nx, ny]);
        }
      }
    }
    return comp;
  }

  function aiMove(){
    if (winner) return;
    const moves = legalMoves(board, "ai");
    if (!moves.length){ winner = "you"; draw(); return; }
    let best = moves[0], bestScore = -Infinity;
    for (const mv of moves){
      const nb = apply(board, mv);
      const aiComp = components(nb, "ai");
      const youComp = components(nb, "you");
      const score = (youComp - aiComp) * 10 - (Math.abs(mv.to[0] - 3.5) + Math.abs(mv.to[1] - 3.5));
      if (aiComp === 1){ best = mv; break; }
      if (score > bestScore){ bestScore = score; best = mv; }
    }
    board = apply(board, best);
    if (components(board, "ai") === 1){ winner = "ai"; draw(); return; }
    if (components(board, "you") === 1){ winner = "you"; draw(); return; }
    turn = "you"; draw();
  }

  function cellRect(r, c){
    const margin = 8, cs = (size - 2*margin) / N;
    return { x: margin + c*cs, y: 30 + r*cs, w: cs, h: cs };
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "13px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";

    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const rc = cellRect(r, c);
      ctx.fillStyle = (r + c) % 2 === 0 ? "#fff" : "#eee";
      ctx.fillRect(rc.x, rc.y, rc.w, rc.h);
      ctx.strokeStyle = "#888"; ctx.strokeRect(rc.x, rc.y, rc.w, rc.h);
      const v = board[r][c]; if (v === '.') continue;
      ctx.beginPath(); ctx.arc(rc.x + rc.w/2, rc.y + rc.h/2, rc.w * 0.36, 0, Math.PI*2);
      ctx.fillStyle = v === 'B' ? "#39c" : "#e60";
      if (sel && sel.r === r && sel.c === c) ctx.fillStyle = "#cef2cf";
      ctx.fill(); ctx.strokeStyle = "#222"; ctx.stroke();
    }
    if (sel && turn === "you" && !winner){
      const targets = legalMoves(board, "you").filter(mv => mv.from[0] === sel.r && mv.from[1] === sel.c);
      for (const mv of targets){
        const rc = cellRect(mv.to[0], mv.to[1]);
        ctx.strokeStyle = "#0a0"; ctx.lineWidth = 3; ctx.strokeRect(rc.x + 2, rc.y + 2, rc.w - 4, rc.h - 4); ctx.lineWidth = 1;
      }
    }

    if (winner) statusEl.textContent = winner === "you" ? "you win!" : "AI wins";
    else statusEl.textContent = turn === "you" ? (sel ? "click a green-outlined target" : "click your blue piece") : "AI thinking…";
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
        if (board[r][c] === 'B'){ sel = { r, c }; draw(); return; }
        const mv = legalMoves(board, "you").find(m => m.from[0] === sel.r && m.from[1] === sel.c && m.to[0] === r && m.to[1] === c);
        if (!mv){ sel = null; draw(); return; }
        board = apply(board, mv); sel = null;
        if (components(board, "you") === 1){ winner = "you"; draw(); return; }
        if (components(board, "ai") === 1){ winner = "ai"; draw(); return; }
        turn = "ai"; draw(); setTimeout(aiMove, 400);
        return;
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
      if (winner || turn !== "you") return;
      const __mvs = legalMoves(board, "you");
      if (!__mvs.length) { winner = "ai"; draw(); return; }
      const __mv = __mvs[Math.floor(Math.random() * __mvs.length)];
      board = apply(board, __mv); sel = null;
      if (components(board, "you") === 1) { winner = "you"; draw(); return; }
      if (components(board, "ai") === 1) { winner = "ai"; draw(); return; }
      turn = "ai"; draw();
      setTimeout(aiMove, 80);
    },

    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
