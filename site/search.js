import { pipeline, env } from "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.2";
env.allowLocalModels = false;

const DIM = 384;
const SHOW_INITIAL = 5;

const $ = (id) => document.getElementById(id);
const $q = $("q");
const $status = $("status");
const $grid = $("category-grid");
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

function isGamePath(path) {
  return path.startsWith("games/") || path.startsWith("lexicon/") || path === "references.md";
}

function badgeClass(status) {
  const s = status.toLowerCase();
  if (s.includes("unsolved") || s.includes("open") || s.includes("unknown")) return "unsolved";
  if ((s.includes("solved") || s.includes("complete")) && !(s.includes("partial") || s.includes("partially"))) return "solved";
  if (s.includes("partial") || s.includes("analysed") || s.includes("pspace") || s.includes("np-")) return "partial";
  return "unsolved";
}

// ── markdown renderer ────────────────────────────────────────────────────

function renderMd(text) {
  const lines = text.split("\n");
  const out = [];
  let inTable = false;
  for (const raw of lines) {
    let line = raw;

    // table — render as HTML table rows
    if (/^\|.+\|$/.test(line.trim()) && line.includes("|")) {
      const cells = line.trim().split("|").slice(1, -1).map(c => c.trim());
      if (!inTable) {
        out.push("<tr>" + cells.map(c => `<td>${esc(c)}</td>`).join("") + "</tr>");
        inTable = true;
      } else {
        out.push("<tr>" + cells.map(c => `<td>${esc(c)}</td>`).join("") + "</tr>");
      }
      continue;
    } else if (inTable) {
      // Close the table — actually we don't know when table started
      // Tables are handled differently below
      inTable = false;
    }

    // separator
    if (/^---/.test(line.trim())) {
      out.push('<hr class="md-hr">');
      continue;
    }

    // inline code (protect from other transforms)
    line = line.replace(/`([^`]+)`/g, "<code>$1</code>");
    // bold
    line = line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    // italic (not mid-word)
    line = line.replace(/(?<!\w)\*(?!\*)(.+?)(?<!\*)\*(?!\w)/g, "<em>$1</em>");
    // links
    line = line.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, t, u) => {
      if (isGamePath(u)) return `<a href="${u}" class="game-link">${t}</a>`;
      return `<a href="${u}" target="_blank" rel="noopener">${t}</a>`;
    });
    // headers ## → h2
    if (/^##+\s+/.test(line)) {
      out.push(`<h2>${line.replace(/^##+\s+/, "")}</h2>`);
      continue;
    }
    // blockquote >
    if (/^>\s+/.test(line)) {
      out.push(`<blockquote>${line.replace(/^>\s+/, "")}</blockquote>`);
      continue;
    }
    // list items
    if (/^[-*]\s/.test(line)) {
      out.push(`<li class="md-li">${line.replace(/^[-*]\s+/, "")}</li>`);
    } else if (/^\d+[.)]\s/.test(line)) {
      out.push(`<li class="md-li">${line.replace(/^\d+[.)]\s+/, "")}</li>`);
    } else if (line.trim()) {
      out.push(`<p>${line}</p>`);
    }
  }
  return out.join("\n");
}

function renderGameDetail(title, md) {
  const lines = md.split("\n");
  // Try to find content after the front-matter (title line) and infobox
  // For game entries: # Title, > summary, infobox, then content
  // Skip the first ## onwards properly
  const bodyStart = lines.findIndex(l => l.startsWith("## "));
  const body = bodyStart >= 0 ? lines.slice(bodyStart).join("\n") : md;
  return renderMd(body);
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

  // Game link clicks → open detail overlay
  document.querySelectorAll(".tile-game-list a").forEach(a => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      openGame(a.getAttribute("href"));
    });
  });
}

function gameItem(g) {
  const bc = badgeClass(g.solution_status);
  const label = g.solution_status?.length > 25
    ? g.solution_status.slice(0, 22) + "…"
    : g.solution_status || "Unknown";
  return `<li><a href="games/${g.slug}.md">${esc(g.title)}</a><span class="sol-badge ${bc}">${esc(label)}</span></li>`;
}

// ── game detail overlay ──────────────────────────────────────────────────

async function openGame(path) {
  // Prevent if already showing
  if ($("#detail-overlay")) $("#detail-overlay").remove();

  const overlay = document.createElement("div");
  overlay.id = "detail-overlay";
  overlay.innerHTML = `
    <div class="detail-header">
      <button class="detail-back">← back</button>
      <h2 class="detail-title">${esc(path.replace(/\.md$/, "").replace(/^.*\//, ""))}</h2>
    </div>
    <div class="detail-body"><p class="md-p" style="color:var(--fg-muted)">loading…</p></div>
  `;
  document.body.appendChild(overlay);

  overlay.querySelector(".detail-back").addEventListener("click", closeGame);

  try {
    const r = await fetch(path);
    if (!r.ok) throw new Error(`${r.status}`);
    const md = await r.text();
    const title = md.split("\n")[0].replace(/^#\s*/, "") || path;
    overlay.querySelector(".detail-title").textContent = title;
    overlay.querySelector(".detail-body").innerHTML = renderGameDetail(title, md);

    // Wire up game links inside the detail view
    overlay.querySelectorAll(".game-link").forEach(a => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        openGame(a.getAttribute("href"));
      });
    });
  } catch (e) {
    overlay.querySelector(".detail-body").innerHTML =
      `<p class="md-p" style="color:var(--accent)">could not load ${esc(path)} (${e.message})</p>`;
  }
}

function closeGame() {
  const o = $("#detail-overlay");
  if (o) o.remove();
}

// ── search results ───────────────────────────────────────────────────────

function showResults(hits) {
  $results.classList.remove("hidden");
  $backdrop.classList.remove("hidden");
  $grid.classList.add("searching");

  $results.innerHTML = hits.map(h => {
    const r = meta[h.idx];
    let path;
    if (r.type === "game") path = `games/${r.source}.md`;
    else if (r.type === "lexicon") path = `lexicon/${r.source}.md`;
    else if (r.type === "reference") path = `references.md`;
    else path = "#";
    const section = r.section ? `<span class="section">§ ${esc(r.section)}</span>` : "";
    let text = r.text;
    if (text.length > 600) text = text.slice(0, 600) + "…";
    return `
      <div class="hit" data-path="${esc(path)}">
        <div class="meta">
          <span class="kind">${esc(r.type)}</span>
          <span class="source">${esc(r.source)}</span>
          ${section}
          <span class="dist">d=${h.dist.toFixed(3)}</span>
        </div>
        <div class="text">${renderMd(text)}</div>
      </div>`;
  }).join("");

  // Click hit to open detail
  $results.querySelectorAll(".hit").forEach(el => {
    el.addEventListener("click", () => {
      const path = el.dataset.path;
      if (path && path !== "#") openGame(path);
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
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !$results.classList.contains("hidden")) hideResults();
});

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
$q.focus();
