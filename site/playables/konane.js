// Kōnane — 6×6 jumping game. Opening: two stones removed (black centre, then a
// white neighbour). Subsequent moves: jump your stone over an orthogonally
// adjacent enemy stone into the empty cell beyond, capturing; chains allowed
// in a straight line. Player with no move loses (normal play).
// AI: maximise own legal moves, minimise opponent's.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  function _fit(ctx, t, x, y, maxW){
    let f = parseFloat(ctx.font) || 12;
    while (f > 8 && ctx.measureText(t).width > maxW){ f--; ctx.font = ctx.font.replace(/[\d.]+px/, f + 'px'); }
    ctx.fillText(t, x, y);
  }

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = size + 50;
  const W = canvas.width, H = canvas.height;
  const statusEl = document.getElementById("playable-status");

  const N = 6;
  // 'b' = black (you), 'w' = white (ai), '.' = empty
  let board, turn, winner, sel, multiFrom;
  function newGame(){
    board = new Array(N*N);
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      board[r*N+c] = ((r+c) % 2 === 0) ? 'b' : 'w';
    }
    // opening removals: centre b and adjacent w
    board[2*N + 2] = '.'; board[2*N + 3] = '.';
    turn = "you"; winner = null; sel = -1; multiFrom = -1;
  }
  newGame();

  function legal(b, side){
    const enemy = side === 'b' ? 'w' : 'b';
    const out = [];
    for (let i = 0; i < N*N; i++) if (b[i] === side){
      const r = Math.floor(i/N), c = i%N;
      for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]){
        // jump length(s): need adjacent enemy then empty
        let er = r + dr, ec = c + dc;
        if (er < 0 || er >= N || ec < 0 || ec >= N) continue;
        if (b[er*N + ec] !== enemy) continue;
        let lr = r + 2*dr, lc = c + 2*dc;
        if (lr < 0 || lr >= N || lc < 0 || lc >= N) continue;
        if (b[lr*N + lc] !== '.') continue;
        out.push({ from: i, to: lr*N + lc });
      }
    }
    return out;
  }

  function jumpsFrom(b, side, i){
    const enemy = side === 'b' ? 'w' : 'b';
    const r = Math.floor(i/N), c = i%N;
    const out = [];
    for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]){
      const er = r + dr, ec = c + dc;
      if (er < 0 || er >= N || ec < 0 || ec >= N) continue;
      if (b[er*N + ec] !== enemy) continue;
      const lr = r + 2*dr, lc = c + 2*dc;
      if (lr < 0 || lr >= N || lc < 0 || lc >= N) continue;
      if (b[lr*N + lc] !== '.') continue;
      out.push({ from: i, to: lr*N + lc, captured: er*N + ec, dir: [dr, dc] });
    }
    return out;
  }

  function doJump(b, mv){ const nb = b.slice(); nb[mv.to] = nb[mv.from]; nb[mv.from] = '.'; nb[mv.captured] = '.'; return nb; }

  function aiBest(b){
    // greedy: pick move that maximises (my moves after) - (opp moves after)
    const moves = legal(b, 'w');
    if (!moves.length) return null;
    let best = null, bv = -Infinity;
    for (const m of moves){
      // execute as a single jump (no chain)
      const captured = jumpsFrom(b, 'w', m.from).find(j => j.to === m.to).captured;
      const nb = doJump(b, { ...m, captured });
      const mine = legal(nb, 'w').length;
      const theirs = legal(nb, 'b').length;
      const v = mine - theirs;
      if (v > bv){ bv = v; best = { ...m, captured }; }
    }
    return best;
  }

  function aiMove(){
    if (winner) return;
    const mv = aiBest(board);
    if (!mv){ winner = "you"; draw(); return; }
    board = doJump(board, mv);
    if (!legal(board, 'b').length){ winner = "ai"; draw(); return; }
    turn = "you"; draw();
  }

  function cellRect(r, c){
    const margin = 20, cw = (size - 2*margin) / N;
    return { x: margin + c*cw, y: 30 + r*cw, w: cw, h: cw };
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "13px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";
    _fit(ctx, "Kōnane — jump your stone over an enemy into the empty cell", W/2, 22, W - 8);

    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const rc = cellRect(r, c), i = r*N + c;
      ctx.fillStyle = ((r+c)%2===0) ? "#f0e2c0" : "#dcc090";
      if (sel === i || multiFrom === i) ctx.fillStyle = "#ffe9b0";
      ctx.fillRect(rc.x, rc.y, rc.w, rc.h);
      if (board[i] === 'b' || board[i] === 'w'){
        ctx.beginPath(); ctx.arc(rc.x + rc.w/2, rc.y + rc.h/2, rc.w*0.35, 0, Math.PI*2);
        ctx.fillStyle = board[i] === 'b' ? "#222" : "#eee"; ctx.fill();
        ctx.strokeStyle = "#444"; ctx.stroke();
      }
    }

    if (winner) statusEl.textContent = winner === "you" ? "you win — AI has no jumps!" : "AI wins — you have no jumps";
    else statusEl.textContent = turn === "you" ? (sel < 0 ? "click a black stone to start a jump" : "click an empty cell 2 squares away (enemy in between)") : "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }
  function findCell(x, y){
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const rc = cellRect(r, c);
      if (x >= rc.x && x <= rc.x + rc.w && y >= rc.y && y <= rc.y + rc.h) return r*N + c;
    }
    return -1;
  }

  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e); const i = findCell(x, y); if (i < 0) return;
    if (sel < 0){ if (board[i] === 'b' && jumpsFrom(board, 'b', i).length) sel = i; draw(); return; }
    if (i === sel){ sel = -1; draw(); return; }
    const jumps = jumpsFrom(board, 'b', sel);
    const j = jumps.find(j => j.to === i);
    if (!j){ if (board[i] === 'b' && jumpsFrom(board, 'b', i).length) sel = i; draw(); return; }
    board = doJump(board, j);
    sel = -1;
    if (!legal(board, 'w').length){ winner = "you"; draw(); return; }
    turn = "ai"; draw(); setTimeout(aiMove, 500);
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
    solve(){
      if (winner || turn !== "you") return;
      const moves = legal(board, 'b');
      if (!moves.length){ winner = "ai"; draw(); return; }
      let best = null, bv = -Infinity;
      for (const m of moves){
        const captured = jumpsFrom(board, 'b', m.from).find(j => j.to === m.to).captured;
        const nb = doJump(board, { ...m, captured });
        const v = legal(nb, 'b').length - legal(nb, 'w').length;
        if (v > bv){ bv = v; best = { ...m, captured }; }
      }
      board = doJump(board, best);
      if (!legal(board, 'w').length){ winner = "you"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 500);
    },
  };
}
