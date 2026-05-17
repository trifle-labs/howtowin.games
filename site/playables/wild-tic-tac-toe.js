// Wild Tic-Tac-Toe — 3×3. Either player may place X OR O on their turn. First
// to complete 3-in-a-row of either symbol WINS. Solved: first player wins.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 360);
  canvas.width = size;
  canvas.height = size + 60;
  const H = canvas.height;
  const statusEl = document.getElementById("playable-status");

  const LINES = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6],
  ];

  let board, turn, winner, sel, place;
  function newGame(){ board = Array(9).fill(0); turn="you"; winner=null; sel=-1; place="X"; }
  newGame();

  function hasLine(b){
    for (const L of LINES){
      const a = b[L[0]];
      if (a && a === b[L[1]] && a === b[L[2]]) return true;
    }
    return false;
  }

  function empties(b){ const o = []; for (let i=0;i<9;i++) if (!b[i]) o.push(i); return o; }

  const memo = new Map();
  function isWinning(b, side){
    // side is to-move; returns true if side wins with best play.
    const k = b.join("") + side;
    if (memo.has(k)) return memo.get(k);
    const opts = empties(b);
    if (!opts.length){ memo.set(k, false); return false; } // draw treated as loss for to-move
    for (const i of opts) for (const sym of ["X","O"]){
      const nb = b.slice(); nb[i] = sym;
      if (hasLine(nb)){ memo.set(k, true); return true; }
      if (!isWinning(nb, side === "you" ? "ai" : "you")){ memo.set(k, true); return true; }
    }
    memo.set(k, false); return false;
  }

  function bestMove(b){
    const opts = empties(b);
    for (const i of opts) for (const sym of ["X","O"]){
      const nb = b.slice(); nb[i] = sym;
      if (hasLine(nb)) return { i, sym };
      if (!isWinning(nb, "you")) return { i, sym };
    }
    return opts.length ? { i: opts[0], sym: "X" } : null;
  }

  function aiMove(){
    if (winner) return;
    const m = bestMove(board);
    if (!m){ winner = "draw"; draw(); return; }
    board[m.i] = m.sym;
    if (hasLine(board)){ winner = "ai"; draw(); return; }
    if (!empties(board).length){ winner = "draw"; draw(); return; }
    turn = "you"; draw();
  }

  function cellRect(i){
    const margin = 20, gap = 4;
    const cw = (size - 2*margin - 2*gap) / 3;
    const r = Math.floor(i / 3), c = i % 3;
    return { x: margin + c*(cw + gap), y: 50 + r*(cw + gap), w: cw, h: cw };
  }

  function draw(){
    ctx.fillStyle="#fafaf7"; ctx.fillRect(0,0,size,H);
    ctx.font="13px sans-serif"; ctx.textAlign="center"; ctx.fillStyle="#444";
    ctx.fillText(`Wild Tic-Tac-Toe — either symbol; first 3-in-a-row WINS`, size/2, 22);
    ctx.fillText(`you place: ${place}  (toggle with X/O key)`, size/2, 42);

    for (let i=0; i<9; i++){
      const r = cellRect(i);
      ctx.fillStyle = sel === i ? "#ffe9b0" : "#fff";
      ctx.fillRect(r.x, r.y, r.w, r.h);
      ctx.strokeStyle = "#888"; ctx.lineWidth = 1; ctx.strokeRect(r.x, r.y, r.w, r.h);
      if (board[i]){
        ctx.fillStyle = "#222"; ctx.font = `bold ${Math.floor(r.w*0.7)}px sans-serif`;
        ctx.textAlign="center"; ctx.textBaseline="middle";
        ctx.fillText(board[i], r.x + r.w/2, r.y + r.h/2);
        ctx.textBaseline="alphabetic";
      }
    }

    if (winner === "draw") statusEl.textContent = "draw — board full with no line";
    else if (winner === "you") statusEl.textContent = "you win!";
    else if (winner === "ai") statusEl.textContent = "AI wins!";
    else statusEl.textContent = turn === "you" ? `click an empty cell to place ${place}` : "AI thinking…";
  }

  function clickPos(e){ const r=canvas.getBoundingClientRect(); return {x:(e.clientX-r.left)*(size/r.width), y:(e.clientY-r.top)*(H/r.height)}; }
  function findCell(x, y){
    for (let i=0; i<9; i++){ const r = cellRect(i); if (x>=r.x&&x<=r.x+r.w&&y>=r.y&&y<=r.y+r.h) return i; }
    return -1;
  }

  function onClick(e){
    if (winner || turn !== "you") return;
    const {x,y} = clickPos(e); const i = findCell(x, y);
    if (i < 0 || board[i]) return;
    board[i] = place;
    if (hasLine(board)){ winner = "you"; draw(); return; }
    if (!empties(board).length){ winner = "draw"; draw(); return; }
    turn = "ai"; draw(); setTimeout(aiMove, 400);
  }
  function onKey(e){
    if (e.key === "x" || e.key === "X"){ place = "X"; draw(); }
    if (e.key === "o" || e.key === "O"){ place = "O"; draw(); }
  }

  canvas.addEventListener("click", onClick);
  window.addEventListener("keydown", onKey);
  draw();
  return {
    destroy(){
      canvas.removeEventListener("click", onClick);
      window.removeEventListener("keydown", onKey);
      ctx.clearRect(0,0,size,H);
      memo.clear();
    },
    restart(){ newGame(); memo.clear(); draw(); },
    solve(){
      if (winner || turn !== "you") return;
      const m = bestMove(board);
      if (!m) return;
      board[m.i] = m.sym;
      if (hasLine(board)){ winner = "you"; draw(); return; }
      if (!empties(board).length){ winner = "draw"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 400);
    },
  };
}
