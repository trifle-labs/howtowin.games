// Shove — a row of squares with blue/red pieces. Left moves a blue right one
// square, pushing the contiguous run ahead of it; whatever lies at the right
// end is shoved off the board. Right is the mirror. Player with no move loses.
// AI: full memoised minimax on this small linear state.

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = 200;
  const W = canvas.width, H = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) { canvas.style.width = W + 'px'; canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr); }
  const statusEl = document.getElementById("playable-status");

  const N = 8;
  // row[i] ∈ '.', 'b' (you/blue/left), 'w' (ai/red/right)
  let row, turn, winner;
  function newGame(){
    row = ['b', 'b', 'b', '.', '.', 'w', 'w', 'w'];
    turn = "you"; winner = null;
  }
  newGame();

  function legalMoves(r, side){
    const out = [];
    if (side === 'b'){
      // slide a blue one right; the contiguous run at and to the right of it gets pushed; rightmost falls off
      for (let i = 0; i < N - 1; i++){
        if (r[i] !== 'b') continue;
        // build the contiguous run starting at i
        let j = i; while (j < N && r[j] !== '.') j++;
        // need a square at position i (yes, has 'b') and the run [i..j-1] is non-empty; after push, run moves to [i+1..j], piece at j-1 goes to j (or off if j === N)
        // Move is legal as long as the position one right (i+1) is on board (always true for i<N-1)
        out.push({ side: 'b', i });
      }
    } else {
      for (let i = 1; i < N; i++){
        if (r[i] !== 'w') continue;
        let j = i; while (j >= 0 && r[j] !== '.') j--;
        out.push({ side: 'w', i });
      }
    }
    return out;
  }

  function apply(r, mv){
    const nr = r.slice();
    if (mv.side === 'b'){
      const i = mv.i;
      // find run end
      let j = i; while (j < N && nr[j] !== '.') j++;
      // shift cells i..j-1 right by 1; if j === N, rightmost goes off
      for (let k = j; k > i; k--){
        nr[k === N ? N - 1 : k] = (k === N) ? nr[k - 1] : nr[k - 1]; // careful
      }
      // simpler: extract run, then place shifted
      const run = [];
      for (let k = i; k < N && nr[k] !== '.'; k++) run.push(nr[k]);
      // clear run
      for (let k = i; k < i + run.length; k++) nr[k] = '.';
      // place starting at i+1; if last position would exceed N-1, that piece is gone
      for (let k = 0; k < run.length; k++){
        const pos = i + 1 + k;
        if (pos < N) nr[pos] = run[k];
      }
    } else {
      const i = mv.i;
      const run = [];
      for (let k = i; k >= 0 && nr[k] !== '.'; k--) run.unshift(nr[k]);
      for (let k = i - run.length + 1; k <= i; k++) nr[k] = '.';
      for (let k = 0; k < run.length; k++){
        const pos = i - 1 - (run.length - 1 - k);
        if (pos >= 0) nr[pos] = run[k];
      }
    }
    return nr;
  }

  const memo = new Map();
  function isWinning(r, side){
    const k = r.join('') + side;
    if (memo.has(k)) return memo.get(k);
    const moves = legalMoves(r, side);
    if (!moves.length){ memo.set(k, false); return false; }
    for (const m of moves){
      if (!isWinning(apply(r, m), side === 'b' ? 'w' : 'b')){ memo.set(k, true); return true; }
    }
    memo.set(k, false); return false;
  }

  function aiBest(r){
    const moves = legalMoves(r, 'w');
    if (!moves.length) return null;
    for (const m of moves){ if (!isWinning(apply(r, m), 'b')) return m; }
    return moves[0];
  }

  function aiMove(){
    if (winner) return;
    const mv = aiBest(row);
    if (!mv){ winner = "you"; draw(); return; }
    row = apply(row, mv);
    if (!legalMoves(row, 'b').length){ winner = "ai"; draw(); return; }
    turn = "you"; draw();
  }

  function cellRect(i){
    const margin = 20, cw = (W - 2*margin) / N;
    return { x: margin + i*cw, y: 80, w: cw, h: cw };
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);

    for (let i = 0; i < N; i++){
      const rc = cellRect(i);
      ctx.fillStyle = "#fff"; ctx.fillRect(rc.x, rc.y, rc.w, rc.h);
      ctx.strokeStyle = "#888"; ctx.strokeRect(rc.x, rc.y, rc.w, rc.h);
      if (row[i] === 'b' || row[i] === 'w'){
        ctx.beginPath(); ctx.arc(rc.x + rc.w/2, rc.y + rc.h/2, rc.w*0.32, 0, Math.PI*2);
        ctx.fillStyle = row[i] === 'b' ? "#39c" : "#e60"; ctx.fill();
      }
    }
    if (winner) statusEl.textContent = winner === "you" ? "you win!" : "AI wins";
    else statusEl.textContent = turn === "you" ? "click a blue piece to shove its run one step right" : "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }
  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e);
    for (let i = 0; i < N; i++){
      const rc = cellRect(i);
      if (x >= rc.x && x <= rc.x + rc.w && y >= rc.y && y <= rc.y + rc.h){
        if (row[i] !== 'b') return;
        const moves = legalMoves(row, 'b');
        const mv = moves.find(m => m.i === i);
        if (!mv) return;
        row = apply(row, mv);
        if (!legalMoves(row, 'w').length){ winner = "you"; draw(); return; }
        turn = "ai"; draw(); setTimeout(aiMove, 500); return;
      }
    }
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); memo.clear(); },
    restart(){ newGame(); memo.clear(); draw(); },
    solve(){
      if (winner || turn !== "you") return;
      const moves = legalMoves(row, 'b');
      if (!moves.length){ winner = "ai"; draw(); return; }
      let mv = moves[0];
      for (const m of moves){ if (!isWinning(apply(row, m), 'w')){ mv = m; break; } }
      row = apply(row, mv);
      if (!legalMoves(row, 'w').length){ winner = "you"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 500);
    },
  };
}
