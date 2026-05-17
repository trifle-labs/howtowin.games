// Battleship — 8×8 simplified. AI hides 4 ships (sizes 4,3,3,2); you guess.
// You also receive 4 ships placed randomly for you (AI fires back). First to
// sink the entire enemy fleet wins. AI uses probability-density-style search:
// after a hit, probe orthogonal neighbours (hunt/target).

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 460);
  canvas.width = size; canvas.height = size + 40;
  const W = canvas.width, H = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) { canvas.style.width = W + 'px'; canvas.style.height = H + 'px'; canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr); }
  const statusEl = document.getElementById("playable-status");

  const N = 8;
  const SHIPS = [4, 3, 3, 2];
  let myBoard, aiBoard, myShots, aiShots, turn, winner;
  let aiTargets;

  function placeFleet(){
    const b = Array.from({ length: N }, () => new Array(N).fill(0));
    for (const len of SHIPS){
      for (let tries = 0; tries < 200; tries++){
        const horiz = Math.random() < 0.5;
        const r = Math.floor(Math.random() * (horiz ? N : N - len + 1));
        const c = Math.floor(Math.random() * (horiz ? N - len + 1 : N));
        let ok = true;
        for (let i = 0; i < len; i++){
          const rr = r + (horiz ? 0 : i), cc = c + (horiz ? i : 0);
          if (b[rr][cc]) { ok = false; break; }
        }
        if (!ok) continue;
        for (let i = 0; i < len; i++){
          const rr = r + (horiz ? 0 : i), cc = c + (horiz ? i : 0);
          b[rr][cc] = 1;
        }
        break;
      }
    }
    return b;
  }

  function newGame(){
    myBoard = placeFleet();
    aiBoard = placeFleet();
    myShots = Array.from({ length: N }, () => new Array(N).fill(0)); // 0 unknown, 1 miss, 2 hit
    aiShots = Array.from({ length: N }, () => new Array(N).fill(0));
    turn = "you"; winner = null; aiTargets = [];
  }
  newGame();

  function shipsLeft(b, shots){
    let n = 0;
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (b[r][c] && shots[r][c] !== 2) n++;
    return n;
  }

  function aiMove(){
    if (winner) return;
    let r, c;
    if (aiTargets.length){
      const t = aiTargets.shift(); r = t[0]; c = t[1];
      if (aiShots[r][c] !== 0) return aiMove();
    } else {
      do {
        r = Math.floor(Math.random() * N); c = Math.floor(Math.random() * N);
      } while (aiShots[r][c] !== 0 || (r + c) % 2 !== 0 && Math.random() < 0.7);
    }
    if (myBoard[r][c]){
      aiShots[r][c] = 2;
      for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]){
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < N && nc >= 0 && nc < N && aiShots[nr][nc] === 0) aiTargets.push([nr, nc]);
      }
      if (shipsLeft(myBoard, aiShots) === 0){ winner = "ai"; draw(); return; }
    } else {
      aiShots[r][c] = 1;
    }
    turn = "you"; draw();
  }

  function cellRect(grid, r, c){
    const margin = 16;
    const gridW = (W - 3*margin) / 2;
    const cs = (gridW - 14) / N;
    const x0 = margin + (grid === 1 ? gridW + margin : 0) + 14;
    return { x: x0 + c*cs, y: 30 + r*cs + 14, w: cs, h: cs };
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "12px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";
    ctx.font = "10px sans-serif";
    ctx.fillText("your fleet", W/4, 28);
    ctx.fillText("enemy waters", 3*W/4, 28);
    for (let g = 0; g < 2; g++){
      for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
        const rc = cellRect(g, r, c);
        ctx.fillStyle = "#bde";
        ctx.fillRect(rc.x, rc.y, rc.w, rc.h);
        ctx.strokeStyle = "#88a"; ctx.strokeRect(rc.x, rc.y, rc.w, rc.h);
        if (g === 0){
          if (myBoard[r][c]){ ctx.fillStyle = "#666"; ctx.fillRect(rc.x+2, rc.y+2, rc.w-4, rc.h-4); }
          if (aiShots[r][c] === 1){ ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(rc.x + rc.w/2, rc.y + rc.h/2, rc.w*0.18, 0, Math.PI*2); ctx.fill(); ctx.strokeStyle = "#444"; ctx.stroke(); }
          if (aiShots[r][c] === 2){ ctx.fillStyle = "#e22"; ctx.beginPath(); ctx.arc(rc.x + rc.w/2, rc.y + rc.h/2, rc.w*0.3, 0, Math.PI*2); ctx.fill(); }
        } else {
          if (myShots[r][c] === 1){ ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(rc.x + rc.w/2, rc.y + rc.h/2, rc.w*0.18, 0, Math.PI*2); ctx.fill(); ctx.strokeStyle = "#444"; ctx.stroke(); }
          if (myShots[r][c] === 2){ ctx.fillStyle = "#e22"; ctx.beginPath(); ctx.arc(rc.x + rc.w/2, rc.y + rc.h/2, rc.w*0.3, 0, Math.PI*2); ctx.fill(); }
        }
      }
    }
    ctx.fillStyle = "#444"; ctx.font = "11px sans-serif"; ctx.textAlign = "left";
    ctx.fillText(`enemy ships left: ${shipsLeft(aiBoard, myShots)}  |  your ships left: ${shipsLeft(myBoard, aiShots)}`, 16, H - 10);
    if (winner) statusEl.textContent = winner === "you" ? "you win!" : "AI wins";
    else statusEl.textContent = turn === "you" ? "click an enemy cell to fire" : "AI firing…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }

  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e);
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const rc = cellRect(1, r, c);
      if (x < rc.x || x > rc.x + rc.w || y < rc.y || y > rc.y + rc.h) continue;
      if (myShots[r][c] !== 0) return;
      myShots[r][c] = aiBoard[r][c] ? 2 : 1;
      if (shipsLeft(aiBoard, myShots) === 0){ winner = "you"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 400); return;
    }
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve() {
      if (winner || turn !== "you") return;
      // Collect unshotcells on the enemy grid
      const __opts = [];
      for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
        if (myShots[r][c] === 0) __opts.push([r, c]);
      }
      if (!__opts.length) return;
      const [__r, __c] = __opts[Math.floor(Math.random() * __opts.length)];
      myShots[__r][__c] = aiBoard[__r][__c] ? 2 : 1;
      if (shipsLeft(aiBoard, myShots) === 0) { winner = "you"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 80);
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
