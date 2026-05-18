# ConHex

> A mix of Hex and Othello where you claim tiles by filling their corners. Unsolved.

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
| **Playable** | conhex |

## Description

ConHex (by Michail Antonow, 2003) mixes the connection goal of [Hex](hex.md)
with the capturing feel of [Othello](othello.md). The board is made of small
polygon "tiles," each with several corner points. If you have pieces filling
more than half of a tile's corners, you **claim** that tile for yourself. You
win by connecting a chain of claimed tiles from one side of the board to the
opposite side.

## Rules

1. The board has a mix of different tile shapes. Most are pentagons (5-sided) with 5 corner points. Some are smaller tiles with 3 or 4 corners.
2. Players take turns placing one peg of their color on any empty corner point.
3. When a tile has more pegs of one color than the other in its corners, that tile is **claimed** by that color (it is re-checked whenever a new corner is filled).
4. The first player to create a connected chain of *claimed tiles* linking their two opposite sides of the board wins.
5. Like Hex, draws are not possible.

## Solution status

ConHex is **unsolved**. The tile-claiming rule introduces an aggregation step
that complicates retrograde analysis; the game has a small but active
community. No published solution exists.

## Consensus on optimal play

- **Aim to claim tiles, not just fill corners** — placing a peg matters only because it helps you win a tile. A corner point shared by several tiles is extra valuable because it can help you claim multiple tiles at once.
- **Fight over shared corner points first** — points that belong to 2-3 tiles at once are worth a lot. Securing them forces the opponent to spend extra moves defending several tiles while you build your chain efficiently.
- **Think in terms of tile chains, not peg lines** — the winning path is made of claimed tiles, not individual pegs. Picture which sequence of tiles you need to claim to connect your two sides and focus on those tiles' corner points.
- **Use the idea of "virtual connection" from Hex, but at the tile level** — two groups of claimed tiles that share two separate connecting paths cannot both be cut off. Learn to spot these patterns so you can play confidently without having to fully resolve each tile.
- **Extra pegs never hurt** — since having more pegs is always good, the first player has at least a theoretical draw. In practice, the first player seems to have an advantage, so the swap rule is used for fair play.

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
