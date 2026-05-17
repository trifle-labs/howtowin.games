// Order and Chaos — 6×6 grid. Order (you) places X or O each turn aiming for
// 5-in-a-row (any direction) of the SAME symbol. Chaos (AI) places X or O each
// turn aiming to fill the board with no 5-in-a-row. Order wins with correct
// play. AI: heuristic — Chaos places the symbol that minimises Order's longest
// alignment near recent Order moves.

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = size + 80;
  const W = canvas.width, H = canvas.height;
  const statusEl = document.getElementById("playable-status");

  const N = 6;
  let board, turn, winner, sel; // sel: which symbol you're placing on your turn
  function newGame(){ board = new Array(N*N).fill('.'); turn = "you"; winner = null; sel = 'X'; }
  newGame();

  const DIRS = [[1,0],[0,1],[1,1],[1,-1]];

  function checkLine(b){
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const v = b[r*N + c]; if (v === '.') continue;
      for (const [dr, dc] of DIRS){
        let ok = true;
        for (let k = 1; k < 5; k++){
          const nr = r + dr*k, nc = c + dc*k;
          if (nr < 0 || nr >= N || nc < 0 || nc >= N || b[nr*N + nc] !== v){ ok = false; break; }
        }
        if (ok) return v;
      }
    }
    return null;
  }

  function emptyCells(){ const out = []; for (let i = 0; i < N*N; i++) if (board[i] === '.') out.push(i); return out; }

  function chaosScore(b, sym, i){
    // place sym at i, measure max line length of EITHER symbol through i (lower = better for chaos)
    const r = Math.floor(i / N), c = i % N;
    b[i] = sym;
    let worst = 0;
    for (const s of ['X', 'O']){
      for (const [dr, dc] of DIRS){
        let count = 1;
        for (let k = 1; k < 5; k++){ const nr = r+dr*k, nc = c+dc*k; if (nr<0||nr>=N||nc<0||nc>=N||b[nr*N+nc]!==s) break; count++; }
        for (let k = 1; k < 5; k++){ const nr = r-dr*k, nc = c-dc*k; if (nr<0||nr>=N||nc<0||nc>=N||b[nr*N+nc]!==s) break; count++; }
        if (count > worst) worst = count;
      }
    }
    b[i] = '.';
    return worst;
  }

  function aiMove(){
    if (winner) return;
    // Chaos: for each empty cell × each symbol, prefer placements that yield smallest worst-line
    const empty = emptyCells();
    if (!empty.length){ winner = "ai"; draw(); return; } // chaos wins if board full
    let bestI = empty[0], bestSym = 'X', bestV = Infinity;
    for (const i of empty){
      for (const sym of ['X', 'O']){
        // would this complete a 5-in-a-row for Order? Avoid that.
        board[i] = sym;
        const win = checkLine(board);
        if (win){ board[i] = '.'; continue; }
        board[i] = '.';
        const v = chaosScore(board, sym, i);
        if (v < bestV){ bestV = v; bestI = i; bestSym = sym; }
      }
    }
    board[bestI] = bestSym;
    if (emptyCells().length === 0){ winner = "ai"; draw(); return; }
    turn = "you"; draw();
  }

  function cellRect(r, c){
    const margin = 20, cs = (size - 2*margin) / N;
    return { x: margin + c*cs, y: 30 + r*cs, w: cs, h: cs };
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "13px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";

    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const rc = cellRect(r, c);
      ctx.fillStyle = "#fff"; ctx.fillRect(rc.x, rc.y, rc.w, rc.h);
      ctx.strokeStyle = "#888"; ctx.strokeRect(rc.x, rc.y, rc.w, rc.h);
      const v = board[r*N + c]; if (v === '.') continue;
      ctx.fillStyle = "#222"; ctx.font = `${Math.floor(rc.w*0.6)}px sans-serif`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(v, rc.x + rc.w/2, rc.y + rc.h/2);
    }
    ctx.textBaseline = "alphabetic";

    // selector
    ctx.font = "13px sans-serif"; ctx.fillStyle = "#444";
    ctx.fillText("Your symbol:", 90, size + 50);
    for (let k = 0; k < 2; k++){
      const sym = k === 0 ? 'X' : 'O';
      const x = 170 + k*50, y = size + 40;
      ctx.fillStyle = sel === sym ? "#cef2cf" : "#fff"; ctx.fillRect(x - 20, y - 16, 40, 28);
      ctx.strokeStyle = "#222"; ctx.strokeRect(x - 20, y - 16, 40, 28);
      ctx.fillStyle = "#222"; ctx.font = "18px sans-serif"; ctx.fillText(sym, x, y + 4);
      ctx.font = "13px sans-serif";
    }

    if (winner) statusEl.textContent = winner === "you" ? "you got 5-in-a-row — you win!" : "board filled — Chaos (AI) wins";
    else statusEl.textContent = turn === "you" ? `your turn — selected ${sel}; click an empty cell` : "Chaos thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }

  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e);
    // selector
    for (let k = 0; k < 2; k++){
      const sym = k === 0 ? 'X' : 'O';
      const xx = 170 + k*50, yy = size + 40;
      if (x >= xx - 20 && x <= xx + 20 && y >= yy - 16 && y <= yy + 12){ sel = sym; draw(); return; }
    }
    // board
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const rc = cellRect(r, c);
      if (x >= rc.x && x <= rc.x + rc.w && y >= rc.y && y <= rc.y + rc.h){
        const i = r*N + c; if (board[i] !== '.') return;
        board[i] = sel;
        if (checkLine(board)){ winner = "you"; draw(); return; }
        turn = "ai"; draw(); setTimeout(aiMove, 400); return;
      }
    }
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve(){
      if (winner || turn !== "you") return;
      const __mvs = emptyCells();
      if (!__mvs.length) { winner = "ai"; draw(); return; }
      const __i = __mvs[Math.floor(Math.random() * __mvs.length)];
      const __sym = Math.random() < 0.5 ? 'X' : 'O';
      board[__i] = __sym;
      if (checkLine(board)){ winner = "you"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 80);
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
