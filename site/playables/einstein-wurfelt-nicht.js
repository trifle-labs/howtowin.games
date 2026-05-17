// EinStein würfelt nicht! — 5×5 board, each side with cubes numbered 1–6
// in opposite corners. Each turn a die is rolled; you move the cube of that
// number (or, if missing, nearest above/below). You move toward the far corner.
// Landing on any cube removes it. Win by reaching opposing corner OR by
// capturing all enemy cubes. AI: chooses move maximising heuristic (progress
// + captures - exposure).

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = size + 40;
  const W = canvas.width, H = canvas.height;
  const statusEl = document.getElementById("playable-status");

  const N = 5;
  // your goal: top-right corner (0, N-1). ai goal: bottom-left (N-1, 0).
  // your start: bottom-left triangle; ai start: top-right triangle.
  let board, dieRoll, turn, winner;
  function newGame(){
    board = Array.from({ length: N }, () => new Array(N).fill(null));
    // your cubes (b1..b6) at positions: (4,0),(4,1),(3,0),(4,2),(3,1),(2,0)
    const youPos = [[4,0],[4,1],[3,0],[4,2],[3,1],[2,0]];
    const aiPos =  [[0,4],[0,3],[1,4],[0,2],[1,3],[2,4]];
    for (let i = 0; i < 6; i++){ board[youPos[i][0]][youPos[i][1]] = { side: 'you', n: i+1 }; }
    for (let i = 0; i < 6; i++){ board[aiPos[i][0]][aiPos[i][1]] = { side: 'ai', n: i+1 }; }
    turn = "you"; winner = null; dieRoll = 1 + Math.floor(Math.random() * 6);
  }
  newGame();

  function findCube(side, n){
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const v = board[r][c]; if (v && v.side === side && v.n === n) return [r, c];
    }
    return null;
  }
  function activeCubes(side, roll){
    // exact roll if alive, else nearest above and below.
    const have = [];
    for (let n = 1; n <= 6; n++) if (findCube(side, n)) have.push(n);
    if (!have.length) return [];
    if (have.includes(roll)) return [roll];
    const out = [];
    for (let n = roll - 1; n >= 1; n--) if (have.includes(n)){ out.push(n); break; }
    for (let n = roll + 1; n <= 6; n++) if (have.includes(n)){ out.push(n); break; }
    return out;
  }

  function moves(side, roll){
    const out = [];
    for (const n of activeCubes(side, roll)){
      const p = findCube(side, n); if (!p) continue;
      const [r, c] = p;
      const dirs = side === 'you' ? [[-1, 0],[0, 1],[-1, 1]] : [[1, 0],[0, -1],[1, -1]];
      for (const [dr, dc] of dirs){
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nr >= N || nc < 0 || nc >= N) continue;
        out.push({ from: [r, c], to: [nr, nc], n });
      }
    }
    return out;
  }
  function apply(mv, side){
    const [fr, fc] = mv.from, [tr, tc] = mv.to;
    const cube = board[fr][fc]; board[fr][fc] = null;
    board[tr][tc] = cube;
    return { reachedCorner: (side === 'you' && tr === 0 && tc === N-1) || (side === 'ai' && tr === N-1 && tc === 0) };
  }
  function countSide(side){ let n = 0; for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (board[r][c]?.side === side) n++; return n; }

  function aiMove(){
    if (winner) return;
    const opts = moves('ai', dieRoll);
    if (!opts.length){ turn = "you"; dieRoll = 1 + Math.floor(Math.random() * 6); draw(); return; }
    let best = opts[0], bestScore = -Infinity;
    for (const mv of opts){
      const [tr, tc] = mv.to; const target = board[tr][tc];
      let score = -(tr + tc); // progress to (N-1, 0): want low (tr+tc) for ai? no, want high tr+low tc. AI goal at (N-1, 0): score = tr - tc.
      score = tr - tc + 5;
      if (target){
        if (target.side === 'you') score += 30;
        else score -= 5; // capturing your own piece is risky
      }
      if (score > bestScore){ bestScore = score; best = mv; }
    }
    const res = apply(best, 'ai');
    if (res.reachedCorner){ winner = "ai"; draw(); return; }
    if (countSide('you') === 0){ winner = "ai"; draw(); return; }
    turn = "you"; dieRoll = 1 + Math.floor(Math.random() * 6); draw();
  }

  function cellRect(r, c){
    const margin = 18, cs = (size - 2*margin) / N;
    return { x: margin + c*cs, y: 40 + r*cs, w: cs, h: cs };
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "13px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";
    ctx.fillText(`EinStein würfelt nicht — die: ${dieRoll}`, W/2, 22);

    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const rc = cellRect(r, c);
      ctx.fillStyle = (r === 0 && c === N-1) ? "#e0f0ff" : (r === N-1 && c === 0) ? "#ffe0e0" : "#fff";
      ctx.fillRect(rc.x, rc.y, rc.w, rc.h);
      ctx.strokeStyle = "#888"; ctx.strokeRect(rc.x, rc.y, rc.w, rc.h);
    }
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const cube = board[r][c]; if (!cube) continue;
      const rc = cellRect(r, c);
      ctx.beginPath(); ctx.arc(rc.x + rc.w/2, rc.y + rc.h/2, rc.w * 0.35, 0, Math.PI*2);
      ctx.fillStyle = cube.side === 'you' ? "#39c" : "#e60"; ctx.fill();
      ctx.strokeStyle = "#222"; ctx.stroke();
      ctx.fillStyle = "#fff"; ctx.font = "bold 14px sans-serif"; ctx.textBaseline = "middle";
      ctx.fillText(String(cube.n), rc.x + rc.w/2, rc.y + rc.h/2);
      ctx.textBaseline = "alphabetic";
    }
    // highlight legal moves
    if (turn === "you" && !winner){
      for (const mv of moves('you', dieRoll)){
        const rc = cellRect(mv.to[0], mv.to[1]);
        ctx.strokeStyle = "#0a0"; ctx.lineWidth = 3; ctx.strokeRect(rc.x + 2, rc.y + 2, rc.w - 4, rc.h - 4); ctx.lineWidth = 1;
      }
    }

    if (winner) statusEl.textContent = winner === "you" ? "you win!" : "AI wins";
    else statusEl.textContent = turn === "you" ? `die: ${dieRoll} — click a green-outlined cell to move` : "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }

  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e);
    for (const mv of moves('you', dieRoll)){
      const rc = cellRect(mv.to[0], mv.to[1]);
      if (x >= rc.x && x <= rc.x + rc.w && y >= rc.y && y <= rc.y + rc.h){
        const res = apply(mv, 'you');
        if (res.reachedCorner){ winner = "you"; draw(); return; }
        if (countSide('ai') === 0){ winner = "you"; draw(); return; }
        turn = "ai"; dieRoll = 1 + Math.floor(Math.random() * 6); draw(); setTimeout(aiMove, 400); return;
      }
    }
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve() {
      if (winner || turn !== "you") return;
      const __mvs = moves('you', dieRoll);
      if (!__mvs || !__mvs.length) { turn = "ai"; dieRoll = 1 + Math.floor(Math.random() * 6); draw(); setTimeout(aiMove, 80); return; }
      const __mv = __mvs[Math.floor(Math.random() * __mvs.length)];
      const __res = apply(__mv, 'you');
      if (__res.reachedCorner) { winner = "you"; draw(); return; }
      if (countSide('ai') === 0) { winner = "you"; draw(); return; }
      turn = "ai"; dieRoll = 1 + Math.floor(Math.random() * 6); draw();
      setTimeout(aiMove, 80);
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
