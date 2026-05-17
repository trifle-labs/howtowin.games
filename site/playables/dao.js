// Dao — 4×4 sliding game. Slide a stone in any of 8 directions; it slides all
// the way to the edge or another piece. Win = 4-in-line, 4 corners, or 2×2 block.
// We use a depth-limited memoised minimax.

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = size + 50;
  const W = canvas.width, H = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) { canvas.style.width = W + 'px'; canvas.style.height = H + 'px'; canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr); }
  const statusEl = document.getElementById("playable-status");

  const N = 4;
  // 'b' = you, 'w' = ai, '.' = empty. canonical start: corners
  let board, turn, winner, sel, __solveCount;
  function newGame(){
    board = ".........".split(""); board.length = 16; for (let i = 0; i < 16; i++) if (!board[i]) board[i] = '.';
    // your stones on the four cells of one diagonal pattern; ai on the other
    board[0]='b'; board[5]='b'; board[10]='b'; board[15]='b';
    board[3]='w'; board[6]='w'; board[9]='w'; board[12]='w';
    turn = "you"; winner = null; sel = -1; __solveCount = 0;
  }
  newGame();

  const DIRS = [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]];

  function slideTo(b, i, dr, dc){
    let r = Math.floor(i/N), c = i%N;
    while (true){
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nr >= N || nc < 0 || nc >= N) break;
      if (b[nr*N + nc] !== '.') break;
      r = nr; c = nc;
    }
    return r*N + c;
  }

  function lineOf4(b, side){
    // rows, cols, diagonals
    for (let r = 0; r < N; r++){
      let ok = true; for (let c = 0; c < N; c++) if (b[r*N+c] !== side) { ok = false; break; }
      if (ok) return true;
    }
    for (let c = 0; c < N; c++){
      let ok = true; for (let r = 0; r < N; r++) if (b[r*N+c] !== side) { ok = false; break; }
      if (ok) return true;
    }
    let d1 = true, d2 = true;
    for (let i = 0; i < N; i++){ if (b[i*N+i] !== side) d1 = false; if (b[i*N+(N-1-i)] !== side) d2 = false; }
    if (d1 || d2) return true;
    return false;
  }
  function fourCorners(b, side){ return [0, 3, 12, 15].every(i => b[i] === side); }
  function twoByTwo(b, side){
    for (let r = 0; r < N-1; r++) for (let c = 0; c < N-1; c++){
      if (b[r*N+c]===side && b[r*N+c+1]===side && b[(r+1)*N+c]===side && b[(r+1)*N+c+1]===side) return true;
    }
    return false;
  }
  function wins(b, side){ return lineOf4(b, side) || fourCorners(b, side) || twoByTwo(b, side); }

  function legal(b, side){
    const out = [];
    for (let i = 0; i < 16; i++) if (b[i] === side){
      for (const [dr, dc] of DIRS){
        const j = slideTo(b, i, dr, dc);
        if (j !== i) out.push([i, j]);
      }
    }
    return out;
  }

  function apply(b, mv){ const nb = b.slice(); nb[mv[1]] = nb[mv[0]]; nb[mv[0]] = '.'; return nb; }

  const memo = new Map();
  function score(b, side, depth){
    if (wins(b, 'w')) return -1;
    if (wins(b, 'b')) return 1;
    if (depth === 0) return 0;
    const k = b.join('') + side + depth;
    if (memo.has(k)) return memo.get(k);
    const moves = legal(b, side);
    if (!moves.length){ memo.set(k, 0); return 0; }
    let best = side === 'b' ? -2 : 2;
    for (const mv of moves){
      const nb = apply(b, mv);
      const v = score(nb, side === 'b' ? 'w' : 'b', depth - 1);
      if (side === 'b'){ if (v > best) best = v; if (best === 1) break; }
      else { if (v < best) best = v; if (best === -1) break; }
    }
    memo.set(k, best); return best;
  }

  function aiBest(b){
    const moves = legal(b, 'w');
    for (const mv of moves) if (wins(apply(b, mv), 'w')) return mv;
    let best = null, bestV = 2;
    for (const mv of moves){
      const nb = apply(b, mv);
      const v = score(nb, 'b', 3);
      if (v < bestV){ bestV = v; best = mv; if (bestV === -1) break; }
    }
    return best || moves[0];
  }

  function aiMove(){
    if (winner) return;
    const mv = aiBest(board);
    if (!mv) return;
    board = apply(board, mv);
    if (wins(board, 'w')){ winner = "ai"; draw(); return; }
    turn = "you"; draw();
  }

  function cellRect(r, c){
    const margin = 30, cw = (size - 2*margin) / N;
    return { x: margin + c*cw, y: 30 + r*cw, w: cw, h: cw };
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);

    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const rc = cellRect(r, c), i = r*N + c;
      ctx.fillStyle = sel === i ? "#ffe9b0" : "#fff";
      ctx.fillRect(rc.x, rc.y, rc.w, rc.h);
      ctx.strokeStyle = "#888"; ctx.strokeRect(rc.x, rc.y, rc.w, rc.h);
      if (board[i] === 'b' || board[i] === 'w'){
        ctx.beginPath(); ctx.arc(rc.x + rc.w/2, rc.y + rc.h/2, rc.w*0.32, 0, Math.PI*2);
        ctx.fillStyle = board[i] === 'b' ? "#246" : "#a32"; ctx.fill();
      }
    }

    if (winner) statusEl.textContent = winner === "you" ? "you win!" : "AI wins";
    else statusEl.textContent = turn === "you" ? (sel < 0 ? "click your blue stone" : "click direction (stone slides to edge)") : "AI thinking…";
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
    const { x, y } = pos(e); const i = findCell(x, y);
    if (i < 0) return;
    if (sel < 0){ if (board[i] === 'b') sel = i; draw(); return; }
    if (i === sel){ sel = -1; draw(); return; }
    if (board[i] === 'b'){ sel = i; draw(); return; }
    // figure direction from sel to i (must be one of 8 dirs)
    const sr = Math.floor(sel/N), sc = sel%N, tr = Math.floor(i/N), tc = i%N;
    const dr = Math.sign(tr - sr), dc = Math.sign(tc - sc);
    if (dr === 0 && dc === 0) return;
    // must slide along straight line (row, col, or diag)
    if (Math.abs(tr - sr) !== Math.abs(tc - sc) && (tr - sr) !== 0 && (tc - sc) !== 0) return;
    const end = slideTo(board, sel, dr, dc);
    if (end !== i) return; // must end exactly at clicked cell (which is the endpoint)
    board = apply(board, [sel, end]); sel = -1;
    if (wins(board, 'b')){ winner = "you"; draw(); return; }
    turn = "ai"; draw(); setTimeout(aiMove, 500);
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); memo.clear(); },
    restart(){ newGame(); memo.clear(); draw(); },
    solve(){
      if (winner) return;
      __solveCount++;
      if (__solveCount > 40) {
        winner = "draw";
        statusEl.textContent = "draw — game length capped";
        return;
      }
      if (turn === "you") {
        const moves = legal(board, 'b');
        for (const mv of moves){ if (wins(apply(board, mv), 'b')){ board = apply(board, mv); winner = "you"; draw(); return; } }
        let best = null, bestV = -2;
        for (const mv of moves){ const v = score(apply(board, mv), 'w', 3); if (v > bestV){ bestV = v; best = mv; } }
        if (!best) return;
        board = apply(board, best); sel = -1;
        if (wins(board, 'b')){ winner = "you"; draw(); return; }
        turn = "ai"; draw();
        // Run AI synchronously so next solve() click finds turn==="you"
        aiMove();
      }
    },
  };
}
