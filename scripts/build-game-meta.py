#!/usr/bin/env python3
"""
Build site/data/game-meta.json — extra per-game metadata used by the tile grid.

For every game in site/data/categories.json:
  - family:     the category id (chess-variants, draughts, connection, …)
  - mechanic:   one of [grid, hex, line, pegs, mancala-track, cards, dice, 3d, none]
  - complexity: 1 (trivial) .. 5 (deep)  — rough strategic depth tier
  - popularity: 1 (obscure) .. 5 (household name)
  - age:        approximate origin year (negative = BCE)
  - solvedTier: 0 (unsolved) / 1 (partial) / 2 (solved) — derived from solution_status

The heuristics here are best-effort guesses from broad knowledge; refine by
editing this script and re-running. Not regenerated automatically on build.
"""
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "site/data/categories.json")
OUT = os.path.join(ROOT, "site/data/game-meta.json")

# Mechanic by slug (mostly-known surface; defaults to family later)
MECHANIC = {
    # hex-board games
    "hex":"hex","havannah":"hex","y":"hex","poly-y":"hex","star":"hex","atoll":"hex",
    "unlur":"hex","onyx":"hex","catchup":"hex","slither":"hex",
    "glinski-hexagonal-chess":"hex","conhex":"hex",
    # cards
    "klondike-solitaire":"cards","bridge":"cards","heads-up-limit-holdem":"cards",
    "heads-up-nolimit-holdem":"cards","hanabi":"cards","skat":"cards",
    "ticket-to-ride":"cards","mastermind":"cards","nada":"cards",
    # dice / stochastic
    "yahtzee":"dice","backgammon":"dice","liars-dice":"dice","einstein-wurfelt-nicht":"dice",
    # mancala-track
    "awari":"mancala-track","kalah":"mancala-track","bao":"mancala-track",
    "bao-la-kujifunza":"mancala-track","pallanguzhi":"mancala-track","songo":"mancala-track",
    "sungka":"mancala-track","toguz-kumalak":"mancala-track",
    # 3d / cube
    "pocket-cube":"3d","rubiks-cube":"3d","pyraminx":"3d","megaminx":"3d","skewb":"3d",
    "score-four":"3d","qubic":"3d","pylos":"3d","four-d-tic-tac-toe":"3d",
    # pure abstract line/graph
    "nim":"line","misere-nim":"line","kayles":"line","node-kayles":"line",
    "poker-nim":"line","fibonacci-nim":"line","tribonacci-nim":"line",
    "subtract-a-square":"line","mock-wythoff":"line","wythoffs-game":"line",
    "euclids-game":"line","ruler-game":"line","grundys-game":"line",
    "treblecross":"line","mock-turtles":"line","mogul":"line","tac-tix":"line",
    "turning-turtles":"line","whim":"line","triplets":"line",
    "geography":"line","undirected-vertex-geography":"line","node-kayles":"line",
    "hackenbush":"line","red-blue-green-hackenbush":"line","toppling-dominoes":"line",
    "toads-and-frogs":"line","shove":"line","push":"line","cherries":"line",
    "brussels-sprouts":"line","sprouts":"line","sim":"line","chomp":"line",
    "shannon-switching-game":"line","cram":"line","domineering":"line",
    "col":"line","snort":"line","atropos":"line","northcotts-game":"line",
    # peg-based
    "pegs-solitaire":"pegs","hashiwokakero":"pegs","twixt":"pegs",
    "bridg-it":"pegs","ninuki-renju":"grid",
    # default-to-grid for everything else (chess-likes, morris-likes, sliding, etc.)
}

