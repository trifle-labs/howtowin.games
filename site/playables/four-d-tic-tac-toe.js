// 4D Tic-Tac-Toe — 3×3×3×3 (81 cells, tractable) generalisation. Players
// alternate marking cells; first to align THREE in a row along any straight
// 4D line wins. Many more lines than 2D/3D; first-player win under optimal
// play. AI: heuristic — score moves by line-completion potential.

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = size + 30;
  const W = canvas.width, H = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) { canvas.style.width = W + 'px'; canvas.style.height = H + 'px'; canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr); }
  const statusEl = document.getElementById("playable-status");

  const D = 3;
  // index: i + D*j + D*D*k + D*D*D*l
  function idx(i, j, k, l){ return i + D*j + D*D*k + D*D*D*l; }
  function fromIdx(n){ return [n%D, Math.floor(n/D)%D, Math.floor(n/(D*D))%D, Math.floor(n/(D*D*D))%D]; }

  // Build all winning lines: pick a direction (du, dv, dw, dx) in {-1,0,1}^4 nonzero,
  // pick starting cell s.t. line stays in [0,D-1]^4 for D=3 steps. To avoid
  // duplicates (each line counted twice), require first nonzero direction to be +1
  // and starting cell to be the line's smallest endpoint.
  const LINES = [];
  for (let du = -1; du <= 1; du++) for (let dv = -1; dv <= 1; dv++)
  for (let dw = -1; dw <= 1; dw++) for (let dx = -1; dx <= 1; dx++){
    if (du === 0 && dv === 0 && dw === 0 && dx === 0) continue;
    // require first nonzero is +1 to avoid duplicates
    const dirs = [du, dv, dw, dx];
    const firstNZ = dirs.find(d => d !== 0);
    if (firstNZ !== 1) continue;
    // for each starting cell where all 3 steps stay in [0,2]
    for (let i = 0; i < D; i++) for (let j = 0; j < D; j++)
    for (let k = 0; k < D; k++) for (let l = 0; l < D; l++){
      const ends = [i + du*(D-1), j + dv*(D-1), k + dw*(D-1), l + dx*(D-1)];
      if (ends.some(v => v < 0 || v >= D)) continue;
      const line = [];
      for (let t = 0; t < D; t++) line.push(idx(i + du*t, j + dv*t, k + dw*t, l + dx*t));
      LINES.push(line);
    }
  }

  let board, turn, winner;
  function newGame(){ board = new Array(81).fill('.'); turn = "you"; winner = null; }
  newGame();

  function checkWin(b, ch){
    for (const ln of LINES) if (ln.every(c => b[c] === ch)) return true;
    return false;
  }
  function scoreCell(b, c, ch){
    let s = 0;
    for (const ln of LINES){
      if (!ln.includes(c)) continue;
      let my = 0, opp = 0;
      for (const x of ln){ if (b[x] === ch) my++; else if (b[x] !== '.') opp++; }
      if (opp === 0){
        if (my === 1) s += 1;
        else if (my === 2) s += 100; // about to win
      }
    }
    return s;
  }
  function aiMove(){
    if (winner) return;
    const empty = []; for (let i = 0; i < 81; i++) if (board[i] === '.') empty.push(i);
    if (!empty.length){ winner = "draw"; draw(); return; }
    // check immediate win
    for (const c of empty){ board[c] = 'W'; if (checkWin(board, 'W')){ winner = "ai"; draw(); return; } board[c] = '.'; }
    // block immediate threat
    for (const c of empty){ board[c] = 'B'; if (checkWin(board, 'B')){ board[c] = 'W'; turn = "you"; draw(); return; } board[c] = '.'; }
    let best = empty[0], bestScore = -Infinity;
    for (const c of empty){
      const s = scoreCell(board, c, 'W') + scoreCell(board, c, 'B') * 0.6;
      if (s > bestScore){ bestScore = s; best = c; }
    }
    board[best] = 'W';
    if (checkWin(board, 'W')){ winner = "ai"; draw(); return; }
    if (!board.includes('.')){ winner = "draw"; draw(); return; }
    turn = "you"; draw();
  }

  function cellRect(i, j, k, l){
    // layout: 3×3 grid of 3×3 mini-grids: outer cell (k, l), inner cell (i, j)
    const gw = (size - 20) / 3, cw = (gw - 4) / 3;
    const ox = 10 + l * gw, oy = 30 + k * gw;
    return { x: ox + i * cw, y: oy + j * cw, w: cw, h: cw };
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "12px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";

    for (let k = 0; k < D; k++) for (let l = 0; l < D; l++){
      // outer cell border
      const rc = cellRect(0, 0, k, l);
      const gw = (size - 20) / 3;
      ctx.strokeStyle = "#222"; ctx.lineWidth = 2;
      ctx.strokeRect(rc.x - 2, rc.y - 2, gw - 2, gw - 2);
      for (let i = 0; i < D; i++) for (let j = 0; j < D; j++){
        const rc2 = cellRect(i, j, k, l);
        ctx.fillStyle = "#fff"; ctx.fillRect(rc2.x, rc2.y, rc2.w - 1, rc2.h - 1);
        ctx.strokeStyle = "#888"; ctx.lineWidth = 1; ctx.strokeRect(rc2.x, rc2.y, rc2.w - 1, rc2.h - 1);
        const v = board[idx(i, j, k, l)];
        if (v !== '.'){
          ctx.fillStyle = v === 'B' ? "#39c" : "#e60";
          ctx.font = "bold 14px sans-serif"; ctx.textBaseline = "middle";
          ctx.fillText(v === 'B' ? "X" : "O", rc2.x + rc2.w/2, rc2.y + rc2.h/2);
          ctx.textBaseline = "alphabetic"; ctx.font = "12px sans-serif";
        }
      }
    }
    ctx.lineWidth = 1;

    if (winner) statusEl.textContent = winner === "draw" ? "draw" : winner === "you" ? "you win!" : "AI wins";
    else statusEl.textContent = turn === "you" ? "click a cell" : "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }

  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e);
    for (let i = 0; i < D; i++) for (let j = 0; j < D; j++)
    for (let k = 0; k < D; k++) for (let l = 0; l < D; l++){
      const rc = cellRect(i, j, k, l);
      if (x < rc.x || x > rc.x + rc.w || y < rc.y || y > rc.y + rc.h) continue;
      const c = idx(i, j, k, l); if (board[c] !== '.') return;
      board[c] = 'B';
      if (checkWin(board, 'B')){ winner = "you"; draw(); return; }
      if (!board.includes('.')){ winner = "draw"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 350); return;
    }
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve(){
      if (winner || turn !== "you") return;
      const __mvs = []; for (let i = 0; i < 81; i++) if (board[i] === '.') __mvs.push(i);
      if (!__mvs.length){ winner = "draw"; draw(); return; }
      const __mv = __mvs[Math.floor(Math.random() * __mvs.length)];
      board[__mv] = 'B';
      if (checkWin(board, 'B')){ winner = "you"; draw(); return; }
      if (!board.includes('.')){ winner = "draw"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 80);
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
