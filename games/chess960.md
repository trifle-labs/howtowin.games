# Chess960

> Chess with a random starting position (960 possible setups). Unsolved.

| Field | Value |
|-------|-------|
| Also known as | Fischer Random chess, FRC |
| Players | 2 |
| Type | Partisan chess variant |
| Perfect information | Yes |
| Chance element | No (initial position drawn once before play) |
| **Solution status** | Unsolved |
| **Game-theoretic value** | Unknown |
| Year solved | — |
| Solved by | — |
| State-space complexity | Similar to chess (×960 start positions) |
| Game-tree complexity | Similar to chess |
| **Family** | chess |

## Description

Chess960 (by Bobby Fischer, 1996) keeps all the rules of regular chess but
randomizes the starting position of the back-row pieces. There are **960**
legal starting positions (bishops must start on opposite colors, king must
start between the rooks). The goal is to make memorized opening sequences
useless, so players must think from move one.

## Rules

1. Before the game starts, one of the 960 valid starting setups is chosen. Pawns always start on the 2nd and 7th rows. The king must be between the two rooks, and the two bishops must sit on opposite colors.
2. Both players start with the same setup (mirrored). After setup, the game plays exactly like regular chess.
3. **Castling** works differently: no matter where the king and rook started, they end up on the standard castling squares (c1/g1 or c8/g8 for the king; d1/f1 or d8/f8 for the rook). All squares the king passes through must be safe and empty (except for the rook).
4. All other rules — pawn double-step, en passant, promotion, stalemate, the 50-move rule — stay the same as regular chess.

## Solution status

Chess960 is **not solved**. Each of 960 starting positions is its own opening
problem and engines play the game very strongly.

## Consensus on optimal play

- **Standard chess strategy still applies after the opening** — piece activity, king safety, pawn structure, and endgame technique all work the same way. Chess960 only randomizes the opening, not the underlying strategy.
- **Develop toward the center quickly** — without memorized opening theory to rely on, moving center pawns and getting your pieces to active squares is even more important. Passive play is punished more easily.
- **Know your castling rules before moving king or rook** — Chess960 castling can be confusing (for example, a rook that started on g1 still ends up on f1 after castling). Check which pieces must stay in place before you commit to moves that might lose castling rights.
- **Use engine analysis for your specific starting position** — chess engines handle Chess960 natively. Analyzing your particular starting position beforehand can guide your opening moves.
- **Some starting positions are more balanced than others** — most of the 960 positions are roughly equal, but a few give one side a structural advantage. Knowing which type you have helps you decide how risky to play.

## Engines & current best play

- **Strongest known program(s):** Stockfish ([https://stockfishchess.org/](https://stockfishchess.org/) ([archive](http://web.archive.org/web/20260512103017/https://stockfishchess.org/))) and Leela Chess Zero ([https://lczero.org/](https://lczero.org/) ([archive](http://web.archive.org/web/20260501191219/https://lczero.org/))) — both natively support Chess960; Lichess offers Chess960 play at [https://lichess.org/variant/chess960](https://lichess.org/variant/chess960) ([archive](http://web.archive.org/web/20260429091725/https://lichess.org/variant/chess960)).
- **Strength:** Super-human (same engines as for orthodox chess).
- **Where the proof / tablebase lives (if solved):** — (unsolved; no full tablebase; standard chess endgame tablebases apply for late-game positions)
- **Notes:** Chess960's main purpose is to eliminate opening preparation advantages; in practice, professional events (Chess960 World Championship) use it and top players treat it as equivalent in depth to classical chess from move 10 onward.

## Complexity

Similar to chess.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Chess960) ([archive](http://web.archive.org/web/20260501000739/https://en.wikipedia.org/wiki/Chess960))
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)

## See also

- [Chess](chess.md) · [Capablanca chess](capablanca-chess.md) · [Courier chess](courier-chess.md)
- Lexicon: [partisan game](../lexicon/README.md#partisan-game)