# Approximate origin year (negative = BCE). Best-effort; refine in this dict.
AGE = {
    "chess": 600, "atomic-chess": 1995, "chess960": 1996, "crazyhouse": 1980,
    "courier-chess": 1200, "dawsons-chess": 1934, "hexapawn": 1962,
    "horde-chess": 1990, "king-of-the-hill": 2010, "los-alamos-chess": 1956,
    "losing-chess": 1900, "maharajah-and-the-sepoys": 1850, "minichess": 1969,
    "shatranj": 600, "three-check-chess": 1990, "capablanca-chess": 1920,
    "glinski-hexagonal-chess": 1936,
    "checkers": 1500, "brazilian-draughts": 1850, "frisian-draughts": 1700,
    "italian-draughts": 1500, "russian-draughts": 1700, "turkish-draughts": 1700,
    "international-draughts": 1700,
    "go": -2000, "gonnect": 2000,
    "awari": -700, "bao": 1700, "bao-la-kujifunza": 1800, "kalah": 1940,
    "pallanguzhi": 1500, "songo": 1900, "sungka": 1600, "toguz-kumalak": 1500,
    "tic-tac-toe": -1300, "ultimate-tic-tac-toe": 2013, "wild-tic-tac-toe": 1980,
    "connect-four": 1974, "connect6": 2003, "gomoku": 1700, "renju": 1899,
    "ninuki-renju": 1900, "pentago": 2005, "quarto": 1991, "qubic": 1953,
    "score-four": 1968, "mnk-games": 1980, "caro": 1900, "pente": 1977,
    "four-d-tic-tac-toe": 1980,
    "fifteen-puzzle": 1880, "conways-soldiers": 1961, "klondike-solitaire": 1880,
    "klotski": 1932, "lights-out": 1995, "mastermind": 1970, "minesweeper": 1989,
    "nonograms": 1987, "pegs-solitaire": 1697, "pocket-cube": 1981,
    "rubiks-cube": 1974, "pyraminx": 1981, "megaminx": 1981, "skewb": 1982,
    "rush-hour": 1996, "samegame": 1985, "slitherlink": 1989, "sokoban": 1981,
    "sudoku": 1979, "tower-of-hanoi": 1883, "hashiwokakero": 1990,
    "othello": 1971, "yahtzee": 1956, "backgammon": -3000, "battleship": 1931,
    "rock-paper-scissors": -100, "liars-dice": 1800, "nada": 2010,
    "bridge": 1880, "heads-up-limit-holdem": 1980, "heads-up-nolimit-holdem": 1980,
    "hanabi": 2010, "skat": 1817, "ticket-to-ride": 2004,
    "shogi": 1100, "xiangqi": 800, "janggi": 1300, "makruk": 1300, "lasca": 1911,
    "dobutsu-shogi": 2008, "fanorona": 1700, "arimaa": 2003,
    "amazons": 1988, "achi": 1900, "anti-reversi": 1971, "catchup": 2014,
    "cathedral": 1978, "dara": 1900, "eleven-mens-morris": 1400,
    "lasker-morris": 1900, "nine-holes": 1100, "nine-mens-morris": -50,
    "picaria": 1700, "quixo": 1991, "shisima": 1900, "six-mens-morris": 1100,
    "tant-fant": 1900, "tapatan": 1900, "teeko": 1937, "three-mens-morris": -1300,
    "twelve-mens-morris": 1400, "volo": 2010,
    "tic-tac-chec": 1972,
    "atropos": 1990, "cherries": 1990, "clobber": 2001, "col": 1976,
    "dao": 1995, "domineering": 1973, "gipf": 1997, "hackenbush": 1959,
    "hive": 2001, "konane": 1400, "l-game": 1969, "lyngk": 2017,
    "maze-conway": 1985, "mu-torere": 1700, "order-and-chaos": 1981,
    "phutball": 1982, "pong-hau-ki": 1700, "push": 1980, "pylos": 1995,
    "red-blue-green-hackenbush": 1976, "shove": 1990, "snort": 1976,
    "tamsk": 1998, "toads-and-frogs": 1976, "toppling-dominoes": 1980,
    "tribolo": 2010, "yinsh": 2003, "zertz": 1998,
    "breakthrough": 2000, "crossway": 2007, "havannah": 1979, "hex": 1942,
    "lines-of-action": 1969, "onyx": 1995, "poly-y": 1985, "quoridor": 1997,
    "shannon-switching-game": 1951, "slither": 2010, "star": 1983,
    "twixt": 1962, "unlur": 1999, "y": 1953, "bridg-it": 1958,
    "atoll": 2005, "conhex": 1990, "gonnect": 2000,
    "brandubh": 800, "catch-the-hare": 1500, "fox-and-geese": 1300,
    "halatafl": 1300, "hare-and-hounds": 1500, "sim": 1968, "tablut": 1500,
    "tigers-and-goats": 1700, "wolves-and-sheep": 1700,
    "dvonn": 2001, "dots-and-boxes": 1889, "punct": 2005, "seega": 1500,
    "surakarta": 1900, "tzaar": 2007, "yote": 1900,
    "einstein-wurfelt-nicht": 2004,
    "mock-wythoff": 1980, "mogul": 1990, "northcotts-game": 1970,
    "notakto": 2010, "treblecross": 1970, "tribonacci-nim": 1980,
    "triplets": 1970, "turning-turtles": 1970, "whim": 1970,
    "wythoffs-game": 1907, "subtract-a-square": 1970, "ruler-game": 1980,
    "mock-turtles": 1980, "tac-tix": 1952, "kayles": 1900, "misere-nim": 1900,
    "nim": -2000, "poker-nim": 1980, "node-kayles": 1980, "fibonacci-nim": 1980,
    "geography": 1978, "undirected-vertex-geography": 1978,
    "grundys-game": 1939, "euclids-game": 1969, "brussels-sprouts": 1967,
    "sprouts": 1967, "chomp": 1974, "cram": 1976, "shatranj": 600,
}

