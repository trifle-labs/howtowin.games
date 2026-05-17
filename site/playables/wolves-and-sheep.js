// Wolves and Sheep — 8×8 board, dark squares only. You play 4 Sheep (white)
// starting on the back-rank dark squares; AI plays 1 Wolf (black) on the
// opposite back rank. Sheep move forward-diagonal only; wolf moves any
// diagonal. No captures. Sheep win by trapping wolf; wolf wins by reaching
// sheep's home rank.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 480);
  canvas.width = size;
  canvas.height = size + 60;
  const H = canvas.height;
  const statusEl = document.getElementById("playable-status");

  const ROWS = 8, COLS = 8;
  let sheep, wolf, turn, winner, sel;
  function newGame(){
    sheep = [[0,1],[0,3],[0,5],[0,7]];
    wolf = [7, 0];
    turn = "you"; winner = null; sel = -1;
  }
  newGame();

  function isDark(r, c){ return (r + c) % 2 === 1; }
  function onBoard(r, c){ return r>=0 && r<ROWS && c>=0 && c<COLS && isDark(r, c); }
  function occupied(r, c){
    if (wolf[0] === r && wolf[1] === c) return "W";
    for (const s of sheep) if (s[0] === r && s[1] === c) return "S";
    return null;
  }

  function sheepMoves(){
    const out = [];
    for (let i=0; i<sheep.length; i++){
      const [r, c] = sheep[i];
      for (const [dr, dc] of [[1,-1],[1,1]]){
        const nr = r+dr, nc = c+dc;
        if (onBoard(nr, nc) && !occupied(nr, nc)) out.push({ idx: i, to: [nr, nc] });
      }
    }
    return out;
  }
  function wolfMoves(){
    const out = [];
    const [r, c] = wolf;
    for (const [dr, dc] of [[1,-1],[1,1],[-1,-1],[-1,1]]){
      const nr = r+dr, nc = c+dc;
      if (onBoard(nr, nc) && !occupied(nr, nc)) out.push({ to: [nr, nc] });
    }
    return out;
  }

  function applySheep(i, to){ sheep[i] = to; }
  function applyWolf(to){ wolf = to; }

  function aiMoveWolf(){
    if (winner) return;
    const moves = wolfMoves();
    if (!moves.length){ winner = "you"; draw(); return; }
    // Greedy: advance toward row 0 (decrease row); break ties by squeezing through gaps.
    let best = moves[0], bestVal = Infinity;
    for (const m of moves){
      const [r, c] = m.to;
      let val = r * 10;
      // tie-break: distance to nearest sheep column matters less; prefer ties going to lower-col density
      let nearSheep = Infinity;
      for (const [sr, sc] of sheep){
        const d = Math.abs(sr - r) + Math.abs(sc - c);
        if (d < nearSheep) nearSheep = d;
      }
      val -= nearSheep * 0.1;
      if (val < bestVal){ bestVal = val; best = m; }
    }
    applyWolf(best.to);
    if (wolf[0] === 0){ winner = "ai"; draw(); return; }
    if (!sheepMoves().length){ winner = "ai"; draw(); return; } // no sheep moves means deadlock; wolf wins
    turn = "you"; draw();
  }

  function cellRect(r, c){
    const margin = 16;
    const cw = (size - 2*margin) / COLS;
    return { x: margin + c*cw, y: 50 + r*cw, w: cw, h: cw };
  }

  function draw(){
    ctx.fillStyle="#fafaf7"; ctx.fillRect(0,0,size,H);
    ctx.font="13px sans-serif"; ctx.textAlign="center"; ctx.fillStyle="#444";
    ctx.fillText(`Wolves and Sheep — sheep ↗↘ only; wolf any diagonal`, size/2, 22);

    let targets = new Set();
    if (sel >= 0 && turn === "you"){
      for (const m of sheepMoves()) if (m.idx === sel) targets.add(m.to.join(","));
    }

    for (let r=0; r<ROWS; r++) for (let c=0; c<COLS; c++){
      const rc = cellRect(r, c);
      const dark = isDark(r, c);
      ctx.fillStyle = dark ? "#3a3a3a" : "#dcd7c4";
      ctx.fillRect(rc.x, rc.y, rc.w, rc.h);
      if (targets.has(`${r},${c}`)){
        ctx.fillStyle = "rgba(80,180,80,0.5)"; ctx.fillRect(rc.x, rc.y, rc.w, rc.h);
      }
      const occ = occupied(r, c);
      if (occ){
        ctx.beginPath(); ctx.arc(rc.x + rc.w/2, rc.y + rc.h/2, rc.w*0.35, 0, Math.PI*2);
        ctx.fillStyle = occ === "S" ? "#fff" : "#222"; ctx.fill();
        const selSheep = sel >= 0 && occ === "S" && sheep[sel][0] === r && sheep[sel][1] === c;
        ctx.strokeStyle = selSheep ? "#06c" : "#888"; ctx.lineWidth = selSheep ? 3 : 1; ctx.stroke();
      }
    }
    if (winner) statusEl.textContent = winner === "you" ? "you win — wolf is trapped!" : "AI wins — wolf reached home rank!";
    else statusEl.textContent = turn === "you" ? "click a sheep, then a green forward-diagonal cell" : "AI thinking…";
  }

  function clickPos(e){ const r=canvas.getBoundingClientRect(); return {x:(e.clientX-r.left)*(size/r.width), y:(e.clientY-r.top)*(H/r.height)}; }
  function findCell(x, y){
    for (let r=0; r<ROWS; r++) for (let c=0; c<COLS; c++){
      const rc = cellRect(r, c); if (x>=rc.x&&x<=rc.x+rc.w&&y>=rc.y&&y<=rc.y+rc.h) return [r, c];
    }
    return null;
  }
  function findSheep(r, c){ for (let i=0; i<sheep.length; i++) if (sheep[i][0]===r&&sheep[i][1]===c) return i; return -1; }

  function onClick(e){
    if (winner || turn !== "you") return;
    const {x,y} = clickPos(e); const cell = findCell(x, y);
    if (!cell) return;
    const si = findSheep(cell[0], cell[1]);
    if (si >= 0){ sel = si; draw(); return; }
    if (sel >= 0){
      const m = sheepMoves().find(mv => mv.idx === sel && mv.to[0] === cell[0] && mv.to[1] === cell[1]);
      if (m){
        applySheep(sel, m.to);
        sel = -1;
        if (!wolfMoves().length){ winner = "you"; draw(); return; }
        turn = "ai"; draw(); setTimeout(aiMoveWolf, 500);
      }
    }
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0,0,size,H); },
    restart(){ newGame(); draw(); },
    solve(){
      if (winner || turn !== "you") return;
      // Heuristic: advance the sheep that is closest in column to the wolf (block its lane).
      const moves = sheepMoves();
      if (!moves.length){ winner = "ai"; draw(); return; }
      moves.sort((a, b) => Math.abs(a.to[1] - wolf[1]) - Math.abs(b.to[1] - wolf[1]));
      const m = moves[0];
      applySheep(m.idx, m.to);
      sel = -1;
      if (!wolfMoves().length){ winner = "you"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMoveWolf, 500);
    },
  };
}
