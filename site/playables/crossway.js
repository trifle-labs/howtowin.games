// Crossway — connection game on a 9×9 board. Players alternate placing stones
// on any empty cell. Forbidden move: creating a "crossway" — a 2×2 square with
// two of YOUR stones on the diagonal and two ENEMY stones on the other
// diagonal. Black (you) connects top↔bottom; White (ai) left↔right.
// AI: greedy — place near border-distance estimate.

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

  const N = 9;
  let board, turn, winner;
  function newGame(){ board = new Array(N*N).fill('.'); turn = "you"; winner = null; }
  newGame();

  function illegal(b, r, c, side){
    const enemy = side === 'b' ? 'w' : 'b';
    // any 2×2 containing (r,c) where this side has the two diagonal corners
    // and the other diagonal has two enemy stones
    for (let dr = -1; dr <= 0; dr++) for (let dc = -1; dc <= 0; dc++){
      const rr = r + dr, cc = c + dc;
      if (rr < 0 || rr + 1 >= N || cc < 0 || cc + 1 >= N) continue;
      const tl = b[rr*N + cc], tr = b[rr*N + cc+1], bl = b[(rr+1)*N + cc], br = b[(rr+1)*N + cc+1];
      // diagonal-a: tl & br = side; tr & bl = enemy
      const a = tl === side && br === side && tr === enemy && bl === enemy;
      // diagonal-b: tr & bl = side; tl & br = enemy
      const c2 = tr === side && bl === side && tl === enemy && br === enemy;
      if (a || c2) return true;
    }
    return false;
  }

  function connected(b, side){
    const seen = new Set();
    const stack = [];
    if (side === 'b'){
      for (let c = 0; c < N; c++) if (b[c] === 'b') { seen.add(c); stack.push(c); }
    } else {
      for (let r = 0; r < N; r++) if (b[r*N] === 'w') { seen.add(r*N); stack.push(r*N); }
    }
    while (stack.length){
      const i = stack.pop();
      const r = Math.floor(i / N), c = i % N;
      if (side === 'b' && r === N-1) return true;
      if (side === 'w' && c === N-1) return true;
      for (const [dr, dc] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]]){
        const nr = r+dr, nc = c+dc;
        if (nr < 0 || nr >= N || nc < 0 || nc >= N) continue;
        if (b[nr*N + nc] !== side) continue;
        const ni = nr*N + nc;
        if (!seen.has(ni)){ seen.add(ni); stack.push(ni); }
      }
    }
    return false;
  }

  function aiMove(){
    if (winner) return;
    // try winning move
    for (let i = 0; i < N*N; i++) if (board[i] === '.'){
      const r = Math.floor(i / N), c = i % N;
      if (illegal(board, r, c, 'w')) continue;
      board[i] = 'w';
      if (connected(board, 'w')){ winner = "ai"; draw(); return; }
      board[i] = '.';
    }
    // pick cell minimising estimated path distance for white
    let best = -1, bv = Infinity;
    for (let i = 0; i < N*N; i++) if (board[i] === '.'){
      const r = Math.floor(i / N), c = i % N;
      if (illegal(board, r, c, 'w')) continue;
      const v = Math.abs(c - 4) + Math.abs(r - 4) * 0.5;
      if (v < bv){ bv = v; best = i; }
    }
    if (best < 0){ winner = "you"; draw(); return; }
    board[best] = 'w';
    if (connected(board, 'w')){ winner = "ai"; draw(); return; }
    turn = "you"; draw();
  }

  function cellRect(r, c){
    const margin = 14, cs = (size - 2*margin) / N;
    return { x: margin + c*cs, y: 18 + r*cs, w: cs, h: cs };
  }

  function draw(){
    ctx.fillStyle = "#f5e0b8"; ctx.fillRect(0, 0, W, H);
    ctx.font = "13px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";
    _fit(ctx, "Crossway — black connects TOP↔BOTTOM; no 2×2 cross pattern", W/2, 14, W - 8);

    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const rc = cellRect(r, c);
      ctx.strokeStyle = "#822"; ctx.strokeRect(rc.x, rc.y, rc.w, rc.h);
      const v = board[r*N + c]; if (v === '.') continue;
      ctx.beginPath(); ctx.arc(rc.x + rc.w/2, rc.y + rc.h/2, rc.w*0.4, 0, Math.PI*2);
      ctx.fillStyle = v === 'b' ? "#222" : "#eee"; ctx.fill();
      ctx.strokeStyle = "#444"; ctx.stroke();
    }

    if (winner) statusEl.textContent = winner === "you" ? "connected — you win!" : "AI wins";
    else statusEl.textContent = turn === "you" ? "click an empty cell to place a black stone" : "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }

  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e);
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const rc = cellRect(r, c);
      if (x >= rc.x && x <= rc.x + rc.w && y >= rc.y && y <= rc.y + rc.h){
        const i = r*N + c; if (board[i] !== '.') return;
        if (illegal(board, r, c, 'b')){ statusEl.textContent = "illegal — that move forms a cross pattern"; return; }
        board[i] = 'b';
        if (connected(board, 'b')){ winner = "you"; draw(); return; }
        turn = "ai"; draw(); setTimeout(aiMove, 400); return;
      }
    }
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve() {
      if (winner || turn !== "you") return;
      const __mvs = [];
      for (let i = 0; i < N*N; i++) {
        if (board[i] !== '.') continue;
        const r = Math.floor(i / N), c = i % N;
        if (!illegal(board, r, c, 'b')) __mvs.push(i);
      }
      if (!__mvs.length) { winner = "ai"; draw(); return; }
      const __mv = __mvs[Math.floor(Math.random() * __mvs.length)];
      board[__mv] = 'b';
      if (connected(board, 'b')) { winner = "you"; draw(); return; }
      turn = "ai"; draw();
      setTimeout(aiMove, 80);
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
