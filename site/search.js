import { pipeline, env } from "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.2";
env.allowLocalModels = false;

const DIM = 384;
const SHOW_INITIAL = 5;

const $ = (id) => document.getElementById(id);
const $q = $("q");
const $status = $("status");
const $grid = $("category-grid");
const $detail = $("detail-view");
const $results = $("results");
const $backdrop = $("results-backdrop");
const $clear = $("clear-btn");

let meta = [];
let vecs = null;
let extract = null;
let allCategories = [];
let gameMeta = {};        // slug → metadata
let flatGames = [];       // all games (heads + members) merged with metadata
let familyMeta = {};      // family id → {title, blurb, icon_svg}
let currentFilters = {
  q: "",
  playable: false,
  status: new Set(),
  players: new Set(),
  family: new Set(),
  mechanic: new Set(),
  complexity: new Set(),
  popularity: new Set(),
  age: new Set(),
};

// ── helpers ──────────────────────────────────────────────────────────────

function setStatus(msg) { $status.textContent = msg; }

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" })[c]);
}

function badgeClass(status) {
  const s = status.toLowerCase();
  if (s.includes("unsolved") || s.includes("open") || s.includes("unknown")) return "unsolved";
  if ((s.includes("solved") || s.includes("complete")) && !(s.includes("partial") || s.includes("partially"))) return "solved";
  if (s.includes("partial") || s.includes("analysed") || s.includes("pspace") || s.includes("np-")) return "partial";
  return "unsolved";
}

// ── routing ──────────────────────────────────────────────────────────────

function getRoute() {
  const hash = location.hash.slice(1);
  if (!hash) return { view: "grid" };
  if (hash.startsWith("game/")) return { view: "game", path: hash.slice(5) };
  if (hash.startsWith("search/")) return { view: "search", q: hash.slice(7) };
  // treat unknown hash as game slug
  return { view: "game", path: hash };
}

function navigate(hash) {
  if (hash === location.hash || (!hash && !location.hash)) return;
  location.hash = hash;
}

function onHashChange() {
  const route = getRoute();
  if (route.view === "game") {
    openGame(route.path, true);
  } else {
    hideDetail();
  }
}

// ── markdown renderer ────────────────────────────────────────────────────

function fmtInline(text) {
  return String(text)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/(?<!\w)\*(?!\*)(.+?)(?<!\*)\*(?!\w)/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, t, u) => {
      if (u.startsWith("http://") || u.startsWith("https://") || u.startsWith("mailto:"))
        return `<a href="${u}" target="_blank" rel="noopener">${t}</a>`;
      if (u.startsWith("#"))
        return `<a href="${u}" class="local-anchor">${t}</a>`;
      // Internal .md → unified game route (openGame handles multi-path resolution)
      const clean = u.replace(/^\.\.\//, "").replace(/^\.\//, "").replace(/^games\//, "").replace(/\.md(?=#|$)/, "");
      return `<a href="#game/${clean}" class="game-link">${t}</a>`;
    });
}

function renderMd(text) {
  const lines = text.split("\n");
  const out = [];
  let paragraph = [];
  let inTable = false;
  let inList = false;
  let inBlockquote = false;
  let blockquoteBuf = [];

  function flushParagraph() {
    if (paragraph.length) {
      out.push(`<p>${paragraph.join(" ")}</p>`);
      paragraph = [];
    }
  }

  function flushBlockquote() {
    if (inBlockquote) {
      out.push(`<blockquote>${blockquoteBuf.join(" ")}</blockquote>`);
      blockquoteBuf = [];
      inBlockquote = false;
    }
  }

  function closeTable() {
    if (inTable) { out.push("</table>"); inTable = false; }
  }

  function openList(ordered) {
    out.push(ordered ? "<ol>" : "<ul>");
    inList = true;
  }

  function closeList() {
    if (inList) { out.push(inList === "ol" ? "</ol>" : "</ul>"); inList = false; }
  }

  for (const raw of lines) {
    const trimmed = raw.trim();

    // table rows — wrap in <table>
    if (/^\|.+\|$/.test(trimmed) && raw.includes("|")) {
      const cells = trimmed.split("|").slice(1, -1).map(c => c.trim());
      if (cells.every(c => /^:?-+:?$/.test(c))) continue;
      flushParagraph();
      flushBlockquote();
      closeList();
      if (!inTable) { out.push("<table>"); inTable = true; }
      out.push("<tr>" + cells.map(c => `<td>${fmtInline(esc(c))}</td>`).join("") + "</tr>");
      continue;
    }
    if (inTable) closeTable();

    let line = fmtInline(raw);

    if (/^---/.test(trimmed)) {
      flushParagraph();
      flushBlockquote();
      closeList();
      out.push('<hr class="md-hr">');
      continue;
    }

    if (!trimmed) {
      flushParagraph();
      flushBlockquote();
      closeList();
    } else if (/^# /.test(trimmed)) {
      flushParagraph();
      flushBlockquote();
      closeList();
    } else if (/^##+\s+/.test(trimmed)) {
      flushParagraph();
      flushBlockquote();
      closeList();
      const hText = line.replace(/^##+\s+/, "");
      const hId = hText.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      out.push(`<h2 id="${hId}">${hText}</h2>`);
    } else if (/^>\s+/.test(trimmed)) {
      flushParagraph();
      closeList();
      blockquoteBuf.push(line.replace(/^>\s+/, ""));
      inBlockquote = true;
    } else if (/^[-*]\s/.test(trimmed)) {
      flushParagraph();
      flushBlockquote();
      if (!inList) openList(false);
      out.push(`<li>${line.replace(/^[-*]\s+/, "")}</li>`);
    } else if (/^\d+[.)]\s/.test(trimmed)) {
      flushParagraph();
      flushBlockquote();
      if (!inList) openList(true);
      out.push(`<li>${line.replace(/^\d+[.)]\s+/, "")}</li>`);
    } else if (inList && trimmed) {
      if (out.length) {
        const last = out[out.length - 1];
        if (last.endsWith('</li>')) {
          out[out.length - 1] = last.slice(0, -5) + line + '</li>';
        }
      }
    } else {
      flushBlockquote();
      closeList();
      paragraph.push(line);
    }
  }
  flushParagraph();
  flushBlockquote();
  closeTable();
  closeList();
  return out.join("\n");
}

