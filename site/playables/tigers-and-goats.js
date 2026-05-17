// Tigers and Goats (Bagh-Chal) — 5×5 board with diagonals on some lines.
// 4 tigers start on corners; 20 goats are dropped in by the goat player one at
// a time. Goats win by trapping ALL tigers (no legal move). Tigers win by
// capturing 5+ goats. Capture: short-range jump over a single adjacent goat
// into the empty cell beyond, along a board line. You play GOATS.
// AI: simple — captures first, else random.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 400);
  canvas.width = size;
  canvas.height = size + 60;
  const W = canvas.width, H = canvas.height;
  const statusEl = document.getElementById("playable-status");

  const N = 5;
  // adjacency: orthogonal everywhere; diagonals only where both coords are even or both odd in a chess-like fashion (traditional bagh-chal: diagonals at corners, midpoints of each row+column).
  function diagAllowed(r, c){ return (r + c) % 2 === 0; }
  function neighbours(r, c){
    const out = [];
    for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]){
      const nr = r + dr, nc = c + dc; if (nr>=0 && nr<N && nc>=0 && nc<N) out.push([nr, nc]);
    }
    if (diagAllowed(r, c)){
      for (const [dr, dc] of [[-1,-1],[-1,1],[1,-1],[1,1]]){
        const nr = r + dr, nc = c + dc; if (nr>=0 && nr<N && nc>=0 && nc<N) out.push([nr, nc]);
      }
    }
    return out;
  }
  function jumpsFrom(b, r, c){
    const out = [];
    // jumps over adjacent goat to cell beyond ALONG SAME LINE; line allowed only if intermediate cell shares line with both endpoints.
    for (const [nr, nc] of neighbours(r, c)){
      const dr = nr - r, dc = nc - c;
      const lr = r + 2*dr, lc = c + 2*dc;
      if (lr < 0 || lr >= N || lc < 0 || lc >= N) continue;
      // landing cell must share a line (i.e., neighbour of midpoint along same direction)
      if (!neighbours(nr, nc).some(([a, b2]) => a === lr && b2 === lc)) continue;
      if (b[nr][nc] === 'G' && b[lr][lc] === '.') out.push({ over: [nr, nc], to: [lr, lc] });
    }
    return out;
  }

  let board, phase, goatsLeft, captured, turn, winner, sel;
  function newGame(){
    board = Array.from({ length: N }, () => new Array(N).fill('.'));
    board[0][0] = 'T'; board[0][N-1] = 'T'; board[N-1][0] = 'T'; board[N-1][N-1] = 'T';
    phase = "place"; goatsLeft = 20; captured = 0; turn = "you"; winner = null; sel = null;
  }
  newGame();

  function tigerCount(b){ let n = 0; for (const row of b) for (const v of row) if (v === 'T') n++; return n; }
  function anyTigerMove(b){
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      if (b[r][c] !== 'T') continue;
      if (jumpsFrom(b, r, c).length) return true;
      for (const [nr, nc] of neighbours(r, c)) if (b[nr][nc] === '.') return true;
    }
    return false;
  }

  function aiMove(){
    if (winner) return;
    // tigers: capture if possible
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      if (board[r][c] !== 'T') continue;
      const js = jumpsFrom(board, r, c);
      if (js.length){
        const j = js[0];
        board[r][c] = '.'; board[j.over[0]][j.over[1]] = '.'; board[j.to[0]][j.to[1]] = 'T';
        captured++;
        if (captured >= 5){ winner = "ai"; draw(); return; }
        turn = "you"; draw(); return;
      }
    }
    // else: random tiger step
    const candidates = [];
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      if (board[r][c] !== 'T') continue;
      for (const [nr, nc] of neighbours(r, c)) if (board[nr][nc] === '.') candidates.push({ from: [r, c], to: [nr, nc] });
    }
    if (!candidates.length){ winner = "you"; draw(); return; }
    const m = candidates[Math.floor(Math.random() * candidates.length)];
    board[m.from[0]][m.from[1]] = '.'; board[m.to[0]][m.to[1]] = 'T';
    turn = "you"; draw();
  }

  function nodePos(r, c){
    const margin = 30;
    const cs = (size - 2*margin) / (N - 1);
    return { x: margin + c*cs, y: 30 + r*cs };
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "12px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";
    ctx.fillText(`Bagh-Chal — you place GOATS (${goatsLeft} left); tigers captured ${captured}/5`, W/2, 18);
    // draw lines from adjacency
    ctx.strokeStyle = "#888";
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const a = nodePos(r, c);
      for (const [nr, nc] of neighbours(r, c)){
        if (nr < r || (nr === r && nc < c)) continue;
        const b = nodePos(nr, nc);
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
    }
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const a = nodePos(r, c);
      ctx.beginPath(); ctx.arc(a.x, a.y, 5, 0, Math.PI*2); ctx.fillStyle = "#fff"; ctx.fill(); ctx.stroke();
      const v = board[r][c]; if (v === '.') continue;
      ctx.beginPath(); ctx.arc(a.x, a.y, 13, 0, Math.PI*2);
      ctx.fillStyle = v === 'T' ? "#e60" : "#39c";
      if (sel && sel.r === r && sel.c === c) ctx.fillStyle = "#cef2cf";
      ctx.fill(); ctx.stroke();
    }
    if (winner) statusEl.textContent = winner === "you" ? "you (goats) win!" : "AI (tigers) win";
    else statusEl.textContent = turn === "you" ? (phase === "place" ? "click empty intersection to place a goat" : (sel ? "click adjacent empty point" : "click your goat to move")) : "AI (tigers) thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }
  function nodeAt(x, y){
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const a = nodePos(r, c);
      if ((x-a.x)*(x-a.x) + (y-a.y)*(y-a.y) <= 256) return [r, c];
    }
    return null;
  }
  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e);
    const hit = nodeAt(x, y); if (!hit) return;
    const [r, c] = hit;
    if (phase === "place"){
      if (board[r][c] !== '.') return;
      board[r][c] = 'G'; goatsLeft--;
      if (goatsLeft === 0){ phase = "move"; }
      if (!anyTigerMove(board)){ winner = "you"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 350); return;
    }
    if (sel){
      if (sel.r === r && sel.c === c){ sel = null; draw(); return; }
      if (board[r][c] === 'G'){ sel = { r, c }; draw(); return; }
      const adj = neighbours(sel.r, sel.c).some(([a, b2]) => a === r && b2 === c);
      if (!adj || board[r][c] !== '.'){ sel = null; draw(); return; }
      board[sel.r][sel.c] = '.'; board[r][c] = 'G'; sel = null;
      if (!anyTigerMove(board)){ winner = "you"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 350); return;
    } else {
      if (board[r][c] === 'G'){ sel = { r, c }; draw(); }
      return;
    }
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve(){
      if (winner || turn !== "you") return;
      if (phase === "place"){
        const __empties = [];
        for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (board[r][c] === '.') __empties.push([r, c]);
        if (!__empties.length){ winner = "ai"; draw(); return; }
        const [r, c] = __empties[Math.floor(Math.random() * __empties.length)];
        board[r][c] = 'G'; goatsLeft--;
        if (goatsLeft === 0) phase = "move";
        if (!anyTigerMove(board)){ winner = "you"; draw(); return; }
        turn = "ai"; draw(); setTimeout(aiMove, 80); return;
      }
      const __mvs = [];
      for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
        if (board[r][c] !== 'G') continue;
        for (const [nr, nc] of neighbours(r, c)) if (board[nr][nc] === '.') __mvs.push({ from: [r, c], to: [nr, nc] });
      }
      if (!__mvs.length){ winner = "ai"; draw(); return; }
      const __mv = __mvs[Math.floor(Math.random() * __mvs.length)];
      board[__mv.from[0]][__mv.from[1]] = '.'; board[__mv.to[0]][__mv.to[1]] = 'G'; sel = null;
      if (!anyTigerMove(board)){ winner = "you"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 80);
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
