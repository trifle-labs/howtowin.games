// Shannon Switching Game — small graph with vertices A and B. Short (you,
// blue) claims edges to connect A and B. Cut (AI, red) deletes edges.
// Short wins if a path A-B exists in remaining + claimed edges. Cut wins if
// no such path remains.
// Demo graph: 3×3 grid graph (3-3 grid of 9 vertices). A = top-left, B = bottom-right.

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = size + 40;
  const W = canvas.width, H = canvas.height;
  const statusEl = document.getElementById("playable-status");

  // vertices: 3×3 grid, indices 0..8 (row*3 + col)
  // edges: all adjacent horizontal+vertical pairs
  let edges; // [u, v, state] where state: '.', 'b' (secured), 'd' (deleted)
  let turn, winner;
  function newGame(){
    edges = [];
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++){
      if (c < 2) edges.push([r*3+c, r*3+c+1, '.']);
      if (r < 2) edges.push([r*3+c, (r+1)*3+c, '.']);
    }
    turn = "you"; winner = null;
  }
  newGame();

  const A = 0, B = 8;

  function shortConnected(){
    // BFS from A using only non-deleted edges
    const visited = new Set([A]); const q = [A];
    while (q.length){
      const v = q.shift();
      if (v === B) return true;
      for (const e of edges){
        if (e[2] === 'd') continue;
        let next = -1;
        if (e[0] === v) next = e[1];
        else if (e[1] === v) next = e[0];
        if (next < 0 || visited.has(next)) continue;
        visited.add(next); q.push(next);
      }
    }
    return false;
  }

  function aiPick(){
    // Cut picks an edge to delete: pick one not yet secured and whose deletion
    // does NOT immediately disconnect (so we don't waste moves on bridges that
    // would lose). But for simplicity: greedy — delete the edge that maximally
    // increases shortest-path A→B length (or makes it infinite to win).
    const cand = edges.map((e, i) => i).filter(i => edges[i][2] === '.');
    if (!cand.length) return -1;
    // immediate win: delete an edge that disconnects A-B (treating secured edges as undeletable)
    for (const i of cand){
      const saved = edges[i][2]; edges[i][2] = 'd';
      if (!shortConnected()){ edges[i][2] = saved; return i; }
      edges[i][2] = saved;
    }
    // random else
    return cand[Math.floor(Math.random() * cand.length)];
  }

  function aiMove(){
    if (winner) return;
    const i = aiPick(); if (i < 0){ winner = "you"; draw(); return; }
    edges[i][2] = 'd';
    if (!shortConnected()){ winner = "ai"; draw(); return; }
    // check if all edges resolved
    if (edges.every(e => e[2] !== '.')){ winner = "you"; draw(); return; }
    turn = "you"; draw();
  }

  function nodePos(v){
    const margin = 50, step = (size - 2*margin) / 2;
    const r = Math.floor(v / 3), c = v % 3;
    return { x: margin + c * step, y: 50 + r * step };
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "13px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";

    for (const e of edges){
      const p1 = nodePos(e[0]), p2 = nodePos(e[1]);
      if (e[2] === 'd'){
        ctx.strokeStyle = "#fcc"; ctx.setLineDash([4, 4]); ctx.lineWidth = 1;
      } else if (e[2] === 'b'){
        ctx.strokeStyle = "#39c"; ctx.setLineDash([]); ctx.lineWidth = 5;
      } else {
        ctx.strokeStyle = "#999"; ctx.setLineDash([]); ctx.lineWidth = 2;
      }
      ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
    }
    ctx.setLineDash([]); ctx.lineWidth = 1;

    for (let v = 0; v < 9; v++){
      const p = nodePos(v);
      ctx.beginPath(); ctx.arc(p.x, p.y, 10, 0, Math.PI*2);
      ctx.fillStyle = v === A ? "#bcd9f0" : v === B ? "#bcd9f0" : "#fff";
      ctx.fill(); ctx.strokeStyle = "#222"; ctx.stroke();
      if (v === A || v === B){
        ctx.fillStyle = "#222"; ctx.font = "12px sans-serif";
        ctx.fillText(v === A ? "A" : "B", p.x, p.y + 4);
      }
    }

    if (winner) statusEl.textContent = winner === "you" ? "Short wins! A connects to B" : "Cut wins! A and B disconnected";
    else statusEl.textContent = turn === "you" ? "click a grey edge to SECURE it" : "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }
  function findEdge(x, y){
    let best = -1, bd = 12;
    for (let i = 0; i < edges.length; i++){
      const e = edges[i]; if (e[2] !== '.') continue;
      const p1 = nodePos(e[0]), p2 = nodePos(e[1]);
      const mx = (p1.x + p2.x)/2, my = (p1.y + p2.y)/2;
      const d = Math.hypot(x - mx, y - my);
      if (d < bd){ bd = d; best = i; }
    }
    return best;
  }

  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e); const i = findEdge(x, y); if (i < 0) return;
    edges[i][2] = 'b';
    // Short wins if a path A-B uses only secured edges
    const visited = new Set([A]); const q = [A]; let connected = false;
    while (q.length){
      const v = q.shift(); if (v === B){ connected = true; break; }
      for (const ee of edges){
        if (ee[2] !== 'b') continue;
        let next = -1;
        if (ee[0] === v) next = ee[1]; else if (ee[1] === v) next = ee[0];
        if (next < 0 || visited.has(next)) continue;
        visited.add(next); q.push(next);
      }
    }
    if (connected){ winner = "you"; draw(); return; }
    turn = "ai"; draw(); setTimeout(aiMove, 500);
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve(){
      if (winner || turn !== "you") return;
      const __mvs = edges.map((e, i) => i).filter(i => edges[i][2] === '.');
      if (!__mvs.length) { winner = "ai"; draw(); return; }
      const __i = __mvs[Math.floor(Math.random() * __mvs.length)];
      edges[__i][2] = 'b';
      // check if Short wins (secured path A-B)
      const __vis = new Set([A]); const __q = [A]; let __conn = false;
      while (__q.length){
        const __v = __q.shift(); if (__v === B){ __conn = true; break; }
        for (const ee of edges){
          if (ee[2] !== 'b') continue;
          let next = -1;
          if (ee[0] === __v) next = ee[1]; else if (ee[1] === __v) next = ee[0];
          if (next < 0 || __vis.has(next)) continue;
          __vis.add(next); __q.push(next);
        }
      }
      if (__conn){ winner = "you"; draw(); return; }
      turn = "ai"; draw();
      setTimeout(aiMove, 80);
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
