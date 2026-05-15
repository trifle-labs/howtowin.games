// Yahtzee — playable canvas implementation
// ~160 lines, upper section only. Click dice to hold, roll button, select category.

export function create(canvas) {
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.parentElement.clientWidth - 24, 340);
  canvas.width = size;
  canvas.height = size;
  const statusEl = document.getElementById("playable-status");

  // State
  const dice = [0, 0, 0, 0, 0];
  const held = [false, false, false, false, false];
  let rollCount = 0;
  let round = 0;
  const categories = ["Ones", "Twos", "Threes", "Fours", "Fives", "Sixes"];
  const scores = categories.map(() => null);
  let total = 0;
  let gameOver = false;

  // Layout constants
  const dd = 36, dg = 7;
  const diceRowW = 5 * dd + 4 * dg;
  const diceX0 = (size - diceRowW) / 2;
  const diceY0 = 14;

  const btnW = 100, btnH = 26;
  const btnX = (size - btnW) / 2;
  const btnY = diceY0 + dd + 10;

  const catH = 20, catGap = 3;
  const catX = 16, catW = size - 32;
  const catY0 = btnY + btnH + 10;

  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
  }

  function roll() {
    for (let i = 0; i < 5; i++) {
      if (!held[i]) dice[i] = Math.ceil(Math.random() * 6);
    }
    rollCount++;
  }

  function scoreForCategory(catIdx) {
    const face = catIdx + 1;
    let sum = 0;
    for (let i = 0; i < 5; i++) {
      if (dice[i] === face) sum += face;
    }
    return sum;
  }

  function draw() {
    ctx.clearRect(0, 0, size, size);

    // Dice
    for (let i = 0; i < 5; i++) {
      const x = diceX0 + i * (dd + dg);
      ctx.fillStyle = held[i] ? "#fda" : "#fff";
      roundRect(x, diceY0, dd, dd, 5);
      ctx.fill();
      ctx.strokeStyle = "#555";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      if (dice[i] > 0) {
        ctx.fillStyle = "#222";
        ctx.font = "bold 16px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(dice[i], x + dd / 2, diceY0 + dd / 2);
      }
    }

    // Roll button
    ctx.fillStyle = rollCount >= 3 || gameOver ? "#bbb" : "#e66";
    roundRect(btnX, btnY, btnW, btnH, 6);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "bold 13px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(rollCount === 0 ? "Roll" : `Roll (${rollCount}/3)`, btnX + btnW / 2, btnY + btnH / 2);

    // Categories
    for (let i = 0; i < 6; i++) {
      const y = catY0 + i * (catH + catGap);
      const scored = scores[i] !== null;
      const canScore = !scored && rollCount > 0 && !gameOver;
      const potential = canScore ? scoreForCategory(i) : 0;

      ctx.fillStyle = scored ? "#eee" : (canScore ? "#f0f4ff" : "#f8f8f8");
      ctx.strokeStyle = "#ccc";
      ctx.lineWidth = 1;
      ctx.fillRect(catX, y, catW, catH);
      ctx.strokeRect(catX, y, catW, catH);

      ctx.fillStyle = scored ? "#999" : "#333";
      ctx.font = "13px sans-serif";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(categories[i], catX + 8, y + catH / 2);

      ctx.textAlign = "right";
      if (scored) {
        ctx.fillStyle = "#666";
        ctx.fillText(String(scores[i]), catX + catW - 8, y + catH / 2);
      } else if (canScore) {
        ctx.fillStyle = "#e66";
        ctx.fillText(String(potential), catX + catW - 8, y + catH / 2);
      }
    }

    // Total score
    const totalY = catY0 + 6 * (catH + catGap) + 10;
    ctx.fillStyle = "#222";
    ctx.font = "bold 14px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(`Total: ${total}`, catX + catW, totalY);

    // Upper section bonus indicator
    if (round > 0) {
      const bonus = total >= 63 ? "bonus: +35" : `need ${63 - total} for bonus`;
      ctx.fillStyle = "#888";
      ctx.font = "11px sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(bonus, catX + catW, totalY + 16);
    }

    // Status
    if (gameOver) {
      const bonus = total >= 63 ? 35 : 0;
      statusEl.textContent = `Game over! Total: ${total}${bonus > 0 ? ` (+${bonus} bonus = ${total + bonus})` : ""}`;
    } else {
      statusEl.textContent = `Round ${round + 1}/6  |  Rolls: ${rollCount}/3`;
    }
  }

  function handleClick(e) {
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (size / rect.width);
    const my = (e.clientY - rect.top) * (size / rect.height);

    // Click on dice — toggle hold
    for (let i = 0; i < 5; i++) {
      const x = diceX0 + i * (dd + dg);
      if (mx >= x && mx <= x + dd && my >= diceY0 && my <= diceY0 + dd) {
        if (dice[i] > 0 && rollCount > 0 && !gameOver) {
          held[i] = !held[i];
        }
        draw();
        return;
      }
    }

    // Click on roll button
    if (mx >= btnX && mx <= btnX + btnW && my >= btnY && my <= btnY + btnH) {
      if (rollCount < 3 && !gameOver) {
        roll();
        draw();
      }
      return;
    }

    // Click on a category to score
    for (let i = 0; i < 6; i++) {
      const y = catY0 + i * (catH + catGap);
      if (mx >= catX && mx <= catX + catW && my >= y && my <= y + catH) {
        if (scores[i] === null && rollCount > 0 && !gameOver) {
          scores[i] = scoreForCategory(i);
          total += scores[i];
          round++;
          if (round < 6) {
            dice.fill(0);
            held.fill(false);
            rollCount = 0;
          } else {
            gameOver = true;
          }
          draw();
        }
        return;
      }
    }
  }

  canvas.addEventListener("click", handleClick);
  draw();

  function reset() {
    dice.fill(0);
    held.fill(false);
    rollCount = 0;
    round = 0;
    for (let i = 0; i < 6; i++) scores[i] = null;
    total = 0;
    gameOver = false;
    draw();
  }

  return {
    destroy() {
      canvas.removeEventListener("click", handleClick);
      ctx.clearRect(0, 0, size, size);
    },
    restart() { reset(); }
  };
}
