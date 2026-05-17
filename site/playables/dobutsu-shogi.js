// Dōbutsu shōgi — 3-wide × 4-tall board. Pieces: Lion (L), Giraffe (G), Elephant (E), Chick (C).
// Chick promotes to Hen (H) when reaching the last row. Captured pieces go to
// your hand. Win by capturing the enemy Lion OR moving your Lion onto the
// enemy back rank (Try Rule) — except that immediately illegal if attacked.
// AI: depth-3 alpha-beta minimax with simple material scoring.

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = size + 160;
  const W = canvas.width, H = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) { canvas.style.width = W + 'px'; canvas.style.height = H + 'px'; canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr); }
  const statusEl = document.getElementById("playable-status");

  // Coordinates: row 0 = top (AI back), row 3 = bottom (your back).
  // Cell pieces: { p, side } where p ∈ {L,G,E,C,H} and side ∈ {y, a}
  // Hands: arrays of piece kinds for each side (no promotions in hand).

  let board, hand, turn, winner, sel;
  function newGame(){
    board = new Array(12).fill(null);
    // AI top: G L E (row 0) ; chick at (1, 1)
    board[0] = { p: 'G', s: 'a' }; board[1] = { p: 'L', s: 'a' }; board[2] = { p: 'E', s: 'a' };
    board[1*3 + 1] = { p: 'C', s: 'a' };
    // You bottom: E L G (row 3) ; chick at (2, 1)
    board[3*3 + 0] = { p: 'E', s: 'y' }; board[3*3 + 1] = { p: 'L', s: 'y' }; board[3*3 + 2] = { p: 'G', s: 'y' };
    board[2*3 + 1] = { p: 'C', s: 'y' };
    hand = { y: [], a: [] };
    turn = "you"; winner = null; sel = null;
  }
  newGame();

  // Movement: each piece has a set of (dr, dc) deltas.
  // For 'y' the directions are as listed; for 'a' they are mirrored vertically (dr → -dr).
  const MOVES = {
    L: [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]],
    G: [[-1,0],[0,-1],[0,1],[1,0]],
    E: [[-1,-1],[-1,1],[1,-1],[1,1]],
    C: [[-1,0]],
    H: [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,0]],
  };

  function deltasFor(piece, side){
    return MOVES[piece].map(([dr, dc]) => side === 'y' ? [dr, dc] : [-dr, dc]);
  }

  function findLion(b, side){
    for (let i = 0; i < 12; i++) if (b[i] && b[i].s === side && b[i].p === 'L') return i;
    return -1;
  }

  function clonedState(b, h){
    return { b: b.map(x => x ? { p: x.p, s: x.s } : null), h: { y: h.y.slice(), a: h.a.slice() } };
  }

  function legalMoves(b, h, side){
    const out = [];
    for (let i = 0; i < 12; i++){
      const piece = b[i]; if (!piece || piece.s !== side) continue;
      const r = Math.floor(i / 3), c = i % 3;
      for (const [dr, dc] of deltasFor(piece.p, side)){
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nr >= 4 || nc < 0 || nc >= 3) continue;
        const tgt = b[nr*3 + nc];
        if (tgt && tgt.s === side) continue;
        out.push({ kind: 'move', from: i, to: nr*3 + nc });
      }
    }
    // drops
    const handArr = h[side];
    for (let k = 0; k < handArr.length; k++){
      const piece = handArr[k];
      for (let j = 0; j < 12; j++) if (!b[j]) out.push({ kind: 'drop', handIdx: k, piece, to: j });
    }
    return out;
  }

  function applyMove(state, m, side){
    const ns = clonedState(state.b, state.h);
    if (m.kind === 'move'){
      const src = ns.b[m.from]; const tgt = ns.b[m.to];
      if (tgt){
        // capture: revert promotions, add to your hand
        const captured = tgt.p === 'H' ? 'C' : tgt.p;
        ns.h[side].push(captured);
      }
      let p = src.p;
      // promotion: chick reaches last row (from y's perspective, row 0; for a, row 3)
      if (p === 'C'){
        const r = Math.floor(m.to / 3);
        if ((side === 'y' && r === 0) || (side === 'a' && r === 3)) p = 'H';
      }
      ns.b[m.to] = { p, s: side };
      ns.b[m.from] = null;
    } else {
      const handArr = ns.h[side];
      handArr.splice(m.handIdx, 1);
      ns.b[m.to] = { p: m.piece, s: side };
    }
    return ns;
  }

  function isWinning(state, side){
    // side has won if enemy lion captured OR side's lion is on enemy back rank without being attacked
    const enemy = side === 'y' ? 'a' : 'y';
    if (findLion(state.b, enemy) < 0) return true;
    const myLion = findLion(state.b, side);
    if (myLion < 0) return false;
    const r = Math.floor(myLion / 3);
    if ((side === 'y' && r === 0) || (side === 'a' && r === 3)){
      // is it attacked by any enemy piece?
      for (let i = 0; i < 12; i++){
        const e = state.b[i]; if (!e || e.s !== enemy) continue;
        const er = Math.floor(i / 3), ec = i % 3;
        for (const [dr, dc] of deltasFor(e.p, enemy)){
          if (er + dr === r && ec + dc === myLion % 3) return false;
        }
      }
      return true;
    }
    return false;
  }

  const VAL = { L: 100, G: 6, E: 5, C: 2, H: 7 };
  function evaluate(state){
    let s = 0;
    for (const c of state.b){ if (!c) continue; s += (c.s === 'a' ? 1 : -1) * VAL[c.p]; }
    for (const p of state.h.a) s += VAL[p] * 0.8;
    for (const p of state.h.y) s -= VAL[p] * 0.8;
    return s;
  }

  function search(state, side, depth, alpha, beta){
    if (isWinning(state, 'a')) return 1e6 - (4 - depth);
    if (isWinning(state, 'y')) return -1e6 + (4 - depth);
    if (depth === 0) return evaluate(state);
    const moves = legalMoves(state.b, state.h, side);
    if (!moves.length) return side === 'a' ? -1e6 : 1e6;
    if (side === 'a'){
      let best = -Infinity;
      for (const m of moves){
        const ns = applyMove(state, m, side);
        const v = search(ns, 'y', depth - 1, alpha, beta);
        if (v > best) best = v;
        if (best > alpha) alpha = best;
        if (alpha >= beta) break;
      }
      return best;
    } else {
      let best = Infinity;
      for (const m of moves){
        const ns = applyMove(state, m, side);
        const v = search(ns, 'a', depth - 1, alpha, beta);
        if (v < best) best = v;
        if (best < beta) beta = best;
        if (alpha >= beta) break;
      }
      return best;
    }
  }

  function aiMove(){
    if (winner) return;
    const state = { b: board, h: hand };
    const moves = legalMoves(board, hand, 'a');
    if (!moves.length){ winner = "you"; draw(); return; }
    let best = moves[0], bv = -Infinity;
    for (const m of moves){
      const ns = applyMove(state, m, 'a');
      const v = search(ns, 'y', 2, -Infinity, Infinity);
      if (v > bv){ bv = v; best = m; }
    }
    const ns = applyMove(state, best, 'a');
    board = ns.b; hand = ns.h;
    if (isWinning({ b: board, h: hand }, 'a')){ winner = "ai"; draw(); return; }
    turn = "you"; draw();
  }

  function cellRect(r, c){
    const margin = 30, cw = (size - 2*margin) / 3, ch = (size - 40) / 4;
    return { x: margin + c * cw, y: 30 + r * ch, w: cw, h: ch };
  }

  function drawPiece(x, y, sz, piece, side){
    ctx.fillStyle = side === 'y' ? "#f6e7c1" : "#e0b88c";
    ctx.strokeStyle = "#222"; ctx.lineWidth = 2;
    ctx.beginPath();
    if (side === 'a'){
      ctx.moveTo(x, y - sz/2); ctx.lineTo(x + sz/2, y + sz/2); ctx.lineTo(x - sz/2, y + sz/2); ctx.closePath();
    } else {
      ctx.moveTo(x, y + sz/2); ctx.lineTo(x + sz/2, y - sz/2); ctx.lineTo(x - sz/2, y - sz/2); ctx.closePath();
    }
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#222"; ctx.font = `${Math.floor(sz*0.6)}px sans-serif`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(piece, x, y);
    ctx.textBaseline = "alphabetic";
    ctx.lineWidth = 1;
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "13px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";

    for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++){
      const rc = cellRect(r, c);
      const isLast = (r === 0); const isYours = (r === 3);
      ctx.fillStyle = isLast ? "#ffd6c1" : isYours ? "#c5e9c5" : "#fff"; ctx.fillRect(rc.x, rc.y, rc.w, rc.h);
      ctx.strokeStyle = sel && sel.kind === 'cell' && sel.idx === r*3 + c ? "#0a0" : "#888";
      ctx.lineWidth = sel && sel.kind === 'cell' && sel.idx === r*3 + c ? 3 : 1;
      ctx.strokeRect(rc.x, rc.y, rc.w, rc.h);
      ctx.lineWidth = 1;
      const cell = board[r*3 + c];
      if (cell) drawPiece(rc.x + rc.w/2, rc.y + rc.h/2, Math.min(rc.w, rc.h) * 0.7, cell.p, cell.s);
    }

    // hands
    ctx.fillStyle = "#444"; ctx.textAlign = "left";
    ctx.fillText("AI hand:", 20, size + 30);
    for (let k = 0; k < hand.a.length; k++) drawPiece(80 + k*30, size + 25, 22, hand.a[k], 'a');
    ctx.fillText("Your hand:", 20, size + 80);
    for (let k = 0; k < hand.y.length; k++){
      const x = 90 + k*30, y = size + 75;
      drawPiece(x, y, 22, hand.y[k], 'y');
      if (sel && sel.kind === 'hand' && sel.idx === k){
        ctx.strokeStyle = "#0a0"; ctx.lineWidth = 2;
        ctx.strokeRect(x - 14, y - 14, 28, 28); ctx.lineWidth = 1;
      }
    }

    if (winner) statusEl.textContent = winner === "you" ? "you win!" : "AI wins";
    else statusEl.textContent = turn === "you" ? (sel ? "click destination cell" : "click your piece or hand piece") : "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }

  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e);
    // hand click first
    for (let k = 0; k < hand.y.length; k++){
      const xx = 90 + k*30, yy = size + 75;
      if (x >= xx - 14 && x <= xx + 14 && y >= yy - 14 && y <= yy + 14){
        sel = { kind: 'hand', idx: k };
        draw(); return;
      }
    }
    // board click
    for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++){
      const rc = cellRect(r, c);
      if (x >= rc.x && x <= rc.x + rc.w && y >= rc.y && y <= rc.y + rc.h){
        const i = r*3 + c;
        if (!sel){
          if (board[i] && board[i].s === 'y'){ sel = { kind: 'cell', idx: i }; draw(); }
          return;
        }
        if (sel.kind === 'cell'){
          if (i === sel.idx){ sel = null; draw(); return; }
          // valid move?
          const moves = legalMoves(board, hand, 'y');
          const m = moves.find(m => m.kind === 'move' && m.from === sel.idx && m.to === i);
          if (!m){ sel = null; draw(); return; }
          const ns = applyMove({ b: board, h: hand }, m, 'y');
          board = ns.b; hand = ns.h; sel = null;
          if (isWinning({ b: board, h: hand }, 'y')){ winner = "you"; draw(); return; }
          turn = "ai"; draw(); setTimeout(aiMove, 400);
          return;
        } else if (sel.kind === 'hand'){
          if (board[i]) { sel = null; draw(); return; }
          const piece = hand.y[sel.idx];
          const m = { kind: 'drop', handIdx: sel.idx, piece, to: i };
          const ns = applyMove({ b: board, h: hand }, m, 'y');
          board = ns.b; hand = ns.h; sel = null;
          if (isWinning({ b: board, h: hand }, 'y')){ winner = "you"; draw(); return; }
          turn = "ai"; draw(); setTimeout(aiMove, 400);
          return;
        }
      }
    }
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve() {
      if (winner || turn !== "you") return;
      const __mvs = legalMoves(board, hand, 'y');
      if (!__mvs || !__mvs.length) { winner = "ai"; draw(); return; }
      const __mv = __mvs[Math.floor(Math.random() * __mvs.length)];
      const __ns = applyMove({ b: board, h: hand }, __mv, 'y');
      board = __ns.b; hand = __ns.h; sel = null;
      if (isWinning({ b: board, h: hand }, 'y')) { winner = "you"; draw(); return; }
      turn = "ai"; draw();
      setTimeout(aiMove, 80);
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
