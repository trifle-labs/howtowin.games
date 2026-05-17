// Northcott's Game — 3 rows, 6 cells each. Your white piece on the left, AI's
// black on the right of each row. Slide your piece left/right by any number of
// empty squares without jumping the opponent. Lose if you have no legal move.
// Optimal: gaps are Nim heaps; maintain XOR=0 (mirror retreats).

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 520);
  canvas.width = size;
  canvas.height = 220;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) {
    const w = canvas.width, h = canvas.height;
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    canvas.width = w * dpr; canvas.height = h * dpr; ctx.scale(dpr, dpr);
  }
  const statusEl = document.getElementById("playable-status");

  const ROWS = 3, COLS = 6;
  let W, B, turn, winner, sel; // W[r], B[r] are column indices
  function newGame(){
    // Random start: ensure W < B and gap >= 1 in each row.
    W = []; B = [];
    for (let r=0; r<ROWS; r++){
      const w = Math.floor(Math.random() * 2);
      const b = COLS - 1 - Math.floor(Math.random() * 3);
      W.push(w); B.push(Math.max(b, w + 2));
    }
    turn = "you"; winner = null; sel = -1;
  }
  newGame();

  function gap(r){ return B[r] - W[r] - 1; }

  function legalSlides(r, side){
    // returns array of target columns
    const out = [];
    if (side === "you"){
      // W can move left to 0..W-1, or right to W+1..B-1
      for (let c=0; c<W[r]; c++) out.push(c);
      for (let c=W[r]+1; c<B[r]; c++) out.push(c);
    } else {
      for (let c=B[r]+1; c<COLS; c++) out.push(c);
      for (let c=W[r]+1; c<B[r]; c++) out.push(c);
    }
    return out;
  }

  function anyMove(side){
    for (let r=0; r<ROWS; r++) if (legalSlides(r, side).length) return true;
    return false;
  }

  function aiMove(){
    if (winner) return;
    // Compute current XOR of gaps; pick a forward (advance, ie. shrink) move
    // that zeros XOR. Otherwise advance the largest gap by 1.
    const gaps = [];
    for (let r=0; r<ROWS; r++) gaps.push(gap(r));
    const x = gaps.reduce((a,b)=>a^b, 0);
    let chosen = null;
    if (x !== 0){
      for (let r=0; r<ROWS; r++){
        const target = gaps[r] ^ x;
        if (target < gaps[r]){
          // shrink row r's gap to `target` by moving B left to W+target+1
          const newB = W[r] + target + 1;
          if (newB > W[r] && newB < B[r]) { chosen = { r, newB }; break; }
        }
      }
    }
    if (!chosen){
      // No good move (P-position or no shrink available). Shrink largest gap by 1 if possible.
      for (let r=0; r<ROWS; r++){
        if (B[r] - 1 > W[r]){ chosen = { r, newB: B[r] - 1 }; break; }
      }
    }
    if (!chosen){ winner = "you"; draw(); return; }
    B[chosen.r] = chosen.newB;
    if (!anyMove("you")){ winner = "ai"; draw(); return; }
    turn = "you"; draw();
  }

  function cellRect(r, c){
    const margin = 40, gap = 4;
    const cw = (size - 2*margin - (COLS-1)*gap) / COLS;
    const ch = 40;
    return { x: margin + c*(cw + gap), y: 60 + r*(ch + 10), w: cw, h: ch };
  }

  function draw(){
    ctx.fillStyle="#fafaf7"; ctx.fillRect(0,0,size,220);
    ctx.font="13px sans-serif"; ctx.textAlign="center"; ctx.fillStyle="#444";
    const gaps = [];
    for (let r=0; r<ROWS; r++) gaps.push(gap(r));
    ctx.fillText(`Northcott's Game — slide W left/right without jumping B`, size/2, 22);
    ctx.fillText(`gaps: [${gaps.join(", ")}]  XOR=${gaps.reduce((a,b)=>a^b,0)}`, size/2, 42);

    for (let r=0; r<ROWS; r++){
      const slides = (turn === "you" && sel === r) ? new Set(legalSlides(r, "you")) : new Set();
      for (let c=0; c<COLS; c++){
        const rc = cellRect(r, c);
        ctx.fillStyle = slides.has(c) ? "rgba(60,150,60,0.3)" : "#fff";
        ctx.fillRect(rc.x, rc.y, rc.w, rc.h);
        ctx.strokeStyle = "#888"; ctx.lineWidth = 1;
        ctx.strokeRect(rc.x, rc.y, rc.w, rc.h);
        let piece = null;
        if (W[r] === c) piece = "W";
        if (B[r] === c) piece = "B";
        if (piece){
          ctx.beginPath();
          ctx.arc(rc.x + rc.w/2, rc.y + rc.h/2, Math.min(rc.w, rc.h)*0.35, 0, Math.PI*2);
          ctx.fillStyle = piece === "W" ? "#fff" : "#222";
          ctx.fill();
          ctx.strokeStyle = piece === "W" && sel === r ? "#06c" : "#444";
          ctx.lineWidth = piece === "W" && sel === r ? 3 : 1;
          ctx.stroke();
        }
      }
    }

    if (winner) statusEl.textContent = winner === "you" ? "you win — AI is cornered!" : "AI wins — you are cornered!";
    else if (sel >= 0) statusEl.textContent = `click a highlighted cell in row ${sel+1} to slide`;
    else statusEl.textContent = turn === "you" ? "click your W piece to select" : "AI thinking…";
  }

  function clickPos(e){ const r=canvas.getBoundingClientRect(); return {x:(e.clientX-r.left)*(size/r.width), y:(e.clientY-r.top)*(220/r.height)}; }
  function findCell(x, y){
    for (let r=0; r<ROWS; r++) for (let c=0; c<COLS; c++){
      const rc = cellRect(r, c); if (x>=rc.x&&x<=rc.x+rc.w&&y>=rc.y&&y<=rc.y+rc.h) return {r, c};
    }
    return null;
  }

  function onClick(e){
    if (winner || turn !== "you") return;
    const {x,y} = clickPos(e); const cell = findCell(x, y);
    if (!cell) return;
    if (W[cell.r] === cell.c){ sel = cell.r; draw(); return; }
    if (sel === cell.r){
      const slides = legalSlides(sel, "you");
      if (slides.includes(cell.c)){
        W[sel] = cell.c;
        sel = -1;
        if (!anyMove("ai")){ winner = "you"; draw(); return; }
        turn = "ai"; draw(); setTimeout(aiMove, 500);
      }
    }
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0,0,size,220); },
    restart(){ newGame(); draw(); },
    solve(){
      if (winner || turn !== "you") return;
      const gaps = []; for (let r=0; r<ROWS; r++) gaps.push(gap(r));
      const x = gaps.reduce((a,b)=>a^b, 0);
      let chosen = null;
      if (x !== 0){
        for (let r=0; r<ROWS; r++){
          const target = gaps[r] ^ x;
          if (target < gaps[r]){
            const newW = B[r] - target - 1;
            if (newW > W[r] && newW < B[r]){ chosen = { r, newW }; break; }
          }
        }
      }
      if (!chosen){
        for (let r=0; r<ROWS; r++){
          if (W[r] + 1 < B[r]){ chosen = { r, newW: W[r] + 1 }; break; }
        }
      }
      if (!chosen) return;
      W[chosen.r] = chosen.newW;
      sel = -1;
      if (!anyMove("ai")){ winner = "you"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 500);
    },
  };
}
