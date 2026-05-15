# Quoridor

> A race game where you also build walls to slow your opponent — solved only on
> reduced boards.

| Field | Value |
|-------|-------|
| Also known as | Quoridor |
| Players | 2 (also a 4-player variant) |
| Type | Partisan race / blocking game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Partially solved (small boards) |
| **Game-theoretic value** | Unknown for the standard 9×9 board |
| Year solved | Small boards: 2000s onward |
| Solved by | Lisa Glendenning and others (reduced-board analysis) |
| State-space complexity | ~10^42 (standard 9×9 board) **[verify]** |
| Game-tree complexity | Large |

## Description

Played on a 9×9 grid of cells. Each player has a pawn starting on opposite edges
and a supply of wall pieces (10 each in the two-player game). On a turn a player
either moves their pawn one cell or places a wall segment between cells. Walls
block movement but **may never completely seal a player off** from their goal
edge. The first pawn to reach the opposite edge wins.

## Solution status

Quoridor is **partially solved**. Reduced boards (e.g. small *n*×*n* grids with
correspondingly few walls) have been solved exhaustively —
[Glendenning's (2005)](../references.md#glendenning-quoridor2005) thesis and
later work analyse such cases — and small-board results generally favour the
first player. The standard **9×9** board, with its huge branching factor from
wall placements, is **unsolved**. The "no full blockade" rule also makes legal
move generation non-trivial, since each candidate wall must be checked for
path-preservation.

> **[verify]** — The ~10^42 state-space figure for the 9×9 board is an
> order-of-magnitude estimate that should be checked against a primary source.

## Consensus on optimal play

- **Advance while you have the shorter path** — count shortest path to your goal vs. the opponent's at every turn; as long as your path is shorter, just move and don't waste walls.
- **Walls are a finite resource — save them for pivotal moments** — 10 walls per player run out quickly; placing walls to gain only one or two steps over the pawn-move alternative wastes this resource.
- **Use walls to lengthen the opponent's path, not just to block** — a well-placed wall can add 3–4 moves to the opponent's shortest path; do the pathfinding calculation (BFS) before placing.
- **Never let the opponent's pawn get ahead without using walls** — if the opponent's pawn is closer to their goal and you have walls remaining, this is the time to spend them; waiting too long is fatal.
- **Horizontal walls near the opponent's starting side are usually stronger** — early walls placed deep in the opponent's territory are hard for them to route around and force long detours.

## Engines & current best play

- **Strongest known program(s):** Various open-source bots (e.g. Quoridor-specific minimax programs with BFS-based heuristics); no dominant publicly benchmarked engine.
- **Strength:** Strong amateur; competitive with experienced human players.
- **Where the proof / tablebase lives (if solved):** [Glendenning (2005)](../references.md#glendenning-quoridor2005) (small boards only)
- **Notes:** The 9×9 board is unsolved; first-player advantage is widely assumed but unproven.

## Complexity

Standard board ~10^42 positions **[verify]**; the wall-placement branching makes
the game tree very wide.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Quoridor) ([archive](http://web.archive.org/web/20260512183438/https://en.wikipedia.org/wiki/Quoridor))
- [Glendenning, L. (2005). *Mastering Quoridor*.](../references.md#glendenning-quoridor2005)

## See also

- [Breakthrough](breakthrough.md) · [Hex](hex.md)
- Lexicon: [partially solved](../lexicon/README.md#solved-game) · [game-tree complexity](../lexicon/README.md#game-tree-complexity)
