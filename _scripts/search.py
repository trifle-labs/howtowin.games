#!/usr/bin/env python3
"""Vector search against howtowin.db.

Usage:
    .venv/bin/python _scripts/search.py "how do you play go well"
    .venv/bin/python _scripts/search.py -k 8 "strongly solved endgames"
"""

from __future__ import annotations

import argparse
import sqlite3
import struct
import sys
from pathlib import Path

import sqlite_vec
from fastembed import TextEmbedding

ROOT = Path(__file__).resolve().parent.parent
DB_PATH = ROOT / "howtowin.db"
MODEL_NAME = "BAAI/bge-small-en-v1.5"


def open_db() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.enable_load_extension(True)
    sqlite_vec.load(conn)
    conn.enable_load_extension(False)
    return conn


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("query", nargs="+")
    ap.add_argument("-k", type=int, default=5)
    args = ap.parse_args()
    query = " ".join(args.query)

    model = TextEmbedding(model_name=MODEL_NAME)
    [qvec] = list(model.query_embed([query]))
    qblob = struct.pack(f"{len(qvec)}f", *qvec.tolist())

    db = open_db()
    rows = db.execute(
        """SELECT c.source_type, c.source_id, c.section,
                  substr(c.text, 1, 280) AS snippet, v.distance
             FROM vec_chunks v
             JOIN chunks c ON c.id = v.rowid
            WHERE v.embedding MATCH ?
              AND k = ?
            ORDER BY v.distance""",
        (qblob, args.k),
    ).fetchall()

    print(f"query: {query}\n")
    for i, (stype, sid, section, snippet, dist) in enumerate(rows, 1):
        head = f"[{i}] {stype}/{sid}"
        if section:
            head += f"  §{section}"
        head += f"  (d={dist:.3f})"
        print(head)
        print(snippet.replace("\n", " "))
        print()
    return 0


if __name__ == "__main__":
    sys.exit(main())
