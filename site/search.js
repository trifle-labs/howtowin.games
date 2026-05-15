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

function renderMd(text) {
  const lines = text.split("\n");
  const out = [];
  let paragraph = [];

  function flushParagraph() {
    if (paragraph.length) {
      out.push(`<p>${paragraph.join(" ")}</p>`);
      paragraph = [];
    }
  }

  for (const raw of lines) {
    let line = raw;
    const trimmed = line.trim();

    // tables
    if (/^\|.+\|$/.test(trimmed) && line.includes("|")) {
      flushParagraph();
      const cells = trimmed.split("|").slice(1, -1).map(c => c.trim());
      out.push("<tr>" + cells.map(c => `<td>${esc(c)}</td>`).join("") + "</tr>");
      continue;
    }

    if (/^---/.test(trimmed)) {
      flushParagraph();
      out.push('<hr class="md-hr">');
      continue;
    }

    // inline formatting
    line = line.replace(/`([^`]+)`/g, "<code>$1</code>");
    line = line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    line = line.replace(/(?<!\w)\*(?!\*)(.+?)(?<!\*)\*(?!\w)/g, "<em>$1</em>");
    line = line.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, t, u) => {
      if (u.startsWith("games/") || u.startsWith("lexicon/")) return `<a href="#game/${u.replace(/\.md$/, "")}" class="game-link">${t}</a>`;
      return `<a href="${u}" target="_blank" rel="noopener">${t}</a>`;
    });

    if (!trimmed) {
      flushParagraph();
    } else if (/^##+\s+/.test(line)) {
      flushParagraph();
      out.push(`<h2>${line.replace(/^##+\s+/, "")}</h2>`);
    } else if (/^>\s+/.test(line)) {
      flushParagraph();
      out.push(`<blockquote>${line.replace(/^>\s+/, "")}</blockquote>`);
    } else if (/^[-*]\s/.test(line)) {
      flushParagraph();
      out.push(`<li class="md-li">${line.replace(/^[-*]\s+/, "")}</li>`);
    } else if (/^\d+[.)]\s/.test(line)) {
      flushParagraph();
      out.push(`<li class="md-li">${line.replace(/^\d+[.)]\s+/, "")}</li>`);
    } else {
      paragraph.push(line);
    }
  }
  flushParagraph();
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

// ── tile grid ────────────────────────────────────────────────────────────

function renderGrid(categories) {
  $grid.innerHTML = categories.map(c => {
    const top = c.games.slice(0, SHOW_INITIAL);
    const rest = c.games.slice(SHOW_INITIAL);
    return `
      <div class="tile" data-cat="${c.id}">
        <div class="tile-header">
          <div class="tile-icon">${c.icon_svg}</div>
          <h3>${esc(c.title)} <span class="count">${c.count}</span></h3>
        </div>
        <div class="tile-blurb">${esc(c.blurb)}</div>
        <ul class="tile-game-list" data-id="${c.id}">
          ${top.map(g => gameItem(g)).join("")}
        </ul>
        ${rest.length ? `<ul class="tile-game-list extra" data-id="${c.id}-extra">
          ${rest.map(g => gameItem(g)).join("")}
        </ul>
        <button class="tile-toggle" data-target="${c.id}">+ ${rest.length} more</button>` : ""}
      </div>`;
  }).join("");

  document.querySelectorAll(".tile-toggle").forEach(btn => {
    btn.addEventListener("click", () => {
      const extra = document.querySelector(`ul[data-id="${btn.dataset.target}-extra"]`);
      if (!extra) return;
      const open = extra.classList.toggle("open");
      btn.textContent = open ? "− fewer" : `+ ${extra.children.length} more`;
    });
  });

  // Game links → navigate to hash
  document.querySelectorAll(".tile-game-list a").forEach(a => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const slug = a.getAttribute("href").replace(/\.md$/, "");
      navigate(`game/${slug}`);
    });
  });
}

function gameItem(g) {
  const bc = badgeClass(g.solution_status);
  const label = g.solution_status?.length > 25
    ? g.solution_status.slice(0, 22) + "…"
    : g.solution_status || "Unknown";
  return `<li><a href="#game/${g.slug}">${esc(g.title)}</a><span class="sol-badge ${bc}">${esc(label)}</span></li>`;
}

// ── game detail ──────────────────────────────────────────────────────────

let currentPath = null;

async function openGame(path, fromHash) {
  // Normalize: strip .md
  path = path.replace(/\.md$/, "");

  // Resolve to a file path for fetching
  let filePath;
  if (path.startsWith("games/") || path.startsWith("lexicon/")) {
    filePath = path + ".md";
  } else {
    filePath = "games/" + path + ".md";
  }

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
    <div class="detail-body"><p style="color:var(--fg-muted)">loading…</p></div>
  `;

  $detail.querySelector(".detail-back").addEventListener("click", (e) => {
    e.preventDefault();
    history.back();
  });

  currentPath = path;

  try {
    const r = await fetch(filePath);
    if (!r.ok) throw new Error(`${r.status}`);
    const md = await r.text();
    const title = md.split("\n")[0].replace(/^#\s*/, "") || path;
    $detail.querySelector(".detail-title").textContent = title;
    $detail.querySelector(".detail-body").innerHTML = renderMd(md);

    // Wire game links inside detail
    $detail.querySelectorAll(".game-link").forEach(a => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        const href = a.getAttribute("href");
        const m = href.match(/^#game\/(.+)/);
        if (m) openGame(m[1], false);
      });
    });

    window.scrollTo(0, 0);
  } catch (e) {
    $detail.querySelector(".detail-body").innerHTML =
      `<p style="color:var(--accent)">could not load ${esc(filePath)} (${e.message})</p>`;
    window.scrollTo(0, prevY);
  }
}

function hideDetail() {
  $detail.classList.add("hidden");
  $grid.classList.remove("hidden");
  currentPath = null;
}

// ── search results ───────────────────────────────────────────────────────

function showResults(hits) {
  $results.classList.remove("hidden");
  $backdrop.classList.remove("hidden");
  $grid.classList.add("searching");
  $detail.classList.add("hidden");

  $results.innerHTML = hits.map(h => {
    const r = meta[h.idx];
    let path = r.type === "game" ? `game/${r.source}` :
               r.type === "lexicon" ? `game/lexicon/${r.source}` : null;
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
const [categories, metaRaw, vecsRaw] = await Promise.all([
  loadJSON("./data/categories.json"),
  loadJSON("./data/meta.json"),
  loadBin("./data/vectors.bin"),
]);
meta = metaRaw;
vecs = vecsRaw;

renderGrid(categories);

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