// ── data loading ─────────────────────────────────────────────────────────

async function loadJSON(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${url}: ${r.status}`);
  return r.json();
}

async function loadBin(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${url}: ${r.status}`);
  return new Float32Array(await r.arrayBuffer());
}

// ── cosine similarity ────────────────────────────────────────────────────

function topK(queryVec, k) {
  const n = meta.length;
  const scores = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const off = i * DIM;
    let dot = 0, nv2 = 0;
    for (let j = 0; j < DIM; j++) {
      const v = vecs[off + j];
      dot += queryVec[j] * v;
      nv2 += v * v;
    }
    scores[i] = dot / (Math.sqrt(nv2) || 1);
  }
  const indices = Array.from({ length: n }, (_, i) => i);
  indices.sort((a, b) => scores[b] - scores[a]);
  return indices.slice(0, k).map(i => ({ idx: i, dist: 1 - scores[i] }));
}

// ── flat game grid ──────────────────────────────────────────────────────

const MECHANIC_LABELS = {
  grid: "grid board",
  hex: "hex board",
  cards: "cards",
  dice: "dice",
  "mancala-track": "pit-and-seed",
  "3d": "3D / stacked",
  line: "graph / line",
  pegs: "peg board",
};

const AGE_BUCKETS = [
  { id: "ancient", min: -10000, max: 500 },
  { id: "medieval", min: 500, max: 1500 },
  { id: "early-modern", min: 1500, max: 1900 },
  { id: "20c", min: 1900, max: 2000 },
  { id: "modern", min: 2000, max: 3000 },
];
function ageBucket(year) {
  if (year == null) return null;
  for (const b of AGE_BUCKETS) if (year >= b.min && year < b.max) return b.id;
  return null;
}

function statusBucket(s) {
  const st = (s || "").toLowerCase();
  const unsolved = st.includes("unsolved") || st.includes("open") || st.includes("unknown");
  const partial = st.includes("partial") || st.includes("partially") || st.includes("analysed") || st.includes("pspace") || st.includes("np-");
  const solved = !unsolved && !partial && (st.includes("solved") || st.includes("complete"));
  if (solved) return "solved";
  if (partial) return "partial";
  return "unsolved";
}

// Tile observer: mount mini-canvas when scrolled near, destroy when far.
let tileObserver = null;
const tilePlayables = new Map(); // slug → playable instance

function mountTile(card) {
  const slug = card.dataset.slug;
  if (!slug || tilePlayables.has(slug)) return;
  const holder = card.querySelector(".tile-canvas-holder");
  if (!holder) return;
  if (!card.dataset.playable) return; // not a playable
  const canvas = document.createElement("canvas");
  holder.appendChild(canvas);
  import(`./playables/${slug}.js?v=69`).then(mod => {
    if (!holder.isConnected) return;
    try {
      const inst = mod.create(canvas);
      tilePlayables.set(slug, inst);
    } catch (e) {
      console.warn(`tile mount failed for ${slug}:`, e);
    }
  }).catch(e => console.warn(`tile import failed for ${slug}:`, e));
}

function unmountTile(card) {
  const slug = card.dataset.slug;
  const inst = tilePlayables.get(slug);
  if (inst) { try { inst.destroy(); } catch (e) {} tilePlayables.delete(slug); }
  const holder = card.querySelector(".tile-canvas-holder");
  if (holder) holder.innerHTML = "";
}

function clearAllTiles() {
  for (const [slug, inst] of tilePlayables) {
    try { inst.destroy(); } catch (e) {}
  }
  tilePlayables.clear();
}

function setupTileObserver() {
  if (tileObserver) tileObserver.disconnect();
  tileObserver = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) mountTile(e.target);
      else unmountTile(e.target);
    }
  }, { rootMargin: "300px 0px" });
}

function gameTileHTML(g) {
  const bc = statusBucket(g.solution_status);
  const fam = familyMeta[g.family];
  const famLabel = fam ? fam.title : (g.family || "");
  const playableAttr = g.playable ? ' data-playable="1"' : "";
  const ageStr = g.age == null ? "" : (g.age < 0 ? `${-g.age} BCE` : `${g.age}`);
  return `
    <a class="game-tile" data-slug="${esc(g.slug)}"${playableAttr} href="#game/${esc(g.slug)}">
      <div class="tile-canvas-holder" aria-hidden="true">
        ${g.playable ? "" : `<div class="tile-no-canvas">${fam?.icon_svg || "◯"}</div>`}
      </div>
      <div class="tile-meta">
        <div class="tile-title">${esc(g.title)}</div>
        <div class="tile-tags">
          <span class="sol-badge ${bc}">${esc(bc)}</span>
          ${g.playable ? '<span class="tag tag-playable">▶ play</span>' : ""}
          ${famLabel ? `<span class="tag tag-family">${esc(famLabel)}</span>` : ""}
          ${g.players ? `<span class="tag tag-players">${esc(g.players)}p</span>` : ""}
          ${ageStr ? `<span class="tag tag-age">${esc(ageStr)}</span>` : ""}
        </div>
      </div>
    </a>`;
}

