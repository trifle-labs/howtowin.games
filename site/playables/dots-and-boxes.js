// Dots and Boxes — 4×4 grid of dots (3×3 boxes). On a turn, draw one missing
// edge between adjacent dots. Completing a box claims it and grants another
// turn. Most boxes wins. AI: simple safe-move avoidance (don't give the
// opponent a 3-sided box if possible).

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = size + 40;
  const W = canvas.width, H = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) { canvas.style.width = W + 'px'; canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr); }
  const statusEl = document.getElementById("playable-status");

  const N = 4; // 4×4 dots → 3×3 boxes
  // edges: hEdges[r][c] for r in 0..N-1, c in 0..N-2; vEdges[r][c] for r in 0..N-2, c in 0..N-1
  let hEdges, vEdges, owners, turn, winner;
  function newGame(){
    hEdges = Array.from({length: N}, () => new Array(N-1).fill('.'));
    vEdges = Array.from({length: N-1}, () => new Array(N).fill('.'));
    owners = Array.from({length: N-1}, () => new Array(N-1).fill('.'));
    turn = "you"; winner = null;
  }
  newGame();

  function boxEdges(r, c){
    return [
      ['h', r, c],     // top
      ['h', r+1, c],   // bottom
      ['v', r, c],     // left
      ['v', r, c+1],   // right
    ];
  }
  function edgeCount(r, c){
    let n = 0;
    for (const [t, rr, cc] of boxEdges(r, c)){
      if ((t === 'h' ? hEdges[rr][cc] : vEdges[rr][cc]) !== '.') n++;
    }
    return n;
  }

  function applyEdge(type, r, c, side){
    if (type === 'h') hEdges[r][c] = side; else vEdges[r][c] = side;
    let claimed = 0;
    for (let br = 0; br < N-1; br++) for (let bc = 0; bc < N-1; bc++){
      if (owners[br][bc] === '.' && edgeCount(br, bc) === 4){
        owners[br][bc] = side; claimed++;
      }
    }
    return claimed;
  }

  function legalEdges(){
    const out = [];
    for (let r = 0; r < N; r++) for (let c = 0; c < N-1; c++) if (hEdges[r][c] === '.') out.push(['h', r, c]);
    for (let r = 0; r < N-1; r++) for (let c = 0; c < N; c++) if (vEdges[r][c] === '.') out.push(['v', r, c]);
    return out;
  }

  function isFull(){
    for (let r = 0; r < N-1; r++) for (let c = 0; c < N-1; c++) if (owners[r][c] === '.') return false;
    return true;
  }

  function countScores(){
    let b = 0, w = 0;
    for (let r = 0; r < N-1; r++) for (let c = 0; c < N-1; c++){
      if (owners[r][c] === 'b') b++; else if (owners[r][c] === 'w') w++;
    }
    return { b, w };
  }

  function endIfDone(){
    if (!isFull()) return false;
    const { b, w } = countScores();
    winner = b > w ? "you" : w > b ? "ai" : "draw";
    return true;
  }

  function wouldGive3(type, r, c){
    // simulate placement and see if any adjacent box ends up at 3
    if (type === 'h') hEdges[r][c] = 'x'; else vEdges[r][c] = 'x';
    let bad = false;
    const checks = [];
    if (type === 'h'){ if (r > 0) checks.push([r-1, c]); if (r < N-1) checks.push([r, c]); }
    else { if (c > 0) checks.push([r, c-1]); if (c < N-1) checks.push([r, c]); }
    for (const [br, bc] of checks) if (owners[br][bc] === '.' && edgeCount(br, bc) === 3){ bad = true; break; }
    if (type === 'h') hEdges[r][c] = '.'; else vEdges[r][c] = '.';
    return bad;
  }

  function wouldComplete(type, r, c){
    if (type === 'h') hEdges[r][c] = 'x'; else vEdges[r][c] = 'x';
    let any = false;
    const checks = [];
    if (type === 'h'){ if (r > 0) checks.push([r-1, c]); if (r < N-1) checks.push([r, c]); }
    else { if (c > 0) checks.push([r, c-1]); if (c < N-1) checks.push([r, c]); }
    for (const [br, bc] of checks) if (owners[br][bc] === '.' && edgeCount(br, bc) === 4){ any = true; break; }
    if (type === 'h') hEdges[r][c] = '.'; else vEdges[r][c] = '.';
    return any;
  }

  function aiPickEdge(){
    const moves = legalEdges();
    // 1) completing a box
    for (const m of moves) if (wouldComplete(m[0], m[1], m[2])) return m;
    // 2) safe moves (don't give a 3rd edge)
    const safe = moves.filter(m => !wouldGive3(m[0], m[1], m[2]));
    if (safe.length) return safe[Math.floor(Math.random() * safe.length)];
    // 3) forced — pick the smallest chain (heuristic: just pick first)
    return moves[0];
  }

  function aiMove(){
    if (winner) return;
    const m = aiPickEdge(); if (!m){ endIfDone(); draw(); return; }
    const got = applyEdge(m[0], m[1], m[2], 'w');
    if (endIfDone()){ draw(); return; }
    draw();
    if (got > 0){ setTimeout(aiMove, 400); return; }
    turn = "you"; draw();
  }

  function dotPos(r, c){
    const margin = 30, cs = (size - 2*margin) / (N - 1);
    return { x: margin + c*cs, y: 40 + r*cs };
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "13px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";
    const { b, w } = countScores();
    ctx.fillText(`Dots and Boxes — you ${b}   ai ${w}`, W/2, 22);

    // owned boxes
    for (let r = 0; r < N-1; r++) for (let c = 0; c < N-1; c++){
      if (owners[r][c] === '.') continue;
      const p1 = dotPos(r, c), p2 = dotPos(r+1, c+1);
      ctx.fillStyle = owners[r][c] === 'b' ? "#bcd9f0" : "#f4cfb4";
      ctx.fillRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);
      ctx.fillStyle = "#444"; ctx.font = "16px sans-serif";
      ctx.fillText(owners[r][c] === 'b' ? "you" : "ai", (p1.x + p2.x)/2, (p1.y + p2.y)/2 + 5);
    }

    // edges
    ctx.lineWidth = 4;
    for (let r = 0; r < N; r++) for (let c = 0; c < N-1; c++){
      const v = hEdges[r][c]; const p1 = dotPos(r, c), p2 = dotPos(r, c+1);
      ctx.strokeStyle = v === '.' ? "#eee" : v === 'b' ? "#39c" : "#e60";
      ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
    }
    for (let r = 0; r < N-1; r++) for (let c = 0; c < N; c++){
      const v = vEdges[r][c]; const p1 = dotPos(r, c), p2 = dotPos(r+1, c);
      ctx.strokeStyle = v === '.' ? "#eee" : v === 'b' ? "#39c" : "#e60";
      ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
    }
    ctx.lineWidth = 1;

    // dots
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const p = dotPos(r, c);
      ctx.beginPath(); ctx.arc(p.x, p.y, 5, 0, Math.PI*2);
      ctx.fillStyle = "#222"; ctx.fill();
    }

    if (winner) statusEl.textContent = winner === "you" ? "you win!" : winner === "ai" ? "AI wins" : "draw";
    else statusEl.textContent = turn === "you" ? "click between two dots to draw an edge" : "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }
  function findEdge(x, y){
    // pick the nearest edge midpoint within ~15px
    let best = null, bd = 15;
    for (let r = 0; r < N; r++) for (let c = 0; c < N-1; c++){
      if (hEdges[r][c] !== '.') continue;
      const p1 = dotPos(r, c), p2 = dotPos(r, c+1);
      const mx = (p1.x + p2.x)/2, my = (p1.y + p2.y)/2;
      const d = Math.hypot(x - mx, y - my);
      if (d < bd){ bd = d; best = ['h', r, c]; }
    }
    for (let r = 0; r < N-1; r++) for (let c = 0; c < N; c++){
      if (vEdges[r][c] !== '.') continue;
      const p1 = dotPos(r, c), p2 = dotPos(r+1, c);
      const mx = (p1.x + p2.x)/2, my = (p1.y + p2.y)/2;
      const d = Math.hypot(x - mx, y - my);
      if (d < bd){ bd = d; best = ['v', r, c]; }
    }
    return best;
  }

  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e); const ed = findEdge(x, y); if (!ed) return;
    const got = applyEdge(ed[0], ed[1], ed[2], 'b');
    if (endIfDone()){ draw(); return; }
    if (got > 0){ draw(); return; } // bonus turn
    turn = "ai"; draw(); setTimeout(aiMove, 500);
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve() {
      if (winner || turn !== "you") return;
      // keep drawing edges while still your turn (box completions give bonus turns)
      while (turn === "you" && !winner) {
        const __mvs = legalEdges();
        if (!__mvs.length) { endIfDone(); draw(); return; }
        const __mv = __mvs[Math.floor(Math.random() * __mvs.length)];
        const __got = applyEdge(__mv[0], __mv[1], __mv[2], 'b');
        if (endIfDone()) { draw(); return; }
        if (__got === 0) { turn = "ai"; break; }
      }
      draw();
      if (!winner && turn === "ai") setTimeout(aiMove, 80);
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
