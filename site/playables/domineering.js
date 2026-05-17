// Domineering — 4×4 partisan. You (Vertical) place 1×2 vertical dominoes; AI
// (Horizontal) places 1×2 horizontal dominoes. Player with no move loses.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 360);
  canvas.width = size;
  canvas.height = size;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) {
    const w = canvas.width, h = canvas.height;
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    canvas.width = w * dpr; canvas.height = h * dpr; ctx.scale(dpr, dpr);
  }
  const statusEl = document.getElementById("playable-status");

  const N = 4; // 4x4 board
  let mask, turn, winner, owners; // owners[i] = "V" or "H" or null
  function newGame(){ mask = 0; owners = Array(N*N).fill(null); turn = "you"; winner = null; }
  newGame();

  function bit(r, c){ return r*N + c; }
  function isSet(m, r, c){ return (m >> bit(r, c)) & 1; }

  function legalMoves(m, side){
    const out = [];
    if (side === "V"){
      for (let r=0; r<N-1; r++) for (let c=0; c<N; c++)
        if (!isSet(m, r, c) && !isSet(m, r+1, c)) out.push({ r, c });
    } else {
      for (let r=0; r<N; r++) for (let c=0; c<N-1; c++)
        if (!isSet(m, r, c) && !isSet(m, r, c+1)) out.push({ r, c });
    }
    return out;
  }

  function applyM(m, side, mv){
    let nm = m | (1 << bit(mv.r, mv.c));
    if (side === "V") nm |= (1 << bit(mv.r+1, mv.c));
    else nm |= (1 << bit(mv.r, mv.c+1));
    return nm;
  }

  const memo = new Map();
  function key(m, side){ return m * 2 + (side === "V" ? 0 : 1); }
  function isWinning(m, side){
    const k = key(m, side); if (memo.has(k)) return memo.get(k);
    const moves = legalMoves(m, side);
    if (!moves.length){ memo.set(k, false); return false; }
    for (const mv of moves){
      if (!isWinning(applyM(m, side, mv), side === "V" ? "H" : "V")){
        memo.set(k, true); return true;
      }
    }
    memo.set(k, false); return false;
  }

  function bestMove(m, side){
    const moves = legalMoves(m, side);
    if (!moves.length) return null;
    for (const mv of moves){
      if (!isWinning(applyM(m, side, mv), side === "V" ? "H" : "V")) return mv;
    }
    return moves[0];
  }

  function aiMove(){
    if (winner) return;
    const mv = bestMove(mask, "H");
    if (!mv){ winner = "you"; draw(); return; }
    mask = applyM(mask, "H", mv);
    owners[bit(mv.r, mv.c)] = "H"; owners[bit(mv.r, mv.c+1)] = "H";
    // Check if you have a move
    if (!legalMoves(mask, "V").length){ winner = "ai"; draw(); return; }
    turn = "you"; draw();
  }

  function cellRect(r, c){
    const margin = 30;
    const cellSize = (size - 2*margin) / N;
    return { x: margin + c*cellSize, y: margin + r*cellSize, w: cellSize, h: cellSize };
  }

  function draw(){
    ctx.fillStyle="#fafaf7"; ctx.fillRect(0,0,size,size);
    ctx.font="13px sans-serif"; ctx.textAlign="center"; ctx.fillStyle="#444";
    ctx.fillText(`Domineering 4×4 — you (V) place vertical, AI (H) horizontal`, size/2, 20);

    // Grid
    for (let r=0; r<N; r++) for (let c=0; c<N; c++){
      const cell = cellRect(r, c);
      ctx.fillStyle = "#fff"; ctx.fillRect(cell.x, cell.y, cell.w, cell.h);
      ctx.strokeStyle="#bbb"; ctx.lineWidth=1; ctx.strokeRect(cell.x, cell.y, cell.w, cell.h);
    }

    // Pieces
    for (let r=0; r<N; r++) for (let c=0; c<N; c++){
      if (owners[bit(r,c)]){
        const cell = cellRect(r, c);
        ctx.fillStyle = owners[bit(r,c)] === "V" ? "#5a7" : "#a55";
        ctx.fillRect(cell.x + 4, cell.y + 4, cell.w - 8, cell.h - 8);
      }
    }

    if (winner) statusEl.textContent = winner === "you" ? "you win — AI has no move!" : "AI wins — you have no move!";
    else statusEl.textContent = turn === "you" ? "your turn — click a cell to place vertical domino (extends down)" : "AI thinking…";
  }

  function clickPos(e){ const r=canvas.getBoundingClientRect(); return {x:(e.clientX-r.left)*(size/r.width), y:(e.clientY-r.top)*(size/r.height)}; }
  function findCell(x, y){
    for (let r=0; r<N; r++) for (let c=0; c<N; c++){
      const cell = cellRect(r, c);
      if (x>=cell.x && x<=cell.x+cell.w && y>=cell.y && y<=cell.y+cell.h) return { r, c };
    }
    return null;
  }

  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = clickPos(e); const hit = findCell(x, y);
    if (!hit) return;
    // Must place vertical at (r, c) with r+1 < N and both cells empty.
    if (hit.r >= N-1) return;
    if (isSet(mask, hit.r, hit.c) || isSet(mask, hit.r+1, hit.c)) return;
    mask = applyM(mask, "V", hit);
    owners[bit(hit.r, hit.c)] = "V"; owners[bit(hit.r+1, hit.c)] = "V";
    if (!legalMoves(mask, "H").length){ winner = "you"; draw(); return; }
    turn = "ai"; draw(); setTimeout(aiMove, 500);
  }

  canvas.addEventListener("click", onClick); draw();
  return {
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0,0,size,size); memo.clear(); },
    restart(){ newGame(); memo.clear(); draw(); },
    solve(){
      if (winner || turn !== "you") return;
      const mv = bestMove(mask, "V");
      if (!mv){ winner = "ai"; draw(); return; }
      mask = applyM(mask, "V", mv);
      owners[bit(mv.r, mv.c)] = "V"; owners[bit(mv.r+1, mv.c)] = "V";
      if (!legalMoves(mask, "H").length){ winner = "you"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 500);
    },
  };
}
