// Breakthrough — 6×6 (smaller than standard 8×8 to keep AI quick).
// Pieces move 1 step forward (straight or diagonal); capture only diagonally
// forward. Reach back rank or eliminate all enemies to win.
// AI: depth-3 minimax with material + advancement heuristic.

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

  const N = 6;
  let board, turn, winner, sel;
  function newGame(){
    board = new Array(N*N).fill('.');
    for (let c = 0; c < N; c++){ board[0*N + c] = 'w'; board[1*N + c] = 'w'; board[(N-2)*N + c] = 'b'; board[(N-1)*N + c] = 'b'; }
    turn = "you"; winner = null; sel = -1;
  }
  newGame();

  function dir(side){ return side === 'b' ? -1 : 1; }

  function legal(b, side){
    const out = []; const d = dir(side);
    for (let i = 0; i < N*N; i++) if (b[i] === side){
      const r = Math.floor(i/N), c = i%N;
      // straight forward
      if (b[(r+d)*N + c] === '.') out.push([i, (r+d)*N + c]);
      // diagonals (move or capture)
      for (const dc of [-1, 1]){
        const nc = c + dc, nr = r + d;
        if (nc < 0 || nc >= N) continue;
        const t = b[nr*N + nc];
        if (t === '.' || (t !== '.' && t !== side)) out.push([i, nr*N + nc]);
      }
    }
    return out;
  }

  function apply(b, mv){ const nb = b.slice(); nb[mv[1]] = nb[mv[0]]; nb[mv[0]] = '.'; return nb; }

  function reachedBack(b, side){
    const row = side === 'b' ? 0 : N - 1;
    for (let c = 0; c < N; c++) if (b[row*N + c] === side) return true;
    return false;
  }

  function noPieces(b, side){ return !b.includes(side); }

  function heuristic(b){
    let s = 0;
    for (let i = 0; i < N*N; i++){
      const r = Math.floor(i/N);
      if (b[i] === 'b') s += 10 + (N - 1 - r);
      else if (b[i] === 'w') s -= 10 + r;
    }
    return s;
  }

  function minimax(b, side, depth, alpha, beta){
    if (reachedBack(b, 'b')) return 100000;
    if (reachedBack(b, 'w')) return -100000;
    if (noPieces(b, 'w')) return 100000;
    if (noPieces(b, 'b')) return -100000;
    if (depth === 0) return heuristic(b);
    const moves = legal(b, side);
    if (!moves.length) return side === 'b' ? -100000 : 100000;
    let best = side === 'b' ? -Infinity : Infinity;
    for (const mv of moves){
      const v = minimax(apply(b, mv), side === 'b' ? 'w' : 'b', depth - 1, alpha, beta);
      if (side === 'b'){ if (v > best) best = v; if (best > alpha) alpha = best; }
      else { if (v < best) best = v; if (best < beta) beta = best; }
      if (alpha >= beta) break;
    }
    return best;
  }

  function aiBest(b){
    const moves = legal(b, 'w');
    if (!moves.length) return null;
    let best = moves[0], bv = Infinity;
    for (const mv of moves){
      const v = minimax(apply(b, mv), 'b', 3, -Infinity, Infinity);
      if (v < bv){ bv = v; best = mv; }
    }
    return best;
  }

  function aiMove(){
    if (winner) return;
    const mv = aiBest(board); if (!mv){ winner = "you"; draw(); return; }
    board = apply(board, mv);
    if (reachedBack(board, 'w') || noPieces(board, 'b')){ winner = "ai"; draw(); return; }
    turn = "you"; draw();
  }

  function cellRect(r, c){
    const margin = 20, cw = (size - 2*margin) / N;
    return { x: margin + c*cw, y: 30 + r*cw, w: cw, h: cw };
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "13px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";
    _fit(ctx, "Breakthrough 6×6 — reach the top row to win", W/2, 18, W - 8);

    const moves = (turn === "you" && !winner && sel >= 0) ? legal(board, 'b').filter(m => m[0] === sel).map(m => m[1]) : [];
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const rc = cellRect(r, c), i = r*N + c;
      ctx.fillStyle = sel === i ? "#ffe9b0" : moves.includes(i) ? "#cef2cf" : ((r+c)%2===0 ? "#f0e2c0" : "#dcc090");
      ctx.fillRect(rc.x, rc.y, rc.w, rc.h);
      ctx.strokeStyle = "#888"; ctx.strokeRect(rc.x, rc.y, rc.w, rc.h);
      if (board[i] !== '.'){
        ctx.beginPath(); ctx.arc(rc.x + rc.w/2, rc.y + rc.h/2, rc.w*0.32, 0, Math.PI*2);
        ctx.fillStyle = board[i] === 'b' ? "#39c" : "#e60"; ctx.fill();
      }
    }
    if (winner) statusEl.textContent = winner === "you" ? "you win!" : "AI wins";
    else statusEl.textContent = turn === "you" ? (sel < 0 ? "click your blue piece" : "click a destination cell") : "AI thinking…";
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
    if (sel < 0){ if (board[i] === 'b') sel = i; draw(); return; }
    if (i === sel){ sel = -1; draw(); return; }
    if (board[i] === 'b'){ sel = i; draw(); return; }
    const moves = legal(board, 'b').filter(m => m[0] === sel);
    if (!moves.some(m => m[1] === i)) return;
    board = apply(board, [sel, i]); sel = -1;
    if (reachedBack(board, 'b') || noPieces(board, 'w')){ winner = "you"; draw(); return; }
    turn = "ai"; draw(); setTimeout(aiMove, 500);
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve() {
      if (winner || turn !== "you") return;
      const __mvs = legal(board, 'b');
      if (!__mvs.length) { winner = "ai"; draw(); return; }
      const __mv = __mvs[Math.floor(Math.random() * __mvs.length)];
      board = apply(board, __mv); sel = -1;
      if (reachedBack(board, 'b') || noPieces(board, 'w')) { winner = "you"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 80);
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
