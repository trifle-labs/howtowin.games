# Capablanca chess

> A chess variant played on a 10×8 board with two new pieces: the archbishop and the chancellor. Unsolved.

| Field | Value |
|-------|-------|
| Also known as | Capablanca chess, Capablanca's chess |
| Players | 2 |
| Type | Partisan chess variant |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Unsolved |
| **Game-theoretic value** | Unknown |
| Year solved | — |
| Solved by | — |
| State-space complexity | Much larger than chess (10×8 board, more pieces) |
| Game-tree complexity | Much larger than chess |
| **Playable** | capablanca-chess |

## Description

Capablanca chess was invented by world chess champion Jose Raul Capablanca
around 1925. It is played on a 10×8 board with two new pieces added to the
normal chess pieces: the **archbishop** (moves like a bishop or a knight) and
the **chancellor** (moves like a rook or a knight). Capablanca suggested this
variant to reduce the number of draws he thought were too common in standard
chess.

## Rules

1. Board: 10 columns by 8 rows. Each side has the usual chess pieces plus one archbishop and one chancellor, placed in the back row between the minor pieces (bishops/knights) and rooks (exact placement varies by version).
2. **Archbishop**: can move like either a bishop or a knight.
3. **Chancellor**: can move like either a rook or a knight.
4. All other pieces move as in regular chess. Pawns promote when reaching the 8th row.
5. Castling rules are adjusted for the wider board. The standard check, checkmate, and draw rules apply.

## Solution status

Capablanca chess is **not solved**. The board and piece set make engine
analysis significantly more expensive than chess.

## Consensus on optimal play

- **Know the piece values** — the chancellor is worth about as much as a rook and knight combined (roughly 8.5 pawns), the archbishop about as much as a bishop and knight (roughly 7 pawns). Both are stronger than a queen. Avoid trading either for a queen without good reason.
- **Get your chancellor onto open columns right away** — the chancellor's rook-like powers are strongest on open columns (files with no pawns). Getting it active early is a top priority, just like a rook in regular chess.
- **The archbishop is great at fork attacks** — it can threaten squares a queen cannot reach. Watch for archbishop forks that attack the king and rook (or two other pieces) at the same time, since its knight movement adds surprise attacks to the bishop's long-range diagonals.
- **Pawn structure rules from chess still apply** — doubled pawns, isolated pawns, and open-file weaknesses all work the same way. The extra columns just give more room for these structures to form.
- **Opening theory is less developed** — there are no grandmaster-level books to follow. Develop your powerful new pieces quickly toward the center and make sure your king is safe (castling works on the wider board).
- **Watch for chancellor threats on the back row** — a chancellor on the 7th or 8th row is even more dangerous than a queen because of its knight-like leap. The back-rank checkmate patterns from regular chess apply but with greater range.

## Engines & current best play

- **Strongest known program(s):** Fairy-Stockfish ([https://github.com/ianfab/Fairy-Stockfish](https://github.com/ianfab/Fairy-Stockfish) ([archive](http://web.archive.org/web/20230224150112/https://github.com/ianfab/Fairy-Stockfish))) — Stockfish adapted for fairy chess variants including Capablanca chess.
- **Strength:** Super-human (inherits Stockfish's deep search with fairy-piece extensions).
- **Where the proof / tablebase lives (if solved):** — (unsolved; no endgame tablebase covering the full piece set)
- **Notes:** Fairy-Stockfish is the standard analysis tool for Capablanca chess; no competitive human scene large enough to produce extensive opening theory exists, so engine analysis defines current best play.

## Complexity

Larger than chess.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Capablanca_chess) ([archive](http://web.archive.org/web/20260510041243/https://en.wikipedia.org/wiki/Capablanca_Chess))
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)

## See also

- [Chess](chess.md) · [Courier chess](courier-chess.md) · [Chess960](chess960.md) · [Glinski hexagonal chess](glinski-hexagonal-chess.md)
- Lexicon: [partisan game](../lexicon/README.md#partisan-game)
