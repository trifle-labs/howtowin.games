# howtowin.games

**A wiki-style archive of games — how to play them well, and whether they are
solved.**

[howtowin.games](https://howtowin.games) catalogs games alongside the best
available answer to the question *"how should I play this well?"* For each
game, the entry records:

- **Rules** and a short description.
- **Solution status** — solved, partially solved, or unsolved — at the level
  of strength established in the primary literature.
- **Consensus on optimal play** — the heuristics strong players and engines
  actually rely on, with citations where they exist.
- **Engines & current best play** — the strongest known programs and what is
  known about how they search and evaluate.

Every claim is cited to the primary source wherever possible.

This repository is currently a static collection of structured Markdown files.
It is designed to eventually become a community-editable wiki — a
[BoardGameGeek](https://boardgamegeek.com)-style resource focused on *playing
well* rather than cataloguing publications — but that architecture comes
later. For now the goal is to **gather accurate, well-referenced content**.

## What "solved" means

A game can be solved at several levels of strength. The terminology used
throughout this archive follows [Allis (1994)](references.md#allis1994):

| Level | Meaning |
|-------|---------|
| **Ultra-weakly solved** | The game-theoretic value of the initial position is known, but not necessarily a strategy to achieve it. |
| **Weakly solved** | A strategy is known that achieves the game-theoretic value from the initial position, against any defence. |
| **Strongly solved** | A strategy is known that produces optimal play from *every* legal position. |

Most games of interest are **unsolved**. For those, the archive still
documents what is known about strong play — engine evaluations, well-tested
opening theory, and consensus heuristics.

See the [Lexicon](lexicon/README.md) for the full vocabulary of this field
(game-theoretic value, retrograde analysis, Sprague–Grundy theory, opposition,
zugzwang, and more).

## How to navigate

- **[Game index](index.md)** — all games, sorted, with solution status at a glance.
- **[Lexicon](lexicon/README.md)** — definitions of the jargon used in this field.
- **[References](references.md)** — the master bibliography. Every game entry
  links into this file by anchor.
- **[games/](games/)** — one Markdown file per game.

## Entry format

Every game entry follows [`games/_template.md`](games/_template.md): a summary
infobox, a description, the solution status with citations, the consensus on
optimal play, engines and current best play, complexity figures, and a
references section with local hyperlinks into [`references.md`](references.md).

## Status of this archive

This is an early content-gathering pass covering ~200 games drawn from the
solved-games literature and the most-played classical and abstract titles.
Coverage, citations, and accuracy are all works in progress — see
[CONTRIBUTING.md](CONTRIBUTING.md).

## Search database

A SQLite build of the archive — including vector embeddings of every section,
reference, and lexicon term — is produced by CI on every push to `main` and
attached to the [`db-latest`](https://github.com/trifle-labs/howtowin.games/releases/tag/db-latest)
release. To run search locally:

```sh
python3 -m venv .venv
.venv/bin/pip install -r _scripts/requirements.txt
.venv/bin/python _scripts/build_db.py
.venv/bin/python _scripts/embed.py
.venv/bin/python _scripts/search.py "how do I play connect four well"
```

The embedding model is [`BAAI/bge-small-en-v1.5`](https://huggingface.co/BAAI/bge-small-en-v1.5)
via [`fastembed`](https://github.com/qdrant/fastembed) (CPU, 384-dim);
vector search uses [`sqlite-vec`](https://github.com/asg017/sqlite-vec).
Embeddings are content-addressed and cached in `_cache/embeddings.sqlite`, so
unchanged chunks are never re-embedded.

## A note on accuracy

Game-solving results are sometimes misreported in secondary sources, and
"consensus best play" is genuinely contested for many games. Where this
archive states a result, it tries to cite the primary paper. Where a claim is
folklore, contested, or where the archive author is uncertain, the entry says
so explicitly. Corrections are welcome.
