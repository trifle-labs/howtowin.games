# Atomic chess

> Chess variant where captures cause an explosion — unsolved.

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

## Description

Atomic chess uses the standard chessboard and pieces, but every capture
triggers an **explosion** that removes both the capturing piece and all
non-pawn pieces on the eight adjacent squares. The king cannot capture
(suicide), and detonating the enemy king wins.

## Rules

1. Same setup and base movement as orthodox chess.
2. Whenever a piece captures, the capturing piece is also removed; all pieces
   on the 8 squares around the capture square are removed **except pawns**.
3. The king may not capture (it would self-destruct).
4. You may **explode** the opposing king by capturing any piece adjacent to it;
   doing so wins the game immediately.
5. The kings may legally stand on adjacent squares — they cannot capture each
   other.
6. Stalemate, threefold and 50-move rules carry over from chess.

## Solution status

Atomic chess is **not solved**. Quick decisive games are possible because
explosions reshape the position drastically; opening tactics are sharp but no
formal solving result exists.

## Consensus on optimal play

Practical wisdom from strong online play:

- **King safety dominates** — because any capture next to the king explodes it, the king is far more exposed than in chess. Castling is often *avoided*; many strong games keep the king on its starting square (or move it to f1/f8) to keep adjacent squares free.
- **Pawn shields are deadly to you, not the opponent** — a pawn directly in front of your king means the opponent can blow you up with any capture on that square.
- **Avoid early queen exchanges**; queens cannot capture without exploding themselves and are often used as long-range detonators.
- **Known losing first moves for White** include 1.Nf3 in some lines (engine analysis on Lichess); 1.e4 and 1.d4 are the standard practical choices.

No proven game-theoretic value.

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
