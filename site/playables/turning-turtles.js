// Turning Turtles — row of N coins, each H or T. On your turn flip 1 or 2 coins
// (the rightmost must go H→T). All-tails terminates; last to move wins.
// Equivalent to Nim: a heads at position k (1-indexed) is a heap of size k.
// Optimal play: pick a flip that XORs the heads-positions sum to 0.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 520);
  canvas.width = size;
  canvas.height = 200;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) {
    const w = canvas.width, h = canvas.height;
    canvas.style.width = w + 'px';    canvas.width = w * dpr; canvas.height = h * dpr; ctx.scale(dpr, dpr);
  }
  const statusEl = document.getElementById("playable-status");

  const N = 7;
  let coins, turn, winner, sel;
  function newGame(){
    // Random start with at least 2 heads.
    do { coins = Array.from({length: N}, () => Math.random() < 0.5 ? "H" : "T"); }
    while (coins.filter(c=>c==="H").length < 2);
    turn="you"; winner=null; sel=[];
  }
  newGame();

  function legalMoves(c){
    // moves: flip 1 coin H→T, OR flip 2 coins where the rightmost goes H→T (the other any).
    const out = [];
    for (let r=0; r<N; r++){
      if (c[r] === "H"){
        out.push([r]); // single flip
        for (let l=0; l<r; l++){
          out.push([l, r]); // pair; rightmost (r) is H→T, left (l) toggles
        }
      }
    }
    return out;
  }

  function applyMove(c, m){
    const nc = c.slice();
    for (const i of m) nc[i] = nc[i] === "H" ? "T" : "H";
    return nc;
  }

  function isOver(c){ return c.every(x => x === "T"); }

  function nimSum(c){
    let x = 0;
    for (let i=0; i<c.length; i++) if (c[i]==="H") x ^= (i+1);
    return x;
  }

  function bestMove(c){
    // Want to land in nim-sum 0.
    const moves = legalMoves(c);
    for (const m of moves){
      if (nimSum(applyMove(c, m)) === 0) return m;
    }
    return moves[0] || null;
  }

  function aiMove(){
    if (winner) return;
    const m = bestMove(coins);
    if (!m){ winner = "you"; draw(); return; }
    coins = applyMove(coins, m);
    if (isOver(coins)){ winner = "ai"; draw(); return; }
    turn = "you"; draw();
  }

  function coinRect(i){
    const margin = 30, gap = 8;
    const cw = (size - 2*margin - (N-1)*gap) / N;
    return { x: margin + i*(cw + gap), y: 70, w: cw, h: cw, cx: margin + i*(cw+gap) + cw/2, cy: 70 + cw/2, r: cw*0.42 };
  }

  function draw(){
    ctx.fillStyle="#fafaf7"; ctx.fillRect(0,0,size,200);
    ctx.font="13px sans-serif"; ctx.textAlign="center"; ctx.fillStyle="#444";
    ctx.fillText(`Turning Turtles — flip 1 or 2; rightmost picked must be heads`, size/2, 22);
    ctx.fillText(`positions 1…${N} act as Nim heaps; XOR of heads = ${nimSum(coins)}`, size/2, 42);

    for (let i=0; i<N; i++){
      const c = coinRect(i);
      const selected = sel.includes(i);
      ctx.beginPath(); ctx.arc(c.cx, c.cy, c.r, 0, Math.PI*2);
      ctx.fillStyle = coins[i] === "H" ? "#dca100" : "#bbb";
      ctx.fill();
      ctx.strokeStyle = selected ? "#06c" : "#444"; ctx.lineWidth = selected ? 3 : 1;
      ctx.stroke();
      ctx.fillStyle = "#fff"; ctx.font = "bold 14px sans-serif"; ctx.textAlign="center"; ctx.textBaseline="middle";
      ctx.fillText(coins[i], c.cx, c.cy);
      ctx.textBaseline = "alphabetic";
      ctx.fillStyle = "#444"; ctx.font = "11px sans-serif";
      ctx.fillText(String(i+1), c.cx, c.cy + c.r + 14);
    }

    if (winner) statusEl.textContent = winner === "you" ? "you win — all tails!" : "AI wins — all tails!";
    else if (sel.length === 0) statusEl.textContent = turn === "you" ? "click 1 or 2 coins; rightmost must be H" : "AI thinking…";
    else if (sel.length === 1) statusEl.textContent = `coin ${sel[0]+1} selected — click another coin (rightmost must be H) or press flip`;
    else statusEl.textContent = `flipping coins ${sel.map(i=>i+1).join(", ")}; press flip again to confirm`;
  }

  function clickPos(e){ const r=canvas.getBoundingClientRect(); return {x:(e.clientX-r.left)*(size/r.width), y:(e.clientY-r.top)*(200/r.height)}; }
  function findCoin(x, y){
    for (let i=0;i<N;i++){ const c=coinRect(i); if ((x-c.cx)**2+(y-c.cy)**2 <= c.r*c.r) return i; }
    return -1;
  }

  function commitMove(){
    if (sel.length === 0) return;
    const m = sel.slice().sort((a,b)=>a-b);
    // validate: rightmost must be H
    if (coins[m[m.length-1]] !== "H"){ sel = []; draw(); return; }
    coins = applyMove(coins, m);
    sel = [];
    if (isOver(coins)){ winner = "you"; draw(); return; }
    turn = "ai"; draw(); setTimeout(aiMove, 500);
  }

  function onClick(e){
    if (winner || turn !== "you") return;
    const {x,y} = clickPos(e); const i = findCoin(x, y);
    if (i < 0) return;
    if (sel.includes(i)){ sel = sel.filter(j=>j!==i); draw(); return; }
    if (sel.length >= 2){ sel = [i]; draw(); return; }
    sel.push(i); draw();
  }
  function onDblClick(){ commitMove(); }
  function onKey(e){ if (e.key === "Enter" || e.key === " ") commitMove(); }

  canvas.addEventListener("click", onClick);
  canvas.addEventListener("dblclick", onDblClick);
  window.addEventListener("keydown", onKey);
  draw();
  return {
    destroy(){
      canvas.removeEventListener("click", onClick);
      canvas.removeEventListener("dblclick", onDblClick);
      window.removeEventListener("keydown", onKey);
      ctx.clearRect(0,0,size,200);
    },
    restart(){ newGame(); draw(); },
    solve(){
      if (winner || turn !== "you") return;
      const m = bestMove(coins);
      if (!m) return;
      coins = applyMove(coins, m); sel = [];
      if (isOver(coins)){ winner = "you"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 500);
    },
  };
}
