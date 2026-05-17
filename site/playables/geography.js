// Directed Vertex Geography — like UVG but graph edges are one-directional.
// PSPACE-complete in general; here a small fixed DAG is fully solved by memoised
// minimax. Player unable to move loses.

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = size + 30;
  const W = canvas.width, H = canvas.height;
  const statusEl = document.getElementById("playable-status");

  const V = 8;
  const NODES = [
    { x: 0.15, y: 0.30 }, { x: 0.45, y: 0.20 }, { x: 0.75, y: 0.30 },
    { x: 0.15, y: 0.60 }, { x: 0.45, y: 0.50 }, { x: 0.75, y: 0.60 },
    { x: 0.30, y: 0.85 }, { x: 0.65, y: 0.85 },
  ];
  // directed edges (from → to). Includes cycles.
  const EDGES = [
    [0,1],[1,2],[0,3],[1,4],[2,5],[4,3],[4,5],[3,6],[5,7],[6,4],[7,6],[4,7],[2,1],
  ];
  const OUT = Array.from({ length: V }, () => []);
  for (const [a, b] of EDGES) OUT[a].push(b);

  let token, visited, turn, winner;
  function newGame(){ token = 0; visited = new Set([0]); turn = "you"; winner = null; }
  newGame();

  function legalMoves(v, vis){ return OUT[v].filter(n => !vis.has(n)); }
  const memo = new Map();
  function maskOf(vis){ let m = 0; for (const v of vis) m |= 1 << v; return m; }
  function winningRec(v, mask, side){
    const k = `${v}|${mask}|${side}`; if (memo.has(k)) return memo.get(k);
    const moves = OUT[v].filter(n => !(mask & (1 << n)));
    if (!moves.length){ memo.set(k, false); return false; }
    const enemy = side === 'A' ? 'B' : 'A';
    for (const m of moves){
      const nm = mask | (1 << m);
      if (!winningRec(m, nm, enemy)){ memo.set(k, true); return true; }
    }
    memo.set(k, false); return false;
  }

  function aiPick(){
    const moves = legalMoves(token, visited); if (!moves.length) return -1;
    for (const m of moves){
      const nmask = maskOf(visited) | (1 << m);
      if (!winningRec(m, nmask, 'A')) return m;
    }
    return moves[0];
  }
  function aiMove(){
    if (winner) return;
    const m = aiPick(); if (m < 0){ winner = "you"; draw(); return; }
    token = m; visited.add(m);
    if (!legalMoves(token, visited).length){ winner = "ai"; draw(); return; }
    turn = "you"; draw();
  }

  function nodePos(i){ return { x: NODES[i].x * size, y: 20 + NODES[i].y * (size - 20) }; }

  function drawArrow(p1, p2, color){
    ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 1;
    const dx = p2.x - p1.x, dy = p2.y - p1.y, len = Math.hypot(dx, dy);
    const ux = dx / len, uy = dy / len;
    const ex = p2.x - ux * 18, ey = p2.y - uy * 18;
    ctx.beginPath(); ctx.moveTo(p1.x + ux*18, p1.y + uy*18); ctx.lineTo(ex, ey); ctx.stroke();
    // head
    const hx = ex - ux * 7, hy = ey - uy * 7;
    const px = -uy, py = ux;
    ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(hx + px*4, hy + py*4); ctx.lineTo(hx - px*4, hy - py*4); ctx.closePath(); ctx.fill();
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "13px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";

    for (const [a, b] of EDGES){ drawArrow(nodePos(a), nodePos(b), "#888"); }
    for (let i = 0; i < V; i++){
      const p = nodePos(i);
      const isTok = i === token, isVis = visited.has(i), isLegal = !isVis && OUT[token].includes(i);
      ctx.beginPath(); ctx.arc(p.x, p.y, 16, 0, Math.PI*2);
      ctx.fillStyle = isTok ? "#e60" : isVis ? "#bbb" : (isLegal && turn === 'you' && !winner ? "#cef2cf" : "#fff");
      ctx.fill();
      ctx.strokeStyle = isLegal && turn === 'you' && !winner ? "#0a0" : "#222"; ctx.lineWidth = isLegal ? 3 : 1;
      ctx.stroke(); ctx.lineWidth = 1;
      ctx.fillStyle = "#222"; ctx.font = "13px sans-serif"; ctx.textBaseline = "middle";
      ctx.fillText(String.fromCharCode(65 + i), p.x, p.y); ctx.textBaseline = "alphabetic";
    }

    if (winner) statusEl.textContent = winner === "you" ? "AI stuck — you win!" : "you got stuck — AI wins";
    else statusEl.textContent = turn === "you" ? "click a green-outlined successor" : "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }

  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e);
    for (let i = 0; i < V; i++){
      const p = nodePos(i);
      if (Math.hypot(x - p.x, y - p.y) < 18){
        if (visited.has(i) || !OUT[token].includes(i)) return;
        token = i; visited.add(i);
        if (!legalMoves(token, visited).length){ winner = "ai"; draw(); return; }
        turn = "ai"; draw(); setTimeout(aiMove, 400); return;
      }
    }
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve(){
      if (winner || turn !== "you") return;
      const __mvs = legalMoves(token, visited);
      if (!__mvs || !__mvs.length){ winner = "ai"; draw(); return; }
      const __mv = __mvs[Math.floor(Math.random() * __mvs.length)];
      token = __mv; visited.add(__mv);
      if (!legalMoves(token, visited).length){ winner = "ai"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 80);
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); memo.clear(); draw(); },
  };
}