function renderGrid(games) {
  clearAllTiles();
  $grid.innerHTML = games.map(gameTileHTML).join("");
  document.querySelectorAll(".game-tile").forEach(card => {
    card.addEventListener("click", (e) => {
      e.preventDefault();
      navigate(card.getAttribute("href"));
    });
    if (tileObserver) tileObserver.observe(card);
  });
  const cnt = document.getElementById("filter-result-count");
  if (cnt) cnt.textContent = `${games.length} game${games.length === 1 ? "" : "s"}`;
}

// ── filters ────────────────────────────────────────────────────────────────

function filterActive() {
  const f = currentFilters;
  if (f.q.trim()) return true;
  if (f.playable) return true;
  return f.status.size + f.players.size + f.family.size + f.mechanic.size + f.complexity.size + f.popularity.size + f.age.size > 0;
}

function applyFilters() {
  const f = currentFilters;
  const q = f.q.trim().toLowerCase();
  const filtered = flatGames.filter(g => {
    if (q && !g.title.toLowerCase().includes(q) && !g.slug.includes(q)) return false;
    if (f.playable && !g.playable) return false;
    if (f.status.size && !f.status.has(statusBucket(g.solution_status))) return false;
    if (f.players.size) {
      const p = (g.players || "").trim().charAt(0);
      if (!f.players.has(p)) return false;
    }
    if (f.family.size && !f.family.has(g.family)) return false;
    if (f.mechanic.size && !f.mechanic.has(g.mechanic)) return false;
    if (f.complexity.size && !f.complexity.has(String(g.complexity))) return false;
    if (f.popularity.size && !f.popularity.has(String(g.popularity))) return false;
    if (f.age.size) {
      const b = ageBucket(g.age);
      if (!b || !f.age.has(b)) return false;
    }
    return true;
  });
  const $empty = document.getElementById("filter-empty");
  if (filtered.length) {
    renderGrid(filtered);
    $empty.style.display = "none";
  } else {
    renderGrid([]);
    $empty.style.display = "block";
  }
  document.getElementById("filter-clear").classList.toggle("hidden", !filterActive());
}

// ── game detail ──────────────────────────────────────────────────────────

let currentPath = null;
let currentPlayable = null;

async function openGame(path, fromHash) {
  // Normalize: strip .md and extract anchor
  path = path.replace(/\.md$/, "");
  let anchor = null;
  const hashIdx = path.indexOf("#");
  if (hashIdx >= 0) {
    anchor = path.slice(hashIdx + 1);
    path = path.slice(0, hashIdx);
  }

  // Resolve to a file path for fetching
  // Try games/ first (game entries), fall back to root (refs, etc.)
  let filePath = "games/" + path + ".md";
  let pagePath = path + ".md";

  if (!fromHash) navigate(`game/${path}`);

  // Save scroll position before swapping
  const prevY = window.scrollY;

  hideResults();
  $grid.classList.add("hidden");
  $detail.classList.remove("hidden");

  $detail.innerHTML = `
    <div class="detail-header">
      <button class="detail-back">← back</button>
      <h2 class="detail-title">${esc(path.replace(/^.*\//, ""))}</h2>
    </div>
    <div id="playable-area" class="playable-area hidden">
      <canvas id="playable-canvas"></canvas>
      <div class="playable-controls">
        <button id="playable-restart">↺ restart</button>
        <button id="playable-solve" class="hidden">⟳ solve</button>
        <span id="playable-status"></span>
      </div>
      <div id="playable-seed-row" class="playable-seed-row hidden">
        <label for="playable-seed">seed:</label>
        <input id="playable-seed" type="text" maxlength="30" size="10" placeholder="random" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">
        <button id="playable-new-game">new game</button>
      </div>
      <div id="playable-hint" class="playable-hint"></div>
    </div>
    <div class="detail-body"><p style="color:var(--fg-muted)">loading…</p></div>
  `;

  $detail.querySelector(".detail-back").addEventListener("click", (e) => {
    e.preventDefault();
    history.back();
  });

  currentPath = path;

  try {
    // Try games/ path first, fall back to root (references.md, etc.)
    const cb = '?v=' + Date.now();
    let r = await fetch(filePath + cb);
    if (!r.ok) { r = await fetch(pagePath + cb); filePath = pagePath; }
    if (!r.ok) throw new Error(`${r.status}`);
    const md = await r.text();
    const title = md.split("\n")[0].replace(/^#\s*/, "") || path;
    $detail.querySelector(".detail-title").textContent = title;
    $detail.querySelector(".detail-body").innerHTML = renderMd(md);

    // Move the summary table above the playable area so rules are visible alongside the game
    const playableMatch = md.match(/^\|\s*\*\*Playable\*\*\s*\|\s*(.+?)\s*\|/m);
    const playableSlug = playableMatch ? playableMatch[1].trim() : null;
    if (playableSlug && playableSlug !== "—" && playableSlug !== "N/A") {
      const table = $detail.querySelector('.detail-body table');
      if (table) {
        const wrapper = document.createElement('div');
        wrapper.className = 'detail-summary';
        table.replaceWith(wrapper);
        wrapper.appendChild(table);
        const area = document.getElementById('playable-area');
        area.parentNode.insertBefore(wrapper, area);
      }
      loadPlayable(playableSlug);
    }

    // Wire game links inside detail
    $detail.querySelectorAll(".game-link").forEach(a => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        const href = a.getAttribute("href");
        const m = href.match(/^#game\/(.+)/);
        if (m) openGame(m[1], false);
      });
    });

    // Wire local same-page anchors
    $detail.querySelectorAll(".local-anchor").forEach(a => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        const id = a.getAttribute("href").slice(1);
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      });
    });

    // Scroll to anchor if present
    if (anchor) {
      const el = document.getElementById(anchor);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 100);
    }

    window.scrollTo(0, 0);
  } catch (e) {
    $detail.querySelector(".detail-body").innerHTML =
      `<p style="color:var(--accent)">could not load ${esc(filePath)} (${e.message})</p>`;
    window.scrollTo(0, prevY);
  }
}

