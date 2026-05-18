// Pyraminx — pyramid twist puzzle. 4 faces, click to twist (Shift+click = CCW).
// State: 6 edge pieces × 2 orientations. Reverse-scramble solve.
// Each face shown as a triangle in a 2D diamond net.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 340);
  canvas.width = size; canvas.height = size;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) {
    const w = canvas.width, h = canvas.height;
    canvas.style.width = w + 'px'; canvas.width = w * dpr; canvas.height = h * dpr; ctx.scale(dpr, dpr);
  }
  const statusEl = document.getElementById("playable-status");

  // Face colors: yellow, blue, red, green
  const C = ["#fc0", "#36c", "#e44", "#4b4"];
  const FL = ["Y", "B", "R", "G"];

  // 6 edges, each connecting 2 faces: [fA, fB, colorA, colorB, orientation]
  // orientation 0 = colorA visible on fA, colorB visible on fB
  // orientation 1 = colorB visible on fA, colorA visible on fB
  // Edge adjacency per face (clockwise from outside):
  //   face 0: edges 0,2,1   face 1: edges 0,3,4
  //   face 2: edges 1,3,5   face 3: edges 2,4,5
  let edges, scrambleSeq, solveSeq, solveIdx;

  function initState() {
    edges = [];
    for (let i = 0; i < 6; i++) {
      // edge i connects two faces — assign their colors
      const pairs = [[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]];
      edges.push({ fA: pairs[i][0], fB: pairs[i][1], orientation: 0 });
    }
  }

  // Cycle edges on a face clockwise (cw=true) or counter-clockwise
  function twist(face, cw) {
    const faceEdges = [[0,2,1],[0,3,4],[1,3,5],[2,4,5]];
    const idx = faceEdges[face];
    if (cw) {
      // cycle forward: e0←e2, e2←e1, e1←e0  (swap e1,e0, then e2 into old e0 spot)
      const e0 = edges[idx[0]], orient0 = e0.orientation;
      edges[idx[0]] = edges[idx[2]];
      edges[idx[2]] = edges[idx[1]];
      edges[idx[1]] = e0;
      // all edges on this face flip orientation
    } else {
      const e0 = edges[idx[0]], orient0 = e0.orientation;
      edges[idx[0]] = edges[idx[1]];
      edges[idx[1]] = edges[idx[2]];
      edges[idx[2]] = e0;
    }
    // orientation flips for edges that swapped adjacency faces
    // Each edge on this face flips because it moves to a different position
    for (const ei of idx) {
      edges[ei].orientation ^= 1;
    }
  }

  function randomScramble() {
    const seq = [];
    for (let i = 0; i < 10; i++) {
      const f = Math.floor(Math.random() * 4);
      const cw = Math.random() < 0.5;
      twist(f, cw);
      seq.push({ face: f, cw });
    }
    return seq;
  }

  function init() { initState(); scrambleSeq = randomScramble(); }
  init();

  function checkSolved() {
    for (const e of edges) {
      if (e.orientation !== 0) return false;
    }
    return true;
  }

  // ── Drawing ──────────────────────────────────────────────
  // Diamond net with 4 faces. Face 0 top, faces 1-3 form the body.
  // s = triangle side length
  const s = size * 0.26;
  const h = s * Math.sqrt(3) / 2;

  // Face centers in the net layout
  const cx = size / 2;
  const cy = size / 2;

  // For each face, define the 3 vertices of its triangle
  function faceVerts(f) {
    // Face 0: top, pointing up
    // Face 1: middle-left, pointing down
    // Face 2: middle-right, pointing down
    // Face 3: bottom, pointing up
    const net = [
      // [v0, v1, v2]  (v0 = top of upward triangle, or left of downward)
      // face 0, up, at top
      { v0: [cx, cy - h*1.8], v1: [cx - s, cy - h*0.8], v2: [cx + s, cy - h*0.8] },
      // face 1, down, middle row left
      { v0: [cx - s*1.3, cy - h*0.2], v1: [cx - s*0.3, cy - h*0.2], v2: [cx - s*0.8, cy + h*0.8] },
      // face 2, down, middle row right
      { v0: [cx + s*0.3, cy - h*0.2], v1: [cx + s*1.3, cy - h*0.2], v2: [cx + s*0.8, cy + h*0.8] },
      // face 3, up, bottom
      { v0: [cx, cy + h*0.4], v1: [cx - s, cy + h*1.4], v2: [cx + s, cy + h*1.4] },
    ];
    return net[f];
  }

  function draw() {
    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = "#eee"; ctx.fillRect(0, 0, size, size);

    const faceEdges = [[0,2,1],[0,3,4],[1,3,5],[2,4,5]];

    // Draw each face
    for (let f = 0; f < 4; f++) {
      const v = faceVerts(f);
      const pts = [v.v0, v.v1, v.v2];

      // Compute centroid for label
      const centX = (pts[0][0] + pts[1][0] + pts[2][0]) / 3;
      const centY = (pts[0][1] + pts[1][1] + pts[2][1]) / 3;

      // Draw colored edge strips along each side
      const fe = faceEdges[f];
      for (let side = 0; side < 3; side++) {
        const pA = pts[side];
        const pB = pts[(side + 1) % 3];
        const midX = (pA[0] + pB[0]) / 2;
        const midY = (pA[1] + pB[1]) / 2;
        const dx = pB[0] - pA[0], dy = pB[1] - pA[1];
        const len = Math.sqrt(dx * dx + dy * dy);
        const nx = -dy / len * 8, ny = dx / len * 8; // inward normal

        const ei = fe[side];
        const e = edges[ei];
        // Determine which color to show on this face
        const col = e.orientation === 0
          ? (e.fA === f ? C[e.fA] : C[e.fB])
          : (e.fA === f ? C[e.fB] : C[e.fA]);

        // Draw a small colored circle at the edge midpoint
        ctx.beginPath();
        ctx.arc(midX + nx * 0.5, midY + ny * 0.5, 7, 0, Math.PI * 2);
        ctx.fillStyle = col;
        ctx.fill();
        ctx.strokeStyle = "#333";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw triangle outline
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      ctx.lineTo(pts[1][0], pts[1][1]);
      ctx.lineTo(pts[2][0], pts[2][1]);
      ctx.closePath();
      ctx.strokeStyle = "#666";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Face label
      ctx.fillStyle = "#888";
      ctx.font = "11px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(FL[f], centX, centY + 14);
    }

    const solved = checkSolved();
    statusEl.textContent = solved ? "solved!" : "click a face to twist it";
  }

  function handleClick(e) {
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (size / rect.width);
    const my = (e.clientY - rect.top) * (size / rect.height);

    // Hit test each face using point-in-triangle test
    for (let f = 0; f < 4; f++) {
      const v = faceVerts(f);
      const pts = [v.v0, v.v1, v.v2];
      if (pointInTriangle(mx, my, pts[0], pts[1], pts[2])) {
        twist(f, !(e.shiftKey || e.ctrlKey));
        draw();
        return;
      }
    }
  }

  function pointInTriangle(px, py, a, b, c) {
    const d1 = sign(px, py, a[0], a[1], b[0], b[1]);
    const d2 = sign(px, py, b[0], b[1], c[0], c[1]);
    const d3 = sign(px, py, c[0], c[1], a[0], a[1]);
    const hasNeg = (d1 < 0) || (d2 < 0) || (d3 < 0);
    const hasPos = (d1 > 0) || (d2 > 0) || (d3 > 0);
    return !(hasNeg && hasPos);
  }
  function sign(px, py, x1, y1, x2, y2) {
    return (px - x2) * (y1 - y2) - (x1 - x2) * (py - y2);
  }

  canvas.addEventListener("click", handleClick);
  draw();

  return {
    destroy() { canvas.removeEventListener("click", handleClick); ctx.clearRect(0, 0, size, size); },
    restart() { init(); solveSeq = null; solveIdx = 0; draw(); },
    solve() {
      const solved = checkSolved();
      if (solved) { draw(); return; }
      if (!solveSeq) { solveSeq = [...scrambleSeq].reverse(); solveIdx = 0; }
      if (solveIdx < solveSeq.length) {
        const m = solveSeq[solveIdx++];
        twist(m.face, !m.cw);
      }
      if (solveIdx >= solveSeq.length) { solveSeq = null; }
      draw();
    },
  };
}
