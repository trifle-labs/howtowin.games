// Backgammon — simplified single-die race. 24 points; standard starting
// setup (2 on 24, 5 on 13, 3 on 8, 5 on 6 for white; mirrored for black).
// You play WHITE moving counter-clockwise toward your home. On each turn we
// roll one die (1–6). You may select one of your stacks and move it that
// many points. Blots (single stones) can be hit and sent to the bar; you
// must re-enter from the bar first. Bear off when all 15 are in home.
// AI: greedy — prefer hitting, else move the furthest checker.

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 420);
  canvas.width = size;
  canvas.height = 320;
  const W = canvas.width, H = canvas.height;
  const statusEl = document.getElementById("playable-status");

  // points[0..23]: array of integer (positive = white count, negative = black count)
  // index 0 is white's "home end" (point 1 in std notation). white moves from 23→0. black moves 0→23.
  let points, bar, born, die, turn, winner;
  function newGame(){
    points = new Array(24).fill(0);
    points[23] = 2; points[12] = 5; points[7] = 3; points[5] = 5;
    points[0] = -2; points[11] = -5; points[16] = -3; points[18] = -5;
    bar = { white: 0, black: 0 };
    born = { white: 0, black: 0 };
    die = null; turn = "you"; winner = null;
    roll();
  }
  function roll(){ die = 1 + Math.floor(Math.random() * 6); }

  function destFor(side, from, d){
    if (side === 'w') return from - d;
    return from + d;
  }
  function canMove(side, from, d){
    if (from === 'bar'){
      // re-entry: white re-enters at 24-d (index 24-d=23..18); black at d-1 (0..5)
      const dest = side === 'w' ? 24 - d : d - 1;
      if (dest < 0 || dest > 23) return false;
      const v = points[dest];
      return side === 'w' ? v >= -1 : v <= 1;
    }
    if (side === 'w' && points[from] <= 0) return false;
    if (side === 'b' && points[from] >= 0) return false;
    const dest = destFor(side, from, d);
    if (dest < 0 || dest > 23){
      // bearing off allowed if all in home
      if (side === 'w'){
        for (let i = 6; i < 24; i++) if (points[i] > 0) return false;
        if (dest === -1) return true;
        // overshoot only allowed if it's the furthest
        for (let i = 5; i > from; i--) if (points[i] > 0) return false;
        return dest < 0;
      } else {
        for (let i = 0; i < 18; i++) if (points[i] < 0) return false;
        if (dest === 24) return true;
        for (let i = 18; i < from; i++) if (points[i] < 0) return false;
        return dest > 23;
      }
    }
    const v = points[dest];
    return side === 'w' ? v >= -1 : v <= 1;
  }
  function applyMove(side, from, d){
    if (from === 'bar'){
      const dest = side === 'w' ? 24 - d : d - 1;
      if ((side === 'w' && points[dest] === -1) || (side === 'b' && points[dest] === 1)){
        bar[side === 'w' ? 'black' : 'white']++;
        points[dest] = side === 'w' ? 1 : -1;
      } else {
        points[dest] += side === 'w' ? 1 : -1;
      }
      bar[side === 'w' ? 'white' : 'black']--;
      return;
    }
    const dest = destFor(side, from, d);
    if (side === 'w'){
      points[from]--;
      if (dest < 0){ born.white++; return; }
      if (points[dest] === -1){ bar.black++; points[dest] = 0; }
      points[dest]++;
    } else {
      points[from]++;
      if (dest > 23){ born.black++; return; }
      if (points[dest] === 1){ bar.white++; points[dest] = 0; }
      points[dest]--;
    }
  }

  function anyMoveExists(side){
    if ((side === 'w' && bar.white > 0) || (side === 'b' && bar.black > 0)) return canMove(side, 'bar', die);
    for (let i = 0; i < 24; i++) if (canMove(side, i, die)) return true;
    return false;
  }

  function aiMove(){
    if (winner) return;
    if (bar.black > 0){
      if (canMove('b', 'bar', die)){ applyMove('b', 'bar', die); } else { /* skip */ }
    } else {
      let best = null;
      for (let i = 23; i >= 0; i--){
        if (canMove('b', i, die)){
          // prefer hit
          const dest = destFor('b', i, die);
          if (dest >= 0 && dest <= 23 && points[dest] === 1){ best = i; break; }
          if (best === null) best = i;
        }
      }
      if (best !== null) applyMove('b', best, die);
    }
    if (born.black === 15){ winner = "ai"; draw(); return; }
    roll();
    turn = "you"; draw();
  }

  function pointRect(i){
    // top row: points 12..23 (left-to-right); bottom row: points 11..0 (left-to-right)
    const ptw = (W - 40) / 12;
    const ptH = (H - 30) / 2 - 10;
    if (i >= 12){
      const c = i - 12;
      return { x: 20 + c * ptw, y: 30, w: ptw, h: ptH, dir: 1 };
    } else {
      const c = 11 - i;
      return { x: 20 + c * ptw, y: 30 + ptH + 20, w: ptw, h: ptH, dir: -1 };
    }
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "12px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";
    for (let i = 0; i < 24; i++){
      const rc = pointRect(i);
      ctx.fillStyle = i % 2 === 0 ? "#fff" : "#eee";
      ctx.beginPath();
      if (rc.dir === 1){ ctx.moveTo(rc.x, rc.y); ctx.lineTo(rc.x + rc.w, rc.y); ctx.lineTo(rc.x + rc.w/2, rc.y + rc.h); }
      else { ctx.moveTo(rc.x, rc.y + rc.h); ctx.lineTo(rc.x + rc.w, rc.y + rc.h); ctx.lineTo(rc.x + rc.w/2, rc.y); }
      ctx.closePath(); ctx.fill(); ctx.strokeStyle = "#888"; ctx.stroke();
      const v = points[i]; if (v === 0) continue;
      const colour = v > 0 ? "#39c" : "#e60";
      const count = Math.abs(v);
      const radius = Math.min(rc.w * 0.35, 12);
      for (let k = 0; k < count && k < 6; k++){
        const cy = rc.dir === 1 ? rc.y + radius + k * (radius * 1.6) : rc.y + rc.h - radius - k * (radius * 1.6);
        ctx.beginPath(); ctx.arc(rc.x + rc.w/2, cy, radius * 0.9, 0, Math.PI*2);
        ctx.fillStyle = colour; ctx.fill(); ctx.strokeStyle = "#222"; ctx.stroke();
      }
      if (count > 6){ ctx.fillStyle = "#fff"; ctx.font = "bold 10px sans-serif"; ctx.fillText(String(count), rc.x + rc.w/2, rc.dir === 1 ? rc.y + radius*1.5 : rc.y + rc.h - radius); }
    }
    ctx.fillStyle = "#444"; ctx.font = "12px sans-serif"; ctx.textAlign = "left";
    ctx.fillText(`die: ${die}  |  bar: you=${bar.white} ai=${bar.black}  |  off: you=${born.white} ai=${born.black}`, 12, H - 8);
    if (winner) statusEl.textContent = winner === "you" ? "you win!" : "AI wins";
    else statusEl.textContent = turn === "you" ? (bar.white > 0 ? `re-enter from BAR (click a home-point ${24-die+1})` : `roll ${die} — click a point to move`) : "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }

  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e);
    if (bar.white > 0){
      if (canMove('w', 'bar', die)){ applyMove('w', 'bar', die); }
      else {
        // skip turn
        if (!anyMoveExists('w')){ roll(); turn = "ai"; draw(); setTimeout(aiMove, 500); return; }
      }
      if (born.white === 15){ winner = "you"; draw(); return; }
      roll(); turn = "ai"; draw(); setTimeout(aiMove, 500); return;
    }
    for (let i = 0; i < 24; i++){
      const rc = pointRect(i);
      if (x < rc.x || x > rc.x + rc.w || y < rc.y || y > rc.y + rc.h) continue;
      if (!canMove('w', i, die)) return;
      applyMove('w', i, die);
      if (born.white === 15){ winner = "you"; draw(); return; }
      roll(); turn = "ai"; draw(); setTimeout(aiMove, 500); return;
    }
  }

  newGame();
  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve() {
      if (winner || turn !== "you") return;
      if (bar.white > 0) {
        if (canMove('w', 'bar', die)) {
          applyMove('w', 'bar', die);
          if (born.white === 15) { winner = "you"; draw(); return; }
        }
        roll(); turn = "ai"; draw(); setTimeout(aiMove, 80); return;
      }
      // Collect all legal moves for white
      const __mvs = [];
      for (let i = 0; i < 24; i++) if (canMove('w', i, die)) __mvs.push(i);
      if (!__mvs.length) {
        roll(); turn = "ai"; draw(); setTimeout(aiMove, 80); return;
      }
      const __from = __mvs[Math.floor(Math.random() * __mvs.length)];
      applyMove('w', __from, die);
      if (born.white === 15) { winner = "you"; draw(); return; }
      roll(); turn = "ai"; draw(); setTimeout(aiMove, 80);
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
