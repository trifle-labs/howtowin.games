#!/usr/bin/env python3
"""Embed every chunk in howtowin.db and write vectors into a sqlite-vec table.

Uses a content-addressed cache (_cache/embeddings.sqlite) so unchanged chunks
are never re-embedded across runs — the cache keys on (model_name, content_hash).

Run after build_db.py:
    .venv/bin/python _scripts/embed.py
"""

from __future__ import annotations

import sqlite3
import struct
import sys
from pathlib import Path

import sqlite_vec
from fastembed import TextEmbedding

ROOT = Path(__file__).resolve().parent.parent
DB_PATH = ROOT / "howtowin.db"
CACHE_DIR = ROOT / "_cache"
CACHE_PATH = CACHE_DIR / "embeddings.sqlite"

MODEL_NAME = "BAAI/bge-small-en-v1.5"
DIM = 384


def open_with_vec(path: Path) -> sqlite3.Connection:
    conn = sqlite3.connect(path)
    conn.enable_load_extension(True)
    sqlite_vec.load(conn)
    conn.enable_load_extension(False)
    return conn


def pack(vec) -> bytes:
    return struct.pack(f"{len(vec)}f", *vec)


def ensure_cache(conn: sqlite3.Connection) -> None:
    conn.execute(
        """CREATE TABLE IF NOT EXISTS embeddings (
               model TEXT NOT NULL,
               content_hash TEXT NOT NULL,
               vector BLOB NOT NULL,
               PRIMARY KEY (model, content_hash)
           )"""
    )


def ensure_vec_table(conn: sqlite3.Connection) -> None:
    conn.execute("DROP TABLE IF EXISTS vec_chunks")
    conn.execute(
        f"CREATE VIRTUAL TABLE vec_chunks USING vec0(embedding float[{DIM}])"
    )


def main() -> int:
    if not DB_PATH.exists():
        print("howtowin.db missing — run build_db.py first", file=sys.stderr)
        return 1

    CACHE_DIR.mkdir(exist_ok=True)
    cache = sqlite3.connect(CACHE_PATH)
    ensure_cache(cache)

    db = open_with_vec(DB_PATH)
    ensure_vec_table(db)

    rows = db.execute(
        "SELECT id, content_hash, text FROM chunks ORDER BY id"
    ).fetchall()

    hashes = [(MODEL_NAME, h) for _, h, _ in rows]
    cache_hits: dict[str, bytes] = {}
    chunked = [hashes[i:i + 500] for i in range(0, len(hashes), 500)]
    for batch in chunked:
        q = "SELECT content_hash, vector FROM embeddings WHERE model = ? AND content_hash IN (" + \
            ",".join("?" * len(batch)) + ")"
        params = [MODEL_NAME, *[h for _, h in batch]]
        for h, v in cache.execute(q, params):
            cache_hits[h] = v

    needs_embed = [(cid, h, t) for cid, h, t in rows if h not in cache_hits]
    print(f"chunks: {len(rows)}  cached: {len(cache_hits)}  to embed: {len(needs_embed)}")

    if needs_embed:
        print(f"loading model {MODEL_NAME}…", flush=True)
        model = TextEmbedding(model_name=MODEL_NAME)
        texts = [t for _, _, t in needs_embed]
        vectors = list(model.embed(texts, batch_size=32))
        new_rows = []
        for (cid, h, _), vec in zip(needs_embed, vectors):
            blob = pack(vec.tolist())
            cache_hits[h] = blob
            new_rows.append((MODEL_NAME, h, blob))
        cache.executemany(
            "INSERT OR REPLACE INTO embeddings (model, content_hash, vector) VALUES (?, ?, ?)",
            new_rows,
        )
        cache.commit()

    db.executemany(
        "INSERT INTO vec_chunks (rowid, embedding) VALUES (?, ?)",
        [(cid, cache_hits[h]) for cid, h, _ in rows],
    )
    db.execute(
        """CREATE TABLE IF NOT EXISTS embedding_meta (
               key TEXT PRIMARY KEY,
               value TEXT NOT NULL
           )"""
    )
    db.executemany(
        "INSERT OR REPLACE INTO embedding_meta (key, value) VALUES (?, ?)",
        [("model", MODEL_NAME), ("dim", str(DIM))],
    )
    db.commit()

    n_vec = db.execute("SELECT COUNT(*) FROM vec_chunks").fetchone()[0]
    print(f"vec_chunks: {n_vec}")
    print(f"db: {DB_PATH.relative_to(ROOT)} ({DB_PATH.stat().st_size // 1024} KB)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
