// Red-Blue-Green Hackenbush — coloured edges rooted at ground. Left (you,
// blue) removes blue or green; Right (AI, red) removes red or green. After
// removal, components no longer connected to ground are removed too.
// Player unable to move loses. AI: full minimax.

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = 360;
  const W = canvas.width, H = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) { canvas.style.width = W + 'px'; canvas.style.height = H + 'px'; canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr); }
  const statusEl = document.getElementById("playable-status");

  // Three stalks rooted at ground. Each is a list of edges (B/R/G) bottom→top.
  let stalks, turn, winner;
  function newGame(){
    stalks = [
      ['B','G','B'],
      ['R','G','R','B'],
      ['G','B','R','B','G'],
    ];
    turn = "you"; winner = null;
  }
  newGame();

  function canPlay(state, side){
    for (const s of state) for (const e of s){
      if (side === 'B' && (e === 'B' || e === 'G')) return true;
      if (side === 'R' && (e === 'R' || e === 'G')) return true;
    }
    return false;
  }

  function apply(state, si, ei){
    const ns = state.map(s => s.slice());
    ns[si] = ns[si].slice(0, ei);
    return ns;
  }

  function legal(state, side){
    const out = [];
    for (let s = 0; s < state.length; s++) for (let e = 0; e < state[s].length; e++){
      const v = state[s][e];
      if (side === 'B' && (v === 'B' || v === 'G')) out.push([s, e]);
      if (side === 'R' && (v === 'R' || v === 'G')) out.push([s, e]);
    }
    return out;
  }

  const memo = new Map();
  function key(state, side){ return state.map(s => s.join('')).join('|') + side; }
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
    const moves = legal(stalks, 'R'); if (!moves.length) return null;
    for (const m of moves){
      const ns = apply(stalks, m[0], m[1]);
      if (!winning(ns, 'B')) return m;
    }
    return moves[0];
  }

  function aiMove(){
    if (winner) return;
    const m = aiPick(); if (!m){ winner = "you"; draw(); return; }
    stalks = apply(stalks, m[0], m[1]);
    if (!canPlay(stalks, 'B')){ winner = "ai"; draw(); return; }
    turn = "you"; draw();
  }

  function edgePos(s, e){
    const baseY = 320, edgeH = 32;
    const x = 60 + s*110;
    const y1 = baseY - e*edgeH, y2 = y1 - edgeH;
    return { x1: x, y1, x2: x, y2 };
  }

  function colorFor(c){ return c === 'B' ? "#39c" : c === 'R' ? "#e60" : "#7c7"; }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#888"; ctx.fillRect(20, 320, W - 40, 4);

    for (let s = 0; s < stalks.length; s++){
      for (let e = 0; e < stalks[s].length; e++){
        const p = edgePos(s, e);
        ctx.strokeStyle = colorFor(stalks[s][e]); ctx.lineWidth = 6;
        ctx.beginPath(); ctx.moveTo(p.x1, p.y1); ctx.lineTo(p.x2, p.y2); ctx.stroke();
        ctx.fillStyle = "#444"; ctx.beginPath(); ctx.arc(p.x2, p.y2, 5, 0, Math.PI*2); ctx.fill();
      }
    }
    ctx.lineWidth = 1;
    if (winner) statusEl.textContent = winner === "you" ? "you win!" : "AI wins";
    else statusEl.textContent = turn === "you" ? "click a blue or green edge" : "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }
  function findEdge(x, y){
    for (let s = 0; s < stalks.length; s++) for (let e = 0; e < stalks[s].length; e++){
      const p = edgePos(s, e);
      if (Math.abs(x - p.x1) < 12 && y >= p.y2 - 5 && y <= p.y1 + 5) return [s, e];
    }
    return null;
  }

  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e); const ed = findEdge(x, y); if (!ed) return;
    const c = stalks[ed[0]][ed[1]]; if (c !== 'B' && c !== 'G') return;
    stalks = apply(stalks, ed[0], ed[1]);
    if (!canPlay(stalks, 'R')){ winner = "you"; draw(); return; }
    turn = "ai"; draw(); setTimeout(aiMove, 500);
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve(){
      if (winner || turn !== "you") return;
      const __mvs = legal(stalks, 'B');
      if (!__mvs.length) { winner = "ai"; draw(); return; }
      const __mv = __mvs[Math.floor(Math.random() * __mvs.length)];
      stalks = apply(stalks, __mv[0], __mv[1]);
      if (!canPlay(stalks, 'R')){ winner = "you"; draw(); return; }
      turn = "ai"; draw();
      setTimeout(aiMove, 80);
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); memo.clear(); draw(); },
  };
}
