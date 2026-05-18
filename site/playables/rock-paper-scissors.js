// Rock-Paper-Scissors — best of 9. AI plays the unique Nash mixed strategy: pick
// uniformly at random. (Any deterministic strategy would be exploitable.)

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = 280;
  const W = canvas.width, H = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) { canvas.style.width = W + 'px'; canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr); }
  const statusEl = document.getElementById("playable-status");

  const CHOICES = ["rock", "paper", "scissors"];
  const ICONS = ["✊", "✋", "✌"];

  let scoreYou, scoreAi, round, history;
  function newGame(){ scoreYou = 0; scoreAi = 0; round = 0; history = []; }
  newGame();

  function beats(a, b){
    if (a === b) return 0;
    if ((a === "rock" && b === "scissors") || (a === "paper" && b === "rock") || (a === "scissors" && b === "paper")) return 1;
    return -1;
  }

  function play(you){
    if (round >= 9) return;
    const ai = CHOICES[Math.floor(Math.random()*3)];
    const r = beats(you, ai);
    if (r > 0) scoreYou++;
    else if (r < 0) scoreAi++;
    history.push({ you, ai, r });
    round++;
    draw();
  }

  function btnRect(i){ return { x: 30 + i*110, y: 70, w: 90, h: 90 }; }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "13px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";
    ctx.fillText(`you ${scoreYou}   ai ${scoreAi}   round ${Math.min(round+1, 9)}/9`, W/2, 44);

    for (let i = 0; i < 3; i++){
      const b = btnRect(i);
      const done = round >= 9 || scoreYou >= 5 || scoreAi >= 5;
      ctx.fillStyle = done ? "#ddd" : "#fff";
      ctx.fillRect(b.x, b.y, b.w, b.h);
      ctx.strokeStyle = "#888"; ctx.strokeRect(b.x, b.y, b.w, b.h);
      ctx.font = "40px sans-serif"; ctx.fillStyle = "#444"; ctx.textBaseline = "middle";
      ctx.fillText(ICONS[i], b.x + b.w/2, b.y + b.h/2);
      ctx.textBaseline = "alphabetic"; ctx.font = "12px sans-serif";
      ctx.fillText(CHOICES[i], b.x + b.w/2, b.y + b.h + 14);
    }

    // last result
    const last = history[history.length-1];
    if (last){
      ctx.font = "13px sans-serif"; ctx.fillStyle = "#444";
      const verdict = last.r > 0 ? "you win" : last.r < 0 ? "ai wins" : "draw";
      ctx.fillText(`you: ${last.you}    ai: ${last.ai}    → ${verdict}`, W/2, 220);
    }

    if (scoreYou >= 5) statusEl.textContent = "you win the match!";
    else if (scoreAi >= 5) statusEl.textContent = "AI wins the match";
    else if (round >= 9) statusEl.textContent = "match over";
    else statusEl.textContent = "click a move — AI plays Nash mixed strategy (uniform random)";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }
  function onClick(e){
    if (scoreYou >= 5 || scoreAi >= 5 || round >= 9) return;
    const { x, y } = pos(e);
    for (let i = 0; i < 3; i++){
      const b = btnRect(i);
      if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h){ play(CHOICES[i]); return; }
    }
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve(){
      if (scoreYou >= 5 || scoreAi >= 5 || round >= 9) return;
      play(CHOICES[Math.floor(Math.random() * CHOICES.length)]);
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
