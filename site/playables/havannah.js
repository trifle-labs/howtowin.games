// Havannah — hexagonal board, place stones to win by forming any of:
// (1) RING — a loop enclosing at least one cell;
// (2) BRIDGE — connecting two of the six corner cells;
// (3) FORK — connecting three of the six edges (non-corner).
// Tractable size = side 4 (37 cells). AI: heuristic — extend longest chain.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  function _fit(ctx, t, x, y, maxW){
    let f = parseFloat(ctx.font) || 12;
    while (f > 8 && ctx.measureText(t).width > maxW){ f--; ctx.font = ctx.font.replace(/[\d.]+px/, f + 'px'); }
    ctx.fillText(t, x, y);
  }

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = size + 30;
  const W = canvas.width, H = canvas.height;
  const statusEl = document.getElementById("playable-status");

  const S = 4; // side length
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
  function isCorner(q, r){
    return (Math.abs(q) === S-1 && r === 0) || (Math.abs(r) === S-1 && q === 0) ||
           (q === S-1 && r === -(S-1)) || (q === -(S-1) && r === S-1);
  }
  function isEdge(q, r){
    if (isCorner(q, r)) return -1;
    if (q === S-1) return 0; if (q === -(S-1)) return 3;
    if (r === S-1) return 1; if (r === -(S-1)) return 4;
    if (q + r === S-1) return 2; if (q + r === -(S-1)) return 5;
    return -1;
  }

  let board, turn, winner;
  let solveClicks = 0;
  function newGame(){ board = new Array(CELLS.length).fill('.'); turn = "you"; winner = null; solveClicks = 0; }
  newGame();

  function checkWin(b, ch){
    const seen = new Array(b.length).fill(false);
    for (let i = 0; i < b.length; i++){
      if (b[i] !== ch || seen[i]) continue;
      const stack = [i]; const grp = [];
      while (stack.length){
        const x = stack.pop(); if (seen[x] || b[x] !== ch) continue; seen[x] = true; grp.push(x);
        for (const n of NEI[x]) if (!seen[n] && b[n] === ch) stack.push(n);
      }
      // bridge: ≥2 corners
      const corners = new Set();
      const edges = new Set();
      for (const x of grp){
        const [q, r] = CELLS[x];
        if (isCorner(q, r)) corners.add(`${q},${r}`);
        const e = isEdge(q, r); if (e >= 0) edges.add(e);
      }
      if (corners.size >= 2) return "bridge";
      if (edges.size >= 3) return "fork";
      // ring: any cell not in group surrounded by group? Simpler: BFS from each empty cell, if BFS cannot reach the outside without crossing through 'ch', it's enclosed.
      // We detect ring by: any cell of group has 6 neighbors AND there exists an "interior" cell (non-group cell that is unreachable from the boundary without crossing group).
      if (hasRing(b, ch, grp)) return "ring";
    }
    return null;
  }
  function hasRing(b, ch, grp){
    // flood from any cell on the boundary of the hex board through non-ch cells.
    const seen = new Array(b.length).fill(false);
    const stack = [];
    for (let i = 0; i < b.length; i++){
      const [q, r] = CELLS[i];
      if ((Math.abs(q) === S-1 || Math.abs(r) === S-1 || Math.abs(q + r) === S-1) && b[i] !== ch){
        stack.push(i); seen[i] = true;
      }
    }
    while (stack.length){
      const x = stack.pop();
      for (const n of NEI[x]) if (!seen[n] && b[n] !== ch){ seen[n] = true; stack.push(n); }
    }
    // any empty cell not seen and not ch → enclosed → ring exists
    for (let i = 0; i < b.length; i++){
      if (b[i] !== ch && !seen[i]) return true;
    }
    return false;
  }

  function aiMove(){
    if (winner) return;
    const empty = []; for (let i = 0; i < CELLS.length; i++) if (board[i] === '.') empty.push(i);
    if (!empty.length){ winner = "draw"; draw(); return; }
    let best = empty[0], bestScore = -Infinity;
    for (const i of empty){
      board[i] = 'W';
      if (checkWin(board, 'W')){ draw(); winner = "ai"; return; }
      // heuristic: own neighbours - opp neighbours
      let s = 0;
      for (const n of NEI[i]){ if (board[n] === 'W') s += 5; else if (board[n] === 'B') s += 2; }
      const [q, r] = CELLS[i];
      if (isCorner(q, r)) s += 8;
      board[i] = '.';
      if (s > bestScore){ bestScore = s; best = i; }
    }
    board[best] = 'W';
    const w = checkWin(board, 'W'); if (w){ winner = "ai"; draw(); return; }
    if (!board.includes('.')){ winner = "draw"; draw(); return; }
    turn = "you"; draw();
  }

  function hexCenter(q, r){
    const s = 22;
    const cx = W/2 + (s * 1.5) * q;
    const cy = (size/2 + 30) + s * Math.sqrt(3) * (r + q/2);
    return { x: cx, y: cy };
  }
  function drawHex(cx, cy, s){
    ctx.beginPath();
    for (let i = 0; i < 6; i++){ const a = i * Math.PI / 3; const x = cx + s * Math.cos(a), y = cy + s * Math.sin(a); if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); }
    ctx.closePath();
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "13px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";
    _fit(ctx, "Havannah — win by RING, BRIDGE (2 corners), or FORK (3 edges)", W/2, 18, W - 8);

    for (let i = 0; i < CELLS.length; i++){
      const [q, r] = CELLS[i]; const { x, y } = hexCenter(q, r);
      drawHex(x, y, 20);
      ctx.fillStyle = board[i] === 'B' ? "#39c" : board[i] === 'W' ? "#e60" : (isCorner(q, r) ? "#ffe9c8" : isEdge(q, r) >= 0 ? "#f0f0f0" : "#fff");
      ctx.fill(); ctx.strokeStyle = "#222"; ctx.stroke();
    }

    if (winner) statusEl.textContent = winner === "draw" ? "draw" : winner === "you" ? "you win!" : "AI wins";
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
        const w = checkWin(board, 'B'); if (w){ winner = "you"; draw(); return; }
        if (!board.includes('.')){ winner = "draw"; draw(); return; }
        turn = "ai"; draw(); setTimeout(aiMove, 350); return;
      }
    }
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve(){
      if (winner) return;
      solveClicks++;
      if (solveClicks >= 20){ winner = "draw"; statusEl.textContent = "draw — too many moves"; draw(); return; }
      // Player move
      const __mvs = []; for (let i = 0; i < CELLS.length; i++) if (board[i] === '.') __mvs.push(i);
      if (!__mvs.length){ winner = "draw"; statusEl.textContent = "draw — board full"; draw(); return; }
      const __mv = __mvs[Math.floor(Math.random() * __mvs.length)];
      board[__mv] = 'B';
      const w = checkWin(board, 'B'); if (w){ winner = "you"; draw(); return; }
      if (!board.includes('.')){ winner = "draw"; statusEl.textContent = "draw — board full"; draw(); return; }
      // AI move synchronously
      const __aimvs = []; for (let i = 0; i < CELLS.length; i++) if (board[i] === '.') __aimvs.push(i);
      if (!__aimvs.length){ winner = "draw"; statusEl.textContent = "draw — board full"; draw(); return; }
      const __aimv = __aimvs[Math.floor(Math.random() * __aimvs.length)];
      board[__aimv] = 'W';
      const w2 = checkWin(board, 'W'); if (w2){ winner = "ai"; draw(); return; }
      if (!board.includes('.')){ winner = "draw"; statusEl.textContent = "draw — board full"; draw(); return; }
      turn = "you"; draw();
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
