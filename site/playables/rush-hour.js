// Rush Hour — playable canvas implementation
// ~130 lines, click car to select, then click arrow to move.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 340);
  canvas.width = size;
  canvas.height = size;

  const g = 6, cell = size / g;
  const statusEl = document.getElementById("playable-status");

  // Car { id, r, c, len, dir: 0=H, 1=V, color }
  let cars, selected = null, won = false, moves = 0;

  // Puzzle: red car is id 0, must exit right
  const puzzle = [
    { id: 0, r: 2, c: 1, len: 2, dir: 0, color: "#e44" }, // red car
    { id: 1, r: 0, c: 2, len: 2, dir: 1, color: "#48a" },
    { id: 2, r: 1, c: 0, len: 3, dir: 0, color: "#6b4" },
    { id: 3, r: 3, c: 3, len: 2, dir: 0, color: "#e90" },
    { id: 4, r: 4, c: 4, len: 2, dir: 1, color: "#a6c" },
    { id: 5, r: 5, c: 0, len: 2, dir: 0, color: "#6bb" },
    { id: 6, r: 0, c: 4, len: 2, dir: 1, color: "#c6a" },
  ];

  function reset() {
    cars = puzzle.map(c => ({ ...c }));
    selected = null; won = false; moves = 0;
  }
  reset();

  function grid() {
    const gd = Array.from({ length: g * g }, () => -1);
    for (const car of cars) {
      for (let i = 0; i < car.len; i++) {
        const r = car.dir ? car.r + i : car.r;
        const c = car.dir ? car.c : car.c + i;
        if (r >= 0 && r < g && c >= 0 && c < g) gd[r * g + c] = car.id;
      }
    }
    return gd;
  }

  function canMove(car, dr, dc) {
    for (let i = 0; i < car.len; i++) {
      const nr = car.dir ? car.r + dr + i : car.r + dr;
      const nc = car.dir ? car.c + dc : car.c + dc + i;
      if (nr < 0 || nr >= g || nc < 0 || nc >= g) {
        // red car can exit right
        if (car.id === 0 && dr === 0 && dc === 1 && nr >= 0 && nr < g) continue;
        return false;
      }
    }
    return true;
  }

  function draw() {
    ctx.clearRect(0, 0, size, size);
    // Grid
    ctx.strokeStyle = "#ccc";
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= g; i++) {
      ctx.beginPath(); ctx.moveTo(i * cell, 0); ctx.lineTo(i * cell, size); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * cell); ctx.lineTo(size, i * cell); ctx.stroke();
    }

    // Exit marker
    ctx.fillStyle = won ? "#4a4" : "#ccc";
    ctx.fillRect(size, 2 * cell, cell * 0.3, 2 * cell);

    for (const car of cars) {
      const x = car.c * cell, y = car.r * cell;
      const w = car.dir ? cell : cell * car.len;
      const h = car.dir ? cell * car.len : cell;
      ctx.fillStyle = selected === car.id ? "#ff8" : car.color;
      ctx.fillRect(x + 1, y + 1, w - 2, h - 2);
      ctx.strokeStyle = "#222";
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 1, y + 1, w - 2, h - 2);
    }

    statusEl.textContent = won ? `solved in ${moves} moves!` : `${moves} moves`;
  }

  function handleClick(e) {
    if (won) return;
    const rect = canvas.getBoundingClientRect();
    const c = Math.floor((e.clientX - rect.left) * (size / rect.width) / cell);
    const r = Math.floor((e.clientY - rect.top) * (size / rect.height) / cell);
    const gd = grid();
    const idx = r * g + c;
    const hit = idx >= 0 && idx < g * g ? gd[idx] : -1;

    if (selected !== null) {
      const car = cars[selected];
      // Try to move in the clicked direction
      const dr = r - car.r, dc = c - car.c;
      if (car.dir === 0 && dr === 0) {
        const dir = dc > 0 ? 1 : -1;
        if (canMove(car, 0, dir)) {
          let clear = true;
          const nc = dir > 0 ? car.c + car.len : car.c - 1;
          if (nc >= 0 && nc < g) {
            if (gd[car.r * g + nc] !== -1 && gd[car.r * g + nc] !== car.id) clear = false;
          }
          if (clear) {
            if (dir > 0) { car.c += 1; moves++; if (car.id === 0 && car.c + car.len >= g) won = true; }
            else { car.c -= 1; moves++; }
          }
        }
      } else if (car.dir === 1 && dc === 0) {
        const dir = dr > 0 ? 1 : -1;
        if (canMove(car, dir, 0)) {
          let clear = true;
          const nr = dir > 0 ? car.r + car.len : car.r - 1;
          if (nr >= 0 && nr < g) {
            if (gd[nr * g + car.c] !== -1 && gd[nr * g + car.c] !== car.id) clear = false;
          }
          if (clear) { car.r += dir > 0 ? 1 : -1; moves++; }
        }
      }
      selected = null;
      draw();
      return;
    }

    if (hit >= 0) { selected = hit; draw(); }
  }

  // ── BFS solver ──────────────────────────────────────────────
  let solveTimer = null;

  function carStateKey(cars) {
    return cars.map(c => c.r + "," + c.c).join(";");
  }

  function bfsSolve(startCars) {
    const startKey = carStateKey(startCars);
    const parent = new Map();
    parent.set(startKey, null);
    const queue = [startCars.map(c => ({ ...c }))];
    let qIdx = 0;
    const maxNodes = 500000;
    const startTime = Date.now();

    while (qIdx < queue.length && qIdx < maxNodes && Date.now() - startTime < 5000) {
      const cur = queue[qIdx++];
      // Check if red car can exit
      const red = cur[0];
      if (red.c + red.len >= g) {
        // Reconstruct path
        const path = [];
        let ck = carStateKey(cur);
        while (parent.get(ck) !== null) {
          const entry = parent.get(ck);
          path.unshift(entry);
          ck = entry.fromKey;
        }
        return path;
      }
      // For each car, try all possible moves
      for (let bi = 0; bi < cur.length; bi++) {
        const car = cur[bi];
        const dirs = car.dir === 0 ? [[0,-1],[0,1]] : [[-1,0],[1,0]];
        for (const [dr, dc] of dirs) {
          // Slide as far as possible in this direction
          let steps = 0;
          while (true) {
            const nr = car.r + dr * (steps + 1);
            const nc = car.c + dc * (steps + 1);
            // Check bounds
            if (car.dir === 0) {
              if (nc < 0 || (bi === 0 && nc + car.len >= g + 1)) break;
              // For non-red cars, check right bound
              if (bi !== 0 && nc + car.len > g) break;
            } else {
              if (nr < 0 || nr + car.len > g) break;
            }
            // Check no overlap
            let ok = true;
            for (let i = 0; i < car.len; i++) {
              const cr = car.dir ? nr + i : nr;
              const cc = car.dir ? nc : nc + i;
              if (bi === 0 && cr >= 0 && cr < g && cc >= g) { /* red car exiting */ continue; }
              if (cr < 0 || cr >= g || cc < 0 || cc >= g) { ok = false; break; }
              // Check other cars
              for (let oj = 0; oj < cur.length; oj++) {
                if (oj === bi) continue;
                const oc = cur[oj];
                for (let oi = 0; oi < oc.len; oi++) {
                  const or2 = oc.dir ? oc.r + oi : oc.r;
                  const oc2 = oc.dir ? oc.c : oc.c + oi;
                  if (or2 === cr && oc2 === cc) { ok = false; break; }
                }
                if (!ok) break;
              }
              if (!ok) break;
            }
            if (!ok) break;
            steps++;
          }
          if (steps === 0) continue;
          // Apply the full slide as one BFS step (greedy: take the furthest valid move)
          const newCars = cur.map(c => ({ ...c }));
          newCars[bi].r += dr * steps;
          newCars[bi].c += dc * steps;
          const nk = carStateKey(newCars);
          if (!parent.has(nk)) {
            parent.set(nk, { fromKey: carStateKey(cur), blockId: bi, dr: dr * steps, dc: dc * steps });
            queue.push(newCars);
          }
        }
      }
    }
    return null;
  }

  canvas.addEventListener("click", handleClick);
  draw();

  return {
    destroy() { canvas.removeEventListener("click", handleClick); if (solveTimer) { clearInterval(solveTimer); solveTimer = null; } ctx.clearRect(0, 0, size, size); },
    restart() { reset(); draw(); },
    solve() {
      if (won || solveTimer) return;
      statusEl.textContent = "solving…";
      draw();
      setTimeout(() => {
        const path = bfsSolve(cars);
        if (!path) { draw(); statusEl.textContent = "no solution found"; return; }
        // Animate from current position
        selected = null;
        draw();
        let i = 0;
        solveTimer = setInterval(() => {
          if (i >= path.length) {
            clearInterval(solveTimer);
            solveTimer = null;
            won = true;
            draw();
            return;
          }
          const step = path[i];
          const car = cars[step.blockId];
          car.r += step.dr;
          car.c += step.dc;
          moves++;
          draw();
          i++;
        }, 150);
      }, 50);
    }
  };
}
