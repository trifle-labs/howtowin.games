// Toppling Dominoes — a row of coloured dominoes B (blue, Left only), R (red,
// Right only), G (green, either). On your turn pick one of YOUR colour (or
// green) and topple it L or R: that domino plus all contiguous dominoes in the
// chosen direction are removed. Last to move wins.
// AI: full minimax (game is small).

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = 200;
  const W = canvas.width, H = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) { canvas.style.width = W + 'px'; canvas.style.height = H + 'px'; canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr); }
  const statusEl = document.getElementById("playable-status");

  let row, turn, winner, selected;
  function newGame(){ row = ['B','G','R','B','R','G','B','R']; turn = "you"; winner = null; selected = -1; }
  newGame();

  function canPlay(state, i, side){
    if (i < 0 || i >= state.length) return false;
    if (state[i] === 'G') return true;
    if (side === 'B') return state[i] === 'B';
    return state[i] === 'R';
  }

  function apply(state, i, dir){
    // topple dominoes from i in direction dir (-1 = left, +1 = right)
    const ns = state.slice();
    let k = i;
    while (k >= 0 && k < ns.length){ ns.splice(k, 1); if (dir > 0){ k = i; } else { k = i - 1; } if (k < 0 || k >= ns.length) break; }
    // Above logic is bugged for 'remove i and all contiguous in direction'.
    // Simpler: remove [i..end] for right, [0..i] for left.
    const out = state.slice();
    if (dir > 0) out.splice(i, out.length - i);
    else out.splice(0, i + 1);
    return out;
  }

  function legal(state, side){
    const out = [];
    for (let i = 0; i < state.length; i++){
      if (!canPlay(state, i, side)) continue;
      // topple right or left
      out.push([i, +1]); out.push([i, -1]);
    }
    return out;
  }

  const memo = new Map();
  function key(state, side){ return state.join('') + '|' + side; }
  function winning(state, side){
    const k = key(state, side); if (memo.has(k)) return memo.get(k);
    const moves = legal(state, side);
    if (!moves.length){ memo.set(k, false); return false; }
    const enemy = side === 'B' ? 'R' : 'B';
    for (const m of moves){
      const ns = apply(state, m[0], m[1]);
      if (!winning(ns, enemy)){ memo.set(k, true); return true; }
    }
    memo.set(k, false); return false;
  }

  function aiPick(){
    const moves = legal(row, 'R'); if (!moves.length) return null;
    for (const m of moves){
      const ns = apply(row, m[0], m[1]);
      if (!winning(ns, 'B')) return m;
    }
    return moves[0];
  }

  function aiMove(){
    if (winner) return;
    const m = aiPick(); if (!m){ winner = "you"; draw(); return; }
    row = apply(row, m[0], m[1]);
    if (!legal(row, 'B').length){ winner = "ai"; draw(); return; }
    turn = "you"; draw();
  }

  function pieceRect(i){
    const margin = 20, dw = (size - 2*margin) / Math.max(8, row.length);
    return { x: margin + i * dw, y: 70, w: dw - 4, h: 60 };
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "13px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";

    for (let i = 0; i < row.length; i++){
      const r = pieceRect(i);
      ctx.fillStyle = row[i] === 'B' ? "#39c" : row[i] === 'R' ? "#e60" : "#7d7";
      ctx.fillRect(r.x, r.y, r.w, r.h);
      ctx.strokeStyle = i === selected ? "#000" : "#444"; ctx.lineWidth = i === selected ? 3 : 1;
      ctx.strokeRect(r.x, r.y, r.w, r.h); ctx.lineWidth = 1;
      ctx.fillStyle = "#fff"; ctx.font = "16px sans-serif";
      ctx.fillText(row[i], r.x + r.w/2, r.y + r.h/2 + 5);
    }

    if (selected >= 0){
      ctx.fillStyle = "#bcd9f0"; ctx.fillRect(80, 150, 60, 30); ctx.strokeRect(80, 150, 60, 30);
      ctx.fillStyle = "#222"; ctx.font = "14px sans-serif"; ctx.fillText("◀ LEFT", 110, 170);
      ctx.fillStyle = "#bcd9f0"; ctx.fillRect(240, 150, 60, 30); ctx.strokeRect(240, 150, 60, 30);
      ctx.fillStyle = "#222"; ctx.fillText("RIGHT ▶", 270, 170);
    }

    if (winner) statusEl.textContent = winner === "you" ? "you win!" : "AI wins";
    else statusEl.textContent = turn === "you" ?
      (selected < 0 ? "click a blue or green domino" : "click ◀ to topple LEFT or RIGHT ▶") : "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }
  function findPiece(x, y){
    for (let i = 0; i < row.length; i++){
      const r = pieceRect(i);
      if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) return i;
    }
    return -1;
  }

  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e);
    if (selected >= 0 && y >= 150 && y <= 180){
      if (x >= 80 && x <= 140){ row = apply(row, selected, -1); selected = -1; }
      else if (x >= 240 && x <= 300){ row = apply(row, selected, +1); selected = -1; }
      else { selected = -1; draw(); return; }
      if (!legal(row, 'R').length){ winner = "you"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 500);
      return;
    }
    const i = findPiece(x, y); if (i < 0) return;
    if (!canPlay(row, i, 'B')){ selected = -1; draw(); return; }
    selected = i; draw();
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve(){
      if (winner || turn !== "you") return;
      const __mvs = legal(row, 'B');
      if (!__mvs.length){ winner = "ai"; draw(); return; }
      const __mv = __mvs[Math.floor(Math.random() * __mvs.length)];
      row = apply(row, __mv[0], __mv[1]); selected = -1;
      if (!legal(row, 'R').length){ winner = "you"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 80);
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); memo.clear(); draw(); },
  };
}
