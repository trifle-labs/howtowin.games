// Y — triangular hex board. Players place stones; first to form a chain
// touching ALL THREE sides wins. No draws possible (Y theorem). Mini board:
// side length 7. AI: shortest-path heuristic via Dijkstra.

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = size + 40;
  const W = canvas.width, H = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) { canvas.style.width = W + 'px'; canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr); }
  const statusEl = document.getElementById("playable-status");

  // Triangular grid: row r (0..N-1) has r+1 cells (0..r). Total = N(N+1)/2.
  const N = 7;
  // cell index: idx(r, c) = r*(r+1)/2 + c
  function idx(r, c){ return r*(r+1)/2 + c; }
  const TOTAL = N*(N+1)/2;
  let board, turn, winner;
  function newGame(){ board = new Array(TOTAL).fill('.'); turn = "you"; winner = null; }
  newGame();

  function neighbors(r, c){
    const out = [];
    const cands = [
      [r-1, c-1], [r-1, c],
      [r, c-1], [r, c+1],
      [r+1, c], [r+1, c+1],
    ];
    for (const [nr, nc] of cands){
      if (nr < 0 || nr >= N) continue;
      if (nc < 0 || nc > nr) continue;
      out.push([nr, nc]);
    }
    return out;
  }

  function connects(side){
    // BFS from each side; check we touched the other two
    // Side A: row 0..N-1 c=0 (left edge); Side B: row 0..N-1 c=r (right edge); Side C: row N-1 (bottom)
    let touchA = false, touchB = false, touchC = false;
    const visited = new Set();
    const stack = [];
    // start from all stones of side, but we need a connected component touching all 3 sides
    for (let r = 0; r < N; r++) for (let c = 0; c <= r; c++){
      const i = idx(r, c); if (board[i] !== side || visited.has(i)) continue;
      // BFS this component
      visited.add(i); stack.length = 0; stack.push([r, c]);
      let a = false, b = false, cc = false;
      while (stack.length){
        const [rr, ncc] = stack.pop();
        if (ncc === 0) a = true;
        if (ncc === rr) b = true;
        if (rr === N - 1) cc = true;
        for (const [nr, nc] of neighbors(rr, ncc)){
          const ni = idx(nr, nc);
          if (visited.has(ni) || board[ni] !== side) continue;
          visited.add(ni); stack.push([nr, nc]);
        }
      }
      if (a && b && cc) return true;
    }
    return false;
  }

  function aiPick(){
    // immediate win
    for (let i = 0; i < TOTAL; i++) if (board[i] === '.'){
      board[i] = 'w'; if (connects('w')){ board[i] = '.'; return i; } board[i] = '.';
    }
    // block
    for (let i = 0; i < TOTAL; i++) if (board[i] === '.'){
      board[i] = 'b'; if (connects('b')){ board[i] = '.'; return i; } board[i] = '.';
    }
    // greedy: pick a cell that maximally connects own stones (touches most own neighbors)
    let best = -1, bv = -Infinity;
    for (let r = 0; r < N; r++) for (let c = 0; c <= r; c++){
      const i = idx(r, c); if (board[i] !== '.') continue;
      let v = 0; for (const [nr, nc] of neighbors(r, c)) if (board[idx(nr, nc)] === 'w') v += 2;
      for (const [nr, nc] of neighbors(r, c)) if (board[idx(nr, nc)] === 'b') v -= 1;
      // pick center-ish if tied
      v += -Math.abs(r - Math.floor(N/2)) - Math.abs(c - r/2);
      if (v > bv){ bv = v; best = i; }
    }
    return best;
  }

  function aiMove(){
    if (winner) return;
    const i = aiPick(); if (i < 0){ winner = "draw"; draw(); return; }
    board[i] = 'w';
    if (connects('w')){ winner = "ai"; draw(); return; }
    turn = "you"; draw();
  }

  function cellPos(r, c){
    const margin = 30, hexW = (size - 2*margin) / (N - 0.5);
    const x = margin + (c - r/2) * hexW + (N/2) * hexW * 0.5;
    const y = 40 + r * hexW * 0.85;
    return { x, y, r: hexW * 0.45 };
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);

    for (let r = 0; r < N; r++) for (let c = 0; c <= r; c++){
      const p = cellPos(r, c);
      // border indicator
      let border = "#fff";
      if (c === 0) border = "#bcd9f0";
      else if (c === r) border = "#f4cfb4";
      else if (r === N-1) border = "#dfd";
      ctx.beginPath();
      for (let k = 0; k < 6; k++){
        const a = Math.PI / 3 * k + Math.PI/6;
        const px = p.x + Math.cos(a) * p.r, py = p.y + Math.sin(a) * p.r;
        if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = border; ctx.fill(); ctx.strokeStyle = "#888"; ctx.stroke();
      const v = board[idx(r, c)];
      if (v !== '.'){
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 0.7, 0, Math.PI*2);
        ctx.fillStyle = v === 'b' ? "#222" : "#eee"; ctx.fill(); ctx.strokeStyle = "#444"; ctx.stroke();
      }
    }
    if (winner) statusEl.textContent = winner === "you" ? "you connected all 3 sides!" : winner === "ai" ? "AI connected all 3 sides" : "draw (impossible — bug)";
    else statusEl.textContent = turn === "you" ? "click any empty hex to place a black stone" : "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }
  function findCell(x, y){
    for (let r = 0; r < N; r++) for (let c = 0; c <= r; c++){
      const p = cellPos(r, c);
      if (Math.hypot(x - p.x, y - p.y) < p.r) return idx(r, c);
    }
    return -1;
  }

  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e); const i = findCell(x, y); if (i < 0 || board[i] !== '.') return;
    board[i] = 'b';
    if (connects('b')){ winner = "you"; draw(); return; }
    turn = "ai"; draw(); setTimeout(aiMove, 500);
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve(){
      if (winner || turn !== "you") return;
      const __mvs = [];
      for (let i = 0; i < TOTAL; i++) if (board[i] === '.') __mvs.push(i);
      if (!__mvs.length){ winner = "ai"; draw(); return; }
      const __i = __mvs[Math.floor(Math.random() * __mvs.length)];
      board[__i] = 'b';
      if (connects('b')){ winner = "you"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 80);
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
