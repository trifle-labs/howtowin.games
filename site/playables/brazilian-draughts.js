// Brazilian draughts — 8×8 international rules: flying kings, mandatory
// maximum-captures, men can capture backwards. Identical rules to international
// (Polish) draughts but on an 8×8 board. We share the engine with checkers
// but allow men to capture backwards and kings to fly any distance.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  function _fit(ctx, t, x, y, maxW){
    let f = parseFloat(ctx.font) || 12;
    while (f > 8 && ctx.measureText(t).width > maxW){ f--; ctx.font = ctx.font.replace(/[\d.]+px/, f + 'px'); }
    ctx.fillText(t, x, y);
  }

  const size = Math.min(canvas.parentElement.clientWidth - 24, 400);
  canvas.width = size;
  canvas.height = size + 30;
  const W = canvas.width, H = canvas.height;
  const statusEl = document.getElementById("playable-status");

  const N = 8;
  let board, turn, winner, sel, chain;
  function newGame(){
    board = Array.from({ length: N }, () => new Array(N).fill('.'));
    for (let r = 0; r < 3; r++) for (let c = 0; c < N; c++) if ((r + c) % 2 === 1) board[r][c] = 'w';
    for (let r = N-3; r < N; r++) for (let c = 0; c < N; c++) if ((r + c) % 2 === 1) board[r][c] = 'b';
    turn = "you"; winner = null; sel = null; chain = null;
  }
  newGame();

  const isYou = (p) => p === 'b' || p === 'B';
  const isAI = (p) => p === 'w' || p === 'W';

  function manCaptures(b, r, c){
    const p = b[r][c]; const enemy = isYou(p) ? isAI : isYou;
    const out = [];
    for (const [dr, dc] of [[-1,-1],[-1,1],[1,-1],[1,1]]){
      const er = r + dr, ec = c + dc;
      const lr = r + 2*dr, lc = c + 2*dc;
      if (lr < 0 || lr >= N || lc < 0 || lc >= N) continue;
      if (enemy(b[er][ec]) && b[lr][lc] === '.') out.push({ to: [lr, lc], over: [er, ec] });
    }
    return out;
  }
  function kingCaptures(b, r, c){
    const p = b[r][c]; const enemy = isYou(p) ? isAI : isYou;
    const out = [];
    for (const [dr, dc] of [[-1,-1],[-1,1],[1,-1],[1,1]]){
      let nr = r + dr, nc = c + dc;
      let foundEnemy = null;
      while (nr >= 0 && nr < N && nc >= 0 && nc < N){
        if (b[nr][nc] === '.') { if (foundEnemy){ out.push({ to: [nr, nc], over: foundEnemy }); } nr += dr; nc += dc; continue; }
        if (enemy(b[nr][nc]) && !foundEnemy){ foundEnemy = [nr, nc]; nr += dr; nc += dc; continue; }
        break;
      }
    }
    return out;
  }
  function captures(b, r, c){ const p = b[r][c]; return (p === 'B' || p === 'W') ? kingCaptures(b, r, c) : manCaptures(b, r, c); }
  function quietMoves(b, r, c){
    const p = b[r][c]; const out = [];
    if (p === 'B' || p === 'W'){
      for (const [dr, dc] of [[-1,-1],[-1,1],[1,-1],[1,1]]){
        let nr = r + dr, nc = c + dc;
        while (nr >= 0 && nr < N && nc >= 0 && nc < N && b[nr][nc] === '.'){ out.push({ to: [nr, nc] }); nr += dr; nc += dc; }
      }
    } else {
      const dir = p === 'b' ? -1 : 1;
      for (const dc of [-1, 1]){
        const nr = r + dir, nc = c + dc;
        if (nr >= 0 && nr < N && nc >= 0 && nc < N && b[nr][nc] === '.') out.push({ to: [nr, nc] });
      }
    }
    return out;
  }
  function anyCaptures(side){
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const p = board[r][c]; if (side === "you" ? isYou(p) : isAI(p)){ if (captures(board, r, c).length) return true; }
    }
    return false;
  }
  function countSide(side){ let n = 0; for (const row of board) for (const v of row){ if (side === "you" && isYou(v)) n++; if (side === "ai" && isAI(v)) n++; } return n; }

  function aiMove(){
    if (winner) return;
    // greedy capture chains
    let pieces = [];
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (isAI(board[r][c])) pieces.push([r, c]);
    let mover = null;
    for (const [r, c] of pieces){ if (captures(board, r, c).length){ mover = [r, c]; break; } }
    if (mover){
      let [r, c] = mover;
      while (true){
        const caps = captures(board, r, c); if (!caps.length) break;
        const cp = caps[0];
        board[cp.to[0]][cp.to[1]] = board[r][c]; board[r][c] = '.'; board[cp.over[0]][cp.over[1]] = '.';
        r = cp.to[0]; c = cp.to[1];
        if (r === N-1 && board[r][c] === 'w') board[r][c] = 'W';
      }
      if (countSide("you") === 0){ winner = "ai"; draw(); return; }
      turn = "you"; draw(); return;
    }
    // quiet random
    const opts = [];
    for (const [r, c] of pieces){ for (const q of quietMoves(board, r, c)) opts.push({ from: [r, c], to: q.to }); }
    if (!opts.length){ winner = "you"; draw(); return; }
    const m = opts[Math.floor(Math.random() * opts.length)];
    board[m.to[0]][m.to[1]] = board[m.from[0]][m.from[1]]; board[m.from[0]][m.from[1]] = '.';
    if (m.to[0] === N-1 && board[m.to[0]][m.to[1]] === 'w') board[m.to[0]][m.to[1]] = 'W';
    turn = "you"; draw();
  }

  function cellRect(r, c){
    const margin = 16, cs = (size - 2*margin) / N;
    return { x: margin + c*cs, y: 30 + r*cs, w: cs, h: cs };
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "12px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";
    _fit(ctx, "Brazilian draughts — flying kings; men capture backwards; mandatory captures", W/2, 18, W - 8);
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
    else statusEl.textContent = turn === "you" ? (sel ? "click destination" : "click your piece") : "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }

  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e);
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const rc = cellRect(r, c);
      if (x < rc.x || x > rc.x + rc.w || y < rc.y || y > rc.y + rc.h) continue;
      const captureAvail = anyCaptures("you");
      if (chain){
        const caps = captures(board, chain.r, chain.c);
        const cp = caps.find(c2 => c2.to[0] === r && c2.to[1] === c);
        if (cp){
          board[cp.to[0]][cp.to[1]] = board[chain.r][chain.c]; board[chain.r][chain.c] = '.'; board[cp.over[0]][cp.over[1]] = '.';
          if (cp.to[0] === 0 && board[cp.to[0]][cp.to[1]] === 'b') board[cp.to[0]][cp.to[1]] = 'B';
          chain = { r: cp.to[0], c: cp.to[1] };
          if (!captures(board, chain.r, chain.c).length){
            chain = null; sel = null;
            if (countSide("ai") === 0){ winner = "you"; draw(); return; }
            turn = "ai"; draw(); setTimeout(aiMove, 350); return;
          }
          sel = chain; draw(); return;
        }
        return;
      }
      if (sel){
        if (sel.r === r && sel.c === c){ sel = null; draw(); return; }
        if (isYou(board[r][c])){ if (!captureAvail || captures(board, r, c).length) sel = { r, c }; draw(); return; }
        const caps = captures(board, sel.r, sel.c);
        const cp = caps.find(c2 => c2.to[0] === r && c2.to[1] === c);
        if (cp){
          board[r][c] = board[sel.r][sel.c]; board[sel.r][sel.c] = '.'; board[cp.over[0]][cp.over[1]] = '.';
          if (r === 0 && board[r][c] === 'b') board[r][c] = 'B';
          if (captures(board, r, c).length){ chain = { r, c }; sel = chain; draw(); return; }
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
      // If mid-capture chain, continue it
      if (chain) {
        const __caps = captures(board, chain.r, chain.c);
        if (!__caps.length) { chain = null; sel = null; turn = "ai"; draw(); setTimeout(aiMove, 80); return; }
        const __cp = __caps[Math.floor(Math.random() * __caps.length)];
        board[__cp.to[0]][__cp.to[1]] = board[chain.r][chain.c];
        board[chain.r][chain.c] = '.';
        board[__cp.over[0]][__cp.over[1]] = '.';
        if (__cp.to[0] === 0 && board[__cp.to[0]][__cp.to[1]] === 'b') board[__cp.to[0]][__cp.to[1]] = 'B';
        chain = { r: __cp.to[0], c: __cp.to[1] };
        if (!captures(board, chain.r, chain.c).length) {
          chain = null; sel = null;
          if (countSide("ai") === 0) { winner = "you"; draw(); return; }
          turn = "ai"; draw(); setTimeout(aiMove, 80);
        } else {
          sel = chain; draw();
        }
        return;
      }
      // Check if captures are mandatory
      const __capAvail = anyCaptures("you");
      if (__capAvail) {
        // Pick a random piece that can capture
        const __capPieces = [];
        for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
          if (isYou(board[r][c]) && captures(board, r, c).length) __capPieces.push([r, c]);
        }
        const [__r, __c] = __capPieces[Math.floor(Math.random() * __capPieces.length)];
        const __caps = captures(board, __r, __c);
        const __cp = __caps[Math.floor(Math.random() * __caps.length)];
        board[__cp.to[0]][__cp.to[1]] = board[__r][__c];
        board[__r][__c] = '.';
        board[__cp.over[0]][__cp.over[1]] = '.';
        if (__cp.to[0] === 0 && board[__cp.to[0]][__cp.to[1]] === 'b') board[__cp.to[0]][__cp.to[1]] = 'B';
        if (captures(board, __cp.to[0], __cp.to[1]).length) {
          chain = { r: __cp.to[0], c: __cp.to[1] }; sel = chain; draw(); return;
        }
        if (countSide("ai") === 0) { winner = "you"; draw(); return; }
        turn = "ai"; draw(); setTimeout(aiMove, 80); return;
      }
      // Quiet move
      const __opts = [];
      for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
        if (isYou(board[r][c])) for (const q of quietMoves(board, r, c)) __opts.push({ from: [r,c], to: q.to });
      }
      if (!__opts.length) { winner = "ai"; draw(); return; }
      const __m = __opts[Math.floor(Math.random() * __opts.length)];
      board[__m.to[0]][__m.to[1]] = board[__m.from[0]][__m.from[1]];
      board[__m.from[0]][__m.from[1]] = '.';
      if (__m.to[0] === 0 && board[__m.to[0]][__m.to[1]] === 'b') board[__m.to[0]][__m.to[1]] = 'B';
      sel = null; turn = "ai"; draw(); setTimeout(aiMove, 80);
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
