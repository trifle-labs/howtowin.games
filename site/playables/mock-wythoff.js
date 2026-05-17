// Mock Wythoff — variant of Wythoff's game. Two piles. Moves:
//   1) remove any positive number from a single pile (Nim move);
//   2) diagonal: remove (k, k+1) from the two piles (any positive k).
// Last token wins (normal play). AI: memoised perfect play by P-position search.

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = 200;
  const W = canvas.width, H = canvas.height;
  const statusEl = document.getElementById("playable-status");

  let a, b, turn, winner;
  function newGame(){ a = 5 + Math.floor(Math.random() * 6); b = 7 + Math.floor(Math.random() * 6); turn = "you"; winner = null; }
  newGame();

  // Compute P-positions up to limit.
  const LIMIT = 50;
  const memo = new Map();
  function isP(x, y){
    if (x > y){ const t = x; x = y; y = t; }
    const key = `${x},${y}`;
    if (memo.has(key)) return memo.get(key);
    if (x === 0 && y === 0){ memo.set(key, true); return true; }
    // try every move; if any leads to P-position, this is N
    for (let r = 1; r <= x; r++) if (isP(x - r, y)){ memo.set(key, false); return false; }
    for (let r = 1; r <= y; r++) if (isP(x, y - r)){ memo.set(key, false); return false; }
    for (let k = 1; k <= Math.min(x, y - 1); k++) if (isP(x - k, y - (k + 1))){ memo.set(key, false); return false; }
    memo.set(key, true); return true;
  }
  // pre-warm
  for (let i = 0; i <= LIMIT; i++) for (let j = i; j <= LIMIT; j++) isP(i, j);

  function aiPick(){
    // find a move leading to P-position
    for (let r = 1; r <= a; r++) if (isP(a - r, b)) return { type: 'A', amt: r };
    for (let r = 1; r <= b; r++) if (isP(a, b - r)) return { type: 'B', amt: r };
    for (let k = 1; k <= Math.min(a, b - 1); k++) if (isP(a - k, b - (k + 1))) return { type: 'D', amt: k };
    // no winning move; pick any
    if (a > 0) return { type: 'A', amt: 1 };
    if (b > 0) return { type: 'B', amt: 1 };
    return null;
  }

  function apply(side, m){
    if (m.type === 'A') a -= m.amt;
    else if (m.type === 'B') b -= m.amt;
    else { a -= m.amt; b -= (m.amt + 1); }
    if (a === 0 && b === 0){ winner = side; return true; }
    return false;
  }

  function aiMove(){
    if (winner) return;
    const m = aiPick(); if (!m){ winner = "you"; draw(); return; }
    if (apply("ai", m)){ draw(); return; }
    turn = "you"; draw();
  }

  // input controls
  let inputMode = 'A'; // A, B, D
  let inputN = 1;

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "13px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";
    ctx.font = "16px sans-serif";
    ctx.fillText(`Pile A: ${a}     Pile B: ${b}`, W/2, 48);

    // mode buttons
    const btns = [
      { x: 20, y: 70, w: 100, h: 30, label: `Take ${inputN} from A`, mode: 'A' },
      { x: 140, y: 70, w: 100, h: 30, label: `Take ${inputN} from B`, mode: 'B' },
      { x: 260, y: 70, w: 100, h: 30, label: `Diag k=${inputN}`, mode: 'D' },
    ];
    for (const b of btns){
      ctx.fillStyle = inputMode === b.mode ? "#cef2cf" : "#eee";
      ctx.fillRect(b.x, b.y, b.w, b.h);
      ctx.strokeStyle = "#888"; ctx.strokeRect(b.x, b.y, b.w, b.h);
      ctx.font = "12px sans-serif"; ctx.fillStyle = "#222"; ctx.textAlign = "center";
      ctx.fillText(b.label, b.x + b.w/2, b.y + 20);
    }
    // amount controls
    ctx.fillStyle = "#eee"; ctx.fillRect(20, 110, 30, 30); ctx.strokeStyle = "#888"; ctx.strokeRect(20, 110, 30, 30);
    ctx.fillStyle = "#222"; ctx.fillText("-", 35, 130);
    ctx.fillStyle = "#eee"; ctx.fillRect(60, 110, 30, 30); ctx.strokeStyle = "#888"; ctx.strokeRect(60, 110, 30, 30);
    ctx.fillStyle = "#222"; ctx.fillText("+", 75, 130);
    ctx.fillText(`n = ${inputN}`, 130, 130);

    // GO
    ctx.fillStyle = "#bcd9f0"; ctx.fillRect(260, 110, 100, 30); ctx.strokeStyle = "#888"; ctx.strokeRect(260, 110, 100, 30);
    ctx.fillStyle = "#222"; ctx.fillText("GO", 310, 130);

    if (winner) statusEl.textContent = winner === "you" ? "you take the last token — you win!" : "AI takes the last token";
    else statusEl.textContent = turn === "you" ? `set move, then click GO (state is ${isP(a, b) ? 'P (losing)' : 'N (winning)'})` : "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }

  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e);
    if (y >= 70 && y <= 100){
      if (x >= 20 && x <= 120) inputMode = 'A';
      else if (x >= 140 && x <= 240) inputMode = 'B';
      else if (x >= 260 && x <= 360) inputMode = 'D';
      draw(); return;
    }
    if (y >= 110 && y <= 140){
      if (x >= 20 && x <= 50){ inputN = Math.max(1, inputN - 1); draw(); return; }
      if (x >= 60 && x <= 90){ inputN++; draw(); return; }
      if (x >= 260 && x <= 360){
        // validate and play
        if (inputMode === 'A' && inputN > a) return;
        if (inputMode === 'B' && inputN > b) return;
        if (inputMode === 'D' && (inputN > a || inputN + 1 > b)) return;
        if (apply("you", { type: inputMode, amt: inputN })){ draw(); return; }
        inputN = 1;
        turn = "ai"; draw(); setTimeout(aiMove, 500);
      }
    }
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve(){
      if (winner || turn !== "you") return;
      // enumerate all legal moves and pick one at random
      const opts = [];
      for (let r = 1; r <= a; r++) opts.push({ type: 'A', amt: r });
      for (let r = 1; r <= b; r++) opts.push({ type: 'B', amt: r });
      for (let k = 1; k <= Math.min(a, b - 1); k++) opts.push({ type: 'D', amt: k });
      if (!opts.length){ winner = "ai"; draw(); return; }
      const mv = opts[Math.floor(Math.random() * opts.length)];
      if (apply("you", mv)){ draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 80);
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); inputMode = 'A'; inputN = 1; draw(); },
  };
}
