// Six Men's Morris — 16 points (two concentric squares + 4 midline connectors).
// Placement then movement phase. Form a "mill" of 3 to remove an enemy piece.
// A player with <3 or no moves loses. AI: simple heuristic.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = size + 60;
  const W = canvas.width, H = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) { canvas.style.width = W + 'px'; canvas.style.height = H + 'px'; canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr); }
  const statusEl = document.getElementById("playable-status");

  // 16 points. Layout (Six Men's Morris):
  // Outer square: 0(TL) 1(TM) 2(TR) 7(MR) 12(BR) 11(BM) 10(BL) 4(ML)
  // Inner square: 3(TL) 5(TR) 9(BR) 8(BL)
  // Midline connectors: 1-3, 5-7?, etc.
  // Simpler: use a canonical 6MM adjacency.
  //
  // Numbering 0..15 with coordinates:
  //   (x,y) where x∈{0,1,2,3,4,5}, y∈{0,1,2,3,4,5}
  // Outer ring at corners/edges of 0..5 square; inner ring at 1..4 sub-square.
  const POINTS = [
    [0, 0], [3, 0], [5, 0],
    [1, 1], [3, 1], [4, 1],
    [0, 3], [1, 3], [4, 3], [5, 3],
    [1, 4], [3, 4], [4, 4],
    [0, 5], [3, 5], [5, 5],
  ];
  const ADJ = [
    [1, 6],       // 0
    [0, 2, 4],    // 1
    [1, 9],       // 2
    [4, 7],       // 3
    [1, 3, 5],    // 4
    [4, 8],       // 5
    [0, 13, 7],   // 6
    [3, 6, 10],   // 7
    [5, 9, 12],   // 8
    [2, 8, 15],   // 9
    [7, 11],      // 10
    [10, 12, 14], // 11
    [8, 11],      // 12
    [6, 14],      // 13
    [11, 13, 15], // 14
    [9, 14],      // 15
  ];
  // Mills (rows of 3): outer edges & inner edges
  const MILLS = [
    [0, 1, 2],   // outer top
    [13, 14, 15],// outer bottom
    [0, 6, 13],  // outer left
    [2, 9, 15],  // outer right
    [3, 4, 5],   // inner top
    [10, 11, 12],// inner bottom
    [3, 7, 10],  // inner left
    [5, 8, 12],  // inner right
    // midline pairings: 1-4 (top), 14-11 (bottom), 6-7 (left), 9-8 (right)
  ];

  let board, phase, placed, turn, winner, captureMode;
  function newGame(){
    board = new Array(16).fill('.');
    phase = "place"; placed = { you: 0, ai: 0 };
    turn = "you"; winner = null; captureMode = false;
  }
  newGame();

  function inMill(b, i, side){
    for (const m of MILLS){
      if (!m.includes(i)) continue;
      if (m.every(k => b[k] === side)) return true;
    }
    return false;
  }

  function countPieces(b, side){ let n = 0; for (const v of b) if (v === side) n++; return n; }

  function hasLegalMove(b, side){
    for (let i = 0; i < 16; i++) if (b[i] === side){
      for (const j of ADJ[i]) if (b[j] === '.') return true;
    }
    return false;
  }

  function aiPlace(){
    // pick a spot that completes a mill, or blocks one, else greedy
    for (let i = 0; i < 16; i++) if (board[i] === '.'){
      board[i] = 'w'; if (inMill(board, i, 'w')){ board[i] = '.'; return i; } board[i] = '.';
    }
    for (let i = 0; i < 16; i++) if (board[i] === '.'){
      board[i] = 'b'; if (inMill(board, i, 'b')){ board[i] = '.'; return i; } board[i] = '.';
    }
    // first empty
    for (let i = 0; i < 16; i++) if (board[i] === '.') return i;
    return -1;
  }

  function aiCapture(){
    // remove an enemy not in a mill if possible
    const cands = [];
    for (let i = 0; i < 16; i++) if (board[i] === 'b' && !inMill(board, i, 'b')) cands.push(i);
    if (!cands.length) for (let i = 0; i < 16; i++) if (board[i] === 'b') cands.push(i);
    return cands[Math.floor(Math.random() * cands.length)];
  }

  function aiMove(){
    if (winner) return;
    if (phase === "place"){
      const i = aiPlace(); if (i < 0){ winner = "draw"; draw(); return; }
      board[i] = 'w'; placed.ai++;
      if (inMill(board, i, 'w')){
        const ci = aiCapture(); if (ci >= 0){ board[ci] = '.'; if (countPieces(board, 'b') < 3 && placed.you >= 6){ winner = "ai"; draw(); return; } }
      }
      if (placed.you >= 6 && placed.ai >= 6) phase = "move";
      turn = "you"; draw();
    } else {
      // movement phase: pick a piece and slide
      const myPieces = [];
      for (let i = 0; i < 16; i++) if (board[i] === 'w') myPieces.push(i);
      // try mill-completing moves
      let best = null;
      for (const i of myPieces) for (const j of ADJ[i]) if (board[j] === '.'){
        board[j] = 'w'; board[i] = '.';
        if (inMill(board, j, 'w')){ board[i] = 'w'; board[j] = '.'; best = [i, j]; break; }
        board[i] = 'w'; board[j] = '.';
      }
      if (!best){
        for (const i of myPieces) for (const j of ADJ[i]) if (board[j] === '.'){ best = [i, j]; break; }
      }
      if (!best){ winner = "you"; draw(); return; }
      board[best[1]] = 'w'; board[best[0]] = '.';
      if (inMill(board, best[1], 'w')){
        const ci = aiCapture(); if (ci >= 0){ board[ci] = '.'; if (countPieces(board, 'b') < 3){ winner = "ai"; draw(); return; } }
      }
      if (!hasLegalMove(board, 'b')){ winner = "ai"; draw(); return; }
      turn = "you"; draw();
    }
  }

  let selPiece = -1;

  function pointPos(i){
    const margin = 30, step = (size - 2*margin) / 5;
    const [x, y] = POINTS[i];
    return { x: margin + x * step, y: 40 + y * step };
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "13px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";
    ctx.fillText(`Six Men's Morris — ${phase === "place" ? `placement (you placed ${placed.you}/6, ai ${placed.ai}/6)` : "movement"}`, W/2, 22);

    // draw adjacency lines
    ctx.strokeStyle = "#888"; ctx.lineWidth = 1;
    const drawn = new Set();
    for (let i = 0; i < 16; i++){
      const p1 = pointPos(i);
      for (const j of ADJ[i]){
        const k = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (drawn.has(k)) continue; drawn.add(k);
        const p2 = pointPos(j);
        ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
      }
    }

    for (let i = 0; i < 16; i++){
      const p = pointPos(i);
      ctx.beginPath(); ctx.arc(p.x, p.y, 11, 0, Math.PI*2);
      ctx.fillStyle = i === selPiece ? "#cef2cf" : "#fff"; ctx.fill();
      ctx.strokeStyle = "#222"; ctx.stroke();
      if (board[i] !== '.'){
        ctx.beginPath(); ctx.arc(p.x, p.y, 9, 0, Math.PI*2);
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
  function findPoint(x, y){
    for (let i = 0; i < 16; i++){
      const p = pointPos(i);
      if (Math.hypot(x - p.x, y - p.y) < 14) return i;
    }
    return -1;
  }

  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e); const i = findPoint(x, y); if (i < 0) return;
    if (captureMode){
      if (board[i] !== 'w') return;
      if (inMill(board, i, 'w') && countPieces(board, 'w') > 3) return;
      board[i] = '.'; captureMode = false;
      if (countPieces(board, 'w') < 3 && placed.ai >= 6){ winner = "you"; draw(); return; }
      if (placed.you >= 6 && placed.ai >= 6) phase = "move";
      turn = "ai"; draw(); setTimeout(aiMove, 500); return;
    }
    if (phase === "place"){
      if (board[i] !== '.') return;
      board[i] = 'b'; placed.you++;
      if (inMill(board, i, 'b')){ captureMode = true; draw(); return; }
      if (placed.you >= 6 && placed.ai >= 6) phase = "move";
      turn = "ai"; draw(); setTimeout(aiMove, 500);
    } else {
      if (selPiece < 0){
        if (board[i] === 'b') selPiece = i;
        draw(); return;
      }
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
        // pick a random enemy piece to remove
        const cands = [];
        for (let i = 0; i < 16; i++) if (board[i] === 'w' && !(inMill(board, i, 'w') && countPieces(board, 'w') > 3)) cands.push(i);
        if (!cands.length) for (let i = 0; i < 16; i++) if (board[i] === 'w') cands.push(i);
        if (!cands.length) return;
        const ci = cands[Math.floor(Math.random() * cands.length)];
        board[ci] = '.'; captureMode = false;
        if (countPieces(board, 'w') < 3 && placed.ai >= 6){ winner = "you"; draw(); return; }
        if (placed.you >= 6 && placed.ai >= 6) phase = "move";
        turn = "ai"; draw(); setTimeout(aiMove, 80); return;
      }
      if (phase === "place"){
        const empties = [];
        for (let i = 0; i < 16; i++) if (board[i] === '.') empties.push(i);
        if (!empties.length) return;
        const i = empties[Math.floor(Math.random() * empties.length)];
        board[i] = 'b'; placed.you++;
        if (inMill(board, i, 'b')){ captureMode = true; draw(); return; }
        if (placed.you >= 6 && placed.ai >= 6) phase = "move";
        turn = "ai"; draw(); setTimeout(aiMove, 80);
      } else {
        const myPieces = [];
        for (let i = 0; i < 16; i++) if (board[i] === 'b') myPieces.push(i);
        const moves = [];
        for (const i of myPieces) for (const j of ADJ[i]) if (board[j] === '.') moves.push([i, j]);
        if (!moves.length){ winner = "ai"; draw(); return; }
        const [from, to] = moves[Math.floor(Math.random() * moves.length)];
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
