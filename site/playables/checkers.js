// Checkers (American / English draughts) — 8×8 dark-squares-only. Men move
// diagonally forward; kings move diagonally either way. Mandatory captures
// (jumps). Multi-jumps allowed but for simplicity we let the player choose to
// continue or stop. King by reaching last row. AI: simple — captures first.

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 400);
  canvas.width = size;
  canvas.height = size + 30;
  const W = canvas.width, H = canvas.height;
  const statusEl = document.getElementById("playable-status");

  const N = 8;
  let board, turn, winner, sel, mustChain;
  function newGame(){
    board = Array.from({ length: N }, () => new Array(N).fill('.'));
    for (let r = 0; r < 3; r++) for (let c = 0; c < N; c++) if ((r + c) % 2 === 1) board[r][c] = 'w';
    for (let r = N-3; r < N; r++) for (let c = 0; c < N; c++) if ((r + c) % 2 === 1) board[r][c] = 'b';
    turn = "you"; winner = null; sel = null; mustChain = null;
  }
  newGame();

  const isYou = (p) => p === 'b' || p === 'B';
  const isAI = (p) => p === 'w' || p === 'W';

  function dirsFor(p){
    if (p === 'B' || p === 'W') return [[-1,-1],[-1,1],[1,-1],[1,1]];
    if (p === 'b') return [[-1,-1],[-1,1]];
    return [[1,-1],[1,1]];
  }
  function captures(b, r, c){
    const p = b[r][c]; const out = [];
    const enemy = isYou(p) ? isAI : isYou;
    for (const [dr, dc] of dirsFor(p)){
      const er = r + dr, ec = c + dc;
      const lr = r + 2*dr, lc = c + 2*dc;
      if (lr < 0 || lr >= N || lc < 0 || lc >= N) continue;
      if (enemy(b[er][ec]) && b[lr][lc] === '.') out.push({ to: [lr, lc], over: [er, ec] });
    }
    return out;
  }
  function quietMoves(b, r, c){
    const p = b[r][c]; const out = [];
    for (const [dr, dc] of dirsFor(p)){
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nr >= N || nc < 0 || nc >= N) continue;
      if (b[nr][nc] === '.') out.push({ to: [nr, nc] });
    }
    return out;
  }
  function anyCaptures(b, side){
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const p = b[r][c];
      if (side === "you" ? isYou(p) : isAI(p)){
        if (captures(b, r, c).length) return true;
      }
    }
    return false;
  }

  function aiMove(){
    if (winner) return;
    // captures mandatory
    const captureList = [];
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      if (isAI(board[r][c])){
        for (const cp of captures(board, r, c)) captureList.push({ from: [r, c], cap: cp });
      }
    }
    function maybePromote(r, c){
      if (r === N-1 && board[r][c] === 'w') board[r][c] = 'W';
    }
    if (captureList.length){
      let mv = captureList[0];
      while (mv){
        const [fr, fc] = mv.from;
        board[mv.cap.to[0]][mv.cap.to[1]] = board[fr][fc];
        board[fr][fc] = '.'; board[mv.cap.over[0]][mv.cap.over[1]] = '.';
        maybePromote(mv.cap.to[0], mv.cap.to[1]);
        const chains = captures(board, mv.cap.to[0], mv.cap.to[1]);
        if (chains.length){ mv = { from: mv.cap.to, cap: chains[0] }; } else { mv = null; }
      }
      if (countSide('you') === 0){ winner = "ai"; draw(); return; }
      turn = "you"; draw(); return;
    }
    // quiet random
    const opts = [];
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      if (isAI(board[r][c])) for (const q of quietMoves(board, r, c)) opts.push({ from: [r, c], to: q.to });
    }
    if (!opts.length){ winner = "you"; draw(); return; }
    const m = opts[Math.floor(Math.random() * opts.length)];
    board[m.to[0]][m.to[1]] = board[m.from[0]][m.from[1]]; board[m.from[0]][m.from[1]] = '.';
    if (m.to[0] === N-1 && board[m.to[0]][m.to[1]] === 'w') board[m.to[0]][m.to[1]] = 'W';
    turn = "you"; draw();
  }

  function countSide(side){
    let n = 0;
    for (const row of board) for (const v of row){
      if (side === "you" && isYou(v)) n++;
      else if (side === "ai" && isAI(v)) n++;
    }
    return n;
  }

  function cellRect(r, c){
    const margin = 16, cs = (size - 2*margin) / N;
    return { x: margin + c*cs, y: 30 + r*cs, w: cs, h: cs };
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "12px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const rc = cellRect(r, c);
      ctx.fillStyle = (r + c) % 2 === 0 ? "#f6e3b4" : "#b58863";
      ctx.fillRect(rc.x, rc.y, rc.w, rc.h);
      if (sel && sel.r === r && sel.c === c){ ctx.fillStyle = "rgba(120,220,120,0.5)"; ctx.fillRect(rc.x, rc.y, rc.w, rc.h); }
      const p = board[r][c]; if (p === '.') continue;
      ctx.beginPath(); ctx.arc(rc.x + rc.w/2, rc.y + rc.h/2, rc.w * 0.36, 0, Math.PI*2);
      ctx.fillStyle = isYou(p) ? "#39c" : "#e60";
      ctx.fill(); ctx.strokeStyle = "#222"; ctx.stroke();
      if (p === 'B' || p === 'W'){ ctx.fillStyle = "#ff0"; ctx.font = "bold 14px sans-serif"; ctx.fillText("♚", rc.x + rc.w/2, rc.y + rc.h/2 + 5); }
    }
    if (winner) statusEl.textContent = winner === "you" ? "you win!" : "AI wins";
    else statusEl.textContent = turn === "you" ? (sel ? "click destination (captures mandatory)" : "click your piece") : "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }

  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e);
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const rc = cellRect(r, c);
      if (x < rc.x || x > rc.x + rc.w || y < rc.y || y > rc.y + rc.h) continue;
      const captureAvail = anyCaptures(board, "you");
      if (mustChain){
        if (mustChain.r === sel.r && mustChain.c === sel.c){
          const caps = captures(board, sel.r, sel.c);
          const cap = caps.find(cp => cp.to[0] === r && cp.to[1] === c);
          if (cap){
            board[cap.to[0]][cap.to[1]] = board[sel.r][sel.c]; board[sel.r][sel.c] = '.'; board[cap.over[0]][cap.over[1]] = '.';
            if (cap.to[0] === 0 && board[cap.to[0]][cap.to[1]] === 'b') board[cap.to[0]][cap.to[1]] = 'B';
            sel = { r: cap.to[0], c: cap.to[1] };
            const more = captures(board, sel.r, sel.c);
            if (more.length){ mustChain = sel; draw(); return; }
            mustChain = null; sel = null;
            if (countSide("ai") === 0){ winner = "you"; draw(); return; }
            turn = "ai"; draw(); setTimeout(aiMove, 350); return;
          }
        }
        return;
      }
      if (sel){
        if (sel.r === r && sel.c === c){ sel = null; draw(); return; }
        if (isYou(board[r][c])){ if (!captureAvail || captures(board, r, c).length) sel = { r, c }; draw(); return; }
        const caps = captures(board, sel.r, sel.c);
        const cap = caps.find(cp => cp.to[0] === r && cp.to[1] === c);
        if (cap){
          board[r][c] = board[sel.r][sel.c]; board[sel.r][sel.c] = '.'; board[cap.over[0]][cap.over[1]] = '.';
          if (r === 0 && board[r][c] === 'b') board[r][c] = 'B';
          sel = { r, c };
          const more = captures(board, r, c);
          if (more.length){ mustChain = sel; draw(); return; }
          sel = null;
          if (countSide("ai") === 0){ winner = "you"; draw(); return; }
          turn = "ai"; draw(); setTimeout(aiMove, 350); return;
        }
        if (captureAvail){ sel = null; draw(); return; }
        const qs = quietMoves(board, sel.r, sel.c);
        const q = qs.find(m => m.to[0] === r && m.to[1] === c);
        if (q){
          board[r][c] = board[sel.r][sel.c]; board[sel.r][sel.c] = '.';
          if (r === 0 && board[r][c] === 'b') board[r][c] = 'B';
          sel = null; turn = "ai"; draw(); setTimeout(aiMove, 350); return;
        }
        sel = null; draw(); return;
      } else {
        if (isYou(board[r][c])){
          if (captureAvail && !captures(board, r, c).length) return;
          sel = { r, c }; draw();
        }
        return;
      }
    }
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve() {
      if (winner || turn !== "you") return;
      mustChain = null; sel = null;
      // build list of all player moves (captures mandatory)
      const __capList = [];
      for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
        if (isYou(board[r][c])) {
          for (const cp of captures(board, r, c)) __capList.push({ from: [r,c], cap: cp });
        }
      }
      if (__capList.length) {
        let __mv = __capList[Math.floor(Math.random() * __capList.length)];
        while (__mv) {
          const [fr, fc] = __mv.from;
          board[__mv.cap.to[0]][__mv.cap.to[1]] = board[fr][fc];
          board[fr][fc] = '.'; board[__mv.cap.over[0]][__mv.cap.over[1]] = '.';
          if (__mv.cap.to[0] === 0 && board[__mv.cap.to[0]][__mv.cap.to[1]] === 'b') board[__mv.cap.to[0]][__mv.cap.to[1]] = 'B';
          const __chains = captures(board, __mv.cap.to[0], __mv.cap.to[1]);
          __mv = __chains.length ? { from: __mv.cap.to, cap: __chains[0] } : null;
        }
        if (countSide("ai") === 0) { winner = "you"; draw(); return; }
        turn = "ai"; draw(); setTimeout(aiMove, 80); return;
      }
      const __opts = [];
      for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
        if (isYou(board[r][c])) for (const q of quietMoves(board, r, c)) __opts.push({ from: [r,c], to: q.to });
      }
      if (!__opts.length) { winner = "ai"; draw(); return; }
      const __m = __opts[Math.floor(Math.random() * __opts.length)];
      board[__m.to[0]][__m.to[1]] = board[__m.from[0]][__m.from[1]]; board[__m.from[0]][__m.from[1]] = '.';
      if (__m.to[0] === 0 && board[__m.to[0]][__m.to[1]] === 'b') board[__m.to[0]][__m.to[1]] = 'B';
      turn = "ai"; draw();
      setTimeout(aiMove, 80);
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
