// Phutball — Conway's Philosopher's Football. We use a reduced 9×11 grid. One
// shared "ball" starts at centre. On each turn a player either DROPS a man on
// an empty cell, OR JUMPS the ball: along a straight line (8 directions),
// over a contiguous chain of one-or-more men into the empty cell beyond.
// Jumped men are removed. You can chain jumps. Black (you) wins by getting
// the ball to or past row 0; White (AI) wins by ball at or past last row.
// AI: heuristic — drops to block our path; jumps if it advances ball.

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 400);
  canvas.width = size;
  canvas.height = size + 60;
  const W = canvas.width, H = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) { canvas.style.width = W + 'px'; canvas.style.height = H + 'px'; canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr); }
  const statusEl = document.getElementById("playable-status");

  const ROWS = 11, COLS = 9;
  let board, ball, turn, winner, jumping;
  function newGame(){
    board = Array.from({ length: ROWS }, () => new Array(COLS).fill('.'));
    ball = [Math.floor(ROWS/2), Math.floor(COLS/2)];
    turn = "you"; winner = null; jumping = false;
  }
  newGame();

  const DIRS = [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]];

  function findJumps(b, br, bc){
    const out = [];
    for (const [dr, dc] of DIRS){
      let nr = br + dr, nc = bc + dc;
      if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) continue;
      if (b[nr][nc] !== 'M') continue;
      let men = [[nr, nc]];
      while (nr + dr >= 0 && nr + dr < ROWS && nc + dc >= 0 && nc + dc < COLS && b[nr + dr][nc + dc] === 'M'){
        nr += dr; nc += dc; men.push([nr, nc]);
      }
      const er = nr + dr, ec = nc + dc;
      if (er < 0 || er >= ROWS || ec < 0 || ec >= COLS) continue;
      if (b[er][ec] !== '.') continue;
      out.push({ to: [er, ec], remove: men });
    }
    return out;
  }

  function applyJump(b, ballPos, mv){
    for (const [r, c] of mv.remove) b[r][c] = '.';
    ballPos[0] = mv.to[0]; ballPos[1] = mv.to[1];
  }

  function aiTurn(){
    if (winner) return;
    // jump if AI advances (towards row ROWS-1)
    const jumps = findJumps(board, ball[0], ball[1]);
    const adv = jumps.find(j => j.to[0] > ball[0]);
    if (adv){
      applyJump(board, ball, adv);
      if (ball[0] >= ROWS - 1){ winner = "ai"; draw(); return; }
      turn = "you"; draw(); return;
    }
    // drop: place a man one step below the ball if empty (to enable own jumps later) else any empty next to ball
    for (const [dr, dc] of [[1,0],[1,-1],[1,1],[1,-2],[1,2]]){
      const r = ball[0] + dr, c = ball[1] + dc;
      if (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === '.'){
        board[r][c] = 'M'; turn = "you"; draw(); return;
      }
    }
    // fallback: any empty cell
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++){
      if (board[r][c] === '.' && !(r === ball[0] && c === ball[1])){ board[r][c] = 'M'; turn = "you"; draw(); return; }
    }
    winner = "you"; draw();
  }

  function cellRect(r, c){
    const margin = 12;
    const cs = Math.min((size - 2*margin) / COLS, (size - 2*margin) / ROWS);
    return { x: margin + c*cs, y: 30 + r*cs, w: cs, h: cs };
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "12px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++){
      const rc = cellRect(r, c);
      let bg = "#fff";
      if (r === 0) bg = "#cde6ff";
      if (r === ROWS - 1) bg = "#ffd6d6";
      ctx.fillStyle = bg; ctx.fillRect(rc.x, rc.y, rc.w, rc.h);
      ctx.strokeStyle = "#888"; ctx.strokeRect(rc.x, rc.y, rc.w, rc.h);
      if (board[r][c] === 'M'){
        ctx.beginPath(); ctx.arc(rc.x + rc.w/2, rc.y + rc.h/2, rc.w * 0.28, 0, Math.PI*2);
        ctx.fillStyle = "#333"; ctx.fill();
      }
      if (ball[0] === r && ball[1] === c){
        ctx.beginPath(); ctx.arc(rc.x + rc.w/2, rc.y + rc.h/2, rc.w * 0.38, 0, Math.PI*2);
        ctx.fillStyle = "#e60"; ctx.fill(); ctx.strokeStyle = "#222"; ctx.stroke();
      }
    }
    ctx.font = "11px sans-serif"; ctx.fillStyle = "#444"; ctx.textAlign = "left";
    ctx.fillText("(blue = your goal — top row; red = AI's goal)", 12, H - 12);
    if (winner) statusEl.textContent = winner === "you" ? "you win — touchdown!" : "AI wins";
    else statusEl.textContent = turn === "you" ? "click empty cell to DROP a man, OR click the ball to begin a JUMP" : "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }

  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e);
    let hit = null;
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++){
      const rc = cellRect(r, c);
      if (x >= rc.x && x <= rc.x + rc.w && y >= rc.y && y <= rc.y + rc.h){ hit = [r, c]; break; }
    }
    if (!hit) return;
    const [r, c] = hit;
    if (jumping){
      const jumps = findJumps(board, ball[0], ball[1]);
      const mv = jumps.find(j => j.to[0] === r && j.to[1] === c);
      if (!mv){ jumping = false; draw(); return; }
      applyJump(board, ball, mv);
      if (ball[0] <= 0){ winner = "you"; draw(); return; }
      // allow another jump if available
      const next = findJumps(board, ball[0], ball[1]);
      if (next.length === 0){
        jumping = false; turn = "ai"; draw(); setTimeout(aiTurn, 400); return;
      }
      // remain in jump mode; player can click ball-empty to stop? simpler: keep jumping if want
      draw(); return;
    }
    if (ball[0] === r && ball[1] === c){
      jumping = true; draw(); return;
    }
    if (board[r][c] !== '.') return;
    board[r][c] = 'M'; turn = "ai"; draw(); setTimeout(aiTurn, 400);
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve(){
      if (winner || turn !== "you") return;
      // Try a jump first if it advances the ball upward; else drop a man randomly.
      const __jumps = findJumps(board, ball[0], ball[1]);
      const __adv = __jumps.filter(j => j.to[0] < ball[0]);
      if (__adv.length){
        const __jmp = __adv[Math.floor(Math.random() * __adv.length)];
        applyJump(board, ball, __jmp);
        if (ball[0] <= 0){ winner = "you"; draw(); return; }
        jumping = false; turn = "ai"; draw(); setTimeout(aiTurn, 80); return;
      }
      // drop a man on a random empty cell (not the ball cell)
      const __empty = [];
      for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++)
        if (board[r][c] === '.' && !(r === ball[0] && c === ball[1])) __empty.push([r, c]);
      if (!__empty.length) { winner = "ai"; draw(); return; }
      const [__r, __c] = __empty[Math.floor(Math.random() * __empty.length)];
      board[__r][__c] = 'M'; turn = "ai"; draw(); setTimeout(aiTurn, 80);
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
