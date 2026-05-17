// Nine Men's Morris — 24-point board, three concentric squares with midline
// connectors. Placement (9 stones each) then movement phase. Form a "mill" of
// 3 to remove an enemy piece. Lose when reduced below 3 pieces or no legal move.
// AI: simple heuristic — prefer mills, block mills, then any move.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = size + 60;
  const W = canvas.width, H = canvas.height;
  const statusEl = document.getElementById("playable-status");

  // 24 points indexed 0..23 with (x,y) on a 7×7 grid.
  const POINTS = [
    [0,0],[3,0],[6,0],          // 0,1,2 outer top
    [1,1],[3,1],[5,1],          // 3,4,5 middle top
    [2,2],[3,2],[4,2],          // 6,7,8 inner top
    [0,3],[1,3],[2,3],          // 9,10,11 left mid
    [4,3],[5,3],[6,3],          // 12,13,14 right mid
    [2,4],[3,4],[4,4],          // 15,16,17 inner bottom
    [1,5],[3,5],[5,5],          // 18,19,20 middle bottom
    [0,6],[3,6],[6,6],           // 21,22,23 outer bottom
  ];
  const ADJ = [
    [1, 9],          // 0
    [0, 2, 4],       // 1
    [1, 14],         // 2
    [4, 10],         // 3
    [1, 3, 5, 7],    // 4
    [4, 13],         // 5
    [7, 11],         // 6
    [4, 6, 8],       // 7
    [7, 12],         // 8
    [0, 10, 21],     // 9
    [3, 9, 11, 18],  // 10
    [6, 10, 15],     // 11
    [8, 13, 17],     // 12
    [5, 12, 14, 20], // 13
    [2, 13, 23],     // 14
    [11, 16],        // 15
    [15, 17, 19],    // 16
    [12, 16],        // 17
    [10, 19],        // 18
    [16, 18, 20, 22],// 19
    [13, 19],        // 20
    [9, 22],         // 21
    [19, 21, 23],    // 22
    [14, 22],        // 23
  ];
  const MILLS = [
    [0,1,2],[3,4,5],[6,7,8],[15,16,17],[18,19,20],[21,22,23],
    [0,9,21],[3,10,18],[6,11,15],[1,4,7],[16,19,22],[8,12,17],
    [5,13,20],[2,14,23],
  ];

  let board, phase, placed, turn, winner, captureMode, selPiece;
  function newGame(){
    board = new Array(24).fill('.');
    phase = "place"; placed = { you: 0, ai: 0 };
    turn = "you"; winner = null; captureMode = false; selPiece = -1;
  }
  newGame();

  function inMill(b, i, side){
    for (const m of MILLS){ if (!m.includes(i)) continue; if (m.every(k => b[k] === side)) return true; }
    return false;
  }
  function countPieces(b, side){ let n = 0; for (const v of b) if (v === side) n++; return n; }
  function hasLegalMove(b, side){
    for (let i = 0; i < 24; i++) if (b[i] === side){ for (const j of ADJ[i]) if (b[j] === '.') return true; }
    return false;
  }
  function aiPlace(){
    for (let i = 0; i < 24; i++) if (board[i] === '.'){ board[i] = 'w'; if (inMill(board, i, 'w')){ board[i] = '.'; return i; } board[i] = '.'; }
    for (let i = 0; i < 24; i++) if (board[i] === '.'){ board[i] = 'b'; if (inMill(board, i, 'b')){ board[i] = '.'; return i; } board[i] = '.'; }
    for (let i = 0; i < 24; i++) if (board[i] === '.') return i;
    return -1;
  }
  function aiCapture(){
    const cands = [];
    for (let i = 0; i < 24; i++) if (board[i] === 'b' && !inMill(board, i, 'b')) cands.push(i);
    if (!cands.length) for (let i = 0; i < 24; i++) if (board[i] === 'b') cands.push(i);
    return cands[Math.floor(Math.random() * cands.length)];
  }

  function aiMove(){
    if (winner) return;
    if (phase === "place"){
      const i = aiPlace(); if (i < 0){ winner = "draw"; draw(); return; }
      board[i] = 'w'; placed.ai++;
      if (inMill(board, i, 'w')){
        const ci = aiCapture(); if (ci >= 0){ board[ci] = '.'; if (countPieces(board, 'b') < 3 && placed.you >= 9){ winner = "ai"; draw(); return; } }
      }
      if (placed.you >= 9 && placed.ai >= 9) phase = "move";
      turn = "you"; draw();
    } else {
      const myPieces = []; for (let i = 0; i < 24; i++) if (board[i] === 'w') myPieces.push(i);
      let best = null;
      for (const i of myPieces) for (const j of ADJ[i]) if (board[j] === '.'){
        board[j] = 'w'; board[i] = '.';
        if (inMill(board, j, 'w')){ board[i] = 'w'; board[j] = '.'; best = [i, j]; break; }
        board[i] = 'w'; board[j] = '.';
      }
      if (!best){ for (const i of myPieces) for (const j of ADJ[i]) if (board[j] === '.'){ best = [i, j]; break; } }
      if (!best){ winner = "you"; draw(); return; }
      board[best[1]] = 'w'; board[best[0]] = '.';
      if (inMill(board, best[1], 'w')){ const ci = aiCapture(); if (ci >= 0){ board[ci] = '.'; if (countPieces(board, 'b') < 3){ winner = "ai"; draw(); return; } } }
      if (!hasLegalMove(board, 'b')){ winner = "ai"; draw(); return; }
      turn = "you"; draw();
    }
  }

  function pointPos(i){
    const margin = 24, step = (size - 2*margin) / 6;
    const [x, y] = POINTS[i];
    return { x: margin + x * step, y: 40 + y * step };
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "13px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";
    ctx.fillText(`Nine Men's Morris — ${phase === "place" ? `placement (you ${placed.you}/9, ai ${placed.ai}/9)` : "movement"}`, W/2, 22);

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

    if (winner) statusEl.textContent = winner === "you" ? "you win!" : winner === "ai" ? "AI wins" : "draw";
    else if (turn === "you"){
      if (captureMode) statusEl.textContent = "you formed a mill — click an enemy piece to remove";
      else if (phase === "place") statusEl.textContent = "click an empty point to place a stone";
      else statusEl.textContent = selPiece < 0 ? "click your blue piece to move" : "click an adjacent empty point";
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
      if (countPieces(board, 'w') < 3 && placed.ai >= 9){ winner = "you"; draw(); return; }
      if (placed.you >= 9 && placed.ai >= 9) phase = "move";
      turn = "ai"; draw(); setTimeout(aiMove, 500); return;
    }
    if (phase === "place"){
      if (board[i] !== '.') return;
      board[i] = 'b'; placed.you++;
      if (inMill(board, i, 'b')){ captureMode = true; draw(); return; }
      if (placed.you >= 9 && placed.ai >= 9) phase = "move";
      turn = "ai"; draw(); setTimeout(aiMove, 500);
    } else {
      if (selPiece < 0){ if (board[i] === 'b') selPiece = i; draw(); return; }
      if (i === selPiece){ selPiece = -1; draw(); return; }
      if (board[i] !== '.' || !ADJ[selPiece].includes(i)){ selPiece = -1; draw(); return; }
      board[i] = 'b'; board[selPiece] = '.'; const moved = i; selPiece = -1;
      if (inMill(board, moved, 'b')){ captureMode = true; draw(); return; }
      if (!hasLegalMove(board, 'w')){ winner = "you"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 500);
    }
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve(){
      if (winner || turn !== "you") return;
      if (captureMode){
        const cands = [];
        for (let i = 0; i < 24; i++) if (board[i] === 'w' && !(inMill(board, i, 'w') && countPieces(board, 'w') > 3)) cands.push(i);
        if (!cands.length) for (let i = 0; i < 24; i++) if (board[i] === 'w') cands.push(i);
        if (!cands.length){ captureMode = false; turn = "ai"; draw(); setTimeout(aiMove, 80); return; }
        const ci = cands[Math.floor(Math.random() * cands.length)];
        board[ci] = '.'; captureMode = false;
        if (countPieces(board, 'w') < 3 && placed.ai >= 9){ winner = "you"; draw(); return; }
        if (placed.you >= 9 && placed.ai >= 9) phase = "move";
        turn = "ai"; draw(); setTimeout(aiMove, 80); return;
      }
      if (phase === "place"){
        const empties = [];
        for (let i = 0; i < 24; i++) if (board[i] === '.') empties.push(i);
        if (!empties.length){ turn = "ai"; draw(); setTimeout(aiMove, 80); return; }
        const i = empties[Math.floor(Math.random() * empties.length)];
        board[i] = 'b'; placed.you++;
        if (inMill(board, i, 'b')){ captureMode = true; draw(); return; }
        if (placed.you >= 9 && placed.ai >= 9) phase = "move";
        turn = "ai"; draw(); setTimeout(aiMove, 80);
      } else {
        const opts = [];
        for (let i = 0; i < 24; i++) if (board[i] === 'b')
          for (const j of ADJ[i]) if (board[j] === '.') opts.push([i, j]);
        if (!opts.length){ winner = "ai"; draw(); return; }
        const [from, to] = opts[Math.floor(Math.random() * opts.length)];
        board[to] = 'b'; board[from] = '.'; selPiece = -1;
        if (inMill(board, to, 'b')){ captureMode = true; draw(); return; }
        if (!hasLegalMove(board, 'w')){ winner = "you"; draw(); return; }
        turn = "ai"; draw(); setTimeout(aiMove, 80);
      }
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
