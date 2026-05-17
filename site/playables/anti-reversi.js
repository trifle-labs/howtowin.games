// Anti-Reversi — same rules as Othello but FEWER discs wins. AI inverts the
// positional heuristic (corners are bad, mobility is more important to avoid).

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = size + 40;
  const W = canvas.width, H = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) { canvas.style.width = W + 'px'; canvas.style.height = H + 'px'; canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr); }
  const statusEl = document.getElementById("playable-status");

  const N = 8;
  let board, turn, winner;
  function newGame(){
    board = new Array(N*N).fill('.');
    board[3*N+3] = 'w'; board[4*N+4] = 'w'; board[3*N+4] = 'b'; board[4*N+3] = 'b';
    turn = "you"; winner = null;
  }
  newGame();

  const DIRS = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];

  function flipsFor(b, r, c, side){
    const enemy = side === 'b' ? 'w' : 'b';
    const out = [];
    for (const [dr, dc] of DIRS){
      const line = [];
      let nr = r + dr, nc = c + dc;
      while (nr >= 0 && nr < N && nc >= 0 && nc < N && b[nr*N + nc] === enemy){
        line.push(nr*N + nc); nr += dr; nc += dc;
      }
      if (line.length && nr >= 0 && nr < N && nc >= 0 && nc < N && b[nr*N + nc] === side){
        for (const i of line) out.push(i);
      }
    }
    return out;
  }

  function legal(b, side){
    const out = [];
    for (let i = 0; i < N*N; i++) if (b[i] === '.'){
      const f = flipsFor(b, Math.floor(i/N), i%N, side);
      if (f.length) out.push({ i, flips: f });
    }
    return out;
  }

  function apply(b, mv, side){
    const nb = b.slice(); nb[mv.i] = side;
    for (const f of mv.flips) nb[f] = side;
    return nb;
  }

  function aiBest(){
    // Pick the move that flips the FEWEST enemy discs (we want fewer w's).
    const moves = legal(board, 'w'); if (!moves.length) return null;
    let best = moves[0], bv = Infinity;
    for (const mv of moves){
      const flipCount = mv.flips.length;
      // tiebreak: avoid corners
      const r = Math.floor(mv.i/N), c = mv.i%N;
      const corner = (r===0||r===N-1) && (c===0||c===N-1) ? 5 : 0;
      const v = flipCount + corner;
      if (v < bv){ bv = v; best = mv; }
    }
    return best;
  }

  function aiMove(){
    if (winner) return;
    const mv = aiBest();
    if (!mv){
      if (!legal(board, 'b').length){ endGame(); return; }
      turn = "you"; draw(); return;
    }
    board = apply(board, mv, 'w');
    if (!legal(board, 'b').length && !legal(board, 'w').length){ endGame(); return; }
    turn = "you"; draw();
  }

  function endGame(){
    let b = 0, w = 0; for (const v of board){ if (v === 'b') b++; else if (v === 'w') w++; }
    // FEWER wins in anti-reversi
    winner = b < w ? "you" : w < b ? "ai" : "draw";
    draw();
  }

  function cellRect(r, c){
    const margin = 20, cw = (size - 2*margin) / N;
    return { x: margin + c*cw, y: 30 + r*cw, w: cw, h: cw };
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "13px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";
    let b = 0, w = 0; for (const v of board){ if (v === 'b') b++; else if (v === 'w') w++; }
    ctx.fillText(`Anti-Reversi — you ${b}   ai ${w}   (FEWER wins)`, W/2, 18);

    const legalNow = (turn === "you" && !winner) ? legal(board, 'b').map(m => m.i) : [];
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const rc = cellRect(r, c), i = r*N + c;
      ctx.fillStyle = legalNow.includes(i) ? "#cef2cf" : "#3a8049"; ctx.fillRect(rc.x, rc.y, rc.w, rc.h);
      ctx.strokeStyle = "#234"; ctx.strokeRect(rc.x, rc.y, rc.w, rc.h);
      if (board[i] !== '.'){
        ctx.beginPath(); ctx.arc(rc.x + rc.w/2, rc.y + rc.h/2, rc.w*0.4, 0, Math.PI*2);
        ctx.fillStyle = board[i] === 'b' ? "#222" : "#eee"; ctx.fill();
        ctx.strokeStyle = "#444"; ctx.stroke();
      }
    }
    if (winner) statusEl.textContent = winner === "you" ? "you win! (fewer discs)" : winner === "ai" ? "AI wins (fewer discs)" : "draw";
    else statusEl.textContent = turn === "you" ? "click a green-tinted cell — try to LOSE discs" : "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }
  function findCell(x, y){
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const rc = cellRect(r, c);
      if (x >= rc.x && x <= rc.x + rc.w && y >= rc.y && y <= rc.y + rc.h) return r*N + c;
    }
    return -1;
  }

  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e); const i = findCell(x, y); if (i < 0) return;
    const moves = legal(board, 'b'); const mv = moves.find(m => m.i === i); if (!mv) return;
    board = apply(board, mv, 'b');
    if (!legal(board, 'w').length && !legal(board, 'b').length){ endGame(); return; }
    turn = "ai"; draw(); setTimeout(aiMove, 500);
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve() {
      if (winner || turn !== "you") return;
      const __mvs = legal(board, 'b');
      if (!__mvs.length) {
        if (!legal(board, 'w').length) { endGame(); return; }
        turn = "ai"; draw(); setTimeout(aiMove, 80); return;
      }
      const __mv = __mvs[Math.floor(Math.random() * __mvs.length)];
      board = apply(board, __mv, 'b');
      if (!legal(board, 'w').length && !legal(board, 'b').length) { endGame(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 80);
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
