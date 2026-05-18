# SameGame

> A single-player puzzle where you clear groups of coloured tiles. Finding the best possible score is NP-hard. World records are set by Monte-Carlo search programs.

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
| **Playable** | samegame |

## Description

A rectangular grid filled with coloured blocks (usually 15x15 with up to 5 colours). Each move clears a connected group of same-coloured blocks. After clearing, the column falls down (and rows may compact, depending on the version). Your score goes up, and bigger groups give much more points than small ones. This game is famous as a test for Monte-Carlo search programs — record scores are held by computer search algorithms.

## Rules

1. Start with an m by n grid filled with coloured blocks.
2. Select any **connected group of 2 or more same-coloured** blocks and remove the whole group. You score (group_size - 2) squared points (or another similar formula).
3. After removing blocks, the blocks above fall straight down, and empty columns slide to the left.
4. Keep going until no group of size 2 or more remains.
5. Bonus: if you clear the whole board, you get extra points (usually 1000).

## Solution status

SameGame is **NP-hard** as a decision/optimisation problem (Biedl, Demaine,
Demaine, Fleischer, Jacobsen & Munro, 2002). Per-instance optimal solutions are
not known in general; record scores on the standard "20-board" benchmark are
established only empirically, by Monte-Carlo / nested rollout searches that
have advanced the state of the art repeatedly over the past two decades.

## Consensus on optimal play

- **Go for big groups** — the scoring formula means a group of 10 gives 64 points while two groups of 5 give only 18 each (36 total). Always try to merge groups before removing them.
- **Aim to clear the whole board** — clearing completely gives a big bonus (usually 1000 points). If a full clear is possible, it almost always beats any partial removal strategy.
- **Use search programs, not just guessing** — random playouts and Monte-Carlo search consistently find much higher scores than just picking the biggest group each time.
- **Do not leave single blocks stranded** — a single block of colour with no same-colour neighbours can never be removed. Check that your move does not leave any colour stranded alone.
- **Think about column positions** — after blocks fall and columns slide, the layout changes. Think ahead about how removing a left-side group affects where right-side groups end up, which you might want to merge later.

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
