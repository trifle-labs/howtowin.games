// Triplets — three independent subtract-{1,2,3} heaps. Grundy of a single
// subtract-{1,2,3} heap is n mod 4; combined position is the XOR of these.

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = 340;
  const W = canvas.width, H = canvas.height;
  const statusEl = document.getElementById("playable-status");

  let heaps, turn, winner;
  function newGame(){ heaps = [7, 9, 11]; turn = "you"; winner = null; }
  newGame();

  function endsHere(hs){ return hs.every(h => h === 0); }
  function grundy(n){ return n % 4; }
  function xorAll(hs){ return hs.reduce((a, h) => a ^ grundy(h), 0); }

  function aiBest(hs){
    // find a move (i, k∈{1,2,3}) making XOR of grundies = 0
    for (let i = 0; i < hs.length; i++){
      for (let k = 1; k <= 3; k++){
        if (hs[i] < k) continue;
        const trial = hs.slice(); trial[i] -= k;
        if (xorAll(trial) === 0) return { i, k };
      }
    }
    // no winning move — take 1 from any non-empty
    for (let i = 0; i < hs.length; i++) if (hs[i] > 0) return { i, k: 1 };
    return null;
  }

  function aiMove(){
    if (winner) return;
    const mv = aiBest(heaps);
    if (!mv){ winner = "you"; draw(); return; }
    heaps[mv.i] -= mv.k;
    if (endsHere(heaps)){ winner = "ai"; draw(); return; } // ai took last, ai wins (normal play)
    turn = "you"; draw();
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "13px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";

    const colW = W/3;
    for (let i = 0; i < 3; i++){
      const cx = colW*i + colW/2;
      ctx.fillStyle = "#888"; ctx.fillText(`heap ${i+1}: ${heaps[i]}`, cx, 60);
      // render up to 12 dots in a 3-wide grid
      for (let k = 0; k < heaps[i]; k++){
        const col = k % 3, row = Math.floor(k / 3);
        const x = cx - 24 + col*16, y = 90 + row*16;
        ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI*2);
        ctx.fillStyle = "#444"; ctx.fill();
      }
      // buttons for take 1/2/3
      for (let k = 1; k <= 3; k++){
        const bx = cx - 50 + (k-1)*34, by = 250;
        const en = !winner && turn === "you" && heaps[i] >= k;
        ctx.fillStyle = en ? "#5a7" : "#bbb"; ctx.fillRect(bx, by, 28, 28);
        ctx.fillStyle = "#fff"; ctx.font = "14px sans-serif"; ctx.textBaseline = "middle";
        ctx.fillText(String(k), bx + 14, by + 14);
        ctx.textBaseline = "alphabetic";
      }
    }
    if (winner) statusEl.textContent = winner === "you" ? "you win!" : "AI wins";
    else statusEl.textContent = turn === "you" ? "take 1/2/3 from any heap" : "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }
  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e); const colW = W/3;
    for (let i = 0; i < 3; i++){
      const cx = colW*i + colW/2;
      for (let k = 1; k <= 3; k++){
        const bx = cx - 50 + (k-1)*34, by = 250;
        if (x >= bx && x <= bx + 28 && y >= by && y <= by + 28 && heaps[i] >= k){
          heaps[i] -= k;
          if (endsHere(heaps)){ winner = "you"; draw(); return; }
          turn = "ai"; draw(); setTimeout(aiMove, 500); return;
        }
      }
    }
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
    solve(){
      if (winner || turn !== "you") return;
      const mv = aiBest(heaps); if (!mv) return;
      heaps[mv.i] -= mv.k;
      if (endsHere(heaps)){ winner = "you"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 500);
    },
  };
}
