// Tower of Hanoi — playable canvas implementation
// ~90 lines, click-based: select top disk from one peg, place on another.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 360);
  canvas.width = size;
  canvas.height = size;
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 1) {
    const w = canvas.width, h = canvas.height;
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    canvas.width = w * dpr; canvas.height = h * dpr; ctx.scale(dpr, dpr);
  }

  const n = 4, pegs = [[], [], []];
  let selected = null, moves = 0, won = false, solveTimer = null;
  const statusEl = document.getElementById("playable-status");

  // Initialize: all disks on peg 0
  for (let i = n; i > 0; i--) pegs[0].push(i);

  const pw = size * 0.06, ph = size * 0.6, base = size * 0.85; // peg width, height, base Y
  const colors = ["#e66", "#e90", "#eb0", "#6b4", "#48a", "#a6c", "#c6a"];

  function pegX(i) { return size * (0.2 + i * 0.3); }

  function draw() {
    ctx.clearRect(0, 0, size, size);

    // base line
    ctx.fillStyle = "#876";
    ctx.fillRect(size * 0.05, base, size * 0.9, size * 0.04);

    for (let p = 0; p < 3; p++) {
      const px = pegX(p);
      // peg
      ctx.fillStyle = "#654";
      ctx.fillRect(px - pw / 2, base - ph, pw, ph);

      // disks
      for (let d = 0; d < pegs[p].length; d++) {
        const w = size * 0.12 + pegs[p][d] * size * 0.045;
        const h = size * 0.035;
        const y = base - h * (d + 1);
        const lift = (selected && selected.peg === p && selected.disk === d) ? -size * 0.08 : 0;
        ctx.fillStyle = colors[pegs[p][d] % colors.length];
        ctx.fillRect(px - w / 2, y + lift, w, h);
        ctx.strokeStyle = "#222";
        ctx.lineWidth = 1;
        ctx.strokeRect(px - w / 2, y + lift, w, h);
      }
    }

    statusEl.textContent = won ? `solved in ${moves} moves!` : `moves: ${moves}`;
  }

  function handleClick(e) {
    if (won) return;
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (size / rect.width);

    // which peg?
    const peg = [0, 1, 2].reduce((a, i) => Math.abs(mx - pegX(i)) < Math.abs(mx - pegX(a)) ? i : a);
    if (selected === null) {
      if (pegs[peg].length === 0) return;
      selected = { peg, disk: pegs[peg].length - 1 };
    } else {
      const disk = pegs[selected.peg][pegs[selected.peg].length - 1];
      if (pegs[peg].length === 0 || pegs[peg][pegs[peg].length - 1] > disk) {
        pegs[selected.peg].pop();
        pegs[peg].push(disk);
        moves++;
        if (pegs[2].length === n) { won = true; }
      }
      selected = null;
    }
    draw();
  }

  canvas.addEventListener("click", handleClick);
  draw();

  return {
    destroy() {
      canvas.removeEventListener("click", handleClick);
      if (solveTimer) { clearInterval(solveTimer); solveTimer = null; }
      ctx.clearRect(0, 0, size, size);
    },
    restart() {
      if (solveTimer) { clearInterval(solveTimer); solveTimer = null; }
      pegs[0].length = 0; pegs[1].length = 0; pegs[2].length = 0;
      for (let i = n; i > 0; i--) pegs[0].push(i);
      selected = null; moves = 0; won = false;
      draw();
    },
    solve() {
      if (won || solveTimer) return;
      // Generate optimal solution sequence
      const seq = [];
      function gen(num, from, to, via) {
        if (num === 0) return;
        gen(num - 1, from, via, to);
        seq.push({ from, to });
        gen(num - 1, via, to, from);
      }
      // Count disks on each peg to determine current state
      // For simplicity: if all disks are on peg 0, solve from scratch
      // If some are on other pegs, solve from current state by moving everything to peg 2
      // Actually, for a clean solve experience, restart and solve from initial state
      // But better: solve from wherever the user has gotten to
      // Let's just always solve from the initial state
      pegs[0].length = 0; pegs[1].length = 0; pegs[2].length = 0;
      for (let i = n; i > 0; i--) pegs[0].push(i);
      selected = null; moves = 0; won = false;
      gen(n, 0, 2, 1);
      let i = 0;
      solveTimer = setInterval(() => {
        if (i >= seq.length) {
          clearInterval(solveTimer);
          solveTimer = null;
          won = true;
          draw();
          return;
        }
        const { from, to } = seq[i];
        pegs[to].push(pegs[from].pop());
        moves++;
        draw();
        i++;
      }, 350);
    }
  };
}
