// Connect Four — 7×6 board. Drop pieces in columns; 4-in-a-row wins.
// AI: depth-limited minimax with a simple heuristic (counts open lines).

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  function _fit(ctx, t, x, y, maxW){
    let f = parseFloat(ctx.font) || 12;
    while (f > 8 && ctx.measureText(t).width > maxW){ f--; ctx.font = ctx.font.replace(/[\d.]+px/, f + 'px'); }
    ctx.fillText(t, x, y);
  }

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  const COLS = 7, ROWS = 6;
  const cell = Math.floor((size - 20) / COLS);
  canvas.width = COLS*cell + 20;
  canvas.height = ROWS*cell + 60;
  const W = canvas.width, H = canvas.height;
  const statusEl = document.getElementById("playable-status");

  let board, turn, winner;
  function newGame(){ board = new Array(ROWS*COLS).fill('.'); turn = "you"; winner = null; }
  newGame();

  function drop(b, col, side){
    for (let r = ROWS - 1; r >= 0; r--){
      if (b[r*COLS + col] === '.'){ b[r*COLS + col] = side; return r; }
    }
    return -1;
  }

  function wins(b, side){
    const dirs = [[0,1],[1,0],[1,1],[1,-1]];
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++){
      if (b[r*COLS + c] !== side) continue;
      for (const [dr, dc] of dirs){
        let ok = true;
        for (let k = 1; k < 4; k++){
          const nr = r + dr*k, nc = c + dc*k;
          if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS || b[nr*COLS + nc] !== side){ ok = false; break; }
        }
        if (ok) return true;
      }
    }
    return false;
  }

  function full(b){ return !b.includes('.'); }

  function heuristic(b){
    // count 3-in-row open ends for each side
    let s = 0;
    const dirs = [[0,1],[1,0],[1,1],[1,-1]];
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++){
      for (const [dr, dc] of dirs){
        const r4 = r + 3*dr, c4 = c + 3*dc;
        if (r4 < 0 || r4 >= ROWS || c4 < 0 || c4 >= COLS) continue;
        let w = 0, b_ = 0;
        for (let k = 0; k < 4; k++){
          const v = b[(r + dr*k)*COLS + (c + dc*k)];
          if (v === 'w') w++; else if (v === 'b') b_++;
        }
        if (w > 0 && b_ === 0) s -= [0, 1, 4, 30, 1000][w];
        else if (b_ > 0 && w === 0) s += [0, 1, 4, 30, 1000][b_];
      }
    }
    return s;
  }

  function minimax(b, side, depth, alpha, beta){
    if (wins(b, 'b')) return 100000 - (4 - depth);
    if (wins(b, 'w')) return -100000 + (4 - depth);
    if (full(b) || depth === 0) return heuristic(b);
    const cols = [3, 2, 4, 1, 5, 0, 6];
    let best = side === 'b' ? -Infinity : Infinity;
    for (const c of cols){
      if (b[c] !== '.') continue;
      const nb = b.slice(); drop(nb, c, side);
      const v = minimax(nb, side === 'b' ? 'w' : 'b', depth - 1, alpha, beta);
      if (side === 'b'){ if (v > best) best = v; if (best > alpha) alpha = best; }
      else { if (v < best) best = v; if (best < beta) beta = best; }
      if (alpha >= beta) break;
    }
    return best;
  }

  function aiBest(b){
    const cols = [3, 2, 4, 1, 5, 0, 6];
    // immediate win
    for (const c of cols){ if (b[c] !== '.') continue; const nb = b.slice(); drop(nb, c, 'w'); if (wins(nb, 'w')) return c; }
    // block immediate loss
    for (const c of cols){ if (b[c] !== '.') continue; const nb = b.slice(); drop(nb, c, 'b'); if (wins(nb, 'b')) return c; }
    let best = -1, bv = Infinity;
    for (const c of cols){
      if (b[c] !== '.') continue;
      const nb = b.slice(); drop(nb, c, 'w');
      const v = minimax(nb, 'b', 4, -Infinity, Infinity);
      if (v < bv){ bv = v; best = c; }
    }
    return best;
  }

  function aiMove(){
    if (winner) return;
    const c = aiBest(board);
    if (c < 0){ winner = "draw"; draw(); return; }
    drop(board, c, 'w');
    if (wins(board, 'w')){ winner = "ai"; draw(); return; }
    if (full(board)){ winner = "draw"; draw(); return; }
    turn = "you"; draw();
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "13px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";
    _fit(ctx, "Connect Four — click a column to drop your blue piece", W/2, 18, W - 8);

    const ox = 10, oy = 40;
    ctx.fillStyle = "#246"; ctx.fillRect(ox, oy, COLS*cell, ROWS*cell);
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++){
      const x = ox + c*cell + cell/2, y = oy + r*cell + cell/2;
      const v = board[r*COLS + c];
      ctx.beginPath(); ctx.arc(x, y, cell*0.4, 0, Math.PI*2);
      ctx.fillStyle = v === 'b' ? "#39c" : v === 'w' ? "#e60" : "#fff"; ctx.fill();
    }
    if (winner) statusEl.textContent = winner === "you" ? "you win!" : winner === "ai" ? "AI wins" : "draw";
    else statusEl.textContent = turn === "you" ? "click a column to drop your piece" : "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }
  function onClick(e){
    if (winner || turn !== "you") return;
    const { x } = pos(e); const c = Math.floor((x - 10) / cell);
    if (c < 0 || c >= COLS) return;
    if (board[c] !== '.') return;
    drop(board, c, 'b');
    if (wins(board, 'b')){ winner = "you"; draw(); return; }
    if (full(board)){ winner = "draw"; draw(); return; }
    turn = "ai"; draw(); setTimeout(aiMove, 500);
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
    solve(){
      if (winner || turn !== "you") return;
      // play optimal move for you (mirror of aiBest with b/w swap)
      const cols = [3, 2, 4, 1, 5, 0, 6];
      for (const c of cols){ if (board[c] !== '.') continue; const nb = board.slice(); drop(nb, c, 'b'); if (wins(nb, 'b')){ drop(board, c, 'b'); winner = "you"; draw(); return; } }
      for (const c of cols){ if (board[c] !== '.') continue; const nb = board.slice(); drop(nb, c, 'w'); if (wins(nb, 'w')){ drop(board, c, 'b'); break; } }
      // if no urgency, pick centre
      if (board[3] === '.') drop(board, 3, 'b');
      else { for (const c of cols) if (board[c] === '.') { drop(board, c, 'b'); break; } }
      if (wins(board, 'b')){ winner = "you"; draw(); return; }
      if (full(board)){ winner = "draw"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 500);
    },
  };
}
