// Onyx — connection game on a board with both square and triangular cells.
// We use a simplified 7×7 grid where stones are placed on intersections and
// you (B) connect TOP↔BOTTOM, AI (W) connects LEFT↔RIGHT. The Onyx capture
// rule (4-stones-around-a-vertex sandwiching enemy) is approximated by a
// custodial capture: if your stone causes an enemy stone to be surrounded
// on 3+ orthogonal sides by your stones AND board edges, it's removed.
// AI: shortest-path heuristic.

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 400);
  canvas.width = size;
  canvas.height = size + 30;
  const W = canvas.width, H = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) { canvas.style.width = W + 'px'; canvas.style.height = H + 'px'; canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr); }
  const statusEl = document.getElementById("playable-status");

  const N = 7;
  let board, turn, winner;
  function newGame(){
    board = Array.from({ length: N }, () => new Array(N).fill('.'));
    turn = "you"; winner = null;
  }
  newGame();

  function neighbours(r, c){
    return [[-1,0],[1,0],[0,-1],[0,1]].map(([dr, dc]) => [r+dr, c+dc]).filter(([nr, nc]) => nr>=0 && nr<N && nc>=0 && nc<N);
  }
  function captureAround(r, c, ch){
    const enemy = ch === 'B' ? 'W' : 'B';
    for (const [nr, nc] of neighbours(r, c)){
      if (board[nr][nc] !== enemy) continue;
      // count my-or-edge sides
      let n = 0;
      for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]){
        const ar = nr + dr, ac = nc + dc;
        if (ar < 0 || ar >= N || ac < 0 || ac >= N) { n++; continue; }
        if (board[ar][ac] === ch) n++;
      }
      if (n >= 3) board[nr][nc] = '.';
    }
  }
  function checkConnect(ch, mode){
    const seen = Array.from({ length: N }, () => new Array(N).fill(false));
    const stack = [];
    if (mode === 'V') for (let c = 0; c < N; c++){ if (board[0][c] === ch){ stack.push([0, c]); seen[0][c] = true; } }
    else for (let r = 0; r < N; r++){ if (board[r][0] === ch){ stack.push([r, 0]); seen[r][0] = true; } }
    while (stack.length){
      const [r, c] = stack.pop();
      if (mode === 'V' && r === N-1) return true;
      if (mode === 'H' && c === N-1) return true;
      for (const [nr, nc] of neighbours(r, c)) if (!seen[nr][nc] && board[nr][nc] === ch){ seen[nr][nc] = true; stack.push([nr, nc]); }
    }
    return false;
  }

  function aiMove(){
    if (winner) return;
    let best = null, bestScore = -Infinity;
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      if (board[r][c] !== '.') continue;
      const snap = board.map(rr => rr.slice());
      board[r][c] = 'W'; captureAround(r, c, 'W');
      if (checkConnect('W', 'H')){ board = snap; board[r][c] = 'W'; captureAround(r, c, 'W'); winner = "ai"; draw(); return; }
      let s = c; // prefer reaching right edge
      board = snap;
      if (s > bestScore){ bestScore = s; best = [r, c]; }
    }
    if (!best) return;
    board[best[0]][best[1]] = 'W'; captureAround(best[0], best[1], 'W');
    if (checkConnect('W', 'H')){ winner = "ai"; draw(); return; }
    turn = "you"; draw();
  }

  function cellRect(r, c){
    const margin = 20, cs = (size - 2*margin) / N;
    return { x: margin + c*cs, y: 30 + r*cs, w: cs, h: cs };
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const rc = cellRect(r, c);
      let bg = "#fff";
      if (r === 0 || r === N-1) bg = "#cde6ff";
      if (c === 0 || c === N-1) bg = (r === 0 || r === N-1) ? "#e0d8ee" : "#ffd6d6";
      ctx.fillStyle = bg; ctx.fillRect(rc.x, rc.y, rc.w, rc.h);
      ctx.strokeStyle = "#888"; ctx.strokeRect(rc.x, rc.y, rc.w, rc.h);
      const v = board[r][c]; if (v === '.') continue;
      ctx.beginPath(); ctx.arc(rc.x + rc.w/2, rc.y + rc.h/2, rc.w * 0.36, 0, Math.PI*2);
      ctx.fillStyle = v === 'B' ? "#39c" : "#e60";
      ctx.fill(); ctx.strokeStyle = "#222"; ctx.stroke();
    }
    if (winner) statusEl.textContent = winner === "you" ? "you (T↔B) win!" : "AI (L↔R) wins";
    else statusEl.textContent = turn === "you" ? "click an empty cell" : "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }

  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e);
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const rc = cellRect(r, c);
      if (x < rc.x || x > rc.x + rc.w || y < rc.y || y > rc.y + rc.h) continue;
      if (board[r][c] !== '.') return;
      board[r][c] = 'B'; captureAround(r, c, 'B');
      if (checkConnect('B', 'V')){ winner = "you"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 350); return;
    }
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve(){
      if (winner || turn !== "you") return;
      const __mvs = [];
      for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (board[r][c] === '.') __mvs.push([r, c]);
      if (!__mvs.length) { winner = "ai"; draw(); return; }
      const [r, c] = __mvs[Math.floor(Math.random() * __mvs.length)];
      board[r][c] = 'B'; captureAround(r, c, 'B');
      if (checkConnect('B', 'V')){ winner = "you"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 80);
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