# Popularity 1-5 — household name (5) vs deeply niche (1).
POPULARITY = {
    "chess": 5, "tic-tac-toe": 5, "checkers": 5, "rubiks-cube": 5,
    "sudoku": 5, "minesweeper": 5, "klondike-solitaire": 5, "yahtzee": 5,
    "rock-paper-scissors": 5, "backgammon": 5, "go": 5, "connect-four": 5,
    "battleship": 5, "tower-of-hanoi": 5, "mastermind": 4,
    "othello": 4, "fifteen-puzzle": 4, "shogi": 4, "xiangqi": 4,
    "scrabble": 4, "monopoly": 4, "uno": 4, "hex": 4, "nim": 4,
    "lights-out": 4, "samegame": 4, "rush-hour": 4, "sokoban": 4,
    "nonograms": 4, "slitherlink": 3, "hashiwokakero": 3, "klotski": 4,
    "mancala": 4, "kalah": 3, "awari": 3, "pocket-cube": 3, "pyraminx": 3,
    "megaminx": 3, "skewb": 3, "pegs-solitaire": 4, "conways-soldiers": 3,
    "gomoku": 4, "pente": 3, "renju": 3, "twixt": 3, "amazons": 3,
    "quoridor": 4, "blokus": 4, "carcassonne": 4, "ticket-to-ride": 4,
    "bridge": 5, "skat": 4, "hanabi": 3, "heads-up-limit-holdem": 3,
    "heads-up-nolimit-holdem": 3, "liars-dice": 3, "nada": 2,
    "nine-mens-morris": 4, "lasker-morris": 2, "three-mens-morris": 3,
    "six-mens-morris": 2, "eleven-mens-morris": 2, "twelve-mens-morris": 2,
    "tapatan": 2, "achi": 2, "fanorona": 2,
    "dvonn": 3, "yinsh": 3, "zertz": 3, "tzaar": 3, "gipf": 3, "punct": 2,
    "tamsk": 2, "lyngk": 2, "pylos": 3, "quarto": 3, "pentago": 3,
    "hive": 4, "abalone": 4, "blokus": 4,
}

DEFAULT_POPULARITY = 2
DEFAULT_AGE = 1980

