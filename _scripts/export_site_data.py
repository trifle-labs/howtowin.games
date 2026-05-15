#!/usr/bin/env python3
"""Export chunk metadata + vectors from howtowin.db into site/data/ for browser use.

The browser loads meta.json (JSON array of chunk metadata) and vectors.bin
(a flat Float32Array where chunk i spans floats [i*384 : (i+1)*384]).

Run after build_db.py + embed.py:
    .venv/bin/python _scripts/export_site_data.py
"""

from __future__ import annotations

import json
import sqlite3
import struct
import sys
from pathlib import Path

import sqlite_vec

ROOT = Path(__file__).resolve().parent.parent
DB_PATH = ROOT / "howtowin.db"
SITE_DATA = ROOT / "site" / "data"

DIM = 384


def main() -> int:
    if not DB_PATH.exists():
        print("howtowin.db missing — run build_db.py first", file=sys.stderr)
        return 1

    conn = sqlite3.connect(DB_PATH)
    conn.enable_load_extension(True)
    sqlite_vec.load(conn)
    conn.enable_load_extension(False)

    chunks = conn.execute(
        "SELECT id, source_type, source_id, section, text FROM chunks ORDER BY id"
    ).fetchall()

    SITE_DATA.mkdir(parents=True, exist_ok=True)

    # Export metadata as JSON
    meta = [
        {"id": r[0], "type": r[1], "source": r[2], "section": r[3], "text": r[4]}
        for r in chunks
    ]
    meta_path = SITE_DATA / "meta.json"
    meta_path.write_text(json.dumps(meta, ensure_ascii=False))
    print(f"meta: {meta_path.relative_to(ROOT)} ({meta_path.stat().st_size // 1024} KB, {len(meta)} chunks)")

    # Export vectors as raw Float32 binary
    vec_rows = conn.execute(
        "SELECT rowid, embedding FROM vec_chunks ORDER BY rowid"
    ).fetchall()

    # Validate order — vec_chunks rowids must match chunk ids
    ids = [r[0] for r in vec_rows]
    if ids != [r[0] for r in chunks]:
        print("ERROR: vec_chunks rowids don't match chunks ids", file=sys.stderr)
        return 1

    floats = bytearray()
    for _rid, blob in vec_rows:
        floats.extend(blob)

    vec_path = SITE_DATA / "vectors.bin"
    vec_path.write_bytes(bytes(floats))
    expected = len(chunks) * DIM * 4
    print(f"vec:  {vec_path.relative_to(ROOT)} ({vec_path.stat().st_size // 1024} KB, {len(floats)}/{expected} bytes)")

    assert len(floats) == expected, f"expected {expected} bytes, got {len(floats)}"

    conn.close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
