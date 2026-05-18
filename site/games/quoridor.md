# Quoridor

> A race game where you also build walls to slow down your opponent. Only solved on smaller boards.

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
| **Playable** | quoridor |

## Description

Played on a 9x9 grid of cells. Each player has a pawn starting on opposite edges and a supply of wall pieces (10 each in the two-player game). On your turn, you either move your pawn one cell or place a wall segment between cells. Walls block movement but **you may never completely block a player** from reaching their goal edge. The first pawn to reach the opposite edge wins.

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

- **Move forward when your path is shorter** — compare the shortest path to your goal versus the opponent's each turn. If your path is shorter, just move and save your walls for later.
- **Walls are limited — save them for important moments** — 10 walls per player run out fast. Placing a wall that only gains you one or two steps over just moving is a waste.
- **Use walls to make the opponent's path longer, not just to block one spot** — a well-placed wall can add 3-4 moves to the opponent's shortest route. Do the pathfinding calculation before placing.
- **Use walls when the opponent is ahead** — if the opponent's pawn is closer to their goal and you still have walls, now is the time to use them. Waiting too long is fatal.
- **Place walls deep in the opponent's territory** — early walls placed near the opponent's starting side are hard for them to route around and force long detours.

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
