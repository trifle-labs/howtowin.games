// Maze (Conway) — a partisan path-tracing game. Two players (Left=you, Right=AI)
// take turns extending the tail of a path from a start cell on a small grid.
// Left moves UP/LEFT only; Right moves DOWN/RIGHT only. You may not enter a
// cell already on the path. Last to move wins (no legal move = loss).
// AI: full memoised minimax (small enough grid).

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = size + 30;
  const W = canvas.width, H = canvas.height;
  const statusEl = document.getElementById("playable-status");

  const N = 5;
  let path, turn, winner; // path: array of [r, c]
  function newGame(){
    path = [[2, 2]];
    turn = "you"; winner = null;
  }
  newGame();

  function head(p){ return p[p.length - 1]; }
  function inPath(p, r, c){ return p.some(([rr, cc]) => rr === r && cc === c); }

  function legalMoves(p, side){
    const [r, c] = head(p);
    const dirs = side === 'L' ? [[-1, 0], [0, -1]] : [[1, 0], [0, 1]];
    const out = [];
    for (const [dr, dc] of dirs){
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nr >= N || nc < 0 || nc >= N) continue;
      if (inPath(p, nr, nc)) continue;
      out.push([nr, nc]);
    }
    return out;
  }

  const memo = new Map();
  function key(p, side){ return p.map(c => c.join(',')).join('|') + side; }
  function winning(p, side){
    const k = key(p, side); if (memo.has(k)) return memo.get(k);
    const moves = legalMoves(p, side); if (!moves.length){ memo.set(k, false); return false; }
    const enemy = side === 'L' ? 'R' : 'L';
    for (const m of moves){
      const np = p.concat([m]);
      if (!winning(np, enemy)){ memo.set(k, true); return true; }
    }
    memo.set(k, false); return false;
  }

  function aiPick(){
    const moves = legalMoves(path, 'R'); if (!moves.length) return null;
    for (const m of moves){
      const np = path.concat([m]);
      if (!winning(np, 'L')) return m;
    }
    return moves[0];
  }

  function aiMove(){
    if (winner) return;
    const m = aiPick(); if (!m){ winner = "you"; draw(); return; }
    path = path.concat([m]);
    if (!legalMoves(path, 'L').length){ winner = "ai"; draw(); return; }
    turn = "you"; draw();
  }

  function cellRect(r, c){
    const margin = 30, cs = (size - 2*margin) / N;
    return { x: margin + c*cs, y: 20 + r*cs, w: cs, h: cs };
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "13px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";

    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const rc = cellRect(r, c);
      ctx.fillStyle = "#fff"; ctx.fillRect(rc.x, rc.y, rc.w, rc.h);
      ctx.strokeStyle = "#888"; ctx.strokeRect(rc.x, rc.y, rc.w, rc.h);
    }
    // path
    ctx.strokeStyle = "#39c"; ctx.lineWidth = 4;
    ctx.beginPath();
    for (let i = 0; i < path.length; i++){
      const [r, c] = path[i]; const rc = cellRect(r, c);
      if (i === 0) ctx.moveTo(rc.x + rc.w/2, rc.y + rc.h/2);
      else ctx.lineTo(rc.x + rc.w/2, rc.y + rc.h/2);
    }
    ctx.stroke(); ctx.lineWidth = 1;
    // marks
    for (let i = 0; i < path.length; i++){
      const [r, c] = path[i]; const rc = cellRect(r, c);
      ctx.beginPath(); ctx.arc(rc.x + rc.w/2, rc.y + rc.h/2, 6, 0, Math.PI*2);
      ctx.fillStyle = i === path.length - 1 ? "#e60" : "#222"; ctx.fill();
    }
    // legal-move highlights
    if (!winner && turn === "you"){
      for (const [r, c] of legalMoves(path, 'L')){
        const rc = cellRect(r, c);
        ctx.strokeStyle = "#0a0"; ctx.lineWidth = 3; ctx.strokeRect(rc.x + 2, rc.y + 2, rc.w - 4, rc.h - 4); ctx.lineWidth = 1;
      }
    }

    if (winner) statusEl.textContent = winner === "you" ? "you win!" : "AI wins";
    else statusEl.textContent = turn === "you" ? "click a green-outlined neighbour" : "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }

  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e);
    const legal = legalMoves(path, 'L');
    for (const [r, c] of legal){
      const rc = cellRect(r, c);
      if (x >= rc.x && x <= rc.x + rc.w && y >= rc.y && y <= rc.y + rc.h){
        path = path.concat([[r, c]]);
        if (!legalMoves(path, 'R').length){ winner = "you"; draw(); return; }
        turn = "ai"; draw(); setTimeout(aiMove, 400); return;
      }
    }
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve(){
      if (winner || turn !== "you") return;
      const moves = legalMoves(path, 'L');
      if (!moves.length){ winner = "ai"; draw(); return; }
      const mv = moves[Math.floor(Math.random() * moves.length)];
      path = path.concat([mv]);
      if (!legalMoves(path, 'R').length){ winner = "you"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 80);
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); memo.clear(); draw(); },
  };
}
