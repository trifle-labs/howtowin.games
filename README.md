# solved

**A wiki-style archive of games and their game-theoretic solution status.**

`solved` documents what is known about whether games are *solved* — and if so,
at what level, with what game-theoretic value, and whether the research
community agrees on *optimal play*. Every claim is cited to the primary
literature wherever possible.

This repository is, for now, a static collection of structured Markdown files.
It is designed to eventually become a community-editable wiki — a
[BoardGameGeek](https://boardgamegeek.com)-style resource for the study of
solved games — but that architecture comes later. For now the goal is to
**gather accurate, well-referenced content**.

## What "solved" means

A game can be solved at several levels of strength. The terminology used
throughout this archive follows [Allis (1994)](references.md#allis1994):

| Level | Meaning |
|-------|---------|
| **Ultra-weakly solved** | The game-theoretic value of the initial position is known, but not necessarily a strategy to achieve it. |
| **Weakly solved** | A strategy is known that achieves the game-theoretic value from the initial position, against any defence. |
| **Strongly solved** | A strategy is known that produces optimal play from *every* legal position. |

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
optimal play, complexity figures, and a references section with local
hyperlinks into [`references.md`](references.md).

## Status of this archive

This is an early content-gathering pass covering ~100 of the games most
discussed in the solved-games literature. Coverage, citations, and accuracy
are all works in progress — see [CONTRIBUTING.md](CONTRIBUTING.md).

## A note on accuracy

Game-solving results are sometimes misreported in secondary sources. Where this
archive states a result, it tries to cite the primary paper. Where a result is
folklore, contested, or where the archive author is uncertain, the entry says
so explicitly. Corrections are welcome.
