// Pylos — 4×4 base pyramid stacking game. Each player has 15 spheres.
// On your turn: place a sphere on an empty spot of the current top layer (or
// any empty hole supported by 4 occupied lower-layer spheres on the same 2×2).
// If you form a 2×2 square of your colour anywhere, you may "take back" 1 or 2
// of your spheres from the surface. First player to deplete or fail to move
// loses (i.e., last sphere placed on top wins).
// AI: simple — place on a supporting hole if available, else random.

export function create(canvas) {
  const ctx = canvas.getContext("2d");

  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size;
  canvas.height = size + 40;
  const W = canvas.width, H = canvas.height;
  const statusEl = document.getElementById("playable-status");

  // Layer 0: 4×4 grid (positions (r,c) r∈0..3, c∈0..3). Layer 1: 3×3. Layer 2: 2×2. Layer 3: 1×1.
  // Each cell stores null, 'b' (you), or 'w' (ai). Use 2D arrays per layer.
  let layers, stock, turn, winner;
  function newGame(){
    layers = [
      Array.from({ length: 4 }, () => new Array(4).fill(null)),
      Array.from({ length: 3 }, () => new Array(3).fill(null)),
      Array.from({ length: 2 }, () => new Array(2).fill(null)),
      Array.from({ length: 1 }, () => new Array(1).fill(null)),
    ];
    stock = { b: 15, w: 15 };
    turn = "you"; winner = null;
  }
  newGame();

  function isSupported(lvl, r, c){
    if (lvl === 0) return true;
    const lower = layers[lvl - 1];
    return lower[r][c] && lower[r+1][c] && lower[r][c+1] && lower[r+1][c+1];
  }
  function isOpen(lvl, r, c){
    // not occupied; nothing on top
    if (layers[lvl][r][c]) return false;
    if (lvl < 3){
      const upper = layers[lvl+1];
      // upper indices that could rest on (r,c) are (r-1,c-1), (r-1,c), (r,c-1), (r,c)
      for (const [ur, uc] of [[r-1, c-1],[r-1, c],[r, c-1],[r, c]]){
        if (ur >= 0 && ur < upper.length && uc >= 0 && uc < upper.length && upper[ur][uc]) return false;
      }
    }
    return true;
  }
  function legalCells(){
    const out = [];
    for (let lvl = 0; lvl < 4; lvl++) for (let r = 0; r < layers[lvl].length; r++) for (let c = 0; c < layers[lvl].length; c++){
      if (isSupported(lvl, r, c) && isOpen(lvl, r, c)) out.push([lvl, r, c]);
    }
    return out;
  }

  function aiMove(){
    if (winner) return;
    if (!stock.w){ winner = "you"; draw(); return; }
    const cells = legalCells(); if (!cells.length){ winner = "you"; draw(); return; }
    // prefer high level cells (closer to the top)
    cells.sort((a, b) => b[0] - a[0]);
    const [lvl, r, c] = cells[0];
    layers[lvl][r][c] = 'w'; stock.w--;
    if (layers[3][0][0] === 'w'){ winner = "ai"; draw(); return; }
    if (!stock.w){ winner = "you"; draw(); return; }
    turn = "you"; draw();
  }

  function cellPos(lvl, r, c){
    const margin = 30; const baseStep = (size - 2*margin) / 4;
    // shift inner layers
    const off = lvl * baseStep / 2;
    return { x: margin + off + c * baseStep + baseStep/2, y: 30 + off + r * baseStep + baseStep/2, rad: baseStep * 0.4 };
  }

  function draw(){
    ctx.fillStyle = "#fafaf7"; ctx.fillRect(0, 0, W, H);
    ctx.font = "13px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#444";

    for (let lvl = 0; lvl < 4; lvl++){
      const L = layers[lvl];
      for (let r = 0; r < L.length; r++) for (let c = 0; c < L.length; c++){
        const p = cellPos(lvl, r, c);
        // outline
        ctx.beginPath(); ctx.arc(p.x, p.y, p.rad, 0, Math.PI*2);
        const supported = isSupported(lvl, r, c);
        ctx.fillStyle = L[r][c] === 'b' ? "#39c" : L[r][c] === 'w' ? "#e60" : (supported ? "#fff" : "#eee");
        ctx.fill();
        ctx.strokeStyle = supported && !L[r][c] && isOpen(lvl, r, c) ? "#0a0" : "#888"; ctx.stroke();
      }
    }
    ctx.fillStyle = "#444"; ctx.textAlign = "left";
    ctx.fillText(`stock — you: ${stock.b}   AI: ${stock.w}`, 20, H - 12);

    if (winner) statusEl.textContent = winner === "you" ? "you placed the apex — you win!" : "AI wins";
    else statusEl.textContent = turn === "you" ? "click a green-outlined hole to place a sphere" : "AI thinking…";
  }

  function pos(e){ const r = canvas.getBoundingClientRect(); return { x: (e.clientX-r.left)*(W/r.width), y: (e.clientY-r.top)*(H/r.height) }; }

  function findHole(x, y){
    for (let lvl = 3; lvl >= 0; lvl--){
      const L = layers[lvl];
      for (let r = 0; r < L.length; r++) for (let c = 0; c < L.length; c++){
        const p = cellPos(lvl, r, c);
        if (Math.hypot(x - p.x, y - p.y) < p.rad) return [lvl, r, c];
      }
    }
    return null;
  }

  function onClick(e){
    if (winner || turn !== "you") return;
    if (!stock.b){ winner = "ai"; draw(); return; }
    const { x, y } = pos(e); const h = findHole(x, y); if (!h) return;
    const [lvl, r, c] = h;
    if (layers[lvl][r][c]) return;
    if (!isSupported(lvl, r, c) || !isOpen(lvl, r, c)) return;
    layers[lvl][r][c] = 'b'; stock.b--;
    if (layers[3][0][0] === 'b'){ winner = "you"; draw(); return; }
    if (!stock.b){ winner = "ai"; draw(); return; }
    turn = "ai"; draw(); setTimeout(aiMove, 400);
  }

  canvas.addEventListener("click", onClick);
  draw();
  return {
    solve(){
      if (winner || turn !== "you") return;
      if (!stock.b){ winner = "ai"; draw(); return; }
      const __cells = legalCells();
      if (!__cells.length){ winner = "ai"; draw(); return; }
      const [__lvl, __r, __c] = __cells[Math.floor(Math.random() * __cells.length)];
      layers[__lvl][__r][__c] = 'b'; stock.b--;
      if (layers[3][0][0] === 'b'){ winner = "you"; draw(); return; }
      if (!stock.b){ winner = "ai"; draw(); return; }
      turn = "ai"; draw(); setTimeout(aiMove, 80);
    },
    destroy(){ canvas.removeEventListener("click", onClick); ctx.clearRect(0, 0, W, H); },
    restart(){ newGame(); draw(); },
  };
}
