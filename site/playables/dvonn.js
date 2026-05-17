// DVONN — simplified stacking game. After fixed initial setup of 23 white + 23
// black + 3 red (DVONN) pieces on a hex board (size 5), players alternate
// moving a stack equal to its height in a straight line, landing on another
// stack and stacking on top. Only stacks topped by your colour are yours. Any
// stack not connected to a DVONN piece is removed. Tallest score wins when
// nobody can move.
// AI: greedy — pick the move that maximises height under our control after
// the removal step.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  function _fit(ctx, t, x, y, maxW){
    let f = parseFloat(ctx.font) || 12;
    while (f > 8 && ctx.measureText(t).width > maxW){ f--; ctx.font = ctx.font.replace(/[\d.]+px/, f + 'px'); }
    ctx.fillText(t, x, y);
  }

  const size = Math.min(canvas.parentElement.clientWidth - 24, 420);
  canvas.width = size;
  canvas.height = size + 30;
  const W = canvas.width, H = canvas.height;
  const statusEl = document.getElementById("playable-status");

  // hex coords (q, r) with |q|, |r|, |q+r| <= S-1 then s=5 ⇒ 61 cells; DVONN
  // typical 49 (3-row by 11). We'll use a rectangular hex band: rows 0..4 each
  // with 11 cells offset — total 49 cells (5*11 - shaved edges? Use plain 5x11 =
  // 55 then drop corners to taste). For minimal-viable we use 5 rows × 9 cols =
  // 45 cells.
  const ROWS = 5, COLS = 9;
  let cells; // [r][c] = { owner, height, dvonn }
  let turn, winner;
  function newGame(){
    cells = Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => ({ owner: '.', height: 0, dvonn: false })));
    // random fill: each cell gets exactly one piece. distribute 3 red, 21 white, 21 black.
    const colours = [];
    for (let i = 0; i < 3; i++) colours.push('R');
    for (let i = 0; i < 21; i++) colours.push('W');
    for (let i = 0; i < 21; i++) colours.push('B');
    while (colours.length < ROWS * COLS) colours.push('.');
    for (let i = colours.length - 1; i > 0; i--){ const j = Math.floor(Math.random()*(i+1)); [colours[i], colours[j]] = [colours[j], colours[i]]; }
    let k = 0;
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++){
      const v = colours[k++];
      if (v === '.') continue;
      cells[r][c] = { owner: v === 'R' ? 'R' : v, height: 1, dvonn: v === 'R' };
    }
    turn = "you"; winner = null;
  }
  newGame();

  // hex directions for offset rows: even-r offset. 6 directions.
  function neighbours(r, c){
    const evenRow = r % 2 === 0;
    const dirs = evenRow
      ? [[0,-1],[0,1],[-1,-1],[-1,0],[1,-1],[1,0]]
      : [[0,-1],[0,1],[-1,0],[-1,1],[1,0],[1,1]];
    return dirs.map(([dr, dc]) => [r+dr, c+dc]).filter(([nr,nc]) => nr>=0 && nr<ROWS && nc>=0 && nc<COLS);
  }

  // straight-line directions: starting from cell (r,c) in one of 6 directions,
  // step h times. Each step uses offset-row-aware neighbour function but
  // maintaining a consistent direction is tricky in offset coords. Approximate:
  // store axial coords mapped from offset; do straight line in axial.
  function offsetToAxial(r, c){ const q = c - Math.floor(r/2); return [q, r]; }
  function axialToOffset(q, r){ const c = q + Math.floor(r/2); return [r, c]; }
  function inBounds(r, c){ return r>=0 && r<ROWS && c>=0 && c<COLS; }
  const AXIAL_DIRS = [[+1,0],[+1,-1],[0,-1],[-1,0],[-1,+1],[0,+1]];

  function legalMovesFor(side){
    const me = side === "you" ? 'B' : 'W';
    const out = [];
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++){
      const cell = cells[r][c]; if (cell.height === 0 || cell.owner !== me) continue;
      // must have at least one empty adjacent (else cannot move per DVONN rule)
      let hasEmpty = false;
      for (const [nr, nc] of neighbours(r, c)) if (cells[nr][nc].height === 0){ hasEmpty = true; break; }
      if (!hasEmpty) continue;
      const [q, rr] = offsetToAxial(r, c);
      for (const [dq, dr] of AXIAL_DIRS){
        const nq = q + dq*cell.height, nrn = rr + dr*cell.height;
        const [or2, oc2] = axialToOffset(nq, nrn);
        if (!inBounds(or2, oc2)) continue;
        if (cells[or2][oc2].height === 0) continue;
        out.push({ from: [r, c], to: [or2, oc2] });
      }
    }
    return out;
  }

  function applyMove(mv){
    const [fr, fc] = mv.from, [tr, tc] = mv.to;
    const moving = cells[fr][fc];
    const target = cells[tr][tc];
    cells[tr][tc] = {
      owner: moving.owner,
      height: moving.height + target.height,
      dvonn: moving.dvonn || target.dvonn,
    };
    cells[fr][fc] = { owner: '.', height: 0, dvonn: false };
    // remove stacks not connected to any DVONN-bearing stack
    const seen = Array.from({ length: ROWS }, () => new Array(COLS).fill(false));
    const stack = [];
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++){
      if (cells[r][c].dvonn && cells[r][c].height > 0){ stack.push([r, c]); seen[r][c] = true; }
    }
    while (stack.length){
      const [r, c] = stack.pop();
      for (const [nr, nc] of neighbours(r, c)){
        if (!seen[nr][nc] && cells[nr][nc].height > 0){ seen[nr][nc] = true; stack.push([nr, nc]); }
      }
    }
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++){
      if (cells[r][c].height > 0 && !seen[r][c]) cells[r][c] = { owner: '.', height: 0, dvonn: false };
    }
  }

  function score(side){
    const me = side === "you" ? 'B' : 'W';
    let s = 0;
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++){
      if (cells[r][c].owner === me) s += cells[r][c].height;
    }
    return s;
  }

  function aiMove(){
    if (winner) return;
    const moves = legalMovesFor("ai");
    if (!moves.length){
      // can ai pass? in DVONN if no moves you pass; check if you also has no moves
      if (!legalMovesFor("you").length){ endGame(); return; }
      turn = "you"; draw(); return;
    }
    let best = moves[0], bestScore = -Infinity;
    for (const mv of moves){
      const snap = JSON.parse(JSON.stringify(cells));
      applyMove(mv);
      const sc = score("ai") - score("you");
      if (sc > bestScore){ bestScore = sc; best = mv; }
      cells = snap;
    }
    applyMove(best);
    if (!legalMovesFor("you").length && !legalMovesFor("ai").length){ endGame(); return; }
    turn = "you"; draw();
  }

  function endGame(){
    const sy = score("you"), sa = score("ai");
    winner = sy > sa ? "you" : sa > sy ? "ai" : "draw";
    draw();
  }

  let sel = null;
  function cellCenter(r, c){
    const margin = 20;
    const cw = (size - 2*margin) / (COLS + 0.5);
    const ch = cw * 0.9;
    const x = margin + cw * (c + (r % 2 === 1 ? 0.5 : 0)) + cw/2;
    const y = 40 + ch * r + ch/2;
    return { x, y, r: cw * 0.45 };
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "12px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";
    _fit(ctx, "DVONN — move stack distance = its height; capture & stack; orphans drop", W/2, 18, W - 8);
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++){
      const cc = cellCenter(r, c);
      ctx.beginPath(); ctx.arc(cc.x, cc.y, cc.r, 0, Math.PI*2);
      ctx.fillStyle = "#fff"; ctx.fill(); ctx.strokeStyle = "#888"; ctx.stroke();
      const cell = cells[r][c]; if (cell.height === 0) continue;
      ctx.beginPath(); ctx.arc(cc.x, cc.y, cc.r * 0.8, 0, Math.PI*2);
      ctx.fillStyle = cell.owner === 'B' ? "#39c" : "#e60";
      if (sel && sel.r === r && sel.c === c) ctx.fillStyle = "#cef2cf";
      ctx.fill(); ctx.strokeStyle = "#222"; ctx.stroke();
      if (cell.dvonn){ ctx.beginPath(); ctx.arc(cc.x, cc.y, cc.r * 0.3, 0, Math.PI*2); ctx.fillStyle = "#c33"; ctx.fill(); }
      if (cell.height > 1){ ctx.fillStyle = cell.dvonn ? "#fff" : "#fff"; ctx.font = "bold 11px sans-serif"; ctx.fillText(String(cell.height), cc.x, cc.y + 4); ctx.font = "12px sans-serif"; }
    }
    if (winner) statusEl.textContent = winner === "draw" ? `draw (${score("you")}-${score("ai")})` : winner === "you" ? `you win ${score("you")}-${score("ai")}` : `AI wins ${score("ai")}-${score("you")}`;
    else statusEl.textContent = turn === "you" ? (sel ? "click target stack" : "click your stack (red-dot = DVONN)") : "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }
  function cellAt(x, y){
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++){
      const cc = cellCenter(r, c);
      if ((x-cc.x)*(x-cc.x) + (y-cc.y)*(y-cc.y) <= cc.r*cc.r) return [r, c];
    }
    return null;
  }
  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e);
    const hit = cellAt(x, y); if (!hit) return;
    const [r, c] = hit;
    if (!sel){
      if (cells[r][c].owner === 'B' && cells[r][c].height > 0){ sel = { r, c }; draw(); }
      return;
    }
    if (sel.r === r && sel.c === c){ sel = null; draw(); return; }
    const moves = legalMovesFor("you");
    const mv = moves.find(m => m.from[0] === sel.r && m.from[1] === sel.c && m.to[0] === r && m.to[1] === c);
    if (!mv){ sel = null; draw(); return; }
    applyMove(mv); sel = null;
    if (!legalMovesFor("ai").length && !legalMovesFor("you").length){ endGame(); return; }
    if (!legalMovesFor("ai").length){ turn = "you"; draw(); return; }
    turn = "ai"; draw(); setTimeout(aiMove, 350);
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve() {
      if (winner || turn !== "you") return;
      const __mvs = legalMovesFor("you");
      if (!__mvs || !__mvs.length) {
        if (!legalMovesFor("ai").length) { endGame(); return; }
        turn = "ai"; draw(); setTimeout(aiMove, 80); return;
      }
      const __mv = __mvs[Math.floor(Math.random() * __mvs.length)];
      applyMove(__mv); sel = null;
      if (!legalMovesFor("ai").length && !legalMovesFor("you").length) { endGame(); return; }
      if (!legalMovesFor("ai").length) { turn = "you"; draw(); return; }
      turn = "ai"; draw();
      setTimeout(aiMove, 80);
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
