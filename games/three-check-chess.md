# Three-check chess

> Chess variant where giving check three times wins — unsolved.

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

## Description

Three-check chess is identical to orthodox chess except that a player wins
either by checkmate **or** by checking the opposing king three times in the
game. The added win condition reshapes opening and middlegame priorities.

## Rules

1. Same setup, movement, and rules as orthodox chess.
2. Each side maintains a **check count**; each time a player gives check, the
   count for the opponent increases by one.
3. The third check delivered against either king ends the game in favour of
   the checker, regardless of whether it is checkmate.
4. Checkmate, stalemate, draw-by-rule conditions continue to apply normally.

## Solution status

Three-check is **not solved**. Engines play it strongly and the variant is
popular online but no published proof exists.

## Consensus on optimal play

Heuristics from strong online play:

- **Develop pieces toward the king, not the centre** — the standard chess maxim "develop knights before bishops, claim the centre" is partially superseded: pieces that attack the king from afar (long diagonals, files behind the enemy king) are worth more because each safe check counts.
- **Don't trade queens** — the queen is the most versatile checking piece; trading it gives the opponent two free checking moves of relative safety.
- **Castle queenside more often than in chess** — kingside castling sometimes exposes the king to early check sequences on the h-file/diagonals; queenside is sometimes safer because Black's queen-attacking diagonals are blocked.
- **Count the checks, not just material** — losing a pawn to avoid the second/third check is often correct.

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
