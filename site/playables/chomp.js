// Chomp — rectangular chocolate bar. Pick a cell, eat that cell plus every
// cell below+right. Top-left (0,0) is poisoned: the player who eats it loses.
// First player wins on any non-trivial board (strategy stealing). For small
// boards we compute the exact winning move via memoized minimax.

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

  const ROWS = 3, COLS = 4;

  // State: cols[c] = number of remaining cells in column c, counted from top.
  // Staircase invariant: cols is non-increasing.
  let cols, turn, winner;
  function newGame(){ cols = Array(COLS).fill(ROWS); turn="you"; winner=null; }
  newGame();

  function isPoisonOnly(s){ return s[0] === 1 && s.slice(1).every(v => v === 0); }
  function isDone(s){ return s[0] === 0; } // shouldn't happen — game ends at isPoisonOnly + chomp

  // Apply chomp at (r,c): for all c' >= c, set cols[c'] = min(cols[c'], r).
  // (r is row index from top, 0..cols[c]-1.)
  function applyChomp(s, r, c){
    const ns = s.slice();
    for (let i=c; i<COLS; i++) ns[i] = Math.min(ns[i], r);
    return ns;
  }

  // Enumerate moves: every (r,c) with r in [0, cols[c]-1], c in [0,COLS-1].
  function moves(s){
    const out = [];
    for (let c=0; c<COLS; c++) for (let r=0; r<s[c]; r++) out.push({r,c});
    return out;
  }

  // Memo by state string. value = "win" if player to move wins.
  const memo = new Map();
  function key(s){ return s.join(","); }
  function isWin(s){
    if (isPoisonOnly(s)) return false; // mover must eat poison and lose
    const k = key(s); if (memo.has(k)) return memo.get(k);
    for (const m of moves(s)){
      if (!isWin(applyChomp(s, m.r, m.c))){ memo.set(k, true); return true; }
    }
    memo.set(k, false); return false;
  }

  function bestMove(s){
    // Find a move leading to a P-position (opponent loses). If none, take poison.
    const ms = moves(s);
    for (const m of ms){ if (!isWin(applyChomp(s, m.r, m.c))) return m; }
    // No winning move: forced to take poison eventually. Eat (0,0).
    return { r: 0, c: 0 };
  }

  function aiMove(){
    if (winner) return;
    const m = bestMove(cols);
    cols = applyChomp(cols, m.r, m.c);
    if (m.r === 0 && m.c === 0){ winner="you"; draw(); return; }
    turn = "you"; draw();
  }

  function cellRect(r, c){
    const margin = 30;
    const cellW = (size - 2*margin) / COLS;
    const cellH = (size - 2*margin - 40) / ROWS;
    return { x: margin + c*cellW, y: margin + r*cellH, w: cellW, h: cellH };
  }

  function draw(){
    ctx.fillStyle="#fafaf7"; ctx.fillRect(0,0,size,size);
    ctx.font="14px sans-serif"; ctx.textAlign="center"; ctx.fillStyle="#444";
    ctx.fillText(`Chomp ${ROWS}×${COLS} — don't eat the poisoned cell`, size/2, 20);

    for (let c=0; c<COLS; c++){
      for (let r=0; r<cols[c]; r++){
        const cell = cellRect(r, c);
        const isPoison = r===0 && c===0;
        ctx.fillStyle = isPoison ? "#c66" : "#b97";
        ctx.fillRect(cell.x+1, cell.y+1, cell.w-2, cell.h-2);
        ctx.strokeStyle="#532"; ctx.lineWidth=1; ctx.strokeRect(cell.x+1, cell.y+1, cell.w-2, cell.h-2);
        if (isPoison){
          ctx.fillStyle="#fff"; ctx.font="bold 16px sans-serif"; ctx.textAlign="center"; ctx.textBaseline="middle";
          ctx.fillText("☠", cell.x + cell.w/2, cell.y + cell.h/2);
          ctx.textBaseline="alphabetic";
        }
      }
    }

    if (winner) statusEl.textContent = winner === "you" ? "you win — AI ate the poison!" : "AI wins — you ate the poison!";
    else statusEl.textContent = turn === "you" ? "your turn — click a cell to chomp" : "AI thinking…";
  }

  function clickPos(e){ const r=canvas.getBoundingClientRect(); return {x:(e.clientX-r.left)*(size/r.width), y:(e.clientY-r.top)*(size/r.height)}; }

  function findCell(x, y){
    for (let c=0; c<COLS; c++) for (let r=0; r<cols[c]; r++){
      const cell = cellRect(r, c);
      if (x>=cell.x && x<=cell.x+cell.w && y>=cell.y && y<=cell.y+cell.h) return {r,c};
    }
    return null;
  }

  function commit(m){
    cols = applyChomp(cols, m.r, m.c);
    if (m.r === 0 && m.c === 0){ winner = turn === "you" ? "ai" : "you"; draw(); return true; }
    return false;
  }

  function onClick(e){
    if (winner || turn !== "you") return;
    const {x,y} = clickPos(e); const hit = findCell(x,y);
    if (!hit) return;
    if (commit(hit)) return;
    turn = "ai"; draw(); setTimeout(aiMove, 500);
  }

  canvas.addEventListener("click", onClick); draw();
  return {
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0,0,size,size); memo.clear(); },
    restart(){ newGame(); memo.clear(); draw(); },
    solve(){
      if (winner || turn !== "you") return;
      const m = bestMove(cols);
      if (commit(m)) return;
      turn = "ai"; draw(); setTimeout(aiMove, 500);
    },
  };
}
