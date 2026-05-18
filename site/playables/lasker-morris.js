// Lasker Morris — Nine Men's Morris with Lasker's variant: on each turn you may
// EITHER place a new stone from your reserve OR move an existing stone along a
// line (no separate phases). Form a mill of 3 to remove an enemy. Lose when
// reduced below 3 pieces or stuck.
// AI: simple heuristic — prefer mill-creating actions then any legal action.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = size + 60;
  const W = canvas.width, H = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) { canvas.style.width = W + 'px'; canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr); }
  const statusEl = document.getElementById("playable-status");

  const POINTS = [
    [0,0],[3,0],[6,0], [1,1],[3,1],[5,1], [2,2],[3,2],[4,2],
    [0,3],[1,3],[2,3], [4,3],[5,3],[6,3],
    [2,4],[3,4],[4,4], [1,5],[3,5],[5,5], [0,6],[3,6],[6,6],
  ];
  const ADJ = [
    [1, 9],[0, 2, 4],[1, 14],[4, 10],[1, 3, 5, 7],[4, 13],
    [7, 11],[4, 6, 8],[7, 12],[0, 10, 21],[3, 9, 11, 18],[6, 10, 15],
    [8, 13, 17],[5, 12, 14, 20],[2, 13, 23],[11, 16],[15, 17, 19],[12, 16],
    [10, 19],[16, 18, 20, 22],[13, 19],[9, 22],[19, 21, 23],[14, 22],
  ];
  const MILLS = [
    [0,1,2],[3,4,5],[6,7,8],[15,16,17],[18,19,20],[21,22,23],
    [0,9,21],[3,10,18],[6,11,15],[1,4,7],[16,19,22],[8,12,17],
    [5,13,20],[2,14,23],
  ];

  let board, reserve, turn, winner, captureMode, selPiece;
  function newGame(){
    board = new Array(24).fill('.');
    reserve = { you: 10, ai: 10 };
    turn = "you"; winner = null; captureMode = false; selPiece = -1;
  }
  newGame();

  function inMill(b, i, side){ for (const m of MILLS){ if (!m.includes(i)) continue; if (m.every(k => b[k] === side)) return true; } return false; }
  function countPieces(b, side){ let n = 0; for (const v of b) if (v === side) n++; return n; }
  function hasLegalMove(b, side){ for (let i = 0; i < 24; i++) if (b[i] === side){ for (const j of ADJ[i]) if (b[j] === '.') return true; } return false; }

  function aiAction(){
    // try mill-creating place
    if (reserve.ai > 0){
      for (let i = 0; i < 24; i++) if (board[i] === '.'){
        board[i] = 'w'; if (inMill(board, i, 'w')){ board[i] = '.'; return { kind: 'place', to: i }; } board[i] = '.';
      }
    }
    // try mill-creating move
    for (let i = 0; i < 24; i++) if (board[i] === 'w'){
      for (const j of ADJ[i]) if (board[j] === '.'){
        board[j] = 'w'; board[i] = '.';
        const mill = inMill(board, j, 'w');
        board[i] = 'w'; board[j] = '.';
        if (mill) return { kind: 'move', from: i, to: j };
      }
    }
    // block player mill (placement)
    if (reserve.ai > 0){
      for (let i = 0; i < 24; i++) if (board[i] === '.'){
        board[i] = 'b'; if (inMill(board, i, 'b')){ board[i] = '.'; return { kind: 'place', to: i }; } board[i] = '.';
      }
    }
    // any place
    if (reserve.ai > 0){ for (let i = 0; i < 24; i++) if (board[i] === '.') return { kind: 'place', to: i }; }
    // any move
    for (let i = 0; i < 24; i++) if (board[i] === 'w'){ for (const j of ADJ[i]) if (board[j] === '.') return { kind: 'move', from: i, to: j }; }
    return null;
  }

  function aiCapture(){
    const cands = [];
    for (let i = 0; i < 24; i++) if (board[i] === 'b' && !inMill(board, i, 'b')) cands.push(i);
    if (!cands.length) for (let i = 0; i < 24; i++) if (board[i] === 'b') cands.push(i);
    return cands[Math.floor(Math.random() * cands.length)];
  }

  function aiMove(){
    if (winner) return;
    const a = aiAction(); if (!a){ winner = "you"; draw(); return; }
    if (a.kind === 'place'){ board[a.to] = 'w'; reserve.ai--; }
    else { board[a.to] = 'w'; board[a.from] = '.'; }
    if (inMill(board, a.to, 'w')){
      const ci = aiCapture(); if (ci >= 0){ board[ci] = '.'; if (countPieces(board, 'b') + reserve.you < 3){ winner = "ai"; draw(); return; } }
    }
    if (countPieces(board, 'b') + reserve.you < 3){ winner = "ai"; draw(); return; }
    if (reserve.you === 0 && !hasLegalMove(board, 'b')){ winner = "ai"; draw(); return; }
    turn = "you"; draw();
  }

  function pointPos(i){ const margin = 24, step = (size - 2*margin) / 6; const [x, y] = POINTS[i]; return { x: margin + x * step, y: 40 + y * step }; }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "13px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";
    ctx.fillText(`Lasker Morris — reserve: you ${reserve.you}, ai ${reserve.ai}`, W/2, 22);

    ctx.strokeStyle = "#888"; ctx.lineWidth = 1;
    const drawn = new Set();
    for (let i = 0; i < 24; i++){
      const p1 = pointPos(i);
      for (const j of ADJ[i]){
        const k = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (drawn.has(k)) continue; drawn.add(k);
        const p2 = pointPos(j);
        ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
      }
    }
    for (let i = 0; i < 24; i++){
      const p = pointPos(i);
      ctx.beginPath(); ctx.arc(p.x, p.y, 10, 0, Math.PI*2);
      ctx.fillStyle = i === selPiece ? "#cef2cf" : "#fff"; ctx.fill();
      ctx.strokeStyle = "#222"; ctx.stroke();
      if (board[i] !== '.'){
        ctx.beginPath(); ctx.arc(p.x, p.y, 8, 0, Math.PI*2);
        ctx.fillStyle = board[i] === 'b' ? "#39c" : "#e60"; ctx.fill();
      }
    }

    if (winner) statusEl.textContent = winner === "you" ? "you win!" : "AI wins";
    else if (turn === "you"){
      if (captureMode) statusEl.textContent = "you formed a mill — click an enemy piece to remove";
      else statusEl.textContent = selPiece < 0
        ? (reserve.you > 0 ? "click empty point to place OR click your piece to move" : "click your blue piece to move")
        : "click an adjacent empty point to move (or click piece again to cancel)";
    } else statusEl.textContent = "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }
  function findPoint(x, y){ for (let i = 0; i < 24; i++){ const p = pointPos(i); if (Math.hypot(x - p.x, y - p.y) < 13) return i; } return -1; }

  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e); const i = findPoint(x, y); if (i < 0) return;
    if (captureMode){
      if (board[i] !== 'w') return;
      if (inMill(board, i, 'w') && countPieces(board, 'w') > 3) return;
      board[i] = '.'; captureMode = false;
      if (countPieces(board, 'w') + reserve.ai < 3){ winner = "you"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 500); return;
    }
    if (selPiece < 0){
      if (board[i] === '.' && reserve.you > 0){
        board[i] = 'b'; reserve.you--;
        if (inMill(board, i, 'b')){ captureMode = true; draw(); return; }
        turn = "ai"; draw(); setTimeout(aiMove, 500); return;
      }
      if (board[i] === 'b'){ selPiece = i; draw(); }
      return;
    }
    if (i === selPiece){ selPiece = -1; draw(); return; }
    if (board[i] !== '.' || !ADJ[selPiece].includes(i)){ selPiece = -1; draw(); return; }
    board[i] = 'b'; board[selPiece] = '.'; const moved = i; selPiece = -1;
    if (inMill(board, moved, 'b')){ captureMode = true; draw(); return; }
    turn = "ai"; draw(); setTimeout(aiMove, 500);
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve(){
      if (winner || turn !== "you") return;
      if (captureMode){
        // pick a random enemy (AI/w) piece to capture
        const cands = [];
        for (let i = 0; i < 24; i++) if (board[i] === 'w' && !(inMill(board, i, 'w') && countPieces(board, 'w') > 3)) cands.push(i);
        if (!cands.length) for (let i = 0; i < 24; i++) if (board[i] === 'w') cands.push(i);
        if (!cands.length){ captureMode = false; turn = "ai"; draw(); setTimeout(aiMove, 80); return; }
        const ci = cands[Math.floor(Math.random() * cands.length)];
        board[ci] = '.'; captureMode = false;
        if (countPieces(board, 'w') + reserve.ai < 3){ winner = "you"; draw(); return; }
        turn = "ai"; draw(); setTimeout(aiMove, 80); return;
      }
      // build all legal "you" actions: place or move
      const actions = [];
      if (reserve.you > 0){
        for (let i = 0; i < 24; i++) if (board[i] === '.') actions.push({ kind: 'place', to: i });
      }
      for (let i = 0; i < 24; i++) if (board[i] === 'b'){
        for (const j of ADJ[i]) if (board[j] === '.') actions.push({ kind: 'move', from: i, to: j });
      }
      if (!actions.length){ winner = "ai"; draw(); return; }
      const act = actions[Math.floor(Math.random() * actions.length)];
      if (act.kind === 'place'){ board[act.to] = 'b'; reserve.you--; }
      else { board[act.to] = 'b'; board[act.from] = '.'; }
      selPiece = -1;
      if (inMill(board, act.to, 'b')){ captureMode = true; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 80);
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