# Complexity tier — rough strategic depth (state space + branching + horizon)
COMPLEXITY = {
    # trivial / fixed strategy (1)
    "tic-tac-toe":1, "rock-paper-scissors":1, "tower-of-hanoi":1, "nim":1,
    "subtract-a-square":1, "euclids-game":1, "fibonacci-nim":1,
    "tribonacci-nim":1, "tapatan":1, "shisima":1, "achi":1, "three-mens-morris":1,
    "nine-holes":1, "wythoffs-game":1, "treblecross":1, "node-kayles":1,
    "mu-torere":1, "pong-hau-ki":1, "dao":1, "l-game":1, "picaria":1, "tant-fant":1,
    "pegs-solitaire":2, "fifteen-puzzle":2, "lights-out":2,
    # light tactical (2)
    "connect-four":2,"hexapawn":2,"misere-nim":2,"kayles":2,"sim":2,
    "fanorona":3,"halatafl":2,"hare-and-hounds":2,"fox-and-geese":2,
    "kalah":2,"awari":3,"poker-nim":2,"mastermind":2,"yahtzee":2,
    "minesweeper":2,"klondike-solitaire":2,"samegame":2,"sokoban":3,
    "klotski":3,"rush-hour":3,"sudoku":3,"nonograms":3,"slitherlink":3,
    "hashiwokakero":3, "battleship":2,"liars-dice":3,
    # medium (3)
    "othello":4,"checkers":4,"reversi":4,"konane":3,"pentago":3,"quarto":3,
    "score-four":3,"qubic":3,"pylos":3,"clobber":3,"col":3,"snort":3,
    "domineering":3,"breakthrough":3,"quixo":3,"teeko":3,"l-game":2,
    "amazons":4,"lasca":4,"surakarta":3,"yote":3,"seega":3,
    "tic-tac-chec":2,"ultimate-tic-tac-toe":3,"order-and-chaos":3,
    "twelve-mens-morris":3,"six-mens-morris":3,"eleven-mens-morris":3,
    "nine-mens-morris":4,"lasker-morris":4, "fanorona":3,
    "dvonn":4,"yinsh":4,"zertz":4,"tzaar":4,"gipf":4,"hive":4,
    # deep (4)
    "hex":4,"havannah":5,"twixt":4,"y":4,"poly-y":4,"star":4,"slither":4,
    "lines-of-action":4,"crossway":4,"gonnect":4,"unlur":4,"onyx":4,"atoll":4,
    "quoridor":4,"bridg-it":3,"shannon-switching-game":3,
    "shatranj":3,"makruk":4,"shogi":5,"xiangqi":5,"janggi":4,
    "courier-chess":3,"capablanca-chess":4,"crazyhouse":5,"atomic-chess":4,
    "horde-chess":3,"king-of-the-hill":4,"losing-chess":4,"los-alamos-chess":3,
    "minichess":3,"three-check-chess":4,"chess960":5,
    "dobutsu-shogi":2,"backgammon":5,"phutball":4,
    "brazilian-draughts":4,"italian-draughts":4,"international-draughts":5,
    "frisian-draughts":4,"russian-draughts":4,"turkish-draughts":4,
    # deepest (5)
    "chess":5,"go":5,"bridge":5,"hanabi":3,"skat":5,
    "heads-up-nolimit-holdem":5,"heads-up-limit-holdem":4,"ticket-to-ride":3,
    "rubiks-cube":2,"pocket-cube":1,"pyraminx":1,"megaminx":2,"skewb":1,
}

DEFAULT_COMPLEXITY = 3

# Family chip groups — keep close to existing category ids, but normalise a bit
FAMILY = {}
def derive_family(cat_id):
    return cat_id

# Status tier from text
def status_tier(text):
    s = (text or "").lower()
    if "unsolved" in s or "open" in s or "unknown" in s: return 0
    if "partial" in s or "partially" in s or "analysed" in s or "pspace" in s or "np-" in s: return 1
    if "solved" in s or "complete" in s: return 2
    return 0


def main():
    with open(SRC) as f:
        cats = json.load(f)

    out = {}
    for cat in cats:
        fam = derive_family(cat["id"])
        for g in cat["games"]:
            slug = g["slug"]
            out[slug] = build_entry(slug, g, fam)
            for m in g.get("members", []):
                out[m["slug"]] = build_entry(m["slug"], m, fam)

    with open(OUT, "w") as f:
        json.dump(out, f, indent=2, sort_keys=True)
    print(f"wrote {OUT} with {len(out)} entries")


def build_entry(slug, g, family):
    return {
        "family": family,
        "mechanic": MECHANIC.get(slug, "grid"),
        "complexity": COMPLEXITY.get(slug, DEFAULT_COMPLEXITY),
        "popularity": POPULARITY.get(slug, DEFAULT_POPULARITY),
        "age": AGE.get(slug, DEFAULT_AGE),
        "solvedTier": status_tier(g.get("solution_status")),
        "playable": bool(g.get("playable")),
        "players": g.get("players", ""),
        "title": g.get("title", slug),
        "status": g.get("solution_status", ""),
    }


if __name__ == "__main__":
    main()
