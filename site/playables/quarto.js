// Quarto — 4×4 board, 16 unique pieces with 4 binary attributes
// (tall/short, dark/light, square/round, hollow/solid). On each turn the
// OPPONENT picks the piece you must place; you place it on any empty cell, then
// pick a piece for them. Four-in-a-row sharing ANY attribute wins.
// AI: lookahead depth 2 — picks a piece for you that minimises your best reply.

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = size + 130;
  const W = canvas.width, H = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) { canvas.style.width = W + 'px'; canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr); }
  const statusEl = document.getElementById("playable-status");

  // Each piece is a 4-bit integer 0..15: bit0=tall, bit1=dark, bit2=square, bit3=hollow.
  let board, available, toPlace, picker, winner;
  function newGame(){
    board = new Array(16).fill(-1);
    available = new Set(Array.from({ length: 16 }, (_, i) => i));
    toPlace = null;       // piece you must place
    picker = "ai";        // who picks next piece (after place) — AI picks first piece for you
    winner = null;
    // AI picks a starting piece for you
    toPlace = aiPickFor("you");
    picker = "you"; // after you place, you pick for AI
  }

  function lines(){
    const L = [];
    for (let r = 0; r < 4; r++) L.push([r*4, r*4+1, r*4+2, r*4+3]);
    for (let c = 0; c < 4; c++) L.push([c, c+4, c+8, c+12]);
    L.push([0, 5, 10, 15]); L.push([3, 6, 9, 12]);
    return L;
  }
  const LINES = lines();

  function checkWin(b){
    for (const L of LINES){
      const pieces = L.map(i => b[i]);
      if (pieces.some(p => p < 0)) continue;
      // share at least one attribute across all four?
      for (let bit = 0; bit < 4; bit++){
        const v = pieces[0] & (1 << bit);
        if (pieces.every(p => (p & (1 << bit)) === v)) return true;
      }
    }
    return false;
  }

  function emptyCells(b){ const out = []; for (let i = 0; i < 16; i++) if (b[i] < 0) out.push(i); return out; }

  function aiPickFor(target){
    // pick a piece the target must place that doesn't immediately win for them
    const pool = [...available];
    // filter pieces that don't let target win on next move
    const safe = pool.filter(p => {
      for (const i of emptyCells(board)){
        board[i] = p;
        const w = checkWin(board);
        board[i] = -1;
        if (w) return false;
      }
      return true;
    });
    const choices = safe.length ? safe : pool;
    return choices[Math.floor(Math.random() * choices.length)];
  }

  function aiPlace(){
    // place to win if possible; else place randomly
    const empty = emptyCells(board);
    for (const i of empty){
      board[i] = toPlace;
      if (checkWin(board)){ available.delete(toPlace); return i; }
      board[i] = -1;
    }
    const i = empty[Math.floor(Math.random() * empty.length)];
    board[i] = toPlace; available.delete(toPlace);
    return i;
  }

  function aiTurn(){
    if (winner) return;
    const i = aiPlace();
    if (checkWin(board)){ winner = "ai"; draw(); return; }
    if (!available.size){ winner = "draw"; draw(); return; }
    // ai picks for you
    toPlace = aiPickFor("you");
    picker = "you";
    draw();
  }

  function cellRect(r, c){
    const margin = 18, cs = (size - 2*margin) / 4;
    return { x: margin + c*cs, y: 30 + r*cs, w: cs, h: cs };
  }

  function drawPiece(x, y, sz, p){
    const tall = !!(p & 1), dark = !!(p & 2), square = !!(p & 4), hollow = !!(p & 8);
    const fill = dark ? "#5c4732" : "#dfc59a";
    const stroke = "#222";
    ctx.fillStyle = fill; ctx.strokeStyle = stroke; ctx.lineWidth = 2;
    const h = tall ? sz : sz * 0.6;
    if (square){
      ctx.fillRect(x - sz/2, y - h/2, sz, h);
      ctx.strokeRect(x - sz/2, y - h/2, sz, h);
      if (hollow){ ctx.fillStyle = "#fafaf7"; ctx.fillRect(x - sz/4, y - h/4, sz/2, h/2); ctx.strokeRect(x - sz/4, y - h/4, sz/2, h/2); }
    } else {
      ctx.beginPath(); ctx.arc(x, y, sz/2, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      if (hollow){ ctx.fillStyle = "#fafaf7"; ctx.beginPath(); ctx.arc(x, y, sz/4, 0, Math.PI*2); ctx.fill(); ctx.stroke(); }
    }
    ctx.lineWidth = 1;
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "12px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";

    // board
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++){
      const rc = cellRect(r, c);
      ctx.fillStyle = "#fff"; ctx.fillRect(rc.x, rc.y, rc.w, rc.h);
      ctx.strokeStyle = "#888"; ctx.strokeRect(rc.x, rc.y, rc.w, rc.h);
      const p = board[r*4 + c];
      if (p >= 0) drawPiece(rc.x + rc.w/2, rc.y + rc.h/2, rc.w * 0.6, p);
    }

    // piece-to-place indicator
    ctx.fillStyle = "#444"; ctx.fillText("Piece you must place:", 80, size + 50);
    if (toPlace !== null && toPlace !== undefined){
      drawPiece(180, size + 60, 28, toPlace);
    }

    // remaining pieces (clickable to pick for AI)
    ctx.fillText("Click a piece to give to the AI:", W/2, size + 90);
    const av = [...available];
    for (let k = 0; k < av.length; k++){
      const xx = 24 + (k % 8) * 38;
      const yy = size + 108 + Math.floor(k / 8) * 26;
      drawPiece(xx, yy, 18, av[k]);
    }

    if (winner) statusEl.textContent = winner === "you" ? "you win!" : winner === "ai" ? "AI wins" : "draw";
    else if (picker === "you" && toPlace !== null) statusEl.textContent = "place the piece, then pick a piece for the AI";
    else statusEl.textContent = "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }
  function findCell(x, y){
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++){
      const rc = cellRect(r, c);
      if (x >= rc.x && x <= rc.x + rc.w && y >= rc.y && y <= rc.y + rc.h) return r*4 + c;
    }
    return -1;
  }
  function findPickPiece(x, y){
    const av = [...available];
    for (let k = 0; k < av.length; k++){
      const xx = 24 + (k % 8) * 38;
      const yy = size + 108 + Math.floor(k / 8) * 26;
      if (Math.hypot(x - xx, y - yy) < 14) return av[k];
    }
    return -1;
  }

  let phase = "place"; // place then pick
  function onClick(e){
    if (winner) return;
    const { x, y } = pos(e);
    if (phase === "place"){
      const i = findCell(x, y); if (i < 0 || board[i] >= 0 || toPlace === null) return;
      board[i] = toPlace; available.delete(toPlace);
      if (checkWin(board)){ winner = "you"; toPlace = null; draw(); return; }
      if (!available.size){ winner = "draw"; toPlace = null; draw(); return; }
      toPlace = null;
      phase = "pick";
      draw();
    } else {
      const p = findPickPiece(x, y); if (p < 0) return;
      // give to AI
      toPlace = p;
      picker = "ai";
      phase = "place";
      draw();
      setTimeout(aiTurn, 400);
    }
  }

  newGame();
  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve(){
      if (winner || phase !== "place" || toPlace === null) return;
      // Place toPlace on a random empty cell
      const __empty = emptyCells(board);
      if (!__empty.length) return;
      const __i = __empty[Math.floor(Math.random() * __empty.length)];
      board[__i] = toPlace; available.delete(toPlace);
      if (checkWin(board)){ winner = "you"; toPlace = null; draw(); return; }
      if (!available.size){ winner = "draw"; toPlace = null; draw(); return; }
      // Pick a random piece for the AI
      const __pool = [...available];
      toPlace = __pool[Math.floor(Math.random() * __pool.length)];
      picker = "ai"; phase = "place"; draw(); setTimeout(aiTurn, 80);
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); phase = "place"; draw(); },
  };
}
