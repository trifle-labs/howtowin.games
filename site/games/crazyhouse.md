# Crazyhouse

> Chess variant where captured pieces become reusable — unsolved.

| Field | Value |
|-------|-------|
| Also known as | Crazyhouse, Drop chess |
| Players | 2 |
| Type | Partisan chess variant with piece-drop |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Unsolved |
| **Game-theoretic value** | Unknown |
| Year solved | — |
| Solved by | — |
| State-space complexity | Much larger than chess (piece reserves) |
| Game-tree complexity | Much larger than chess |
| **Playable** | crazyhouse |
| **Family** | chess |

## Description

Crazyhouse is a chess variant inspired by Bughouse: when you capture an enemy
piece you keep it in reserve, and on a later turn you may **drop** it onto any
empty square (with restrictions on pawns) instead of moving a piece on the
board. The added reserve state explodes the position space, and the game is
far from solved.

## Rules

1. Same setup, movement, and check/checkmate rules as orthodox chess.
2. When you capture an opposing piece, it is placed in your **reserve** as one
   of your colour (promoted pawns revert to pawns when captured).
3. On any turn instead of moving a piece, you may **drop** a reserve piece on
   any empty square subject to: pawns may not be dropped on the 1st or 8th
   rank; a dropped pawn cannot promote on the drop move.
4. A drop that delivers checkmate is legal (no "no drop-mate" rule).
5. Win by checkmate; draws by stalemate, threefold, and the 50-move rule apply.

## Solution status

Crazyhouse is **not solved**. The reserve adds combinatorial state on top of
chess, and engine strength has only recently caught up with top humans.

## Consensus on optimal play

Heuristics from strong human and engine play:

- **Pieces in hand are worth more than pieces on the board** — top players will sacrifice material on the board to gain a piece in reserve that can be dropped with tempo.
- **Knights are king** — knights are disproportionately valuable because drop-checks with knights are uncontested by interposition and can fork the king and queen.
- **Pawn breaks beat pawn structure** — opening up files to drop pieces matters more than long-term structural weaknesses.
- **The king must run** — castling is common but the king often walks to safety along the back rank because dropped pieces can fork castled kings easily.
- **First-move advantage is large** — practical statistics and engine self-play show a clear White edge, though no proof exists.

## Engines & current best play

- **Strongest known programs:** [Fairy-Stockfish](https://github.com/ianfab/Fairy-Stockfish) ([archive](http://web.archive.org/web/20230224150112/https://github.com/ianfab/Fairy-Stockfish)) (open source); the now-retired [JannLee](https://lichess.org/@/JannLee) ([archive](http://web.archive.org/web/20251104133530/https://lichess.org/@/JannLee)) (custom search + handcrafted eval) was a long-dominant Lichess bot. [Sjeng-Crazyhouse](https://www.sjeng.org/indexold.html) ([archive](http://web.archive.org/web/20260315205258/https://www.sjeng.org/indexold.html)) was an early classic.
- **Strength:** Super-human; engines surpassed top humans around 2017.
- **Notes:** No tablebases — the unbounded reserve state precludes them.

## Complexity

Larger than chess.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Crazyhouse) ([archive](http://web.archive.org/web/20260511100435/https://en.wikipedia.org/wiki/Crazyhouse))
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)

## See also

- [Chess](chess.md) · [Shogi](shogi.md) · [Atomic chess](atomic-chess.md)
- Lexicon: [partisan game](../lexicon/README.md#partisan-game)
