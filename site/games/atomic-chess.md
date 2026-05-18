# Atomic chess

> A chess variant where every capture sets off an explosion. Unsolved.

| Field | Value |
|-------|-------|
| Also known as | Atomic chess |
| Players | 2 |
| Type | Partisan chess variant |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Unsolved |
| **Game-theoretic value** | Unknown |
| Year solved | — |
| Solved by | — |
| State-space complexity | Similar to chess |
| Game-tree complexity | Similar to chess |
| **Family** | chess |
| **Playable** | atomic-chess |

## Description

Atomic chess uses the same board and pieces as regular chess, but every time
you capture a piece, it causes an **explosion**. The blast removes your piece
too, along with all non-pawn pieces on the eight squares surrounding the
capture. The king is not allowed to capture (that would be suicide). You win
if your capture explodes the enemy king.

## Rules

1. Same starting setup and basic piece movements as regular chess.
2. Whenever a piece captures, the capturing piece is also destroyed. All pieces
   on the 8 squares around the captured piece are also destroyed **except pawns**.
3. The king may not capture (it would blow itself up).
4. You can **blow up** the enemy king by capturing any piece next to it. If you
   do this, you win immediately.
5. The two kings can sit on neighboring squares — they cannot capture each other.
6. The stalemate, threefold repetition, and 50-move rules work the same as in
   regular chess.

## Solution status

Atomic chess is **not solved**. Quick decisive games are possible because
explosions reshape the position drastically; opening tactics are sharp but no
formal solving result exists.

## Consensus on optimal play

Tips from strong online play:

- **King safety is everything** — since any capture next to the king blows it up, the king is much more exposed than in regular chess. Players often avoid castling. Many strong players keep the king on its starting square (or move it to f1/f8) to keep the squares around it clear.
- **Pawns in front of your king help the enemy, not you** — a pawn directly in front of your king means the opponent can blow you up by capturing anything on that square.
- **Avoid trading queens early** — queens cannot capture without exploding themselves and are often best used as long-range bomb triggers.
- **Known bad opening moves for White** include 1.Nf3 in some cases (according to engine analysis on Lichess). 1.e4 and 1.d4 are the standard safe choices.

No one has proven the game-theoretic value of the starting position.

## Engines & current best play

- **Strongest known programs:** [Fairy-Stockfish](https://github.com/ianfab/Fairy-Stockfish) ([archive](http://web.archive.org/web/20230224150112/https://github.com/ianfab/Fairy-Stockfish)) (Stockfish fork supporting atomic and most chess variants, open source); used by [Lichess](https://lichess.org/variant/atomic) ([archive](http://web.archive.org/web/20260313075304/https://lichess.org/variant/atomic)) for its server analysis.
- **Strength:** Super-human at fast time controls; opening theory is shallow compared to chess but deeply explored by engines.
- **Notes:** No tablebases exist for atomic-specific endgames — explosion semantics break standard chess endgame reductions.

## Complexity

Similar to chess.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Atomic_chess) ([archive](http://web.archive.org/web/20260407014026/https://en.wikipedia.org/wiki/Atomic_chess))
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)

## See also

- [Chess](chess.md) · [Crazyhouse](crazyhouse.md) · [Three-check chess](three-check-chess.md) · [Losing chess](losing-chess.md)
- Lexicon: [partisan game](../lexicon/README.md#partisan-game)
