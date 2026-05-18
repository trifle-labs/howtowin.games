// Cherries — a partisan combinatorial game. A "branch" is a row of coloured
// cherries (Blue/Red). On Left's turn (you), pick a Blue cherry: remove it and
// every cherry to its RIGHT in the same branch. On Right's turn (AI), pick a
// Red cherry: remove it and every cherry to its LEFT. Player unable to move
// loses. Full memoised minimax solves the small starting setup.

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = 240;
  const W = canvas.width, H = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) { canvas.style.width = W + 'px'; canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr); }
  const statusEl = document.getElementById("playable-status");

  let branches, turn, winner;
  function newGame(){
    branches = [
      ['B','R','B'],
      ['R','B','R','B'],
      ['B','B','R','R','B'],
    ];
    turn = "you"; winner = null;
  }
  newGame();

  function legalMoves(state, side){
    const out = [];
    for (let b = 0; b < state.length; b++){
      for (let i = 0; i < state[b].length; i++){
        if (state[b][i] === side) out.push([b, i]);
      }
    }
    return out;
  }
  function apply(state, b, i, side){
    const ns = state.map(s => s.slice());
    if (side === 'B') ns[b] = ns[b].slice(0, i);
    else ns[b] = ns[b].slice(i + 1);
    return ns;
  }
  const memo = new Map();
  function key(state, side){ return state.map(s => s.join('')).join('|') + side; }
  function winning(state, side){
    const k = key(state, side); if (memo.has(k)) return memo.get(k);
    const moves = legalMoves(state, side); if (!moves.length){ memo.set(k, false); return false; }
    const enemy = side === 'B' ? 'R' : 'B';
    for (const [b, i] of moves){
      const ns = apply(state, b, i, side);
      if (!winning(ns, enemy)){ memo.set(k, true); return true; }
    }
    memo.set(k, false); return false;
  }

  function aiPick(){
    const moves = legalMoves(branches, 'R'); if (!moves.length) return null;
    for (const m of moves){
      const ns = apply(branches, m[0], m[1], 'R');
      if (!winning(ns, 'B')) return m;
    }
    return moves[0];
  }

  function aiMove(){
    if (winner) return;
    const m = aiPick(); if (!m){ winner = "you"; draw(); return; }
    branches = apply(branches, m[0], m[1], 'R');
    if (!legalMoves(branches, 'B').length){ winner = "ai"; draw(); return; }
    turn = "you"; draw();
  }

  function cherryPos(b, i){
    const yStep = 60, x0 = 30 + i * 32;
    return { x: x0, y: 50 + b * yStep, r: 12 };
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);

    for (let b = 0; b < branches.length; b++){
      const row = branches[b];
      // branch line
      if (row.length){
        const p1 = cherryPos(b, 0), p2 = cherryPos(b, row.length - 1);
        ctx.strokeStyle = "#7a4"; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(p1.x - 12, p1.y); ctx.lineTo(p2.x + 12, p2.y); ctx.stroke();
      }
      for (let i = 0; i < row.length; i++){
        const p = cherryPos(b, i);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fillStyle = row[i] === 'B' ? "#39c" : "#e60"; ctx.fill();
        ctx.strokeStyle = "#222"; ctx.stroke();
      }
    }
    ctx.lineWidth = 1;

    if (winner) statusEl.textContent = winner === "you" ? "you win!" : "AI wins";
    else statusEl.textContent = turn === "you" ? "click a BLUE cherry to remove it and everything to the right" : "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }

  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e);
    for (let b = 0; b < branches.length; b++){
      for (let i = 0; i < branches[b].length; i++){
        const p = cherryPos(b, i);
        if (Math.hypot(x - p.x, y - p.y) < p.r){
          if (branches[b][i] !== 'B') return;
          branches = apply(branches, b, i, 'B');
          if (!legalMoves(branches, 'R').length){ winner = "you"; draw(); return; }
          turn = "ai"; draw(); setTimeout(aiMove, 400);
          return;
        }
      }
    }
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve(){
      if (winner || turn !== "you") return;
      const __mvs = legalMoves(branches, 'B');
      if (!__mvs.length) { winner = "ai"; draw(); return; }
      const __mv = __mvs[Math.floor(Math.random() * __mvs.length)];
      branches = apply(branches, __mv[0], __mv[1], 'B');
      if (!legalMoves(branches, 'R').length){ winner = "you"; draw(); return; }
      turn = "ai"; draw();
      setTimeout(aiMove, 80);
    },

    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); memo.clear(); draw(); },
  };
}
