# Cathedral

> A medieval-themed board game where you place building-shaped pieces and surround enemy buildings. Unsolved.

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

Cathedral (by Robert P. Moore, 1962) is a game where you place differently
shaped building pieces on a 10×10 board. Each player has a fixed set of pieces.
If you surround an enemy piece on all sides (with your pieces or the board
edge), it is removed and returned to its owner. The player with fewer unplayed
pieces (by point value) at the end wins.

## Rules

1. Board: a 10×10 grid. It starts empty except for the neutral **Cathedral** piece (a fixed shape that belongs to neither player).
2. Each player has a fixed set of buildings, each with a different shape. Pieces can be rotated but cannot overlap.
3. The starting player places the Cathedral. Then players take turns placing one of their buildings on the board.
4. Once both players have placed at least one piece, the **enclosing rule** kicks in: if a small area is completely surrounded by one player's pieces (and/or the board edge), any enemy pieces fully inside that area are removed and given back to their owner.
5. If you cannot make a legal placement, you pass. When both players pass one after another, the player with fewer points worth of unplaced pieces wins.

## Solution status

Cathedral is **not solved**. The polyomino-shape inventory and 10×10 board make
the branching factor enormous; engines exist but no formal solving result.

## Consensus on optimal play

- **Place the Cathedral near the center** — the Cathedral is neutral and is placed first. A central placement denies both players the best anchor spots, while putting it in a corner wastes it.
- **Use large pieces early, small pieces to fill gaps later** — big pieces need open space. Place them when the board is still empty. Small pieces can fill odd-shaped gaps later.
- **Try to surround areas quickly** — an enclosed area you own removes any enemy pieces inside it. Areas that close with 4-6 squares can capture important opponent pieces and also deny that space.
- **Stop the opponent from surrounding you** — don't cluster your pieces in a U shape that the opponent can close off with a single piece, trapping your buildings inside.
- **Track your unplaced piece points, not what's on the board** — you win by having fewer points of *unplaced* pieces. Placing high-value (large) pieces early helps your score even if they don't surround anything useful.

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
