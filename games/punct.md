# PÜNCT

> A connection game on a small hexagonal board with stackable pieces of three
> shapes — unsolved.

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

## Description

PÜNCT (Kris Burm, 2005) is the fifth GIPF-project game. It is a **connection
game**: each player has pieces of three different shapes, each occupying a
different number of cells, and the goal is to link two opposite sides with a
contiguous chain of your pieces.

## Rules

1. Board: small hexagonal grid (37 cells).
2. Each player has pieces of three sizes (1, 2, and 3 cells in different
   linear arrangements), totalling a fixed small set per player.
3. On a turn, a player either:
   - **Place** a new piece flat on the board, covering the appropriate empty
     cells; **or**
   - **Move/stack** an existing piece on top of another piece, advancing it
     toward the connection.
4. The first player to form a chain of connected pieces of their colour from
   their starting edge to the opposite edge wins.

## Solution status

PÜNCT is **not solved**. The mix of shapes and stacking gives a unique
evaluation problem; no published solution.

## Consensus on optimal play

- **Use larger pieces for bridging** — the 2- and 3-cell pieces span more distance per move and can leap over single-cell gaps; prioritise them for advancing your connection path.
- **Stack to bypass opponent blockers** — moving a piece on top of an opponent's piece both advances your chain and removes the opponent's piece from its blocking location; stacking is often the decisive manoeuvre.
- **Build the connection through the board's shortest diameter** — on the small hexagonal board some diagonal paths are shorter than straight paths; route your chain along the minimum-distance axis.
- **Threaten two routes simultaneously** — if your pieces create two separate partial chains that each need one more bridging move to complete, the opponent cannot block both.
- **Defend with 1-cell pieces** — small single-cell pieces are cheap blockers; place them in the opponent's direct path to force them to stack and spend tempo.

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
