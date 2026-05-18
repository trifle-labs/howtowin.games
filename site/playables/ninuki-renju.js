// Ninuki-renju — 15×15 Go board. Five-in-a-row wins, but also pair-captures:
// placing X**OO**X removes the two enemy stones. Capturing 5 pairs also wins.
// AI: heuristic — score moves by line-extension + capture-creation/blocking.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = size + 30;
  const W = canvas.width, H = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) { canvas.style.width = W + 'px'; canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr); }
  const statusEl = document.getElementById("playable-status");

  const N = 15;
  let board, turn, winner, captures;
  function newGame(){
    board = Array.from({ length: N }, () => new Array(N).fill('.'));
    turn = "you"; winner = null; captures = { you: 0, ai: 0 };
  }
  newGame();

  const DIRS = [[0,1],[1,0],[1,1],[1,-1]];
  function checkFive(b, r, c, ch){
    for (const [dr, dc] of DIRS){
      let n = 1;
      for (let k = 1; k < 6; k++){ const nr = r + dr*k, nc = c + dc*k; if (nr<0||nr>=N||nc<0||nc>=N||b[nr][nc] !== ch) break; n++; }
      for (let k = 1; k < 6; k++){ const nr = r - dr*k, nc = c - dc*k; if (nr<0||nr>=N||nc<0||nc>=N||b[nr][nc] !== ch) break; n++; }
      if (n >= 5) return true;
    }
    return false;
  }
  function processCaptures(b, r, c, ch){
    const enemy = ch === 'B' ? 'W' : 'B';
    let cnt = 0;
    for (const [dr, dc] of [[0,1],[0,-1],[1,0],[-1,0],[1,1],[-1,-1],[1,-1],[-1,1]]){
      const r1 = r + dr, c1 = c + dc;
      const r2 = r + 2*dr, c2 = c + 2*dc;
      const r3 = r + 3*dr, c3 = c + 3*dc;
      if (r3 < 0 || r3 >= N || c3 < 0 || c3 >= N) continue;
      if (b[r1][c1] === enemy && b[r2][c2] === enemy && b[r3][c3] === ch){
        b[r1][c1] = '.'; b[r2][c2] = '.'; cnt++;
      }
    }
    return cnt;
  }

  function scoreMove(b, r, c, ch){
    // base: count line lengths in 4 directions with this stone.
    let score = 0;
    for (const [dr, dc] of DIRS){
      let n = 1, free = 0;
      for (let k = 1; k < 5; k++){
        const nr = r + dr*k, nc = c + dc*k;
        if (nr < 0 || nr >= N || nc < 0 || nc >= N) break;
        if (b[nr][nc] === ch) n++; else if (b[nr][nc] === '.'){ free++; break; } else break;
      }
      for (let k = 1; k < 5; k++){
        const nr = r - dr*k, nc = c - dc*k;
        if (nr < 0 || nr >= N || nc < 0 || nc >= N) break;
        if (b[nr][nc] === ch) n++; else if (b[nr][nc] === '.'){ free++; break; } else break;
      }
      score += n * n;
    }
    return score;
  }

  function aiMove(){
    if (winner) return;
    let best = null, bestScore = -Infinity;
    // candidates: empty cells near any stone
    const cand = new Set();
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      if (board[r][c] === '.') continue;
      for (let dr = -2; dr <= 2; dr++) for (let dc = -2; dc <= 2; dc++){
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nr >= N || nc < 0 || nc >= N) continue;
        if (board[nr][nc] === '.') cand.add(nr * N + nc);
      }
    }
    if (!cand.size) cand.add(7 * N + 7);
    for (const k of cand){
      const r = Math.floor(k / N), c = k % N;
      board[r][c] = 'W';
      const s = scoreMove(board, r, c, 'W') + scoreMove(board, r, c, 'B') * 0.9 + processCaptures(JSON.parse(JSON.stringify(board)), r, c, 'W') * 20;
      board[r][c] = '.';
      if (s > bestScore){ bestScore = s; best = [r, c]; }
    }
    if (!best){ winner = "draw"; draw(); return; }
    const [r, c] = best; board[r][c] = 'W';
    captures.ai += processCaptures(board, r, c, 'W');
    if (checkFive(board, r, c, 'W') || captures.ai >= 5){ winner = "ai"; draw(); return; }
    turn = "you"; draw();
  }

  function cellRect(r, c){
    const margin = 12, cs = (size - 2*margin) / (N - 1);
    return { x: margin + c*cs, y: 30 + r*cs, cs };
  }

  function draw(){
    ctx.fillStyle = "#f0c878"; ctx.fillRect(0, 0, W, H);
    ctx.font = "12px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#222";
    ctx.fillText(`Ninuki-renju — captures: you ${captures.you} : ${captures.ai} AI`, W/2, 18);

    ctx.strokeStyle = "#000"; ctx.lineWidth = 1;
    for (let i = 0; i < N; i++){
      const a = cellRect(i, 0), b = cellRect(i, N-1);
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      const c1 = cellRect(0, i), c2 = cellRect(N-1, i);
      ctx.beginPath(); ctx.moveTo(c1.x, c1.y); ctx.lineTo(c2.x, c2.y); ctx.stroke();
    }
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      if (board[r][c] === '.') continue;
      const rc = cellRect(r, c);
      ctx.beginPath(); ctx.arc(rc.x, rc.y, rc.cs * 0.4, 0, Math.PI*2);
      ctx.fillStyle = board[r][c] === 'B' ? "#111" : "#fff"; ctx.fill();
      ctx.strokeStyle = "#111"; ctx.stroke();
    }

    if (winner) statusEl.textContent = winner === "you" ? "you win!" : winner === "ai" ? "AI wins" : "draw";
    else statusEl.textContent = turn === "you" ? "click an intersection — five-in-a-row OR 5 pair-captures" : "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }

  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e);
    let best = null, bestD = Infinity;
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const rc = cellRect(r, c); const d = Math.hypot(x - rc.x, y - rc.y);
      if (d < bestD){ bestD = d; best = [r, c]; }
    }
    if (!best || bestD > 14) return;
    const [r, c] = best; if (board[r][c] !== '.') return;
    board[r][c] = 'B';
    captures.you += processCaptures(board, r, c, 'B');
    if (checkFive(board, r, c, 'B') || captures.you >= 5){ winner = "you"; draw(); return; }
    turn = "ai"; draw(); setTimeout(aiMove, 350);
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve(){
      if (winner || turn !== "you") return;
      const cand = [];
      for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (board[r][c] === '.') cand.push([r, c]);
      if (!cand.length) { winner = "ai"; draw(); return; }
      const [r, c] = cand[Math.floor(Math.random() * cand.length)];
      board[r][c] = 'B';
      captures.you += processCaptures(board, r, c, 'B');
      if (checkFive(board, r, c, 'B') || captures.you >= 5){ winner = "you"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 80);
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
