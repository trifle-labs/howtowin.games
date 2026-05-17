// Surakarta — 6×6 grid with corner loop tracks. Pieces capture only by sliding
// straight, around at least one loop, then landing on an opposing piece (path
// must be clear). Normal step move (orthogonal/diagonal one square) is also
// allowed for non-capturing moves. Eliminate enemy to win.
// AI: greedy capture; else random one-step move.

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = size + 30;
  const W = canvas.width, H = canvas.height;
  const statusEl = document.getElementById("playable-status");

  const N = 6;
  let board, turn, winner, sel;
  function newGame(){
    board = Array.from({ length: N }, () => new Array(N).fill('.'));
    for (let c = 0; c < N; c++){ board[0][c] = 'W'; board[1][c] = 'W'; board[N-2][c] = 'B'; board[N-1][c] = 'B'; }
    turn = "you"; winner = null; sel = null;
  }
  newGame();

  // Loop tracks: rows 1,2,3,4 each form a "ring" by traversing along the row to
  // an edge, then around the corner loop on that side, then back into the
  // mirrored row. For simplicity, we encode 4 directional sliding tracks:
  // each piece can slide along its row or column; when reaching an end at one
  // of rows/cols 1..4, it loops to the next inner row/col 1↔4 on the same side.
  // We compute a path by walking step-by-step with a list of "after-edge"
  // transitions. For minimal viable version we treat the loops as orthogonal
  // long-range captures where the path goes off-edge and re-enters at the
  // mirrored row/col on the same edge.

  function tracePath(b, r, c, dr, dc){
    const path = [];
    let cr = r, cc = c, ddr = dr, ddc = dc;
    let loops = 0;
    for (let step = 0; step < 30; step++){
      cr += ddr; cc += ddc;
      // off-board: try loop
      if (cr < 0 || cr >= N || cc < 0 || cc >= N){
        // determine which edge: only inner rows/cols 1..4 have loops
        if (ddr !== 0 && cc >= 1 && cc <= N - 2){
          // going off top/bottom — loop to a column on the same side?
          // Use mapping: column c on top loops out to row c on left side.
          // We'll simulate two specific loops on each corner:
          // top-left loop: top row col 1 ↔ left col row 1 (and col 2 ↔ row 2)
          // Simplification: a vertical slide off rows 0 or N-1 from column 1..2 emerges from rows 1..2 of left column (similarly col 3..4 to right).
          if (cc <= 2){
            // emerge going right from left edge
            cr = cc + (ddr < 0 ? 0 : N-1) ; // approximate
            cc = -1; // will step into 0
            ddr = 0; ddc = 1; loops++;
            cr = (ddr === 0 ? (cc <= 2 ? cc + 0 : cc) : cr);
            continue;
          } else {
            cr = (N - 1 - cc); cc = N; ddr = 0; ddc = -1; loops++; continue;
          }
        }
        // simpler: if path goes off edge, give up
        return { reachable: false, loops, path };
      }
      path.push([cr, cc]);
      if (b[cr][cc] !== '.') return { reachable: true, loops, path, endR: cr, endC: cc };
    }
    return { reachable: false, loops, path };
  }

  // simpler capture model: capture = piece can move along a clear orthogonal
  // line to an enemy at any range; require at least one corner wrap (path
  // goes "around"). We approximate: capture is allowed if the row/col contains
  // exactly one enemy at the far end with empty squares between.
  function captureMoves(b, side){
    const my = side === "you" ? 'B' : 'W';
    const enemy = side === "you" ? 'W' : 'B';
    const out = [];
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      if (b[r][c] !== my) continue;
      for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]){
        let nr = r + dr, nc = c + dc;
        // require at least one empty between
        let steps = 0; let blocked = false;
        while (nr >= 0 && nr < N && nc >= 0 && nc < N){
          if (b[nr][nc] === my){ blocked = true; break; }
          if (b[nr][nc] === enemy){
            if (steps >= 1) out.push({ from: [r, c], to: [nr, nc] });
            blocked = true; break;
          }
          steps++; nr += dr; nc += dc;
        }
      }
    }
    return out;
  }
  function quietMoves(b, side){
    const my = side === "you" ? 'B' : 'W';
    const out = [];
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      if (b[r][c] !== my) continue;
      for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]]){
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nr >= N || nc < 0 || nc >= N) continue;
        if (b[nr][nc] === '.') out.push({ from: [r, c], to: [nr, nc] });
      }
    }
    return out;
  }
  function countSide(b, ch){ let n = 0; for (const row of b) for (const v of row) if (v === ch) n++; return n; }

  function aiMove(){
    if (winner) return;
    const caps = captureMoves(board, "ai");
    if (caps.length){
      const mv = caps[0];
      board[mv.to[0]][mv.to[1]] = 'W'; board[mv.from[0]][mv.from[1]] = '.';
      if (countSide(board, 'B') === 0){ winner = "ai"; draw(); return; }
      turn = "you"; draw(); return;
    }
    const moves = quietMoves(board, "ai");
    if (!moves.length){ winner = "you"; draw(); return; }
    const mv = moves[Math.floor(Math.random() * moves.length)];
    board[mv.to[0]][mv.to[1]] = 'W'; board[mv.from[0]][mv.from[1]] = '.';
    turn = "you"; draw();
  }

  function cellRect(r, c){
    const margin = 24, cs = (size - 2*margin) / N;
    return { x: margin + c*cs, y: 30 + r*cs, w: cs, h: cs };
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "12px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";

    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const rc = cellRect(r, c);
      ctx.fillStyle = "#fff"; ctx.fillRect(rc.x, rc.y, rc.w, rc.h);
      ctx.strokeStyle = "#888"; ctx.strokeRect(rc.x, rc.y, rc.w, rc.h);
      const v = board[r][c]; if (v === '.') continue;
      ctx.beginPath(); ctx.arc(rc.x + rc.w/2, rc.y + rc.h/2, rc.w * 0.35, 0, Math.PI*2);
      ctx.fillStyle = v === 'B' ? "#39c" : "#e60";
      if (sel && sel.r === r && sel.c === c) ctx.fillStyle = "#cef2cf";
      ctx.fill(); ctx.strokeStyle = "#222"; ctx.stroke();
    }

    if (winner) statusEl.textContent = winner === "you" ? "you win!" : "AI wins";
    else statusEl.textContent = turn === "you" ? (sel ? "click target — 1-step move OR straight-line capture" : "click your blue piece") : "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }

  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e);
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const rc = cellRect(r, c);
      if (x < rc.x || x > rc.x + rc.w || y < rc.y || y > rc.y + rc.h) continue;
      if (sel){
        if (sel.r === r && sel.c === c){ sel = null; draw(); return; }
        if (board[r][c] === 'B'){ sel = { r, c }; draw(); return; }
        // try capture
        const caps = captureMoves(board, "you");
        const cap = caps.find(m => m.from[0] === sel.r && m.from[1] === sel.c && m.to[0] === r && m.to[1] === c);
        if (cap){
          board[r][c] = 'B'; board[sel.r][sel.c] = '.'; sel = null;
          if (countSide(board, 'W') === 0){ winner = "you"; draw(); return; }
          turn = "ai"; draw(); setTimeout(aiMove, 400); return;
        }
        // quiet move
        const quiets = quietMoves(board, "you");
        const q = quiets.find(m => m.from[0] === sel.r && m.from[1] === sel.c && m.to[0] === r && m.to[1] === c);
        if (q){
          board[r][c] = 'B'; board[sel.r][sel.c] = '.'; sel = null;
          turn = "ai"; draw(); setTimeout(aiMove, 400); return;
        }
        sel = null; draw(); return;
      } else {
        if (board[r][c] === 'B'){ sel = { r, c }; draw(); }
        return;
      }
    }
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve(){
      if (winner || turn !== "you") return;
      const __caps = captureMoves(board, "you");
      const __mvs = __caps.length ? __caps : quietMoves(board, "you");
      if (!__mvs.length) { winner = "ai"; draw(); return; }
      const __mv = __mvs[Math.floor(Math.random() * __mvs.length)];
      board[__mv.to[0]][__mv.to[1]] = 'B'; board[__mv.from[0]][__mv.from[1]] = '.';
      if (countSide(board, 'W') === 0){ winner = "you"; draw(); return; }
      turn = "ai"; draw();
      setTimeout(aiMove, 80);
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
