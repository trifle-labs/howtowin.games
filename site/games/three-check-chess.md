# Three-check chess

> Like regular chess, except a player can also win by putting the opponent's king in check three times. It has not been solved.

| Field | Value |
|-------|-------|
| Also known as | 3-check, Three-check |
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
| **Playable** | three-check-chess |

## Description

Three-check chess follows the same rules as regular chess, except a player can also win by putting the opposing king in check three times over the course of the game. This extra win condition changes how the opening and middle game are played.

## Rules

1. Same setup, movement, and rules as regular chess.
2. Each side keeps a check count. Each time a player puts the opponent's king in check, the opponent's count goes up by one.
3. The third check delivered against either king wins the game for the player who gave check, even if it is not checkmate.
4. Normal chess rules for checkmate, stalemate, and draws still apply.

## Solution status

Three-check is **not solved**. Engines play it strongly and the variant is
popular online but no published proof exists.

## Consensus on optimal play

- **Develop pieces toward the opponent's king, not just the center** — the usual chess advice of "develop knights before bishops and control the center" is less important here. Pieces that attack the king from a distance (long diagonals, open files) are worth more because each safe check counts.
- **Do not trade queens** — the queen is the best piece for giving check. Trading queens gives the opponent two safe moves without worrying about checks.
- **Castle queenside more often than in regular chess** — kingside castling can expose the king to early checks along the h-file or diagonals. Queenside is often safer because the opponent's attacking diagonals are blocked.
- **Count the checks, not just pieces** — losing a pawn to avoid a second or third check is often the right move.

## Engines & current best play

- **Strongest known programs:** [Fairy-Stockfish](https://github.com/ianfab/Fairy-Stockfish) ([archive](http://web.archive.org/web/20230224150112/https://github.com/ianfab/Fairy-Stockfish)) (open source); available for analysis on [Lichess](https://lichess.org/variant/threeCheck) ([archive](http://web.archive.org/web/20260507021356/https://lichess.org/variant/threeCheck)).
- **Strength:** Super-human.
- **Notes:** No specific tablebases; engine evaluation includes the check counter as an extra state dimension.

## Complexity

Similar to chess.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Three-check_chess) ([archive](http://web.archive.org/web/20260406014518/https://en.wikipedia.org/wiki/Three-check_chess))
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)

## See also

- [Chess](chess.md) · [Atomic chess](atomic-chess.md) · [King of the Hill](king-of-the-hill.md)
- Lexicon: [partisan game](../lexicon/README.md#partisan-game)
