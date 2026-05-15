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
          // Check all cells in the path are clear
          let clear = true;
          const checkDir = dc > 0 ? 1 : -1;
          for (let i = 1; i <= Math.abs(dc); i++) {
            const nc = car.dir ? car.c : car.c + (checkDir > 0 ? car.len - 1 + i : -i);
            const nr = car.dir ? car.r + (checkDir > 0 ? car.len - 1 + i : -i) : car.r;
            if (nr >= 0 && nr < g && nc >= 0 && nc < g) {
              if (gd[nr * g + nc] !== -1 && gd[nr * g + nc] !== car.id) { clear = false; break; }
            }
          }
          if (clear) {
            if (checkDir > 0) { car.c += 1; moves++; if (car.id === 0 && car.c + car.len >= g) won = true; }
            else { car.c -= 1; moves++; }
          }
        }
      } else if (car.dir === 1 && dc === 0) {
        const dir = dr > 0 ? 1 : -1;
        if (canMove(car, dir, 0)) {
          let clear = true;
          for (let i = 1; i <= Math.abs(dr); i++) {
            const nr = car.dir ? car.r + (dir > 0 ? car.len - 1 + i : -i) : car.r + (dir > 0 ? dir * i : -i);
            const nc = car.dir ? car.c : car.c;
            if (nr >= 0 && nr < g && nc >= 0 && nc < g) {
              if (gd[nr * g + nc] !== -1 && gd[nr * g + nc] !== car.id) { clear = false; break; }
            }
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

  canvas.addEventListener("click", handleClick);
  draw();

  return {
    destroy() { canvas.removeEventListener("click", handleClick); ctx.clearRect(0, 0, size, size); },
    restart() { reset(); draw(); }
  };
}
