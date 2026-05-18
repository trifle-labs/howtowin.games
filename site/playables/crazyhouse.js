// Crazyhouse — standard chess + drops. Capture a piece and drop it later.
// AI: depth-1 material search with drops.
export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 400);
  const EXTRA = 50;
  canvas.width = size; canvas.height = size + EXTRA + 30;
  const W = canvas.width, H = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) { canvas.style.width = W + 'px'; canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr); }
  const statusEl = document.getElementById("playable-status");
  const N = 8;
  let board, turn, winner, sel, selHand, hand;
  function newGame() {
    board = [
      ['r','n','b','q','k','b','n','r'],
      ['p','p','p','p','p','p','p','p'],
      ['.','.','.','.','.','.','.','.'],
      ['.','.','.','.','.','.','.','.'],
      ['.','.','.','.','.','.','.','.'],
      ['.','.','.','.','.','.','.','.'],
      ['P','P','P','P','P','P','P','P'],
      ['R','N','B','Q','K','B','N','R'],
    ];
    // Uppercase = you (bottom), lowercase = AI (top)
    turn = "you"; winner = null; sel = null; selHand = null;
    hand = { you: [], ai: [] };
  }
  newGame();

  const isYou = (p) => p !== '.' && p === p.toUpperCase();
  const isAI = (p) => p !== '.' && p === p.toLowerCase();
  const VAL = { p:1, n:3, b:3, r:5, q:9, k:100 };

  function genMovesFor(b, r, c) {
    const p = b[r][c]; if (p === '.') return [];
    const out = [];
    const mine = isYou(p) ? isYou : isAI;
    const en = isYou(p) ? isAI : isYou;
    const add = (nr, nc) => {
      if (nr < 0 || nr >= N || nc < 0 || nc >= N) return false;
      if (mine(b[nr][nc])) return false;
      out.push({ from: [r, c], to: [nr, nc], cap: en(b[nr][nc]) });
      return b[nr][nc] === '.';
    };
    const ray = (dr, dc) => {
      let nr = r + dr, nc = c + dc;
      while (nr >= 0 && nr < N && nc >= 0 && nc < N) {
        if (mine(b[nr][nc])) return;
        out.push({ from: [r, c], to: [nr, nc], cap: en(b[nr][nc]) });
        if (b[nr][nc] !== '.') return;
        nr += dr; nc += dc;
      }
    };
    const t = p.toLowerCase();
    if (t === 'p') {
      const dir = isYou(p) ? -1 : 1;
      const startRow = isYou(p) ? 6 : 1;
      if (r + dir >= 0 && r + dir < N && b[r + dir][c] === '.') {
        out.push({ from: [r, c], to: [r + dir, c] });
        if (r === startRow && b[r + 2 * dir][c] === '.')
          out.push({ from: [r, c], to: [r + 2 * dir, c] });
      }
      for (const dc of [-1, 1]) {
        const nr = r + dir, nc = c + dc;
        if (nr >= 0 && nr < N && nc >= 0 && nc < N && en(b[nr][nc]))
          out.push({ from: [r, c], to: [nr, nc], cap: true });
      }
    } else if (t === 'n') {
      for (const [dr, dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]) add(r + dr, c + dc);
    } else if (t === 'b') {
      for (const [dr, dc] of [[-1,-1],[-1,1],[1,-1],[1,1]]) ray(dr, dc);
    } else if (t === 'r') {
      for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]) ray(dr, dc);
    } else if (t === 'q') {
      for (const [dr, dc] of [[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]]) ray(dr, dc);
    } else if (t === 'k') {
      for (const [dr, dc] of [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]) add(r + dr, c + dc);
    }
    return out;
  }

  function genMoves(b, side) {
    const out = [];
    const isM = side === 'y' ? isYou : isAI;
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
      const p = b[r][c]; if (p === '.') continue;
      if (isM(p)) out.push(...genMovesFor(b, r, c));
    }
    // Drops from hand
    const hk = side === 'y' ? 'you' : 'ai';
    for (const pt of hand[hk]) {
      const t = side === 'y' ? pt.toUpperCase() : pt.toLowerCase();
      for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
        if (b[r][c] !== '.') continue;
        if (pt === 'p' || pt === 'P') {
          if (side === 'y' ? r === 0 : r === N - 1) continue; // no pawn on 1st/8th
        }
        out.push({ from: [-1, -1], to: [r, c], drop: t });
      }
    }
    return out;
  }

  function apply(b, m, h) {
    const nb = b.map(row => row.slice());
    const nh = { you: [...h.you], ai: [...h.ai] };
    if (m.drop) {
      nb[m.to[0]][m.to[1]] = m.drop;
      const side = isAI(m.drop) ? 'ai' : 'you';
      const idx = nh[side].indexOf(m.drop.toLowerCase());
      if (idx >= 0) nh[side].splice(idx, 1);
      return { board: nb, hand: nh };
    }
    const cap = nb[m.to[0]][m.to[1]];
    nb[m.to[0]][m.to[1]] = nb[m.from[0]][m.from[1]];
    nb[m.from[0]][m.from[1]] = '.';
    // Pawn promotion
    const pt = nb[m.to[0]][m.to[1]];
    if (pt.toLowerCase() === 'p' && (m.to[0] === 0 || m.to[0] === N - 1)) {
      nb[m.to[0]][m.to[1]] = isYou(pt) ? 'Q' : 'q';
    }
    // Capture goes to hand
    if (cap !== '.') {
      const base = cap.toLowerCase(); // captured piece reverts to base
      const capSide = isYou(cap) ? 'ai' : 'you'; // capturer gets it
      nh[capSide].push(base);
    }
    return { board: nb, hand: nh };
  }

  function findKing(b, side) {
    const k = side === 'y' ? 'K' : 'k';
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (b[r][c] === k) return [r, c];
    return null;
  }

  function aiMove() {
    if (winner) return;
    const moves = genMoves(board, 'a');
    if (!moves.length) { winner = "you"; draw(); return; }
    let best = null, bestScore = -Infinity;
    for (const m of moves) {
      const res = apply(board, m, hand);
      let score = 0;
      for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
        const v = res.board[r][c];
        if (v === '.') continue;
        score += isAI(v) ? VAL[v.toLowerCase()] : -VAL[v.toLowerCase()];
      }
      score += (res.hand.ai.length * 3 - res.hand.you.length * 3); // hand value
      score += Math.random() * 0.1;
      if (score > bestScore) { bestScore = score; best = m; }
    }
    const res = apply(board, best, hand);
    board = res.board; hand = res.hand;
    if (!findKing(board, 'y')) { winner = "ai"; draw(); return; }
    turn = "you"; draw();
  }

  // ── Drawing ──
  const GLYPH = {
    K:'♔', Q:'♕', R:'♖', B:'♗', N:'♘', P:'♙',
    k:'♚', q:'♛', r:'♜', b:'♝', n:'♞', p:'♟'
  };

  function draw() {
    const cell = size / N;
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "11px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";

    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
      const x = c * cell, y = 28 + r * cell;
      ctx.fillStyle = (r + c) % 2 === 0 ? "#f0d9b5" : "#b58863";
      ctx.fillRect(x, y, cell, cell);
      if (sel && sel.r === r && sel.c === c) {
        ctx.fillStyle = "rgba(120,220,120,0.4)"; ctx.fillRect(x, y, cell, cell);
      }
      const p = board[r][c];
      if (p !== '.') {
        const g = GLYPH[p];
        ctx.font = `${cell * 0.6}px serif`;
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillStyle = isYou(p) ? "#222" : "#fff";
        ctx.strokeStyle = isYou(p) ? "#fff" : "#000";
        ctx.lineWidth = 1.5;
        ctx.strokeText(g, x + cell / 2, y + cell / 2 + 1);
        ctx.fillText(g, x + cell / 2, y + cell / 2 + 1);
      }
    }
    ctx.textBaseline = "alphabetic";

    // Hand area
    const hY = size + 34;
    ctx.font = "11px sans-serif"; ctx.fillStyle = "#666"; ctx.textAlign = "left";
    ctx.fillText("your hand:", 8, hY + 14);
    ctx.font = "bold 14px sans-serif";
    let hx = 78, hy = hY;
    for (const pt of hand.you) {
      ctx.fillStyle = "#222";
      ctx.fillText(pt.toUpperCase(), hx, hy + 18);
      hx += 20;
    }
    if (selHand) {
      ctx.strokeStyle = "#4a4"; ctx.lineWidth = 2;
      ctx.strokeRect(76, hY - 2, 22, 24);
    }

    if (winner) statusEl.textContent = winner === "you" ? "You win!" : "AI wins!";
    else statusEl.textContent = turn === "you" ? (sel || selHand ? "click destination or drop square" : "click your piece or hand") : "AI thinking…";
  }

  function pos(e) {
    const r = canvas.getBoundingClientRect();
    return { x: (e.clientX - r.left) * (W / r.width), y: (e.clientY - r.top) * (H / r.height) };
  }

  function onClick(e) {
    if (winner || turn !== "you") return;
    const { x, y } = pos(e);
    const hY = size + 34;

    // Hand area click
    if (y >= hY - 5 && y <= hY + 25) {
      let hx = 78;
      for (let i = 0; i < hand.you.length; i++) {
        if (x >= hx - 10 && x < hx + 10) {
          selHand = selHand && sel === 'you' ? null : 'you';
          sel = selHand ? [-1, i] : null;
          draw(); return;
        }
        hx += 20;
      }
      selHand = null; sel = null; draw(); return;
    }

    const c = Math.floor(x / (size / N));
    const r = Math.floor((y - 28) / (size / N));
    if (r < 0 || r >= N || c < 0 || c >= N) { sel = null; selHand = null; draw(); return; }
    const moves = genMoves(board, 'y');

    if (sel) {
      if (sel[0] === -1 && selHand) {
        // Drop from hand
        const idx = sel[1];
        if (idx >= hand.you.length) { sel = null; selHand = null; draw(); return; }
        const pt = hand.you[idx].toUpperCase();
        const valid = moves.some(m => m.drop && m.to[0] === r && m.to[1] === c && m.drop === pt);
        if (valid) {
          const res = apply(board, { from: [-1, -1], to: [r, c], drop: pt }, hand);
          board = res.board; hand = res.hand; sel = null; selHand = null;
          if (!findKing(board, 'a')) { winner = "you"; draw(); return; }
          turn = "ai"; draw(); setTimeout(aiMove, 300);
          return;
        }
        sel = null; selHand = null; draw(); return;
      }
      if (sel[0] === r && sel[1] === c) { sel = null; draw(); return; }
      if (isYou(board[r][c])) { sel = { r, c }; selHand = null; draw(); return; }
      const m = moves.find(mv => !mv.drop && mv.from[0] === sel.r && mv.from[1] === sel.c && mv.to[0] === r && mv.to[1] === c);
      if (!m) { sel = null; draw(); return; }
      const res = apply(board, m, hand);
      board = res.board; hand = res.hand; sel = null;
      if (!findKing(board, 'a')) { winner = "you"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 300);
    } else {
      if (isYou(board[r][c])) { sel = { r, c }; selHand = null; draw(); }
    }
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve(){
      if (winner || turn !== "you") return;
      const __mvs = genMoves(board, 'y');
      if (!__mvs.length) { winner = "ai"; draw(); return; }
      const __mv = __mvs[Math.floor(Math.random() * __mvs.length)];
      const __res = apply(board, __mv, hand); board = __res.board; hand = __res.hand;
      if (!findKing(board, 'a')) { winner = "you"; draw(); return; }
      turn = "ai"; draw();
      setTimeout(aiMove, 80);
    },

    destroy() { canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart() { newGame(); draw(); },
  };
}
