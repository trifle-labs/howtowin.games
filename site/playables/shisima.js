// Shisima — Kenyan 3-in-a-row on an octagonal board: 8 outer points (0..7
// clockwise) + center (8). Each player has 3 stones already on the board (no
// placement phase). Slide along a line to an adjacent empty point. A WIN is
// any three-in-a-row that passes through the CENTER.
// Strongly solved: draw.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 360);
  canvas.width = size;
  canvas.height = size;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) {
    const w = canvas.width, h = canvas.height;
    canvas.style.width = w + 'px';    canvas.width = w * dpr; canvas.height = h * dpr; ctx.scale(dpr, dpr);
  }
  const statusEl = document.getElementById("playable-status");

  // Adjacency: center<->all outer; outer ring 0..7 cyclic neighbors.
  const ADJ = (() => {
    const a = Array.from({length:9}, () => new Set());
    for (let i=0; i<8; i++){ a[i].add(8); a[8].add(i); a[i].add((i+1)%8); a[(i+1)%8].add(i); }
    return a.map(s => Array.from(s));
  })();
  // Winning lines: opposite outer pair + center.
  const LINES = [[0,8,4],[1,8,5],[2,8,6],[3,8,7]];

  let board, turn, winner, selected, __solveCount;
  function newGame(){
    board = Array(9).fill(null);
    // W on top 3 (positions 7,0,1); B on bottom 3 (3,4,5). Center empty.
    board[7]="W"; board[0]="W"; board[1]="W";
    board[3]="B"; board[4]="B"; board[5]="B";
    turn="W"; winner=null; selected=null; __solveCount=0;
  }
  newGame();

  function won(b,s){ for (const L of LINES) if (L.every(i=>b[i]===s)) return true; return false; }
  function legal(b,s){ const m=[]; for (let i=0;i<9;i++) if (b[i]===s) for (const j of ADJ[i]) if (!b[j]) m.push({from:i,to:j}); return m; }
  function apply(b,m){ const nb=b.slice(); nb[m.to]=nb[m.from]; nb[m.from]=null; return nb; }

  const memo=new Map();
  function key(b,s,d){ return b.map(v=>v||".").join("")+s+d; }
  function score(b,s,d){
    if (won(b,"W")) return 1; if (won(b,"B")) return -1; if (d>14) return 0;
    const k=key(b,s,d); if (memo.has(k)) return memo.get(k);
    const moves=legal(b,s);
    if (!moves.length){ const v=s==="W"?-1:1; memo.set(k,v); return v; }
    let best=s==="W"?-Infinity:Infinity;
    for (const m of moves){
      const nb=apply(b,m);
      const v=score(nb,s==="W"?"B":"W",d+1);
      best=s==="W"?Math.max(best,v):Math.min(best,v);
      if (s==="W"&&best===1) break; if (s==="B"&&best===-1) break;
    }
    memo.set(k,best); return best;
  }
  function bestMove(s){
    const moves=legal(board,s); if (!moves.length) return null;
    let bestS=s==="W"?-Infinity:Infinity, best=moves[0];
    for (const m of moves){
      const v=score(apply(board,m),s==="W"?"B":"W",0);
      if ((s==="W"&&v>bestS)||(s==="B"&&v<bestS)){ bestS=v; best=m; }
    }
    return best;
  }

  function cellPos(i){
    const cx=size/2, cy=size/2, R=size*0.36;
    if (i===8) return {x:cx, y:cy};
    const ang = -Math.PI/2 + (i*2*Math.PI/8);
    return { x: cx + R*Math.cos(ang), y: cy + R*Math.sin(ang) };
  }

  function draw(){
    ctx.fillStyle="#fafaf7"; ctx.fillRect(0,0,size,size);
    // Edges: ring + radials.
    ctx.strokeStyle="#bbb"; ctx.lineWidth=2;
    for (let i=0;i<8;i++){
      const a=cellPos(i), b=cellPos((i+1)%8);
      ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
      const c=cellPos(8);
      ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(c.x,c.y); ctx.stroke();
    }
    if (selected!==null){
      const p=cellPos(selected); ctx.beginPath(); ctx.arc(p.x,p.y,size*0.07,0,Math.PI*2); ctx.strokeStyle="#dc8"; ctx.lineWidth=3; ctx.stroke();
      for (const m of legal(board,"W").filter(m=>m.from===selected)){
        const q=cellPos(m.to); ctx.beginPath(); ctx.arc(q.x,q.y,size*0.025,0,Math.PI*2); ctx.fillStyle="rgba(60,150,60,0.7)"; ctx.fill();
      }
    }
    for (let i=0;i<9;i++){
      const p=cellPos(i);
      if (board[i]){ ctx.beginPath(); ctx.arc(p.x,p.y,size*0.055,0,Math.PI*2); ctx.fillStyle=board[i]==="W"?"#f8f4e8":"#1a1a1a"; ctx.fill(); ctx.strokeStyle="#000"; ctx.lineWidth=2; ctx.stroke(); }
      else { ctx.beginPath(); ctx.arc(p.x,p.y,size*0.018,0,Math.PI*2); ctx.fillStyle="#888"; ctx.fill(); }
    }
    if (winner) statusEl.textContent = `${winner==="W"?"you":"AI"} wins!`;
    else statusEl.textContent = turn==="W"?"your turn — slide a stone":"AI thinking…";
  }

  function clickPos(e){ const r=canvas.getBoundingClientRect(); return {x:(e.clientX-r.left)*(size/r.width), y:(e.clientY-r.top)*(size/r.height)}; }
  function findPoint(x,y){ for (let i=0;i<9;i++){ const p=cellPos(i); if ((x-p.x)**2+(y-p.y)**2<=(size*0.07)**2) return i; } return -1; }
  function commit(m,s){ board=apply(board,m); if (won(board,s)){ winner=s; draw(); return true; } return false; }
  function doAi(){ if (winner) return; const m=bestMove("B"); if (!m){ winner="W"; draw(); return; } if (commit(m,"B")) return; turn="W"; draw(); }
  function onClick(e){
    if (winner||turn!=="W") return;
    const {x,y}=clickPos(e); const i=findPoint(x,y); if (i<0) return;
    if (board[i]==="W"){ selected=i; draw(); return; }
    if (selected===null) return;
    const ms=legal(board,"W").filter(m=>m.from===selected&&m.to===i);
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
