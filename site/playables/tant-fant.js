// Tant Fant — 3×3 sliding game. Each side has 3 stones on a home row. Stones
// move one step orthogonally to an empty adjacent cell. A side wins by placing
// all 3 of its stones in a row, column, or diagonal — EXCEPT its own home row.

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = size + 60;
  const W = canvas.width, H = canvas.height;
  const statusEl = document.getElementById("playable-status");

  const N = 3;
  // board[r*3+c]: 'b' (you, bottom home row r=2), 'w' (AI, top home row r=0), or '.'.
  let board, turn, winner, sel;
  function newGame(){
    board = ".........".split("");
    board[0] = 'w'; board[1] = 'w'; board[2] = 'w';
    board[6] = 'b'; board[7] = 'b'; board[8] = 'b';
    turn = "you"; winner = null; sel = -1;
  }
  newGame();

  const LINES = [
    [0,1,2,'rowtop'], [3,4,5,'row'], [6,7,8,'rowbot'],
    [0,3,6,'col'], [1,4,7,'col'], [2,5,8,'col'],
    [0,4,8,'diag'], [2,4,6,'diag'],
  ];

  function winsFor(b, side){
    const homeRow = side === 'b' ? 'rowbot' : 'rowtop';
    for (const [a, c, d, kind] of LINES){
      if (kind === homeRow) continue;
      if (b[a] === side && b[c] === side && b[d] === side) return true;
    }
    return false;
  }

  function neighbors(i){
    const r = Math.floor(i/3), c = i%3, out = [];
    if (r > 0) out.push(i-3);
    if (r < 2) out.push(i+3);
    if (c > 0) out.push(i-1);
    if (c < 2) out.push(i+1);
    return out;
  }

  function legal(b, side){
    const out = [];
    for (let i = 0; i < 9; i++) if (b[i] === side){
      for (const j of neighbors(i)) if (b[j] === '.') out.push([i, j]);
    }
    return out;
  }

  function apply(b, mv){ const nb = b.slice(); nb[mv[1]] = nb[mv[0]]; nb[mv[0]] = '.'; return nb; }

  // memoized minimax with depth bound (positions can repeat infinitely)
  const memo = new Map();
  function score(b, side, depth){
    if (winsFor(b, 'w')) return -1; // AI win → bad for "you"
    if (winsFor(b, 'b')) return 1;
    if (depth === 0) return 0;
    const key = b.join('') + side + depth;
    if (memo.has(key)) return memo.get(key);
    const moves = legal(b, side);
    if (!moves.length){ memo.set(key, 0); return 0; }
    let best = side === 'b' ? -2 : 2;
    for (const mv of moves){
      const nb = apply(b, mv);
      const v = score(nb, side === 'b' ? 'w' : 'b', depth - 1);
      if (side === 'b'){ if (v > best) best = v; if (best === 1) break; }
      else { if (v < best) best = v; if (best === -1) break; }
    }
    memo.set(key, best); return best;
  }

  function aiBest(b){
    const moves = legal(b, 'w');
    if (!moves.length) return null;
    // prefer immediate win
    for (const mv of moves){
      const nb = apply(b, mv);
      if (winsFor(nb, 'w')) return mv;
    }
    let best = null, bestV = 2;
    for (const mv of moves){
      const nb = apply(b, mv);
      const v = score(nb, 'b', 4);
      if (v < bestV){ bestV = v; best = mv; if (bestV === -1) break; }
    }
    return best || moves[0];
  }

  function aiMove(){
    if (winner) return;
    const mv = aiBest(board);
    if (!mv){ winner = "you"; draw(); return; }
    board = apply(board, mv);
    if (winsFor(board, 'w')){ winner = "ai"; draw(); return; }
    turn = "you"; draw();
  }

  function cellRect(r, c){
    const margin = 30, cw = (size - 2*margin) / N;
    return { x: margin + c*cw, y: 50 + r*cw, w: cw, h: cw };
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "13px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";

    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const rc = cellRect(r, c);
      const i = r*3 + c;
      ctx.fillStyle = (sel === i) ? "#ffe9b0" : "#fff";
      ctx.fillRect(rc.x, rc.y, rc.w, rc.h);
      ctx.strokeStyle = "#888"; ctx.strokeRect(rc.x, rc.y, rc.w, rc.h);
      if (board[i] === 'b' || board[i] === 'w'){
        ctx.beginPath(); ctx.arc(rc.x + rc.w/2, rc.y + rc.h/2, rc.w*0.3, 0, Math.PI*2);
        ctx.fillStyle = board[i] === 'b' ? "#345" : "#a32"; ctx.fill();
      }
    }

    if (winner) statusEl.textContent = winner === "you" ? "you win!" : "AI wins";
    else statusEl.textContent = turn === "you" ? (sel < 0 ? "click your stone, then a neighbour" : "click an adjacent empty cell") : "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }
  function findCell(x, y){
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const rc = cellRect(r, c);
      if (x >= rc.x && x <= rc.x + rc.w && y >= rc.y && y <= rc.y + rc.h) return r*3 + c;
    }
    return -1;
  }

  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e); const i = findCell(x, y);
    if (i < 0) return;
    if (sel < 0){
      if (board[i] === 'b') sel = i;
      draw(); return;
    }
    if (i === sel){ sel = -1; draw(); return; }
    if (board[i] === 'b'){ sel = i; draw(); return; }
    if (board[i] === '.' && neighbors(sel).includes(i)){
      board = apply(board, [sel, i]); sel = -1;
      if (winsFor(board, 'b')){ winner = "you"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 500);
    }
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); memo.clear(); },
    restart(){ newGame(); memo.clear(); draw(); },
    solve(){
      if (winner || turn !== "you") return;
      const moves = legal(board, 'b');
      for (const mv of moves){ if (winsFor(apply(board, mv), 'b')){ board = apply(board, mv); winner = "you"; draw(); return; } }
      let best = null, bestV = -2;
      for (const mv of moves){
        const v = score(apply(board, mv), 'w', 4);
        if (v > bestV){ bestV = v; best = mv; }
      }
      if (!best) return;
      board = apply(board, best); sel = -1;
      if (winsFor(board, 'b')){ winner = "you"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 500);
    },
  };
}
