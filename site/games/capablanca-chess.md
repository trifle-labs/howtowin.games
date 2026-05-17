# Capablanca chess

> 10×8 chess variant with added "archbishop" and "chancellor" pieces — unsolved.

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

Capablanca chess (José Raúl Capablanca, ~1925) is played on a 10×8 board with
two new pieces in addition to the standard chess army: the **archbishop**
(bishop+knight) and the **chancellor** (rook+knight). Capablanca proposed it
as a way to reduce draws he found inevitable in orthodox chess.

## Rules

1. Board: 10 files × 8 ranks. Each side has the usual chess pieces plus one
   archbishop and one chancellor, placed in the back rank between minor pieces
   and rooks (specific placement varies).
2. **Archbishop**: moves either as a bishop or as a knight.
3. **Chancellor**: moves either as a rook or as a knight.
4. All other pieces move as in orthodox chess. Pawns promote on the 8th rank.
5. Castling is defined to span the wider board; standard check/checkmate and
   draw rules apply.

## Solution status

Capablanca chess is **not solved**. The board and piece set make engine
analysis significantly more expensive than chess.

## Consensus on optimal play

- **The chancellor is roughly rook+knight in value (~8.5 pawns), the archbishop bishop+knight (~7 pawns)** — knowing these rough values (stronger than a queen) prevents naive piece trades that give up massive material; avoid exchanging a chancellor or archbishop for a queen without compensation.
- **Control open files for your chancellor immediately** — the chancellor's rook component is dominant on open files; getting it active early (similar to a rook in orthodox chess) is a top priority.
- **The archbishop is a long-range fork machine** — it can threaten squares a queen cannot reach; be alert to archbishop forks that simultaneously attack king and rook (or two pieces), since the knight component adds non-linear attack patterns to the bishop's long diagonals.
- **Pawn structure principles from chess carry over** — doubled pawns, isolated pawns, and open-file weaknesses all function as in chess; the extra files (9th and 10th) simply provide more terrain for these structures to form.
- **Opening development is less codified** — there is no large body of grandmaster-level theory; developing the powerful compound pieces quickly toward the centre and ensuring king safety (castling is available on the wide board) are the reliable fundamentals.
- **Watch for back-rank threats from chancellors** — a chancellor on the 7th/8th rank is even more dangerous than a queen owing to its knight leap; the back-rank mate motifs from chess apply but with greater range.

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
