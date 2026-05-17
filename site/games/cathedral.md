# Cathedral

> A medieval-themed area-control game with polyominoes — unsolved.

| Field | Value |
|-------|-------|
| Also known as | Cathedral |
| Players | 2 |
| Type | Partisan polyomino placement game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Unsolved |
| **Game-theoretic value** | Unknown |
| Year solved | — |
| Solved by | — |
| State-space complexity | Moderate |
| Game-tree complexity | Large (high branching from many piece shapes and rotations) |

## Description

Cathedral (Robert P. Moore, 1962) is a polyomino-placement game on a 10×10
board: each player places a fixed set of differently-shaped building pieces;
surrounding an opposing piece on all sides removes it from the board. The
player with the fewer remaining un-played pieces wins.

## Rules

1. Board: 10×10 grid, initially empty except for the neutral **Cathedral** piece
   (a fixed polyomino).
2. Each player has a fixed inventory of buildings, each a different polyomino
   shape and orientation.
3. The starting player places the Cathedral, then players alternate placing one
   of their buildings on the board. Pieces may rotate but not overlap.
4. Once each player has placed at least one piece, **enclosing rule**: if a
   single small area is entirely bounded by one player's pieces (and/or the
   board edge), any opposing pieces fully inside that area are removed and
   returned to their owner.
5. A player who cannot make a legal placement passes. When both players pass
   consecutively, the player with the fewer points of unplayed pieces wins.

## Solution status

Cathedral is **not solved**. The polyomino-shape inventory and 10×10 board make
the branching factor enormous; engines exist but no formal solving result.

## Consensus on optimal play

- **Place the Cathedral near the centre to contest territory from both sides** — the Cathedral is neutral and placed first; a central placement denies both players optimal anchor squares while a corner placement largely wastes it as a shared border piece.
- **Use large pieces early, small pieces to fill gaps late** — large polyominoes require contiguous open space; placing them when the board is open gives more placement options. Small pieces can fill awkward spaces later.
- **Try to form enclosed regions quickly** — a closed region owned by you removes any opponent pieces inside it; regions that close with 4–6 squares can capture significant opponent pieces and simultaneously deny that space.
- **Deny your opponent enclosing opportunities** — avoid clustering your pieces in a concave arrangement that the opponent can cap with a single piece to form a closed region around your buildings.
- **Count unplayed piece-points, not placed pieces** — the winning condition is *fewer points of unplayed pieces remaining*, so deliberately placing high-value pieces (large buildings) early reduces your score even if you cannot create a great enclosure from them.

## Engines & current best play

- **Strongest known program(s):** No game-specific public engine known to the cataloguer. Playable in general-purpose abstract-game frameworks (e.g., [Ludii](https://ludii.games/)).
- **Strength:** Not benchmarked publicly.
- **Notes:** Cathedral has a dedicated hobbyist following but no published competitive engine or formal game-theoretic analysis; the high branching factor from polyomino orientations makes full solving computationally expensive.

## Complexity

Branching factor is the limiting issue; the state graph itself is moderate.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Cathedral_(board_game)) ([archive](http://web.archive.org/web/20260422123604/https://en.wikipedia.org/wiki/Cathedral_(board_game)))
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)

## See also

- [Quoridor](quoridor.md) · [Quarto](quarto.md)
- Lexicon: [game-tree complexity](../lexicon/README.md#game-tree-complexity)
