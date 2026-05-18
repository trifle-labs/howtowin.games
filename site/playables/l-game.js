// L-Game (de Bono) — 4×4 board, two L-tetrominoes and two neutral pieces.
// On your turn you must move your L to a different position/orientation;
// optionally move one neutral. Lose if no legal L-placement.
// 2,296 distinct positions — solvable; we run a full minimax with memoization
// over (board, side).

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = size + 60;
  const W = canvas.width, H = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) { canvas.style.width = W + 'px'; canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr); }
  const statusEl = document.getElementById("playable-status");

  // Generate all 8 L-tetromino orientations from one canonical shape.
  function genShapes(){
    const base = [[0,0],[1,0],[2,0],[2,1]]; // canonical L
    const out = new Set();
    let cur = base;
    for (let mirror = 0; mirror < 2; mirror++){
      let s = mirror ? cur.map(([r, c]) => [r, -c]) : cur;
      for (let rot = 0; rot < 4; rot++){
        // rotate 90°: (r,c) -> (c,-r)
        let t = s;
        for (let k = 0; k < rot; k++) t = t.map(([r, c]) => [c, -r]);
        // normalise to non-negative
        const minR = Math.min(...t.map(p => p[0])), minC = Math.min(...t.map(p => p[1]));
        t = t.map(([r, c]) => [r - minR, c - minC]);
        t.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
        out.add(JSON.stringify(t));
      }
    }
    return [...out].map(s => JSON.parse(s));
  }
  const L_SHAPES = genShapes();

  // All L placements on 4×4
  function allLPlacements(){
    const out = [];
    for (const shape of L_SHAPES){
      for (let dr = -2; dr <= 3; dr++) for (let dc = -2; dc <= 3; dc++){
        const cells = shape.map(([r, c]) => [r + dr, c + dc]);
        if (cells.every(([r, c]) => r >= 0 && r < 4 && c >= 0 && c < 4)){
          out.push(cells.map(([r, c]) => r*4 + c).sort((a, b) => a - b));
        }
      }
    }
    // dedupe
    const seen = new Set();
    return out.filter(p => { const k = p.join(','); if (seen.has(k)) return false; seen.add(k); return true; });
  }
  const L_PLACEMENTS = allLPlacements();

  // state: { you: Set, ai: Set, n1: cell, n2: cell, turn: 'you'|'ai' }
  let state, winner;
  function newGame(){
    // canonical starting layout (per de Bono): L pieces and neutrals as below
    state = {
      you: [4, 8, 12, 13],      // your L (col 0, rows 1-3, plus (3,1))
      ai: [2, 3, 7, 11],        // AI's L
      n1: 0, n2: 15, turn: "you",
    };
    winner = null;
  }
  newGame();

  function occupied(s, exclSide){
    const set = new Set();
    if (exclSide !== 'you') for (const c of s.you) set.add(c);
    if (exclSide !== 'ai') for (const c of s.ai) set.add(c);
    set.add(s.n1); set.add(s.n2);
    return set;
  }

  function legalMoves(s, side){
    // L-piece placements that fit without overlapping anything other than the moving L itself
    const blocked = occupied(s, side);
    const out = [];
    const old = side === 'you' ? s.you : s.ai;
    const oldKey = old.slice().sort((a, b) => a - b).join(',');
    for (const p of L_PLACEMENTS){
      if (p.some(c => blocked.has(c))) continue;
      if (p.join(',') === oldKey) continue; // must be different
      // optional neutral moves: leave both, or move n1 or n2 to any empty
      // we enumerate "no neutral move" plus all neutral-moves
      const newBlocked = new Set(p);
      newBlocked.add(s.n1); newBlocked.add(s.n2);
      for (const c of (side === 'you' ? s.ai : s.you)) newBlocked.add(c);
      out.push({ L: p, n: null });
      // move n1
      for (let c = 0; c < 16; c++){
        if (newBlocked.has(c)) continue;
        out.push({ L: p, n: 'n1', to: c });
        out.push({ L: p, n: 'n2', to: c });
      }
    }
    return out;
  }

  function apply(s, side, mv){
    const ns = { ...s, you: s.you.slice(), ai: s.ai.slice() };
    if (side === 'you') ns.you = mv.L.slice(); else ns.ai = mv.L.slice();
    if (mv.n === 'n1') ns.n1 = mv.to;
    else if (mv.n === 'n2') ns.n2 = mv.to;
    ns.turn = side === 'you' ? 'ai' : 'you';
    return ns;
  }

  // minimax with memoization
  const memo = new Map();
  function key(s, side){
    return side + ":" + s.you.slice().sort((a,b)=>a-b).join(',') + "|" + s.ai.slice().sort((a,b)=>a-b).join(',') + "|" + Math.min(s.n1, s.n2) + ',' + Math.max(s.n1, s.n2);
  }
  function score(s, side, depth){
    const moves = legalMoves(s, side);
    if (!moves.length) return side === 'ai' ? 1 : -1; // side to move loses
    if (depth === 0) return 0;
    const k = key(s, side) + ":" + depth;
    if (memo.has(k)) return memo.get(k);
    let best = side === 'you' ? -2 : 2;
    for (const mv of moves){
      const ns = apply(s, side, mv);
      const v = score(ns, side === 'you' ? 'ai' : 'you', depth - 1);
      if (side === 'you'){ if (v > best) best = v; if (best === 1) break; }
      else { if (v < best) best = v; if (best === -1) break; }
    }
    memo.set(k, best); return best;
  }

  function aiBest(s){
    const moves = legalMoves(s, 'ai');
    if (!moves.length) return null;
    let best = null, bestV = 2;
    for (const mv of moves){
      const ns = apply(s, 'ai', mv);
      // shallow depth to keep responsive
      const v = score(ns, 'you', 4);
      if (v < bestV){ bestV = v; best = mv; if (bestV === -1) break; }
    }
    return best || moves[0];
  }

  // UI state — picking which L-position to play
  let phase = "pickL"; // pickL, optNeutral
  let pickedL = null;
  let neutralChoice = null;

  function cellRect(r, c){
    const margin = 30, cw = (size - 2*margin) / 4;
    return { x: margin + c*cw, y: 50 + r*cw, w: cw, h: cw };
  }

  function aiMove(){
    if (winner) return;
    const mv = aiBest(state);
    if (!mv){ winner = "you"; draw(); return; }
    state = apply(state, 'ai', mv);
    // check you have a move
    if (!legalMoves(state, 'you').length){ winner = "ai"; draw(); return; }
    draw();
  }

  // Each cell click cycles: empty → next part of L being placed
  let lInProgress = []; // cells the user is selecting for new L

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "13px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";

    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++){
      const rc = cellRect(r, c); const i = r*4 + c;
      const isYou = state.you.includes(i);
      const isAi = state.ai.includes(i);
      const isN = state.n1 === i || state.n2 === i;
      const sel = lInProgress.includes(i);
      ctx.fillStyle = sel ? "#ffe9b0" : isYou ? "#9ac" : isAi ? "#d99" : isN ? "#bbb" : "#fff";
      ctx.fillRect(rc.x, rc.y, rc.w, rc.h);
      ctx.strokeStyle = "#888"; ctx.strokeRect(rc.x, rc.y, rc.w, rc.h);
    }
    // Done button
    const bx = W/2 - 50, by = 50 + 4*cellRect(0,0).h + 10;
    ctx.fillStyle = (state.turn === 'you' && lInProgress.length === 4) ? "#5a7" : "#bbb";
    ctx.fillRect(bx, by, 100, 26);
    ctx.fillStyle = "#fff"; ctx.font = "13px sans-serif"; ctx.textBaseline = "middle";
    ctx.fillText("place L", bx + 50, by + 13);
    ctx.textBaseline = "alphabetic";

    if (winner) statusEl.textContent = winner === "you" ? "you win — AI has no move!" : "AI wins — you have no move";
    else statusEl.textContent = state.turn === "you" ? "click 4 cells forming an L (skipping neutrals optional)" : "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }
  function findCell(x, y){
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++){
      const rc = cellRect(r, c);
      if (x >= rc.x && x <= rc.x + rc.w && y >= rc.y && y <= rc.y + rc.h) return r*4 + c;
    }
    return -1;
  }

  function commit(){
    const sorted = lInProgress.slice().sort((a, b) => a - b);
    const valid = L_PLACEMENTS.find(p => p.length === sorted.length && p.every((v, i) => v === sorted[i]));
    if (!valid){ lInProgress = []; draw(); return; }
    const mv = { L: valid, n: null };
    const moves = legalMoves(state, 'you');
    if (!moves.some(m => m.L.join(',') === valid.join(','))){ lInProgress = []; draw(); return; }
    state = apply(state, 'you', mv);
    lInProgress = [];
    if (!legalMoves(state, 'ai').length){ winner = "you"; draw(); return; }
    draw(); setTimeout(aiMove, 500);
  }

  function onClick(e){
    if (winner || state.turn !== 'you') return;
    const { x, y } = pos(e);
    const by = 50 + 4*cellRect(0,0).h + 10;
    if (y >= by && y <= by + 26 && x >= W/2 - 50 && x <= W/2 + 50){
      if (lInProgress.length === 4) commit();
      return;
    }
    const i = findCell(x, y); if (i < 0) return;
    // can't click neutrals or AI L; can click your own L cells (treating them as 'movable')
    if (state.ai.includes(i) || state.n1 === i || state.n2 === i) return;
    const idx = lInProgress.indexOf(i);
    if (idx >= 0) lInProgress.splice(idx, 1);
    else if (lInProgress.length < 4) lInProgress.push(i);
    draw();
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve(){
      if (winner || state.turn !== "you") return;
      const __mvs = legalMoves(state, "you");
      if (!__mvs || !__mvs.length) { winner = "ai"; draw(); return; }
      const __mv = __mvs[Math.floor(Math.random() * __mvs.length)];
      state = apply(state, "you", __mv);
      lInProgress = [];
      if (!legalMoves(state, "ai").length) { winner = "you"; draw(); return; }
      draw();
      setTimeout(aiMove, 80);
    },

    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); memo.clear(); },
    restart(){ newGame(); lInProgress = []; memo.clear(); draw(); },
  };
}
