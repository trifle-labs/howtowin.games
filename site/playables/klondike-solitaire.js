// Klondike Solitaire — playable canvas implementation
// Click stock to draw, click tableau/waste card to select, click destination to move.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = size;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) {
    const w = canvas.width, h = canvas.height;
    canvas.style.width = w + 'px';    canvas.width = w * dpr; canvas.height = h * dpr; ctx.scale(dpr, dpr);
  }
  const statusEl = document.getElementById("playable-status");

  const suits = ["♠", "♥", "♣", "♦"];
  const suitColor = [0, 1, 0, 1];
  const cw = 40, ch = 56;
  const gap = 4, stackOff = 18;
  const leftPad = 8, topPad = 8;
  const tabY = topPad + ch + 12;

  let stock, waste, foundations, tableau, won, stuck;
  let selected = null; // { pile, idx } — the selected card and which pile it's in
  let solveNoProgress = 0;
  let solveClicks = 0;

  function createDeck() {
    const d = [];
    for (let s = 0; s < 4; s++)
      for (let r = 1; r <= 13; r++)
        d.push({ suit: s, rank: r, faceUp: false });
    return d;
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  function init() {
    const d = createDeck();
    shuffle(d);
    tableau = Array.from({ length: 7 }, () => []);
    for (let i = 0; i < 7; i++) {
      for (let j = i; j < 7; j++) {
        const card = d.pop();
        card.faceUp = j === i;
        tableau[j].push(card);
      }
    }
    stock = d;
    waste = [];
    foundations = Array.from({ length: 4 }, () => []);
    won = false;
    stuck = false;
    selected = null;
    solveNoProgress = 0;
    solveClicks = 0;
  }
  init();

  function topCard(pile) { return pile.length ? pile[pile.length - 1] : null; }

  function canMoveToFoundation(card, pile) {
    if (!pile.length) return card.rank === 1;
    const t = topCard(pile);
    return t.suit === card.suit && t.rank === card.rank - 1;
  }

  // Check if card can build onto a tableau pile (descending, opposite colour)
  function canBuildOn(card, pile) {
    if (!pile.length) return card.rank === 13; // only King on empty
    const t = topCard(pile);
    if (!t.faceUp) return false;
    return t.rank === card.rank + 1 && suitColor[t.suit] !== suitColor[card.suit];
  }

  function autoMoveFrom(pile) {
    const c = topCard(pile);
    if (!c || !c.faceUp) return false;
    for (let f = 0; f < 4; f++) {
      if (canMoveToFoundation(c, foundations[f])) {
        pile.pop();
        foundations[f].push(c);
        return true;
      }
    }
    return false;
  }

  function flipTop(pile) {
    const c = topCard(pile);
    if (c && !c.faceUp) c.faceUp = true;
  }

  function findPile(mx, my) {
    // Check stock
    if (my >= topPad && my <= topPad + ch && mx >= leftPad && mx <= leftPad + cw)
      return { kind: "stock" };
    // Check waste
    if (my >= topPad && my <= topPad + ch && mx >= leftPad + cw + gap && mx <= leftPad + (cw + gap) * 2)
      return { kind: "waste" };
    // Check foundations
    for (let f = 0; f < 4; f++) {
      const fx = leftPad + (cw + gap) * (f + 3);
      if (my >= topPad && my <= topPad + ch && mx >= fx && mx <= fx + cw)
        return { kind: "foundation", idx: f };
    }
    // Check tableau
    for (let i = 0; i < 7; i++) {
      const x = leftPad + (cw + gap) * i;
      const pileH = ch + (tableau[i].length - 1) * stackOff;
      if (mx >= x && mx <= x + cw && my >= tabY && my <= tabY + pileH) {
        const idx = Math.min(Math.floor((my - tabY) / stackOff), tableau[i].length - 1);
        return { kind: "tableau", idx: i, cardIdx: idx };
      }
    }
    return null;
  }

  function drawCard(card, x, y, faceUp, highlight) {
    const r = 4;
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.roundRect(x, y, cw, ch, r);
    ctx.fill();
    ctx.strokeStyle = highlight ? "#fc0" : "#999";
    ctx.lineWidth = highlight ? 2 : 0.5;
    ctx.stroke();
    if (!faceUp) {
      ctx.fillStyle = "#48a";
      ctx.beginPath();
      ctx.roundRect(x + 3, y + 3, cw - 6, ch - 6, r - 1);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.1)";
      ctx.fillRect(x + 6, y + 6, cw - 12, 6);
      return;
    }
    const label = card.rank === 1 ? "A" : card.rank <= 10 ? String(card.rank) : ["J", "Q", "K"][card.rank - 11];
    ctx.fillStyle = suitColor[card.suit] ? "#e44" : "#222";
    ctx.font = "bold 13px sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(label + suits[card.suit], x + 4, y + 4);
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(suits[card.suit], x + cw / 2, y + ch * 0.55);
  }

  function draw() {
    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = "#2a6";
    ctx.fillRect(0, 0, size, size);

    // Foundations
    for (let f = 0; f < 4; f++) {
      const x = leftPad + (cw + gap) * (f + 3);
      const c = topCard(foundations[f]);
      if (c) drawCard(c, x, topPad, true);
      else {
        ctx.strokeStyle = "rgba(255,255,255,0.25)";
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.roundRect(x, topPad, cw, ch, 4);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // Stock + waste
    if (stock.length) {
      drawCard(stock[0], leftPad, topPad, false);
    } else {
      // Empty stock — show redeal hint
      ctx.strokeStyle = "rgba(255,255,255,0.25)";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.roundRect(leftPad, topPad, cw, ch, 4);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    if (waste.length) {
      const isSel = selected && selected.pile === "waste" && selected.idx === waste.length - 1;
      drawCard(topCard(waste), leftPad + cw + gap, topPad, true, isSel);
    }

    // Tableau
    for (let i = 0; i < 7; i++) {
      const x = leftPad + (cw + gap) * i;
      for (let j = 0; j < tableau[i].length; j++) {
        const isSel = selected && selected.pile === "tableau" && selected.idx === i && selected.cardIdx === j;
        drawCard(tableau[i][j], x, tabY + j * stackOff, tableau[i][j].faceUp, isSel);
      }
    }

    if (won) {
      statusEl.textContent = "solved!";
    } else if (stuck) {
      statusEl.textContent = "stuck — no more moves";
    } else {
      if (selected) statusEl.textContent = "click a destination";
      else statusEl.textContent = `stock: ${stock.length}`;
    }
  }

  function handleClick(e) {
    if (won) return;
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (size / rect.width);
    const my = (e.clientY - rect.top) * (size / rect.height);

    const target = findPile(mx, my);

    // ── Stock ──
    if (target && target.kind === "stock") {
      selected = null;
      if (stock.length) {
        const c = stock.pop();
        c.faceUp = true;
        waste.push(c);
        autoMoveFrom(waste);
        draw();
      } else {
        // Redeal: flip waste back to stock
        while (waste.length) {
          const c = waste.pop();
          c.faceUp = false;
          stock.push(c);
        }
        draw();
      }
      return;
    }

    // ── Waste (as source) ──
    if (target && target.kind === "waste") {
      if (selected) { selected = null; draw(); return; }
      const w = topCard(waste);
      if (w) {
        for (let f = 0; f < 4; f++) {
          if (canMoveToFoundation(w, foundations[f])) {
            waste.pop();
            foundations[f].push(w);
            selected = null;
            autoMove();
            draw();
            return;
          }
        }
        selected = { pile: "waste", idx: waste.length - 1 };
        draw();
      }
      return;
    }

    // ── Foundation as destination ──
    if (target && target.kind === "foundation") {
      if (selected) {
        let card, srcPile;
        if (selected.pile === "waste") {
          card = topCard(waste);
          srcPile = waste;
        } else if (selected.pile === "tableau") {
          const pile = tableau[selected.idx];
          // Can only move the top card of a tableau pile to foundation
          if (selected.cardIdx !== pile.length - 1) { selected = null; draw(); return; }
          card = topCard(pile);
          srcPile = pile;
        }
        if (card && canMoveToFoundation(card, foundations[target.idx])) {
          srcPile.pop();
          foundations[target.idx].push(card);
          if (selected.pile === "tableau") flipTop(tableau[selected.idx]);
          selected = null;
          autoMove();
          draw();
          return;
        }
        selected = null;
        draw();
        return;
      }
      // Clicking foundation with nothing selected — try auto-move from tableau/waste
      for (let i = 0; i < 7; i++) {
        if (autoMoveFrom(tableau[i])) { flipTop(tableau[i]); autoMove(); draw(); return; }
      }
      if (autoMoveFrom(waste)) { flipTop(waste); autoMove(); draw(); return; }
      return;
    }

    // ── Tableau (as source or destination) ──
    if (target && target.kind === "tableau") {
      const pile = tableau[target.idx];
      const card = pile[target.cardIdx];

      if (!card) return;

      // If something is selected, try moving it here
      if (selected) {
        let srcPile, cards;
        if (selected.pile === "waste") {
          const w = topCard(waste);
          if (w && canBuildOn(w, pile)) {
            waste.pop();
            pile.push(w);
            flipTop(waste);
            selected = null;
            draw();
            return;
          }
        } else if (selected.pile === "tableau") {
          const src = tableau[selected.idx];
          // Move from selected.cardIdx to end of src (all face-up cards in sequence)
          const seq = src.slice(selected.cardIdx);
          if (seq.length && seq.every(c => c.faceUp) && canBuildOn(seq[0], pile)) {
            src.length = selected.idx;
            pile.push(...seq);
            flipTop(src);
            selected = null;
            draw();
            return;
          }
        }
        // Can't move there — deselect
        selected = null;
        draw();
        return;
      }

      // Nothing selected — try selecting this card
      if (!card.faceUp) return;

      // Auto-move to foundation if possible (only top card)
      if (card === topCard(pile)) {
        for (let f = 0; f < 4; f++) {
          if (canMoveToFoundation(card, foundations[f])) {
            pile.pop();
            foundations[f].push(card);
            flipTop(pile);
            autoMove();
            draw();
            return;
          }
        }
      }

      // Select this card (and all face-up cards on top of it)
      if (card.faceUp) {
        selected = { pile: "tableau", idx: target.idx, cardIdx: target.cardIdx };
        draw();
      }
      return;
    }

    // Clicked empty space — deselect
    if (selected) { selected = null; draw(); }
  }

  function autoMove() {
    let moved = true;
    while (moved) {
      moved = false;
      for (let i = 0; i < 7; i++) {
        if (autoMoveFrom(tableau[i])) { flipTop(tableau[i]); moved = true; break; }
      }
      if (!moved && autoMoveFrom(waste)) { flipTop(waste); moved = true; }
    }
    if (foundations.every(f => f.length === 13)) won = true;
  }

  // ── Auto-play solver ─────────────────────────────────────
  function autoPlayStep() {
    // 1. Draw from stock
    if (stock.length) {
      const c = stock.pop();
      c.faceUp = true;
      waste.push(c);
      autoMoveFrom(waste);
      return true;
    }
    // 2. Redeal if stock empty
    if (waste.length) {
      while (waste.length) {
        const c = waste.pop();
        c.faceUp = false;
        stock.push(c);
      }
      return true;
    }
    return false; // both empty
  }

  canvas.addEventListener("click", handleClick);
  draw();

  return {
    destroy() { canvas.removeEventListener("click", handleClick); ctx.clearRect(0, 0, size, size); },
    restart() { init(); draw(); },
    solve() {
      if (won || stuck) return;
      solveClicks++;
      if (solveClicks >= 80) { stuck = true; draw(); return; }
      selected = null;
      // 1. Drain auto-moves to foundation from tableau/waste
      let anyFoundationMove = false;
      let moved = true;
      while (moved) {
        moved = false;
        for (let i = 0; i < 7; i++) {
          if (autoMoveFrom(tableau[i])) { flipTop(tableau[i]); moved = true; anyFoundationMove = true; break; }
        }
        if (!moved && autoMoveFrom(waste)) { flipTop(waste); moved = true; anyFoundationMove = true; }
      }
      if (foundations.every(f => f.length === 13)) { won = true; solveNoProgress = 0; draw(); return; }
      if (anyFoundationMove) { solveNoProgress = 0; draw(); return; }
      // 2. Try a tableau-to-tableau move: move any face-up card sequence to a valid dest
      for (let src = 0; src < 7; src++) {
        const pile = tableau[src];
        for (let ci = 0; ci < pile.length; ci++) {
          if (!pile[ci].faceUp) continue;
          const seq = pile.slice(ci);
          for (let dst = 0; dst < 7; dst++) {
            if (dst === src) continue;
            if (canBuildOn(seq[0], tableau[dst])) {
              tableau[dst].push(...seq);
              pile.length = ci;
              flipTop(pile);
              autoMove();
              solveNoProgress = 0;
              draw();
              return;
            }
          }
        }
      }
      // 3. Try moving waste top to tableau
      const w = topCard(waste);
      if (w) {
        for (let dst = 0; dst < 7; dst++) {
          if (canBuildOn(w, tableau[dst])) {
            waste.pop(); tableau[dst].push(w); flipTop(waste);
            autoMove(); solveNoProgress = 0; draw(); return;
          }
        }
      }
      // 4. Draw from stock (or redeal)
      if (stock.length) {
        const c = stock.pop(); c.faceUp = true; waste.push(c);
        autoMoveFrom(waste);
        if (foundations.every(f => f.length === 13)) { won = true; solveNoProgress = 0; draw(); return; }
        solveNoProgress++;
      } else if (waste.length) {
        while (waste.length) { const c = waste.pop(); c.faceUp = false; stock.push(c); }
        solveNoProgress++;
      } else {
        solveNoProgress++;
      }
      // After 12 consecutive no-progress steps, declare the game stuck
      if (solveNoProgress >= 12) { stuck = true; }
      draw();
    }
  };
}
