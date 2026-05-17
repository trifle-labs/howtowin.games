// Catchup — small hexagonal placement game by Nick Bentley. On each turn place
// stones equal to the largest current group (any colour), or 1 on first move.
// Largest connected group at game end wins. Here a small hex board (side 3,
// 19 cells) for a quick game. AI: heuristic — extend own largest group while
// avoiding handing the opponent a big placement budget.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  function _fit(ctx, t, x, y, maxW){
    let f = parseFloat(ctx.font) || 12;
    while (f > 8 && ctx.measureText(t).width > maxW){ f--; ctx.font = ctx.font.replace(/[\d.]+px/, f + 'px'); }
    ctx.fillText(t, x, y);
  }

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = size + 40;
  const W = canvas.width, H = canvas.height;
  const statusEl = document.getElementById("playable-status");

  // Hex board side 3 — axial coords (q, r) with |q|, |r|, |q+r| <= 2 → 19 cells.
  const CELLS = [];
  for (let q = -2; q <= 2; q++) for (let r = -2; r <= 2; r++){
    if (Math.abs(q + r) <= 2) CELLS.push([q, r]);
  }
  const idx = (q, r) => CELLS.findIndex(c => c[0] === q && c[1] === r);
  const NEI = CELLS.map(([q, r]) => {
    const out = [];
    for (const [dq, dr] of [[1,0],[-1,0],[0,1],[0,-1],[1,-1],[-1,1]]){
      const i = idx(q + dq, r + dr); if (i >= 0) out.push(i);
    }
    return out;
  });

  let board, turn, winner, toPlace;
  function newGame(){
    board = new Array(CELLS.length).fill('.');
    turn = "you"; winner = null; toPlace = 1;
  }
  newGame();

  function groups(b){
    const seen = new Array(b.length).fill(false);
    const out = [];
    for (let i = 0; i < b.length; i++){
      if (seen[i] || b[i] === '.') continue;
      const c = b[i]; const stack = [i]; const grp = [];
      while (stack.length){
        const x = stack.pop(); if (seen[x] || b[x] !== c) continue; seen[x] = true; grp.push(x);
        for (const n of NEI[x]) if (!seen[n] && b[n] === c) stack.push(n);
      }
      out.push({ color: c, size: grp.length });
    }
    return out;
  }
  function largestGroupSize(b){ const g = groups(b); return g.reduce((m, x) => Math.max(m, x.size), 0); }
  function largestOfColor(b, c){ const g = groups(b); return g.filter(x => x.color === c).reduce((m, x) => Math.max(m, x.size), 0); }
  function emptyCells(b){ const out = []; for (let i = 0; i < b.length; i++) if (b[i] === '.') out.push(i); return out; }

  function aiPickOne(c){
    // place a stone of color c that maximises our largest group while minimising
    // the next placement budget (= largest group after move).
    const empty = emptyCells(board);
    let best = empty[0]; let bestScore = -Infinity;
    for (const i of empty){
      board[i] = c;
      const myMax = largestOfColor(board, c);
      const overall = largestGroupSize(board);
      // prefer larger own group; penalise giving opponent a huge budget if it's not yours
      const score = myMax * 3 - overall;
      if (score > bestScore){ bestScore = score; best = i; }
      board[i] = '.';
    }
    return best;
  }

  function aiTurn(){
    if (winner) return;
    if (!emptyCells(board).length){ finishGame(); return; }
    for (let k = 0; k < toPlace && emptyCells(board).length; k++){
      const i = aiPickOne('w'); board[i] = 'w';
    }
    if (!emptyCells(board).length){ finishGame(); return; }
    toPlace = Math.min(largestGroupSize(board), emptyCells(board).length);
    turn = "you"; draw();
  }

  function finishGame(){
    const youMax = largestOfColor(board, 'b');
    const aiMax = largestOfColor(board, 'w');
    if (youMax > aiMax) winner = "you";
    else if (aiMax > youMax) winner = "ai";
    else winner = "draw";
    draw();
  }

  let placedThisTurn = 0;
  function hexCenter(q, r){
    const s = 26;
    const cx = W/2 + (s * 1.5) * q;
    const cy = (size/2 + 30) + s * Math.sqrt(3) * (r + q/2);
    return { x: cx, y: cy };
  }
  function drawHex(cx, cy, s){
    ctx.beginPath();
    for (let i = 0; i < 6; i++){
      const a = i * Math.PI / 3; const x = cx + s * Math.cos(a), y = cy + s * Math.sin(a);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "13px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";
    _fit(ctx, "Catchup — place stones, biggest group wins", W/2, 18, W - 8);

    const youMax = largestOfColor(board, 'b'), aiMax = largestOfColor(board, 'w');
    ctx.fillText(`you (blue) ${youMax} : ${aiMax} AI (orange) — to place: ${turn === 'you' ? toPlace - placedThisTurn : toPlace}`, W/2, H - 6);

    for (let i = 0; i < CELLS.length; i++){
      const [q, r] = CELLS[i]; const { x, y } = hexCenter(q, r);
      drawHex(x, y, 24);
      ctx.fillStyle = board[i] === 'b' ? "#39c" : board[i] === 'w' ? "#e60" : "#fff";
      ctx.fill();
      ctx.strokeStyle = "#222"; ctx.stroke();
    }

    if (winner) statusEl.textContent = winner === "draw" ? "draw" : winner === "you" ? "you win!" : "AI wins";
    else statusEl.textContent = turn === "you" ? `click empty hexes — place ${toPlace - placedThisTurn} more` : "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }

  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e);
    for (let i = 0; i < CELLS.length; i++){
      const [q, r] = CELLS[i]; const c = hexCenter(q, r);
      if (Math.hypot(x - c.x, y - c.y) < 22 && board[i] === '.'){
        board[i] = 'b'; placedThisTurn++;
        if (placedThisTurn >= toPlace || !emptyCells(board).length){
          placedThisTurn = 0;
          if (!emptyCells(board).length){ finishGame(); return; }
          toPlace = Math.min(largestGroupSize(board), emptyCells(board).length);
          turn = "ai"; draw(); setTimeout(aiTurn, 400);
          return;
        }
        draw(); return;
      }
    }
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve() {
      if (winner || turn !== "you") return;
      const __need = toPlace - placedThisTurn;
      for (let __k = 0; __k < __need; __k++) {
        const __empty = emptyCells(board);
        if (!__empty.length) { finishGame(); return; }
        const __i = __empty[Math.floor(Math.random() * __empty.length)];
        board[__i] = 'b'; placedThisTurn++;
      }
      placedThisTurn = 0;
      if (!emptyCells(board).length) { finishGame(); return; }
      toPlace = Math.min(largestGroupSize(board), emptyCells(board).length);
      turn = "ai"; draw();
      setTimeout(aiTurn, 80);
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); placedThisTurn = 0; draw(); },
  };
}
