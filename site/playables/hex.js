// Hex — 5×5 board (small enough for a clean demo). You play red (connect top
// to bottom); AI plays blue (connect left to right). Stones don't move; no
// draws are possible. AI is heuristic: block opponent win, else extend own
// connection.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 460);
  canvas.width = size;
  canvas.height = size + 40;
  const W = canvas.width, H = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) {
    const w = canvas.width, h = canvas.height;
    canvas.style.width = w + 'px';    canvas.width = w * dpr; canvas.height = h * dpr; ctx.scale(dpr, dpr);
  }
  const statusEl = document.getElementById("playable-status");

  const N = 5;
  const HEX_R = (size - 80) / (2 * N);
  const HEX_W = HEX_R * Math.sqrt(3);
  const HEX_H = HEX_R * 1.5;
  // axial: cell (r, c). Adjacent to (r-1,c), (r-1,c+1), (r,c-1), (r,c+1), (r+1,c-1), (r+1,c)
  const ADJ = [[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0]];

  let board, turn, winner;
  function newGame(){ board = Array.from({length: N}, () => Array(N).fill(".")); turn = "you"; winner = null; }
  newGame();

  function cellPx(r, c){
    const x0 = 40, y0 = 60;
    const x = x0 + (c + r * 0.5) * HEX_W + HEX_W * 0.5;
    const y = y0 + r * HEX_H + HEX_H * 0.5;
    return { x, y };
  }

  function drawHex(x, y, r, fill, stroke){
    ctx.beginPath();
    for (let i=0; i<6; i++){
      const a = Math.PI / 6 + i * Math.PI / 3;
      const px = x + r * Math.cos(a);
      const py = y + r * Math.sin(a);
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
    if (fill){ ctx.fillStyle = fill; ctx.fill(); }
    if (stroke){ ctx.strokeStyle = stroke; ctx.stroke(); }
  }

  function pickCell(x, y){
    let best = null, bestD = Infinity;
    for (let r=0; r<N; r++) for (let c=0; c<N; c++){
      const p = cellPx(r, c);
      const d = (x-p.x)**2 + (y-p.y)**2;
      if (d < HEX_R*HEX_R && d < bestD){ bestD = d; best = [r, c]; }
    }
    return best;
  }

  function checkWin(sym){
    // BFS from one edge to opposite
    const seen = Array.from({length: N}, () => Array(N).fill(false));
    const q = [];
    if (sym === "R"){
      for (let c=0; c<N; c++) if (board[0][c] === "R"){ q.push([0, c]); seen[0][c] = true; }
    } else {
      for (let r=0; r<N; r++) if (board[r][0] === "B"){ q.push([r, 0]); seen[r][0] = true; }
    }
    while (q.length){
      const [r, c] = q.shift();
      if (sym === "R" && r === N-1) return true;
      if (sym === "B" && c === N-1) return true;
      for (const [dr, dc] of ADJ){
        const nr = r + dr, nc = c + dc;
        if (nr<0||nr>=N||nc<0||nc>=N) continue;
        if (seen[nr][nc] || board[nr][nc] !== sym) continue;
        seen[nr][nc] = true; q.push([nr, nc]);
      }
    }
    return false;
  }

  function legal(){
    const out = [];
    for (let r=0; r<N; r++) for (let c=0; c<N; c++) if (board[r][c] === ".") out.push([r, c]);
    return out;
  }

  // Heuristic for AI: shortest-path completion cost.
  function shortestPathCost(sym){
    // Dijkstra: stone = 0, empty = 1, opponent = ∞. Distance from one edge to opposite.
    const dist = Array.from({length: N}, () => Array(N).fill(Infinity));
    const queue = []; // sorted by dist
    function push(node, d){
      const [r, c] = node;
      if (d < dist[r][c]){ dist[r][c] = d; queue.push([d, r, c]); }
    }
    if (sym === "R"){
      for (let c=0; c<N; c++){
        if (board[0][c] === "B") continue;
        push([0, c], board[0][c] === "R" ? 0 : 1);
      }
    } else {
      for (let r=0; r<N; r++){
        if (board[r][0] === "R") continue;
        push([r, 0], board[r][0] === "B" ? 0 : 1);
      }
    }
    while (queue.length){
      queue.sort((a, b) => a[0] - b[0]);
      const [d, r, c] = queue.shift();
      if (d > dist[r][c]) continue;
      for (const [dr, dc] of ADJ){
        const nr = r + dr, nc = c + dc;
        if (nr<0||nr>=N||nc<0||nc>=N) continue;
        const v = board[nr][nc];
        if (v === (sym === "R" ? "B" : "R")) continue;
        const w = v === sym ? 0 : 1;
        if (d + w < dist[nr][nc]){ dist[nr][nc] = d + w; queue.push([d + w, nr, nc]); }
      }
    }
    let best = Infinity;
    if (sym === "R"){
      for (let c=0; c<N; c++) best = Math.min(best, dist[N-1][c]);
    } else {
      for (let r=0; r<N; r++) best = Math.min(best, dist[r][N-1]);
    }
    return best;
  }

  function bestAIMove(){
    const opts = legal();
    if (!opts.length) return null;
    // Block immediate win first
    for (const [r, c] of opts){
      board[r][c] = "R";
      const wins = checkWin("R");
      board[r][c] = ".";
      if (wins) return [r, c]; // block by playing here
    }
    // Pick cell minimizing AI's path - opponent's path
    let best = opts[0], bestVal = Infinity;
    for (const [r, c] of opts){
      board[r][c] = "B";
      const myCost = shortestPathCost("B");
      const oppCost = shortestPathCost("R");
      board[r][c] = ".";
      const val = myCost - oppCost * 0.9;
      if (val < bestVal){ bestVal = val; best = [r, c]; }
    }
    return best;
  }

  function aiMove(){
    if (winner) return;
    const m = bestAIMove();
    if (!m) return;
    board[m[0]][m[1]] = "B";
    if (checkWin("B")){ winner = "ai"; draw(); return; }
    turn = "you"; draw();
  }

  function draw(){
    ctx.fillStyle="#fafaf7"; ctx.fillRect(0,0,size,H);
    ctx.font="13px sans-serif"; ctx.textAlign="center"; ctx.fillStyle="#444";
    ctx.fillText(`Hex 5×5 — you = Red (top↔bottom); AI = Blue (left↔right)`, size/2, 22);
    for (let r=0; r<N; r++) for (let c=0; c<N; c++){
      const p = cellPx(r, c);
      const v = board[r][c];
      const fill = v === "R" ? "#e74c3c" : v === "B" ? "#2980b9" : "#fff";
      drawHex(p.x, p.y, HEX_R, fill, "#444");
    }
    if (winner) statusEl.textContent = winner === "you" ? "you win — connected top to bottom!" : "AI wins — connected left to right!";
    else statusEl.textContent = turn === "you" ? "click an empty cell to place red" : "AI thinking…";
  }

  function clickPos(e){ const r=canvas.getBoundingClientRect(); return {x:(e.clientX-r.left)*(size/r.width), y:(e.clientY-r.top)*(H/r.height)}; }

  function onClick(e){
    if (winner || turn !== "you") return;
    const {x,y} = clickPos(e);
    const cell = pickCell(x, y);
    if (!cell) return;
    const [r, c] = cell;
    if (board[r][c] !== ".") return;
    board[r][c] = "R";
    if (checkWin("R")){ winner = "you"; draw(); return; }
    turn = "ai"; draw(); setTimeout(aiMove, 400);
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0,0,size,H); },
    restart(){ newGame(); draw(); },
    solve(){
      if (winner || turn !== "you") return;
      // Heuristic: pick cell minimizing own path
      const opts = legal();
      if (!opts.length) return;
      let best = opts[0], bestVal = Infinity;
      for (const [r, c] of opts){
        board[r][c] = "R";
        const myCost = shortestPathCost("R");
        const oppCost = shortestPathCost("B");
        board[r][c] = ".";
        const val = myCost - oppCost * 0.9;
        if (val < bestVal){ bestVal = val; best = [r, c]; }
      }
      board[best[0]][best[1]] = "R";
      if (checkWin("R")){ winner = "you"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 400);
    },
  };
}
