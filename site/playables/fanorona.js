// Fanorona — 9×5 grid of points. Pieces capture by APPROACH (move toward an
// adjacent enemy line, removing the whole line beyond) or WITHDRAWAL (move
// away from one, removing the line behind). Captures are mandatory when
// available. Win by capturing all enemy pieces. AI: greedy capture, else
// random advance.

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = Math.floor(size * 0.6) + 30;
  const W = canvas.width, H = canvas.height;
  const statusEl = document.getElementById("playable-status");

  const COLS = 9, ROWS = 5;
  // adjacency: orthogonal everywhere; diagonals at "strong" points where (r+c) even.
  function adj(r, c){
    const out = [];
    for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]){
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) out.push([dr, dc]);
    }
    if ((r + c) % 2 === 0){
      for (const [dr, dc] of [[-1,-1],[-1,1],[1,-1],[1,1]]){
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) out.push([dr, dc]);
      }
    }
    return out;
  }

  let board, turn, winner;
  function newGame(){
    board = Array.from({ length: ROWS }, () => new Array(COLS).fill('.'));
    for (let c = 0; c < COLS; c++){ board[0][c] = 'W'; board[1][c] = 'W'; board[3][c] = 'B'; board[4][c] = 'B'; }
    board[2][0] = 'W'; board[2][1] = 'B'; board[2][2] = 'W'; board[2][3] = 'B';
    board[2][5] = 'W'; board[2][6] = 'B'; board[2][7] = 'W'; board[2][8] = 'B';
    turn = "you"; winner = null;
  }
  newGame();

  function generateMoves(b, side){
    const my = side === "you" ? 'B' : 'W';
    const enemy = side === "you" ? 'W' : 'B';
    const approaches = [];
    const withdraws = [];
    const quiet = [];
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++){
      if (b[r][c] !== my) continue;
      for (const [dr, dc] of adj(r, c)){
        const nr = r + dr, nc = c + dc;
        if (b[nr][nc] !== '.') continue;
        // approach: cell after destination in same direction has enemy
        const ar = nr + dr, ac = nc + dc;
        if (ar >= 0 && ar < ROWS && ac >= 0 && ac < COLS && b[ar][ac] === enemy){
          approaches.push({ from: [r, c], to: [nr, nc], dir: [dr, dc], kind: 'approach' });
        }
        // withdrawal: cell behind origin (opposite dir) has enemy
        const br = r - dr, bc = c - dc;
        if (br >= 0 && br < ROWS && bc >= 0 && bc < COLS && b[br][bc] === enemy){
          withdraws.push({ from: [r, c], to: [nr, nc], dir: [-dr, -dc], kind: 'withdraw' });
        }
        quiet.push({ from: [r, c], to: [nr, nc], dir: [dr, dc], kind: 'quiet' });
      }
    }
    const caps = approaches.concat(withdraws);
    return caps.length ? caps : quiet;
  }

  function applyMove(b, mv, side){
    const enemy = side === "you" ? 'W' : 'B';
    const [fr, fc] = mv.from, [tr, tc] = mv.to;
    const piece = b[fr][fc]; b[fr][fc] = '.'; b[tr][tc] = piece;
    if (mv.kind === 'approach'){
      let r = tr + mv.dir[0], c = tc + mv.dir[1];
      while (r >= 0 && r < ROWS && c >= 0 && c < COLS && b[r][c] === enemy){ b[r][c] = '.'; r += mv.dir[0]; c += mv.dir[1]; }
    } else if (mv.kind === 'withdraw'){
      let r = fr + mv.dir[0], c = fc + mv.dir[1];
      while (r >= 0 && r < ROWS && c >= 0 && c < COLS && b[r][c] === enemy){ b[r][c] = '.'; r += mv.dir[0]; c += mv.dir[1]; }
    }
  }

  function countSide(b, ch){ let n = 0; for (const row of b) for (const v of row) if (v === ch) n++; return n; }

  function aiMove(){
    if (winner) return;
    const moves = generateMoves(board, "ai");
    if (!moves.length){ winner = "you"; draw(); return; }
    // greedy: pick move that captures most
    let best = moves[0], bestCap = -1;
    for (const mv of moves){
      const nb = board.map(row => row.slice());
      applyMove(nb, mv, "ai");
      const cap = countSide(board, 'B') - countSide(nb, 'B');
      if (cap > bestCap){ bestCap = cap; best = mv; }
    }
    applyMove(board, best, "ai");
    if (countSide(board, 'B') === 0){ winner = "ai"; draw(); return; }
    turn = "you"; draw();
  }

  let sel = null;
  function pointPos(r, c){
    const margin = 18, cw = (size - 2*margin) / (COLS - 1), ch = (size * 0.6 - 30) / (ROWS - 1);
    return { x: margin + c * cw, y: 30 + r * ch };
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "13px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";

    ctx.strokeStyle = "#888"; ctx.lineWidth = 1;
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++){
      const p = pointPos(r, c);
      for (const [dr, dc] of adj(r, c)){
        if (dr < 0 || (dr === 0 && dc < 0)) continue;
        const p2 = pointPos(r + dr, c + dc);
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
      }
    }
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++){
      const p = pointPos(r, c);
      ctx.beginPath(); ctx.arc(p.x, p.y, 9, 0, Math.PI*2);
      if (board[r][c] === '.'){ ctx.fillStyle = "#fff"; ctx.fill(); ctx.strokeStyle = "#888"; ctx.stroke(); }
      else {
        ctx.fillStyle = board[r][c] === 'B' ? "#39c" : "#e60";
        if (sel && sel[0] === r && sel[1] === c) ctx.fillStyle = "#cef2cf";
        ctx.fill(); ctx.strokeStyle = "#222"; ctx.stroke();
      }
    }
    if (sel && turn === "you" && !winner){
      const moves = generateMoves(board, "you").filter(mv => mv.from[0] === sel[0] && mv.from[1] === sel[1]);
      for (const mv of moves){
        const p = pointPos(mv.to[0], mv.to[1]);
        ctx.strokeStyle = "#0a0"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(p.x, p.y, 12, 0, Math.PI*2); ctx.stroke(); ctx.lineWidth = 1;
      }
    }
    if (winner) statusEl.textContent = winner === "you" ? "you win!" : "AI wins";
    else statusEl.textContent = turn === "you" ? (sel ? "click a green-outlined target" : "click your blue piece") : "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }

  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e);
    let best = null, bestD = Infinity;
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++){
      const p = pointPos(r, c); const d = Math.hypot(x - p.x, y - p.y);
      if (d < bestD){ bestD = d; best = [r, c]; }
    }
    if (!best || bestD > 14) return;
    const [r, c] = best;
    if (sel){
      if (sel[0] === r && sel[1] === c){ sel = null; draw(); return; }
      if (board[r][c] === 'B'){ sel = [r, c]; draw(); return; }
      const mv = generateMoves(board, "you").find(m => m.from[0] === sel[0] && m.from[1] === sel[1] && m.to[0] === r && m.to[1] === c);
      if (!mv){ sel = null; draw(); return; }
      applyMove(board, mv, "you"); sel = null;
      if (countSide(board, 'W') === 0){ winner = "you"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 400);
    } else {
      if (board[r][c] === 'B'){ sel = [r, c]; draw(); }
    }
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve(){
      if (winner || turn !== "you") return;
      const __mvs = generateMoves(board, "you");
      if (!__mvs || !__mvs.length){ winner = "ai"; draw(); return; }
      const __mv = __mvs[Math.floor(Math.random() * __mvs.length)];
      applyMove(board, __mv, "you"); sel = null;
      if (countSide(board, 'W') === 0){ winner = "you"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 80);
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); sel = null; draw(); },
  };
}
