#!/usr/bin/env python3
"""Assign every game to a category and generate site/categories.json.

Run after build_db.py:
    .venv/bin/python _scripts/categories.py

Outputs site/categories.json — used by the browser to render the tile grid.
"""

from __future__ import annotations

import json
import re
import sqlite3
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DB_PATH = ROOT / "howtowin.db"
SITE_DATA = ROOT / "site" / "data"

# ── category definitions ──────────────────────────────────────────────────

CATEGORIES = [
    {
        "id": "chess-variants",
        "title": "Chess Variants",
        "blurb": "Familiar pieces, unfamiliar rules — chess variants reshape checkmate, opening theory, and the value of every piece.",
        "icon": "chess-variants",
    },
    {
        "id": "draughts",
        "title": "Checkers & Draughts",
        "blurb": "Diagonal capture games on checkered boards — solved at the top level, deep strategy beneath.",
        "icon": "draughts",
    },
    {
        "id": "connection",
        "title": "Connection Games",
        "blurb": "Win by linking two sides of the board — simple rules, deep graph-theoretic strategy.",
        "icon": "connection",
    },
    {
        "id": "k-in-a-row",
        "title": "K-in-a-Row",
        "blurb": "Line up your pieces before your opponent does — the oldest family of positional games.",
        "icon": "k-in-a-row",
    },
    {
        "id": "go-territory",
        "title": "Go & Territory",
        "blurb": "Claim more area than your opponent — territory games reward全局 vision over local tactics.",
        "icon": "go",
    },
    {
        "id": "mancala",
        "title": "Mancala",
        "blurb": "Sow seeds around the board, capture the opponent's stones — ancient counting games with algebraic depth.",
        "icon": "mancala",
    },
    {
        "id": "impartial",
        "title": "Impartial Games",
        "blurb": "The same moves available to both players — Nim, Grundy numbers, and the Sprague–Grundy theorem.",
        "icon": "impartial",
    },
    {
        "id": "puzzles",
        "title": "Puzzles & Solitaire",
        "blurb": "One-player challenges — permutation puzzles, logic grids, sliding blocks, and the search for optimal solutions.",
        "icon": "puzzle",
    },
    {
        "id": "abstract-strategy",
        "title": "Abstract Strategy",
        "blurb": "Modern boardless abstracts — stacking, blocking, racing, and placement games with clean rulesets.",
        "icon": "abstract",
    },
    {
        "id": "mill-placement",
        "title": "Mill & Placement Games",
        "blurb": "Place pieces, form mills, slide and remove — positional games where territory and mobility trade off.",
        "icon": "mill",
    },
    {
        "id": "card-stochastic",
        "title": "Card & Stochastic Games",
        "blurb": "Imperfect information, dice, and hidden cards — probability meets psychology in these unsolved classics.",
        "icon": "card",
    },
    {
        "id": "hunt-asymmetric",
        "title": "Hunt & Asymmetric Games",
        "blurb": "Unequal sides with different goals — pursuer vs. evader, horde vs. army, wolf vs. sheep.",
        "icon": "hunt",
    },
    {
        "id": "asian-board",
        "title": "Asian Board Games",
        "blurb": "Shōgi, Xiàngqí, Janggi, Makruk — centuries-old national chess traditions with distinct rules and meta-strategies.",
        "icon": "asian-board",
    },
    {
        "id": "capture-clash",
        "title": "Capture & Clash",
        "blurb": "Seize, jump, surround — games where pieces are removed from the board as the primary win condition.",
        "icon": "capture",
    },
]

# ── game→category assignment (by type substring) ──────────────────────────

