// Hashiwokakero — small bridges puzzle. Click an island and drag (or click)
// another to draw 1 bridge between them; click again on an existing bridge to
// upgrade to 2; click again to remove. All numbered islands must reach exactly
// their count of bridges, no bridges crossing, and all islands connected.

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = size + 40;
  const W = canvas.width, H = canvas.height;
  const statusEl = document.getElementById("playable-status");

  // 5×5 puzzle. (r, c, count) per island.
  // Solution: 0,0=2; 0,4=2; 2,2=4; 4,0=2; 4,4=2 with two bridges horizontally
  //           between (0,0)-(0,4), two between (4,0)-(4,4), and two vertical between
  //           (0,4)-(2,2)? no, can't bend. Different fixture:
  const ISLANDS = [
    { r: 0, c: 0, n: 2 },
    { r: 0, c: 4, n: 2 },
    { r: 2, c: 0, n: 3 },
    { r: 2, c: 4, n: 3 },
    { r: 4, c: 0, n: 2 },
    { r: 4, c: 4, n: 2 },
    { r: 2, c: 2, n: 2 },
  ];
  // bridges between islands (idx1, idx2, count) — represent as edges
  // Solution bridges for this fixed puzzle (island index pairs with counts):
  // Islands: 0=(r0,c0,n2), 1=(r0,c4,n2), 2=(r2,c0,n3), 3=(r2,c4,n3), 4=(r4,c0,n2), 5=(r4,c4,n2), 6=(r2,c2,n2)
  // Solution: each bridge count=1; no crossings; all nodes connected; sums match:
  //   0: 0-1(1)+0-2(1)=2✓  1: 0-1(1)+1-3(1)=2✓  2: 0-2(1)+2-4(1)+2-6(1)=3✓
  //   3: 1-3(1)+3-5(1)+3-6(1)=3✓  4: 2-4(1)+4-5(1)=2✓  5: 3-5(1)+4-5(1)=2✓  6: 2-6(1)+3-6(1)=2✓
  const SOLUTION = [
    { a: 0, b: 1, count: 1 }, // horizontal top
    { a: 0, b: 2, count: 1 }, // vertical left-top
    { a: 1, b: 3, count: 1 }, // vertical right-top
    { a: 2, b: 4, count: 1 }, // vertical left-bottom
    { a: 3, b: 5, count: 1 }, // vertical right-bottom
    { a: 4, b: 5, count: 1 }, // horizontal bottom
    { a: 2, b: 6, count: 1 }, // horizontal mid-left
    { a: 3, b: 6, count: 1 }, // horizontal mid-right
  ];
  let solveStep = 0;

  let edges, sel;
  function newGame(){ edges = []; sel = -1; solveStep = 0; }
  newGame();

  function findEdge(a, b){ return edges.findIndex(e => (e.a === a && e.b === b) || (e.a === b && e.b === a)); }

  function aligned(a, b){
    const A = ISLANDS[a], B = ISLANDS[b];
    return A.r === B.r || A.c === B.c;
  }
  function crosses(a, b){
    const A = ISLANDS[a], B = ISLANDS[b];
    for (const e of edges){
      if (e.count === 0) continue;
      if (e.a === a || e.a === b || e.b === a || e.b === b) continue;
      const C = ISLANDS[e.a], D = ISLANDS[e.b];
      // does AB cross CD? AB is horizontal/vertical, CD likewise
      if (A.r === B.r && C.c === D.c){
        // AB horizontal at row A.r, between min c..max c; CD vertical at col C.c, between min r..max r
        const cmin = Math.min(A.c, B.c), cmax = Math.max(A.c, B.c);
        const rmin = Math.min(C.r, D.r), rmax = Math.max(C.r, D.r);
        if (C.c > cmin && C.c < cmax && A.r > rmin && A.r < rmax) return true;
      } else if (A.c === B.c && C.r === D.r){
        const rmin = Math.min(A.r, B.r), rmax = Math.max(A.r, B.r);
        const cmin = Math.min(C.c, D.c), cmax = Math.max(C.c, D.c);
        if (C.r > rmin && C.r < rmax && A.c > cmin && A.c < cmax) return true;
      }
    }
    return false;
  }

  function islandPos(i){
    const margin = 30, cs = (size - 2*margin) / 4;
    const I = ISLANDS[i];
    return { x: margin + I.c * cs, y: 30 + I.r * cs };
  }

  function clickedIsland(x, y){
    for (let i = 0; i < ISLANDS.length; i++){
      const p = islandPos(i);
      if (Math.hypot(x - p.x, y - p.y) < 20) return i;
    }
    return -1;
  }

  function countAt(i){
    let n = 0;
    for (const e of edges){ if (e.a === i || e.b === i) n += e.count; }
    return n;
  }

  function check(){
    // each island matches its count, no edge >2, no crossings (enforced at add), all connected
    for (let i = 0; i < ISLANDS.length; i++) if (countAt(i) !== ISLANDS[i].n) return false;
    // connectivity
    const adj = new Map(); ISLANDS.forEach((_, i) => adj.set(i, []));
    for (const e of edges) if (e.count > 0){ adj.get(e.a).push(e.b); adj.get(e.b).push(e.a); }
    const seen = new Set([0]); const q = [0];
    while (q.length){ const i = q.shift(); for (const j of adj.get(i)) if (!seen.has(j)){ seen.add(j); q.push(j); } }
    return seen.size === ISLANDS.length;
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "13px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";

    // edges
    for (const e of edges){
      if (e.count === 0) continue;
      const A = islandPos(e.a), B = islandPos(e.b);
      ctx.strokeStyle = "#39c"; ctx.lineWidth = 3;
      if (e.count === 1){
        ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.stroke();
      } else {
        const dx = (B.y - A.y === 0) ? 0 : 3, dy = (B.x - A.x === 0) ? 0 : 3;
        const ox = (B.y === A.y) ? 0 : 3, oy = (B.x === A.x) ? 0 : 3;
        // perpendicular offset
        if (A.r === B.r || A.y === B.y){
          ctx.beginPath(); ctx.moveTo(A.x, A.y - 3); ctx.lineTo(B.x, B.y - 3); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(A.x, A.y + 3); ctx.lineTo(B.x, B.y + 3); ctx.stroke();
        } else {
          ctx.beginPath(); ctx.moveTo(A.x - 3, A.y); ctx.lineTo(B.x - 3, B.y); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(A.x + 3, A.y); ctx.lineTo(B.x + 3, B.y); ctx.stroke();
        }
      }
    }
    ctx.lineWidth = 1;

    // islands
    for (let i = 0; i < ISLANDS.length; i++){
      const p = islandPos(i);
      ctx.beginPath(); ctx.arc(p.x, p.y, 16, 0, Math.PI*2);
      ctx.fillStyle = i === sel ? "#cef2cf" : "#fff"; ctx.fill();
      ctx.strokeStyle = countAt(i) === ISLANDS[i].n ? "#0a0" : "#222";
      ctx.lineWidth = 2; ctx.stroke(); ctx.lineWidth = 1;
      ctx.fillStyle = "#222"; ctx.font = "14px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(ISLANDS[i].n.toString(), p.x, p.y);
    }
    ctx.textBaseline = "alphabetic";

    statusEl.textContent = check() ? "solved! ✓" : "click two islands to add a bridge";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }

  function onClick(e){
    const { x, y } = pos(e);
    const i = clickedIsland(x, y); if (i < 0){ sel = -1; draw(); return; }
    if (sel < 0){ sel = i; draw(); return; }
    if (sel === i){ sel = -1; draw(); return; }
    if (!aligned(sel, i)){ sel = i; draw(); return; }
    // check that any intermediate islands lie between (block direct bridge)
    const A = ISLANDS[sel], B = ISLANDS[i];
    for (let k = 0; k < ISLANDS.length; k++){
      if (k === sel || k === i) continue;
      const K = ISLANDS[k];
      if (A.r === B.r && K.r === A.r && K.c > Math.min(A.c, B.c) && K.c < Math.max(A.c, B.c)){ sel = i; draw(); return; }
      if (A.c === B.c && K.c === A.c && K.r > Math.min(A.r, B.r) && K.r < Math.max(A.r, B.r)){ sel = i; draw(); return; }
    }
    let idx = findEdge(sel, i);
    if (idx < 0){ if (crosses(sel, i)){ sel = -1; draw(); return; } edges.push({ a: sel, b: i, count: 1 }); }
    else if (edges[idx].count === 1) edges[idx].count = 2;
    else edges.splice(idx, 1);
    sel = -1; draw();
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve(){
      if (check()) return; // already solved
      // Walk through the hardcoded solution one bridge-count increment per call
      while (solveStep < SOLUTION.length) {
        const s = SOLUTION[solveStep];
        const eIdx = findEdge(s.a, s.b);
        const curCount = eIdx >= 0 ? edges[eIdx].count : 0;
        if (curCount < s.count) {
          // Place the next increment for this bridge
          if (eIdx < 0) edges.push({ a: s.a, b: s.b, count: 1 });
          else edges[eIdx].count++;
          sel = -1; draw(); return;
        }
        // This bridge is already at target count, advance to next
        solveStep++;
      }
      sel = -1; draw();
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
