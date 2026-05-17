// Ultimate Tic-Tac-Toe — 3×3 of 3×3 boards. The cell you play within a small
// board dictates which small board the opponent plays in next. If sent to a
// completed board, you can play anywhere. Win small boards; 3 won small boards
// in a row wins. AI: simple heuristic per-board scoring.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  function _fit(ctx, t, x, y, maxW){
    let f = parseFloat(ctx.font) || 12;
    while (f > 8 && ctx.measureText(t).width > maxW){ f--; ctx.font = ctx.font.replace(/[\d.]+px/, f + 'px'); }
    ctx.fillText(t, x, y);
  }

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = size + 40;
  const W = canvas.width, H = canvas.height;
  const statusEl = document.getElementById("playable-status");

  // board[bi][ci] — bi 0..8 = small board, ci 0..8 = cell
  // smallStatus[bi] = '.', 'b', 'w', or 'd' (drawn)
  let board, smallStatus, nextBoard, turn, winner;
  function newGame(){
    board = Array.from({length: 9}, () => new Array(9).fill('.'));
    smallStatus = new Array(9).fill('.');
    nextBoard = -1; turn = "you"; winner = null;
  }
  newGame();

  const LINES = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6],
  ];

  function checkSmall(b){
    for (const l of LINES){
      if (b[l[0]] !== '.' && b[l[0]] === b[l[1]] && b[l[1]] === b[l[2]]) return b[l[0]];
    }
    if (b.every(v => v !== '.')) return 'd';
    return '.';
  }

  function checkBig(){
    const reduced = smallStatus.map(s => s === 'd' ? '.' : s);
    for (const l of LINES){
      if (reduced[l[0]] !== '.' && reduced[l[0]] === reduced[l[1]] && reduced[l[1]] === reduced[l[2]]) return reduced[l[0]];
    }
    return '.';
  }

  function legalIn(bi){
    if (smallStatus[bi] !== '.') return [];
    const out = [];
    for (let ci = 0; ci < 9; ci++) if (board[bi][ci] === '.') out.push(ci);
    return out;
  }

  function legalMoves(){
    if (nextBoard >= 0 && smallStatus[nextBoard] === '.'){
      return legalIn(nextBoard).map(ci => [nextBoard, ci]);
    }
    const out = [];
    for (let bi = 0; bi < 9; bi++) if (smallStatus[bi] === '.')
      for (const ci of legalIn(bi)) out.push([bi, ci]);
    return out;
  }

  function smallScore(b, side){
    let s = 0;
    for (const l of LINES){
      let my = 0, op = 0;
      for (const i of l){ if (b[i] === side) my++; else if (b[i] !== '.') op++; }
      if (op === 0 && my > 0) s += [0, 1, 5, 100][my];
    }
    return s;
  }

  function aiPick(){
    const moves = legalMoves(); if (!moves.length) return null;
    let best = moves[0], bv = -Infinity;
    for (const [bi, ci] of moves){
      board[bi][ci] = 'w';
      const status = checkSmall(board[bi]);
      let v = smallScore(board[bi], 'w') - smallScore(board[bi], 'b');
      if (status === 'w') v += 50;
      // also consider sending opponent to a board where they have few options
      const sent = ci;
      if (smallStatus[sent] !== '.' || sent === bi) v -= 5; // free move for opponent is bad
      else v += smallScore(board[sent], 'w') - smallScore(board[sent], 'b');
      if (v > bv){ bv = v; best = [bi, ci]; }
      board[bi][ci] = '.';
    }
    return best;
  }

  function applyMove(bi, ci, side){
    board[bi][ci] = side;
    const st = checkSmall(board[bi]);
    if (st !== '.') smallStatus[bi] = st;
    const big = checkBig();
    if (big !== '.'){ winner = big === 'b' ? "you" : "ai"; return; }
    if (smallStatus.every(s => s !== '.')){ winner = "draw"; return; }
    nextBoard = (smallStatus[ci] === '.') ? ci : -1;
  }

  function aiMove(){
    if (winner) return;
    const m = aiPick(); if (!m){ winner = "draw"; draw(); return; }
    applyMove(m[0], m[1], 'w'); if (winner){ draw(); return; }
    turn = "you"; draw();
  }

  function cellRect(bi, ci){
    const margin = 10, big = (size - 2*margin) / 3, small = big / 3;
    const br = Math.floor(bi / 3), bc = bi % 3;
    const cr = Math.floor(ci / 3), cc = ci % 3;
    return {
      x: margin + bc * big + cc * small + 2,
      y: 30 + br * big + cr * small + 2,
      w: small - 4, h: small - 4,
    };
  }
  function bigRect(bi){
    const margin = 10, big = (size - 2*margin) / 3;
    const br = Math.floor(bi / 3), bc = bi % 3;
    return { x: margin + bc * big, y: 30 + br * big, w: big, h: big };
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "13px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";
    _fit(ctx, "Ultimate Tic-Tac-Toe — your move's CELL picks the opponent's BOARD", W/2, 18, W - 8);

    for (let bi = 0; bi < 9; bi++){
      const br = bigRect(bi);
      const active = (nextBoard < 0 && smallStatus[bi] === '.') || nextBoard === bi;
      ctx.fillStyle = smallStatus[bi] === 'b' ? "#bcd9f0"
        : smallStatus[bi] === 'w' ? "#f4cfb4"
        : smallStatus[bi] === 'd' ? "#ddd"
        : (active && turn === "you") ? "#eef9e0" : "#fff";
      ctx.fillRect(br.x, br.y, br.w, br.h);
      ctx.strokeStyle = "#000"; ctx.lineWidth = 2;
      ctx.strokeRect(br.x, br.y, br.w, br.h); ctx.lineWidth = 1;

      if (smallStatus[bi] !== '.' && smallStatus[bi] !== 'd'){
        ctx.font = "40px sans-serif"; ctx.fillStyle = smallStatus[bi] === 'b' ? "#39c" : "#e60";
        ctx.fillText(smallStatus[bi] === 'b' ? "X" : "O", br.x + br.w/2, br.y + br.h/2 + 14);
        continue;
      }
      for (let ci = 0; ci < 9; ci++){
        const rc = cellRect(bi, ci);
        ctx.strokeStyle = "#aaa"; ctx.strokeRect(rc.x, rc.y, rc.w, rc.h);
        if (board[bi][ci] !== '.'){
          ctx.font = "14px sans-serif"; ctx.fillStyle = board[bi][ci] === 'b' ? "#39c" : "#e60";
          ctx.fillText(board[bi][ci] === 'b' ? "X" : "O", rc.x + rc.w/2, rc.y + rc.h/2 + 5);
        }
      }
    }
    if (winner) statusEl.textContent = winner === "you" ? "you win!" : winner === "ai" ? "AI wins" : "draw";
    else statusEl.textContent = turn === "you" ? (nextBoard >= 0 ? `play in board ${nextBoard+1}` : "play anywhere") : "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }
  function findCell(x, y){
    for (let bi = 0; bi < 9; bi++) for (let ci = 0; ci < 9; ci++){
      const rc = cellRect(bi, ci);
      if (x >= rc.x && x <= rc.x + rc.w && y >= rc.y && y <= rc.y + rc.h) return [bi, ci];
    }
    return null;
  }

  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e); const m = findCell(x, y); if (!m) return;
    const [bi, ci] = m;
    if (smallStatus[bi] !== '.') return;
    if (nextBoard >= 0 && bi !== nextBoard) return;
    if (board[bi][ci] !== '.') return;
    applyMove(bi, ci, 'b'); if (winner){ draw(); return; }
    turn = "ai"; draw(); setTimeout(aiMove, 500);
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve(){
      if (winner || turn !== "you") return;
      const __mvs = legalMoves();
      if (!__mvs.length){ winner = "draw"; draw(); return; }
      const [bi, ci] = __mvs[Math.floor(Math.random() * __mvs.length)];
      applyMove(bi, ci, 'b'); if (winner){ draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 80);
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