CATEGORY_RULES = [
    # Chess variants
    ("chess-variants", r"chess variant|chess-derived|minichess|shatranj"),
    # Draughts
    ("draughts", r"draughts|checkers|lasca"),
    # Connection
    ("connection", r"connection game|connection / scoring"),
    # K-in-a-row
    ("k-in-a-row", r"k-in-a-row|positional.*k-in-a-row|mnk-games"),
    # Go & territory
    ("go-territory", r"territory game|go board"),
    # Mancala
    ("mancala", r"mancala|sowing"),
    # Impartial
    ("impartial", r"^Impartial"),
    # Puzzles
    ("puzzles", r"puzzle|solitaire|Solo|^Solo"),
    # Abstract strategy
    ("abstract-strategy", r"^Partisan abstract|^Partisan combinatorial|abstract strategy|boardless|^Partisan stacking|^Partisan sliding|time-pressure|^Partisan race|^Partisan blocking|^Partisan movement"),
    # Mill & placement
    ("mill-placement", r"placement.*movement|placement.*mill|^Partisan placement|^Partisan positional|\"mill\"|positional / sliding|polyomino"),
    # Card & stochastic
    ("card-stochastic", r"stochastic|imperfect|dice|poker|bluffing|card game|trick-taking|catch-up"),
    # Hunt & asymmetric
    ("hunt-asymmetric", r"asymmetric|hunt game|^Partisan hunt|^Partisan pursuit|achievement"),
    # Capture & clash
    ("capture-clash", r"capture game|^Partisan capture|scoring game|^Partisan positional / capture|^Partisan racing.*capture"),
    # Asian board games (catch remaining board games that aren't chess variants)
    ("asian-board", r"shogi variant|^Partisan board"),
]

# Manual overrides (slug → category)
MANUAL = {
    "go": "go-territory",
    "checkers": "draughts",
    "chess": "chess-variants",
    "dots-and-boxes": "capture-clash",
    "rock-paper-scissors": "card-stochastic",
    "mastermind": "puzzles",
    "hanabi": "card-stochastic",
    "order-and-chaos": "abstract-strategy",
    "score-four": "k-in-a-row",
    "mnk-games": "k-in-a-row",
    "whim": "impartial",
    "shogi": "asian-board",
    "xiangqi": "asian-board",
    "janggi": "asian-board",
    "makruk": "asian-board",
    "courier-chess": "chess-variants",
    "shatranj": "chess-variants",
    "horde-chess": "chess-variants",
    "king-of-the-hill": "chess-variants",
    "three-check-chess": "chess-variants",
    "crazyhouse": "chess-variants",
    "losing-chess": "chess-variants",
    "atomic-chess": "chess-variants",
    "capablanca-chess": "chess-variants",
    "chess960": "chess-variants",
    "minichess": "chess-variants",
    "glinski-hexagonal-chess": "chess-variants",
    "dawsons-chess": "chess-variants",
    "maharajah-and-the-sepoys": "chess-variants",
    # Some chess variants have board-game type
    "battleship": "card-stochastic",
    "bridg-it": "connection",
    "fox-and-geese": "hunt-asymmetric",
    "hare-and-hounds": "hunt-asymmetric",
    "tigers-and-goats": "hunt-asymmetric",
    "wolves-and-sheep": "hunt-asymmetric",
    "catch-the-hare": "hunt-asymmetric",
    "halatafl": "hunt-asymmetric",
    "tzaar": "capture-clash",
    "dvonn": "capture-clash",
    "zertz": "abstract-strategy",
    "gipf": "abstract-strategy",
    "yinsh": "abstract-strategy",
    "twixt": "connection",
    "conhex": "connection",
    "crossway": "connection",
    "atoll": "connection",
    "slither": "connection",
    "star": "connection",
    "unlur": "connection",
    "quoridor": "connection",
    "lines-of-action": "connection",
    "breakthrough": "connection",
    "punct": "capture-clash",
    "surakarta": "capture-clash",
    "seega": "capture-clash",
    "othello": "capture-clash",
    "quarto": "k-in-a-row",
    "gomoku": "k-in-a-row",
    "renju": "k-in-a-row",
    "connect6": "k-in-a-row",
    "connect-four": "k-in-a-row",
    "qubic": "k-in-a-row",
    "pente": "capture-clash",
    "ninuki-renju": "k-in-a-row",
    "caro": "k-in-a-row",
    "backgammon": "card-stochastic",
    "bridge": "card-stochastic",
    "skat": "card-stochastic",
    "heads-up-limit-holdem": "card-stochastic",
    "heads-up-nolimit-holdem": "card-stochastic",
    "liars-dice": "card-stochastic",
    "yahtzee": "card-stochastic",
    "einstein-wurfelt-nicht": "card-stochastic",
    "klondike-solitaire": "puzzles",
    "tribolo": "abstract-strategy",
    "nada": "card-stochastic",
    "ticket-to-ride": "card-stochastic",
}


