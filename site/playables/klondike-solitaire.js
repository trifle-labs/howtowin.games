// Klondike Solitaire — playable canvas implementation
// ~200 lines, click cards to move to foundation, click stock to draw.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = size;
  const statusEl = document.getElementById("playable-status");

  const suits = ["♠", "♥", "♣", "♦"];
  const suitColor = [0, 1, 0, 1]; // 0=black, 1=red
  const cw = 40, ch = 56;
  const gap = 4, stackOff = 18;
  const leftPad = 8, topPad = 8;

  let stock, waste, foundations, tableau, won;

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
  }
  init();

  function topCard(pile) { return pile.length ? pile[pile.length - 1] : null; }

  function canMoveToFoundation(card, pile) {
    if (!pile.length) return card.rank === 1;
    const t = topCard(pile);
    return t.suit === card.suit && t.rank === card.rank - 1;
  }

  function autoMove() {
    let moved = true;
    while (moved) {
      moved = false;
      for (let i = 0; i < 7; i++) {
        const c = topCard(tableau[i]);
        if (!c || !c.faceUp) continue;
        for (let f = 0; f < 4; f++) {
          if (canMoveToFoundation(c, foundations[f])) {
            tableau[i].pop();
            foundations[f].push(c);
            // Flip next card if needed
            const next = topCard(tableau[i]);
            if (next && !next.faceUp) next.faceUp = true;
            moved = true;
            break;
          }
        }
        if (moved) break;
      }
      // Also check waste
      const w = topCard(waste);
      if (w) {
        for (let f = 0; f < 4; f++) {
          if (canMoveToFoundation(w, foundations[f])) {
            waste.pop();
            foundations[f].push(w);
            moved = true;
            break;
          }
        }
      }
    }
    if (foundations.every(f => f.length === 13)) won = true;
  }

  function drawCard(card, x, y, faceUp) {
    const r = 4;
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.roundRect(x, y, cw, ch, r);
    ctx.fill();
    ctx.strokeStyle = "#999";
    ctx.lineWidth = 0.5;
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
      ctx.strokeStyle = "rgba(255,255,255,0.25)";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.roundRect(leftPad, topPad, cw, ch, 4);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    if (waste.length) {
      drawCard(topCard(waste), leftPad + cw + gap, topPad, true);
    }

    // Tableau
    for (let i = 0; i < 7; i++) {
      const x = leftPad + (cw + gap) * i;
      for (let j = 0; j < tableau[i].length; j++) {
        const c = tableau[i][j];
        drawCard(c, x, topPad + ch + 12 + j * stackOff, c.faceUp);
      }
    }

    statusEl.textContent = won ? "solved!" : `stock: ${stock.length}`;
  }

  function handleClick(e) {
    if (won) return;
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (size / rect.width);
    const my = (e.clientY - rect.top) * (size / rect.height);

    // Check stock click
    if (my >= topPad && my <= topPad + ch && mx >= leftPad && mx <= leftPad + cw) {
      if (stock.length) {
        const c = stock.pop();
        c.faceUp = true;
        waste.push(c);
        autoMove();
        draw();
        return;
      }
    }

    // Check waste click
    if (my >= topPad && my <= topPad + ch && mx >= leftPad + cw + gap && mx <= leftPad + (cw + gap) * 2) {
      const c = topCard(waste);
      if (c) {
        for (let f = 0; f < 4; f++) {
          if (canMoveToFoundation(c, foundations[f])) {
            waste.pop();
            foundations[f].push(c);
            autoMove();
            draw();
            return;
          }
        }
      }
    }

    // Check tableau card clicks
    for (let i = 0; i < 7; i++) {
      const pile = tableau[i];
      if (!pile.length) continue;
      const x = leftPad + (cw + gap) * i;
      const pileH = ch + (pile.length - 1) * stackOff;
      if (mx >= x && mx <= x + cw && my >= topPad + ch + 12 && my <= topPad + ch + 12 + pileH) {
        const idx = Math.min(Math.floor((my - (topPad + ch + 12)) / stackOff), pile.length - 1);
        const c = pile[idx];
        if (c && c.faceUp) {
          for (let f = 0; f < 4; f++) {
            if (canMoveToFoundation(c, foundations[f])) {
              pile.splice(idx, 1);
              foundations[f].push(c);
              const next = topCard(pile);
              if (next && !next.faceUp) next.faceUp = true;
              autoMove();
              draw();
              return;
            }
          }
        }
      }
    }
  }

  canvas.addEventListener("click", handleClick);
  draw();

  return {
    destroy() { canvas.removeEventListener("click", handleClick); ctx.clearRect(0, 0, size, size); },
    restart() { init(); draw(); }
  };
}
