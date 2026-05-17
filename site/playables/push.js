// Push — row of squares with blue/red checkers. Left (you, blue) slides a blue
// piece one square right, pushing the contiguous run of pieces ahead (any
// colour); the rightmost piece falling off the end is removed. Right (AI, red)
// mirrors left. Player unable to move loses.
// AI: full memoised minimax.

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = 160;
  const W = canvas.width, H = canvas.height;
  const statusEl = document.getElementById("playable-status");

  let row, turn, winner;
  function newGame(){ row = ['B','B','.','R','B','.','R','R']; turn = "you"; winner = null; }
  newGame();

  function legalMoves(state, side){
    const out = [];
    if (side === 'B'){
      // slide blue right
      for (let i = 0; i < state.length; i++) if (state[i] === 'B'){
        if (i + 1 < state.length) out.push(i);
      }
    } else {
      for (let i = 0; i < state.length; i++) if (state[i] === 'R'){
        if (i - 1 >= 0) out.push(i);
      }
    }
    return out;
  }

  function apply(state, idx, side){
    const ns = state.slice();
    if (side === 'B'){
      // push everything from idx to the right by 1; rightmost falls off
      let i = idx;
      // find contiguous run starting at idx
      let j = i; while (j < ns.length && ns[j] !== '.') j++;
      // shift [i..j-1] right by 1
      if (j === ns.length){
        // rightmost falls off
        for (let k = j - 1; k > i; k--) ns[k] = ns[k-1];
        ns[i] = '.';
      } else {
        // ns[j] === '.'
        for (let k = j; k > i; k--) ns[k] = ns[k-1];
        ns[i] = '.';
      }
    } else {
      let i = idx;
      let j = i; while (j >= 0 && ns[j] !== '.') j--;
      if (j === -1){
        for (let k = j + 1; k < i; k++) ns[k] = ns[k+1];
        ns[i] = '.';
      } else {
        for (let k = j; k < i; k++) ns[k] = ns[k+1];
        ns[i] = '.';
      }
    }
    return ns;
  }

  // Depth-limited search — pushing can cycle (B moves then R counter-pushes
  // back to the prior state), so a pure minimax would not terminate.
  function losingAtDepth(state, side, depth){
    const moves = legalMoves(state, side);
    if (!moves.length) return true;
    if (depth <= 0) return false; // unknown — treat as not losing
    const enemy = side === 'B' ? 'R' : 'B';
    for (const m of moves){
      const ns = apply(state, m, side);
      if (losingAtDepth(ns, enemy, depth - 1)) return false;
    }
    return true;
  }

  function pieceCount(state, side){
    let n = 0; for (const v of state) if (v === side) n++; return n;
  }

  function aiPick(){
    const moves = legalMoves(row, 'R'); if (!moves.length) return -1;
    // Prefer a move that wins by depth-6 search; else maximise blue-pieces-pushed-off.
    for (const m of moves){
      const ns = apply(row, m, 'R');
      if (losingAtDepth(ns, 'B', 6)) return m;
    }
    let best = moves[0], bestScore = -Infinity;
    for (const m of moves){
      const ns = apply(row, m, 'R');
      const score = pieceCount(row, 'B') - pieceCount(ns, 'B');
      if (score > bestScore){ bestScore = score; best = m; }
    }
    return best;
  }

  function aiMove(){
    if (winner) return;
    const m = aiPick(); if (m < 0){ winner = "you"; draw(); return; }
    row = apply(row, m, 'R');
    if (!legalMoves(row, 'B').length){ winner = "ai"; draw(); return; }
    turn = "you"; draw();
  }

  function cellRect(i){
    const margin = 20, cw = (size - 2*margin) / row.length;
    return { x: margin + i * cw + 2, y: 50, w: cw - 4, h: 60 };
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);

    for (let i = 0; i < row.length; i++){
      const r = cellRect(i);
      ctx.fillStyle = "#fff"; ctx.fillRect(r.x, r.y, r.w, r.h);
      ctx.strokeStyle = "#888"; ctx.strokeRect(r.x, r.y, r.w, r.h);
      if (row[i] !== '.'){
        ctx.beginPath(); ctx.arc(r.x + r.w/2, r.y + r.h/2, r.w*0.35, 0, Math.PI*2);
        ctx.fillStyle = row[i] === 'B' ? "#39c" : "#e60"; ctx.fill();
      }
    }

    if (winner) statusEl.textContent = winner === "you" ? "you win!" : "AI wins";
    else statusEl.textContent = turn === "you" ? "click a blue piece to push right" : "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }
  function findCell(x, y){
    for (let i = 0; i < row.length; i++){
      const r = cellRect(i);
      if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) return i;
    }
    return -1;
  }

  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e); const i = findCell(x, y); if (i < 0 || row[i] !== 'B') return;
    if (i + 1 >= row.length) return;
    row = apply(row, i, 'B');
    if (!legalMoves(row, 'R').length){ winner = "you"; draw(); return; }
    turn = "ai"; draw(); setTimeout(aiMove, 500);
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve(){
      if (winner || turn !== "you") return;
      const __mvs = legalMoves(row, "B");
      if (!__mvs.length) { winner = "ai"; draw(); return; }
      const __mv = __mvs[Math.floor(Math.random() * __mvs.length)];
      row = apply(row, __mv, 'B');
      if (!legalMoves(row, 'R').length){ winner = "you"; draw(); return; }
      turn = "ai"; draw();
      setTimeout(aiMove, 80);
    },

    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
