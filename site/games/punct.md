# PÜNCT

> A connection game on a small hexagonal board using stackable pieces of three shapes. It has not been solved.

| Field | Value |
|-------|-------|
| Also known as | PÜNCT, Punct |
| Players | 2 |
| Type | Partisan connection game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Unsolved |
| **Game-theoretic value** | Unknown |
| Year solved | — |
| Solved by | — |
| State-space complexity | Moderate |
| Game-tree complexity | Moderate-large |
| **Playable** | punct |

## Description

PUNCT (Kris Burm, 2005) is the fifth game in the GIPF project. It is a **connection game**: each player has pieces of three different shapes that cover different numbers of cells, and the goal is to connect two opposite sides of the board with an unbroken chain of your pieces.

## Rules

1. Board: a small hexagonal grid (37 cells).
2. Each player has pieces of three sizes (1, 2, and 3 cells in different line arrangements), a fixed small set per player.
3. On your turn, you can either:
   - **Place** a new piece flat on the board, covering the right number of empty cells; **or**
   - **Move/stack** an existing piece on top of another piece, moving it closer to your connection goal.
4. The first player to make a chain of connected pieces of their colour from their starting edge to the opposite edge wins.

## Solution status

PÜNCT is **not solved**. The mix of shapes and stacking gives a unique
evaluation problem; no published solution.

## Consensus on optimal play

- **Use big pieces for bridging** — 2- and 3-cell pieces cover more distance per move and can leap over single-cell gaps. Use them to push your connection forward.
- **Stack to get past blockers** — moving a piece on top of an opponent's piece both advances your chain and removes the opponent's piece from its blocking spot. Stacking is often the winning move.
- **Build along the shortest path across the board** — on the small hexagonal board, some diagonal routes are shorter than straight ones. Route your chain along the shortest possible path.
- **Threaten two routes at once** — if your pieces create two separate partial chains that each need one more piece to complete, the opponent cannot block both.
- **Use small pieces for defence** — single-cell pieces are cheap blockers. Place them in the opponent's path to force them to waste moves stacking.

## Engines & current best play

- **Strongest known program(s):** No game-specific public engine known to the cataloguer. Playable in general-purpose abstract-game frameworks (e.g., [Ludii](https://ludii.games/)).
- **Strength:** Not benchmarked.
- **Notes:** PÜNCT is a commercial GIPF-project game with a modest competitive community; no published computational analysis is known.

## Complexity

Moderate.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/P%C3%9CNCT) ([archive](http://web.archive.org/web/20260130062407/https://en.wikipedia.org/wiki/P%C3%9CNCT))
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)

## See also

- [GIPF](gipf.md) · [DVONN](dvonn.md) · [Hex](hex.md)
- Lexicon: [game-tree complexity](../lexicon/README.md#game-tree-complexity)
