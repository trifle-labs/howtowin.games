// Renju — 11×11 mini board. Gomoku with handicap rules for Black (you):
//   - no double-three
//   - no double-four
//   - no overline (6+)
// White (AI) has no restrictions; 5-in-a-row wins. AI: line-scoring heuristic.

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = size + 40;
  const W = canvas.width, H = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) { canvas.style.width = W + 'px'; canvas.style.height = H + 'px'; canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr); }
  const statusEl = document.getElementById("playable-status");

  const N = 11;
  let board, turn, winner;
  function newGame(){ board = new Array(N*N).fill('.'); turn = "you"; winner = null; }
  newGame();

  const DIRS = [[1,0],[0,1],[1,1],[1,-1]];

  function get(b, r, c){ if (r < 0 || r >= N || c < 0 || c >= N) return '#'; return b[r*N + c]; }

  function runLen(b, r, c, dr, dc, side){
    let n = 0;
    while (get(b, r + dr*n, c + dc*n) === side) n++;
    return n;
  }

  function wins(b, side){
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      if (b[r*N + c] !== side) continue;
      for (const [dr, dc] of DIRS){
        let k = runLen(b, r, c, dr, dc, side);
        const before = get(b, r - dr, c - dc);
        if (before === side) continue; // count once
        if (side === 'b'){ if (k === 5) return true; if (k > 5) return false; }
        else if (k >= 5) return true;
      }
    }
    return false;
  }

  function overline(b, r, c, side){
    // after placing, any line through (r,c) of length >=6 ?
    for (const [dr, dc] of DIRS){
      // count consecutive in both directions
      let k = 1;
      let i = 1; while (get(b, r + dr*i, c + dc*i) === side){ k++; i++; }
      i = 1; while (get(b, r - dr*i, c - dc*i) === side){ k++; i++; }
      if (k >= 6) return true;
    }
    return false;
  }

  function isOpenThree(b, r, c, dr, dc, side){
    // an "open three" is _XXX_ (three in a row with both ends empty).
    // After placing at (r,c), check if it creates such a pattern (any of the
    // 5 alignments containing this cell).
    for (let off = -3; off <= 0; off++){
      const cells = [];
      for (let k = 0; k < 5; k++){
        cells.push([r + (off + k) * dr, c + (off + k) * dc]);
      }
      // pattern: cells = [E, S, S, S, E]
      const v0 = get(b, cells[0][0], cells[0][1]);
      const v1 = get(b, cells[1][0], cells[1][1]);
      const v2 = get(b, cells[2][0], cells[2][1]);
      const v3 = get(b, cells[3][0], cells[3][1]);
      const v4 = get(b, cells[4][0], cells[4][1]);
      if (v0 === '.' && v1 === side && v2 === side && v3 === side && v4 === '.') return true;
    }
    return false;
  }

  function isFour(b, r, c, dr, dc, side){
    // any 5-window with exactly 4 'side' and 1 '.'
    for (let off = -4; off <= 0; off++){
      let my = 0, dots = 0;
      for (let k = 0; k < 5; k++){
        const v = get(b, r + (off + k) * dr, c + (off + k) * dc);
        if (v === side) my++; else if (v === '.') dots++; else { my = -1; break; }
      }
      if (my === 4 && dots === 1) return true;
    }
    return false;
  }

  function isFoul(b, r, c, side){
    if (side !== 'b') return false;
    b[r*N + c] = 'b';
    if (wins(b, 'b')){ b[r*N + c] = '.'; return false; }
    if (overline(b, r, c, 'b')){ b[r*N + c] = '.'; return true; }
    let threes = 0, fours = 0;
    for (const [dr, dc] of DIRS){
      if (isOpenThree(b, r, c, dr, dc, 'b')) threes++;
      if (isFour(b, r, c, dr, dc, 'b')) fours++;
    }
    b[r*N + c] = '.';
    return threes >= 2 || fours >= 2;
  }

  function lineScore(b, side){
    let s = 0;
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      for (const [dr, dc] of DIRS){
        const nr = r + dr*4, nc = c + dc*4;
        if (nr < 0 || nr >= N || nc < 0 || nc >= N) continue;
        let my = 0, op = 0;
        for (let i = 0; i < 5; i++){
          const v = b[(r+dr*i)*N + (c+dc*i)];
          if (v === side) my++; else if (v !== '.') op++;
        }
        if (op === 0 && my > 0) s += [0, 1, 5, 25, 100, 100000][my];
      }
    }
    return s;
  }

  function neighborhood(){
    const set = new Set();
    let any = false;
    for (let i = 0; i < N*N; i++) if (board[i] !== '.'){
      any = true;
      const r = Math.floor(i/N), c = i%N;
      for (let dr = -2; dr <= 2; dr++) for (let dc = -2; dc <= 2; dc++){
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nr >= N || nc < 0 || nc >= N) continue;
        if (board[nr*N + nc] === '.') set.add(nr*N + nc);
      }
    }
    if (!any) return [Math.floor(N/2)*N + Math.floor(N/2)];
    return [...set];
  }

  function aiPick(){
    const cand = neighborhood(); if (!cand.length) return -1;
    // immediate win or block
    for (const i of cand){ board[i] = 'w'; if (wins(board, 'w')){ board[i] = '.'; return i; } board[i] = '.'; }
    for (const i of cand){
      // simulate enemy placing here. If they would foul, score it lower; otherwise check win.
      board[i] = 'b';
      const fouled = isFoul(board, Math.floor(i/N), i%N, 'b');
      const won = wins(board, 'b');
      board[i] = '.';
      if (won && !fouled){ return i; }
    }
    let best = cand[0], bv = -Infinity;
    for (const i of cand){
      board[i] = 'w';
      const v = lineScore(board, 'w') - lineScore(board, 'b');
      if (v > bv){ bv = v; best = i; }
      board[i] = '.';
    }
    return best;
  }

  function aiMove(){
    if (winner) return;
    const i = aiPick(); if (i < 0){ winner = "draw"; draw(); return; }
    board[i] = 'w';
    if (wins(board, 'w')){ winner = "ai"; draw(); return; }
    turn = "you"; draw();
  }

  function cellPos(r, c){
    const margin = 20, cs = (size - 2*margin) / (N - 1);
    return { x: margin + c*cs, y: 40 + r*cs, cs };
  }

  function draw(){
    ctx.fillStyle = "#f5e0b8"; ctx.fillRect(0, 0, W, H);

    const cs = (size - 40) / (N - 1);
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
      ctx.beginPath(); ctx.arc(p.x, p.y, cs*0.4, 0, Math.PI*2);
      ctx.fillStyle = v === 'b' ? "#222" : "#eee"; ctx.fill();
      ctx.strokeStyle = "#444"; ctx.stroke();
    }

    if (winner) statusEl.textContent = winner === "you" ? "you win!" : winner === "ai" ? "AI wins" : winner === "foul" ? "FOUL — you lose" : "draw";
    else statusEl.textContent = turn === "you" ? "click an intersection (Black has restricted moves)" : "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }
  function findCell(x, y){
    const cs = (size - 40) / (N - 1);
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const p = cellPos(r, c);
      if (Math.hypot(x - p.x, y - p.y) < cs * 0.45) return r*N + c;
    }
    return -1;
  }

  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e); const i = findCell(x, y); if (i < 0 || board[i] !== '.') return;
    const r = Math.floor(i / N), c = i % N;
    if (isFoul(board, r, c, 'b')){ winner = "foul"; draw(); return; }
    board[i] = 'b';
    if (wins(board, 'b')){ winner = "you"; draw(); return; }
    turn = "ai"; draw(); setTimeout(aiMove, 500);
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve(){
      if (winner || turn !== "you") return;
      const __cand = neighborhood().filter(i => {
        const r = Math.floor(i / N), c = i % N;
        return board[i] === '.' && !isFoul(board, r, c, 'b');
      });
      if (!__cand.length) { winner = "ai"; draw(); return; }
      const __i = __cand[Math.floor(Math.random() * __cand.length)];
      board[__i] = 'b';
      if (wins(board, 'b')){ winner = "you"; draw(); return; }
      turn = "ai"; draw();
      setTimeout(aiMove, 80);
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
