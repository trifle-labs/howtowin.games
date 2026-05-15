# SameGame

> A single-player tile-clearing puzzle — its optimisation version is NP-hard
> and the world high-score competition is dominated by Monte-Carlo search.

| Field | Value |
|-------|-------|
| Also known as | Same Game, Chain Shot!, Clickomania, Bubble Breaker |
| Players | 1 (puzzle) |
| Type | Single-player deterministic puzzle |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Unsolved (NP-hard; optimal play per instance) |
| **Game-theoretic value** | N/A (puzzle); high-score targets known only empirically |
| Year solved | — (NP-hardness: Biedl et al. 2002) |
| Solved by | — |
| State-space complexity | Exponential in board size |
| Game-tree complexity | Exponential |

## Description

A rectangular grid filled with coloured blocks (commonly 15×15 with up to 5
colours). Each move clears a connected group of same-coloured blocks; the
column collapses (and rows compact, in some variants); the player maximises
score, which is non-linear in group size. The game is famously a benchmark for
Monte-Carlo tree search and nested rollout policies — record scores are held by
search programs.

## Rules

1. Start with an m × n grid filled with coloured blocks.
2. Select any **connected group of ≥ 2 same-coloured** blocks; remove the whole
   group. Score (group_size − 2)² (or another fixed convex function).
3. After a removal, blocks above the gap fall straight down; empty columns slide
   leftward.
4. Continue until no group of size ≥ 2 remains.
5. Bonus: a board cleared completely scores a fixed bonus (commonly 1000).

## Solution status

SameGame is **NP-hard** as a decision/optimisation problem (Biedl, Demaine,
Demaine, Fleischer, Jacobsen & Munro, 2002). Per-instance optimal solutions are
not known in general; record scores on the standard "20-board" benchmark are
established only empirically, by Monte-Carlo / nested rollout searches that
have advanced the state of the art repeatedly over the past two decades.

## Consensus on optimal play

- **Prefer convex scoring — remove large groups** — the (size−2)² scoring function means removing a group of 10 scores 64 while two groups of 5 score 18 each (36 total); always prefer merging groups before removing them.
- **Target the complete clear** — a board cleared entirely gives a large bonus (commonly 1000 points); when a complete clear is possible, it almost always outscores any partial removal sequence.
- **Nested rollout search (NRPE) outperforms greedy** — random playouts, especially in nested or nested Monte-Carlo form, consistently find much higher scores than greedy-largest-first strategies; use MCTS or NRPE for benchmarks.
- **Avoid isolating small groups of 1** — a single block of colour that becomes isolated (no same-colour neighbours) can never be removed; every move should check whether it strands any colour.
- **Plan column structure** — after each collapse the column distribution changes; think ahead about how removing a left-side group changes the relative positions of right-side groups that you plan to merge next.

## Engines & current best play

- **Strongest known program(s):** Nested Rollout Policy Adaptation (NRPE) programs and Monte-Carlo tree search implementations.
- **Strength:** Vastly stronger than human play on the standard benchmark boards; record scores are updated periodically by new search techniques.
- **Where the proof / tablebase lives (if solved):** NP-hardness: Biedl et al. (2002); empirical record tracking at community benchmark sites.
- **Notes:** No provably optimal solution for any standard random board is known; all records are lower bounds from heuristic search.

## Complexity

Exponential — both the state space (collapsing-grid configurations) and the
optimisation are hard. The fixed-instance problem is the natural benchmark.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/SameGame) ([archive](http://web.archive.org/web/20260508102957/https://en.wikipedia.org/wiki/SameGame))
- [Hearn & Demaine (2009). *Games, Puzzles, and Computation*.](../references.md#hearn-demaine2009) (general framework)

## See also

- [Sokoban](sokoban.md) · [Tetris](nonograms.md) (related complexity)
- Lexicon: [PSPACE-complete / EXPTIME-complete](../lexicon/README.md#pspace-complete--exptime-complete)
