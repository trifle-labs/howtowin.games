// Tablut — 9×9 tafl variant. Defender controls king (centre) + 8 soldiers around
// it; attacker has 16 soldiers on the four edge plus-shapes. Rook movement
// (orthogonal any distance, no jumping). Custodial capture: enemy soldier
// between two of your soldiers (or your soldier + throne) along a row/column
// is removed. King escapes by reaching any corner — defender wins. If king is
// captured (sandwiched on all 4 orthogonal sides by attackers or throne) —
// attacker wins. You play defender; AI plays attacker. AI: 1-ply greedy with
// king-safety and king-distance-to-corner.

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 420);
  canvas.width = size;
  canvas.height = size + 30;
  const W = canvas.width, H = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) { canvas.style.width = W + 'px'; canvas.style.height = H + 'px'; canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr); }
  const statusEl = document.getElementById("playable-status");

  const N = 9;
  // cell values: '.', 'A' attacker, 'D' defender, 'K' king
  let board, turn, winner, sel;
  function newGame(){
    board = Array.from({ length: N }, () => new Array(N).fill('.'));
    // attackers (plus-shape on each edge, 4 along edge + 1 set in)
    // top row
    for (const c of [3,4,5]) board[0][c] = 'A';
    board[1][4] = 'A';
    // bottom row
    for (const c of [3,4,5]) board[8][c] = 'A';
    board[7][4] = 'A';
    // left col
    for (const r of [3,4,5]) board[r][0] = 'A';
    board[4][1] = 'A';
    // right col
    for (const r of [3,4,5]) board[r][8] = 'A';
    board[4][7] = 'A';
    // defenders (cross around throne)
    for (const [r, c] of [[2,4],[3,4],[5,4],[6,4],[4,2],[4,3],[4,5],[4,6]]) board[r][c] = 'D';
    board[4][4] = 'K';
    turn = "you"; winner = null; sel = null;
  }
  newGame();

  const corners = [[0,0],[0,N-1],[N-1,0],[N-1,N-1]];
  const isCorner = (r, c) => corners.some(([rr, cc]) => rr === r && cc === c);
  const isThrone = (r, c) => r === 4 && c === 4;

  function isEnemy(side, ch){
    if (ch === '.') return false;
    if (side === "def") return ch === 'A';
    return ch === 'D' || ch === 'K';
  }
  function isFriend(side, ch){
    if (ch === '.') return false;
    if (side === "def") return ch === 'D' || ch === 'K';
    return ch === 'A';
  }

  function legalMoves(b, side){
    const out = [];
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const v = b[r][c];
      if (side === "def" && !(v === 'D' || v === 'K')) continue;
      if (side === "att" && v !== 'A') continue;
      for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]){
        let nr = r + dr, nc = c + dc;
        while (nr >= 0 && nr < N && nc >= 0 && nc < N){
          if (b[nr][nc] !== '.') break;
          // throne is impassable except by king; corners restricted to king
          if (isThrone(nr, nc) && v !== 'K') { nr += dr; nc += dc; continue; }
          if (isCorner(nr, nc) && v !== 'K') { nr += dr; nc += dc; continue; }
          out.push({ from: [r, c], to: [nr, nc] });
          nr += dr; nc += dc;
        }
      }
    }
    return out;
  }

  function applyMove(b, mv, side){
    const [fr, fc] = mv.from, [tr, tc] = mv.to;
    const piece = b[fr][fc];
    b[tr][tc] = piece; b[fr][fc] = '.';
    // check captures around new position
    for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]){
      const er = tr + dr, ec = tc + dc;
      const fr2 = tr + 2*dr, fc2 = tc + 2*dc;
      if (er < 0 || er >= N || ec < 0 || ec >= N) continue;
      const e = b[er][ec];
      if (!isEnemy(side, e)) continue;
      // king capture special: must be surrounded on all 4 sides (or throne)
      if (e === 'K'){
        // king captured only when 4-sided
        let surrounded = true;
        for (const [ddr, ddc] of [[-1,0],[1,0],[0,-1],[0,1]]){
          const xr = er + ddr, xc = ec + ddc;
          if (xr < 0 || xr >= N || xc < 0 || xc >= N){ surrounded = false; break; }
          const v = b[xr][xc];
          if (v === 'A' || isThrone(xr, xc)) continue;
          surrounded = false; break;
        }
        if (surrounded){ b[er][ec] = '.'; }
        continue;
      }
      if (fr2 < 0 || fr2 >= N || fc2 < 0 || fc2 >= N) continue;
      const far = b[fr2][fc2];
      if (isFriend(side, far) || isThrone(fr2, fc2) || isCorner(fr2, fc2)){
        b[er][ec] = '.';
      }
    }
  }

  function kingPos(b){
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (b[r][c] === 'K') return [r, c];
    return null;
  }
  function kingMinCornerDist(b){
    const k = kingPos(b); if (!k) return 99;
    return Math.min(...corners.map(([cr, cc]) => Math.abs(k[0]-cr) + Math.abs(k[1]-cc)));
  }

  function aiMove(){
    if (winner) return;
    const moves = legalMoves(board, "att");
    if (!moves.length){ winner = "you"; draw(); return; }
    let best = moves[0], bestScore = -Infinity;
    for (const mv of moves){
      const snap = board.map(r => r.slice());
      applyMove(board, mv, "att");
      if (!kingPos(board)){ best = mv; bestScore = 1e9; board = snap; break; }
      // score: minus defender count, plus king distance (further from corner = better for AI)
      let s = 0;
      for (const row of board) for (const v of row){ if (v === 'D') s -= 5; if (v === 'A') s += 1; }
      s += kingMinCornerDist(board);
      board = snap;
      if (s > bestScore){ bestScore = s; best = mv; }
    }
    applyMove(board, best, "att");
    if (!kingPos(board)){ winner = "ai"; draw(); return; }
    if (!legalMoves(board, "def").length){ winner = "ai"; draw(); return; }
    turn = "you"; draw();
  }

  function cellRect(r, c){
    const margin = 14, cs = (size - 2*margin) / N;
    return { x: margin + c*cs, y: 30 + r*cs, w: cs, h: cs };
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "12px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const rc = cellRect(r, c);
      let bg = "#fff";
      if (isCorner(r, c)) bg = "#fff3c4";
      else if (isThrone(r, c)) bg = "#ffe0b0";
      ctx.fillStyle = bg; ctx.fillRect(rc.x, rc.y, rc.w, rc.h);
      ctx.strokeStyle = "#888"; ctx.strokeRect(rc.x, rc.y, rc.w, rc.h);
      const v = board[r][c]; if (v === '.') continue;
      ctx.beginPath(); ctx.arc(rc.x + rc.w/2, rc.y + rc.h/2, rc.w * 0.36, 0, Math.PI*2);
      ctx.fillStyle = v === 'A' ? "#e60" : v === 'D' ? "#39c" : "#1a7";
      if (sel && sel.r === r && sel.c === c) ctx.fillStyle = "#cef2cf";
      ctx.fill(); ctx.strokeStyle = "#222"; ctx.stroke();
      if (v === 'K'){ ctx.fillStyle = "#fff"; ctx.font = "bold 11px sans-serif"; ctx.fillText("K", rc.x + rc.w/2, rc.y + rc.h/2 + 4); ctx.font = "12px sans-serif"; }
    }
    if (winner) statusEl.textContent = winner === "you" ? "you (defender) win — king escaped!" : "AI (attacker) wins — king captured";
    else statusEl.textContent = turn === "you" ? (sel ? "click destination (rook movement)" : "click your blue/green piece") : "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }
  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e);
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const rc = cellRect(r, c);
      if (x < rc.x || x > rc.x + rc.w || y < rc.y || y > rc.y + rc.h) continue;
      if (sel){
        if (sel.r === r && sel.c === c){ sel = null; draw(); return; }
        const piece = board[sel.r][sel.c];
        if (board[r][c] === 'D' || board[r][c] === 'K'){ sel = { r, c }; draw(); return; }
        const moves = legalMoves(board, "def");
        const mv = moves.find(m => m.from[0] === sel.r && m.from[1] === sel.c && m.to[0] === r && m.to[1] === c);
        if (!mv){ sel = null; draw(); return; }
        applyMove(board, mv, "def");
        if (piece === 'K' && isCorner(r, c)){ winner = "you"; draw(); return; }
        if (!legalMoves(board, "att").length){ winner = "you"; draw(); return; }
        sel = null; turn = "ai"; draw(); setTimeout(aiMove, 350); return;
      } else {
        if (board[r][c] === 'D' || board[r][c] === 'K'){ sel = { r, c }; draw(); }
        return;
      }
    }
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve(){
      if (winner || turn !== "you") return;
      const __mvs = legalMoves(board, "def");
      if (!__mvs.length) { winner = "ai"; draw(); return; }
      const __mv = __mvs[Math.floor(Math.random() * __mvs.length)];
      const piece = board[__mv.from[0]][__mv.from[1]];
      applyMove(board, __mv, "def");
      if (piece === 'K' && isCorner(__mv.to[0], __mv.to[1])){ winner = "you"; draw(); return; }
      if (!kingPos(board)){ winner = "ai"; draw(); return; }
      sel = null; turn = "ai"; draw();
      setTimeout(aiMove, 80);
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
