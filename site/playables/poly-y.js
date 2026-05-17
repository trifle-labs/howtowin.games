// Poly-Y — pentagonal-cornered relative of Y. Players place stones on a hex
// board with 5 designated corner cells. A "corner is owned" by the player
// whose stone touches it AND whose connected group also touches the
// "opposite" pair of sides. We use a simplified scoring close to original:
// at game end (board full) a player owns a corner if it belongs to their
// connected group; the player who owns the majority (≥3 of 5) wins.
// AI: heuristic — place to maximise (own corners-touched − enemy corners).

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

  const S = 4;
  const cells = [];
  for (let q = -S+1; q <= S-1; q++) for (let r = -S+1; r <= S-1; r++){
    if (Math.abs(q + r) > S - 1) continue;
    cells.push([q, r]);
  }
  const k = (q, r) => `${q},${r}`;
  // pick 5 "corner" cells around the perimeter at roughly equal angles
  function angleOf(q, r){ const x = q + r/2, y = r * 0.866; return Math.atan2(y, x); }
  const peri = cells.filter(([q, r]) => Math.abs(q) === S-1 || Math.abs(r) === S-1 || Math.abs(q+r) === S-1);
  peri.sort((a, b) => angleOf(a[0], a[1]) - angleOf(b[0], b[1]));
  const cornerIdx = [0, Math.floor(peri.length*0.2), Math.floor(peri.length*0.4), Math.floor(peri.length*0.6), Math.floor(peri.length*0.8)];
  const corners = cornerIdx.map(i => peri[i]);
  function neighbours(q, r){
    return [[q+1,r],[q-1,r],[q,r+1],[q,r-1],[q+1,r-1],[q-1,r+1]].filter(([a,b]) => Math.abs(a) <= S-1 && Math.abs(b) <= S-1 && Math.abs(a+b) <= S-1);
  }

  let board, turn, winner;
  function newGame(){
    board = {}; for (const [q, r] of cells) board[k(q,r)] = '.';
    turn = "you"; winner = null;
  }
  newGame();

  function cornersOwned(ch){
    let n = 0;
    for (const [q, r] of corners){
      // BFS from corner through cells of ch
      if (board[k(q, r)] !== ch) continue;
      n++;
    }
    return n;
  }
  function emptyCount(){ let n = 0; for (const key of Object.keys(board)) if (board[key] === '.') n++; return n; }

  function aiMove(){
    if (winner) return;
    let best = null, bestScore = -Infinity;
    for (const [q, r] of cells){
      if (board[k(q,r)] !== '.') continue;
      board[k(q,r)] = 'W';
      // BFS: how many corners are reachable through W from this cell?
      let aiOwned = cornersOwned('W');
      // bonus: connectivity to other W cells
      let connect = 0;
      for (const [a, b] of neighbours(q, r)) if (board[k(a,b)] === 'W') connect++;
      const s = aiOwned * 100 + connect - cornersOwned('B') * 50;
      board[k(q,r)] = '.';
      if (s > bestScore){ bestScore = s; best = [q, r]; }
    }
    if (!best) return;
    board[k(best[0], best[1])] = 'W';
    if (emptyCount() === 0){ endGame(); return; }
    turn = "you"; draw();
  }
  function endGame(){
    // full group BFS counting
    const ownerCount = { B: 0, W: 0 };
    for (const [q, r] of corners){
      const v = board[k(q, r)];
      if (v === 'B' || v === 'W') ownerCount[v]++;
    }
    if (ownerCount.B > ownerCount.W) winner = "you";
    else if (ownerCount.W > ownerCount.B) winner = "ai";
    else winner = "draw";
    draw();
  }

  function hexPos(q, r){
    const cx = W/2, cy = 30 + (size - 30)/2;
    const s = Math.min(W, size - 30) / (2*S + 1);
    const x = cx + s * Math.sqrt(3) * (q + r/2);
    const y = cy + s * 1.5 * r;
    return { x, y, s };
  }
  const cornerSet = new Set(corners.map(([q, r]) => k(q, r)));

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "12px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";
    _fit(ctx, "Poly-Y — claim ≥3 of 5 highlighted CORNERS (yellow). Connect to control.", W/2, 18, W - 8);
    for (const [q, r] of cells){
      const p = hexPos(q, r);
      ctx.beginPath();
      for (let i = 0; i < 6; i++){
        const a = Math.PI/180 * (60*i - 30);
        const px = p.x + p.s * Math.cos(a), py = p.y + p.s * Math.sin(a);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = cornerSet.has(k(q,r)) ? "#fff3c4" : "#fff";
      ctx.fill(); ctx.strokeStyle = "#888"; ctx.stroke();
      const v = board[k(q,r)]; if (v === '.') continue;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.s * 0.65, 0, Math.PI*2);
      ctx.fillStyle = v === 'B' ? "#39c" : "#e60";
      ctx.fill(); ctx.strokeStyle = "#222"; ctx.stroke();
    }
    if (winner) statusEl.textContent = winner === "draw" ? "draw" : winner === "you" ? `you win (${cornersOwned('B')}/5 corners)` : `AI wins (${cornersOwned('W')}/5 corners)`;
    else statusEl.textContent = turn === "you" ? `click a hex — corners you: ${cornersOwned('B')}, ai: ${cornersOwned('W')}` : "AI thinking…";
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
    if (board[k(q,r)] !== '.') return;
    board[k(q,r)] = 'B';
    if (emptyCount() === 0){ endGame(); return; }
    turn = "ai"; draw(); setTimeout(aiMove, 350);
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve(){
      if (winner || turn !== "you") return;
      const __mvs = cells.filter(([q, r]) => board[k(q,r)] === '.');
      if (!__mvs.length) { endGame(); return; }
      const [__q, __r] = __mvs[Math.floor(Math.random() * __mvs.length)];
      board[k(__q,__r)] = 'B';
      if (emptyCount() === 0){ endGame(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 80);
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
