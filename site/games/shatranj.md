# Shatranj

> The medieval ancestor of modern chess with weaker pieces. Still unsolved.

| Field | Value |
|-------|-------|
| Also known as | Medieval chess; descended from chaturanga |
| Players | 2 |
| Type | Partisan board game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Unsolved (small-piece endgames computable) |
| **Game-theoretic value** | Unknown |
| Year solved | — |
| Solved by | — |
| State-space complexity | Comparable to chess (~10^40 order) |
| Game-tree complexity | Comparable to chess |
| **Playable** | shatranj |

## Description

Played on an 8x8 board. Shatranj is the version of chess that spread through the medieval Islamic world. The main differences from modern chess are: the Ferz (like a queen) only moves one square diagonally; the Alfil (like a bishop) jumps exactly two squares diagonally; there is no two-square pawn move at the start, no castling, and pawns can only promote to Ferz. The rules for bare king (king alone) and stalemate are also different from modern chess.

## Solution status

Shatranj is **unsolved**. Although its pieces are far weaker than modern
chess's — making mating material scarce and games long and manoeuvring — the
positional state-space and game-tree complexity are still on the order of
chess's, well beyond exhaustive search. Small-material endgames are computable
by [retrograde analysis](../lexicon/README.md#retrograde-analysis) (and medieval
masters in fact catalogued many such *mansubat*), but the full game has no
proven value, and it has attracted little modern solving effort.

## Consensus on optimal play

- **Pawn structure decides the endgame** — with weak pieces, getting an extra pawn that can promote to Ferz is the main way to win. Protect your pawns that are past the opponent's.
- **The Alfil only reaches half the board** — the Alfil only lands on same-colour squares and skips ranks. It cannot protect its own pawns on the opposite colour and cannot defend a bare king against a Ferz on the wrong colour.
- **Bare king changes how you think about pieces** — if you remove all of the opponent's pieces, you win even without checkmate. This makes big piece trades more dangerous than in modern chess.
- **Stalemate rules vary** — in many old Shatranj rules, stalemate is a win for the player who causes it. If using this rule, be more aggressive about boxing in the opponent's king.
- **The Ferz is slow — king safety matters less** — a queen that only moves one square diagonally cannot deliver quick checkmates. Plan for long endgame fights rather than sharp attacks.

## Engines & current best play

- **Strongest known program(s):** Fairy-Stockfish — a fairy/variant chess engine that supports Shatranj piece rules ([https://github.com/ianfab/Fairy-Stockfish](https://github.com/ianfab/Fairy-Stockfish) ([archive](http://web.archive.org/web/20230224150112/https://github.com/ianfab/Fairy-Stockfish))).
- **Strength:** Strong; likely super-human but not independently benchmarked against top human Shatranj players.
- **Where the proof / tablebase lives (if solved):** Not solved; small-piece endgame tablebases are theoretically computable.
- **Notes:** Modern Shatranj is played mainly by historical-games enthusiasts; Fairy-Stockfish provides the strongest available engine support.

## Complexity

Comparable to chess: state-space on the order of 10^40.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Shatranj)
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002) (general framework)

## See also

- [Chess](chess.md) · [Makruk](makruk.md) · [Xiangqi](xiangqi.md)
- Lexicon: [retrograde analysis](../lexicon/README.md#retrograde-analysis)