# ── helpers ────────────────────────────────────────────────────────────────

def resolve_category(slug: str, type_: str) -> str:
    if slug in MANUAL:
        return MANUAL[slug]
    for cat_id, pattern in CATEGORY_RULES:
        if re.search(pattern, type_, re.I):
            return cat_id
    print(f"  [unmatched] {slug}: {type_}", file=sys.stderr)
    return "abstract-strategy"  # fallback


# ── SVG icon definitions (b/w dither-ready) ────────────────────────────────

ICONS = {
    "chess-variants": (
        '<svg viewBox="0 0 48 48" fill="none">'
        '<path d="M16 6h4l2 6h4l2-6h4l-2 8h-12z" fill="#000"/>'
        '<circle cx="24" cy="18" r="3" fill="#000"/>'
        '<path d="M18 24c0 2 2 4 6 4s6-2 6-4" stroke="#000" stroke-width="2" fill="none"/>'
        '<rect x="16" y="28" width="16" height="2" fill="#000"/>'
        '<path d="M20 30v6c0 2-2 4-4 4h16c-2 0-4-2-4-4v-6" stroke="#000" stroke-width="2" fill="none"/>'
        '<circle cx="18" cy="38" r="2" fill="#000" opacity=".4"/>'
        '<circle cx="30" cy="38" r="2" fill="#000" opacity=".4"/>'
        '</svg>'
    ),
    "draughts": (
        '<svg viewBox="0 0 48 48" fill="none">'
        '<rect x="6" y="6" width="36" height="36" stroke="#000" stroke-width="2" fill="none"/>'
        '<line x1="6" y1="18" x2="42" y2="18" stroke="#000" stroke-width="1" opacity=".3"/>'
        '<line x1="6" y1="30" x2="42" y2="30" stroke="#000" stroke-width="1" opacity=".3"/>'
        '<line x1="18" y1="6" x2="18" y2="42" stroke="#000" stroke-width="1" opacity=".3"/>'
        '<line x1="30" y1="6" x2="30" y2="42" stroke="#000" stroke-width="1" opacity=".3"/>'
        '<circle cx="13" cy="13" r="4" fill="#000"/>'
        '<circle cx="25" cy="13" r="4" fill="#000"/>'
        '<circle cx="37" cy="13" r="4" fill="#000"/>'
        '<circle cx="19" cy="25" r="4" fill="#000" opacity=".6"/>'
        '<circle cx="31" cy="25" r="4" fill="#000" opacity=".6"/>'
        '<circle cx="13" cy="37" r="4" fill="#000" opacity=".3"/>'
        '<circle cx="25" cy="37" r="4" fill="#000" opacity=".3"/>'
        '<circle cx="37" cy="37" r="4" fill="#000" opacity=".3"/>'
        '</svg>'
    ),
    "connection": (
        '<svg viewBox="0 0 48 48" fill="none">'
        '<circle cx="10" cy="10" r="4" fill="#000"/>'
        '<circle cx="38" cy="10" r="4" fill="#000"/>'
        '<circle cx="10" cy="38" r="4" fill="#000"/>'
        '<circle cx="38" cy="38" r="4" fill="#000"/>'
        '<circle cx="24" cy="24" r="4" fill="#000"/>'
        '<line x1="10" y1="10" x2="24" y2="24" stroke="#000" stroke-width="2"/>'
        '<line x1="38" y1="10" x2="24" y2="24" stroke="#000" stroke-width="2"/>'
        '<line x1="10" y1="38" x2="24" y2="24" stroke="#000" stroke-width="2"/>'
        '<line x1="38" y1="38" x2="24" y2="24" stroke="#000" stroke-width="2"/>'
        '<line x1="10" y1="10" x2="38" y2="38" stroke="#000" stroke-width="1" opacity=".3" stroke-dasharray="3 3"/>'
        '<line x1="38" y1="10" x2="10" y2="38" stroke="#000" stroke-width="1" opacity=".3" stroke-dasharray="3 3"/>'
        '</svg>'
    ),
    "k-in-a-row": (
        '<svg viewBox="0 0 48 48" fill="none">'
        '<line x1="8" y1="16" x2="40" y2="16" stroke="#000" stroke-width="1.5" opacity=".3"/>'
        '<line x1="8" y1="32" x2="40" y2="32" stroke="#000" stroke-width="1.5" opacity=".3"/>'
        '<line x1="16" y1="8" x2="16" y2="40" stroke="#000" stroke-width="1.5" opacity=".3"/>'
        '<line x1="32" y1="8" x2="32" y2="40" stroke="#000" stroke-width="1.5" opacity=".3"/>'
        '<circle cx="16" cy="16" r="5" fill="none" stroke="#000" stroke-width="2"/>'
        '<circle cx="32" cy="16" r="5" fill="none" stroke="#000" stroke-width="2"/>'
        '<path d="M11 27l10 10M21 27l-10 10" stroke="#000" stroke-width="2"/>'
        '<circle cx="32" cy="32" r="5" fill="none" stroke="#000" stroke-width="2" opacity=".4"/>'
        '</svg>'
    ),
    "go": (
        '<svg viewBox="0 0 48 48" fill="none">'
        '<rect x="6" y="6" width="36" height="36" stroke="#000" stroke-width="1.5" fill="none"/>'
        '<line x1="18" y1="6" x2="18" y2="42" stroke="#000" stroke-width="1" opacity=".3"/>'
        '<line x1="30" y1="6" x2="30" y2="42" stroke="#000" stroke-width="1" opacity=".3"/>'
        '<line x1="6" y1="18" x2="42" y2="18" stroke="#000" stroke-width="1" opacity=".3"/>'
        '<line x1="6" y1="30" x2="42" y2="30" stroke="#000" stroke-width="1" opacity=".3"/>'
        '<circle cx="18" cy="18" r="5" fill="#000"/>'
        '<circle cx="24" cy="24" r="5" fill="none" stroke="#000" stroke-width="2"/>'
        '<circle cx="30" cy="18" r="5" fill="#000" opacity=".5"/>'
        '<circle cx="24" cy="12" r="5" fill="#000" opacity=".3"/>'
        '<circle cx="12" cy="24" r="5" fill="none" stroke="#000" stroke-width="2" opacity=".4"/>'
        '</svg>'
    ),
    "mancala": (
        '<svg viewBox="0 0 48 48" fill="none">'
        '<rect x="4" y="14" width="40" height="20" rx="3" stroke="#000" stroke-width="2" fill="none"/>'
        '<circle cx="14" cy="24" r="4" fill="#000" opacity=".8"/>'
        '<circle cx="24" cy="24" r="4" fill="#000" opacity=".4"/>'
        '<circle cx="34" cy="24" r="4" fill="#000" opacity=".6"/>'
        '<circle cx="10" cy="20" r="2" fill="#000" opacity=".3"/>'
        '<circle cx="20" cy="20" r="2" fill="#000" opacity=".5"/>'
        '<circle cx="30" cy="22" r="2" fill="#000" opacity=".3"/>'
        '</svg>'
    ),
    "impartial": (
        '<svg viewBox="0 0 48 48" fill="none">'
        '<line x1="8" y1="36" x2="40" y2="36" stroke="#000" stroke-width="2" opacity=".3"/>'
        '<rect x="10" y="24" width="6" height="12" fill="#000" rx="1"/>'
        '<rect x="20" y="16" width="6" height="20" fill="#000" rx="1"/>'
        '<rect x="30" y="8" width="6" height="28" fill="#000" rx="1"/>'
        '<text x="24" y="44" text-anchor="middle" font-size="8" fill="#000" opacity=".4">nim</text>'
        '</svg>'
    ),
    "puzzle": (
        '<svg viewBox="0 0 48 48" fill="none">'
        '<rect x="8" y="12" width="32" height="28" rx="2" stroke="#000" stroke-width="2" fill="none"/>'
        '<path d="M14 16h4v4h-4zM22 16h4v4h-4zM30 16h4v4h-4z" fill="#000" opacity=".3"/>'
        '<path d="M14 24h4v4h-4zM22 24h4v4h-4zM30 24h4v4h-4z" fill="#000" opacity=".5"/>'
        '<path d="M14 32h4v4h-4zM22 32h4v4h-4z" fill="#000" opacity=".7"/>'
        '<path d="M30 32h4v4h-4z" fill="#000" opacity=".9"/>'
        '</svg>'
    ),
    "abstract": (
        '<svg viewBox="0 0 48 48" fill="none">'
        '<polygon points="24,6 40,17 40,31 24,42 8,31 8,17" stroke="#000" stroke-width="2" fill="none"/>'
        '<line x1="24" y1="6" x2="24" y2="42" stroke="#000" stroke-width="1" opacity=".3" stroke-dasharray="3 3"/>'
        '<line x1="8" y1="17" x2="40" y2="17" stroke="#000" stroke-width="1" opacity=".3"/>'
        '<line x1="8" y1="31" x2="40" y2="31" stroke="#000" stroke-width="1" opacity=".3"/>'
        '<circle cx="24" cy="17" r="3" fill="#000"/>'
        '<circle cx="24" cy="31" r="3" fill="#000" opacity=".5"/>'
        '</svg>'
    ),
    "mill": (
        '<svg viewBox="0 0 48 48" fill="none">'
        '<rect x="6" y="6" width="12" height="12" stroke="#000" stroke-width="2" fill="none"/>'
        '<rect x="18" y="6" width="12" height="12" stroke="#000" stroke-width="2" fill="none"/>'
        '<rect x="30" y="6" width="12" height="12" stroke="#000" stroke-width="2" fill="none"/>'
        '<rect x="18" y="18" width="12" height="12" stroke="#000" stroke-width="2" fill="none"/>'
        '<rect x="6" y="30" width="12" height="12" stroke="#000" stroke-width="2" fill="none"/>'
        '<rect x="18" y="30" width="12" height="12" stroke="#000" stroke-width="2" fill="none"/>'
        '<rect x="30" y="30" width="12" height="12" stroke="#000" stroke-width="2" fill="none"/>'
        '<circle cx="12" cy="12" r="3" fill="#000"/>'
        '<circle cx="24" cy="12" r="3" fill="#000" opacity=".5"/>'
        '<circle cx="36" cy="12" r="3" fill="#000" opacity=".3"/>'
        '<circle cx="24" cy="24" r="3" fill="#000" opacity=".7"/>'
        '<circle cx="12" cy="36" r="3" fill="#000" opacity=".5"/>'
        '</svg>'
    ),
    "card": (
        '<svg viewBox="0 0 48 48" fill="none">'
        '<rect x="8" y="6" width="18" height="36" rx="2" stroke="#000" stroke-width="2" fill="none"/>'
        '<rect x="22" y="6" width="18" height="36" rx="2" stroke="#000" stroke-width="2" fill="none"/>'
        '<text x="17" y="30" text-anchor="middle" font-size="14" fill="#000">♠</text>'
        '<text x="31" y="30" text-anchor="middle" font-size="14" fill="#000">♥</text>'
        '</svg>'
    ),
    "hunt": (
        '<svg viewBox="0 0 48 48" fill="none">'
        '<circle cx="14" cy="18" r="6" fill="none" stroke="#000" stroke-width="2"/>'
        '<circle cx="34" cy="18" r="6" fill="none" stroke="#000" stroke-width="2"/>'
        '<path d="M14 24c0 6 6 8 10 10 4-2 10-4 10-10" stroke="#000" stroke-width="2" fill="none"/>'
        '<line x1="8" y1="6" x2="14" y2="12" stroke="#000" stroke-width="2"/>'
        '<line x1="20" y1="6" x2="14" y2="12" stroke="#000" stroke-width="2"/>'
        '<line x1="28" y1="6" x2="34" y2="12" stroke="#000" stroke-width="2"/>'
        '<line x1="40" y1="6" x2="34" y2="12" stroke="#000" stroke-width="2"/>'
        '<path d="M14 36l-4 6" stroke="#000" stroke-width="2" opacity=".4"/>'
        '<path d="M34 36l4 6" stroke="#000" stroke-width="2" opacity=".4"/>'
        '</svg>'
    ),
    "asian-board": (
        '<svg viewBox="0 0 48 48" fill="none">'
        '<rect x="6" y="6" width="36" height="36" stroke="#000" stroke-width="2" fill="none"/>'
        '<line x1="18" y1="6" x2="18" y2="42" stroke="#000" stroke-width="1" opacity=".3"/>'
        '<line x1="30" y1="6" x2="30" y2="42" stroke="#000" stroke-width="1" opacity=".3"/>'
        '<line x1="6" y1="18" x2="42" y2="18" stroke="#000" stroke-width="1" opacity=".3"/>'
        '<line x1="6" y1="30" x2="42" y2="30" stroke="#000" stroke-width="1" opacity=".3"/>'
        '<text x="24" y="24" text-anchor="middle" font-size="12" fill="#000" opacity=".8">将</text>'
        '<text x="24" y="38" text-anchor="middle" font-size="8" fill="#000" opacity=".4">棋</text>'
        '</svg>'
    ),
    "capture": (
        '<svg viewBox="0 0 48 48" fill="none">'
        '<circle cx="18" cy="18" r="8" fill="none" stroke="#000" stroke-width="2"/>'
        '<circle cx="30" cy="30" r="8" fill="none" stroke="#000" stroke-width="2"/>'
        '<path d="M22 22l-8 8" stroke="#000" stroke-width="3"/>'
        '<path d="M26 26l8-8" stroke="#000" stroke-width="2" opacity=".4"/>'
        '<circle cx="18" cy="18" r="3" fill="#000"/>'
        '<circle cx="30" cy="30" r="3" fill="#000" opacity=".5"/>'
        '</svg>'
    ),
}


