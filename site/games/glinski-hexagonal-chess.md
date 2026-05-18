# Glinski hexagonal chess

> Chess adapted for a hexagonal (six-sided) board. Pawns have three forward directions instead of one.

| Field | Value |
|-------|-------|
| Also known as | Glinski's hexagonal chess |
| Players | 2 |
| Type | Partisan chess variant |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Unsolved |
| **Game-theoretic value** | Unknown |
| Year solved | — |
| Solved by | — |
| State-space complexity | Larger than chess |
| Game-tree complexity | Larger than chess |

## Description

Glinski hexagonal chess (Wladyslaw Glinski, 1936) adapts chess to a board made of 91 hexagons arranged in a hexagon shape. The usual chess pieces are reimagined for the hexagonal geometry: bishops move along three diagonal directions, rooks along three straight (not diagonal) directions, and each player has three bishops (one for each cell color).

## Rules

1. Board: 91 hexagons arranged as a regular hexagon with sides of 6 cells.
2. Each player has 9 pawns, 2 rooks, 2 knights, 3 bishops (one per cell color), 1 queen, 1 king.
3. Pieces move along hexagonal directions: rooks move along the three straight directions, bishops along the three diagonal directions, the queen can do both. Knights have a defined leap. Pawns move straight forward and capture diagonally forward (in three directions).
4. Pawns are promoted when they reach the far edge. There is no castling or en-passant (capturing a pawn that just moved two squares forward) in Glinski's original rules.
5. A player wins by checkmate. Normal stalemate and draw rules apply with Glinski's adjustments.

## Solution status

Glinski hexagonal chess is **not solved**. Engine play exists but is far less
developed than orthodox chess.

## Consensus on optimal play

- **The third bishop matters** — with three bishops of different cell colors, each player can attack every hex. Keeping all three active prevents the "color-blind" defensive setups that work in regular chess.
- **Center control means controlling six directions** — the hex board has three straight and three diagonal directions. Central pieces threaten more of the board than in square chess, making center control even more important.
- **Pawns are weaker than in regular chess** — three forward capture directions make pawn chains harder to form and easier to break. Favor piece activity over pawn-heavy positional play.
- **Knights are relatively stronger** — knights jump over pieces, bypassing the six-directional flow. Their fixed jump pattern is harder to predict on a hex board, making them good for surprise attacks.
- **King safety means guarding six directions** — the hex king can be approached from six directions (not eight as in regular chess). Make sure at least four of those approaches are covered by your own pieces.

## Engines & current best play

- **Strongest known program(s):** No widely-known public engine for Glinski's variant; Fairy-Stockfish ([https://github.com/ianfab/Fairy-Stockfish](https://github.com/ianfab/Fairy-Stockfish) ([archive](http://web.archive.org/web/20230224150112/https://github.com/ianfab/Fairy-Stockfish))) supports some hex-chess variants but Glinski's specific rules may not be fully implemented.
- **Strength:** Weak to moderate; far below the strength of orthodox chess engines.
- **Where the proof / tablebase lives (if solved):** Not solved; no tablebase.
- **Notes:** Small competitive scene in continental Europe; human theory is the primary reference.

## Complexity

Larger than chess.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Hexagonal_chess) ([archive](http://web.archive.org/web/20260513200804/https://en.wikipedia.org/wiki/Hexagonal_chess))
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)

## See also

- [Chess](chess.md) · [Capablanca chess](capablanca-chess.md) · [Chess960](chess960.md)
- Lexicon: [partisan game](../lexicon/README.md#partisan-game)
