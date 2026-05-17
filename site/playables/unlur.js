// Unlur — asymmetric hex connection game. WHITE wins by connecting two
// designated non-adjacent edges. BLACK wins by connecting THREE of the six
// edges. We omit the bidding phase: you (B) try the BLACK connect-3-edges
// win on side-4 hex. AI (W) tries the WHITE connect-2-edges win.
// AI: 1-ply heuristic — pick cell minimizing your shortest-path between
// your two edges and maximizing the cost for opponent (similar to Atoll).

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 400);
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
  function neighbours(q, r){
    return [[q+1,r],[q-1,r],[q,r+1],[q,r-1],[q+1,r-1],[q-1,r+1]].filter(([a,b]) => Math.abs(a) <= S-1 && Math.abs(b) <= S-1 && Math.abs(a+b) <= S-1);
  }
  // 6 edges of the hex
  function edgesOf(q, r){
    const out = [];
    if (q === S-1) out.push(0);
    if (q === -(S-1)) out.push(3);
    if (r === S-1) out.push(1);
    if (r === -(S-1)) out.push(4);
    if (q + r === S-1) out.push(2);
    if (q + r === -(S-1)) out.push(5);
    return out;
  }
  // WHITE goal: connect edges 0 and 3 (opposite).
  // BLACK goal: connect any 3 of the 6 edges (touch 3 distinct edges with one group).

  let board, turn, winner;
  function newGame(){
    board = {}; for (const [q, r] of cells) board[key(q,r)] = '.';
    turn = "you"; winner = null;
  }
  newGame();

  function groupsTouchingEdges(ch){
    const seen = new Set();
    const groups = [];
    for (const [q, r] of cells){
      const k = key(q, r); if (seen.has(k) || board[k] !== ch) continue;
      const stack = [[q, r]]; seen.add(k);
      const edges = new Set();
      while (stack.length){
        const [a, b] = stack.pop();
        for (const e of edgesOf(a, b)) edges.add(e);
        for (const [na, nb] of neighbours(a, b)){
          const k2 = key(na, nb); if (seen.has(k2) || board[k2] !== ch) continue;
          seen.add(k2); stack.push([na, nb]);
        }
      }
      groups.push(edges);
    }
    return groups;
  }

  function checkWin(ch, goal){
    const gs = groupsTouchingEdges(ch);
    for (const g of gs){
      if (ch === 'W' && g.has(0) && g.has(3)) return true;
      if (ch === 'B' && g.size >= 3) return true;
    }
    return false;
  }

  function aiMove(){
    if (winner) return;
    let best = null, bestScore = -Infinity;
    for (const [q, r] of cells){
      const k = key(q, r); if (board[k] !== '.') continue;
      board[k] = 'W';
      if (checkWin('W')){ board[k] = '.'; board[k] = 'W'; winner = "ai"; draw(); return; }
      let s = 0;
      const gs = groupsTouchingEdges('W');
      // bonus for any group hitting edge 0 or edge 3
      for (const g of gs){
        if (g.has(0)) s += 5;
        if (g.has(3)) s += 5;
        s += g.size;
      }
      board[k] = '.';
      if (s > bestScore){ bestScore = s; best = [q, r]; }
    }
    if (!best){ winner = "draw"; draw(); return; }
    board[key(best[0], best[1])] = 'W';
    if (checkWin('W')){ winner = "ai"; draw(); return; }
    turn = "you"; draw();
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
      const es = edgesOf(q, r);
      let bg = "#fff";
      if (es.includes(0) || es.includes(3)) bg = "#ffe0e0"; // AI's edges
      ctx.fillStyle = bg; ctx.fill(); ctx.strokeStyle = "#888"; ctx.stroke();
      const v = board[key(q,r)]; if (v === '.') continue;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.s * 0.65, 0, Math.PI*2);
      ctx.fillStyle = v === 'B' ? "#39c" : "#e60";
      ctx.fill(); ctx.strokeStyle = "#222"; ctx.stroke();
    }
    if (winner) statusEl.textContent = winner === "draw" ? "draw" : winner === "you" ? "you (3 edges) win!" : "AI (2 opposite edges) wins";
    else statusEl.textContent = turn === "you" ? "click an empty hex" : "AI thinking…";
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
    if (board[key(q,r)] !== '.') return;
    board[key(q,r)] = 'B';
    if (checkWin('B')){ winner = "you"; draw(); return; }
    turn = "ai"; draw(); setTimeout(aiMove, 350);
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve(){
      if (winner || turn !== "you") return;
      const __mvs = cells.filter(([q, r]) => board[key(q, r)] === '.');
      if (!__mvs.length){ winner = "ai"; draw(); return; }
      const [q, r] = __mvs[Math.floor(Math.random() * __mvs.length)];
      board[key(q, r)] = 'B';
      if (checkWin('B')){ winner = "you"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 80);
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
