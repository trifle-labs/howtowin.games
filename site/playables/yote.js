// Yote — 5×6 grid. Each player has 12 stones in reserve. On each turn drop one
// reserve stone OR move/jump-capture one of your stones on the board. A jump
// goes orthogonally over an enemy into an empty cell; after a capture you also
// remove one of the opponent's other stones from anywhere (Yote's signature
// "captured-and-extra" rule). Eliminate or trap all enemy stones to win.
// AI: greedy — prefer captures.

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = size + 80;
  const W = canvas.width, H = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) { canvas.style.width = W + 'px'; canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr); }
  const statusEl = document.getElementById("playable-status");

  const ROWS = 5, COLS = 6;
  let board, reserves, turn, winner, sel, mustExtra;
  function newGame(){
    board = Array.from({ length: ROWS }, () => new Array(COLS).fill('.'));
    reserves = { you: 12, ai: 12 };
    turn = "you"; winner = null; sel = null; mustExtra = null;
  }
  newGame();

  function legalJumps(b, r, c, ch){
    const enemy = ch === 'B' ? 'W' : 'B';
    const out = [];
    for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]){
      const mr = r + dr, mc = c + dc;
      const lr = r + 2*dr, lc = c + 2*dc;
      if (lr < 0 || lr >= ROWS || lc < 0 || lc >= COLS) continue;
      if (b[mr][mc] === enemy && b[lr][lc] === '.') out.push({ over: [mr, mc], to: [lr, lc] });
    }
    return out;
  }
  function legalQuiet(b, r, c){
    const out = [];
    for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]){
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) continue;
      if (b[nr][nc] === '.') out.push({ to: [nr, nc] });
    }
    return out;
  }
  function countSide(b, ch){ let n = 0; for (const row of b) for (const v of row) if (v === ch) n++; return n; }
  function anyMove(b, ch, reserves){
    if (reserves > 0) return true;
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++){
      if (b[r][c] !== ch) continue;
      if (legalJumps(b, r, c, ch).length) return true;
      if (legalQuiet(b, r, c).length) return true;
    }
    return false;
  }

  function aiMove(){
    if (winner) return;
    // try capture first
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++){
      if (board[r][c] !== 'W') continue;
      const js = legalJumps(board, r, c, 'W');
      if (js.length){
        const j = js[0];
        board[r][c] = '.'; board[j.over[0]][j.over[1]] = '.'; board[j.to[0]][j.to[1]] = 'W';
        // pick extra capture: any B
        for (let rr = 0; rr < ROWS; rr++) for (let cc = 0; cc < COLS; cc++){ if (board[rr][cc] === 'B'){ board[rr][cc] = '.'; break; } }
        if (countSide(board, 'B') === 0 && reserves.you === 0){ winner = "ai"; draw(); return; }
        turn = "you"; draw(); return;
      }
    }
    // else: drop or move
    if (reserves.ai > 0){
      // drop in a safe spot
      for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++){
        if (board[r][c] === '.'){ board[r][c] = 'W'; reserves.ai--; turn = "you"; draw(); return; }
      }
    }
    // quiet move
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++){
      if (board[r][c] !== 'W') continue;
      const qs = legalQuiet(board, r, c);
      if (qs.length){
        const q = qs[0]; board[r][c] = '.'; board[q.to[0]][q.to[1]] = 'W';
        turn = "you"; draw(); return;
      }
    }
    // ai stuck
    winner = "you"; draw();
  }

  function cellRect(r, c){
    const margin = 20, cs = (size - 2*margin) / COLS;
    return { x: margin + c*cs, y: 30 + r*cs, w: cs, h: cs };
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "12px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++){
      const rc = cellRect(r, c);
      ctx.fillStyle = "#fff"; ctx.fillRect(rc.x, rc.y, rc.w, rc.h);
      ctx.strokeStyle = "#888"; ctx.strokeRect(rc.x, rc.y, rc.w, rc.h);
      const v = board[r][c]; if (v === '.') continue;
      ctx.beginPath(); ctx.arc(rc.x + rc.w/2, rc.y + rc.h/2, rc.w * 0.35, 0, Math.PI*2);
      ctx.fillStyle = v === 'B' ? "#39c" : "#e60";
      if (sel && sel.r === r && sel.c === c) ctx.fillStyle = "#cef2cf";
      if (mustExtra && v === 'W') ctx.fillStyle = "#fdd";
      ctx.fill(); ctx.strokeStyle = "#222"; ctx.stroke();
    }
    ctx.fillStyle = "#444"; ctx.font = "12px sans-serif"; ctx.textAlign = "left";
    ctx.fillText(`you reserve ${reserves.you} | board ${countSide(board, 'B')}`, 12, H - 30);
    ctx.fillText(`AI  reserve ${reserves.ai} | board ${countSide(board, 'W')}`, 12, H - 12);
    if (winner) statusEl.textContent = winner === "you" ? "you win!" : "AI wins";
    else if (mustExtra) statusEl.textContent = "click any AI stone to remove as extra capture";
    else statusEl.textContent = turn === "you" ? (sel ? "click adjacent empty or jump landing" : "click empty cell to DROP, or click your stone to MOVE") : "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }

  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e);
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++){
      const rc = cellRect(r, c);
      if (x < rc.x || x > rc.x + rc.w || y < rc.y || y > rc.y + rc.h) continue;
      if (mustExtra){
        if (board[r][c] === 'W'){
          board[r][c] = '.'; mustExtra = null;
          if (countSide(board, 'W') === 0 && reserves.ai === 0){ winner = "you"; draw(); return; }
          turn = "ai"; draw(); setTimeout(aiMove, 400); return;
        }
        return;
      }
      if (sel){
        if (sel.r === r && sel.c === c){ sel = null; draw(); return; }
        if (board[r][c] === 'B'){ sel = { r, c }; draw(); return; }
        const dr = r - sel.r, dc = c - sel.c;
        // jump
        if ((Math.abs(dr) === 2 && dc === 0) || (Math.abs(dc) === 2 && dr === 0)){
          const mr = sel.r + dr/2, mc = sel.c + dc/2;
          if (board[mr][mc] === 'W' && board[r][c] === '.'){
            board[sel.r][sel.c] = '.'; board[mr][mc] = '.'; board[r][c] = 'B';
            sel = null;
            if (countSide(board, 'W') === 0){
              if (reserves.ai === 0){ winner = "you"; draw(); return; }
            }
            mustExtra = true; draw(); return;
          }
        }
        if (Math.abs(dr) + Math.abs(dc) === 1 && board[r][c] === '.'){
          board[sel.r][sel.c] = '.'; board[r][c] = 'B'; sel = null;
          turn = "ai"; draw(); setTimeout(aiMove, 400); return;
        }
        sel = null; draw(); return;
      } else {
        if (board[r][c] === '.'){
          if (reserves.you === 0) return;
          board[r][c] = 'B'; reserves.you--;
          turn = "ai"; draw(); setTimeout(aiMove, 400); return;
        }
        if (board[r][c] === 'B'){ sel = { r, c }; draw(); return; }
        return;
      }
    }
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve(){
      if (winner || turn !== "you") return;
      if (mustExtra){
        const __wstones = [];
        for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) if (board[r][c] === 'W') __wstones.push([r, c]);
        if (!__wstones.length){ mustExtra = null; turn = "ai"; draw(); setTimeout(aiMove, 80); return; }
        const [er, ec] = __wstones[Math.floor(Math.random() * __wstones.length)];
        board[er][ec] = '.'; mustExtra = null;
        if (countSide(board, 'W') === 0 && reserves.ai === 0){ winner = "you"; draw(); return; }
        turn = "ai"; draw(); setTimeout(aiMove, 80); return;
      }
      const __jumps = [];
      for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++){
        if (board[r][c] !== 'B') continue;
        for (const j of legalJumps(board, r, c, 'B')) __jumps.push({ from: [r, c], ...j });
      }
      if (__jumps.length){
        const __mv = __jumps[Math.floor(Math.random() * __jumps.length)];
        board[__mv.from[0]][__mv.from[1]] = '.'; board[__mv.over[0]][__mv.over[1]] = '.'; board[__mv.to[0]][__mv.to[1]] = 'B';
        sel = null;
        if (countSide(board, 'W') === 0 && reserves.ai === 0){ winner = "you"; draw(); return; }
        mustExtra = true; draw(); return;
      }
      const __mvs = [];
      if (reserves.you > 0){
        for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) if (board[r][c] === '.') __mvs.push({ drop: [r, c] });
      }
      for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++){
        if (board[r][c] !== 'B') continue;
        for (const q of legalQuiet(board, r, c)) __mvs.push({ from: [r, c], to: q.to });
      }
      if (!__mvs.length){ winner = "ai"; draw(); return; }
      const __mv = __mvs[Math.floor(Math.random() * __mvs.length)];
      if (__mv.drop){ board[__mv.drop[0]][__mv.drop[1]] = 'B'; reserves.you--; }
      else { board[__mv.from[0]][__mv.from[1]] = '.'; board[__mv.to[0]][__mv.to[1]] = 'B'; }
      sel = null; turn = "ai"; draw(); setTimeout(aiMove, 80);
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