function hideDetail() {
  if (currentPlayable) { currentPlayable.destroy(); currentPlayable = null; }
  $detail.classList.add("hidden");
  $grid.classList.remove("hidden");
  currentPath = null;
}

async function loadPlayable(slug) {
  try {
    const mod = await import(`./playables/${slug}.js?v=69`);
    const canvas = document.getElementById("playable-canvas");
    if (!canvas) return;
    const area = document.getElementById("playable-area");
    area.classList.remove("hidden");
    if (currentPlayable) currentPlayable.destroy();

    // Set interaction hint for this game
    const hint = document.getElementById("playable-hint");
    const hints = {
      "fifteen-puzzle": "click a tile next to the gap to slide it — press ⟳ solve for AI",
      "pocket-cube": "click a face to twist it — press ⟳ solve for AI",
      "rubiks-cube": "click a face to twist (Shift+click = CCW) — press ⟳ solve for AI",
      "klondike-solitaire": "click stock to draw (or redeal); click a card to select — press ⟳ solve for AI",
      "klotski": "click a block to select it, then click a direction to slide — press ⟳ solve for AI",
      "lights-out": "click a light to toggle it and its neighbours — press ⟳ solve for AI",
      "minesweeper": "click to reveal; Shift+click to flag a mine — press ⟳ solve for AI",
      "peg-solitaire": "click a peg to select it — green dots show where you can jump — press ⟳ solve for AI",
      "conways-soldiers": "click a peg to select it — green dots show where you can jump — press ⟳ solve for AI",
      "sokoban": "arrow keys to move the worker; push all boxes onto targets — press ⟳ solve for AI",
      "rush-hour": "click a car to select it, then a direction arrow to move — press ⟳ solve for AI",
      "samegame": "click a group of 2 or more same-colour blocks to clear them — press ⟳ solve for AI",
      "tower-of-hanoi": "click a peg to pick up the top disk; click another to drop it — press ⟳ solve for AI",
      "tic-tac-toe": "click an empty cell to place X; press ⟳ solve to make O move",
      "nonograms": "click to fill a cell; right-click (or Ctrl+click) to mark X — press ⟳ solve for AI",
      "sudoku": "click a cell to select it, then type a number 1–9 — press ⟳ solve for AI",
      "yahtzee": "click dice to hold them; click Roll to roll — press ⟳ solve for AI",
      "nim": "click stones to mark how many to take from one heap — click again to confirm",
      "wythoffs-game": "click stones in one heap (or both for a diagonal move) — press ⟳ solve for optimal play",
      "hexapawn": "click your white pawn, then the highlighted target — press ⟳ solve to play perfectly",
      "subtract-a-square": "click a −k² button to remove that many stones — press ⟳ solve for optimal play",
      "mu-torere": "click your white piece, then an adjacent empty point — press ⟳ solve for optimal play",
      "three-mens-morris": "place 3 pieces, then slide along lines — press ⟳ solve for optimal play",
      "pong-hau-ki": "click your white piece, then an adjacent empty point — press ⟳ solve for optimal play",
      "fibonacci-nim": "click a −k button (limited by the doubling rule) — press ⟳ solve for optimal play",
      "misere-nim": "click stones to mark how many to take, then base to confirm — taking the LAST stone loses",
      "picaria": "place 3 pieces, then slide along lines — press ⟳ solve for optimal play",
      "tapatan": "place 3 pieces, then slide along lines — press ⟳ solve for optimal play",
      "nine-holes": "place 3 pieces, then slide along rows/columns — press ⟳ solve for optimal play",
      "achi": "place 4 pieces, then slide along lines — press ⟳ solve for optimal play",
      "shisima": "click a white stone, then an adjacent empty point — win by 3-in-a-row through the centre",
      "chomp": "click a cell to chomp it + everything below/right — DON'T eat the poison ☠",
      "kayles": "click a pin, then choose remove-1 or remove-2 — last pin wins",
      "treblecross": "click an empty cell to mark X — three in a row WINS",
      "tribonacci-nim": "click a −k button (limited by 3× the opponent's last move)",
      "grundys-game": "click a heap (size ≥ 3), then a split — must be unequal non-empty parts",
      "euclids-game": "click a k= button to subtract k × smaller from larger — reduce a pile to 0 to win",
      "domineering": "click a cell to place a VERTICAL domino (extends downward) — AI places horizontal",
      "cram": "click one empty cell, then an adjacent empty cell — places a domino in either orientation",
      "notakto": "click an empty cell to mark X — completing a three-in-a-row LOSES",
      "toads-and-frogs": "click a Toad, then a highlighted cell — step right or jump over a Frog into empty",
      "turning-turtles": "click 1 or 2 coins (rightmost must be heads), double-click to flip — XOR positions = nim heaps",
      "mock-turtles": "click 1–3 coins (rightmost must be heads), double-click to flip — XOR M(i) of heads",
      "northcotts-game": "click a W stone, then a target cell — slide without jumping the opponent (gaps = nim heaps)",
      "poker-nim": "click a heap to take/add 1 (toggle mode with T/A) — adds from reserve are reversible",
      "clobber": "click your B stone, then an adjacent W stone to capture — last to move wins",
      "wild-tic-tac-toe": "click an empty cell to place — toggle symbol with X/O; any 3-in-a-row wins",
      "col": "click a green node to colour blue — no two same-colour neighbours allowed",
      "snort": "click a green node to place blue — cannot be adjacent to a red node",
      "dawsons-chess": "click an empty cell — your X also blocks both adjacent cells; last to move wins",
      "mastermind": "click a peg to cycle colour; click submit (or press ⟳ for Knuth's minimax guess)",
      "mnk-games": "click an empty cell to place X — 3 in a row on this 4×4 board wins",
      "node-kayles": "click a vertex — it and all its neighbours are removed; last to move wins",
      "hare-and-hounds": "click a Hound, then an adjacent empty node — never backward; trap the Hare",
      "wolves-and-sheep": "click a sheep, then a forward-diagonal cell — pen the wolf",
      "hex": "click an empty hex to place red — connect TOP to BOTTOM; no draws possible",
      "tac-tix": "click cells along ONE row or column, then click TAKE — misère: last counter loses",
      "whim": "take 1 from any heap, or click DECLARE WHIM to flip normal/misère (one-time only)",
      "triplets": "click 1/2/3 below any heap to take that many stones — last stone wins",
      "tant-fant": "click your stone, then a neighbouring empty cell — 3-in-line OFF your home row wins",
      "rock-paper-scissors": "click rock / paper / scissors — AI plays the Nash mixed strategy (uniform random)",
      "l-game": "click 4 cells to form your L in a NEW position, then click PLACE L — opponent stuck = win",
      "sim": "click an edge to colour it blue — but completing a blue triangle LOSES",
      "dao": "click your blue stone, then a direction cell — stone slides to the edge",
      "konane": "click a black stone, then a cell 2 squares away with an enemy in between — jump captures",
      "connect-four": "click a column to drop your blue piece — four in a row wins",
      "shove": "click a BLUE piece — its run shoves one cell right; the rightmost piece falls off",
      "teeko": "place 4 stones, then slide one to a neighbour — win = 4-in-line or 2×2 block",
      "pente": "click an empty cell — 5-in-a-row OR 5 captures wins (flank an enemy pair to capture)",
      "gomoku": "click an empty cell to place a black stone — 5-in-a-row wins",
      "pentago": "place a marble, then click a quadrant rotation button — 5-in-a-row wins",
      "othello": "click a green-tinted cell to flip flanked enemy stones — most stones at end wins",
      "quoridor": "click MOVE then a green cell, or click H/V-WALL then a cell to drop a wall",
      "quixo": "click a green border cube, then a direction button to slide that row/column",
      "breakthrough": "click your blue piece, then a green destination — reach the top row wins",
      "bridg-it": "click an empty cell to draw a BLUE NW-SE diagonal — connect TOP to BOTTOM",
      "hackenbush": "click a blue edge — it and everything above it is removed; last to move wins",
      "score-four": "click a peg — your bead drops to the lowest empty slot; 4-in-line in the 4×4×4 cube wins",
      "qubic": "click any empty cell across the 4 layers — 4-in-a-line anywhere in the 4×4×4 cube wins",
      "anti-reversi": "click a green-tinted cell to flip enemy stones — FEWER discs wins!",
      "dots-and-boxes": "click between two dots to draw an edge — complete a box for a bonus turn",
      "connect6": "place 1 stone on the first turn, 2 per turn after — 6-in-a-row wins",
      "caro": "place a black stone — 5-in-a-row wins, but NOT if blocked at both ends",
      "kalah": "click one of your pits — sow seeds counter-clockwise; land in your store for an extra turn",
      "awari": "click one of your pits — sow seeds; land in opponent's row to capture 2s and 3s",
      "brussels-sprouts": "click two free ends to connect them — game length is FIXED by starting count",
      "mock-wythoff": "click mode + amount + GO — take from a pile, or diagonal (k, k+1)",
      "mogul": "click two coins to flip both — rightmost MUST be heads",
      "ultimate-tic-tac-toe": "click a cell in the active board — your cell picks the opponent's next board",
      "toppling-dominoes": "click a blue or green domino, then ◀ LEFT or RIGHT ▶ to topple it",
      "y": "click any empty hex to place a black stone — connect ALL three sides",
      "shannon-switching-game": "click a grey edge to SECURE it — make a blue path from A to B",
      "ruler-game": "click 'take 1', 'take 2', or 'take 3' under any heap — last to move wins",
      "push": "click a blue piece to slide it right — pushes everything in its run",
      "red-blue-green-hackenbush": "click any BLUE or GREEN edge to chop it (and everything above)",
      "six-mens-morris": "place 6 stones, then slide them along lines — three in a row removes an enemy",
      "twixt": "click a hole to place a black peg — knight-move links auto-form; connect TOP↔BOTTOM",
      "renju": "click an intersection to place a black stone — five-in-a-row wins, but no double-3, double-4, or overline",
      "quarto": "place the piece your opponent gave you, then click a remaining piece to give them",
      "order-and-chaos": "pick X or O, click an empty cell — get 5-in-a-row of either symbol to win",
      "dobutsu-shogi": "click your piece, then a destination cell — capture the Lion or march yours to the top row",
      "nine-mens-morris": "place 9 stones, then slide them — three-in-a-row removes an enemy",
      "fox-and-geese": "click a goose then an empty adjacent down/sideways cell — pen the fox to win",
      "slitherlink": "click an edge to cycle line → × → blank. Click SOLVE to reveal the loop.",
      "hashiwokakero": "click two islands to add a bridge; click pair again for a double bridge",
      "brandubh": "click your defender or the king, then a destination — escape the king to a corner",
      "pylos": "click a green-outlined hole — supported holes only; place the apex sphere to win",
      "halatafl": "click a goose then an empty adjacent down/sideways cell — fox must jump to capture",
      "lasker-morris": "click empty point to place OR click your piece then adjacent empty — three-in-a-row removes enemy",
      "crossway": "click an empty cell to place a black stone — connect TOP↔BOTTOM (no 2×2 cross pattern)",
      "gonnect": "click an empty intersection — Go rules. Connect TOP↔BOTTOM or capture to win.",
      "liars-dice": "click a quantity then a face, or click LIAR! to challenge",
      "dara": "place 12, then slide. Three-in-a-row removes an enemy — but no four-in-a-row allowed.",
      "maze-conway": "click a green-outlined neighbour — Left moves ↑/← ; last to move wins",
      "undirected-vertex-geography": "click a green-outlined neighbour — move the token to an unvisited vertex",
      "geography": "click a green-outlined successor — directed edges; unvisited only",
      "cherries": "click a BLUE cherry to remove it and everything to the right of it",
      "atropos": "click an empty interior vertex, then a color — avoid monochrome triangles",
      "catch-the-hare": "click a hound then a green-outlined neighbour — hounds move forward or sideways only",
      "catchup": "click empty hexes to place stones — largest connected group at end wins",
      "sungka": "click one of YOUR lower pits to sow shells counterclockwise; last shell in own home = another turn",
      "twelve-mens-morris": "place 12 stones, then slide. Diagonals count as mills too.",
      "eleven-mens-morris": "place 11 stones, then slide. Three-in-a-row removes an enemy.",
      "einstein-wurfelt-nicht": "die rolls — click a green-outlined cell to move toward the opposite corner",
      "amazons": "click your amazon → queen-move → shoot an arrow queen-wise. Last to move wins.",
      "lines-of-action": "click your piece → move along a line exactly as many squares as there are pieces on it",
      "lasca": "click your blue tower → diagonal step or jump. Captures stack under you.",
      "ninuki-renju": "click an intersection — five-in-a-row OR 5 pair-captures wins (X**OO**X removes the pair)",
      "fanorona": "click your piece → click a green-outlined target. Captures are mandatory.",
      "havannah": "click an empty hex — win by RING, BRIDGE (2 corners), or FORK (3 edges)",
      "pallanguzhi": "click YOUR (lower) pit — chain sowing; capture pit beyond an empty chain-end",
      "four-d-tic-tac-toe": "click a cell — align THREE along any 4D line to win",
      "atoll": "click an empty hex — connect your two green-bordered ISLANDS with your colour",
      "seega": "place 12 stones (centre forbidden), then 1-step orthogonal moves; sandwich to capture",
      "surakarta": "click your blue piece — 1-step ortho/diag move OR long straight-line capture",
      "slither": "PLACE or SLIDE — connect TOP↔BOTTOM. No same-colour diagonal pair without an orthogonal connector",
      "dvonn": "click your stack — slides distance = its height; orphans (no DVONN red dot) drop off",
      "tablut": "you defend; rook-move the king to a CORNER to win. Sandwich captures.",
      "yote": "drop a stone from reserve, OR move/jump. Jump captures + remove one extra enemy.",
      "tigers-and-goats": "place 20 goats one at a time, then move them. Trap all 4 tigers to win.",
      "star": "click any hex — score is (perimeter cells in own group − 3) summed across groups",
      "poly-y": "click any hex — own ≥3 of 5 highlighted corners with your connected group",
      "unlur": "click any hex — touch any 3 of 6 edges with one group (AI wants 2 opposite edges)",
      "minichess": "Gardner 5×5 chess — click your piece, click destination. Capture king to win.",
      "tic-tac-chec": "click a pool piece to bring (or your piece to move). Line up 4 of your colour.",
      "phutball": "drop a MAN, OR click the ball to start a chain JUMP. Reach top row to win.",
      "songo": "click your (green) pit — sow CCW; last seed at opponent pit @ 2/3 captures (chain back)",
      "onyx": "click any empty cell — connect TOP↔BOTTOM. 3-sided sandwich removes an enemy.",
      "checkers": "click your piece, click target diagonal. Captures are mandatory; promote at last row.",
      "brazilian-draughts": "8×8 international rules — flying kings; men capture backwards",
      "shatranj": "click your piece — chess's ancestor: queen=1sq diag, bishop jumps 2 diag",
      "backgammon": "click a point to move your stone that many spaces (single die per turn)",
      "xiangqi": "click an intersection to select; capture the general (將) to win",
      "battleship": "click the enemy waters (right grid) to fire. Sink all enemy ships to win.",
      "losing-chess": "captures are MANDATORY. Lose all pieces (or get stalemated) to win.",
      "makruk": "Thai chess — Met (◆) moves 1 diagonal; Khon (△) moves 1 diag or 1 forward",
      "international-draughts": "10×10 — men capture forward AND backward; flying kings",
      "atomic-chess": "captures EXPLODE a 3×3 area (pawns survive); king cannot capture",
      "king-of-the-hill": "move your king to d4/e4/d5/e5 to win — standard chess moves",
      "horde-chess": "32 white pawns vs standard black army — capture the king (white) or survive (black)",
      "italian-draughts": "men cannot capture kings; capture the MOST pieces when multiple captures available",
      "los-alamos-chess": "6×6 chess variant — no bishops, no castling, no en passant",
      "shogi": "click your piece or hand piece, then a destination. Drops & promotion — capture the king to win.",
      "janggi": "click your piece, click destination. Elephant = 1 ortho + 2 diag. Cannon jumps a screen.",
      "courier-chess": "12×8 medieval chess — Courier = bishop, Mann = 1-step king. Capture the king to win.",
      "capablanca-chess": "10×8 chess with Archbishop (B+N) and Chancellor (R+N). Capture the king to win.",
      "crazyhouse": "captured pieces go to your hand — click a piece in hand, then drop square. Checkmate to win.",
      "maharajah-and-the-sepoys": "you command the army — capture the ⛃ (Q+N superpiece) to win. Sepoys move first.",
    };
    hint.textContent = hints[slug] || "";

    currentPlayable = mod.create(canvas);
    document.getElementById("playable-restart").addEventListener("click", () => {
      if (currentPlayable && currentPlayable.restart) currentPlayable.restart();
    });
    const solveBtn = document.getElementById("playable-solve");
    if (currentPlayable.solve) {
      solveBtn.classList.remove("hidden");
      solveBtn.onclick = () => { if (currentPlayable.solve) currentPlayable.solve(); };
    } else {
      solveBtn.classList.add("hidden");
    }
  } catch (e) {
    console.warn(`playable "${slug}" not available:`, e);
  }
}

