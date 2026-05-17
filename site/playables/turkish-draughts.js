// Turkish draughts — 8×8 orthogonal movement. 16 men per side.
// Men move forward/sideways; capture forward/sideways.
// Kings move/capture like rooks (any distance orthogonal).
// AI: captures-first random.
export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 400);
  canvas.width = size; canvas.height = size + 30;
  const W = canvas.width, H = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) { canvas.style.width = W + 'px'; canvas.style.height = H + 'px'; canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr); }
  const statusEl = document.getElementById("playable-status");

  const N = 8;
  let board, turn, winner, sel, mustChain;
  function newGame(){
    board = Array.from({ length: N }, () => new Array(N).fill('.'));
    // AI (white) top: rows 0-1
    for (let r = 0; r < 2; r++) for (let c = 0; c < N; c++) board[r][c] = 'w';
    // You (black) bottom: rows 6-7
    for (let r = N-2; r < N; r++) for (let c = 0; c < N; c++) board[r][c] = 'b';
    turn = "you"; winner = null; sel = null; mustChain = null;
  }
  newGame();

  const isYou = (p) => p === 'b' || p === 'B';
  const isAI = (p) => p === 'w' || p === 'W';
  const isKing = (p) => p === 'B' || p === 'W';

  // Direction helpers
  const manDir = (p) => isYou(p) ? -1 : 1; // forward = upward for you, downward for AI

  function captures(b, r, c){
    const p = b[r][c]; if (p === '.') return [];
    const enemy = isYou(p) ? isAI : isYou;
    const out = [];
    const dirs = [[-1,0],[1,0],[0,-1],[0,1]]; // orthogonal only
    for (const [dr, dc] of dirs){
      if (!isKing(p) && dc !== 0) continue; // men only capture forward, not sideways -- wait, Turkish draughts men CAN capture sideways too
      // Actually men can capture forward and sideways, just not backward
      if (!isKing(p) && dr === 1 && isYou(p)) continue; // you (bottom) can't capture downward
      if (!isKing(p) && dr === -1 && isAI(p)) continue; // AI (top) can't capture upward

      let nr = r + dr, nc = c + dc;
      if (isKing(p)){
        while (nr >= 0 && nr < N && nc >= 0 && nc < N && b[nr][nc] === '.'){ nr += dr; nc += dc; }
        if (nr < 0 || nr >= N || nc < 0 || nc >= N) continue;
        if (!enemy(b[nr][nc])) continue;
        const er = nr, ec = nc;
        let lr = er + dr, lc = ec + dc;
        while (lr >= 0 && lr < N && lc >= 0 && lc < N && b[lr][lc] === '.'){
          out.push({ to:[lr, lc], over:[er, ec] }); lr += dr; lc += dc;
        }
      } else {
        // Men: one-square jumps
        const er = nr, ec = nc;
        if (er < 0 || er >= N || ec < 0 || ec >= N) continue;
        if (!enemy(b[er][ec])) continue;
        const lr = er + dr, lc = ec + dc;
        if (lr < 0 || lr >= N || lc < 0 || lc >= N) continue;
        if (b[lr][lc] !== '.') continue;
        out.push({ to:[lr, lc], over:[er, ec] });
      }
    }
    return out;
  }

  function quietMoves(b, r, c){
    const p = b[r][c]; if (p === '.') return [];
    const out = [];
    if (isKing(p)){
      for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]){
        let nr = r + dr, nc = c + dc;
        while (nr >= 0 && nr < N && nc >= 0 && nc < N && b[nr][nc] === '.'){ out.push({ to:[nr, nc] }); nr += dr; nc += dc; }
      }
    } else {
      // Men: forward (for you: -1, for AI: +1) and sideways
      const dir = manDir(p);
      const mv = [{dr: dir, dc: 0}, {dr: 0, dc: -1}, {dr: 0, dc: 1}];
      // Can't move backward
      for (const {dr, dc} of mv){
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nr >= N || nc < 0 || nc >= N) continue;
        if (b[nr][nc] === '.') out.push({ to:[nr, nc] });
      }
    }
    return out;
  }
  function anyCaptures(b, side){
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const p = b[r][c]; if (p === '.') continue;
      if (side === "you" ? isYou(p) : isAI(p)) if (captures(b, r, c).length) return true;
    }
    return false;
  }
  function countSide(side){
    let n = 0;
    for (const row of board) for (const v of row){
      if (side === "you" && isYou(v)) n++;
      else if (side === "ai" && isAI(v)) n++;
    }
    return n;
  }
  function maybePromote(r, c){
    if (board[r][c] === 'w' && r === N-1) board[r][c] = 'W';
    if (board[r][c] === 'b' && r === 0) board[r][c] = 'B';
  }
  function applyCap(from, cap){
    board[cap.to[0]][cap.to[1]] = board[from[0]][from[1]];
    board[from[0]][from[1]] = '.';
    board[cap.over[0]][cap.over[1]] = '.';
    maybePromote(cap.to[0], cap.to[1]);
  }

  function aiMove(){
    if (winner) return;
    const caps = [];
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      if (isAI(board[r][c])) for (const cp of captures(board, r, c)) caps.push({ from:[r, c], cap: cp });
    }
    if (caps.length){
      let m = caps[Math.floor(Math.random() * caps.length)];
      while (m){
        applyCap(m.from, m.cap);
        const more = captures(board, m.cap.to[0], m.cap.to[1]);
        if (more.length){ m = { from: m.cap.to, cap: more[0] }; } else m = null;
      }
      if (countSide("you") === 0){ winner = "ai"; draw(); return; }
      turn = "you"; draw(); return;
    }
    const opts = [];
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      if (isAI(board[r][c])) for (const q of quietMoves(board, r, c)) opts.push({ from:[r, c], to: q.to });
    }
    if (!opts.length){ winner = "you"; draw(); return; }
    const m = opts[Math.floor(Math.random() * opts.length)];
    board[m.to[0]][m.to[1]] = board[m.from[0]][m.from[1]]; board[m.from[0]][m.from[1]] = '.';
    maybePromote(m.to[0], m.to[1]);
    turn = "you"; draw();
  }

  function cellRect(r, c){
    const margin = 12, cs = (size - 2*margin) / N;
    return { x: margin + c*cs, y: 30 + r*cs, w: cs, h: cs };
  }

  function draw(){
    ctx.fillStyle = "#f6f0e0"; ctx.fillRect(0, 0, W, H);
    ctx.font = "12px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const rc = cellRect(r, c);
      ctx.fillStyle = "#d4c8a0";
      ctx.fillRect(rc.x, rc.y, rc.w, rc.h);
      ctx.strokeStyle = "#b8a880"; ctx.lineWidth = 0.5; ctx.strokeRect(rc.x, rc.y, rc.w, rc.h);
      if (sel && sel.r === r && sel.c === c){ ctx.fillStyle = "rgba(120,220,120,0.5)"; ctx.fillRect(rc.x, rc.y, rc.w, rc.h); }
      const p = board[r][c]; if (p === '.') continue;
      ctx.beginPath(); ctx.arc(rc.x + rc.w/2, rc.y + rc.h/2, rc.w * 0.38, 0, Math.PI*2);
      ctx.fillStyle = isYou(p) ? "#333" : "#ddd"; ctx.fill();
      ctx.strokeStyle = "#222"; ctx.lineWidth = 1; ctx.stroke();
      if (isKing(p)){ ctx.fillStyle = "#ff0"; ctx.font = "bold 14px sans-serif"; ctx.fillText("♛", rc.x + rc.w/2, rc.y + rc.h/2 + 5); }
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
            applyCap([sel.r, sel.c], cap); sel = { r: cap.to[0], c: cap.to[1] };
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
          applyCap([sel.r, sel.c], cap); sel = { r, c };
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
          maybePromote(r, c);
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
    solve(){
      if (winner || turn !== "you") return;
      mustChain = null; sel = null;
      const hasCaps = anyCaptures(board, "you");
      if (hasCaps){
        const caps = [];
        for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
          if (isYou(board[r][c])) for (const cp of captures(board, r, c)) caps.push({ from:[r, c], cap: cp });
        }
        let m = caps[Math.floor(Math.random() * caps.length)];
        while (m){
          applyCap(m.from, m.cap);
          const more = captures(board, m.cap.to[0], m.cap.to[1]);
          if (more.length){ m = { from: m.cap.to, cap: more[0] }; } else m = null;
        }
        if (countSide("ai") === 0){ winner = "you"; draw(); return; }
      } else {
        const opts = [];
        for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
          if (isYou(board[r][c])) for (const q of quietMoves(board, r, c)) opts.push({ from:[r, c], to: q.to });
        }
        if (!opts.length){ winner = "ai"; draw(); return; }
        const m = opts[Math.floor(Math.random() * opts.length)];
        board[m.to[0]][m.to[1]] = board[m.from[0]][m.from[1]]; board[m.from[0]][m.from[1]] = '.';
        maybePromote(m.to[0], m.to[1]);
      }
      turn = "ai"; draw(); setTimeout(aiMove, 80);
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
