// Dara — 5×6 grid. Two-phase: placement (12 pieces each) then movement (slide
// orthogonally one step). Forming three-in-a-row (a "ngiriki") removes one
// enemy piece — but a player can never have FOUR in a row, and never reforms
// the same three. Lose by being reduced below 3 pieces.
// AI: simple heuristic.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = size + 40;
  const W = canvas.width, H = canvas.height;
  const statusEl = document.getElementById("playable-status");

  const R = 5, C = 6;
  let board, phase, placed, turn, winner, captureMode, sel;
  function newGame(){
    board = new Array(R*C).fill('.');
    phase = "place"; placed = { you: 0, ai: 0 };
    turn = "you"; winner = null; captureMode = false; sel = -1;
  }
  newGame();

  function isThree(b, i, side){
    const r = Math.floor(i / C), c = i % C;
    for (const [dr, dc] of [[0,1],[1,0]]){
      for (let off = -2; off <= 0; off++){
        const cells = [];
        for (let k = 0; k < 3; k++){
          const nr = r + (off + k) * dr, nc = c + (off + k) * dc;
          if (nr < 0 || nr >= R || nc < 0 || nc >= C){ cells.length = 0; break; }
          cells.push(nr * C + nc);
        }
        if (cells.length !== 3) continue;
        if (cells.every(k => b[k] === side)) return true;
      }
    }
    return false;
  }

  function isFour(b, i, side){
    // wouldn't form 4-in-a-row?
    const r = Math.floor(i / C), c = i % C;
    for (const [dr, dc] of [[0,1],[1,0]]){
      for (let off = -3; off <= 0; off++){
        const cells = [];
        for (let k = 0; k < 4; k++){
          const nr = r + (off + k) * dr, nc = c + (off + k) * dc;
          if (nr < 0 || nr >= R || nc < 0 || nc >= C){ cells.length = 0; break; }
          cells.push(nr * C + nc);
        }
        if (cells.length !== 4) continue;
        if (cells.every(k => b[k] === side)) return true;
      }
    }
    return false;
  }

  function count(b, side){ let n = 0; for (const v of b) if (v === side) n++; return n; }
  function adj(i){
    const r = Math.floor(i / C), c = i % C;
    const out = [];
    for (const [dr, dc] of [[1,0],[-1,0],[0,1],[0,-1]]){
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < R && nc >= 0 && nc < C) out.push(nr*C + nc);
    }
    return out;
  }

  function aiAction(){
    if (phase === "place"){
      // try threes
      for (let i = 0; i < R*C; i++) if (board[i] === '.'){
        board[i] = 'w';
        if (!isFour(board, i, 'w') && isThree(board, i, 'w')){ board[i] = '.'; return { kind: 'place', to: i }; }
        board[i] = '.';
      }
      for (let i = 0; i < R*C; i++) if (board[i] === '.'){
        board[i] = 'w';
        if (!isFour(board, i, 'w')){ board[i] = '.'; return { kind: 'place', to: i }; }
        board[i] = '.';
      }
      return null;
    }
    // movement
    for (let i = 0; i < R*C; i++) if (board[i] === 'w'){
      for (const j of adj(i)) if (board[j] === '.'){
        board[j] = 'w'; board[i] = '.';
        const ok = !isFour(board, j, 'w');
        const three = isThree(board, j, 'w');
        board[i] = 'w'; board[j] = '.';
        if (ok && three) return { kind: 'move', from: i, to: j };
      }
    }
    for (let i = 0; i < R*C; i++) if (board[i] === 'w'){
      for (const j of adj(i)) if (board[j] === '.'){
        board[j] = 'w'; board[i] = '.';
        const ok = !isFour(board, j, 'w');
        board[i] = 'w'; board[j] = '.';
        if (ok) return { kind: 'move', from: i, to: j };
      }
    }
    return null;
  }

  function aiCapture(){
    for (let i = 0; i < R*C; i++) if (board[i] === 'b' && !isThree(board, i, 'b')) return i;
    for (let i = 0; i < R*C; i++) if (board[i] === 'b') return i;
    return -1;
  }

  function aiMove(){
    if (winner) return;
    const a = aiAction(); if (!a){ winner = "you"; draw(); return; }
    if (a.kind === 'place'){ board[a.to] = 'w'; placed.ai++; }
    else { board[a.to] = 'w'; board[a.from] = '.'; }
    if (isThree(board, a.to, 'w')){ const ci = aiCapture(); if (ci >= 0) board[ci] = '.'; if (count(board, 'b') < 3){ winner = "ai"; draw(); return; } }
    if (placed.you >= 12 && placed.ai >= 12) phase = "move";
    turn = "you"; draw();
  }

  function cellRect(r, c){
    const margin = 24, cw = (size - 2*margin) / C, ch = (size - 30) / R;
    return { x: margin + c*cw, y: 30 + r*ch, w: cw, h: ch };
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "12px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";
    ctx.fillText(`Dara — ${phase === "place" ? `placement (you ${placed.you}/12, ai ${placed.ai}/12)` : "movement"}`, W/2, 20);

    for (let r = 0; r < R; r++) for (let c = 0; c < C; c++){
      const rc = cellRect(r, c);
      ctx.fillStyle = "#fff"; ctx.fillRect(rc.x, rc.y, rc.w, rc.h);
      ctx.strokeStyle = sel === r*C + c ? "#0a0" : "#888"; ctx.lineWidth = sel === r*C + c ? 3 : 1;
      ctx.strokeRect(rc.x, rc.y, rc.w, rc.h); ctx.lineWidth = 1;
      const v = board[r*C + c]; if (v === '.') continue;
      ctx.beginPath(); ctx.arc(rc.x + rc.w/2, rc.y + rc.h/2, Math.min(rc.w, rc.h) * 0.3, 0, Math.PI*2);
      ctx.fillStyle = v === 'b' ? "#39c" : "#e60"; ctx.fill();
      ctx.strokeStyle = "#222"; ctx.stroke();
    }

    if (winner) statusEl.textContent = winner === "you" ? "you win!" : "AI wins";
    else if (turn === "you"){
      if (captureMode) statusEl.textContent = "you formed a three — click an enemy piece to remove";
      else if (phase === "place") statusEl.textContent = "click empty cell to place (no 4-in-a-row)";
      else statusEl.textContent = sel < 0 ? "click your piece to move" : "click an adjacent empty cell";
    } else statusEl.textContent = "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }
  function findCell(x, y){
    for (let r = 0; r < R; r++) for (let c = 0; c < C; c++){
      const rc = cellRect(r, c);
      if (x >= rc.x && x <= rc.x + rc.w && y >= rc.y && y <= rc.y + rc.h) return r*C + c;
    }
    return -1;
  }

  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e); const i = findCell(x, y); if (i < 0) return;
    if (captureMode){
      if (board[i] !== 'w') return;
      board[i] = '.'; captureMode = false;
      if (count(board, 'w') < 3 && placed.ai >= 12){ winner = "you"; draw(); return; }
      if (placed.you >= 12 && placed.ai >= 12) phase = "move";
      turn = "ai"; draw(); setTimeout(aiMove, 400); return;
    }
    if (phase === "place"){
      if (board[i] !== '.') return;
      board[i] = 'b';
      if (isFour(board, i, 'b')){ board[i] = '.'; statusEl.textContent = "no 4-in-a-row allowed"; return; }
      placed.you++;
      if (isThree(board, i, 'b')){ captureMode = true; draw(); return; }
      if (placed.you >= 12 && placed.ai >= 12) phase = "move";
      turn = "ai"; draw(); setTimeout(aiMove, 400);
    } else {
      if (sel < 0){ if (board[i] === 'b'){ sel = i; draw(); } return; }
      if (i === sel){ sel = -1; draw(); return; }
      if (board[i] !== '.' || !adj(sel).includes(i)){ sel = -1; draw(); return; }
      board[i] = 'b'; board[sel] = '.';
      if (isFour(board, i, 'b')){ board[i] = '.'; board[sel] = 'b'; sel = -1; statusEl.textContent = "no 4-in-a-row allowed"; return; }
      const moved = i; sel = -1;
      if (isThree(board, moved, 'b')){ captureMode = true; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 400);
    }
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve() {
      if (winner || turn !== "you") return;
      if (captureMode) {
        // remove a random enemy piece (not part of a three if possible)
        let __ci = -1;
        for (let i = 0; i < R*C; i++) if (board[i] === 'w' && !isThree(board, i, 'w')) { __ci = i; break; }
        if (__ci < 0) for (let i = 0; i < R*C; i++) if (board[i] === 'w') { __ci = i; break; }
        if (__ci < 0) { captureMode = false; } else {
          board[__ci] = '.'; captureMode = false;
          if (count(board, 'w') < 3 && placed.ai >= 12) { winner = "you"; draw(); return; }
          if (placed.you >= 12 && placed.ai >= 12) phase = "move";
          turn = "ai"; draw(); setTimeout(aiMove, 80); return;
        }
      }
      if (phase === "place") {
        const __mvs = [];
        for (let i = 0; i < R*C; i++) {
          if (board[i] !== '.') continue;
          board[i] = 'b';
          if (!isFour(board, i, 'b')) __mvs.push(i);
          board[i] = '.';
        }
        if (!__mvs.length) { winner = "ai"; draw(); return; }
        const __mv = __mvs[Math.floor(Math.random() * __mvs.length)];
        board[__mv] = 'b'; placed.you++;
        if (isThree(board, __mv, 'b')) { captureMode = true; draw(); return; }
        if (placed.you >= 12 && placed.ai >= 12) phase = "move";
        turn = "ai"; draw(); setTimeout(aiMove, 80);
      } else {
        // movement phase: collect all valid (from, to) pairs
        const __mvs = [];
        for (let i = 0; i < R*C; i++) {
          if (board[i] !== 'b') continue;
          for (const j of adj(i)) {
            if (board[j] !== '.') continue;
            board[j] = 'b'; board[i] = '.';
            if (!isFour(board, j, 'b')) __mvs.push([i, j]);
            board[i] = 'b'; board[j] = '.';
          }
        }
        if (!__mvs.length) { winner = "ai"; draw(); return; }
        const [__from, __to] = __mvs[Math.floor(Math.random() * __mvs.length)];
        board[__to] = 'b'; board[__from] = '.'; sel = -1;
        if (isThree(board, __to, 'b')) { captureMode = true; draw(); return; }
        turn = "ai"; draw(); setTimeout(aiMove, 80);
      }
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
