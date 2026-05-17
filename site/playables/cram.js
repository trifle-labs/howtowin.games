// Cram — impartial Domineering. Both players place 1×2 dominoes in ANY
// orientation. The player who cannot place a domino loses. 4×4 board solved
// by minimax with memoized bitmask states.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 360);
  canvas.width = size;
  canvas.height = size;
  const statusEl = document.getElementById("playable-status");

  const N = 4;
  let mask, turn, winner, owners;
  let pending; // pending first half of click for orientation choice
  function newGame(){ mask = 0; owners = Array(N*N).fill(null); turn = "you"; winner = null; pending = null; }
  newGame();

  function bit(r, c){ return r*N + c; }
  function isSet(m, r, c){ return (m >> bit(r, c)) & 1; }
  function inBounds(r, c){ return r>=0 && r<N && c>=0 && c<N; }

  function legalMoves(m){
    const out = [];
    for (let r=0; r<N; r++) for (let c=0; c<N; c++){
      if (isSet(m, r, c)) continue;
      if (r+1<N && !isSet(m, r+1, c)) out.push({ r, c, dr: 1, dc: 0 });
      if (c+1<N && !isSet(m, r, c+1)) out.push({ r, c, dr: 0, dc: 1 });
    }
    return out;
  }

  function applyM(m, mv){
    return m | (1 << bit(mv.r, mv.c)) | (1 << bit(mv.r+mv.dr, mv.c+mv.dc));
  }

  const memo = new Map();
  function isWinning(m){
    if (memo.has(m)) return memo.get(m);
    const moves = legalMoves(m);
    if (!moves.length){ memo.set(m, false); return false; }
    for (const mv of moves){
      if (!isWinning(applyM(m, mv))){ memo.set(m, true); return true; }
    }
    memo.set(m, false); return false;
  }

  function bestMove(m){
    const moves = legalMoves(m);
    if (!moves.length) return null;
    for (const mv of moves){ if (!isWinning(applyM(m, mv))) return mv; }
    return moves[0];
  }

  function aiMove(){
    if (winner) return;
    const mv = bestMove(mask);
    if (!mv){ winner = "you"; draw(); return; }
    mask = applyM(mask, mv);
    owners[bit(mv.r, mv.c)] = "ai"; owners[bit(mv.r+mv.dr, mv.c+mv.dc)] = "ai";
    if (!legalMoves(mask).length){ winner = "ai"; draw(); return; }
    turn = "you"; draw();
  }

  function cellRect(r, c){ const margin=30, s=(size-2*margin)/N; return { x: margin+c*s, y: margin+r*s, w: s, h: s }; }

  function draw(){
    ctx.fillStyle="#fafaf7"; ctx.fillRect(0,0,size,size);
    ctx.font="13px sans-serif"; ctx.textAlign="center"; ctx.fillStyle="#444";
    ctx.fillText(`Cram 4×4 — place a domino in any orientation; no move = lose`, size/2, 20);

    for (let r=0; r<N; r++) for (let c=0; c<N; c++){
      const cell = cellRect(r, c);
      ctx.fillStyle = "#fff"; ctx.fillRect(cell.x, cell.y, cell.w, cell.h);
      ctx.strokeStyle="#bbb"; ctx.lineWidth=1; ctx.strokeRect(cell.x, cell.y, cell.w, cell.h);
    }

    for (let r=0; r<N; r++) for (let c=0; c<N; c++){
      if (owners[bit(r,c)]){
        const cell = cellRect(r, c);
        ctx.fillStyle = owners[bit(r,c)] === "you" ? "#5a7" : "#a55";
        ctx.fillRect(cell.x + 4, cell.y + 4, cell.w - 8, cell.h - 8);
      }
    }

    if (pending){
      const cell = cellRect(pending.r, pending.c);
      ctx.strokeStyle="#dc8"; ctx.lineWidth=3; ctx.strokeRect(cell.x+2, cell.y+2, cell.w-4, cell.h-4);
    }

    if (winner) statusEl.textContent = winner === "you" ? "you win!" : "AI wins!";
    else if (pending) statusEl.textContent = "now click an adjacent empty cell to complete the domino";
    else statusEl.textContent = turn === "you" ? "your turn — click an empty cell, then an adjacent one" : "AI thinking…";
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
    if (isSet(mask, hit.r, hit.c)){ pending = null; draw(); return; }
    if (!pending){ pending = hit; draw(); return; }
    // Pending exists; check adjacency.
    const dr = hit.r - pending.r, dc = hit.c - pending.c;
    if (Math.abs(dr) + Math.abs(dc) !== 1){ pending = hit; draw(); return; }
    const mv = { r: Math.min(pending.r, hit.r), c: Math.min(pending.c, hit.c), dr: Math.abs(dr), dc: Math.abs(dc) };
    mask = applyM(mask, mv);
    owners[bit(mv.r, mv.c)] = "you"; owners[bit(mv.r+mv.dr, mv.c+mv.dc)] = "you";
    pending = null;
    if (!legalMoves(mask).length){ winner = "you"; draw(); return; }
    turn = "ai"; draw(); setTimeout(aiMove, 500);
  }

  canvas.addEventListener("click", onClick); draw();
  return {
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0,0,size,size); memo.clear(); },
    restart(){ newGame(); memo.clear(); draw(); },
    solve(){
      if (winner || turn !== "you") return;
      const mv = bestMove(mask);
      if (!mv){ winner = "ai"; draw(); return; }
      mask = applyM(mask, mv);
      owners[bit(mv.r, mv.c)] = "you"; owners[bit(mv.r+mv.dr, mv.c+mv.dc)] = "you";
      if (!legalMoves(mask).length){ winner = "you"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 500);
    },
  };
}
