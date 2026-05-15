#!/usr/bin/env python3
"""Parse the markdown corpus into howtowin.db (no embeddings yet).

Sources:
  games/*.md       -> games, game_sections, chunks
  references.md    -> refs, chunks
  lexicon/*.md     -> lexicon, chunks

Run from the repo root: python3 _scripts/build_db.py
"""

from __future__ import annotations

import hashlib
import os
import re
import sqlite3
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DB_PATH = ROOT / "howtowin.db"


SCHEMA = """
CREATE TABLE games (
    slug TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    summary TEXT,
    also_known_as TEXT,
    players TEXT,
    type TEXT,
    perfect_information TEXT,
    chance_element TEXT,
    solution_status TEXT,
    game_theoretic_value TEXT,
    year_solved TEXT,
    solved_by TEXT,
    state_space_complexity TEXT,
    game_tree_complexity TEXT,
    raw_md TEXT NOT NULL,
    content_hash TEXT NOT NULL
);

CREATE TABLE game_sections (
    game_slug TEXT NOT NULL REFERENCES games(slug),
    section TEXT NOT NULL,
    content TEXT NOT NULL,
    PRIMARY KEY (game_slug, section)
);

CREATE TABLE refs (
    anchor TEXT PRIMARY KEY,
    citation TEXT NOT NULL,
    link TEXT,
    archive_link TEXT,
    content_hash TEXT NOT NULL
);

CREATE TABLE lexicon (
    anchor TEXT PRIMARY KEY,
    term TEXT NOT NULL,
    definition TEXT NOT NULL,
    category TEXT,
    content_hash TEXT NOT NULL
);

CREATE TABLE chunks (
    id INTEGER PRIMARY KEY,
    source_type TEXT NOT NULL,
    source_id TEXT NOT NULL,
    section TEXT,
    text TEXT NOT NULL,
    content_hash TEXT NOT NULL UNIQUE
);

CREATE INDEX idx_chunks_source ON chunks(source_type, source_id);
CREATE INDEX idx_games_status ON games(solution_status);
"""


