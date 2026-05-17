// Mock Turtles — row of N coins. Flip up to 3 coins; rightmost picked must go
// H→T. All-tails terminates; last to move wins. Mock-turtle nim-value of a
// single heads at position n (0-indexed from left) is the "odious number near 2n":
//   M(n) = 2n if popcount(2n) is odd, else 2n+1.
// Position nim-sum = XOR of M(i) over heads coins; aim to leave 0.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 520);
  canvas.width = size;
  canvas.height = 200;
  const statusEl = document.getElementById("playable-status");

  const N = 7;
  let coins, turn, winner, sel;

  function popcount(x){ let c=0; while(x){ c += x & 1; x >>>= 1; } return c; }
  function M(n){ const a = 2*n; return (popcount(a) & 1) ? a : a + 1; }

  function newGame(){
    do { coins = Array.from({length: N}, () => Math.random() < 0.5 ? "H" : "T"); }
    while (coins.filter(c=>c==="H").length < 2);
    turn="you"; winner=null; sel=[];
  }
  newGame();

  function legalMoves(c){
    const out = [];
    for (let r=0; r<N; r++){
      if (c[r] !== "H") continue;
      out.push([r]);
      for (let a=0; a<r; a++){
        out.push([a, r]);
        for (let b=a+1; b<r; b++) out.push([a, b, r]);
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
    for (let i=0; i<c.length; i++) if (c[i]==="H") x ^= M(i);
    return x;
  }

  function bestMove(c){
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
    return { cx: margin + i*(cw+gap) + cw/2, cy: 80, r: cw*0.42 };
  }

  function draw(){
    ctx.fillStyle="#fafaf7"; ctx.fillRect(0,0,size,200);
    ctx.font="13px sans-serif"; ctx.textAlign="center"; ctx.fillStyle="#444";
    ctx.fillText(`Mock Turtles — flip 1–3 coins; rightmost picked must be heads`, size/2, 22);
    ctx.fillText(`mock-turtle nim-sum = ${nimSum(coins)}  (0 means losing)`, size/2, 42);

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
      ctx.fillText(`M=${M(i)}`, c.cx, c.cy + c.r + 16);
    }

    if (winner) statusEl.textContent = winner === "you" ? "you win — all tails!" : "AI wins — all tails!";
    else if (sel.length === 0) statusEl.textContent = turn === "you" ? "click 1–3 coins (rightmost must be H); double-click to commit" : "AI thinking…";
    else statusEl.textContent = `selected: ${sel.map(i=>i+1).join(", ")} — double-click any coin to flip`;
  }

  function clickPos(e){ const r=canvas.getBoundingClientRect(); return {x:(e.clientX-r.left)*(size/r.width), y:(e.clientY-r.top)*(200/r.height)}; }
  function findCoin(x, y){
    for (let i=0;i<N;i++){ const c=coinRect(i); if ((x-c.cx)**2+(y-c.cy)**2 <= c.r*c.r) return i; }
    return -1;
  }

  function commitMove(){
    if (!sel.length) return;
    const m = sel.slice().sort((a,b)=>a-b);
    if (coins[m[m.length-1]] !== "H"){ sel = []; draw(); return; }
    coins = applyMove(coins, m); sel = [];
    if (isOver(coins)){ winner = "you"; draw(); return; }
    turn = "ai"; draw(); setTimeout(aiMove, 500);
  }

  function onClick(e){
    if (winner || turn !== "you") return;
    const {x,y} = clickPos(e); const i = findCoin(x, y);
    if (i < 0) return;
    if (sel.includes(i)){ sel = sel.filter(j=>j!==i); draw(); return; }
    if (sel.length >= 3){ sel = [i]; draw(); return; }
    sel.push(i); draw();
  }
  function onDblClick(){ commitMove(); }

  canvas.addEventListener("click", onClick);
  canvas.addEventListener("dblclick", onDblClick);
  draw();
  return {
    destroy(){
      canvas.removeEventListener("click", onClick);
      canvas.removeEventListener("dblclick", onDblClick);
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
