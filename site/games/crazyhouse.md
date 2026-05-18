# Crazyhouse

> A chess variant where captured pieces go into your pocket to drop later. Unsolved.

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

Crazyhouse is a chess variant inspired by Bughouse (a fast team chess game).
When you capture an enemy piece, you keep it in your reserve. On a later turn,
you can **drop** that piece onto any empty square (pawns have some
restrictions) instead of moving a piece already on the board. Having pieces in
reserve makes the game much more complex than regular chess, and it is far
from solved.

## Rules

1. Same starting setup, piece movement, and check/checkmate rules as regular chess.
2. When you capture an enemy piece, it goes into your **reserve** as one of your own pieces (promoted pawns return to being regular pawns when captured).
3. On any turn, instead of moving a piece, you may **drop** a piece from your reserve onto any empty square, with these limits: pawns cannot be dropped on the 1st or 8th row; a dropped pawn cannot promote on the same turn it is dropped.
4. You can deliver checkmate with a drop (there is no rule against it).
5. Win by checkmate. Draws happen by stalemate, threefold repetition, or the 50-move rule.

## Solution status

Crazyhouse is **not solved**. The reserve adds combinatorial state on top of
chess, and engine strength has only recently caught up with top humans.

## Consensus on optimal play

Tips from strong human and engine play:

- **Pieces in your hand are worth more than pieces on the board** — top players will sacrifice pieces on the board to gain a piece in reserve that they can drop with an attack.
- **Knights are king** — knights are extra valuable because dropping a knight to give check cannot be blocked (you cannot put a piece between the knight and the king), and knights can fork the king and queen.
- **Opening files with pawn moves matters more than pawn structure** — creating open files to drop pieces into is more important than worrying about long-term pawn weaknesses.
- **The king must run** — castling is common, but the king often has to keep moving along the back row to safety because dropped pieces can easily fork a castled king.
- **First-move advantage is large** — statistics and engine self-play show a clear advantage for White, though no proof exists.

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
