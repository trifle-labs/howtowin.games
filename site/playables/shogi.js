// Shogi — 9×9 board, drops, promotion. Capture the king to win.
// AI: depth-1 material + drops.

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 360);
  const HAND = 80;
  canvas.width = size;
  canvas.height = size + HAND + 40;
  const W = canvas.width, H = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) { canvas.style.width = W + 'px'; canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr); }
  const statusEl = document.getElementById("playable-status");
  const COLS = 9, ROWS = 9;
  // you = uppercase (black, bottom, sente). AI = lowercase (white, top, gote).
  let board, turn, winner, sel, selHand, hand;
  function newGame() {
    board = Array.from({ length: ROWS }, () => new Array(COLS).fill('.'));
    // AI top: lowercase
    board[0] = ['l','n','s','g','k','g','s','n','l'];
    board[1] = ['.','b','.','.','.','.','.','r','.'];
    for (let c = 0; c < COLS; c++) board[2][c] = 'p';
    // You bottom: uppercase
    for (let c = 0; c < COLS; c++) board[6][c] = 'P';
    board[7] = ['.','B','.','.','.','.','.','R','.'];
    board[8] = ['L','N','S','G','K','G','S','N','L'];
    turn = "you"; winner = null; sel = null; selHand = null;
    hand = { you: [], ai: [] };
  }
  newGame();

  const isYou = (p) => p !== '.' && p === p.toUpperCase();
  const isAI = (p) => p !== '.' && p === p.toLowerCase();

  // Piece values
  const VAL = { p:1, l:3, n:4, s:5, g:5, b:9, r:10, k:1000, d:12, h:11, t:5, m:5, a:5 };
  const BASE = { p:'p', l:'l', n:'n', s:'s', g:'g', b:'b', r:'r', k:'k',
                  d:'r', h:'b', t:'p', m:'n', a:'l' };

  // Move generation for a single piece
  function movesFor(b, r, c, side) {
    const p = b[r][c];
    const own = (v) => side === 'y' ? isYou(v) : isAI(v);
    const en = (v) => v !== '.' && !own(v);
    const out = [];
    const add = (nr, nc) => {
      if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) return;
      if (own(b[nr][nc])) return;
      out.push({ from: [r, c], to: [nr, nc], cap: en(b[nr][nc]) });
    };
    const ray = (dr, dc) => {
      let nr = r + dr, nc = c + dc;
      while (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
        if (own(b[nr][nc])) return;
        out.push({ from: [r, c], to: [nr, nc], cap: en(b[nr][nc]) });
        if (b[nr][nc] !== '.') return;
        nr += dr; nc += dc;
      }
    };
    const step = (drs) => { for (const [dr, dc] of drs) add(r + dr, c + dc); };
    const t = p.toLowerCase();
    if (t === 'k') step([[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]);
    else if (t === 'g' || t === 't' || t === 'm' || t === 'a') {
      // Gold: 6 directions (not diagonals backward)
      step([[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,0]]);
    } else if (t === 's') {
      step([[-1,-1],[-1,0],[-1,1],[1,-1],[1,1]]);
    } else if (t === 'n') {
      // Knight jumps forward only
      const dir = side === 'y' ? -1 : 1;
      add(r + 2 * dir, c - 1); add(r + 2 * dir, c + 1);
    } else if (t === 'l') {
      const dir = side === 'y' ? -1 : 1;
      ray(dir, 0);
    } else if (t === 'b') {
      for (const [dr, dc] of [[-1,-1],[-1,1],[1,-1],[1,1]]) ray(dr, dc);
    } else if (t === 'h') {
      // Dragon horse: bishop moves + king moves
      for (const [dr, dc] of [[-1,-1],[-1,1],[1,-1],[1,1]]) ray(dr, dc);
      step([[-1,0],[1,0],[0,-1],[0,1]]);
    } else if (t === 'r') {
      for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]) ray(dr, dc);
    } else if (t === 'd') {
      // Dragon king: rook moves + king moves
      for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]) ray(dr, dc);
      step([[-1,-1],[-1,1],[1,-1],[1,1]]);
    } else if (t === 'p') {
      const dir = side === 'y' ? -1 : 1;
      add(r + dir, c);
    }
    return out;
  }

  // Generate all moves for a side (including drops)
  function genMoves(b, side) {
    const out = [];
    const isM = side === 'y' ? isYou : isAI;
    const isO = side === 'y' ? isAI : isYou;
    // Board pieces
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      const p = b[r][c]; if (p === '.') continue;
      if (isM(p)) out.push(...movesFor(b, r, c, side));
    }
    // Drops
    const hk = side === 'y' ? 'you' : 'ai';
    for (const pt of hand[hk]) {
      const t = side === 'y' ? pt.toUpperCase() : pt.toLowerCase();
      for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
        if (b[r][c] !== '.') continue;
        // Cannot drop pawn on same file as another unpromoted pawn
        if (pt === 'p' || pt === 'P') {
          let sameFile = false;
          for (let rr = 0; rr < ROWS; rr++) if (b[rr][c] !== '.' && b[rr][c].toLowerCase() === 'p' && isM(b[rr][c])) { sameFile = true; break; }
          if (sameFile) continue;
          // Drop pawn cannot give immediate checkmate (simplified: skip)
        }
        // Knight/Lance restrictions on last rows
        if (pt === 'n' || pt === 'N') {
          if (side === 'y' ? r < 1 : r > ROWS - 2) continue;
        }
        if (pt === 'l' || pt === 'L') {
          if (side === 'y' ? r < 0 : r > ROWS - 1) continue; // always in playable range
          if (side === 'y' ? r === 0 : r === ROWS - 1) continue;
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
      const side = m.drop === m.drop.toUpperCase() ? 'you' : 'ai';
      const idx = nh[side].indexOf(m.drop === m.drop.toUpperCase() ? m.drop : m.drop.toLowerCase());
      if (idx >= 0) nh[side].splice(idx, 1);
      return { board: nb, hand: nh };
    }
    const p = nb[m.from[0]][m.from[1]];
    const cap = nb[m.to[0]][m.to[1]];
    nb[m.to[0]][m.to[1]] = p;
    nb[m.from[0]][m.from[1]] = '.';
    // Capture
    if (cap !== '.') {
      const base = BASE[cap.toLowerCase()] || cap.toLowerCase();
      const capSide = isYou(cap) ? 'you' : 'ai';
      nh[capSide].push(base);
    }
    // Promotion zone: rows 0-2 (AI) or 6-8 (you)
    const srcSide = isYou(p) ? 'y' : 'a';
    const promoZone = srcSide === 'y' ? [6,7,8] : [0,1,2];
    if (promoZone.includes(m.to[0]) || promoZone.includes(m.from[0])) {
      const t = p.toLowerCase();
      if (t === 'r' || t === 'b' || t === 's' || t === 'n' || t === 'l' || t === 'p') {
        const promo = { r: 'd', b: 'h', s: 'g', n: 'g', l: 'g', p: 't' };
        nb[m.to[0]][m.to[1]] = isYou(p) ? promo[t].toUpperCase() : promo[t];
      }
    }
    return { board: nb, hand: nh };
  }

  function findKing(b, side) {
    const k = side === 'y' ? 'K' : 'k';
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) if (b[r][c] === k) return [r, c];
    return null;
  }

  function aiMove() {
    if (winner) return;
    const moves = genMoves(board, 'a');
    if (!moves.length) { winner = "you"; draw(); return; }
    let best = null, bestScore = -Infinity;
    for (const m of moves) {
      const res = apply(board, m, hand);
      const b2 = res.board, h2 = res.hand;
      let score = 0;
      for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
        const v = b2[r][c];
        if (v === '.') continue;
        const val = VAL[v.toLowerCase()] || 1;
        if (isAI(v)) score += val;
        else score -= val;
      }
      score += (h2.ai.length - h2.you.length) * 2;
      score += Math.random() * 0.01;
      if (score > bestScore) { bestScore = score; best = m; }
    }
    const res = apply(board, best, hand);
    board = res.board; hand = res.hand;
    if (!findKing(board, 'y')) { winner = "ai"; draw(); return; }
    turn = "you"; draw();
  }

  // ── Drawing ──
  const GLYPH = {
    K:'王',R:'飛',B:'角',G:'金',S:'銀',N:'桂',L:'香',P:'歩',
    D:'龍',H:'馬',T:'と',M:'圭',A:'杏',
    k:'玉',r:'飛',b:'角',g:'金',s:'銀',n:'桂',l:'香',p:'歩',
    d:'龍',h:'馬',t:'と',m:'圭',a:'杏'
  };

  function cellRect(r, c) {
    const margin = 14;
    const cs = (size - 2 * margin) / (COLS - 1);
    const ch = (size - 40) / (ROWS - 1);
    return { x: margin + c * cs, y: 24 + r * ch, w: cs, h: ch };
  }

  function draw() {
    ctx.fillStyle = "#fdfae6"; ctx.fillRect(0, 0, W, H);
    ctx.font = "11px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";

    // Grid lines
    ctx.strokeStyle = "#888";
    for (let r = 0; r < ROWS; r++) {
      const a = cellRect(r, 0), b = cellRect(r, COLS - 1);
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    }
    for (let c = 0; c < COLS; c++) {
      const a = cellRect(0, c), b = cellRect(ROWS - 1, c);
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    }

    // Pieces
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      const v = board[r][c]; if (v === '.') continue;
      const rc = cellRect(r, c);
      const cx = rc.x, cy = rc.y;
      ctx.beginPath(); ctx.arc(cx, cy, 13, 0, Math.PI * 2);
      ctx.fillStyle = "#fff5d5"; ctx.fill(); ctx.strokeStyle = "#222"; ctx.stroke();
      if (sel && sel[0] === r && sel[1] === c) {
        ctx.beginPath(); ctx.arc(cx, cy, 13, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(120,220,120,0.5)"; ctx.fill(); ctx.stroke();
      }
      ctx.font = "bold 12px sans-serif"; ctx.fillStyle = isYou(v) ? "#222" : "#c33";
      ctx.fillText(GLYPH[v] || v, cx, cy + 4);
    }

    // Hand areas
    const hY = size + 32;
    ctx.font = "11px sans-serif"; ctx.fillStyle = "#666"; ctx.textAlign = "left";
    ctx.fillText("your hand:", 8, hY + 14);
    ctx.fillText("AI hand:", W / 2 + 20, hY + 14);
    ctx.textAlign = "center";
    let hx = 80, hy = hY;
    for (const pt of hand.you) {
      const g = GLYPH[pt.toUpperCase()] || pt.toUpperCase();
      ctx.fillStyle = "#222"; ctx.font = "bold 14px sans-serif";
      ctx.fillText(g, hx, hy + 20);
      hx += 22;
    }
    let hx2 = W / 2 + 100, hy2 = hY;
    for (const pt of hand.ai) {
      const g = GLYPH[pt] || pt;
      ctx.fillStyle = "#c33"; ctx.font = "bold 14px sans-serif";
      ctx.fillText(g, hx2, hy2 + 20);
      hx2 += 22;
    }

    // Selection highlight for hand
    if (selHand) {
      ctx.strokeStyle = "#4a4"; ctx.lineWidth = 2;
      let index = 0, sx = 78, sy = hY - 2;
      for (const pt of (selHand === 'you' ? hand.you : hand.ai)) {
        if (/* pt matches selection */ true) { // simplified: just outline the hand area
        }
        sx += 22;
        index++;
      }
      // simpler highlight
      ctx.strokeRect(76, hY - 3, 22, 24);
    }

    if (winner) statusEl.textContent = winner === "you" ? "You win!" : "AI wins!";
    else statusEl.textContent = turn === "you" ? (sel || selHand ? "click destination" : "click your piece or hand") : "AI thinking…";
  }

  function pos(e) {
    const r = canvas.getBoundingClientRect();
    return { x: (e.clientX - r.left) * (W / r.width), y: (e.clientY - r.top) * (H / r.height) };
  }

  function nodeAt(x, y) {
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      const rc = cellRect(r, c);
      const dx = x - rc.x, dy = y - rc.y;
      if (dx * dx + dy * dy <= 225) return [r, c];
    }
    return null;
  }

  function onClick(e) {
    if (winner || turn !== "you") return;
    const { x, y } = pos(e);

    // Check hand area click
    const hY = size + 32;
    if (y > hY - 5 && y < hY + 25) {
      let hx = 78;
      for (let i = 0; i < hand.you.length; i++) {
        if (x >= hx - 10 && x < hx + 12) {
          // Toggle hand selection
          if (selHand === 'you' && hand.you[i] === hand.you[i]) {
            selHand = null; sel = null; draw(); return;
          }
          selHand = 'you'; sel = [-1, i]; draw(); return;
        }
        hx += 22;
      }
      selHand = null; draw(); return;
    }

    const hit = nodeAt(x, y);
    if (!hit) { sel = null; selHand = null; draw(); return; }
    const [r, c] = hit;

    if (sel) {
      if (sel[0] === -1 && selHand) {
        // Dropping from hand
        const idx = sel[1];
        if (idx >= hand.you.length) { sel = null; selHand = null; draw(); return; }
        const pt = hand.you[idx];
        const t = pt.toUpperCase();
        const dropMove = { from: [-1, -1], to: [r, c], drop: t };
        const moves = genMoves(board, 'y');
        const valid = moves.some(m => m.drop && m.to[0] === r && m.to[1] === c &&
          m.drop === t);
        if (valid) {
          const res = apply(board, dropMove, hand);
          board = res.board; hand = res.hand; sel = null; selHand = null;
          if (!findKing(board, 'a')) { winner = "you"; draw(); return; }
          turn = "ai"; draw(); setTimeout(aiMove, 300);
          return;
        }
        sel = null; selHand = null; draw(); return;
      }
      if (sel[0] === r && sel[1] === c) { sel = null; draw(); return; }
      if (isYou(board[r][c])) { sel = [r, c]; draw(); return; }
      const moves = genMoves(board, 'y');
      const mv = moves.find(m => !m.drop && m.from[0] === sel[0] && m.from[1] === sel[1] && m.to[0] === r && m.to[1] === c);
      if (!mv) { sel = null; draw(); return; }
      const res = apply(board, mv, hand);
      board = res.board; hand = res.hand; sel = null;
      if (!findKing(board, 'a')) { winner = "you"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 300);
    } else {
      if (isYou(board[r][c])) { sel = [r, c]; selHand = null; draw(); }
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
      const __res = apply(board, __mv, hand);
      board = __res.board; hand = __res.hand;
      if (!findKing(board, 'a')){ winner = "you"; draw(); return; }
      turn = "ai"; draw();
      setTimeout(aiMove, 80);
    },

    destroy() { canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart() { newGame(); draw(); },
  };
}
