// Brussels Sprouts — start with n crosses. Players draw lines between two free
// ends, then add a cross-bar (creating 2 new free ends). Outcome is determined
// by parity: every game lasts exactly 5n − 2 moves. So with n=3 starting
// crosses (default), game lasts 13 moves → odd → first player (you) wins.
//
// To keep the demo playable, we simplify the topology: at any time you have a
// pool of "free ends" each tagged with a coordinate. You click two free ends to
// draw the connection; we visually add a cross-bar that creates two new ends.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = 380;
  const W = canvas.width, H = canvas.height;
  const statusEl = document.getElementById("playable-status");

  const START_CROSSES = 3;
  let ends; // array of { x, y, alive }
  let lines; // array of { fromIdx, toIdx, path: [{x,y}] }
  let turn, winner, movesLeft, totalMoves;
  let selected;

  function newGame(){
    ends = []; lines = []; selected = -1;
    totalMoves = 5 * START_CROSSES - 2;
    movesLeft = totalMoves;
    // place crosses
    for (let i = 0; i < START_CROSSES; i++){
      const angle = (i / START_CROSSES) * Math.PI * 2;
      const cx = W/2 + Math.cos(angle) * 90;
      const cy = 180 + Math.sin(angle) * 80;
      // 4 free ends at offsets up/down/left/right
      ends.push({ x: cx, y: cy - 18, alive: true, cross: i });
      ends.push({ x: cx, y: cy + 18, alive: true, cross: i });
      ends.push({ x: cx - 18, y: cy, alive: true, cross: i });
      ends.push({ x: cx + 18, y: cy, alive: true, cross: i });
    }
    turn = "you"; winner = null;
  }
  newGame();

  function aiMove(){
    if (winner) return;
    const free = ends.map((e, i) => i).filter(i => ends[i].alive);
    if (free.length < 2){ endGame(); return; }
    // arbitrary pick: connect closest two free ends
    let bi = 0, bj = 1, bd = Infinity;
    for (let i = 0; i < free.length; i++) for (let j = i + 1; j < free.length; j++){
      const d = Math.hypot(ends[free[i]].x - ends[free[j]].x, ends[free[i]].y - ends[free[j]].y);
      if (d < bd){ bd = d; bi = free[i]; bj = free[j]; }
    }
    connect(bi, bj, 'w');
    if (movesLeft === 0){ endGame(); return; }
    turn = "you"; draw();
  }

  function connect(i, j, side){
    ends[i].alive = false; ends[j].alive = false;
    // midpoint of segment becomes the cross-bar; two new ends sprout perpendicular
    const a = ends[i], b = ends[j];
    const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
    const dx = b.x - a.x, dy = b.y - a.y;
    const len = Math.hypot(dx, dy) || 1;
    const px = -dy / len * 14, py = dx / len * 14;
    lines.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, side, bar: { x1: mx + px, y1: my + py, x2: mx - px, y2: my - py } });
    ends.push({ x: mx + px, y: mx ? my + py : my, alive: true, cross: -1, color: side });
    // fix: just push proper coords
    ends.pop();
    ends.push({ x: mx + px, y: my + py, alive: true, cross: -1, color: side });
    ends.push({ x: mx - px, y: my - py, alive: true, cross: -1, color: side });
    movesLeft--;
  }

  function endGame(){
    // whoever made the last move wins (normal play)
    // we made `totalMoves` moves; if totalMoves is odd, you (moving first) made the last
    winner = (totalMoves % 2 === 1) ? "you" : "ai";
    draw();
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "13px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";
    ctx.fillText(`Brussels Sprouts — n=${START_CROSSES} → game lasts ${totalMoves} moves`, W/2, 18);
    ctx.font = "11px sans-serif"; ctx.fillStyle = "#666";
    ctx.fillText(`(outcome predetermined: ${totalMoves % 2 === 1 ? "first" : "second"} player wins)`, W/2, 34);

    for (const l of lines){
      ctx.strokeStyle = l.side === 'b' ? "#39c" : "#e60";
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(l.x1, l.y1); ctx.lineTo(l.x2, l.y2); ctx.stroke();
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(l.bar.x1, l.bar.y1); ctx.lineTo(l.bar.x2, l.bar.y2); ctx.stroke();
    }
    ctx.lineWidth = 1;

    for (let i = 0; i < ends.length; i++){
      const e = ends[i]; if (!e.alive) continue;
      ctx.beginPath(); ctx.arc(e.x, e.y, i === selected ? 8 : 5, 0, Math.PI*2);
      ctx.fillStyle = i === selected ? "#0a0" : "#222"; ctx.fill();
    }

    if (winner) statusEl.textContent = winner === "you" ? "you win! (game length was odd)" : "AI wins (game length was even)";
    else statusEl.textContent = turn === "you"
      ? (selected < 0 ? `click any free end (move ${totalMoves - movesLeft + 1}/${totalMoves})` : "click another free end to connect")
      : "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }
  function findEnd(x, y){
    for (let i = 0; i < ends.length; i++){
      const e = ends[i]; if (!e.alive) continue;
      if (Math.hypot(x - e.x, y - e.y) < 12) return i;
    }
    return -1;
  }

  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e); const i = findEnd(x, y); if (i < 0) return;
    if (selected < 0){ selected = i; draw(); return; }
    if (i === selected){ selected = -1; draw(); return; }
    connect(selected, i, 'b'); selected = -1;
    if (movesLeft === 0){ endGame(); return; }
    turn = "ai"; draw(); setTimeout(aiMove, 500);
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve() {
      if (winner || turn !== "you") return;
      const __free = ends.map((e, i) => i).filter(i => ends[i].alive);
      if (__free.length < 2) { endGame(); return; }
      // Pick two random distinct free ends
      const __i = __free[Math.floor(Math.random() * __free.length)];
      let __j = __free[Math.floor(Math.random() * __free.length)];
      if (__j === __i) __j = __free[(__free.indexOf(__i) + 1) % __free.length];
      connect(__i, __j, 'b');
      selected = -1;
      if (movesLeft === 0) { endGame(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 80);
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
