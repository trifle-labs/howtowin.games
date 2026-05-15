# Shatranj

> The medieval ancestor of modern chess — slower pieces, but still unsolved.

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

## Description

Played on an 8×8 board. Shatranj is the form of chess that spread through the
medieval Islamic world. Its key differences from modern chess: the Ferz (Queen)
moves only one square diagonally; the Alfil (Bishop) jumps exactly two squares
diagonally; there is no initial two-square pawn move, no castling, and pawns
promote only to Ferz. Bare-king and stalemate rules differ from modern chess.

## Solution status

Shatranj is **unsolved**. Although its pieces are far weaker than modern
chess's — making mating material scarce and games long and manoeuvring — the
positional state-space and game-tree complexity are still on the order of
chess's, well beyond exhaustive search. Small-material endgames are computable
by [retrograde analysis](../lexicon/README.md#retrograde-analysis) (and medieval
masters in fact catalogued many such *mansubat*), but the full game has no
proven value, and it has attracted little modern solving effort.

## Consensus on optimal play

- **Pawn structure determines the endgame** — with weak pieces, pawn majorities that can promote to Ferz are the primary winning mechanism; protect passed pawns aggressively.
- **The Alfil jump creates permanent colour blindness** — the Alfil only reaches half the board (same colour squares only, skipping ranks); it cannot protect its own pawns on the opposite colour and cannot defend a bare king against a Ferz on the wrong colour.
- **Bare king rule changes material evaluation** — exposing the opponent's king (removing all their pieces) wins even without checkmate; this makes large material exchanges more dangerous than in modern chess.
- **Stalemate convention varies** — in many historical Shatranj rules stalemate is a win for the side achieving it; if using this rule, be more aggressive about confining the opponent's king.
- **The Ferz's limited range makes king safety less urgent** — a single-step queen cannot deliver quick mating threats; plan for long endgame manoeuvres rather than sharp tactical attacks.

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
