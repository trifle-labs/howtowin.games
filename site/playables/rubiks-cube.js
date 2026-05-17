// Rubik's Cube (3×3×3) — playable canvas implementation
// ~200 lines, 2D net, click face to twist (Shift+click = CCW).

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 380);
  canvas.width = size; canvas.height = size;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) {
    const w = canvas.width, h = canvas.height;
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    canvas.width = w * dpr; canvas.height = h * dpr; ctx.scale(dpr, dpr);
  }
  const statusEl = document.getElementById("playable-status");
  const gap = 3, cell = Math.floor((size - 40) / (4 * 3 + 3));
  const faceSz = cell * 3 + gap * 2;
  const C = ["#fff","#f80","#6b4","#e44","#48a","#ff0"];
  const L = ["U","L","F","R","B","D"];
  // Face orientations (row-major within each face, 0=top-left):
  // U: top layer, D: bottom, F: front, B: back, L: left, R: right
  // Sticker layout: face*9 + i, where i is row*3 + col, 4=center
  let st, scrambleSeq = [], solveSeq = null, solveIdx = 0;

  function initState() { st = []; for (let f = 0; f < 6; f++) for (let i = 0; i < 9; i++) st.push(f); }

  // Absolute sticker-index cycles for each face twist.
  // Each entry: [face_8cycle..., adj_12cycle...]  (20 stickers cycle per twist)
  // face cycle: corners then edges (center at 4 is skipped)
  // adj cycle: 4 faces × 3 cells each, going around the ring
  const cycles = {
    // U: F top → R top → B bottom-rev → L top-rev
    0: [0,2,8,6, 1,5,7,3,  18,19,20, 27,28,29, 44,43,42, 11,10,9],
    // D: F bottom → L bottom-rev → B top → R bottom-rev
    5: [45,47,53,51, 46,50,52,48,  24,23,22, 33,32,31, 40,41,42, 15,16,17],
    // F: U bottom → R left-rev → D bottom-rev → L right
    2: [18,20,26,24, 19,23,25,21,  6,7,8, 33,30,27, 47,46,45, 15,12,9],
    // B: U top → L left → D top → R right-rev
    4: [36,38,44,42, 37,41,43,39,  0,1,2, 9,12,15, 53,52,51, 35,32,29],
    // L: U left → F left → D left → B right-rev
    1: [9,11,17,15, 10,14,16,12,  0,3,6, 18,21,24, 45,48,51, 44,41,38],
    // R: U right → B left-rev → D right → F right
    3: [27,29,35,33, 28,32,34,30,  2,5,8, 36,39,42, 47,50,53, 26,23,20],
  };

  function twist(face, dir) {
    const c = cycles[face]; const n = c.length; const t = [];
    for (let i = 0; i < n; i++) t.push(st[c[(i - dir + n) % n]]);
    for (let i = 0; i < n; i++) st[c[i]] = t[i];
  }

  function init() { initState(); scrambleSeq = []; for (let i = 0; i < 20; i++) { const f = Math.floor(Math.random() * 6); const d = Math.random() < 0.5 ? 1 : -1; twist(f, d); scrambleSeq.push({face:f, dir:d}); } }
  init();

  const net = [[-1,-1,0,-1],[1,2,3,4],[-1,-1,5,-1]];

  function draw() {
    ctx.clearRect(0,0,size,size); ctx.fillStyle = "#eee"; ctx.fillRect(0,0,size,size);
    const ox = (size - faceSz * 4 + gap) / 2, oy = (size - faceSz * 3 + gap) / 2;
    for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) {
      const fi = net[r][c]; if (fi < 0) continue;
      const bx = ox + c * faceSz, by = oy + r * faceSz;
      for (let i = 0; i < 9; i++) {
        if (i === 4) continue;
        const x = bx + (i % 3) * (cell + gap), y = by + Math.floor(i / 3) * (cell + gap);
        ctx.fillStyle = C[st[fi * 9 + i]];
        ctx.fillRect(x, y, cell, cell);
        ctx.strokeStyle = "#666"; ctx.lineWidth = 0.5; ctx.strokeRect(x, y, cell, cell);
      }
      ctx.fillStyle = "#888"; ctx.font = "9px sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "top";
      ctx.fillText(L[fi], bx + faceSz / 2 - gap, by + faceSz + 1);
    }
    const solved = st.every((v, i) => v === Math.floor(i / 9));
    statusEl.textContent = solved ? "solved!" : "click face (Shift+click = CCW)";
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
    restart() { init(); solveSeq = null; solveIdx = 0; draw(); },
    solve() {
      const solved = st.every((v, i) => v === Math.floor(i / 9));
      if (solved) { draw(); return; }
      if (!solveSeq) { solveSeq = [...scrambleSeq].reverse(); solveIdx = 0; }
      if (solveIdx < solveSeq.length) {
        const m = solveSeq[solveIdx++];
        twist(m.face, -m.dir);
      }
      if (solveIdx >= solveSeq.length) { solveSeq = null; }
      draw();
    }
  };
}
