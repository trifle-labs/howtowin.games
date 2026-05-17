// Atoll (Mark Steere) — hex connection game with ISLAND endpoints. Each player
// has two marked "island" cells (near opposite corners). Win by linking your
// two islands with an unbroken chain of your colour. Small board: side 4.
// AI: heuristic — shortest path between own islands, prefer moves on that path
// and block opponent's shortest path.

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = size + 30;
  const W = canvas.width, H = canvas.height;
  const statusEl = document.getElementById("playable-status");

  const S = 4;
  const CELLS = [];
  for (let q = -(S-1); q <= S-1; q++) for (let r = -(S-1); r <= S-1; r++){
    if (Math.abs(q + r) <= S-1) CELLS.push([q, r]);
  }
  const idx = (q, r) => CELLS.findIndex(c => c[0] === q && c[1] === r);
  const NEI = CELLS.map(([q, r]) => {
    const out = [];
    for (const [dq, dr] of [[1,0],[-1,0],[0,1],[0,-1],[1,-1],[-1,1]]){
      const i = idx(q + dq, r + dr); if (i >= 0) out.push(i);
    }
    return out;
  });
  // your islands at top-right and bottom-left; ai at top-left and bottom-right
  const YOUR_ISLANDS = [idx(S-1, -(S-1)), idx(-(S-1), S-1)];
  const AI_ISLANDS = [idx(0, -(S-1)), idx(0, S-1)];

  let board, turn, winner;
  function newGame(){
    board = new Array(CELLS.length).fill('.');
    for (const i of YOUR_ISLANDS) board[i] = 'B';
    for (const i of AI_ISLANDS) board[i] = 'W';
    turn = "you"; winner = null;
  }
  newGame();

  function bfsConnected(b, ch, from, to){
    const seen = new Array(b.length).fill(false);
    const stack = [from]; seen[from] = true;
    while (stack.length){
      const x = stack.pop(); if (x === to) return true;
      for (const n of NEI[x]) if (!seen[n] && b[n] === ch){ seen[n] = true; stack.push(n); }
    }
    return false;
  }
  function shortestPathLen(b, ch, from, to){
    // BFS treating empty as passable (cost 1), own as cost 0, enemy as blocked
    const dist = new Array(b.length).fill(Infinity);
    dist[from] = b[from] === ch ? 0 : 1;
    const queue = [from];
    while (queue.length){
      const x = queue.shift();
      for (const n of NEI[x]){
        if (b[n] !== ch && b[n] !== '.') continue;
        const cost = b[n] === ch ? 0 : 1;
        if (dist[x] + cost < dist[n]){ dist[n] = dist[x] + cost; queue.push(n); }
      }
    }
    return dist[to];
  }

  function aiMove(){
    if (winner) return;
    const empty = []; for (let i = 0; i < CELLS.length; i++) if (board[i] === '.') empty.push(i);
    if (!empty.length){ winner = "draw"; draw(); return; }
    let best = empty[0], bestScore = -Infinity;
    for (const i of empty){
      board[i] = 'W';
      const won = bfsConnected(board, 'W', AI_ISLANDS[0], AI_ISLANDS[1]);
      if (won){ winner = "ai"; draw(); return; }
      const mine = shortestPathLen(board, 'W', AI_ISLANDS[0], AI_ISLANDS[1]);
      const yours = shortestPathLen(board, 'B', YOUR_ISLANDS[0], YOUR_ISLANDS[1]);
      board[i] = '.';
      const score = -mine + yours * 0.8;
      if (score > bestScore){ bestScore = score; best = i; }
    }
    board[best] = 'W';
    if (bfsConnected(board, 'W', AI_ISLANDS[0], AI_ISLANDS[1])){ winner = "ai"; draw(); return; }
    if (!board.includes('.')){ winner = "draw"; draw(); return; }
    turn = "you"; draw();
  }

  function hexCenter(q, r){
    const s = Math.min(W, size) / 14;
    const cx = W/2, cy = 30 + (size - 30)/2;
    const x = cx + (s * 1.5) * q;
    const y = cy + s * Math.sqrt(3) * (r + q/2);
    return { x, y };
  }
  function drawHex(cx, cy, s){
    ctx.beginPath();
    for (let i = 0; i < 6; i++){ const a = i * Math.PI / 3; const x = cx + s * Math.cos(a), y = cy + s * Math.sin(a); if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); }
    ctx.closePath();
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "13px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";

    for (let i = 0; i < CELLS.length; i++){
      const [q, r] = CELLS[i]; const { x, y } = hexCenter(q, r);
      drawHex(x, y, 20);
      const isYourIsland = YOUR_ISLANDS.includes(i), isAIIsland = AI_ISLANDS.includes(i);
      ctx.fillStyle = board[i] === 'B' ? "#39c" : board[i] === 'W' ? "#e60" : "#fff";
      ctx.fill();
      ctx.strokeStyle = isYourIsland ? "#1a4" : isAIIsland ? "#841" : "#222";
      ctx.lineWidth = (isYourIsland || isAIIsland) ? 3 : 1; ctx.stroke(); ctx.lineWidth = 1;
    }

    if (winner) statusEl.textContent = winner === "draw" ? "draw" : winner === "you" ? "you connected your islands!" : "AI wins";
    else statusEl.textContent = turn === "you" ? "click an empty hex" : "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }

  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e);
    for (let i = 0; i < CELLS.length; i++){
      const [q, r] = CELLS[i]; const c = hexCenter(q, r);
      if (Math.hypot(x - c.x, y - c.y) < 18 && board[i] === '.'){
        board[i] = 'B';
        if (bfsConnected(board, 'B', YOUR_ISLANDS[0], YOUR_ISLANDS[1])){ winner = "you"; draw(); return; }
        if (!board.includes('.')){ winner = "draw"; draw(); return; }
        turn = "ai"; draw(); setTimeout(aiMove, 350); return;
      }
    }
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve() {
      if (winner || turn !== "you") return;
      const __empty = [];
      for (let i = 0; i < CELLS.length; i++) if (board[i] === '.') __empty.push(i);
      if (!__empty.length) { winner = "draw"; draw(); return; }
      const __i = __empty[Math.floor(Math.random() * __empty.length)];
      board[__i] = 'B';
      if (bfsConnected(board, 'B', YOUR_ISLANDS[0], YOUR_ISLANDS[1])) { winner = "you"; draw(); return; }
      if (!board.includes('.')) { winner = "draw"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 80);
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
