// Mastermind — 4 pegs, 6 colours, repeats allowed. You are the codebreaker; the
// computer picks a secret code and you guess. After each guess you see black
// pegs (right colour, right position) and white pegs (right colour, wrong
// position). Solver uses Knuth's minimax rule (≤5 guesses suffice).

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 480);
  canvas.width = size;
  canvas.height = 460;
  const H = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) {
    const w = canvas.width, h = canvas.height;
    canvas.style.width = w + 'px';    canvas.width = w * dpr; canvas.height = h * dpr; ctx.scale(dpr, dpr);
  }
  const statusEl = document.getElementById("playable-status");

  const COLORS = 6, PEGS = 4, MAX_GUESSES = 8;
  const COLOR_RGB = ["#e74c3c", "#27ae60", "#2980b9", "#f1c40f", "#8e44ad", "#e67e22"];

  function allCodes(){
    const out = [];
    for (let a=0; a<COLORS; a++) for (let b=0; b<COLORS; b++)
      for (let c=0; c<COLORS; c++) for (let d=0; d<COLORS; d++) out.push([a,b,c,d]);
    return out;
  }

  function score(guess, code){
    let black = 0;
    const gc = Array(COLORS).fill(0), cc = Array(COLORS).fill(0);
    for (let i=0; i<PEGS; i++){
      if (guess[i] === code[i]) black++;
      else { gc[guess[i]]++; cc[code[i]]++; }
    }
    let white = 0;
    for (let i=0; i<COLORS; i++) white += Math.min(gc[i], cc[i]);
    return [black, white];
  }

  let secret, history, current, pool, winner;
  function newGame(){
    const codes = allCodes();
    secret = codes[Math.floor(Math.random() * codes.length)];
    history = []; current = [0,0,0,0]; pool = codes; winner = null;
  }
  newGame();

  function knuthGuess(){
    if (history.length === 0) return [0,0,1,1]; // Knuth's opening
    // Minimax: pick guess (from all 1296) minimising the max remaining pool size.
    let best = null, bestVal = Infinity;
    const allG = allCodes();
    for (const g of allG){
      const buckets = new Map();
      for (const c of pool){
        const k = score(g, c).join(",");
        buckets.set(k, (buckets.get(k) || 0) + 1);
      }
      let maxB = 0;
      for (const v of buckets.values()) if (v > maxB) maxB = v;
      if (maxB < bestVal){ bestVal = maxB; best = g; }
      else if (maxB === bestVal && pool.some(c => c.every((x,i) => x === g[i]))) best = g; // prefer guesses in pool
    }
    return best;
  }

  function commitGuess(g){
    const s = score(g, secret);
    history.push({ guess: g.slice(), score: s });
    pool = pool.filter(c => {
      const sc = score(g, c); return sc[0] === s[0] && sc[1] === s[1];
    });
    if (s[0] === PEGS) winner = "you";
    else if (history.length >= MAX_GUESSES) winner = "ai";
  }

  // UI: top row = current guess (4 pegs, click to cycle colour); below = history
  function pegRect(row, i){
    const margin = 30;
    const pw = 36, gap = 8;
    const x = margin + i*(pw + gap);
    const y = 60 + row*(pw + 8);
    return { x, y, w: pw, h: pw };
  }
  function scoreRect(row){
    const r = pegRect(row, PEGS);
    return { x: r.x + 16, y: r.y, w: 64, h: 36 };
  }

  function draw(){
    ctx.fillStyle="#fafaf7"; ctx.fillRect(0,0,size,H);
    ctx.font="13px sans-serif"; ctx.textAlign="center"; ctx.fillStyle="#444";
    ctx.fillText(`Mastermind — guess the 4-peg code (${COLORS} colours, repeats OK)`, size/2, 22);
    ctx.fillText(`guesses used: ${history.length}/${MAX_GUESSES}  •  candidates left: ${pool.length}`, size/2, 42);

    // history
    for (let h=0; h<history.length; h++){
      const row = h;
      for (let i=0; i<PEGS; i++){
        const r = pegRect(row, i);
        ctx.beginPath(); ctx.arc(r.x + r.w/2, r.y + r.h/2, r.w*0.35, 0, Math.PI*2);
        ctx.fillStyle = COLOR_RGB[history[h].guess[i]]; ctx.fill();
        ctx.strokeStyle = "#333"; ctx.stroke();
      }
      // score pegs
      const sr = scoreRect(row);
      const [black, white] = history[h].score;
      for (let k=0; k<black + white; k++){
        const px = sr.x + (k % 2) * 14;
        const py = sr.y + Math.floor(k / 2) * 14;
        ctx.beginPath(); ctx.arc(px + 7, py + 7, 5, 0, Math.PI*2);
        ctx.fillStyle = k < black ? "#000" : "#fff";
        ctx.fill();
        ctx.strokeStyle = "#000"; ctx.stroke();
      }
    }

    // current guess row
    if (!winner){
      const row = history.length;
      ctx.fillStyle = "#666"; ctx.font = "11px sans-serif"; ctx.textAlign="left";
      ctx.fillText("guess:", pegRect(row, 0).x - 26, pegRect(row, 0).y + 22);
      for (let i=0; i<PEGS; i++){
        const r = pegRect(row, i);
        ctx.beginPath(); ctx.arc(r.x + r.w/2, r.y + r.h/2, r.w*0.35, 0, Math.PI*2);
        ctx.fillStyle = COLOR_RGB[current[i]]; ctx.fill();
        ctx.strokeStyle = "#06c"; ctx.lineWidth = 2; ctx.stroke(); ctx.lineWidth = 1;
      }
      // submit button
      const sr = scoreRect(row);
      ctx.fillStyle = "#5a7"; ctx.fillRect(sr.x, sr.y, 64, 28);
      ctx.fillStyle = "#fff"; ctx.font = "12px sans-serif"; ctx.textAlign="center"; ctx.textBaseline="middle";
      ctx.fillText("submit", sr.x + 32, sr.y + 14);
      ctx.textBaseline = "alphabetic";
    }

    if (winner === "you"){
      statusEl.textContent = `you broke the code in ${history.length} guesses!`;
    } else if (winner === "ai"){
      statusEl.textContent = `out of guesses — code was [${secret.join(",")}]`;
    } else {
      statusEl.textContent = "click a peg to cycle colour; click submit (or press ⟳ solve)";
    }
  }

  function clickPos(e){ const r=canvas.getBoundingClientRect(); return {x:(e.clientX-r.left)*(size/r.width), y:(e.clientY-r.top)*(H/r.height)}; }

  function onClick(e){
    if (winner) return;
    const {x,y} = clickPos(e);
    const row = history.length;
    for (let i=0; i<PEGS; i++){
      const r = pegRect(row, i);
      if (x>=r.x&&x<=r.x+r.w&&y>=r.y&&y<=r.y+r.h){
        current[i] = (current[i] + 1) % COLORS; draw(); return;
      }
    }
    const sr = scoreRect(row);
    if (x>=sr.x&&x<=sr.x+64&&y>=sr.y&&y<=sr.y+28){
      commitGuess(current); draw();
    }
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0,0,size,H); },
    restart(){ newGame(); draw(); },
    solve(){
      if (winner) return;
      const g = knuthGuess();
      current = g.slice();
      commitGuess(g);
      draw();
    },
  };
}