// ── search results ───────────────────────────────────────────────────────

function showResults(hits) {
  $results.classList.remove("hidden");
  $backdrop.classList.remove("hidden");
  $grid.classList.add("searching");
  $detail.classList.add("hidden");

  $results.innerHTML = hits.map(h => {
    const r = meta[h.idx];
    let path = r.type === "game" ? `${r.source}` :
               r.type === "lexicon" ? `lexicon/${r.source}` : null;
    const section = r.section ? `<span class="section">§ ${esc(r.section)}</span>` : "";
    let text = r.text;
    if (text.length > 600) text = text.slice(0, 600) + "…";
    return `
      <div class="hit" data-path="${path ? esc(path) : ""}">
        <div class="meta">
          <span class="kind">${esc(r.type)}</span>
          <span class="source">${esc(r.source)}</span>
          ${section}
          <span class="dist">d=${h.dist.toFixed(3)}</span>
        </div>
        <div class="text">${renderMd(text)}</div>
      </div>`;
  }).join("");

  $results.querySelectorAll(".hit").forEach(el => {
    el.addEventListener("click", () => {
      const p = el.dataset.path;
      if (p) openGame(p, false);
    });
  });
}

function hideResults() {
  $results.classList.add("hidden");
  $backdrop.classList.add("hidden");
  $grid.classList.remove("searching");
}

