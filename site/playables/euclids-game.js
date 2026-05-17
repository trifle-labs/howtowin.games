// Euclid's game — two piles (a, b). On your turn replace the larger with
// (larger − k·smaller) for some k ≥ 1 keeping the result ≥ 0. Reducing a pile
// to 0 wins. Strongly solved: from (a,b) with a ≤ b, the position is an
// N-position (first-player win) iff b/a ≥ φ.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 420);
  canvas.width = size;
  canvas.height = 260;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) {
    const w = canvas.width, h = canvas.height;
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    canvas.width = w * dpr; canvas.height = h * dpr; ctx.scale(dpr, dpr);
  }
  const statusEl = document.getElementById("playable-status");

  const PHI = (1 + Math.sqrt(5)) / 2;

  let a, b, turn, winner, sel;
  function newGame(){
    // Random N-position so the player can have a winning move.
    while (true){
      const x = 3 + Math.floor(Math.random()*7);
      const y = x + 1 + Math.floor(Math.random()*30);
      if (y / x >= PHI){ a = x; b = y; break; }
    }
    turn = "you"; winner = null; sel = -1;
  }
  newGame();

  function legalKs(){
    // Subtract k·min from max where k in [1, floor(max/min)]
    const lo = Math.min(a, b), hi = Math.max(a, b);
    if (lo === 0) return [];
    const out = [];
    for (let k = 1; k * lo <= hi; k++) out.push(k);
    return out;
  }

  function applyK(k){
    if (a <= b) b = b - k*a;
    else a = a - k*b;
  }

  function winningK(){
    const ks = legalKs();
    if (!ks.length) return null;
    for (const k of ks){
      // Simulate
      const sa = a, sb = b;
      applyK(k);
      const lo = Math.min(a, b), hi = Math.max(a, b);
      const win = (lo === 0) || (hi/lo < PHI && lo > 0); // opponent now P-position
      a = sa; b = sb;
      if (win) return k;
    }
    return null;
  }

  function aiMove(){
    if (winner) return;
    const ks = legalKs();
    if (!ks.length){ winner = "you"; draw(); return; }
    let k = winningK();
    if (k === null) k = 1; // forced into P-position; minimal move
    applyK(k);
    if (Math.min(a, b) === 0){ winner = "ai"; draw(); return; }
    turn = "you"; draw();
  }

  function commit(k){
    applyK(k);
    if (Math.min(a, b) === 0){ winner = turn === "you" ? "you" : "ai"; draw(); return true; }
    return false;
  }

  function pileRect(which){
    const y = 70, w = 100, h = 100, gap = 60;
    const x0 = (size - 2*w - gap) / 2;
    return { x: x0 + which*(w + gap), y, w, h };
  }

  function kBtnRect(idx, n){
    const margin = 20, gap = 4, y = 200, h = 30;
    const maxBtns = Math.min(n, 10);
    const btnW = Math.min(40, (size - 2*margin - (maxBtns-1)*gap) / maxBtns);
    const total = maxBtns * btnW + (maxBtns - 1) * gap;
    const x0 = (size - total) / 2;
    return { x: x0 + idx*(btnW+gap), y, w: btnW, h };
  }

  function draw(){
    ctx.fillStyle="#fafaf7"; ctx.fillRect(0,0,size,260);
    ctx.font="14px sans-serif"; ctx.textAlign="center"; ctx.fillStyle="#444";
    ctx.fillText(`Euclid's game — subtract k × smaller from larger; reduce a pile to 0 to WIN`, size/2, 22);
    const lo = Math.min(a, b), hi = Math.max(a, b);
    const ratio = lo > 0 ? hi/lo : 0;
    ctx.font="11px monospace"; ctx.fillStyle = ratio >= PHI ? "#484" : "#a44";
    ctx.fillText(`ratio: ${ratio.toFixed(3)}   φ≈1.618   ${ratio >= PHI ? "N-position (winning move exists)" : "P-position (no winning move)"}`, size/2, 42);

    for (let i=0; i<2; i++){
      const r = pileRect(i); const val = i === 0 ? a : b;
      ctx.fillStyle = "#bcd"; ctx.fillRect(r.x, r.y, r.w, r.h);
      ctx.strokeStyle="#345"; ctx.lineWidth=1; ctx.strokeRect(r.x, r.y, r.w, r.h);
      ctx.fillStyle="#222"; ctx.font="bold 30px sans-serif"; ctx.textAlign="center"; ctx.textBaseline="middle";
      ctx.fillText(`${val}`, r.x + r.w/2, r.y + r.h/2);
      ctx.font="11px sans-serif";
      ctx.fillText(i === 0 ? "pile A" : "pile B", r.x + r.w/2, r.y + r.h + 12);
      ctx.textBaseline="alphabetic";
    }

    const ks = legalKs();
    const maxBtns = Math.min(ks.length, 10);
    for (let i=0; i<maxBtns; i++){
      const r = kBtnRect(i, ks.length);
      ctx.fillStyle="#eef0e8"; ctx.fillRect(r.x, r.y, r.w, r.h);
      ctx.strokeStyle="#888"; ctx.lineWidth=1; ctx.strokeRect(r.x, r.y, r.w, r.h);
      ctx.fillStyle="#222"; ctx.font="12px sans-serif"; ctx.textBaseline="middle"; ctx.textAlign="center";
      ctx.fillText(`k=${ks[i]}`, r.x + r.w/2, r.y + r.h/2);
    }
    ctx.textBaseline="alphabetic";

    if (winner) statusEl.textContent = winner === "you" ? "you win!" : "AI wins";
    else statusEl.textContent = turn === "you" ? "your turn — click a k button" : "AI thinking…";
  }

  function clickPos(e){ const r=canvas.getBoundingClientRect(); return {x:(e.clientX-r.left)*(size/r.width), y:(e.clientY-r.top)*(260/r.height)}; }
  function findKBtn(x, y){
    const ks = legalKs();
    const maxBtns = Math.min(ks.length, 10);
    for (let i=0; i<maxBtns; i++){
      const r = kBtnRect(i, ks.length);
      if (x>=r.x&&x<=r.x+r.w&&y>=r.y&&y<=r.y+r.h) return ks[i];
    }
    return -1;
  }

  function onClick(e){
    if (winner || turn !== "you") return;
    const {x, y} = clickPos(e); const k = findKBtn(x, y);
    if (k < 0) return;
    if (commit(k)) return;
    turn = "ai"; draw(); setTimeout(aiMove, 500);
  }

  canvas.addEventListener("click", onClick); draw();
  return {
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0,0,size,260); },
    restart(){ newGame(); draw(); },
    solve(){
      if (winner || turn !== "you") return;
      const k = winningK();
      if (k === null){ statusEl.textContent = "no winning move (P-position)"; return; }
      if (commit(k)) return;
      turn = "ai"; draw(); setTimeout(aiMove, 500);
    },
  };
}
