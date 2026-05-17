// Dawson's Chess — equivalent to the impartial game "place an X on a row of N
// cells; both adjacent cells (if any) become blocked too." Last to move wins.
// (This is Dawson's Move / octal-game representation.) Solved via Grundy
// values: each remaining contiguous run is an independent heap; XOR of Grundys
// gives nim-value.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 520);
  canvas.width = size;
  canvas.height = 180;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) {
    const w = canvas.width, h = canvas.height;
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    canvas.width = w * dpr; canvas.height = h * dpr; ctx.scale(dpr, dpr);
  }
  const statusEl = document.getElementById("playable-status");

  const N = 13;
  let cells, turn, winner, sel;
  function newGame(){ cells = Array(N).fill("."); turn="you"; winner=null; sel=-1; }
  newGame();

  // Grundy values for runs of size n (Dawson's chess sequence, OEIS A002187).
  // First 25 values; periodic with period 34 (from n=14 onward) but small N=13
  // doesn't need the period.
  const G = [
    0, 1, 1, 2, 0, 3, 1, 1, 0, 3, 3, 2, 2, 4, 0,
    5, 2, 2, 3, 3, 0, 1, 1, 3, 0, 2,
  ];

  function runs(c){
    // Return the lengths of maximal contiguous runs of "." (empty) cells.
    // A play in a run of length L places X at position i (0..L-1) and blocks
    // i and adjacent cells inside the run — but here we model it as runs only
    // and use the Dawson Grundy values.
    const out = [];
    let n = 0;
    for (let i=0; i<c.length; i++){
      if (c[i] === ".") n++;
      else { if (n) out.push(n); n = 0; }
    }
    if (n) out.push(n);
    return out;
  }

  function grundy(c){
    let x = 0;
    for (const r of runs(c)){
      x ^= (r < G.length ? G[r] : 0);
    }
    return x;
  }

  function legalMoves(c){
    const out = [];
    for (let i=0; i<c.length; i++){
      if (c[i] !== ".") continue;
      // The play marks i, i-1, i+1 (if within bounds AND currently ".").
      // But i-1 / i+1 marking is required only if they are currently empty
      // and within the same run (i.e., themselves "."). We mark them with "X"
      // (claimed by player); blocks split the row.
      out.push(i);
    }
    return out;
  }

  function applyMove(c, i){
    const nc = c.slice();
    nc[i] = "X";
    if (i > 0 && nc[i-1] === ".") nc[i-1] = "x";
    if (i < c.length - 1 && nc[i+1] === ".") nc[i+1] = "x";
    return nc;
  }

  function over(c){ return !c.includes("."); }

  function bestMove(c){
    const moves = legalMoves(c);
    for (const i of moves){
      if (grundy(applyMove(c, i)) === 0) return i;
    }
    return moves[0] ?? -1;
  }

  function aiMove(){
    if (winner) return;
    const i = bestMove(cells);
    if (i < 0){ winner = "you"; draw(); return; }
    cells = applyMove(cells, i);
    if (over(cells)){ winner = "ai"; draw(); return; }
    turn = "you"; draw();
  }

  function cellRect(i){
    const margin = 30, gap = 4;
    const cw = (size - 2*margin - (N-1)*gap) / N;
    return { x: margin + i*(cw + gap), y: 70, w: cw, h: 60 };
  }

  function draw(){
    ctx.fillStyle="#fafaf7"; ctx.fillRect(0,0,size,180);
    ctx.font="13px sans-serif"; ctx.textAlign="center"; ctx.fillStyle="#444";
    ctx.fillText(`Dawson's Chess — placing X also blocks its neighbours`, size/2, 22);
    ctx.fillText(`runs: [${runs(cells).join(", ")}]  Grundy XOR = ${grundy(cells)}`, size/2, 42);

    for (let i=0; i<N; i++){
      const r = cellRect(i);
      ctx.fillStyle = "#fff"; ctx.fillRect(r.x, r.y, r.w, r.h);
      ctx.strokeStyle = sel === i ? "#06c" : "#888";
      ctx.lineWidth = sel === i ? 3 : 1;
      ctx.strokeRect(r.x, r.y, r.w, r.h);
      if (cells[i] === "X"){
        ctx.fillStyle = "#333"; ctx.font = "bold 18px sans-serif"; ctx.textAlign="center"; ctx.textBaseline="middle";
        ctx.fillText("X", r.x + r.w/2, r.y + r.h/2);
      } else if (cells[i] === "x"){
        ctx.fillStyle = "#bbb";
        ctx.fillRect(r.x + 4, r.y + 4, r.w - 8, r.h - 8);
      }
      ctx.textBaseline="alphabetic";
    }

    if (winner) statusEl.textContent = winner === "you" ? "you win — no empty cells!" : "AI wins — no empty cells!";
    else statusEl.textContent = turn === "you" ? "click any empty cell to place an X" : "AI thinking…";
  }

  function clickPos(e){ const r=canvas.getBoundingClientRect(); return {x:(e.clientX-r.left)*(size/r.width), y:(e.clientY-r.top)*(180/r.height)}; }
  function findCell(x, y){ for (let i=0;i<N;i++){ const c=cellRect(i); if (x>=c.x&&x<=c.x+c.w&&y>=c.y&&y<=c.y+c.h) return i; } return -1; }

  function onClick(e){
    if (winner || turn !== "you") return;
    const {x,y} = clickPos(e); const i = findCell(x, y);
    if (i < 0 || cells[i] !== ".") return;
    cells = applyMove(cells, i); sel = -1;
    if (over(cells)){ winner = "you"; draw(); return; }
    turn = "ai"; draw(); setTimeout(aiMove, 400);
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0,0,size,180); },
    restart(){ newGame(); draw(); },
    solve(){
      if (winner || turn !== "you") return;
      const i = bestMove(cells);
      if (i < 0) return;
      cells = applyMove(cells, i); sel = -1;
      if (over(cells)){ winner = "you"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 400);
    },
  };
}