def sha256(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def slugify_term(term: str) -> str:
    s = term.lower()
    s = re.sub(r"[^\w\s-]", "", s)
    s = re.sub(r"\s+", "-", s.strip())
    return s


def parse_infobox(md: str) -> dict[str, str]:
    fields: dict[str, str] = {}
    in_table = False
    for line in md.splitlines():
        if line.startswith("|") and "|" in line[1:]:
            # skip header / separator
            if set(line.replace("|", "").strip()) <= set("-: "):
                in_table = True
                continue
            parts = [p.strip() for p in line.strip().strip("|").split("|")]
            if len(parts) != 2:
                continue
            key = parts[0].strip("*").strip()
            val = parts[1].strip()
            if key.lower() == "field" and val.lower() == "value":
                continue
            fields[key] = val
        elif in_table:
            break
    return fields


def parse_game(path: Path) -> tuple[dict, list[tuple[str, str]]]:
    md = path.read_text()
    lines = md.splitlines()

    title_match = re.search(r"^# (.+)$", md, re.M)
    title = title_match.group(1).strip() if title_match else path.stem

    summary_match = re.search(r"^> (.+)$", md, re.M)
    summary = summary_match.group(1).strip() if summary_match else None

    infobox = parse_infobox(md)

    sections: list[tuple[str, str]] = []
    cur_name: str | None = None
    cur_body: list[str] = []
    for line in lines:
        m = re.match(r"^## (.+)$", line)
        if m:
            if cur_name is not None:
                sections.append((cur_name, "\n".join(cur_body).strip()))
            cur_name = m.group(1).strip()
            cur_body = []
        elif cur_name is not None:
            cur_body.append(line)
    if cur_name is not None:
        sections.append((cur_name, "\n".join(cur_body).strip()))

    game = {
        "slug": path.stem,
        "title": title,
        "summary": summary,
        "also_known_as": infobox.get("Also known as"),
        "players": infobox.get("Players"),
        "type": infobox.get("Type"),
        "perfect_information": infobox.get("Perfect information"),
        "chance_element": infobox.get("Chance element"),
        "solution_status": infobox.get("Solution status"),
        "game_theoretic_value": infobox.get("Game-theoretic value"),
        "year_solved": infobox.get("Year solved"),
        "solved_by": infobox.get("Solved by"),
        "state_space_complexity": infobox.get("State-space complexity"),
        "game_tree_complexity": infobox.get("Game-tree complexity"),
        "raw_md": md,
        "content_hash": sha256(md),
    }
    return game, sections


REF_LINK_RE = re.compile(r"Link:\s*<([^>]+)>(?:\s*\(\[archive\]\(([^)]+)\)\))?")


def parse_references(path: Path) -> list[dict]:
    md = path.read_text()
    entries: list[dict] = []
    blocks = re.split(r"^### ", md, flags=re.M)[1:]
    for block in blocks:
        lines = block.splitlines()
        anchor = lines[0].strip()
        body = "\n".join(lines[1:]).strip()
        if not body:
            continue
        link_m = REF_LINK_RE.search(body)
        link = link_m.group(1) if link_m else None
        archive = link_m.group(2) if link_m else None
        citation = REF_LINK_RE.sub("", body).strip()
        entries.append({
            "anchor": anchor,
            "citation": citation,
            "link": link,
            "archive_link": archive,
            "content_hash": sha256(f"{anchor}\n{body}"),
        })
    return entries


def parse_lexicon(path: Path) -> list[dict]:
    md = path.read_text()
    entries: list[dict] = []
    current_category: str | None = None
    for block in re.split(r"^(##+ )", md, flags=re.M):
        block = block
    # Walk lines: track ## (category) and ### (term)
    lines = md.splitlines()
    i = 0
    while i < len(lines):
        line = lines[i]
        if line.startswith("## ") and not line.startswith("### "):
            current_category = line[3:].strip()
            i += 1
            continue
        if line.startswith("### "):
            term = line[4:].strip()
            body_lines: list[str] = []
            i += 1
            while i < len(lines) and not lines[i].startswith("### ") and not (lines[i].startswith("## ") and not lines[i].startswith("### ")):
                body_lines.append(lines[i])
                i += 1
            body = "\n".join(body_lines).strip()
            if not body:
                continue
            anchor = slugify_term(term)
            entries.append({
                "anchor": anchor,
                "term": term,
                "definition": body,
                "category": current_category,
                "content_hash": sha256(f"{anchor}\n{term}\n{body}"),
            })
            continue
        i += 1
    return entries


def make_game_chunks(game: dict, sections: list[tuple[str, str]]) -> list[dict]:
    chunks: list[dict] = []

    overview_parts = [game["title"]]
    if game["summary"]:
        overview_parts.append(game["summary"])
    overview_parts.append(
        f"Solution status: {game['solution_status']}. "
        f"Game-theoretic value: {game['game_theoretic_value']}. "
        f"Players: {game['players']}. Type: {game['type']}."
    )
    overview = "\n".join(overview_parts)
    chunks.append({
        "source_type": "game",
        "source_id": game["slug"],
        "section": "overview",
        "text": overview,
        "content_hash": sha256(f"game:{game['slug']}:overview:{overview}"),
    })

    for name, content in sections:
        if not content.strip():
            continue
        text = f"{game['title']} — {name}\n\n{content}"
        chunks.append({
            "source_type": "game",
            "source_id": game["slug"],
            "section": name,
            "text": text,
            "content_hash": sha256(f"game:{game['slug']}:{name}:{content}"),
        })
    return chunks


def make_ref_chunks(refs: list[dict]) -> list[dict]:
    out = []
    for r in refs:
        text = f"{r['anchor']}\n{r['citation']}"
        out.append({
            "source_type": "reference",
            "source_id": r["anchor"],
            "section": None,
            "text": text,
            "content_hash": sha256(f"ref:{r['anchor']}:{text}"),
        })
    return out


def make_lex_chunks(terms: list[dict]) -> list[dict]:
    out = []
    for t in terms:
        text = f"{t['term']}\n{t['definition']}"
        out.append({
            "source_type": "lexicon",
            "source_id": t["anchor"],
            "section": t["category"],
            "text": text,
            "content_hash": sha256(f"lex:{t['anchor']}:{text}"),
        })
    return out


def build() -> int:
    if DB_PATH.exists():
        DB_PATH.unlink()
    conn = sqlite3.connect(DB_PATH)
    conn.executescript(SCHEMA)

    games_dir = ROOT / "games"
    game_files = sorted(
        p for p in games_dir.glob("*.md")
        if p.stem != "_template"
    )

    all_chunks: list[dict] = []
    for path in game_files:
        game, sections = parse_game(path)
        conn.execute(
            """INSERT INTO games (
                slug, title, summary, also_known_as, players, type,
                perfect_information, chance_element, solution_status,
                game_theoretic_value, year_solved, solved_by,
                state_space_complexity, game_tree_complexity,
                raw_md, content_hash
            ) VALUES (
                :slug, :title, :summary, :also_known_as, :players, :type,
                :perfect_information, :chance_element, :solution_status,
                :game_theoretic_value, :year_solved, :solved_by,
                :state_space_complexity, :game_tree_complexity,
                :raw_md, :content_hash
            )""",
            game,
        )
        for section_name, body in sections:
            conn.execute(
                "INSERT INTO game_sections (game_slug, section, content) VALUES (?, ?, ?)",
                (game["slug"], section_name, body),
            )
        all_chunks.extend(make_game_chunks(game, sections))

    refs_path = ROOT / "references.md"
    if refs_path.exists():
        refs = parse_references(refs_path)
        for r in refs:
            conn.execute(
                """INSERT INTO refs (anchor, citation, link, archive_link, content_hash)
                   VALUES (:anchor, :citation, :link, :archive_link, :content_hash)""",
                r,
            )
        all_chunks.extend(make_ref_chunks(refs))

    lex_path = ROOT / "lexicon" / "README.md"
    if lex_path.exists():
        terms = parse_lexicon(lex_path)
        for t in terms:
            conn.execute(
                """INSERT INTO lexicon (anchor, term, definition, category, content_hash)
                   VALUES (:anchor, :term, :definition, :category, :content_hash)""",
                t,
            )
        all_chunks.extend(make_lex_chunks(terms))

    seen: set[str] = set()
    for c in all_chunks:
        if c["content_hash"] in seen:
            continue
        seen.add(c["content_hash"])
        conn.execute(
            """INSERT INTO chunks (source_type, source_id, section, text, content_hash)
               VALUES (:source_type, :source_id, :section, :text, :content_hash)""",
            c,
        )

    conn.commit()

    n_games = conn.execute("SELECT COUNT(*) FROM games").fetchone()[0]
    n_refs = conn.execute("SELECT COUNT(*) FROM refs").fetchone()[0]
    n_lex = conn.execute("SELECT COUNT(*) FROM lexicon").fetchone()[0]
    n_chunks = conn.execute("SELECT COUNT(*) FROM chunks").fetchone()[0]
    print(f"games:    {n_games}")
    print(f"refs:     {n_refs}")
    print(f"lexicon:  {n_lex}")
    print(f"chunks:   {n_chunks}")
    print(f"db:       {DB_PATH.relative_to(ROOT)} ({DB_PATH.stat().st_size // 1024} KB)")

    conn.close()
    return 0


if __name__ == "__main__":
    sys.exit(build())