# ── main ──────────────────────────────────────────────────────────────────

def main() -> int:
    if not DB_PATH.exists():
        print("howtowin.db missing — run build_db.py first", file=sys.stderr)
        return 1

    conn = sqlite3.connect(DB_PATH)
    rows = conn.execute(
        "SELECT slug, title, type, solution_status, game_theoretic_value, "
        "summary, family, is_head, playable, players FROM games ORDER BY title"
    ).fetchall()
    conn.close()

    # Build family → members map
    families: dict[str, list[dict]] = {}
    all_games: list[dict] = []
    for slug, title, type_, sol, gtv, summary, family, is_head, playable, players in rows:
        entry = {
            "slug": slug,
            "title": title,
            "solution_status": sol or "Unknown",
            "game_theoretic_value": gtv or "Unknown",
            "playable": bool(playable),
            "players": (players or "").strip(),
        }
        if is_head:
            entry["is_head"] = True
            families.setdefault(slug, [])
        if family:
            families.setdefault(family, []).append(entry)
        all_games.append((slug, title, type_, entry, family, is_head))

    # Build category→games mapping
    by_cat: dict[str, list[dict]] = {}
    for cat in CATEGORIES:
        by_cat[cat["id"]] = []

    members_in_cat: set[str] = set()
    unmatched = []
    for slug, title, type_, entry, family, is_head in all_games:
        cat_id = resolve_category(slug, type_)
        # Skip non-head family members (shown under their family head)
        if family and not is_head:
            members_in_cat.add(slug)
            continue
        if cat_id in by_cat:
            entry["members"] = families.get(slug, [])
            by_cat[cat_id].append(entry)
        else:
            unmatched.append(slug)

    if unmatched:
        for slug in unmatched:
            print(f"  [orphan] {slug}", file=sys.stderr)

    output = []
    for cat in CATEGORIES:
        games = by_cat[cat["id"]]
        if not games:
            continue
        cat_count = len(games)
        for g in games:
            cat_count += len(g.get("members", []))
        output.append({
            "id": cat["id"],
            "title": cat["title"],
            "blurb": cat["blurb"],
            "icon_svg": ICONS.get(cat["id"], ICONS["abstract"]),
            "count": cat_count,
            "games": games,
        })

    SITE_DATA.mkdir(parents=True, exist_ok=True)
    out_path = SITE_DATA / "categories.json"
    out_path.write_text(json.dumps(output, ensure_ascii=False))
    print(f"categories: {len(output)} ({sum(c['count'] for c in output)} games)")
    print(f"file: {out_path.relative_to(ROOT)} ({out_path.stat().st_size // 1024} KB)")

    return 0


if __name__ == "__main__":
    sys.exit(main())
