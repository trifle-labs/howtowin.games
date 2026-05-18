// Cathedral — polyomino placement game on a 10x10 board. Place building-shaped
// pieces without overlapping. Surround enemy pieces with your pieces + board
// edge to capture them. Fewest unplaced piece points wins. AI uses greedy
// placement heuristic.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  const cellSize = Math.floor((size - 40) / 10);
  const boardSize = cellSize * 10;
  const boardLeft = Math.floor((size - boardSize) / 2);
  const boardTop = 30;
  canvas.width = size;
  canvas.height = boardSize + 180;
  const W = canvas.width, H = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) { canvas.style.width = W + 'px'; canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr); }
  const statusEl = document.getElementById("playable-status");

  const N = 10;

  // ── piece definitions ──────────────────────────────────────────────────────
  // Each piece is an array of [row, col] offsets relative to the anchor (top-left of bounding box)
  const SHAPES = [
    { name: "Mono", cells: [[0,0]], sz: 1 },
    { name: "Domino", cells: [[0,0],[0,1]], sz: 2 },
    { name: "I-Tri", cells: [[0,0],[1,0],[2,0]], sz: 3 },
    { name: "L-Tri", cells: [[0,0],[1,0],[0,1]], sz: 3 },
    { name: "T-Tetra", cells: [[0,0],[1,0],[2,0],[1,1]], sz: 4 },
    { name: "O-Tetra", cells: [[0,0],[1,0],[0,1],[1,1]], sz: 4 },
    { name: "L-Tetra", cells: [[0,0],[1,0],[2,0],[2,1]], sz: 4 },
    { name: "S-Tetra", cells: [[1,0],[2,0],[0,1],[1,1]], sz: 4 },
    { name: "Penta", cells: [[0,0],[1,0],[0,1],[1,1],[0,2]], sz: 5 },
    { name: "Cath.", cells: [[1,0],[0,1],[1,1],[2,1],[1,2]], sz: 5 },
  ];

  function rotateCW(cells) {
    return cells.map(([r, c]) => [c, -r]);
  }

  function normalize(cells) {
    const minR = Math.min(...cells.map(a => a[0]));
    const minC = Math.min(...cells.map(a => a[1]));
    return cells.map(([r, c]) => [r - minR, c - minC]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  }

  function uniqKey(cells) { return JSON.stringify(normalize(cells)); }

  function genRotations(cells) {
    const set = new Set();
    const result = [];
    let cur = cells.slice();
    for (let i = 0; i < 4; i++) {
      const k = uniqKey(cur);
      if (!set.has(k)) { set.add(k); result.push(normalize(cur)); }
      cur = rotateCW(cur);
    }
    return result;
  }

  // Pre-compute all rotations for each piece
  const ROTS = SHAPES.map(s => genRotations(s.cells));

  const PLAYER_SET = [0, 1, 1, 2, 3, 4, 5, 6, 7, 8]; // indices into SHAPES

  // ── game state ──────────────────────────────────────────────────────────────
  let board, hands, placedPieces, turn, winner, consecutivePasses;
  let selectedPieceIdx, selectedRotIdx;
  let mouseCell; // { r, c } or null for ghost preview

  function newGame() {
    board = Array.from({ length: N }, () => Array(N).fill(-1));
    hands = [PLAYER_SET.slice(), PLAYER_SET.slice()]; // player 0 = you, player 1 = AI
    placedPieces = [];
    turn = 0; // 0 = you, 1 = AI
    winner = null;
    consecutivePasses = 0;
    selectedPieceIdx = -1;
    selectedRotIdx = 0;
    mouseCell = null;

    // Place Cathedral at center (bounding box top-left at (4,4))
    const cathRot = ROTS[9][0];
    for (const [dr, dc] of cathRot) {
      board[4 + dr][4 + dc] = 2; // 2 = cathedral (neutral)
    }
    placedPieces.push({ player: 2, pieceIdx: 9, rotIdx: 0, r: 4, c: 4, cells: cathRot });
  }
  newGame();

  function canPlace(r, c, cells) {
    for (const [dr, dc] of cells) {
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nr >= N || nc < 0 || nc >= N) return false;
      if (board[nr][nc] !== -1) return false;
    }
    return true;
  }

  function findPlacements(player, pieceIdx) {
    const results = [];
    const rots = ROTS[pieceIdx];
    for (let ri = 0; ri < rots.length; ri++) {
      for (let r = 0; r < N; r++) {
        for (let c = 0; c < N; c++) {
          if (canPlace(r, c, rots[ri])) {
            results.push({ rotIdx: ri, r, c });
          }
        }
      }
    }
    return results;
  }

  function playerHasMoves(player) {
    for (const pi of hands[player]) {
      if (findPlacements(player, pi).length > 0) return true;
    }
    return false;
  }

  // ── capture detection ───────────────────────────────────────────────────────
  function getCaptured(placingPlayer) {
    const opp = placingPlayer === 0 ? 1 : 0;
    const visited = Array.from({ length: N }, () => Array(N).fill(false));
    const captured = [];

    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        if (board[r][c] !== opp || visited[r][c]) continue;

        // BFS through contiguous enemy pieces
        const region = [];
        const q = [[r, c]];
        visited[r][c] = true;
        let canEscape = false;

        while (q.length) {
          const [cr, cc] = q.shift();
          region.push([cr, cc]);

          for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
            const nr = cr + dr, nc = cc + dc;
            if (nr < 0 || nr >= N || nc < 0 || nc >= N) continue;
            const ni = nr * N + nc;

            if (board[nr][nc] === -1) {
              // This empty cell might lead to the edge
              // Check if this empty cell can reach the board edge
              const emptyVisited = new Set();
              const eq = [[nr, nc]];
              emptyVisited.add(nr * N + nc);
              while (eq.length) {
                const [er, ec] = eq.shift();
                if (er === 0 || er === N - 1 || ec === 0 || ec === N - 1) {
                  canEscape = true;
                  break;
                }
                for (const [edr, edc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
                  const enr = er + edr, enc = ec + edc;
                  if (enr < 0 || enr >= N || enc < 0 || enc >= N) continue;
                  const ei = enr * N + enc;
                  if (!emptyVisited.has(ei) && board[enr][enc] === -1) {
                    emptyVisited.add(ei);
                    eq.push([enr, enc]);
                  }
                }
              }
            }
            if (board[nr][nc] === opp && !visited[nr][nc]) {
              visited[nr][nc] = true;
              q.push([nr, nc]);
            }
          }
          if (canEscape) break;
        }

        if (!canEscape) {
          captured.push(...region.map(([cr, cc]) => [cr, cc]));
        }
      }
    }
    return captured;
  }

  function doCapture(placingPlayer) {
    const captured = getCaptured(placingPlayer);
    const opp = placingPlayer === 0 ? 1 : 0;
    for (const [cr, cc] of captured) {
      // Find which placed piece this cell belongs to
      const ppIdx = placedPieces.findIndex(pp => {
        if (pp.player !== opp) return false;
        for (const [dr, dc] of pp.cells) {
          if (pp.r + dr === cr && pp.c + dc === cc) return true;
        }
        return false;
      });
      if (ppIdx >= 0) {
        const pp = placedPieces[ppIdx];
        // Return piece to owner's hand (always — PLAYER_SET may have duplicates)
        hands[opp].push(pp.pieceIdx);
        // Clear board cells
        for (const [dr, dc] of pp.cells) {
          board[pp.r + dr][pp.c + dc] = -1;
        }
        placedPieces.splice(ppIdx, 1);
      }
    }
    return captured.length > 0;
  }

  // ── move execution ──────────────────────────────────────────────────────────
  function place(pieceIdx, rotIdx, r, c, player) {
    const cells = ROTS[pieceIdx][rotIdx];
    // Place on board
    for (const [dr, dc] of cells) {
      board[r + dr][c + dc] = player;
    }
    // Remove from hand
    const hi = hands[player].indexOf(pieceIdx);
    if (hi >= 0) hands[player].splice(hi, 1);
    // Track placed
    placedPieces.push({ player, pieceIdx, rotIdx, r, c, cells });
    // Check captures
    doCapture(player);
    consecutivePasses = 0;
  }

  function computeScore(player) {
    let score = 0;
    for (const pi of hands[player]) {
      score += SHAPES[pi].sz;
    }
    return score;
  }

  function checkEnd() {
    if (consecutivePasses >= 2) {
      const s0 = computeScore(0);
      const s1 = computeScore(1);
      if (s0 < s1) winner = "you";
      else if (s1 < s0) winner = "ai";
      else winner = "draw";
      return true;
    }
    return false;
  }

  // ── AI ──────────────────────────────────────────────────────────────────────
  function evaluatePlacement(pieceIdx, r, c) {
    let score = SHAPES[pieceIdx].sz * 10;
    // Central preference
    score += (N / 2 - Math.abs(r - N / 2)) * 1.5;
    score += (N / 2 - Math.abs(c - N / 2)) * 1.5;
    return score;
  }

  function bestAIPlacement() {
    let best = null, bestScore = -Infinity;
    for (const pi of hands[1]) {
      const placements = findPlacements(1, pi);
      for (const pl of placements) {
        const score = evaluatePlacement(pi, pl.r, pl.c);
        if (score > bestScore) { bestScore = score; best = { pieceIdx: pi, ...pl }; }
      }
    }
    return best;
  }

  function aiMove() {
    if (winner) return;
    if (!playerHasMoves(1)) {
      consecutivePasses++;
      if (checkEnd()) { draw(); return; }
      turn = 0;
      draw();
      return;
    }
    const b = bestAIPlacement();
    if (!b) {
      consecutivePasses++;
      if (checkEnd()) { draw(); return; }
      turn = 0;
      draw();
      return;
    }
    place(b.pieceIdx, b.rotIdx, b.r, b.c, 1);
    if (checkEnd()) { draw(); return; }
    turn = 0;
    selectedPieceIdx = -1;
    selectedRotIdx = 0;
    draw();
  }

  // ── drawing ──────────────────────────────────────────────────────────────────
  const YOU_COLOR = "#4488cc";
  const AI_COLOR = "#cc6644";
  const CATH_COLOR = "#777";
  const BOARD_LIGHT = "#f0e2c0";
  const BOARD_DARK = "#dcc090";

  function draw() {
    ctx.fillStyle = "#fafaf7";
    ctx.fillRect(0, 0, W, H);

    // title
    ctx.font = "13px sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#444";
    ctx.fillText("Cathedral — 10×10 polyomino placement", W / 2, 14);

    // hand label
    ctx.textAlign = "left";
    ctx.font = "11px sans-serif";
    ctx.fillStyle = "#555";
    ctx.fillText("Your pieces (click to select, click again to rotate):", 8, boardTop + boardSize + 16);

    // board
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
      const x = boardLeft + c * cellSize, y = boardTop + r * cellSize;
      ctx.fillStyle = (r + c) % 2 === 0 ? BOARD_LIGHT : BOARD_DARK;
      ctx.fillRect(x, y, cellSize, cellSize);
      ctx.strokeStyle = "#b8a87a";
      ctx.lineWidth = 0.5;
      ctx.strokeRect(x, y, cellSize, cellSize);
    }

    // ghost preview
    if (selectedPieceIdx >= 0 && mouseCell && turn === 0 && !winner) {
      const cells = ROTS[selectedPieceIdx][selectedRotIdx];
      if (canPlace(mouseCell.r, mouseCell.c, cells)) {
        ctx.fillStyle = "rgba(68,136,204,0.25)";
        for (const [dr, dc] of cells) {
          const x = boardLeft + (mouseCell.c + dc) * cellSize;
          const y = boardTop + (mouseCell.r + dr) * cellSize;
          ctx.fillRect(x, y, cellSize, cellSize);
        }
      } else {
        ctx.fillStyle = "rgba(200,50,50,0.15)";
        for (const [dr, dc] of cells) {
          const nr = mouseCell.r + dr, nc = mouseCell.c + dc;
          if (nr >= 0 && nr < N && nc >= 0 && nc < N) {
            const x = boardLeft + nc * cellSize;
            const y = boardTop + nr * cellSize;
            ctx.fillRect(x, y, cellSize, cellSize);
          }
        }
      }
    }

    // placed pieces
    ctx.lineWidth = 1;
    for (const pp of placedPieces) {
      let color;
      if (pp.player === 2) color = CATH_COLOR;
      else if (pp.player === 0) color = YOU_COLOR;
      else color = AI_COLOR;

      for (const [dr, dc] of pp.cells) {
        const x = boardLeft + (pp.c + dc) * cellSize;
        const y = boardTop + (pp.r + dr) * cellSize;
        ctx.fillStyle = color;
        ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
        ctx.strokeStyle = "rgba(0,0,0,0.2)";
        ctx.strokeRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
      }
    }

    // hand pieces (player 0 only)
    const hc = cellSize * 0.3; // hand cell size for preview
    const cols = 5;
    const previewW = 6 * hc + 6; // max 5 cells wide + padding
    const handStartX = 8;
    const handStartY = boardTop + boardSize + 30;

    for (let i = 0; i < hands[0].length; i++) {
      const pi = hands[0][i];
      const col = i % cols;
      const row = Math.floor(i / cols);
      const px = handStartX + col * previewW;
      const py = handStartY + row * (5 * hc + 20);

      const isSelected = (pi === selectedPieceIdx);
      // Show the current rotation if selected, otherwise first rotation
      const rotIdx = isSelected ? selectedRotIdx : 0;
      const cells = ROTS[pi][rotIdx];
      const minR = Math.min(...cells.map(a => a[0]));
      const minC = Math.min(...cells.map(a => a[1]));
      const maxR = Math.max(...cells.map(a => a[0]));
      const maxC = Math.max(...cells.map(a => a[1]));
      const pW = (maxC - minC + 1) * hc;
      const pH = (maxR - minR + 1) * hc;

      // Selection highlight
      if (isSelected) {
        ctx.fillStyle = "rgba(68,136,204,0.12)";
        ctx.fillRect(px - 2, py - 2, previewW, 5 * hc + 16);
        ctx.strokeStyle = "#4488cc";
        ctx.lineWidth = 2;
        ctx.strokeRect(px - 2, py - 2, previewW, 5 * hc + 16);
      }

      // Draw piece preview
      for (const [dr, dc] of cells) {
        const cx = px + (dc - minC) * hc;
        const cy = py + (dr - minR) * hc;
        ctx.fillStyle = YOU_COLOR;
        ctx.fillRect(cx, cy, hc - 1, hc - 1);
        ctx.strokeStyle = "rgba(0,0,0,0.15)";
        ctx.lineWidth = 0.5;
        ctx.strokeRect(cx, cy, hc - 1, hc - 1);
      }

      // Piece name and size
      ctx.fillStyle = "#555";
      ctx.font = "9px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(SHAPES[pi].name, px + previewW / 2, py + 5 * hc + 14);
      ctx.fillStyle = "#999";
      ctx.font = "8px sans-serif";
      ctx.fillText("sz:" + SHAPES[pi].sz, px + previewW / 2, py + 5 * hc + 22);
    }

    // score display
    ctx.textAlign = "right";
    ctx.font = "11px sans-serif";
    const s0 = computeScore(0);
    const s1 = computeScore(1);
    ctx.fillStyle = YOU_COLOR;
    ctx.fillText(`you: ${s0} unplaced`, W - 8, 14);
    ctx.fillStyle = AI_COLOR;
    ctx.fillText(`AI: ${s1} unplaced`, W - 8, 26);

    // status
    if (winner) {
      if (winner === "draw") statusEl.textContent = `draw! both have ${s0} unplaced points`;
      else statusEl.textContent = winner === "you"
        ? `you win! (${s0} unplaced vs AI ${s1})`
        : `AI wins (${s1} unplaced vs your ${s0})`;
    } else if (turn === 1) {
      statusEl.textContent = "AI thinking...";
    } else {
      if (selectedPieceIdx < 0) {
        const hasMoves = playerHasMoves(0);
        if (!hasMoves) {
          statusEl.textContent = "no legal moves — click pass, or press ⟳ solve for AI";
        } else {
          statusEl.textContent = "click a piece in your hand to select it";
        }
      } else {
        statusEl.textContent = "click the board to place (R to rotate, re-click to confirm)";
      }
    }

    // Draw pass button when player has no moves
    if (turn === 0 && !winner && !playerHasMoves(0)) {
      const bx = W / 2 - 30, by = H - 32, bw = 60, bh = 22;
      ctx.fillStyle = "#e8e0d0";
      ctx.strokeStyle = "#b8a87a";
      ctx.lineWidth = 1;
      ctx.fillRect(bx, by, bw, bh);
      ctx.strokeRect(bx, by, bw, bh);
      ctx.fillStyle = "#666";
      ctx.font = "12px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("pass", W / 2, by + 15);
    }
  }

  // ── interaction ──────────────────────────────────────────────────────────────
  function pos(e) {
    const r = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - r.left) * (W / r.width),
      y: (e.clientY - r.top) * (H / r.height)
    };
  }

  function boardCell(px, py) {
    const c = Math.floor((px - boardLeft) / cellSize);
    const r = Math.floor((py - boardTop) / cellSize);
    if (r >= 0 && r < N && c >= 0 && c < N) return { r, c };
    return null;
  }

  function hitHandPiece(px, py) {
    const hc = cellSize * 0.3;
    const cols = 5;
    const previewW = 6 * hc + 6;
    const handStartX = 8;
    const handStartY = boardTop + boardSize + 30;

    for (let i = 0; i < hands[0].length; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const hx = handStartX + col * previewW;
      const hy = handStartY + row * (5 * hc + 20);
      if (px >= hx - 2 && px <= hx + previewW && py >= hy - 2 && py <= hy + 5 * hc + 24) {
        return i;
      }
    }
    return -1;
  }

  function onClick(e) {
    if (winner) return;
    const p = pos(e);
    const cell = boardCell(p.x, p.y);

    if (turn === 0) {
      // Check if clicking on hand
      const hi = hitHandPiece(p.x, p.y);
      if (hi >= 0) {
        const pi = hands[0][hi];
        if (selectedPieceIdx === pi) {
          // Cycle rotation
          selectedRotIdx = (selectedRotIdx + 1) % ROTS[pi].length;
        } else {
          selectedPieceIdx = pi;
          selectedRotIdx = 0;
        }
        draw();
        return;
      }

      // Check for "pass" button area
      if (p.y > H - 32 && p.y < H - 8 && p.x > W / 2 - 30 && p.x < W / 2 + 30) {
        if (!playerHasMoves(0)) {
          consecutivePasses++;
              if (checkEnd()) { draw(); return; }
          turn = 1;
          selectedPieceIdx = -1;
          selectedRotIdx = 0;
          draw();
          setTimeout(aiMove, 400);
          return;
        }
      }

      // Place piece on board
      if (cell && selectedPieceIdx >= 0) {
        const cells = ROTS[selectedPieceIdx][selectedRotIdx];
        if (canPlace(cell.r, cell.c, cells)) {
          place(selectedPieceIdx, selectedRotIdx, cell.r, cell.c, 0);
          selectedPieceIdx = -1;
          selectedRotIdx = 0;
          if (checkEnd()) { draw(); return; }
          turn = 1;
          draw();
          setTimeout(aiMove, 400);
          return;
        }
      }
    }
  }

  function onMouseMove(e) {
    const p = pos(e);
    const cell = boardCell(p.x, p.y);
    if (cell) {
      if (!mouseCell || mouseCell.r !== cell.r || mouseCell.c !== cell.c) {
        mouseCell = cell;
        draw();
      }
    } else {
      if (mouseCell) { mouseCell = null; draw(); }
    }
  }

  function onKeyDown(e) {
    if ((e.key === 'r' || e.key === 'R') && turn === 0 && selectedPieceIdx >= 0 && !winner) {
      selectedRotIdx = (selectedRotIdx + 1) % ROTS[selectedPieceIdx].length;
      draw();
      e.preventDefault();
    }
  }
  document.addEventListener("keydown", onKeyDown);

  canvas.addEventListener("click", onClick);
  canvas.addEventListener("mousemove", onMouseMove);
  draw();

  return {
    destroy() {
      canvas.removeEventListener("click", onClick);
      canvas.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("keydown", onKeyDown);
      ctx.clearRect(0, 0, W, H);
    },
    restart() { newGame(); draw(); },
    solve() {
      if (winner || turn !== 0) return;
      // Find best placement for player
      if (!playerHasMoves(0)) {
        consecutivePasses++;
          if (checkEnd()) { draw(); return; }
        turn = 1;
        setTimeout(aiMove, 400);
        return;
      }
      let best = null, bestScore = -Infinity;
      for (const pi of hands[0]) {
        const placements = findPlacements(0, pi);
        for (const pl of placements) {
          const score = evaluatePlacement(pi, pl.r, pl.c);
          if (score > bestScore) { bestScore = score; best = { pieceIdx: pi, ...pl }; }
        }
      }
      if (!best) {
        // No moves - pass
        consecutivePasses++;
          if (checkEnd()) { draw(); return; }
        turn = 1;
        setTimeout(aiMove, 400);
        return;
      }
      place(best.pieceIdx, best.rotIdx, best.r, best.c, 0);
      selectedPieceIdx = -1;
      selectedRotIdx = 0;
      if (checkEnd()) { draw(); return; }
      turn = 1;
      draw();
      setTimeout(aiMove, 400);
    }
  };
}
