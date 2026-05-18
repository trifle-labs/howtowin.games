// Halatafl — Scandinavian fox-and-geese on a cross-shaped board. Variant of
// fox-and-geese with mandatory captures for the fox. Geese (you) push the fox
// to the bottom; fox (AI) captures geese by jumping. Geese win if fox cannot
// move; fox wins if fewer than 4 geese remain.

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = size + 30;
  const W = canvas.width, H = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) { canvas.style.width = W + 'px'; canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr); }
  const statusEl = document.getElementById("playable-status");

  const CELLS = [];
  const isCell = (r, c) => {
    if (r < 0 || r > 6 || c < 0 || c > 6) return false;
    const inCorner = (r < 2 || r > 4) && (c < 2 || c > 4);
    return !inCorner;
  };
  for (let r = 0; r < 7; r++) for (let c = 0; c < 7; c++) if (isCell(r, c)) CELLS.push([r, c]);
  const idxOf = new Map(CELLS.map(([r, c], i) => [`${r},${c}`, i]));

  let board, turn, winner, sel;
  function newGame(){
    board = new Array(CELLS.length).fill('.');
    for (let i = 0; i < CELLS.length; i++){ const [r, c] = CELLS[i]; if (r <= 2) board[i] = 'g'; }
    board[idxOf.get('5,3')] = 'f';
    turn = "you"; winner = null; sel = -1;
  }
  newGame();

  function neighbours(i){
    const [r, c] = CELLS[i];
    const out = [];
    for (const [dr, dc] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]){
      const k = idxOf.get(`${r+dr},${c+dc}`);
      if (k !== undefined) out.push({ idx: k, dr, dc });
    }
    return out;
  }

  function gooseMoves(){
    const out = [];
    for (let i = 0; i < CELLS.length; i++) if (board[i] === 'g'){
      for (const n of neighbours(i)){
        if (board[n.idx] !== '.') continue;
        if (Math.abs(n.dr) + Math.abs(n.dc) !== 1) continue; // orthogonal only
        if (n.dr < 0) continue;
        out.push([i, n.idx]);
      }
    }
    return out;
  }

  function foxMoves(fromIdx){
    const out = [];
    for (const n of neighbours(fromIdx)){
      if (Math.abs(n.dr) + Math.abs(n.dc) !== 1) continue;
      if (board[n.idx] === '.') out.push({ to: n.idx, capture: null });
      else if (board[n.idx] === 'g'){
        const [r, c] = CELLS[fromIdx];
        const landing = idxOf.get(`${r + n.dr*2},${c + n.dc*2}`);
        if (landing !== undefined && board[landing] === '.') out.push({ to: landing, capture: n.idx });
      }
    }
    return out;
  }

  function findFox(){ for (let i = 0; i < board.length; i++) if (board[i] === 'f') return i; return -1; }

  function aiMove(){
    if (winner) return;
    const fi = findFox(); if (fi < 0){ winner = "you"; draw(); return; }
    const moves = foxMoves(fi);
    if (!moves.length){ winner = "you"; draw(); return; }
    const caps = moves.filter(m => m.capture !== null);
    const m = caps.length ? caps[Math.floor(Math.random() * caps.length)] : moves[Math.floor(Math.random() * moves.length)];
    board[fi] = '.'; board[m.to] = 'f'; if (m.capture !== null) board[m.capture] = '.';
    const geeseLeft = board.filter(v => v === 'g').length;
    if (geeseLeft < 4){ winner = "ai"; draw(); return; }
    turn = "you"; draw();
  }

  function cellRect(i){
    const margin = 20, cs = (size - 2*margin) / 7;
    const [r, c] = CELLS[i];
    return { x: margin + c*cs, y: 20 + r*cs, w: cs, h: cs };
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "13px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";

    for (let i = 0; i < CELLS.length; i++){
      const rc = cellRect(i);
      ctx.fillStyle = "#fff"; ctx.fillRect(rc.x, rc.y, rc.w, rc.h);
      ctx.strokeStyle = i === sel ? "#0a0" : "#888"; ctx.lineWidth = i === sel ? 3 : 1;
      ctx.strokeRect(rc.x, rc.y, rc.w, rc.h); ctx.lineWidth = 1;
      const v = board[i]; if (v === '.') continue;
      ctx.beginPath(); ctx.arc(rc.x + rc.w/2, rc.y + rc.h/2, rc.w * 0.32, 0, Math.PI*2);
      ctx.fillStyle = v === 'f' ? "#e60" : "#fff"; ctx.fill();
      ctx.strokeStyle = "#222"; ctx.stroke();
      if (v === 'g'){ ctx.fillStyle = "#222"; ctx.font = "12px sans-serif"; ctx.textBaseline = "middle"; ctx.fillText("G", rc.x + rc.w/2, rc.y + rc.h/2); ctx.textBaseline = "alphabetic"; ctx.font = "13px sans-serif"; }
    }

    if (winner) statusEl.textContent = winner === "you" ? "fox cornered — you win!" : "fox ate enough geese — AI wins";
    else statusEl.textContent = turn === "you" ? (sel < 0 ? "click a goose to move down/sideways" : "click an empty adjacent cell") : "Fox thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }
  function findCellAt(x, y){
    for (let i = 0; i < CELLS.length; i++){ const rc = cellRect(i); if (x >= rc.x && x <= rc.x + rc.w && y >= rc.y && y <= rc.y + rc.h) return i; }
    return -1;
  }

  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e); const i = findCellAt(x, y); if (i < 0) return;
    if (sel < 0){ if (board[i] === 'g'){ sel = i; draw(); } return; }
    if (i === sel){ sel = -1; draw(); return; }
    if (board[i] !== '.'){ sel = -1; draw(); return; }
    const [r1, c1] = CELLS[sel], [r2, c2] = CELLS[i];
    if (Math.abs(r1 - r2) + Math.abs(c1 - c2) !== 1 || (r2 - r1) < 0){ sel = -1; draw(); return; }
    board[i] = 'g'; board[sel] = '.'; sel = -1;
    const fi = findFox();
    if (fi >= 0 && !foxMoves(fi).length){ winner = "you"; draw(); return; }
    turn = "ai"; draw(); setTimeout(aiMove, 400);
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve(){
      if (winner || turn !== "you") return;
      const __mvs = gooseMoves();
      if (!__mvs || !__mvs.length){ winner = "ai"; draw(); return; }
      const [from, to] = __mvs[Math.floor(Math.random() * __mvs.length)];
      board[to] = 'g'; board[from] = '.'; sel = -1;
      const fi = findFox();
      if (fi >= 0 && !foxMoves(fi).length){ winner = "you"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 80);
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
