// Clobber — 3×4 board. Initial checkerboard pattern: B (you) on dark squares,
// W (ai) on light. On your turn move one of your stones onto an orthogonally
// adjacent enemy stone, capturing it. Player with no move loses.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 480);
  canvas.width = size;
  canvas.height = size * 3 / 4 + 60;
  const H = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) {
    const w = canvas.width, h = canvas.height;
    canvas.style.width = w + 'px';    canvas.width = w * dpr; canvas.height = h * dpr; ctx.scale(dpr, dpr);
  }
  const statusEl = document.getElementById("playable-status");

  const ROWS = 3, COLS = 4;
  let board, turn, winner, sel; // board[r][c] = "B" | "W" | "."
  function newGame(){
    board = [];
    for (let r=0; r<ROWS; r++){
      const row = [];
      for (let c=0; c<COLS; c++) row.push((r+c) % 2 === 0 ? "B" : "W");
      board.push(row);
    }
    turn = "you"; winner = null; sel = null;
  }
  newGame();

  function legalMoves(b, side){
    const me = side === "you" ? "B" : "W";
    const enemy = side === "you" ? "W" : "B";
    const out = [];
    for (let r=0; r<ROWS; r++) for (let c=0; c<COLS; c++){
      if (b[r][c] !== me) continue;
      const ds = [[1,0],[-1,0],[0,1],[0,-1]];
      for (const [dr,dc] of ds){
        const nr = r+dr, nc = c+dc;
        if (nr>=0&&nr<ROWS&&nc>=0&&nc<COLS&&b[nr][nc]===enemy) out.push({fr:r,fc:c,tr:nr,tc:nc});
      }
    }
    return out;
  }

  function apply(b, m){
    const nb = b.map(row => row.slice());
    nb[m.tr][m.tc] = nb[m.fr][m.fc];
    nb[m.fr][m.fc] = ".";
    return nb;
  }

  const memo = new Map();
  function isWinning(b, side, depth){
    if (depth <= 0) return null;
    const k = b.map(r=>r.join("")).join("/") + side;
    if (memo.has(k)) return memo.get(k);
    const moves = legalMoves(b, side);
    if (!moves.length){ memo.set(k, false); return false; }
    for (const m of moves){
      const r = isWinning(apply(b, m), side === "you" ? "ai" : "you", depth-1);
      if (r === false){ memo.set(k, true); return true; }
    }
    memo.set(k, false); return false;
  }

  function bestMove(b, side){
    const moves = legalMoves(b, side);
    if (!moves.length) return null;
    for (const m of moves){
      if (isWinning(apply(b, m), side === "you" ? "ai" : "you", 24) === false) return m;
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

  function cellRect(r, c){
    const margin = 24, gap = 2;
    const cw = (size - 2*margin - (COLS-1)*gap) / COLS;
    return { x: margin + c*(cw+gap), y: 50 + r*(cw+gap), w: cw, h: cw };
  }

  function draw(){
    ctx.fillStyle="#fafaf7"; ctx.fillRect(0,0,size,H);
    ctx.font="13px sans-serif"; ctx.textAlign="center"; ctx.fillStyle="#444";
    ctx.fillText(`Clobber — move your B onto an adjacent W to capture`, size/2, 22);

    const targets = (sel && turn === "you")
      ? new Set(legalMoves(board, "you").filter(m => m.fr === sel.r && m.fc === sel.c).map(m => m.tr*10 + m.tc))
      : new Set();

    for (let r=0; r<ROWS; r++) for (let c=0; c<COLS; c++){
      const rc = cellRect(r, c);
      const dark = (r+c) % 2 === 0;
      ctx.fillStyle = dark ? "#e6dcc4" : "#f7f0d8";
      ctx.fillRect(rc.x, rc.y, rc.w, rc.h);
      if (targets.has(r*10 + c)){
        ctx.fillStyle = "rgba(60,150,60,0.35)"; ctx.fillRect(rc.x, rc.y, rc.w, rc.h);
      }
      if (board[r][c] !== "."){
        ctx.beginPath();
        ctx.arc(rc.x + rc.w/2, rc.y + rc.h/2, rc.w*0.35, 0, Math.PI*2);
        ctx.fillStyle = board[r][c] === "B" ? "#222" : "#fff"; ctx.fill();
        ctx.strokeStyle = sel && sel.r === r && sel.c === c ? "#06c" : "#444";
        ctx.lineWidth = sel && sel.r === r && sel.c === c ? 3 : 1; ctx.stroke();
      }
    }

    if (winner) statusEl.textContent = winner === "you" ? "you win — AI cannot move!" : "AI wins — you cannot move!";
    else if (sel) statusEl.textContent = `click a green target to clobber`;
    else statusEl.textContent = turn === "you" ? "click one of your B stones" : "AI thinking…";
  }

  function clickPos(e){ const r=canvas.getBoundingClientRect(); return {x:(e.clientX-r.left)*(size/r.width), y:(e.clientY-r.top)*(H/r.height)}; }
  function findCell(x, y){
    for (let r=0; r<ROWS; r++) for (let c=0; c<COLS; c++){
      const rc = cellRect(r, c); if (x>=rc.x&&x<=rc.x+rc.w&&y>=rc.y&&y<=rc.y+rc.h) return {r, c};
    }
    return null;
  }

  function onClick(e){
    if (winner || turn !== "you") return;
    const {x,y} = clickPos(e); const cell = findCell(x, y);
    if (!cell) return;
    if (board[cell.r][cell.c] === "B"){ sel = cell; draw(); return; }
    if (sel){
      const moves = legalMoves(board, "you").filter(m => m.fr === sel.r && m.fc === sel.c && m.tr === cell.r && m.tc === cell.c);
      if (moves.length){
        board = apply(board, moves[0]);
        sel = null;
        if (!legalMoves(board, "ai").length){ winner = "you"; draw(); return; }
        turn = "ai"; draw(); setTimeout(aiMove, 500);
      }
    }
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0,0,size,H); memo.clear(); },
    restart(){ newGame(); memo.clear(); draw(); },
    solve(){
      if (winner || turn !== "you") return;
      const m = bestMove(board, "you");
      if (!m){ winner = "ai"; draw(); return; }
      board = apply(board, m); sel = null;
      if (!legalMoves(board, "ai").length){ winner = "you"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 500);
    },
  };
}
