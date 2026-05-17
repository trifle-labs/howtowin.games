// Node Kayles — pick a vertex; vertex + neighbours are removed. Last to move
// wins. Played here on a small 7-node graph (Petersen-like / wheel of 6 + hub
// gives interesting nim-values).

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 400);
  canvas.width = size;
  canvas.height = size + 40;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) {
    const w = canvas.width, h = canvas.height;
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    canvas.width = w * dpr; canvas.height = h * dpr; ctx.scale(dpr, dpr);
  }
  const H = canvas.height;
  const statusEl = document.getElementById("playable-status");

  const N = 7;
  const COORDS = (() => {
    const cx = size/2, cy = size/2 + 10, R = Math.min(size, size-20)*0.36;
    const pts = [{ x: cx, y: cy }]; // hub
    for (let i=0; i<6; i++){
      const a = -Math.PI/2 + i * 2*Math.PI / 6;
      pts.push({ x: cx + R*Math.cos(a), y: cy + R*Math.sin(a) });
    }
    return pts;
  })();
  // wheel: hub (0) connected to all of 1..6; 1–2–3–4–5–6–1 cycle on rim.
  const ADJ = [
    [0,1],[0,2],[0,3],[0,4],[0,5],[0,6],
    [1,2],[2,3],[3,4],[4,5],[5,6],[6,1],
  ];
  const NBR = Array.from({length: N}, () => new Set());
  for (const [a,b] of ADJ){ NBR[a].add(b); NBR[b].add(a); }

  let alive, turn, winner;
  function newGame(){ alive = Array(N).fill(true); turn="you"; winner=null; }
  newGame();

  function legal(a){ const o = []; for (let i=0; i<N; i++) if (a[i]) o.push(i); return o; }

  function applyMove(a, i){
    const na = a.slice();
    na[i] = false;
    for (const j of NBR[i]) na[j] = false;
    return na;
  }

  const memo = new Map();
  function isWinning(a){
    const k = a.map(x => x ? "1" : "0").join("");
    if (memo.has(k)) return memo.get(k);
    const moves = legal(a);
    if (!moves.length){ memo.set(k, false); return false; }
    for (const i of moves){
      if (!isWinning(applyMove(a, i))){ memo.set(k, true); return true; }
    }
    memo.set(k, false); return false;
  }

  function bestMove(a){
    const moves = legal(a);
    if (!moves.length) return -1;
    for (const i of moves){
      if (!isWinning(applyMove(a, i))) return i;
    }
    return moves[0];
  }

  function aiMove(){
    if (winner) return;
    const i = bestMove(alive);
    if (i < 0){ winner = "you"; draw(); return; }
    alive = applyMove(alive, i);
    if (!legal(alive).length){ winner = "ai"; draw(); return; }
    turn = "you"; draw();
  }

  function draw(){
    ctx.fillStyle="#fafaf7"; ctx.fillRect(0,0,size,H);
    ctx.font="13px sans-serif"; ctx.textAlign="center"; ctx.fillStyle="#444";
    ctx.fillText(`Node Kayles — pick a vertex; it + all neighbours are removed`, size/2, 22);
    ctx.strokeStyle = "#aaa"; ctx.lineWidth = 1;
    for (const [a, b] of ADJ){
      if (!alive[a] || !alive[b]) continue;
      ctx.beginPath();
      ctx.moveTo(COORDS[a].x, COORDS[a].y);
      ctx.lineTo(COORDS[b].x, COORDS[b].y); ctx.stroke();
    }
    for (let i=0; i<N; i++){
      const p = COORDS[i];
      ctx.beginPath(); ctx.arc(p.x, p.y, 20, 0, Math.PI*2);
      ctx.fillStyle = alive[i] ? "#fff" : "#eee";
      ctx.fill();
      ctx.strokeStyle = alive[i] ? "#444" : "#bbb"; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = alive[i] ? "#222" : "#bbb"; ctx.font = "11px sans-serif"; ctx.textAlign="center"; ctx.textBaseline="middle";
      ctx.fillText(String(i), p.x, p.y);
      ctx.textBaseline = "alphabetic";
    }
    if (winner) statusEl.textContent = winner === "you" ? "you win — AI cannot move!" : "AI wins — you cannot move!";
    else statusEl.textContent = turn === "you" ? "click a live vertex to remove it and its neighbours" : "AI thinking…";
  }

  function clickPos(e){ const r=canvas.getBoundingClientRect(); return {x:(e.clientX-r.left)*(size/r.width), y:(e.clientY-r.top)*(H/r.height)}; }
  function findNode(x, y){
    for (let i=0; i<N; i++){ const p = COORDS[i]; if ((x-p.x)**2+(y-p.y)**2 <= 22*22) return i; }
    return -1;
  }

  function onClick(e){
    if (winner || turn !== "you") return;
    const {x,y} = clickPos(e); const i = findNode(x, y);
    if (i < 0 || !alive[i]) return;
    alive = applyMove(alive, i);
    if (!legal(alive).length){ winner = "you"; draw(); return; }
    turn = "ai"; draw(); setTimeout(aiMove, 400);
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0,0,size,H); memo.clear(); },
    restart(){ newGame(); memo.clear(); draw(); },
    solve(){
      if (winner || turn !== "you") return;
      const i = bestMove(alive);
      if (i < 0) return;
      alive = applyMove(alive, i);
      if (!legal(alive).length){ winner = "you"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 400);
    },
  };
}
