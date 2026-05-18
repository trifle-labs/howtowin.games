// Tac-Tix — 4×4 misère take-away (smaller than standard 5×5 for full minimax).
// Take any contiguous run of counters from a single row or column. Player
// forced to take the last counter loses.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = size + 70;
  const H = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) {
    const w = canvas.width, h = canvas.height;
    canvas.style.width = w + 'px';    canvas.width = w * dpr; canvas.height = h * dpr; ctx.scale(dpr, dpr);
  }
  const statusEl = document.getElementById("playable-status");

  const N = 4;
  let mask, turn, winner, sel; // mask: bitmask of remaining counters
  function newGame(){ mask = (1 << (N*N)) - 1; turn="you"; winner=null; sel = []; }
  newGame();

  function legalMoves(m){
    const out = [];
    // rows
    for (let r=0; r<N; r++){
      for (let a=0; a<N; a++) for (let b=a; b<N; b++){
        let ok = true;
        for (let c=a; c<=b; c++) if (!((m >>> (r*N + c)) & 1)){ ok=false; break; }
        if (ok) out.push({ kind: "row", r, a, b });
      }
    }
    // cols
    for (let c=0; c<N; c++){
      for (let a=0; a<N; a++) for (let b=a; b<N; b++){
        let ok = true;
        for (let r=a; r<=b; r++) if (!((m >>> (r*N + c)) & 1)){ ok=false; break; }
        if (ok) out.push({ kind: "col", c, a, b });
      }
    }
    return out;
  }

  function apply(m, mv){
    if (mv.kind === "row"){
      for (let c=mv.a; c<=mv.b; c++) m &= ~(1 << (mv.r*N + c));
    } else {
      for (let r=mv.a; r<=mv.b; r++) m &= ~(1 << (r*N + mv.c));
    }
    return m;
  }

  function popcount(x){ let c=0; while (x){ c += x & 1; x >>>= 1; } return c; }

  // In misère normal play, the player who CANNOT move wins (opposite). But here
  // "the player forced to take the last counter loses" means: position with 1 counter
  // is a winning move for the player who can leave 0 counters for opponent? No: if mask=0
  // means previous player took the last counter → previous player loses.
  // We treat the to-move player as loser if there are no moves and the board is empty
  // because previous took the last. The to-move player WINS if mask=0 (opponent just lost).
  const memo = new Map();
  function isWinning(m){
    if (m === 0) return true; // opponent took last, we win
    if (memo.has(m)) return memo.get(m);
    const moves = legalMoves(m);
    for (const mv of moves){
      const nm = apply(m, mv);
      if (!isWinning(nm)){ memo.set(m, true); return true; }
    }
    memo.set(m, false); return false;
  }

  function bestMove(m){
    const moves = legalMoves(m);
    for (const mv of moves){
      if (!isWinning(apply(m, mv))) return mv;
    }
    return moves[0];
  }

  function aiMove(){
    if (winner) return;
    const mv = bestMove(mask);
    if (!mv){ winner = "ai"; draw(); return; } // shouldn't happen unless mask=0
    mask = apply(mask, mv);
    if (mask === 0){ winner = "you"; draw(); return; } // ai took last, ai loses
    turn = "you"; draw();
  }

  function cellRect(r, c){
    const margin = 30, gap = 6;
    const cw = (size - 2*margin - (N-1)*gap) / N;
    return { x: margin + c*(cw+gap), y: 60 + r*(cw+gap), w: cw, h: cw };
  }

  function inRange(sel){
    if (sel.length < 2) return [];
    // determine if all sel are in same row or col, contiguous, and all present
    const rs = sel.map(s => s[0]), cs = sel.map(s => s[1]);
    if (rs.every(r => r === rs[0])){
      const r = rs[0];
      const minC = Math.min(...cs), maxC = Math.max(...cs);
      const out = [];
      for (let c=minC; c<=maxC; c++) out.push([r, c]);
      return out;
    } else if (cs.every(c => c === cs[0])){
      const c = cs[0];
      const minR = Math.min(...rs), maxR = Math.max(...rs);
      const out = [];
      for (let r=minR; r<=maxR; r++) out.push([r, c]);
      return out;
    }
    return [];
  }

  function draw(){
    ctx.fillStyle="#fafaf7"; ctx.fillRect(0,0,size,H);
    ctx.font="13px sans-serif"; ctx.textAlign="center"; ctx.fillStyle="#444";
    ctx.fillText(`Tac-Tix — take a contiguous run from one row or column`, size/2, 22);
    ctx.fillText(`misère: the player who takes the LAST counter loses`, size/2, 42);

    const range = inRange(sel);
    const hi = new Set(range.map(([r, c]) => r*N + c));
    for (let r=0; r<N; r++) for (let c=0; c<N; c++){
      const rc = cellRect(r, c);
      const has = (mask >>> (r*N + c)) & 1;
      ctx.fillStyle = hi.has(r*N + c) ? "#ffe9b0" : "#fff";
      ctx.fillRect(rc.x, rc.y, rc.w, rc.h);
      ctx.strokeStyle = "#888"; ctx.strokeRect(rc.x, rc.y, rc.w, rc.h);
      if (has){
        ctx.beginPath(); ctx.arc(rc.x + rc.w/2, rc.y + rc.h/2, rc.w*0.3, 0, Math.PI*2);
        ctx.fillStyle = "#444"; ctx.fill();
      }
    }
    // submit button
    const btnY = 60 + N*(cellRect(0,0).h + 6) + 8;
    ctx.fillStyle = sel.length ? "#5a7" : "#bbb";
    ctx.fillRect(size/2 - 50, btnY, 100, 28);
    ctx.fillStyle = "#fff"; ctx.font = "13px sans-serif"; ctx.textAlign="center"; ctx.textBaseline="middle";
    ctx.fillText("take", size/2, btnY + 14);
    ctx.textBaseline = "alphabetic";

    if (winner) statusEl.textContent = winner === "you" ? "you win — AI took the last!" : "AI wins — you took the last!";
    else statusEl.textContent = turn === "you" ? "click cells along ONE row/column, then click TAKE" : "AI thinking…";
  }

  function clickPos(e){ const r=canvas.getBoundingClientRect(); return {x:(e.clientX-r.left)*(size/r.width), y:(e.clientY-r.top)*(H/r.height)}; }
  function findCell(x, y){
    for (let r=0; r<N; r++) for (let c=0; c<N; c++){
      const rc = cellRect(r, c); if (x>=rc.x&&x<=rc.x+rc.w&&y>=rc.y&&y<=rc.y+rc.h) return [r, c];
    }
    return null;
  }

  function commit(){
    if (!sel.length) return;
    const range = sel.length === 1 ? sel : inRange(sel);
    if (!range.length) return;
    // verify all cells exist
    for (const [r, c] of range) if (!((mask >>> (r*N + c)) & 1)) { sel = []; draw(); return; }
    // mark mv as a row or col
    const isRow = range.every(([r, c]) => r === range[0][0]);
    const mv = isRow
      ? { kind: "row", r: range[0][0], a: Math.min(...range.map(p=>p[1])), b: Math.max(...range.map(p=>p[1])) }
      : { kind: "col", c: range[0][1], a: Math.min(...range.map(p=>p[0])), b: Math.max(...range.map(p=>p[0])) };
    mask = apply(mask, mv);
    sel = [];
    if (mask === 0){ winner = "ai"; draw(); return; } // you took last, you lose
    turn = "ai"; draw(); setTimeout(aiMove, 500);
  }

  function onClick(e){
    if (winner || turn !== "you") return;
    const {x,y} = clickPos(e); const cell = findCell(x, y);
    const btnY = 60 + N*(cellRect(0,0).h + 6) + 8;
    if (y >= btnY && y <= btnY + 28 && x >= size/2 - 50 && x <= size/2 + 50){
      commit(); return;
    }
    if (!cell) return;
    const [r, c] = cell;
    if (!((mask >>> (r*N + c)) & 1)) return;
    const ix = sel.findIndex(s => s[0]===r && s[1]===c);
    if (ix >= 0) sel.splice(ix, 1);
    else sel.push([r, c]);
    draw();
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0,0,size,H); memo.clear(); },
    restart(){ newGame(); memo.clear(); draw(); },
    solve(){
      if (winner || turn !== "you") return;
      const mv = bestMove(mask);
      if (!mv) return;
      mask = apply(mask, mv); sel = [];
      if (mask === 0){ winner = "ai"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 500);
    },
  };
}