// ── search loop ──────────────────────────────────────────────────────────

let pending = 0;

async function runSearch(text) {
  const myId = ++pending;
  text = text.trim();
  if (!text || !extract || !vecs) {
    hideResults();
    setStatus(extract && vecs ? (text ? "type to search" : "ready") : "loading…");
    return;
  }
  setStatus("searching…");
  const out = await extract(text, {});
  if (myId !== pending) return;
  const raw = out.data;
  let norm = 0;
  for (let i = 0; i < DIM; i++) norm += raw[i] * raw[i];
  norm = Math.sqrt(norm) || 1;
  const qv = new Float64Array(DIM);
  for (let i = 0; i < DIM; i++) qv[i] = raw[i] / norm;
  const hits = topK(qv, 8);
  if (myId !== pending) return;
  showResults(hits);
  setStatus(`${hits.length} hits`);
}

let debounce;
$q.addEventListener("input", () => {
  $clear.classList.toggle("hidden", !$q.value);
  clearTimeout(debounce);
  debounce = setTimeout(() => runSearch($q.value), 180);
});
$q.addEventListener("keydown", (e) => {
  if (e.key === "Enter") { clearTimeout(debounce); runSearch($q.value); }
  if (e.key === "Escape") { hideResults(); $q.blur(); }
});
$clear.addEventListener("click", () => {
  $q.value = "";
  $clear.classList.add("hidden");
  hideResults();
  setStatus("ready.");
  $q.focus();
});
$backdrop.addEventListener("click", () => { hideResults(); $q.blur(); });
$q.addEventListener("focus", () => $q.select());

