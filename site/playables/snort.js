// Snort — Col's companion: you may not place adjacent to the OPPONENT's colour
// (same colours are fine). On a small graph, last to move wins.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 400);
  canvas.width = size;
  canvas.height = size + 40;
  const H = canvas.height;
  const statusEl = document.getElementById("playable-status");

  const N = 6;
  const COORDS = (() => {
    const cx = size/2, cy = size/2 + 10, R = Math.min(size, size-20)*0.36;
    const pts = [];
    for (let i=0; i<N; i++){
      const a = -Math.PI/2 + i * 2*Math.PI / N;
      pts.push({ x: cx + R*Math.cos(a), y: cy + R*Math.sin(a) });
    }
    return pts;
  })();
  const ADJ = [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[0,3],[1,4],[2,5]];
  const NBR = Array.from({length: N}, () => []);
  for (const [a,b] of ADJ){ NBR[a].push(b); NBR[b].push(a); }

  let nodes, turn, winner;
  function newGame(){ nodes = Array(N).fill("."); turn="you"; winner=null; }
  newGame();

  function legal(n, side){
    const opp = side === "you" ? "R" : "B";
    const out = [];
    for (let i=0; i<N; i++){
      if (n[i] !== ".") continue;
      let ok = true;
      for (const j of NBR[i]) if (n[j] === opp){ ok = false; break; }
      if (ok) out.push(i);
    }
    return out;
  }

  const memo = new Map();
  function isWinning(n, side){
    const k = n.join("") + side;
    if (memo.has(k)) return memo.get(k);
    const moves = legal(n, side);
    if (!moves.length){ memo.set(k, false); return false; }
    const my = side === "you" ? "B" : "R";
    for (const i of moves){
      const nn = n.slice(); nn[i] = my;
      if (!isWinning(nn, side === "you" ? "ai" : "you")){ memo.set(k, true); return true; }
    }
    memo.set(k, false); return false;
  }

  function bestMove(n, side){
    const moves = legal(n, side);
    if (!moves.length) return -1;
    const my = side === "you" ? "B" : "R";
    for (const i of moves){
      const nn = n.slice(); nn[i] = my;
      if (!isWinning(nn, side === "you" ? "ai" : "you")) return i;
    }
    return moves[0];
  }

  function aiMove(){
    if (winner) return;
    const i = bestMove(nodes, "ai");
    if (i < 0){ winner = "you"; draw(); return; }
    nodes[i] = "R";
    if (!legal(nodes, "you").length){ winner = "ai"; draw(); return; }
    turn = "you"; draw();
  }

  function draw(){
    ctx.fillStyle="#fafaf7"; ctx.fillRect(0,0,size,H);
    ctx.font="13px sans-serif"; ctx.textAlign="center"; ctx.fillStyle="#444";
    ctx.fillText(`Snort — you = Blue; cannot place adjacent to a Red node`, size/2, 22);
    ctx.strokeStyle = "#aaa"; ctx.lineWidth = 1;
    for (const [a, b] of ADJ){
      ctx.beginPath();
      ctx.moveTo(COORDS[a].x, COORDS[a].y); ctx.lineTo(COORDS[b].x, COORDS[b].y); ctx.stroke();
    }
    const moves = turn === "you" && !winner ? new Set(legal(nodes, "you")) : new Set();
    for (let i=0; i<N; i++){
      const p = COORDS[i];
      ctx.beginPath(); ctx.arc(p.x, p.y, 22, 0, Math.PI*2);
      ctx.fillStyle = nodes[i] === "B" ? "#3a6db8" : nodes[i] === "R" ? "#c14b4b" : (moves.has(i) ? "#d6f0d6" : "#fff");
      ctx.fill();
      ctx.strokeStyle = "#444"; ctx.lineWidth = 1; ctx.stroke();
    }
    if (winner) statusEl.textContent = winner === "you" ? "you win — AI cannot place!" : "AI wins — you cannot place!";
    else statusEl.textContent = turn === "you" ? "click a green node to place blue" : "AI thinking…";
  }

  function clickPos(e){ const r=canvas.getBoundingClientRect(); return {x:(e.clientX-r.left)*(size/r.width), y:(e.clientY-r.top)*(H/r.height)}; }
  function findNode(x, y){
    for (let i=0; i<N; i++){ const p = COORDS[i]; if ((x-p.x)**2+(y-p.y)**2 <= 24*24) return i; }
    return -1;
  }

  function onClick(e){
    if (winner || turn !== "you") return;
    const {x,y} = clickPos(e); const i = findNode(x, y);
    if (i < 0) return;
    if (!legal(nodes, "you").includes(i)) return;
    nodes[i] = "B";
    if (!legal(nodes, "ai").length){ winner = "you"; draw(); return; }
    turn = "ai"; draw(); setTimeout(aiMove, 400);
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0,0,size,H); memo.clear(); },
    restart(){ newGame(); memo.clear(); draw(); },
    solve(){
      if (winner || turn !== "you") return;
      const i = bestMove(nodes, "you");
      if (i < 0) return;
      nodes[i] = "B";
      if (!legal(nodes, "ai").length){ winner = "you"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 400);
    },
  };
}
