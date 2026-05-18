// Kayles — a row of pins. Remove 1 pin OR 2 adjacent pins. Last to move wins.
// Octal game 0.77 — strongly solved via Grundy values (Sprague-Grundy theorem).
// AI uses memoized Grundy(n) and chooses a move that nim-sums the segments to 0.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 480);
  canvas.width = size;
  canvas.height = 220;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) {
    const w = canvas.width, h = canvas.height;
    canvas.style.width = w + 'px';    canvas.width = w * dpr; canvas.height = h * dpr; ctx.scale(dpr, dpr);
  }
  const statusEl = document.getElementById("playable-status");

  const N = 12; // initial number of pins
  let pins, turn, winner, sel;
  function newGame(){ pins = Array(N).fill(true); turn="you"; winner=null; sel=null; }
  newGame();

  // Segments: contiguous runs of present pins.
  function segments(arr){
    const segs=[]; let i=0;
    while (i < arr.length){
      if (arr[i]){ let j=i; while (j<arr.length&&arr[j]) j++; segs.push(j-i); i=j; }
      else i++;
    }
    return segs;
  }

  // Grundy memo
  const G = new Map(); G.set(0, 0);
  function grundy(n){
    if (G.has(n)) return G.get(n);
    const s = new Set();
    // Remove 1 pin → split into (k, n-1-k)
    for (let k=0; k<=n-1; k++) s.add(grundy(k) ^ grundy(n-1-k));
    // Remove 2 adjacent pins → split into (k, n-2-k)
    for (let k=0; k<=n-2; k++) s.add(grundy(k) ^ grundy(n-2-k));
    let m=0; while (s.has(m)) m++;
    G.set(n, m); return m;
  }

  // Find a winning move: enumerate, return move that makes total Grundy 0.
  function findWinningMove(arr){
    const segs = segments(arr);
    const total = segs.reduce((a,b)=>a^grundy(b), 0);
    if (total === 0) return null;
    // For each segment, find a move within that segment to change its grundy to (g ^ total).
    let pos = 0;
    for (const sLen of segs){
      const segStart = (() => { let i=0,c=0; while (i<arr.length){ if (arr[i]){ if (c === pos) return i; c++; } i++; } return -1; })();
      // Actually easier: walk arr to find start of this segment
      // Simpler approach: try every move on full array, compute resulting nim-sum.
      pos += sLen;
    }
    // Brute force fallback: try every legal move; pick one that yields total Grundy 0.
    for (let i=0; i<arr.length; i++){
      if (!arr[i]) continue;
      // remove 1
      const a1 = arr.slice(); a1[i]=false;
      const segs1 = segments(a1);
      if (segs1.reduce((a,b)=>a^grundy(b),0) === 0) return {type:'one', i};
      // remove 2
      if (i+1<arr.length && arr[i+1]){
        const a2 = arr.slice(); a2[i]=false; a2[i+1]=false;
        const segs2 = segments(a2);
        if (segs2.reduce((a,b)=>a^grundy(b),0) === 0) return {type:'two', i};
      }
    }
    return null;
  }

  function aiMove(){
    if (winner) return;
    const m = findWinningMove(pins);
    if (m){
      pins[m.i] = false; if (m.type === 'two') pins[m.i+1] = false;
    } else {
      // No winning move — take 1 pin minimally
      const idx = pins.findIndex(x => x);
      if (idx < 0){ winner = "you"; draw(); return; } // shouldn't reach
      pins[idx] = false;
    }
    if (pins.every(x => !x)){ winner = "ai"; draw(); return; }
    turn = "you"; draw();
  }

  function commit(m){
    pins[m.i] = false; if (m.type === 'two') pins[m.i+1] = false;
    if (pins.every(x => !x)){ winner = turn === "you" ? "you" : "ai"; draw(); return true; }
    return false;
  }

  function pinPos(i){ const margin=40, gap=(size-2*margin)/(N-1); return { x: margin + i*gap, y: 90 }; }

  function btnRect(label, i){
    // Two action buttons appear when a pin is selected.
    const y = 150, w = 130, h = 32, gap = 12;
    const totalW = 2*w + gap, x0 = (size - totalW)/2;
    return { x: x0 + label*(w+gap), y, w, h };
  }

  function draw(){
    ctx.fillStyle="#fafaf7"; ctx.fillRect(0,0,size,220);
    ctx.font="13px sans-serif"; ctx.textAlign="center"; ctx.fillStyle="#444";
    const segs = segments(pins);
    ctx.fillText(`segments: [${segs.join(", ") || "∅"}]   grundy: ${segs.reduce((a,b)=>a^grundy(b),0)}`, size/2, 24);

    // base line
    ctx.strokeStyle="#bbb"; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(20, 115); ctx.lineTo(size-20, 115); ctx.stroke();

    for (let i=0; i<N; i++){
      const p = pinPos(i);
      if (pins[i]){
        ctx.beginPath(); ctx.arc(p.x, p.y, 12, 0, Math.PI*2);
        ctx.fillStyle = sel === i ? "#dc8" : "#eed8a8"; ctx.fill();
        ctx.strokeStyle="#964"; ctx.lineWidth=1.5; ctx.stroke();
      }
    }

    if (sel !== null && pins[sel]){
      // Two action buttons
      const canTwo = sel+1<N && pins[sel+1];
      const b1 = btnRect(0); const b2 = btnRect(1);
      [
        { r: b1, label: "remove this pin", enabled: true, action: 'one' },
        { r: b2, label: canTwo ? "remove this + right" : "(no right pin)", enabled: canTwo, action: 'two' },
      ].forEach(({r, label, enabled}) => {
        ctx.fillStyle = enabled ? "#eef0e8" : "#eee"; ctx.fillRect(r.x, r.y, r.w, r.h);
        ctx.strokeStyle="#888"; ctx.lineWidth=1; ctx.strokeRect(r.x, r.y, r.w, r.h);
        ctx.fillStyle = enabled ? "#222" : "#999"; ctx.font="12px sans-serif"; ctx.textBaseline="middle"; ctx.textAlign="center";
        ctx.fillText(label, r.x + r.w/2, r.y + r.h/2);
      });
      ctx.textBaseline="alphabetic";
    }

    if (winner) statusEl.textContent = winner === "you" ? "you win!" : "AI wins";
    else if (sel !== null) statusEl.textContent = "choose: remove just this pin, or this + right neighbour";
    else statusEl.textContent = turn === "you" ? "your turn — click a pin" : "AI thinking…";
  }

  function clickPos(e){ const r=canvas.getBoundingClientRect(); return {x:(e.clientX-r.left)*(size/r.width), y:(e.clientY-r.top)*(220/r.height)}; }

  function findPin(x, y){
    for (let i=0; i<N; i++){
      const p = pinPos(i);
      if (pins[i] && (x-p.x)**2 + (y-p.y)**2 <= 14*14) return i;
    }
    return -1;
  }

  function findBtn(x, y){
    if (sel === null || !pins[sel]) return null;
    const b1=btnRect(0), b2=btnRect(1);
    if (x>=b1.x&&x<=b1.x+b1.w&&y>=b1.y&&y<=b1.y+b1.h) return 'one';
    if (x>=b2.x&&x<=b2.x+b2.w&&y>=b2.y&&y<=b2.y+b2.h){
      const canTwo = sel+1<N && pins[sel+1];
      if (canTwo) return 'two';
    }
    return null;
  }

  function onClick(e){
    if (winner || turn !== "you") return;
    const {x,y} = clickPos(e);
    const action = findBtn(x, y);
    if (action){
      const m = { i: sel, type: action };
      sel = null;
      if (commit(m)){ return; }
      turn = "ai"; draw(); setTimeout(aiMove, 500); return;
    }
    const i = findPin(x, y);
    if (i >= 0){ sel = i; draw(); return; }
  }

  canvas.addEventListener("click", onClick); draw();
  return {
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0,0,size,220); },
    restart(){ newGame(); draw(); },
    solve(){
      if (winner || turn !== "you") return;
      const m = findWinningMove(pins);
      if (!m){ statusEl.textContent = "no winning move (P-position)"; return; }
      sel = null;
      if (commit(m)) return;
      turn = "ai"; draw(); setTimeout(aiMove, 500);
    },
  };
}