window.addEventListener("hashchange", onHashChange);

// ── boot ──────────────────────────────────────────────────────────────────

setStatus("loading metadata…");
const [categories, gameMetaRaw, metaRaw, vecsRaw] = await Promise.all([
  loadJSON("./data/categories.json"),
  loadJSON("./data/game-meta.json"),
  loadJSON("./data/meta.json"),
  loadBin("./data/vectors.bin"),
]);
meta = metaRaw;
vecs = vecsRaw;
allCategories = categories;
gameMeta = gameMetaRaw;

// Build family lookup (id → {title, blurb, icon_svg})
for (const c of categories) {
  familyMeta[c.id] = { title: c.title, blurb: c.blurb, icon_svg: c.icon_svg };
}

// Flatten heads + members and merge with game-meta
const seen = new Set();
for (const c of categories) {
  for (const g of c.games) {
    if (!seen.has(g.slug)) {
      seen.add(g.slug);
      flatGames.push({ ...(gameMeta[g.slug] || {}), ...g, family: gameMeta[g.slug]?.family || c.id });
    }
    for (const m of (g.members || [])) {
      if (!seen.has(m.slug)) {
        seen.add(m.slug);
        flatGames.push({ ...(gameMeta[m.slug] || {}), ...m, family: gameMeta[m.slug]?.family || c.id });
      }
    }
  }
}
flatGames.sort((a, b) => a.title.localeCompare(b.title));

