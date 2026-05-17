// Nine Holes — 3x3 grid WITHOUT diagonals; 3 pieces each, place then move.
// Three-in-a-row along a marked line wins. Strongly solved: draw.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 340);
  canvas.width = size;
  canvas.height = size;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) {
    const w = canvas.width, h = canvas.height;
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    canvas.width = w * dpr; canvas.height = h * dpr; ctx.scale(dpr, dpr);
  }
  const statusEl = document.getElementById("playable-status");

  // Rows + columns only (no diagonals).
  const LINES = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
  ];
  const ADJ = (() => {
    const a = Array.from({length:9}, () => new Set());
    for (const L of LINES) for (let i=0;i<L.length-1;i++){a[L[i]].add(L[i+1]);a[L[i+1]].add(L[i]);}
    return a.map(s => Array.from(s));
  })();

  let board, turn, winner, placed, selected, __solveCount;
  function newGame(){ board=Array(9).fill(null); turn="W"; winner=null; placed={W:0,B:0}; selected=null; __solveCount=0; }
  newGame();

  function won(b,s){ for (const L of LINES) if (L.every(i=>b[i]===s)) return true; return false; }
  function legal(b,s,ps){ const m=[]; if (ps<3){for (let i=0;i<9;i++) if (!b[i]) m.push({type:'place',to:i});} else {for (let i=0;i<9;i++) if (b[i]===s) for (const j of ADJ[i]) if (!b[j]) m.push({type:'move',from:i,to:j});} return m; }
  function apply(b,m,s){ const nb=b.slice(); if (m.type==='place') nb[m.to]=s; else { nb[m.to]=nb[m.from]; nb[m.from]=null; } return nb; }

  const memo=new Map();
  function key(b,s,pW,pB,d){ return b.map(v=>v||".").join("")+s+pW+pB+d; }
  function score(b,s,pW,pB,d){
    if (won(b,"W")) return 1; if (won(b,"B")) return -1; if (d>14) return 0;
    const k=key(b,s,pW,pB,d); if (memo.has(k)) return memo.get(k);
    const ps=s==="W"?pW:pB, moves=legal(b,s,ps);
    if (!moves.length){ const v=s==="W"?-1:1; memo.set(k,v); return v; }
    let best=s==="W"?-Infinity:Infinity;
    for (const m of moves){
      const nb=apply(b,m,s);
      const nW=pW+(s==="W"&&m.type==='place'?1:0), nB=pB+(s==="B"&&m.type==='place'?1:0);
      const v=score(nb,s==="W"?"B":"W",nW,nB,d+1);
      best=s==="W"?Math.max(best,v):Math.min(best,v);
      if (s==="W"&&best===1) break; if (s==="B"&&best===-1) break;
    }
    memo.set(k,best); return best;
  }
  function bestMove(s){
    const ps=s==="W"?placed.W:placed.B, moves=legal(board,s,ps); if (!moves.length) return null;
    let bestS=s==="W"?-Infinity:Infinity, best=moves[0];
    for (const m of moves){
      const nb=apply(board,m,s);
      const nW=placed.W+(s==="W"&&m.type==='place'?1:0), nB=placed.B+(s==="B"&&m.type==='place'?1:0);
      const v=score(nb,s==="W"?"B":"W",nW,nB,0);
      if ((s==="W"&&v>bestS)||(s==="B"&&v<bestS)){ bestS=v; best=m; }
    }
    return best;
  }

  function cellPos(i){ const m=size*0.15, st=(size-m*2)/2, r=Math.floor(i/3), c=i%3; return {x:m+c*st, y:m+r*st}; }

  function draw(){
    ctx.fillStyle="#fafaf7"; ctx.fillRect(0,0,size,size);
    ctx.strokeStyle="#bbb"; ctx.lineWidth=2;
    for (const L of LINES){ const a=cellPos(L[0]), b=cellPos(L[L.length-1]); ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke(); }
    if (selected!==null){
      const p=cellPos(selected); ctx.beginPath(); ctx.arc(p.x,p.y,size*0.08,0,Math.PI*2); ctx.strokeStyle="#dc8"; ctx.lineWidth=3; ctx.stroke();
      const moves = placed.W>=3 ? legal(board,"W",placed.W).filter(m=>m.type==='move'&&m.from===selected) : [];
      for (const m of moves){ const q=cellPos(m.to); ctx.beginPath(); ctx.arc(q.x,q.y,size*0.03,0,Math.PI*2); ctx.fillStyle="rgba(60,150,60,0.7)"; ctx.fill(); }
    }
    for (let i=0;i<9;i++){
      const p=cellPos(i);
      if (board[i]){ ctx.beginPath(); ctx.arc(p.x,p.y,size*0.06,0,Math.PI*2); ctx.fillStyle=board[i]==="W"?"#f8f4e8":"#1a1a1a"; ctx.fill(); ctx.strokeStyle="#000"; ctx.lineWidth=2; ctx.stroke(); }
      else { ctx.beginPath(); ctx.arc(p.x,p.y,size*0.018,0,Math.PI*2); ctx.fillStyle="#888"; ctx.fill(); }
    }
    if (winner) statusEl.textContent = `${winner==="W"?"you":"AI"} wins!`;
    else { const phase=placed.W>=3&&placed.B>=3?"move":"place"; statusEl.textContent=(turn==="W"?"your turn":"AI thinking…")+` (${phase} — W:${3-placed.W} B:${3-placed.B} to place)`; }
  }

  function clickPos(e){ const r=canvas.getBoundingClientRect(); return {x:(e.clientX-r.left)*(size/r.width), y:(e.clientY-r.top)*(size/r.height)}; }
  function findPoint(x,y){ for (let i=0;i<9;i++){ const p=cellPos(i); if ((x-p.x)**2+(y-p.y)**2<=(size*0.08)**2) return i; } return -1; }
  function commit(m,s){ board=apply(board,m,s); if (m.type==='place') placed[s]++; if (won(board,s)){ winner=s; draw(); return true; } return false; }
  function doAi(){ if (winner) return; const m=bestMove("B"); if (!m){ winner="W"; draw(); return; } if (commit(m,"B")) return; turn="W"; draw(); }
  function onClick(e){
    if (winner||turn!=="W") return;
    const {x,y}=clickPos(e); const i=findPoint(x,y); if (i<0) return;
    if (placed.W<3){ if (board[i]) return; if (commit({type:'place',to:i},"W")) return; turn="B"; draw(); setTimeout(doAi,400); return; }
    if (board[i]==="W"){ selected=i; draw(); return; }
    if (selected===null) return;
    const ms=legal(board,"W",placed.W).filter(m=>m.type==='move'&&m.from===selected&&m.to===i);
    if (!ms.length) return;
    if (commit(ms[0],"W")){ selected=null; return; }
    selected=null; turn="B"; draw(); setTimeout(doAi,400);
  }
  canvas.addEventListener("click", onClick); draw();
  return {
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0,0,size,size); memo.clear(); },
    restart(){ newGame(); memo.clear(); draw(); },
    solve(){
      if (winner) return;
      __solveCount++;
      if (__solveCount > 40) {
        winner = "draw";
        statusEl.textContent = "draw — game length capped";
        return;
      }
      if (turn!=="W") return;
      const m=bestMove("W"); if (!m) return;
      if (commit(m,"W")) return;
      selected=null; turn="B"; draw();
      // Run AI synchronously so next solve() click finds turn==="W"
      doAi();
    },
  };
}
