// Brandubh — 7×7 tafl variant. Asymmetric: you defend the king (centre); AI is
// the attackers (8 pieces around the edges). King escapes to any corner to win
// (you); attackers win by capturing king (custodial: pinned between 2 enemies
// orthogonally, OR with the throne/corner counting as a hostile square).

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = size + 30;
  const W = canvas.width, H = canvas.height;
  const statusEl = document.getElementById("playable-status");

  const N = 7;
  // '.', 'd' (defender), 'k' (king), 'a' (attacker)
  let board, turn, winner, sel;
  function newGame(){
    board = new Array(N*N).fill('.');
    const init = [
      "...a...",
      "...a...",
      "...d...",
      "aadKdaa",
      "...d...",
      "...a...",
      "...a...",
    ];
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const ch = init[r][c];
      if (ch === 'K') board[r*N + c] = 'k';
      else if (ch === 'a') board[r*N + c] = 'a';
      else if (ch === 'd') board[r*N + c] = 'd';
    }
    turn = "you"; winner = null; sel = -1;
  }
  newGame();

  const CORNERS = [0, N-1, (N-1)*N, N*N-1];
  const THRONE = Math.floor(N/2)*N + Math.floor(N/2);

  function isHostile(idx, side){
    // empty corners/throne are hostile to both. Otherwise piece must be enemy.
    if (idx < 0 || idx >= N*N) return false;
    const v = board[idx];
    if (CORNERS.includes(idx) || idx === THRONE){
      if (v === '.') return true;
    }
    if (side === 'def'){ return v === 'a'; }
    if (side === 'att'){ return v === 'd' || v === 'k'; }
    return false;
  }

  function legalMovesFor(idx){
    const out = [];
    const r = Math.floor(idx / N), c = idx % N;
    for (const [dr, dc] of [[1,0],[-1,0],[0,1],[0,-1]]){
      let nr = r + dr, nc = c + dc;
      while (nr >= 0 && nr < N && nc >= 0 && nc < N){
        const j = nr*N + nc;
        if (board[j] !== '.') break;
        // only king may stop on throne or corners
        if ((j === THRONE || CORNERS.includes(j)) && board[idx] !== 'k'){ nr += dr; nc += dc; continue; }
        out.push(j);
        nr += dr; nc += dc;
      }
    }
    return out;
  }

  function applyCaptures(movedIdx){
    const r = Math.floor(movedIdx / N), c = movedIdx % N;
    const movedPiece = board[movedIdx];
    const isAtt = movedPiece === 'a';
    const isDef = movedPiece === 'd' || movedPiece === 'k';
    for (const [dr, dc] of [[1,0],[-1,0],[0,1],[0,-1]]){
      const adj = (r+dr)*N + (c+dc);
      if (adj < 0 || adj >= N*N) continue;
      if (Math.abs(((r+dr) - r) + ((c+dc) - c)) > 1 && false) continue;
      const v = board[adj]; if (v === '.') continue;
      if (isAtt && (v === 'd')){
        const beyond = (r+2*dr)*N + (c+2*dc);
        if (isHostile(beyond, 'att')) board[adj] = '.';
      } else if (isDef && v === 'a'){
        const beyond = (r+2*dr)*N + (c+2*dc);
        if (isHostile(beyond, 'def')) board[adj] = '.';
      }
    }
    // King capture: only at center (THRONE) requires 4 surrounding; elsewhere 2
    let kingIdx = -1; for (let i = 0; i < N*N; i++) if (board[i] === 'k') kingIdx = i;
    if (kingIdx >= 0){
      const kr = Math.floor(kingIdx / N), kc = kingIdx % N;
      const enemies = [[1,0],[-1,0],[0,1],[0,-1]].map(([dr, dc]) => {
        const j = (kr+dr)*N + (kc+dc);
        if (kr+dr < 0 || kr+dr >= N || kc+dc < 0 || kc+dc >= N) return 'edge';
        return board[j];
      });
      if (kingIdx === THRONE){
        if (enemies.every(e => e === 'a')) board[kingIdx] = '.';
      } else {
        // need 2 opposite attackers or attacker+throne/corner
        for (let k = 0; k < 2; k++){
          const dir1 = k === 0 ? [1,0] : [0,1];
          const dir2 = k === 0 ? [-1,0] : [0,-1];
          const j1 = (kr+dir1[0])*N + (kc+dir1[1]); const j2 = (kr+dir2[0])*N + (kc+dir2[1]);
          const r1 = kr+dir1[0], c1 = kc+dir1[1], r2 = kr+dir2[0], c2 = kc+dir2[1];
          const v1 = (r1<0||r1>=N||c1<0||c1>=N) ? null : (board[j1] === 'a' || j1 === THRONE || CORNERS.includes(j1) ? 'h' : null);
          const v2 = (r2<0||r2>=N||c2<0||c2>=N) ? null : (board[j2] === 'a' || j2 === THRONE || CORNERS.includes(j2) ? 'h' : null);
          if (v1 === 'h' && v2 === 'h'){ board[kingIdx] = '.'; break; }
        }
      }
    }
  }

  function findKing(){ for (let i = 0; i < N*N; i++) if (board[i] === 'k') return i; return -1; }

  function aiMove(){
    if (winner) return;
    // collect attacker pieces and pick any move that captures, else move toward king
    const att = []; for (let i = 0; i < N*N; i++) if (board[i] === 'a') att.push(i);
    const kingIdx = findKing(); if (kingIdx < 0){ winner = "ai"; draw(); return; }
    const kr = Math.floor(kingIdx / N), kc = kingIdx % N;
    let best = null, bestScore = -Infinity;
    for (const i of att){
      for (const j of legalMovesFor(i)){
        // simulate
        board[j] = 'a'; board[i] = '.';
        const savedKing = board[kingIdx];
        applyCaptures(j);
        const newKing = findKing();
        let score = 0;
        if (newKing < 0) score = 1e6;
        else {
          const nr = Math.floor(newKing/N), nc = newKing%N;
          score = -(Math.abs(nr - 3) + Math.abs(nc - 3)) * 0.1 - (Math.abs(nr - 0) + Math.abs(nc - 0));
          // also bonus for any captures (estimate: count current attackers? simpler: just king distance)
        }
        if (score > bestScore){ bestScore = score; best = [i, j]; }
        // revert
        newGame.savedState = null; // dummy
        // restore manually: rebuild from snapshot? Simpler approach: re-run with snapshot.
        // For brevity, restart with full reset using a snapshot saved beforehand.
        // (See below: we snapshot at top.)
        snapshot.restore();
      }
    }
    snapshot.commit(best);
  }

  // Snapshot helper to avoid copying logic
  const snapshot = (() => {
    let saved = null;
    return {
      take(){ saved = board.slice(); },
      restore(){ if (saved) for (let i = 0; i < board.length; i++) board[i] = saved[i]; },
      commit(move){
        if (!saved){ return; }
        if (!move){
          for (let i = 0; i < board.length; i++) board[i] = saved[i];
          winner = "you"; draw(); return;
        }
        // re-take from saved, then apply move properly
        for (let i = 0; i < board.length; i++) board[i] = saved[i];
        const [from, to] = move;
        board[to] = 'a'; board[from] = '.'; applyCaptures(to);
        if (findKing() < 0){ winner = "ai"; draw(); return; }
        if (CORNERS.includes(findKing())){ winner = "you"; draw(); return; }
        turn = "you"; draw();
      },
    };
  })();

  function aiTurn(){
    if (winner) return;
    snapshot.take();
    aiMove();
  }

  function cellRect(r, c){
    const margin = 14, cs = (size - 2*margin) / N;
    return { x: margin + c*cs, y: 20 + r*cs, w: cs, h: cs };
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "13px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";

    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const rc = cellRect(r, c);
      const i = r*N + c;
      const isCorner = CORNERS.includes(i), isThrone = i === THRONE;
      ctx.fillStyle = isCorner ? "#f4cfb4" : isThrone ? "#fce8c5" : "#fff";
      ctx.fillRect(rc.x, rc.y, rc.w, rc.h);
      ctx.strokeStyle = i === sel ? "#0a0" : "#888"; ctx.lineWidth = i === sel ? 3 : 1;
      ctx.strokeRect(rc.x, rc.y, rc.w, rc.h); ctx.lineWidth = 1;
      const v = board[i]; if (v === '.') continue;
      ctx.beginPath(); ctx.arc(rc.x + rc.w/2, rc.y + rc.h/2, rc.w*0.32, 0, Math.PI*2);
      ctx.fillStyle = v === 'a' ? "#e60" : v === 'd' ? "#39c" : "#fff";
      ctx.fill();
      ctx.strokeStyle = "#222"; ctx.stroke();
      if (v === 'k'){ ctx.fillStyle = "#c22"; ctx.font = "16px sans-serif"; ctx.textBaseline = "middle"; ctx.fillText("K", rc.x + rc.w/2, rc.y + rc.h/2); ctx.textBaseline = "alphabetic"; }
    }

    if (winner) statusEl.textContent = winner === "you" ? "king escaped — you win!" : "king captured — AI wins";
    else statusEl.textContent = turn === "you" ? (sel < 0 ? "click your blue defender or the king" : "click destination") : "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }
  function findCell(x, y){
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
      const rc = cellRect(r, c);
      if (x >= rc.x && x <= rc.x + rc.w && y >= rc.y && y <= rc.y + rc.h) return r*N + c;
    }
    return -1;
  }

  function onClick(e){
    if (winner || turn !== "you") return;
    const { x, y } = pos(e); const i = findCell(x, y); if (i < 0) return;
    if (sel < 0){ if (board[i] === 'd' || board[i] === 'k'){ sel = i; draw(); } return; }
    if (i === sel){ sel = -1; draw(); return; }
    const moves = legalMovesFor(sel);
    if (!moves.includes(i)){ sel = -1; draw(); return; }
    const piece = board[sel];
    board[i] = piece; board[sel] = '.';
    applyCaptures(i);
    sel = -1;
    const k = findKing();
    if (k < 0){ winner = "ai"; draw(); return; }
    if (CORNERS.includes(k)){ winner = "you"; draw(); return; }
    turn = "ai"; draw(); setTimeout(aiTurn, 400);
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve() {
      if (winner || turn !== "you") return;
      // Collect all legal moves for defenders and king
      const __mvs = [];
      for (let i = 0; i < N*N; i++) {
        if (board[i] !== 'd' && board[i] !== 'k') continue;
        for (const j of legalMovesFor(i)) __mvs.push([i, j]);
      }
      if (!__mvs.length) { winner = "ai"; draw(); return; }
      const [__from, __to] = __mvs[Math.floor(Math.random() * __mvs.length)];
      const __piece = board[__from];
      board[__to] = __piece; board[__from] = '.';
      applyCaptures(__to);
      sel = -1;
      const __k = findKing();
      if (__k < 0) { winner = "ai"; draw(); return; }
      if (CORNERS.includes(__k)) { winner = "you"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiTurn, 80);
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
