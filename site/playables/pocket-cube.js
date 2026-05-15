// Pocket Cube (2×2×2) — playable canvas implementation
// ~190 lines, 2D net, click face to twist (Shift+click = CCW).

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 340);
  canvas.width = size; canvas.height = size;
  const statusEl = document.getElementById("playable-status");
  const gap = 4, cell = Math.floor((size - 40) / 6);
  const faceSz = cell * 2 + gap;
  const C = ["#fff","#f80","#6b4","#e44","#48a","#ff0"];
  const L = ["U","L","F","R","B","D"];

  let st;
  function initState() { st = []; for (let f = 0; f < 6; f++) for (let i = 0; i < 4; i++) st.push(f); }

  function twist(face, dir) {
    // Absolute sticker index cycles — face itself (4) + adjacent ring (8)
    const cycles = {
      0: [0,1,3,2, 4,5,8,9,12,13,16,17],
      5: [20,21,23,22, 18,19,14,15,10,11,6,7],
      2: [8,9,11,10, 2,3,13,15,22,23,4,6],
      4: [16,17,19,18, 0,1,7,5,20,21,14,12],
      1: [4,6,7,5, 0,2,8,10,20,18,16,14],
      3: [12,14,15,13, 1,3,17,19,21,23,9,11],
    };
    const c = cycles[face]; const n = c.length; const t = [];
    for (let i = 0; i < n; i++) t.push(st[c[(i - dir + n) % n]]);
    for (let i = 0; i < n; i++) st[c[i]] = t[i];
  }

  function init() { initState(); for (let i = 0; i < 10; i++) twist(Math.floor(Math.random() * 6), Math.random() < 0.5 ? 1 : -1); }
  init();

  const net = [[-1,-1,0,-1],[1,2,3,4],[-1,-1,5,-1]];

  function draw() {
    ctx.clearRect(0,0,size,size);
    ctx.fillStyle = "#eee"; ctx.fillRect(0,0,size,size);
    const ox = (size - faceSz * 4 + gap) / 2, oy = (size - faceSz * 3 + gap) / 2;
    for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) {
      const fi = net[r][c]; if (fi < 0) continue;
      const bx = ox + c * faceSz, by = oy + r * faceSz;
      for (let i = 0; i < 4; i++) {
        const x = bx + (i % 2) * (cell + gap), y = by + Math.floor(i / 2) * (cell + gap);
        ctx.fillStyle = C[st[fi * 4 + i]];
        ctx.fillRect(x, y, cell, cell);
        ctx.strokeStyle = "#666"; ctx.lineWidth = 0.5; ctx.strokeRect(x, y, cell, cell);
      }
      ctx.fillStyle = "#888"; ctx.font = "10px sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "top";
      ctx.fillText(L[fi], bx + faceSz / 2 - gap / 2, by + faceSz + 2);
    }
    const solved = st.every((v, i) => v === Math.floor(i / 4));
    statusEl.textContent = solved ? "solved!" : "click face to twist";
  }

  function handleClick(e) {
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (size / rect.width);
    const my = (e.clientY - rect.top) * (size / rect.height);
    const ox = (size - faceSz * 4 + gap) / 2, oy = (size - faceSz * 3 + gap) / 2;
    for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) {
      const fi = net[r][c]; if (fi < 0) continue;
      const bx = ox + c * faceSz, by = oy + r * faceSz;
      if (mx >= bx && mx <= bx + faceSz && my >= by && my <= by + faceSz) {
        twist(fi, e.shiftKey || e.ctrlKey ? -1 : 1); draw(); return;
      }
    }
  }

  canvas.addEventListener("click", handleClick); draw();
  return {
    destroy() { canvas.removeEventListener("click", handleClick); ctx.clearRect(0,0,size,size); },
    restart() { init(); draw(); }
  };
}
