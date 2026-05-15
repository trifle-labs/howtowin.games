import { pipeline, env } from "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.2";

const DIM = 384;

const $q = document.getElementById("q");
const $status = document.getElementById("status");
const $results = document.getElementById("results");
const $countGames = document.getElementById("count-games");
const $countRefs = document.getElementById("count-refs");
const $countLexicon = document.getElementById("count-lex");

env.allowLocalModels = false;
env.useBrowserCache = true;

function setStatus(msg) {
  $status.textContent = msg;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[c]);
}

function sourceUrl(type, id) {
  const repo = "https://github.com/trifle-labs/howtowin.games/blob/main";
  if (type === "game") return `${repo}/games/${id}.md`;
  if (type === "reference") return `${repo}/references.md#${id}`;
  if (type === "lexicon") return `${repo}/lexicon/README.md#${id}`;
  return null;
}

// --- data loading ---

let meta = [];
let vecs = null;

async function loadMeta() {
  const resp = await fetch("./data/meta.json");
  if (!resp.ok) throw new Error(`meta.json: ${resp.status}`);
  meta = await resp.json();
}

async function loadVectors() {
  const resp = await fetch("./data/vectors.bin");
  if (!resp.ok) throw new Error(`vectors.bin: ${resp.status}`);
  const buf = await resp.arrayBuffer();
  vecs = new Float32Array(buf);
}

// --- cosine similarity ---

function cosineSimilarity(query, offset) {
  let dot = 0, nq = 0, nv = 0;
  // query is already normalized, but compute norms for safety
  for (let i = 0; i < DIM; i++) {
    const q = query[i];
    const v = vecs[offset + i];
    dot += q * v;
    nq += q * q;
    nv += v * v;
  }
  return dot / (Math.sqrt(nq) * Math.sqrt(nv) || 1);
}

function topK(query, k) {
  const n = meta.length;
  const scores = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    scores[i] = cosineSimilarity(query, i * DIM);
  }
  const indices = Array.from({ length: n }, (_, i) => i);
  indices.sort((a, b) => scores[b] - scores[a]);
  return indices.slice(0, k).map((i) => ({ idx: i, dist: 1 - scores[i] }));
}

// --- model ---

let extract = null;

async function loadModel() {
  setStatus("loading embedding model… (~30 MB, cached after first visit)");
  extract = await pipeline(
    "feature-extraction",
    "Xenova/bge-small-en-v1.5",
    { progress_callback: (p) => {
        if (p.status === "progress" && p.total) {
          const pct = Math.round((p.loaded / p.total) * 100);
          setStatus(`downloading model… ${p.file} ${pct}%`);
        }
    } }
  );
}

// --- search ---

function render(hits) {
  $results.innerHTML = hits.map((h) => {
    const r = meta[h.idx];
    const url = sourceUrl(r.type, r.source);
    const title = url
      ? `<a href="${url}" target="_blank" rel="noopener">${escapeHtml(r.source)}</a>`
      : escapeHtml(r.source);
    const section = r.section ? `<span>§ ${escapeHtml(r.section)}</span>` : "";
    let text = r.text;
    if (text.length > 600) text = text.slice(0, 600) + "…";
    return `
      <div class="hit">
        <div class="meta">
          <span class="kind">${escapeHtml(r.type)}</span>
          ${title}
          ${section}
          <span class="dist">d=${h.dist.toFixed(3)}</span>
        </div>
        <div class="text">${escapeHtml(text)}</div>
      </div>`;
  }).join("");
}

let pending = 0;

async function runSearch(text) {
  const myId = ++pending;
  text = text.trim();
  if (!text || !extract || !vecs) {
    $results.innerHTML = "";
    if (extract && vecs) setStatus("ready.");
    return;
  }
  setStatus("searching…");
  const out = await extract(text, { pooling: "cls", normalize: true });
  if (myId !== pending) return;
  const queryVec = out.data;
  const hits = topK(queryVec, 8);
  if (myId !== pending) return;
  render(hits);
  setStatus(`${hits.length} hits.`);
}

let debounce;
$q.addEventListener("input", () => {
  clearTimeout(debounce);
  debounce = setTimeout(() => runSearch($q.value), 180);
});
$q.addEventListener("keydown", (e) => {
  if (e.key === "Enter") { clearTimeout(debounce); runSearch($q.value); }
});

// --- boot ---

setStatus("loading metadata…");
await loadMeta();

setStatus("loading vectors…");
await loadVectors();

// Update counts
const counts = { game: 0, reference: 0, lexicon: 0 };
for (const c of meta) {
  if (c.type in counts) counts[c.type]++;
  else if (c.type === "game") counts.game++;
}
$countGames.textContent = counts.game;
$countRefs.textContent = counts.reference;
$countLexicon.textContent = counts.lexicon;

await loadModel();

setStatus("ready. type a question above.");
$q.disabled = false;
$q.focus();
