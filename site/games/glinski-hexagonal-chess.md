# Glinski hexagonal chess

> Chess on a hexagonal board with three pawn directions — unsolved.

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

Glinski hexagonal chess (Władysław Gliński, 1936) maps chess onto a 91-cell
hexagonal board. The classical chess pieces are redefined for hex geometry:
bishops move along three diagonal directions, rooks along three orthogonal
ones, and there are three bishops per side (one per cell colour).

## Rules

1. Board: 91 hexagons arranged as a regular hexagon of side 6.
2. Each side has 9 pawns, 2 rooks, 2 knights, 3 bishops (one per cell colour),
   1 queen, 1 king.
3. Pieces move along the natural hex generalisations: rooks along the three
   orthogonal axes, bishops along the three diagonal axes, queen as both;
   knights have a defined leap; pawns move straight forward and capture
   diagonally forward (three directions).
4. Pawns promote on the far edge; there is no castling and no en-passant in
   Glinski's original rules.
5. Win is by checkmate; standard stalemate/draw rules apply with Glinski's
   adjustments.

## Solution status

Glinski hexagonal chess is **not solved**. Engine play exists but is far less
developed than orthodox chess.

## Consensus on optimal play

- **The third bishop matters** — with three bishops of different cell colours, each player can attack every hex; keeping all three active prevents colour-blind defensive setups that work in orthodox chess.
- **Centre control has six axes** — the hex board has three orthogonal and three diagonal directions; centralised pieces threaten more of the board than in square chess, making central occupation even more valuable.
- **Pawns are weaker than in orthodox chess** — three forward capture directions make pawn chains harder to form and easier to disrupt; avoid pawn-heavy positional play and favour piece activity.
- **Knights are relatively stronger** — knights leap, bypassing the six-directional flow; their fixed jump pattern is harder to anticipate on a hex board, making them excellent for surprise attacks.
- **King safety requires guarding six directions** — the hex king is approached from six rather than eight squares; ensure at least four of those approaches are covered by your own pieces.

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
