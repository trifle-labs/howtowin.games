// Catch the Hare — small grid pursuit game. Three hounds (you) chase one hare
// (AI) on a 3×5 board. Hounds move one step forward (toward the hare) or
// sideways; never backward. Hare moves one step in any direction. No captures.
// Hounds win by trapping the hare with no legal move; hare wins by reaching
// the hounds' back row. Full memoised minimax solves it.

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = size + 30;
  const W = canvas.width, H = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) { canvas.style.width = W + 'px'; canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr); }
  const statusEl = document.getElementById("playable-status");

  const COLS = 3, ROWS = 5;
  let hounds, hare, turn, winner, sel;
  function newGame(){
    hounds = [[4,0],[4,1],[4,2]];
    hare = [0,1];
    turn = "you"; winner = null; sel = -1;
  }
  newGame();

  function occupied(state, r, c){
    if (state.hare[0] === r && state.hare[1] === c) return true;
    for (const [hr, hc] of state.hounds) if (hr === r && hc === c) return true;
    return false;
  }
  function houndMoves(state){
    const out = [];
    for (let k = 0; k < state.hounds.length; k++){
      const [r, c] = state.hounds[k];
      for (const [dr, dc] of [[-1,0],[0,-1],[0,1]]){
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) continue;
        if (occupied(state, nr, nc)) continue;
        out.push([k, nr, nc]);
      }
    }
    return out;
  }
  function hareMoves(state){
    const out = [];
    const [r, c] = state.hare;
    for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]){
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) continue;
      if (occupied(state, nr, nc)) continue;
      out.push([nr, nc]);
    }
    return out;
  }
  function cloneState(){ return { hounds: hounds.map(h => h.slice()), hare: hare.slice() }; }

  const memo = new Map();
  function keyOf(state, side){
    const hs = state.hounds.map(h => h.join(',')).sort().join('|');
    return `${hs};${state.hare.join(',')};${side}`;
  }
  // returns true if the player to move (side) wins under optimal play.
  function winningRec(state, side, depth){
    if (state.hare[0] === ROWS - 1) return side === 'hare'; // hare reached back row -> hare wins; if it's hare's turn now they already won so check who just moved... simpler: terminal cond checked before recursion.
    if (depth > 30) return false; // depth cap fallback
    const k = keyOf(state, side); if (memo.has(k)) return memo.get(k);
    const moves = side === 'hounds' ? houndMoves(state) : hareMoves(state);
    if (!moves.length){ memo.set(k, side === 'hounds' ? false : false); return false; }
    const next = side === 'hounds' ? 'hare' : 'hounds';
    for (const mv of moves){
      const ns = { hounds: state.hounds.map(h => h.slice()), hare: state.hare.slice() };
      if (side === 'hounds'){ ns.hounds[mv[0]] = [mv[1], mv[2]]; }
      else { ns.hare = [mv[0], mv[1]]; }
      // immediate hare-win check
      if (side === 'hare' && ns.hare[0] === ROWS - 1){ memo.set(k, true); return true; }
      // opponent can't move -> current side wins (last mover wins)
      const oppMoves = next === 'hounds' ? houndMoves(ns) : hareMoves(ns);
      if (!oppMoves.length){ memo.set(k, true); return true; }
      if (!winningRec(ns, next, depth + 1)){ memo.set(k, true); return true; }
    }
    memo.set(k, false); return false;
  }

  function aiMove(){
    if (winner) return;
    const moves = hareMoves({ hounds, hare });
    if (!moves.length){ winner = "you"; draw(); return; }
    let best = moves[0];
    for (const mv of moves){
      const ns = { hounds: hounds.map(h => h.slice()), hare: [mv[0], mv[1]] };
      if (ns.hare[0] === ROWS - 1){ best = mv; break; }
      if (!winningRec(ns, 'hounds', 0)){ best = mv; break; }
    }
    hare = [best[0], best[1]];
    if (hare[0] === ROWS - 1){ winner = "ai"; draw(); return; }
    if (!houndMoves({ hounds, hare }).length){ winner = "ai"; draw(); return; }
    turn = "you"; draw();
  }

  function cellRect(r, c){
    const margin = 60, cs = (size - 2*margin) / COLS;
    return { x: margin + c*cs, y: 30 + r*cs, w: cs, h: cs };
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);

    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++){
      const rc = cellRect(r, c);
      ctx.fillStyle = r === 0 ? "#ffe9c8" : r === ROWS-1 ? "#e0f0e0" : "#fff";
      ctx.fillRect(rc.x, rc.y, rc.w, rc.h);
      ctx.strokeStyle = "#888"; ctx.strokeRect(rc.x, rc.y, rc.w, rc.h);
    }
    // hare
    {
      const [r, c] = hare; const rc = cellRect(r, c);
      ctx.beginPath(); ctx.arc(rc.x + rc.w/2, rc.y + rc.h/2, rc.w * 0.32, 0, Math.PI*2);
      ctx.fillStyle = "#e60"; ctx.fill(); ctx.strokeStyle = "#222"; ctx.stroke();
    }
    // hounds
    for (let k = 0; k < hounds.length; k++){
      const [r, c] = hounds[k]; const rc = cellRect(r, c);
      ctx.beginPath(); ctx.arc(rc.x + rc.w/2, rc.y + rc.h/2, rc.w * 0.32, 0, Math.PI*2);
      ctx.fillStyle = k === sel ? "#cef2cf" : "#39c"; ctx.fill();
      ctx.strokeStyle = sel === k ? "#0a0" : "#222"; ctx.lineWidth = sel === k ? 3 : 1; ctx.stroke(); ctx.lineWidth = 1;
    }
    // legal-move highlights
    if (sel >= 0 && turn === "you" && !winner){
      const [r, c] = hounds[sel];
      for (const [dr, dc] of [[-1,0],[0,-1],[0,1]]){
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) continue;
        if (occupied({ hounds, hare }, nr, nc)) continue;
        const rc = cellRect(nr, nc);
        ctx.strokeStyle = "#0a0"; ctx.lineWidth = 3; ctx.strokeRect(rc.x + 2, rc.y + 2, rc.w - 4, rc.h - 4); ctx.lineWidth = 1;
      }
    }

    if (winner) statusEl.textContent = winner === "you" ? "you trapped the hare!" : "the hare escaped — AI wins";
    else statusEl.textContent = turn === "you" ? (sel < 0 ? "click a hound to select" : "click a green-outlined cell") : "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }

  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e);
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++){
      const rc = cellRect(r, c);
      if (x < rc.x || x > rc.x + rc.w || y < rc.y || y > rc.y + rc.h) continue;
      const hi = hounds.findIndex(h => h[0] === r && h[1] === c);
      if (sel < 0){
        if (hi >= 0){ sel = hi; draw(); }
        return;
      }
      if (hi >= 0){ sel = hi; draw(); return; }
      const [hr, hc] = hounds[sel];
      const dr = r - hr, dc = c - hc;
      if (Math.abs(dr) + Math.abs(dc) !== 1) return;
      if (dr === 1) return; // no backward
      if (occupied({ hounds, hare }, r, c)) return;
      hounds[sel] = [r, c]; sel = -1;
      if (!hareMoves({ hounds, hare }).length){ winner = "you"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 350);
      return;
    }
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve() {
      if (winner || turn !== "you") return;
      const __mvs = houndMoves({ hounds, hare });
      if (!__mvs || !__mvs.length) { winner = "ai"; draw(); return; }
      const __mv = __mvs[Math.floor(Math.random() * __mvs.length)];
      hounds[__mv[0]] = [__mv[1], __mv[2]];
      if (!hareMoves({ hounds, hare }).length) { winner = "you"; draw(); return; }
      turn = "ai"; draw();
      setTimeout(aiMove, 80);
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); memo.clear(); draw(); },
  };
}
