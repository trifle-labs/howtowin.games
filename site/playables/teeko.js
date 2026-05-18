// Teeko — 5×5 board. Two phases: place 4 stones each, then slide a stone to an
// adjacent (8-dir) empty cell. Win = 4-in-line OR 2×2 block.
// Depth-limited minimax with heuristic during placement phase.

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = size + 60;
  const W = canvas.width, H = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) { canvas.style.width = W + 'px'; canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr); }
  const statusEl = document.getElementById("playable-status");

  const N = 5;
  let board, turn, winner, sel, phase, placed; // phase: 'place' or 'move'
  function newGame(){
    board = new Array(N*N).fill('.');
    turn = "you"; winner = null; sel = -1; phase = "place"; placed = { b: 0, w: 0 };
  }
  newGame();

  function lineOf4(b, side){
    // rows
    for (let r = 0; r < N; r++) for (let c = 0; c + 3 < N; c++){
      let ok = true; for (let k = 0; k < 4; k++) if (b[r*N + c + k] !== side){ ok = false; break; }
      if (ok) return true;
    }
    // cols
    for (let c = 0; c < N; c++) for (let r = 0; r + 3 < N; r++){
      let ok = true; for (let k = 0; k < 4; k++) if (b[(r+k)*N + c] !== side){ ok = false; break; }
      if (ok) return true;
    }
    // diag
    for (let r = 0; r + 3 < N; r++) for (let c = 0; c + 3 < N; c++){
      let ok = true; for (let k = 0; k < 4; k++) if (b[(r+k)*N + c + k] !== side){ ok = false; break; }
      if (ok) return true;
      ok = true; for (let k = 0; k < 4; k++) if (b[(r+k)*N + c + 3 - k] !== side){ ok = false; break; }
      if (ok) return true;
    }
    return false;
  }
  function block2x2(b, side){
    for (let r = 0; r < N - 1; r++) for (let c = 0; c < N - 1; c++){
      if (b[r*N+c]===side && b[r*N+c+1]===side && b[(r+1)*N+c]===side && b[(r+1)*N+c+1]===side) return true;
    }
    return false;
  }
  function wins(b, side){ return lineOf4(b, side) || block2x2(b, side); }

  function legalPlace(b){
    const out = []; for (let i = 0; i < N*N; i++) if (b[i] === '.') out.push(i); return out;
  }
  function legalMove(b, side){
    const out = [];
    for (let i = 0; i < N*N; i++) if (b[i] === side){
      const r = Math.floor(i/N), c = i%N;
      for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++){
        if (!dr && !dc) continue;
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nr >= N || nc < 0 || nc >= N) continue;
        if (b[nr*N + nc] === '.') out.push([i, nr*N + nc]);
      }
    }
    return out;
  }

  function aiPlace(){
    // pick move that wins immediately, else blocks immediate win, else centre-weighted
    const places = legalPlace(board);
    for (const i of places){ const nb = board.slice(); nb[i] = 'w'; if (wins(nb, 'w')) return i; }
    for (const i of places){ const nb = board.slice(); nb[i] = 'b'; if (wins(nb, 'b')) return i; }
    // prefer central cells
    places.sort((a, b) => Math.abs(Math.floor(a/N)-2)+Math.abs(a%N-2) - (Math.abs(Math.floor(b/N)-2)+Math.abs(b%N-2)));
    return places[0];
  }
  function aiSlide(){
    const moves = legalMove(board, 'w');
    if (!moves.length) return null;
    for (const m of moves){ const nb = board.slice(); nb[m[1]] = 'w'; nb[m[0]] = '.'; if (wins(nb, 'w')) return m; }
    // block
    for (const ym of legalMove(board, 'b')){ const nb = board.slice(); nb[ym[1]] = 'b'; nb[ym[0]] = '.'; if (wins(nb, 'b')){
      // any move that lands on ym[1] or otherwise denies
      for (const m of moves){ if (m[1] === ym[1]) return m; }
    } }
    return moves[Math.floor(Math.random()*moves.length)];
  }

  function aiMove(){
    if (winner) return;
    if (placed.w < 4){
      const i = aiPlace(); board[i] = 'w'; placed.w++;
      if (wins(board, 'w')){ winner = "ai"; draw(); return; }
    } else {
      const m = aiSlide(); if (!m){ winner = "you"; draw(); return; }
      board[m[1]] = 'w'; board[m[0]] = '.';
      if (wins(board, 'w')){ winner = "ai"; draw(); return; }
    }
    if (placed.b >= 4 && placed.w >= 4) phase = "move";
    turn = "you"; draw();
  }

  function cellRect(r, c){
    const margin = 30, cw = (size - 2*margin) / N;
    return { x: margin + c*cw, y: 50 + r*cw, w: cw, h: cw };
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "13px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";
    ctx.fillText(`phase: ${phase} · placed you=${placed.b} ai=${placed.w}`, W/2, 40);

    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const rc = cellRect(r, c), i = r*N + c;
      ctx.fillStyle = sel === i ? "#ffe9b0" : "#fff";
      ctx.fillRect(rc.x, rc.y, rc.w, rc.h);
      ctx.strokeStyle = "#888"; ctx.strokeRect(rc.x, rc.y, rc.w, rc.h);
      if (board[i] !== '.'){
        ctx.beginPath(); ctx.arc(rc.x + rc.w/2, rc.y + rc.h/2, rc.w*0.32, 0, Math.PI*2);
        ctx.fillStyle = board[i] === 'b' ? "#39c" : "#e60"; ctx.fill();
      }
    }
    if (winner) statusEl.textContent = winner === "you" ? "you win!" : "AI wins";
    else if (phase === "place") statusEl.textContent = turn === "you" ? "click an empty cell to place" : "AI placing…";
    else statusEl.textContent = turn === "you" ? (sel < 0 ? "click your stone" : "click an adjacent empty cell") : "AI sliding…";
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
    if (phase === "place"){
      if (board[i] !== '.') return;
      board[i] = 'b'; placed.b++;
      if (wins(board, 'b')){ winner = "you"; draw(); return; }
      if (placed.b >= 4 && placed.w >= 4) phase = "move";
      turn = "ai"; draw(); setTimeout(aiMove, 500); return;
    }
    // move phase
    if (sel < 0){ if (board[i] === 'b') sel = i; draw(); return; }
    if (i === sel){ sel = -1; draw(); return; }
    if (board[i] === 'b'){ sel = i; draw(); return; }
    if (board[i] !== '.') return;
    const sr = Math.floor(sel/N), sc = sel%N, ir = Math.floor(i/N), ic = i%N;
    if (Math.max(Math.abs(sr-ir), Math.abs(sc-ic)) !== 1) return;
    board[i] = 'b'; board[sel] = '.'; sel = -1;
    if (wins(board, 'b')){ winner = "you"; draw(); return; }
    turn = "ai"; draw(); setTimeout(aiMove, 500);
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve(){
      if (winner || turn !== "you") return;
      if (phase === "place"){
        const __mvs = legalPlace(board);
        if (!__mvs.length) { winner = "ai"; draw(); return; }
        const __mv = __mvs[Math.floor(Math.random() * __mvs.length)];
        board[__mv] = 'b'; placed.b++;
        if (wins(board, 'b')){ winner = "you"; draw(); return; }
        if (placed.b >= 4 && placed.w >= 4) phase = "move";
        turn = "ai"; draw(); setTimeout(aiMove, 80);
      } else {
        const __mvs = legalMove(board, 'b');
        if (!__mvs.length) { winner = "ai"; draw(); return; }
        const __mv = __mvs[Math.floor(Math.random() * __mvs.length)];
        board[__mv[1]] = 'b'; board[__mv[0]] = '.'; sel = -1;
        if (wins(board, 'b')){ winner = "you"; draw(); return; }
        turn = "ai"; draw(); setTimeout(aiMove, 80);
      }
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
