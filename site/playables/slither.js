// Slither — square board connection game. Each turn either PLACE a new stone
// or SLIDE an existing one orthogonally — but the resulting position cannot
// have two same-colour stones diagonally adjacent without an orthogonal
// connector. First to connect their two opposite sides wins. Tractable: 6×6.
// AI: heuristic — shortest-path style.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  function _fit(ctx, t, x, y, maxW){
    let f = parseFloat(ctx.font) || 12;
    while (f > 8 && ctx.measureText(t).width > maxW){ f--; ctx.font = ctx.font.replace(/[\d.]+px/, f + 'px'); }
    ctx.fillText(t, x, y);
  }

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = size + 40;
  const W = canvas.width, H = canvas.height;
  const statusEl = document.getElementById("playable-status");

  const N = 6;
  // you (B) connects TOP↔BOTTOM. ai (W) connects LEFT↔RIGHT.
  let board, turn, winner, mode, slideFrom;
  function newGame(){
    board = Array.from({ length: N }, () => new Array(N).fill('.'));
    turn = "you"; winner = null; mode = "place"; slideFrom = null;
  }
  newGame();

  function legalAfter(b, r, c, ch){
    // check no same-colour diagonals without orthogonal connector
    for (const [dr, dc] of [[-1,-1],[-1,1],[1,-1],[1,1]]){
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nr >= N || nc < 0 || nc >= N) continue;
      if (b[nr][nc] !== ch) continue;
      // need orthogonal connector at (r,nc) or (nr,c) being same colour
      if (b[r][nc] === ch || b[nr][c] === ch) continue;
      return false;
    }
    return true;
  }
  function placeIsLegal(b, r, c, ch){
    if (b[r][c] !== '.') return false;
    b[r][c] = ch;
    let ok = legalAfter(b, r, c, ch);
    if (ok){
      // also check neighbours' diagonal constraint isn't violated globally
      for (let dr = -1; dr <= 1 && ok; dr++) for (let dc = -1; dc <= 1 && ok; dc++){
        if (dr === 0 && dc === 0) continue;
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nr >= N || nc < 0 || nc >= N) continue;
        if (b[nr][nc] === ch && !legalAfter(b, nr, nc, ch)) ok = false;
      }
    }
    b[r][c] = '.';
    return ok;
  }

  function checkConnect(b, ch, mode){
    // mode 'V': top to bottom. 'H': left to right.
    const seen = Array.from({ length: N }, () => new Array(N).fill(false));
    const stack = [];
    if (mode === 'V'){
      for (let c = 0; c < N; c++) if (b[0][c] === ch){ stack.push([0, c]); seen[0][c] = true; }
    } else {
      for (let r = 0; r < N; r++) if (b[r][0] === ch){ stack.push([r, 0]); seen[r][0] = true; }
    }
    while (stack.length){
      const [r, c] = stack.pop();
      if (mode === 'V' && r === N - 1) return true;
      if (mode === 'H' && c === N - 1) return true;
      for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]){
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nr >= N || nc < 0 || nc >= N) continue;
        if (!seen[nr][nc] && b[nr][nc] === ch){ seen[nr][nc] = true; stack.push([nr, nc]); }
      }
    }
    return false;
  }

  function aiMove(){
    if (winner) return;
    let best = null, bestScore = -Infinity;
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      if (!placeIsLegal(board, r, c, 'W')) continue;
      board[r][c] = 'W';
      const won = checkConnect(board, 'W', 'H');
      let score = 0;
      if (won) score = 1e9;
      else {
        // bonus for col reach
        let s = c;
        for (let rr = 0; rr < N; rr++) for (let cc = 0; cc < N; cc++) if (board[rr][cc] === 'W') s = Math.max(s, cc);
        score = s;
      }
      board[r][c] = '.';
      if (score > bestScore){ bestScore = score; best = [r, c]; }
    }
    if (!best){ winner = "draw"; draw(); return; }
    board[best[0]][best[1]] = 'W';
    if (checkConnect(board, 'W', 'H')){ winner = "ai"; draw(); return; }
    turn = "you"; draw();
  }

  function cellRect(r, c){
    const margin = 20, cs = (size - 2*margin) / N;
    return { x: margin + c*cs, y: 30 + r*cs, w: cs, h: cs };
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "12px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";
    _fit(ctx, "Slither — connect TOP↔BOTTOM (you); no same-colour diagonals w/o orth. connector", W/2, 18, W - 8);

    // tinted edge
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const rc = cellRect(r, c);
      let bg = "#fff";
      if (r === 0 || r === N-1) bg = "#e0f0ff";
      else if (c === 0 || c === N-1) bg = "#ffe0e0";
      ctx.fillStyle = bg; ctx.fillRect(rc.x, rc.y, rc.w, rc.h);
      ctx.strokeStyle = "#888"; ctx.strokeRect(rc.x, rc.y, rc.w, rc.h);
      const v = board[r][c]; if (v === '.') continue;
      ctx.beginPath(); ctx.arc(rc.x + rc.w/2, rc.y + rc.h/2, rc.w * 0.36, 0, Math.PI*2);
      ctx.fillStyle = v === 'B' ? "#39c" : "#e60"; if (slideFrom && slideFrom.r === r && slideFrom.c === c) ctx.fillStyle = "#cef2cf";
      ctx.fill(); ctx.strokeStyle = "#222"; ctx.stroke();
    }
    // mode buttons
    ctx.fillStyle = mode === "place" ? "#cef2cf" : "#fff"; ctx.fillRect(20, H - 30, 80, 22); ctx.strokeStyle = "#222"; ctx.strokeRect(20, H - 30, 80, 22);
    ctx.fillStyle = "#222"; ctx.textAlign = "center"; ctx.fillText("PLACE", 60, H - 14);
    ctx.fillStyle = mode === "slide" ? "#cef2cf" : "#fff"; ctx.fillRect(110, H - 30, 80, 22); ctx.strokeRect(110, H - 30, 80, 22);
    ctx.fillStyle = "#222"; ctx.fillText("SLIDE", 150, H - 14);

    if (winner) statusEl.textContent = winner === "draw" ? "draw" : winner === "you" ? "you win!" : "AI wins";
    else statusEl.textContent = turn === "you" ? `[${mode}] ${mode === "place" ? "click empty cell" : (slideFrom ? "click adjacent empty cell" : "click your stone to slide")}` : "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }

  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e);
    if (y >= H - 30 && y <= H - 8){
      if (x >= 20 && x <= 100){ mode = "place"; slideFrom = null; draw(); return; }
      if (x >= 110 && x <= 190){ mode = "slide"; slideFrom = null; draw(); return; }
    }
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const rc = cellRect(r, c);
      if (x < rc.x || x > rc.x + rc.w || y < rc.y || y > rc.y + rc.h) continue;
      if (mode === "place"){
        if (!placeIsLegal(board, r, c, 'B')) return;
        board[r][c] = 'B';
        if (checkConnect(board, 'B', 'V')){ winner = "you"; draw(); return; }
        turn = "ai"; draw(); setTimeout(aiMove, 350); return;
      }
      if (!slideFrom){
        if (board[r][c] === 'B') slideFrom = { r, c };
        draw(); return;
      } else {
        if (slideFrom.r === r && slideFrom.c === c){ slideFrom = null; draw(); return; }
        const dr = r - slideFrom.r, dc = c - slideFrom.c;
        if (Math.abs(dr) + Math.abs(dc) !== 1 || board[r][c] !== '.') return;
        board[slideFrom.r][slideFrom.c] = '.';
        if (!placeIsLegal(board, r, c, 'B')){ board[slideFrom.r][slideFrom.c] = 'B'; return; }
        board[r][c] = 'B'; slideFrom = null;
        if (checkConnect(board, 'B', 'V')){ winner = "you"; draw(); return; }
        turn = "ai"; draw(); setTimeout(aiMove, 350); return;
      }
    }
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve(){
      if (winner || turn !== "you") return;
      const __mvs = [];
      for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
        if (placeIsLegal(board, r, c, 'B')) __mvs.push([r, c]);
      }
      if (!__mvs.length) { winner = "draw"; draw(); return; }
      const [r, c] = __mvs[Math.floor(Math.random() * __mvs.length)];
      board[r][c] = 'B'; mode = "place"; slideFrom = null;
      if (checkConnect(board, 'B', 'V')){ winner = "you"; draw(); return; }
      turn = "ai"; draw();
      setTimeout(aiMove, 80);
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
