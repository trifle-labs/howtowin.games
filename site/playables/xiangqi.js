// Xiangqi (Chinese chess) — 9×10 board with river between rows 4 and 5 and a
// 3×3 palace at each end. Pieces: General (K), Advisor (A), Elephant (E),
// Horse (N), Chariot (R), Cannon (C), Soldier (S). Capture the general to win.
// We implement standard moves; ignore the "facing-generals" rule for brevity.
// AI: 1-ply material + king-safety.

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 360);
  canvas.width = size;
  canvas.height = Math.floor(size * 10 / 9) + 30;
  const W = canvas.width, H = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) { canvas.style.width = W + 'px'; canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr); }
  const statusEl = document.getElementById("playable-status");

  const COLS = 9, ROWS = 10;
  // pieces: uppercase = AI (red, top), lowercase = you (black, bottom)
  // we'll flip convention: lowercase = you (bottom), uppercase = ai (top)
  let board, turn, winner, sel;
  function newGame(){
    board = Array.from({ length: ROWS }, () => new Array(COLS).fill('.'));
    // AI on top
    board[0] = ['R','N','E','A','K','A','E','N','R'];
    board[2][1] = 'C'; board[2][7] = 'C';
    for (const c of [0,2,4,6,8]) board[3][c] = 'S';
    // You on bottom
    board[ROWS-1] = ['r','n','e','a','k','a','e','n','r'];
    board[ROWS-3][1] = 'c'; board[ROWS-3][7] = 'c';
    for (const c of [0,2,4,6,8]) board[ROWS-4][c] = 's';
    turn = "you"; winner = null; sel = null;
  }
  newGame();

  const isYou = (p) => p !== '.' && p === p.toLowerCase();
  const isAI = (p) => p !== '.' && p === p.toUpperCase();
  const own = (p, side) => side === 'y' ? isYou(p) : isAI(p);
  const enemy = (p, side) => side === 'y' ? isAI(p) : isYou(p);

  function inPalace(side, r, c){
    if (c < 3 || c > 5) return false;
    return side === 'y' ? r >= ROWS - 3 : r <= 2;
  }
  function crossedRiver(side, r){
    return side === 'y' ? r < ROWS / 2 : r >= ROWS / 2;
  }

  function genMoves(b, side){
    const out = [];
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++){
      const p = b[r][c]; if (p === '.') continue; if (!own(p, side)) continue;
      const lower = p.toLowerCase();
      function add(nr, nc){
        if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) return false;
        const t = b[nr][nc];
        if (t === '.'){ out.push({ from: [r, c], to: [nr, nc] }); return true; }
        if (enemy(t, side)) out.push({ from: [r, c], to: [nr, nc] });
        return false;
      }
      if (lower === 'k'){
        for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]){
          const nr = r + dr, nc = c + dc;
          if (inPalace(side, nr, nc)) add(nr, nc);
        }
      } else if (lower === 'a'){
        for (const [dr, dc] of [[-1,-1],[-1,1],[1,-1],[1,1]]){
          const nr = r + dr, nc = c + dc;
          if (inPalace(side, nr, nc)) add(nr, nc);
        }
      } else if (lower === 'e'){
        for (const [dr, dc] of [[-2,-2],[-2,2],[2,-2],[2,2]]){
          const nr = r + dr, nc = c + dc;
          if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) continue;
          if (crossedRiver(side, nr)) continue;
          const mr = r + dr/2, mc = c + dc/2;
          if (mr < 0 || mr >= ROWS || mc < 0 || mc >= COLS) continue;
          if (b[mr][mc] !== '.') continue;
          add(nr, nc);
        }
      } else if (lower === 'n'){
        // horse: L-shape but blocked by piece adjacent in main step
        for (const [step, jumps] of [[[-1,0],[[-2,-1],[-2,1]]],[[1,0],[[2,-1],[2,1]]],[[0,-1],[[-1,-2],[1,-2]]],[[0,1],[[-1,2],[1,2]]]]){
          const sr = r + step[0], sc = c + step[1];
          if (sr < 0 || sr >= ROWS || sc < 0 || sc >= COLS || b[sr][sc] !== '.') continue;
          for (const [dr, dc] of jumps) add(r + dr, c + dc);
        }
      } else if (lower === 'r'){
        for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]){
          let nr = r + dr, nc = c + dc;
          while (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS){
            if (b[nr][nc] === '.'){ out.push({ from: [r, c], to: [nr, nc] }); nr += dr; nc += dc; continue; }
            if (enemy(b[nr][nc], side)) out.push({ from: [r, c], to: [nr, nc] });
            break;
          }
        }
      } else if (lower === 'c'){
        // cannon: rook move, but capture only over exactly one screen
        for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]){
          let nr = r + dr, nc = c + dc;
          // quiet
          while (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && b[nr][nc] === '.'){
            out.push({ from: [r, c], to: [nr, nc] }); nr += dr; nc += dc;
          }
          // screen
          if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) continue;
          nr += dr; nc += dc;
          while (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS){
            if (b[nr][nc] !== '.'){ if (enemy(b[nr][nc], side)) out.push({ from: [r, c], to: [nr, nc] }); break; }
            nr += dr; nc += dc;
          }
        }
      } else if (lower === 's'){
        const fwd = side === 'y' ? -1 : 1;
        add(r + fwd, c);
        if (crossedRiver(side, r)){ add(r, c - 1); add(r, c + 1); }
      }
    }
    return out;
  }
  function applyMove(b, mv){
    const [fr, fc] = mv.from, [tr, tc] = mv.to;
    b[tr][tc] = b[fr][fc]; b[fr][fc] = '.';
  }
  function findKing(b, side){
    const target = side === 'y' ? 'k' : 'K';
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) if (b[r][c] === target) return [r, c];
    return null;
  }
  const VAL = { k: 1000, a: 2, e: 2, n: 4, r: 9, c: 5, s: 1 };
  function material(b){
    let s = 0;
    for (const row of b) for (const v of row){
      if (v === '.') continue;
      s += (isAI(v) ? VAL[v.toLowerCase()] : -VAL[v.toLowerCase()]);
    }
    return s;
  }
  function aiMove(){
    if (winner) return;
    const moves = genMoves(board, 'a');
    if (!moves.length){ winner = "you"; draw(); return; }
    let best = null, bestScore = -Infinity;
    for (const mv of moves){
      const snap = board.map(r => r.slice());
      applyMove(board, mv);
      const v = material(board);
      board = snap;
      if (v > bestScore){ bestScore = v; best = mv; }
    }
    applyMove(board, best);
    if (!findKing(board, 'y')){ winner = "ai"; draw(); return; }
    turn = "you"; draw();
  }

  function cellRect(r, c){
    const margin = 16, cw = (size - 2*margin) / (COLS - 1);
    const ch = (H - 60) / (ROWS - 1);
    return { x: margin + c*cw, y: 30 + r*ch, w: cw, h: ch };
  }
  const GLYPH = { K:'帥', A:'仕', E:'相', N:'傌', R:'俥', C:'炮', S:'兵', k:'將', a:'士', e:'象', n:'馬', r:'車', c:'砲', s:'卒' };

  function draw(){
    ctx.fillStyle = "#fdfae6"; ctx.fillRect(0, 0, W, H);
    ctx.font = "12px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";
    ctx.strokeStyle = "#888";
    for (let r = 0; r < ROWS; r++){
      const a = cellRect(r, 0), b = cellRect(r, COLS - 1);
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    }
    for (let c = 0; c < COLS; c++){
      const a = cellRect(0, c), b = cellRect(ROWS - 1, c);
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    }
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++){
      const v = board[r][c]; if (v === '.') continue;
      const rc = cellRect(r, c);
      ctx.beginPath(); ctx.arc(rc.x, rc.y, 14, 0, Math.PI*2);
      ctx.fillStyle = "#fff5d5"; ctx.fill(); ctx.strokeStyle = "#222"; ctx.stroke();
      if (sel && sel.r === r && sel.c === c){ ctx.beginPath(); ctx.arc(rc.x, rc.y, 14, 0, Math.PI*2); ctx.fillStyle = "rgba(120,220,120,0.5)"; ctx.fill(); }
      ctx.font = "bold 14px sans-serif"; ctx.fillStyle = isYou(v) ? "#222" : "#c33";
      ctx.fillText(GLYPH[v], rc.x, rc.y + 5);
    }
    if (winner) statusEl.textContent = winner === "you" ? "you win — general captured!" : "AI wins";
    else statusEl.textContent = turn === "you" ? (sel ? "click destination intersection" : "click your piece (black)") : "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }
  function nodeAt(x, y){
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++){
      const rc = cellRect(r, c);
      if ((x-rc.x)*(x-rc.x) + (y-rc.y)*(y-rc.y) <= 196) return [r, c];
    }
    return null;
  }
  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e);
    const hit = nodeAt(x, y); if (!hit) return;
    const [r, c] = hit;
    if (sel){
      if (sel.r === r && sel.c === c){ sel = null; draw(); return; }
      if (isYou(board[r][c])){ sel = { r, c }; draw(); return; }
      const moves = genMoves(board, 'y');
      const mv = moves.find(m => m.from[0] === sel.r && m.from[1] === sel.c && m.to[0] === r && m.to[1] === c);
      if (!mv){ sel = null; draw(); return; }
      applyMove(board, mv); sel = null;
      if (!findKing(board, 'a')){ winner = "you"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 400); return;
    } else {
      if (isYou(board[r][c])){ sel = { r, c }; draw(); }
      return;
    }
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve(){
      if (winner || turn !== "you") return;
      const __mvs = genMoves(board, "y");
      if (!__mvs.length) { winner = "ai"; draw(); return; }
      const __mv = __mvs[Math.floor(Math.random() * __mvs.length)];
      applyMove(board, __mv);
      turn = "ai"; draw();
      setTimeout(aiMove, 80);
    },

    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
