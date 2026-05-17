# ConHex

> A hybrid of Hex and Othello — connection on a board of "tiles" that flip when
> surrounded.

| Field | Value |
|-------|-------|
| Also known as | ConHex |
| Players | 2 |
| Type | Partisan connection game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Unsolved |
| **Game-theoretic value** | Unknown |
| Year solved | — |
| Solved by | — |
| State-space complexity | Larger than Hex on equivalent connectivity |
| Game-tree complexity | Large |

## Description

ConHex (Michail Antonow, 2003) combines [Hex](hex.md)-style connection goals
with [Othello](othello.md)-style capture: each "tile" of the board is a small
polygon containing several corner-points, and a player who has placed pieces in
a majority of a tile's corners **claims** the tile for themselves. Connection
of *claimed tiles* between opposite sides wins.

## Rules

1. The board is a non-uniform tiling: most cells are pentagons containing 5
   corner-points; some are smaller cells with 3 or 4 corners.
2. Players alternate placing one peg of their colour on any empty corner-point.
3. When a tile has more pegs of one colour than the other in its corner-points,
   that tile is **claimed** by that colour (and re-evaluated whenever a corner
   is filled).
4. The first player to form a connected chain of *claimed tiles* linking their
   two opposite sides wins.
5. Like Hex, draws are not possible.

## Solution status

ConHex is **unsolved**. The tile-claiming rule introduces an aggregation step
that complicates retrograde analysis; the game has a small but active
community. No published solution exists.

## Consensus on optimal play

- **Claim tiles, not corner-points** — placing a peg matters only insofar as it shifts a tile toward your colour majority; a corner-point shared by multiple tiles is especially valuable as it can influence several tile outcomes simultaneously.
- **Contest high-valency corner-points first** — points that are shared by 2–3 tiles are "multi-tile" pegs; securing them forces the opponent to overinvest in defense of multiple tiles while you build your chain efficiently.
- **Think in tile-connectivity chains, not peg lines** — the winning path is made of *claimed tiles*, not individual pegs; visualise which sequence of tiles you need to claim to connect your two sides and invest in those tiles' corner-points.
- **Apply virtual connection reasoning from Hex at the tile level** — two groups of claimed tiles that cannot both be disconnected (they share two disjoint connecting tile-paths) are virtually connected; recognise these structures to play confidently without fully resolving each tile.
- **The strategy-stealing argument applies** — an extra peg is never a liability, so first player has at least a theoretical draw; in practice first player appears to have an advantage, and the swap rule is appropriate for fair play.

## Engines & current best play

- **Strongest known program(s):** No game-specific public engine known to the cataloguer. Playable in general-purpose abstract-game frameworks (e.g., [Ludii](https://ludii.games/)).
- **Strength:** Not benchmarked.
- **Notes:** ConHex has a small dedicated community but no published competitive engine or formal game-theoretic analysis; heuristics from Hex analysis offer the closest applicable guidance.

## Complexity

Larger than plain Hex on a comparable board, due to the additional tile-state.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/ConHex)
- [Schensted & Titus (1975). *Mudcrack Y and Poly-Y*.](../references.md#schensted-titus1975) (general framework)

## See also

- [Hex](hex.md) · [Y](y.md) · [Crossway](crossway.md) · [Havannah](havannah.md)
- Lexicon: [game-tree complexity](../lexicon/README.md#game-tree-complexity)
