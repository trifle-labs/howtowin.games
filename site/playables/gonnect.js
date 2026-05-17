// Gonnect — 9×9 Go board. Place stones (any empty cell) — stones with NO
// liberties are captured (removed) like Go. Pass is allowed; suicide is
// forbidden. Win by either (a) connecting your two opposite sides, OR
// (b) capturing at least one enemy stone.
// You (black) connect top↔bottom; AI (white) connects left↔right.

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = size + 30;
  const W = canvas.width, H = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) { canvas.style.width = W + 'px'; canvas.style.height = H + 'px'; canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr); }
  const statusEl = document.getElementById("playable-status");

  const N = 9;
  let board, turn, winner, captureFlag;
  function newGame(){ board = new Array(N*N).fill('.'); turn = "you"; winner = null; captureFlag = { b: false, w: false }; }
  newGame();

  function neighbours(i){
    const r = Math.floor(i / N), c = i % N;
    const out = [];
    for (const [dr, dc] of [[1,0],[-1,0],[0,1],[0,-1]]){
      const nr = r+dr, nc = c+dc;
      if (nr >= 0 && nr < N && nc >= 0 && nc < N) out.push(nr*N + nc);
    }
    return out;
  }

  function group(b, i){
    const side = b[i]; if (side === '.') return null;
    const stones = new Set([i]); const liberties = new Set();
    const stack = [i];
    while (stack.length){
      const j = stack.pop();
      for (const n of neighbours(j)){
        if (b[n] === '.') liberties.add(n);
        else if (b[n] === side && !stones.has(n)){ stones.add(n); stack.push(n); }
      }
    }
    return { stones, liberties };
  }

  function applyMove(b, i, side){
    const enemy = side === 'b' ? 'w' : 'b';
    b[i] = side;
    let captured = 0;
    for (const n of neighbours(i)){
      if (b[n] === enemy){
        const g = group(b, n);
        if (g.liberties.size === 0){
          for (const s of g.stones){ b[s] = '.'; captured++; }
        }
      }
    }
    const myGroup = group(b, i);
    if (myGroup.liberties.size === 0){
      // suicide
      b[i] = '.';
      return { ok: false, captured: 0 };
    }
    return { ok: true, captured };
  }

  function connected(b, side){
    const seen = new Set(); const stack = [];
    if (side === 'b'){
      for (let c = 0; c < N; c++) if (b[c] === 'b'){ seen.add(c); stack.push(c); }
    } else {
      for (let r = 0; r < N; r++) if (b[r*N] === 'w'){ seen.add(r*N); stack.push(r*N); }
    }
    while (stack.length){
      const i = stack.pop();
      const r = Math.floor(i / N), c = i % N;
      if (side === 'b' && r === N-1) return true;
      if (side === 'w' && c === N-1) return true;
      for (const n of neighbours(i)){
        if (b[n] !== side) continue;
        if (!seen.has(n)){ seen.add(n); stack.push(n); }
      }
    }
    return false;
  }

  function aiMove(){
    if (winner) return;
    const empty = []; for (let i = 0; i < N*N; i++) if (board[i] === '.') empty.push(i);
    // try winning move (capture or connection)
    for (const i of empty){
      const snap = board.slice();
      const res = applyMove(board, i, 'w');
      if (!res.ok){ board.splice(0, board.length, ...snap); continue; }
      if (res.captured > 0 || connected(board, 'w')){ if (res.captured > 0) captureFlag.w = true; if (captureFlag.w || connected(board, 'w')){ winner = "ai"; draw(); return; } }
      // revert and consider this candidate score; choose highest captures
      board.splice(0, board.length, ...snap);
    }
    // pick a heuristically good move: near center
    let best = empty[0], bv = Infinity;
    for (const i of empty){
      const r = Math.floor(i / N), c = i % N;
      const v = Math.abs(c - (N-1)/2) + Math.abs(r - (N-1)/2);
      if (v < bv){ bv = v; best = i; }
    }
    const snap = board.slice();
    const res = applyMove(board, best, 'w');
    if (!res.ok){ board.splice(0, board.length, ...snap); winner = "you"; draw(); return; }
    if (res.captured > 0) captureFlag.w = true;
    if (captureFlag.w || connected(board, 'w')){ winner = "ai"; draw(); return; }
    turn = "you"; draw();
  }

  function cellPos(r, c){
    const margin = 14, cs = (size - 2*margin) / (N - 1);
    return { x: margin + c*cs, y: 18 + r*cs, cs };
  }

  function draw(){
    ctx.fillStyle = "#f5e0b8"; ctx.fillRect(0, 0, W, H);

    const cs = cellPos(0, 1).x - cellPos(0, 0).x;
    ctx.strokeStyle = "#822"; ctx.lineWidth = 1;
    for (let i = 0; i < N; i++){
      const p1 = cellPos(0, i), p2 = cellPos(N-1, i);
      ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
      const q1 = cellPos(i, 0), q2 = cellPos(i, N-1);
      ctx.beginPath(); ctx.moveTo(q1.x, q1.y); ctx.lineTo(q2.x, q2.y); ctx.stroke();
    }
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const v = board[r*N + c]; if (v === '.') continue;
      const p = cellPos(r, c);
      ctx.beginPath(); ctx.arc(p.x, p.y, cs*0.42, 0, Math.PI*2);
      ctx.fillStyle = v === 'b' ? "#222" : "#eee"; ctx.fill();
      ctx.strokeStyle = "#444"; ctx.stroke();
    }

    if (winner) statusEl.textContent = winner === "you" ? "you win!" : "AI wins";
    else statusEl.textContent = turn === "you" ? "click an empty intersection to play (no suicide)" : "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }
  function findCell(x, y){
    const cs = cellPos(0, 1).x - cellPos(0, 0).x;
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const p = cellPos(r, c);
      if (Math.hypot(x - p.x, y - p.y) < cs * 0.45) return r*N + c;
    }
    return -1;
  }

  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e); const i = findCell(x, y); if (i < 0 || board[i] !== '.') return;
    const snap = board.slice();
    const res = applyMove(board, i, 'b');
    if (!res.ok){ board.splice(0, board.length, ...snap); statusEl.textContent = "suicide — illegal"; return; }
    if (res.captured > 0) captureFlag.b = true;
    if (captureFlag.b || connected(board, 'b')){ winner = "you"; draw(); return; }
    turn = "ai"; draw(); setTimeout(aiMove, 400);
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve(){
      if (winner || turn !== "you") return;
      const __empties = []; for (let i = 0; i < N*N; i++) if (board[i] === '.') __empties.push(i);
      if (!__empties.length){ winner = "ai"; draw(); return; }
      // shuffle and try until a non-suicide move is found
      const __shuffled = __empties.slice().sort(() => Math.random() - 0.5);
      for (const __mv of __shuffled){
        const snap = board.slice();
        const res = applyMove(board, __mv, 'b');
        if (!res.ok){ board.splice(0, board.length, ...snap); continue; }
        if (res.captured > 0) captureFlag.b = true;
        if (captureFlag.b || connected(board, 'b')){ winner = "you"; draw(); return; }
        turn = "ai"; draw(); setTimeout(aiMove, 80); return;
      }
      // all moves suicidal — no legal move
      winner = "ai"; draw();
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
