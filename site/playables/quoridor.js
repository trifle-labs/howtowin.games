// Quoridor — 5×5 mini variant. Each player has a pawn and 3 walls.
// Wall pieces span 2 cells along the gap between rows or columns; cannot fully
// seal an opponent. First to reach the far edge wins.
// AI: BFS shortest-path heuristic; tries to play walls only when they help.

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
  // pawn positions (you at bottom row 4, ai at top row 0)
  // walls: { kind: 'h'|'v', r, c } — h-wall sits between rows r and r+1 covering columns c and c+1; v-wall between columns c and c+1 covering rows r and r+1
  let you, ai, wallsRem, walls, turn, winner, mode;
  function newGame(){
    you = [4, 2]; ai = [0, 2]; wallsRem = { you: 3, ai: 3 };
    walls = []; turn = "you"; winner = null; mode = "move";
  }
  newGame();

  function blocked(r1, c1, r2, c2){
    // is there a wall between (r1,c1) and (r2,c2)? Only orth neighbours.
    if (r1 === r2){
      const c = Math.min(c1, c2);
      for (const w of walls){
        if (w.kind === 'v' && w.c === c && (w.r === r1 || w.r === r1 - 1)) return true;
      }
    } else {
      const r = Math.min(r1, r2);
      for (const w of walls){
        if (w.kind === 'h' && w.r === r && (w.c === c1 || w.c === c1 - 1)) return true;
      }
    }
    return false;
  }

  function pawnMoves(side){
    const me = side === "you" ? you : ai, other = side === "you" ? ai : you;
    const out = [];
    const [r, c] = me;
    for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]){
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nr >= N || nc < 0 || nc >= N) continue;
      if (blocked(r, c, nr, nc)) continue;
      if (other[0] === nr && other[1] === nc){
        // jump
        const jr = nr + dr, jc = nc + dc;
        if (jr >= 0 && jr < N && jc >= 0 && jc < N && !blocked(nr, nc, jr, jc)) out.push([jr, jc]);
        else {
          // diagonal jumps
          for (const [pdr, pdc] of [[dc, dr],[-dc, -dr]]){
            const dr2 = nr + pdr, dc2 = nc + pdc;
            if (dr2 >= 0 && dr2 < N && dc2 >= 0 && dc2 < N && !blocked(nr, nc, dr2, dc2)) out.push([dr2, dc2]);
          }
        }
        continue;
      }
      out.push([nr, nc]);
    }
    return out;
  }

  function shortestPath(start, goalRow){
    const dist = new Array(N*N).fill(Infinity); dist[start[0]*N + start[1]] = 0;
    const q = [start];
    while (q.length){
      const [r, c] = q.shift();
      if (r === goalRow) return dist[r*N + c];
      for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]){
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nr >= N || nc < 0 || nc >= N) continue;
        if (blocked(r, c, nr, nc)) continue;
        if (dist[nr*N + nc] !== Infinity) continue;
        dist[nr*N + nc] = dist[r*N + c] + 1;
        q.push([nr, nc]);
      }
    }
    return Infinity;
  }

  function reachable(start, goalRow){
    return shortestPath(start, goalRow) < Infinity;
  }

  function aiMove(){
    if (winner) return;
    // greedy: move toward goal row 4
    const moves = pawnMoves("ai");
    let best = moves[0], bv = Infinity;
    for (const m of moves){
      const savedAi = ai; ai = m;
      const d = shortestPath(ai, 4);
      ai = savedAi;
      if (d < bv){ bv = d; best = m; }
    }
    ai = best;
    if (ai[0] === 4){ winner = "ai"; draw(); return; }
    turn = "you"; mode = "move"; draw();
  }

  function cellSize(){ const margin = 20; return (size - 2*margin) / N; }
  function cellRect(r, c){
    const margin = 20, cs = cellSize();
    return { x: margin + c*cs, y: 30 + r*cs, w: cs, h: cs };
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "13px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";
    ctx.fillText(`Quoridor 5×5 — walls you ${wallsRem.you} / ai ${wallsRem.ai}`, W/2, 18);

    const moves = (turn === "you" && !winner && mode === "move") ? pawnMoves("you") : [];
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const rc = cellRect(r, c);
      ctx.fillStyle = moves.some(m => m[0] === r && m[1] === c) ? "#cef2cf" : "#f0e2c0";
      ctx.fillRect(rc.x, rc.y, rc.w, rc.h);
      ctx.strokeStyle = "#888"; ctx.strokeRect(rc.x, rc.y, rc.w, rc.h);
    }
    // pawns
    for (const [pos, color] of [[you, "#39c"], [ai, "#e60"]]){
      const rc = cellRect(pos[0], pos[1]);
      ctx.beginPath(); ctx.arc(rc.x + rc.w/2, rc.y + rc.h/2, rc.w*0.3, 0, Math.PI*2);
      ctx.fillStyle = color; ctx.fill();
    }
    // walls
    for (const w of walls){
      const rc = cellRect(w.r, w.c); const cs = cellSize();
      ctx.fillStyle = "#333";
      if (w.kind === 'h') ctx.fillRect(rc.x, rc.y + cs - 3, 2*cs, 6);
      else ctx.fillRect(rc.x + cs - 3, rc.y, 6, 2*cs);
    }
    // mode buttons
    const by = 30 + N*cellSize() + 10;
    ctx.fillStyle = (mode === "move") ? "#5a7" : "#bbb"; ctx.fillRect(20, by, 70, 24);
    ctx.fillStyle = "#fff"; ctx.font = "12px sans-serif"; ctx.textBaseline = "middle"; ctx.fillText("move", 55, by + 12);
    ctx.fillStyle = (mode === "h") ? "#5a7" : "#bbb"; ctx.fillRect(100, by, 70, 24);
    ctx.fillStyle = "#fff"; ctx.fillText("h-wall", 135, by + 12);
    ctx.fillStyle = (mode === "v") ? "#5a7" : "#bbb"; ctx.fillRect(180, by, 70, 24);
    ctx.fillStyle = "#fff"; ctx.fillText("v-wall", 215, by + 12);
    ctx.textBaseline = "alphabetic";

    if (winner) statusEl.textContent = winner === "you" ? "you reached the top!" : "AI reached the bottom";
    else statusEl.textContent = turn === "you" ? (mode === "move" ? "click highlighted cell" : "click cell — wall placed at its bottom/right edge spanning 2 cells") : "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }
  function findCell(x, y){
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const rc = cellRect(r, c);
      if (x >= rc.x && x <= rc.x + rc.w && y >= rc.y && y <= rc.y + rc.h) return [r, c];
    }
    return null;
  }

  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e);
    const by = 30 + N*cellSize() + 10;
    if (y >= by && y <= by + 24){
      if (x >= 20 && x <= 90) mode = "move";
      else if (x >= 100 && x <= 170 && wallsRem.you > 0) mode = "h";
      else if (x >= 180 && x <= 250 && wallsRem.you > 0) mode = "v";
      draw(); return;
    }
    const cell = findCell(x, y); if (!cell) return;
    if (mode === "move"){
      const moves = pawnMoves("you");
      if (moves.some(m => m[0] === cell[0] && m[1] === cell[1])){
        you = cell;
        if (you[0] === 0){ winner = "you"; draw(); return; }
        turn = "ai"; draw(); setTimeout(aiMove, 500);
      }
      return;
    }
    // wall placement: cell (r, c) → wall coordinates at (r, c); must be in range
    const [r, c] = cell;
    if (mode === "h" && r < N - 1 && c < N - 1){
      const w = { kind: 'h', r, c }; walls.push(w);
      // verify paths still exist
      if (!reachable(you, 0) || !reachable(ai, 4)){ walls.pop(); return; }
      wallsRem.you--; mode = "move";
      turn = "ai"; draw(); setTimeout(aiMove, 500);
    } else if (mode === "v" && r < N - 1 && c < N - 1){
      const w = { kind: 'v', r, c }; walls.push(w);
      if (!reachable(you, 0) || !reachable(ai, 4)){ walls.pop(); return; }
      wallsRem.you--; mode = "move";
      turn = "ai"; draw(); setTimeout(aiMove, 500);
    }
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve(){
      if (winner || turn !== "you") return;
      const __mvs = pawnMoves("you");
      if (!__mvs.length) { winner = "ai"; draw(); return; }
      you = __mvs[Math.floor(Math.random() * __mvs.length)];
      if (you[0] === 0){ winner = "you"; draw(); return; }
      mode = "move"; turn = "ai"; draw();
      setTimeout(aiMove, 80);
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
