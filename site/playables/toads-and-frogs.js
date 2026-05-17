// Toads and Frogs — 1×N strip. You play Toads (T, move right), AI plays Frogs
// (F, move left). On your turn: step a T one cell right into empty, or jump a T
// over an adjacent F into empty. F moves left similarly. No move = lose.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 480);
  canvas.width = size;
  canvas.height = 180;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) {
    const w = canvas.width, h = canvas.height;
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    canvas.width = w * dpr; canvas.height = h * dpr; ctx.scale(dpr, dpr);
  }
  const statusEl = document.getElementById("playable-status");

  const N = 7; // strip length
  // Start: T T T _ F F F (length 7, with one empty in middle).
  // Length 7 too narrow; use length 8: T T T _ _ F F F? Let's do "TT_FF" style.
  // Actually with 3-each on length 7 there's 1 gap; on 8 there are 2 gaps. Use 7 with 3T+3F+1gap.
  let board, turn, winner, sel;
  function newGame(){ board = ["T","T","T",".","F","F","F"]; turn="you"; winner=null; sel=-1; }
  newGame();

  function legalMoves(b, side){
    const out = [], piece = side === "you" ? "T" : "F";
    const dir = side === "you" ? 1 : -1;
    const opp = side === "you" ? "F" : "T";
    for (let i=0; i<b.length; i++){
      if (b[i] !== piece) continue;
      const step = i + dir;
      if (step >= 0 && step < b.length && b[step] === "."){
        out.push({ from: i, to: step });
      }
      const jump = i + 2*dir;
      if (jump >= 0 && jump < b.length && b[step] === opp && b[jump] === "."){
        out.push({ from: i, to: jump });
      }
    }
    return out;
  }

  function apply(b, m){
    const nb = b.slice();
    nb[m.to] = nb[m.from]; nb[m.from] = ".";
    return nb;
  }

  const memo = new Map();
  function isWinning(b, side){
    const k = b.join("") + side;
    if (memo.has(k)) return memo.get(k);
    const moves = legalMoves(b, side);
    if (!moves.length){ memo.set(k, false); return false; }
    for (const m of moves){
      const nb = apply(b, m);
      if (!isWinning(nb, side === "you" ? "ai" : "you")){ memo.set(k, true); return true; }
    }
    memo.set(k, false); return false;
  }

  function bestMove(b, side){
    const moves = legalMoves(b, side);
    if (!moves.length) return null;
    for (const m of moves){
      if (!isWinning(apply(b, m), side === "you" ? "ai" : "you")) return m;
    }
    return moves[0];
  }

  function aiMove(){
    if (winner) return;
    const m = bestMove(board, "ai");
    if (!m){ winner = "you"; draw(); return; }
    board = apply(board, m);
    if (!legalMoves(board, "you").length){ winner = "ai"; draw(); return; }
    turn = "you"; draw();
  }

  function cellRect(i){
    const margin = 30, gap = 4;
    const cw = (size - 2*margin - (N-1)*gap) / N;
    return { x: margin + i*(cw + gap), y: 60, w: cw, h: 60 };
  }

  function draw(){
    ctx.fillStyle="#fafaf7"; ctx.fillRect(0,0,size,180);
    ctx.font="13px sans-serif"; ctx.textAlign="center"; ctx.fillStyle="#444";
    ctx.fillText(`Toads and Frogs — Toads (you) go RIGHT, Frogs (AI) go LEFT`, size/2, 22);

    const myMoves = turn === "you" ? legalMoves(board, "you") : [];
    const targetSet = sel >= 0 ? new Set(myMoves.filter(m => m.from === sel).map(m => m.to)) : new Set();

    for (let i=0; i<N; i++){
      const c = cellRect(i);
      ctx.fillStyle = "#fff"; ctx.fillRect(c.x, c.y, c.w, c.h);
      ctx.strokeStyle = sel === i ? "#dc8" : "#888"; ctx.lineWidth = sel === i ? 3 : 1;
      ctx.strokeRect(c.x, c.y, c.w, c.h);
      if (targetSet.has(i)){
        ctx.fillStyle = "rgba(60,150,60,0.3)"; ctx.fillRect(c.x+2, c.y+2, c.w-4, c.h-4);
      }
      if (board[i] !== "."){
        ctx.fillStyle = board[i] === "T" ? "#5a7" : "#a55";
        ctx.beginPath(); ctx.arc(c.x + c.w/2, c.y + c.h/2, Math.min(c.w, c.h)*0.35, 0, Math.PI*2);
        ctx.fill();
        ctx.fillStyle = "#fff"; ctx.font = "bold 14px sans-serif"; ctx.textAlign="center"; ctx.textBaseline="middle";
        ctx.fillText(board[i], c.x + c.w/2, c.y + c.h/2);
        ctx.textBaseline = "alphabetic";
      }
    }

    if (winner) statusEl.textContent = winner === "you" ? "you win — AI has no move!" : "AI wins — you have no move!";
    else if (sel >= 0) statusEl.textContent = "click a highlighted cell to move there (or click another T to reselect)";
    else statusEl.textContent = turn === "you" ? "your turn — click a Toad" : "AI thinking…";
  }

  function clickPos(e){ const r=canvas.getBoundingClientRect(); return {x:(e.clientX-r.left)*(size/r.width), y:(e.clientY-r.top)*(180/r.height)}; }
  function findCell(x, y){ for (let i=0;i<N;i++){ const c=cellRect(i); if (x>=c.x&&x<=c.x+c.w&&y>=c.y&&y<=c.y+c.h) return i; } return -1; }

  function onClick(e){
    if (winner || turn !== "you") return;
    const {x,y} = clickPos(e); const i = findCell(x, y);
    if (i < 0) return;
    if (board[i] === "T"){ sel = i; draw(); return; }
    if (sel >= 0){
      const moves = legalMoves(board, "you").filter(m => m.from === sel && m.to === i);
      if (moves.length){
        board = apply(board, moves[0]);
        sel = -1;
        if (!legalMoves(board, "ai").length){ winner = "you"; draw(); return; }
        turn = "ai"; draw(); setTimeout(aiMove, 500); return;
      }
    }
  }

  canvas.addEventListener("click", onClick); draw();
  return {
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0,0,size,180); memo.clear(); },
    restart(){ newGame(); memo.clear(); draw(); },
    solve(){
      if (winner || turn !== "you") return;
      const m = bestMove(board, "you");
      if (!m){ winner = "ai"; draw(); return; }
      board = apply(board, m); sel = -1;
      if (!legalMoves(board, "ai").length){ winner = "you"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 500);
    },
  };
}
