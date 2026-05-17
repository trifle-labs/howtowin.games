// Mogul (a turning-coins game) — a row of coins, each heads or tails. On your
// turn you flip exactly 2 coins, with the constraint that the rightmost flipped
// coin must go from heads to tails. Last to move wins (normal play).
//
// By the Mock-Turtles theorem, the nim-value of a position is the XOR of
// nim-values of single heads-coins. For the flip-2 game ("Twins"), the
// nim-value of a single heads-coin at position n is n. So AI plays Nim on the
// positions-of-heads multiset, treating each heads as a Nim heap of size n.

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = 200;
  const W = canvas.width, H = canvas.height;
  const statusEl = document.getElementById("playable-status");

  const N = 9;
  let coins, turn, winner, selected;
  function newGame(){
    coins = Array.from({length: N}, () => Math.random() < 0.5 ? 'H' : 'T');
    if (!coins.includes('H')) coins[Math.floor(Math.random() * N)] = 'H';
    turn = "you"; winner = null; selected = -1;
  }
  newGame();

  function nimSum(){
    let s = 0;
    for (let i = 0; i < N; i++) if (coins[i] === 'H') s ^= (i + 1);
    return s;
  }

  function aiPick(){
    // find a legal flip-2 that zeros the nim-sum
    // Legal: positions i<j, rightmost is j, coins[j] must be H (will go to T).
    // After flip: nim-sum XOR ((j+1) XOR (i+1 if coins[i]=='T'→H so XOR i+1 added) → actually XOR coins[i] and coins[j]).
    // Simpler: simulate.
    for (let j = 0; j < N; j++) if (coins[j] === 'H')
      for (let i = 0; i < j; i++){
        const before = nimSum();
        // flipping changes nim-value of positions i and j
        const newSum = before ^ (i + 1) ^ (j + 1);
        if (newSum === 0) return [i, j];
      }
    // no winning move; pick any legal
    for (let j = 0; j < N; j++) if (coins[j] === 'H')
      for (let i = 0; i < j; i++) return [i, j];
    return null;
  }

  function flip(i, j){
    coins[i] = coins[i] === 'H' ? 'T' : 'H';
    coins[j] = coins[j] === 'H' ? 'T' : 'H';
  }

  function noMoves(){
    for (let j = 0; j < N; j++) if (coins[j] === 'H') return false;
    return true;
  }

  function aiMove(){
    if (winner) return;
    const m = aiPick(); if (!m){ winner = "you"; draw(); return; }
    flip(m[0], m[1]);
    if (noMoves()){ winner = "ai"; draw(); return; }
    turn = "you"; selected = -1; draw();
  }

  function coinRect(i){
    const margin = 30, cw = (size - 2*margin) / N;
    return { x: margin + i * cw, y: 80, w: cw - 4, h: cw - 4, cx: margin + i*cw + cw/2, cy: 80 + cw/2 - 2 };
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "13px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";
    ctx.font = "11px sans-serif"; ctx.fillStyle = "#888";
    ctx.fillText(`nim-sum = ${nimSum()}`, W/2, 40);

    for (let i = 0; i < N; i++){
      const r = coinRect(i);
      ctx.beginPath(); ctx.arc(r.cx, r.cy, r.w/2 - 2, 0, Math.PI*2);
      ctx.fillStyle = i === selected ? "#cef2cf" : coins[i] === 'H' ? "#f4cfb4" : "#bcd9f0";
      ctx.fill(); ctx.strokeStyle = "#888"; ctx.stroke();
      ctx.fillStyle = "#222"; ctx.font = "14px sans-serif";
      ctx.fillText(coins[i], r.cx, r.cy + 5);
      ctx.font = "10px sans-serif"; ctx.fillStyle = "#666";
      ctx.fillText(`${i+1}`, r.cx, r.cy + 24);
    }

    if (winner) statusEl.textContent = winner === "you" ? "you flipped the last H — you win!" : "AI took the last move";
    else statusEl.textContent = turn === "you" ?
      (selected < 0 ? "click first coin to flip" : "click second coin (rightmost must be H)") : "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }
  function findCoin(x, y){
    for (let i = 0; i < N; i++){
      const r = coinRect(i);
      if (Math.hypot(x - r.cx, y - r.cy) < r.w/2) return i;
    }
    return -1;
  }

  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e); const i = findCoin(x, y); if (i < 0) return;
    if (selected < 0){ selected = i; draw(); return; }
    if (i === selected){ selected = -1; draw(); return; }
    const left = Math.min(selected, i), right = Math.max(selected, i);
    // rightmost must be H (going H→T)
    if (coins[right] !== 'H'){ selected = -1; draw(); return; }
    flip(left, right); selected = -1;
    if (noMoves()){ winner = "you"; draw(); return; }
    turn = "ai"; draw(); setTimeout(aiMove, 500);
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve(){
      if (winner || turn !== "you") return;
      // enumerate all legal flip-2 pairs: i < j, coins[j] === 'H'
      const opts = [];
      for (let j = 0; j < N; j++) if (coins[j] === 'H')
        for (let i = 0; i < j; i++) opts.push([i, j]);
      if (!opts.length){ winner = "ai"; draw(); return; }
      const [i, j] = opts[Math.floor(Math.random() * opts.length)];
      flip(i, j); selected = -1;
      if (noMoves()){ winner = "you"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 80);
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
