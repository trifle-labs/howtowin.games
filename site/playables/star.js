// *Star — hexagonal connection-scoring game (Schensted / Ea Ea). Players take
// turns placing stones on a hex board. The peripheral cells are special: at
// game end each player scores (#peripheral cells in own group − 3). Highest
// score wins. We implement a simplified small hex (side 4) where the game
// ends when the board is full, then we tally scores by flood-fill groups.
// AI: 1-ply heuristic — place where current score-after-move is best.

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = Math.ceil(size * 1.05);
  const W = canvas.width, H = canvas.height;
  const statusEl = document.getElementById("playable-status");

  const S = 4;
  const cells = [];
  for (let q = -S+1; q <= S-1; q++) for (let r = -S+1; r <= S-1; r++){
    if (Math.abs(q + r) > S - 1) continue;
    cells.push([q, r]);
  }
  const key = (q, r) => `${q},${r}`;
  const isPerimeter = (q, r) => Math.abs(q) === S - 1 || Math.abs(r) === S - 1 || Math.abs(q + r) === S - 1;
  function neighbours(q, r){
    return [[q+1,r],[q-1,r],[q,r+1],[q,r-1],[q+1,r-1],[q-1,r+1]].filter(([a,b]) => Math.abs(a) <= S-1 && Math.abs(b) <= S-1 && Math.abs(a+b) <= S-1);
  }

  let board, turn, winner;
  function newGame(){
    board = {}; for (const [q, r] of cells) board[key(q,r)] = '.';
    turn = "you"; winner = null;
  }
  newGame();

  function scoreFor(ch){
    const seen = new Set();
    let total = 0;
    for (const [q, r] of cells){
      const k = key(q, r); if (seen.has(k) || board[k] !== ch) continue;
      const stack = [[q, r]]; seen.add(k); let peri = 0;
      while (stack.length){
        const [a, b] = stack.pop();
        if (isPerimeter(a, b)) peri++;
        for (const [na, nb] of neighbours(a, b)){
          const k2 = key(na, nb); if (seen.has(k2) || board[k2] !== ch) continue;
          seen.add(k2); stack.push([na, nb]);
        }
      }
      if (peri > 0) total += (peri - 3);
    }
    return total;
  }
  function emptyCount(){ let n = 0; for (const k of Object.keys(board)) if (board[k] === '.') n++; return n; }

  function aiMove(){
    if (winner) return;
    let best = null, bestScore = -Infinity;
    for (const [q, r] of cells){
      const k = key(q, r); if (board[k] !== '.') continue;
      board[k] = 'W';
      const s = scoreFor('W') - scoreFor('B');
      board[k] = '.';
      if (s > bestScore){ bestScore = s; best = [q, r]; }
    }
    if (!best) return;
    board[key(best[0], best[1])] = 'W';
    if (emptyCount() === 0){ endGame(); return; }
    turn = "you"; draw();
  }
  function endGame(){
    const sy = scoreFor('B'), sa = scoreFor('W');
    winner = sy > sa ? "you" : sa > sy ? "ai" : "draw";
    draw();
  }

  function hexPos(q, r){
    const s = Math.min(W, size) / 13;
    const cx = W/2, cy = H/2;
    const x = cx + s * Math.sqrt(3) * (q + r/2);
    const y = cy + s * 1.5 * r;
    return { x, y, s };
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    for (const [q, r] of cells){
      const p = hexPos(q, r);
      ctx.beginPath();
      for (let i = 0; i < 6; i++){
        const a = Math.PI/180 * (60*i - 30);
        const px = p.x + p.s * Math.cos(a), py = p.y + p.s * Math.sin(a);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = isPerimeter(q, r) ? "#fff3c4" : "#fff";
      ctx.fill(); ctx.strokeStyle = "#888"; ctx.stroke();
      const v = board[key(q, r)]; if (v === '.') continue;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.s * 0.65, 0, Math.PI*2);
      ctx.fillStyle = v === 'B' ? "#39c" : "#e60";
      ctx.fill(); ctx.strokeStyle = "#222"; ctx.stroke();
    }
    if (winner){
      const sy = scoreFor('B'), sa = scoreFor('W');
      statusEl.textContent = winner === "draw" ? `draw ${sy}-${sa}` : winner === "you" ? `you win ${sy}-${sa}` : `AI wins ${sa}-${sy}`;
    } else statusEl.textContent = turn === "you" ? `click a hex (score: you ${scoreFor('B')}, AI ${scoreFor('W')})` : "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }
  function hexAt(x, y){
    let best = null, bestD = Infinity;
    for (const [q, r] of cells){
      const p = hexPos(q, r);
      const d = (x-p.x)*(x-p.x) + (y-p.y)*(y-p.y);
      if (d < bestD){ bestD = d; best = [q, r, p.s]; }
    }
    if (!best) return null;
    return bestD <= best[2]*best[2] ? best : null;
  }
  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e);
    const hit = hexAt(x, y); if (!hit) return;
    const [q, r] = hit;
    const k = key(q, r); if (board[k] !== '.') return;
    board[k] = 'B';
    if (emptyCount() === 0){ endGame(); return; }
    turn = "ai"; draw(); setTimeout(aiMove, 350);
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve(){
      if (winner || turn !== "you") return;
      const __mvs = cells.filter(([q, r]) => board[key(q, r)] === '.');
      if (!__mvs.length) { endGame(); return; }
      const [q, r] = __mvs[Math.floor(Math.random() * __mvs.length)];
      board[key(q, r)] = 'B';
      if (emptyCount() === 0){ endGame(); return; }
      turn = "ai"; draw();
      setTimeout(aiMove, 80);
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
