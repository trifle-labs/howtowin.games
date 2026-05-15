import { pipeline } from "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.2";

const DIM = 384;
const SHOW_INITIAL = 5;

const $ = (id) => document.getElementById(id);
const $q = $("q");
const $status = $("status");
const $grid = $("category-grid");
const $results = $("results");
const $clear = $("clear-btn");

let meta = [];
let vecs = null;
let extract = null;

// ── helpers ──────────────────────────────────────────────────────────────

function setStatus(msg) { $status.textContent = msg; }

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" })[c]);
}

function modelUrl(type, id) {
  const repo = "https://github.com/trifle-labs/howtowin.games/blob/main";
  if (type === "game") return `${repo}/games/${id}.md`;
  if (type === "reference") return `${repo}/references.md#${id}`;
  if (type === "lexicon") return `${repo}/lexicon/README.md#${id}`;
  return null;
}

function badgeClass(status) {
  const s = status.toLowerCase();
  if (s.includes("unsolved") || s.includes("open") || s.includes("unknown")) return "unsolved";
  if ((s.includes("solved") || s.includes("complete")) && !(s.includes("partial") || s.includes("partially"))) return "solved";
  if (s.includes("partial") || s.includes("analysed") || s.includes("pspace") || s.includes("np-")) return "partial";
  return "unsolved";
}

// ── quick markdown renderer ──────────────────────────────────────────────

function renderMd(text) {
  const lines = text.split("\n");
  const out = [];
  for (const raw of lines) {
    let line = raw;

    // inline code first (protect from other inline transforms)
    line = line.replace(/`([^`]+)`/g, "<code>$1</code>");

    // bold **text**
    line = line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

    // italic *text* (not inside a word)
    line = line.replace(/(?<!\w)\*(?!\*)(.+?)(?<!\*)\*(?!\w)/g, "<em>$1</em>");

    // links [text](url)
    line = line.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

    // inline code (already handled above)
    // headers ## → bold
    line = line.replace(/^##+\s+(.+)$/, "<strong>$1</strong>");

    // list items
    if (/^[-*]\s/.test(line)) {
      line = `<li class="md-li">${line.replace(/^[-*]\s+/, "")}</li>`;
    } else if (/^\d+[.)]\s/.test(line)) {
      line = `<li class="md-li">${line.replace(/^\d+[.)]\s+/, "")}</li>`;
    } else if (line === "---") {
      line = '<hr class="md-hr">';
    } else if (line.trim()) {
      // regular paragraph line
      line = `<span class="md-p">${line}</span>`;
    }

    out.push(line);
  }
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
  let nq2 = 0;
  for (let i = 0; i < DIM; i++) nq2 += queryVec[i] * queryVec[i];
  const nq = Math.sqrt(nq2) || 1;
  for (let i = 0; i < n; i++) {
    const off = i * DIM;
    let dot = 0, nv2 = 0;
    for (let j = 0; j < DIM; j++) {
      const q = queryVec[j] / nq;
      const v = vecs[off + j];
      dot += q * v;
      nv2 += v * v;
    }
    scores[i] = dot / (Math.sqrt(nv2) || 1);
  }
  const indices = Array.from({ length: n }, (_, i) => i);
  indices.sort((a, b) => scores[b] - scores[a]);
  return indices.slice(0, k).map(i => ({ idx: i, dist: 1 - scores[i] }));
}

// ── tile grid rendering ────────────────────────────────────────────────

function renderGrid(categories) {
  $grid.innerHTML = categories.map(c => {
    const top = c.games.slice(0, SHOW_INITIAL);
    const rest = c.games.slice(SHOW_INITIAL);
    return `
      <div class="tile" data-cat="${c.id}">
        <div class="tile-header">
          <div class="tile-icon">
            ${c.icon_svg}
          </div>
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

  // expand/collapse toggles
  document.querySelectorAll(".tile-toggle").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.target;
      const extra = document.querySelector(`ul[data-id="${id}-extra"]`);
      if (!extra) return;
      const open = extra.classList.toggle("open");
      btn.textContent = open ? "− fewer" : `+ ${extra.children.length} more`;
    });
  });
}

function gameItem(g) {
  const bc = badgeClass(g.solution_status);
  const label = g.solution_status?.length > 25
    ? g.solution_status.slice(0, 22) + "…"
    : g.solution_status || "Unknown";
  return `<li><a href="${modelUrl("game", g.slug)}" target="_blank" rel="noopener">${esc(g.title)}</a><span class="sol-badge ${bc}">${esc(label)}</span></li>`;
}

// ── search ────────────────────────────────────────────────────────────────

function renderSearchResults(hits) {
  $grid.classList.add("hidden");
  $results.classList.remove("hidden");
  $results.innerHTML = hits.map(h => {
    const r = meta[h.idx];
    const url = modelUrl(r.type, r.source);
    const title = url ? `<a href="${url}" target="_blank" rel="noopener" class="source">${esc(r.source)}</a>` : `<span class="source">${esc(r.source)}</span>`;
    const section = r.section ? `<span class="section">§ ${esc(r.section)}</span>` : "";
    return `
      <div class="hit">
        <div class="meta">
          <span class="kind">${esc(r.type)}</span>
          ${title}
          ${section}
          <span class="dist">d=${h.dist.toFixed(3)}</span>
        </div>
        <div class="text">${renderMd(r.text.slice(0, 600))}${r.text.length > 600 ? "…" : ""}</div>
      </div>`;
  }).join("");
}

function showGrid() {
  $grid.classList.remove("hidden");
  $results.classList.add("hidden");
}

// ── search loop ──────────────────────────────────────────────────────────

let pending = 0;

async function runSearch(text) {
  const myId = ++pending;
  text = text.trim();
  if (!text || !extract || !vecs) {
    showGrid();
    setStatus(extract && vecs ? (text ? "type to search" : "ready") : "loading…");
    return;
  }
  setStatus("searching…");
  const out = await extract(text, { pooling: "cls", normalize: true });
  if (myId !== pending) return;
  const qv = out.data;
  const hits = topK(qv, 8);
  if (myId !== pending) return;
  renderSearchResults(hits);
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
});
$clear.addEventListener("click", () => {
  $q.value = "";
  $clear.classList.add("hidden");
  showGrid();
  setStatus("ready.");
  $q.focus();
});
$q.addEventListener("focus", () => $q.select());

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

// Counts
const counts = { game: 0, reference: 0, lexicon: 0 };
for (const c of meta) {
  if (c.type in counts) counts[c.type]++;
  else if (c.type === "game") counts.game++;
}
$("count-games").textContent = counts.game;
$("count-refs").textContent = counts.reference;
$("count-lex").textContent = counts.lexicon;

// Load model
setStatus("loading embedding model (~30 MB, cached after first visit)…");
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

setStatus("ready.");
$q.disabled = false;
$q.focus();