setupTileObserver();
renderGrid(flatGames);

// ── filter bar wiring ──────────────────────────────

// Build family + mechanic chip rows from data
const familyRow = document.getElementById("filter-family-row");
const familyOrder = categories.map(c => c.id);
familyRow.innerHTML = familyOrder.map(id => {
  const fm = familyMeta[id];
  if (!fm) return "";
  return `<label class="filter-chip" tabindex="0"><input type="checkbox" data-fkind="family" value="${esc(id)}"><span class="chip-label">${esc(fm.title)}</span></label>`;
}).join("");

const mechanicRow = document.getElementById("filter-mechanic-row");
const mechanicCounts = {};
for (const g of flatGames) if (g.mechanic) mechanicCounts[g.mechanic] = (mechanicCounts[g.mechanic] || 0) + 1;
const mechanicOrder = Object.keys(mechanicCounts).sort((a, b) => mechanicCounts[b] - mechanicCounts[a]);
mechanicRow.innerHTML = mechanicOrder.map(m => {
  const lbl = MECHANIC_LABELS[m] || m;
  return `<label class="filter-chip" tabindex="0"><input type="checkbox" data-fkind="mechanic" value="${esc(m)}"><span class="chip-label">${esc(lbl)}</span></label>`;
}).join("");

// Wire all checkbox chips (delegated to each input via fkind dataset)
document.querySelectorAll('#filters input[type=checkbox][data-fkind]').forEach(input => {
  input.addEventListener("change", () => {
    const kind = input.dataset.fkind;
    const value = input.value;
    const set = currentFilters[kind];
    if (input.checked) set.add(value); else set.delete(value);
    input.closest(".filter-chip").classList.toggle("active", input.checked);
    updateFilterCounts();
    applyFilters();
  });
});

const $chkPlayable = document.getElementById("chk-playable");
$chkPlayable.addEventListener("change", () => {
  currentFilters.playable = $chkPlayable.checked;
  document.getElementById("filter-playable").classList.toggle("active", $chkPlayable.checked);
  applyFilters();
});

const $gridQ = document.getElementById("grid-q");
$gridQ.addEventListener("input", () => {
  currentFilters.q = $gridQ.value;
  applyFilters();
});

document.getElementById("filter-clear").addEventListener("click", () => {
  document.querySelectorAll('#filters input[type=checkbox]').forEach(i => {
    i.checked = false;
    const chip = i.closest(".filter-chip");
    if (chip) chip.classList.remove("active");
  });
  for (const k of ["status","players","family","mechanic","complexity","popularity","age"]) currentFilters[k].clear();
  currentFilters.playable = false;
  currentFilters.q = "";
  $gridQ.value = "";
  updateFilterCounts();
  applyFilters();
});

function updateFilterCounts() {
  const map = { family: "family", mechanic: "mechanic", complexity: "complexity", popularity: "popularity", age: "age" };
  for (const k in map) {
    const n = currentFilters[k].size;
    const el = document.querySelector(`.filter-count[data-for="${k}"]`);
    if (el) el.textContent = n ? `(${n})` : "";
  }
}

const counts = { game: 0, reference: 0, lexicon: 0 };
for (const c of meta) {
  if (c.type in counts) counts[c.type]++;
  else if (c.type === "game") counts.game++;
}
$("count-games").textContent = counts.game;
$("count-refs").textContent = counts.reference;
$("count-lex").textContent = counts.lexicon;

setStatus("loading embedding model (~30 MB, cached after first visit)…");
try {
  extract = await pipeline(
    "feature-extraction",
    "Xenova/bge-small-en-v1.5",
    {
      progress_callback: (p) => {
        if (p.status === "progress" && p.total) {
          setStatus(`loading model… ${p.file} ${Math.round((p.loaded / p.total) * 100)}%`);
        }
      }
    }
  );
} catch (e) {
  setStatus(`model failed to load: ${e.message}. refresh to retry.`);
  console.error("transformers load error:", e);
  throw e;
}

setStatus("ready.");
$q.disabled = false;

// Route based on hash
const route = getRoute();
if (route.view === "game") {
  openGame(route.path, true);
} else {
  $q.focus();
}
