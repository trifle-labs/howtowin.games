// Amazons — queens that shoot arrows. Reduced to a 6×6 board for tractability.
// Each player has 3 amazons. Move = queen move then shoot an arrow queen-wise
// from the new square; arrows permanently block cells. Player with no legal
// move loses. AI: heuristic — pick move maximising own mobility minus opp.

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = size + 30;
  const W = canvas.width, H = canvas.height;
  const statusEl = document.getElementById("playable-status");

  const N = 6;
  // '.' empty, 'B' your amazon, 'W' AI amazon, 'X' arrow
  let board, turn, winner, sel, phase; // phase: 'move' or 'shoot'
  function newGame(){
    board = Array.from({ length: N }, () => new Array(N).fill('.'));
    // your amazons (B) on row N-1; ai (W) on row 0; 3 each at cols 1,3,5 / 0,2,4
    board[N-1][1] = 'B'; board[N-1][3] = 'B'; board[N-1][4] = 'B';
    board[0][1] = 'W'; board[0][2] = 'W'; board[0][4] = 'W';
    turn = "you"; winner = null; sel = null; phase = "move";
  }
  newGame();

  function queenMoves(b, r, c){
    const out = [];
    for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]]){
      for (let k = 1; k < N; k++){
        const nr = r + dr*k, nc = c + dc*k;
        if (nr < 0 || nr >= N || nc < 0 || nc >= N) break;
        if (b[nr][nc] !== '.') break;
        out.push([nr, nc]);
      }
    }
    return out;
  }

  function mobility(b, side){
    const ch = side === "you" ? 'B' : 'W';
    let count = 0;
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      if (b[r][c] !== ch) continue;
      count += queenMoves(b, r, c).length;
    }
    return count;
  }
  function anyMove(b, side){
    const ch = side === "you" ? 'B' : 'W';
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      if (b[r][c] !== ch) continue;
      if (queenMoves(b, r, c).length > 0) return true;
    }
    return false;
  }

  function aiMove(){
    if (winner) return;
    // For each AI amazon and each move and each arrow target, score = our_mobility - opp_mobility
    let best = null, bestScore = -Infinity;
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      if (board[r][c] !== 'W') continue;
      for (const [nr, nc] of queenMoves(board, r, c)){
        board[r][c] = '.'; board[nr][nc] = 'W';
        for (const [ar, ac] of queenMoves(board, nr, nc)){
          board[ar][ac] = 'X';
          const score = mobility(board, "ai") - mobility(board, "you") - (ar === nr && ac === nc ? 100 : 0);
          if (score > bestScore){ bestScore = score; best = { from: [r,c], to: [nr,nc], arrow: [ar,ac] }; }
          board[ar][ac] = '.';
        }
        board[nr][nc] = '.'; board[r][c] = 'W';
      }
    }
    if (!best){ winner = "you"; draw(); return; }
    board[best.from[0]][best.from[1]] = '.'; board[best.to[0]][best.to[1]] = 'W'; board[best.arrow[0]][best.arrow[1]] = 'X';
    if (!anyMove(board, "you")){ winner = "ai"; draw(); return; }
    turn = "you"; phase = "move"; draw();
  }

  function cellRect(r, c){
    const margin = 12, cs = (size - 2*margin) / N;
    return { x: margin + c*cs, y: 30 + r*cs, w: cs, h: cs };
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "13px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";

    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const rc = cellRect(r, c);
      ctx.fillStyle = (r + c) % 2 === 0 ? "#fff" : "#eee";
      ctx.fillRect(rc.x, rc.y, rc.w, rc.h);
      ctx.strokeStyle = "#888"; ctx.strokeRect(rc.x, rc.y, rc.w, rc.h);
      const v = board[r][c];
      if (v === 'B' || v === 'W'){
        ctx.beginPath(); ctx.arc(rc.x + rc.w/2, rc.y + rc.h/2, rc.w * 0.35, 0, Math.PI*2);
        ctx.fillStyle = v === 'B' ? "#39c" : "#e60";
        if (sel && sel.r === r && sel.c === c) ctx.fillStyle = "#cef2cf";
        ctx.fill(); ctx.strokeStyle = "#222"; ctx.stroke();
      } else if (v === 'X'){
        ctx.fillStyle = "#444"; ctx.beginPath(); ctx.arc(rc.x + rc.w/2, rc.y + rc.h/2, rc.w * 0.22, 0, Math.PI*2); ctx.fill();
      }
    }
    if (turn === "you" && !winner && sel){
      const moves = phase === "move" ? queenMoves(board, sel.r, sel.c) : queenMoves(board, sel.r, sel.c);
      for (const [r, c] of moves){
        const rc = cellRect(r, c);
        ctx.strokeStyle = "#0a0"; ctx.lineWidth = 3; ctx.strokeRect(rc.x + 2, rc.y + 2, rc.w - 4, rc.h - 4); ctx.lineWidth = 1;
      }
    }

    if (winner) statusEl.textContent = winner === "you" ? "you win!" : "AI wins";
    else if (turn === "you"){
      if (phase === "move") statusEl.textContent = sel ? "click destination, or click amazon to deselect" : "click one of your amazons";
      else statusEl.textContent = "now click an empty square (queen-wise from new spot) to shoot an arrow";
    } else statusEl.textContent = "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }

  function cellAt(x, y){
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const rc = cellRect(r, c);
      if (x >= rc.x && x <= rc.x + rc.w && y >= rc.y && y <= rc.y + rc.h) return [r, c];
    }
    return null;
  }

  let movedTo = null;
  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e); const cell = cellAt(x, y); if (!cell) return;
    const [r, c] = cell;
    if (phase === "move"){
      if (sel){
        if (sel.r === r && sel.c === c){ sel = null; draw(); return; }
        const valid = queenMoves(board, sel.r, sel.c).some(([nr, nc]) => nr === r && nc === c);
        if (!valid){ if (board[r][c] === 'B'){ sel = { r, c }; draw(); } return; }
        board[sel.r][sel.c] = '.'; board[r][c] = 'B';
        movedTo = { r, c }; sel = { r, c }; phase = "shoot"; draw();
      } else {
        if (board[r][c] === 'B'){ sel = { r, c }; draw(); }
      }
    } else {
      const valid = queenMoves(board, movedTo.r, movedTo.c).some(([nr, nc]) => nr === r && nc === c);
      if (!valid) return;
      board[r][c] = 'X'; sel = null; movedTo = null; phase = "move";
      if (!anyMove(board, "ai")){ winner = "you"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 400);
    }
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve() {
      if (winner || turn !== "you") return;
      // Collect all full moves (from, to, arrow) for player 'B'
      const __mvs = [];
      for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
        if (board[r][c] !== 'B') continue;
        for (const [nr, nc] of queenMoves(board, r, c)) {
          board[r][c] = '.'; board[nr][nc] = 'B';
          for (const [ar, ac] of queenMoves(board, nr, nc)) {
            __mvs.push({ from: [r,c], to: [nr,nc], arrow: [ar,ac] });
          }
          board[nr][nc] = '.'; board[r][c] = 'B';
        }
      }
      if (!__mvs.length) { winner = "ai"; draw(); return; }
      const __mv = __mvs[Math.floor(Math.random() * __mvs.length)];
      board[__mv.from[0]][__mv.from[1]] = '.';
      board[__mv.to[0]][__mv.to[1]] = 'B';
      board[__mv.arrow[0]][__mv.arrow[1]] = 'X';
      if (!anyMove(board, "ai")) { winner = "you"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 80);
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); movedTo = null; draw(); },
  };
}
