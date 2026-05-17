# Courier chess

> Medieval 12×8 chess variant — historically extinct, unsolved.

| Field | Value |
|-------|-------|
| Also known as | Kurierspiel, Courier-Spiel |
| Players | 2 |
| Type | Partisan chess variant |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Unsolved |
| **Game-theoretic value** | Unknown |
| Year solved | — |
| Solved by | — |
| State-space complexity | Larger than chess (12×8 board) |
| Game-tree complexity | Larger than chess |
| **Playable** | courier-chess |

## Description

Courier chess (medieval Germany, ~1200 CE; documented in Selenus 1616) is a
12×8 board variant that introduces extra pieces — most famously the
**Courier** (a long-range bishop) — and is considered a precursor of modern
chess. It vanished from play by the 19th century.

## Rules

1. Board: 12 files × 8 ranks. Each side has 24 pieces — the usual chess
   pieces plus two Couriers, a Sage (man/king-mover that can be captured), a
   Schleich (a 1-step piece) and additional pawns.
2. The **Courier** moves as a modern bishop (long diagonal).
3. The medieval pieces — Ferz, Alfil and Mann — retain their pre-modern moves
   (one step diagonally, two-step diagonal jump and one step in any direction
   respectively). **[verify]** exact starting placement and minor-piece rules.
4. Win condition: checkmate the king. Pawn promotion rules follow the
   medieval convention (promotion to Ferz on the 8th rank).

## Solution status

Courier chess is **not solved**. As an extinct game its engine analysis is
rudimentary.

## Consensus on optimal play

- **Activate the Couriers early** — the Courier (long-range bishop) is the most powerful piece in the game; an open long diagonal lets it dominate the wide 12-file board in a way the medieval Ferz or Alfil cannot match.
- **Modern bishops from chess analogy apply to the Courier** — standard chess principles for bishops (open diagonals, outposts, bishop pairs) carry over directly to the Couriers; fighting for both open diagonal colours early is a strong positional goal.
- **Be patient with the slow medieval pieces** — the Ferz (one-step diagonal), Alfil (two-step diagonal jump), and Mann (one-step any direction) have very limited range; use them for defensive duties and pawn support rather than long-range attack.
- **The wide board rewards piece coordination over tactics** — on a 12×8 board, pieces are often too far apart for quick tactical combinations; manoeuvring to improve piece placement and controlling key diagonals/files is more reliable than seeking immediate tactical wins.
- **Pawn promotion is to Ferz, not queen** — unlike modern chess, promoting a pawn yields a weak Ferz (one diagonal step) rather than a queen; pawn majorities are less decisive than in modern chess, so piece play dominates the endgame more than pawn races.

## Engines & current best play

- **Strongest known program(s):** Fairy-Stockfish ([https://github.com/ianfab/Fairy-Stockfish](https://github.com/ianfab/Fairy-Stockfish) ([archive](http://web.archive.org/web/20230224150112/https://github.com/ianfab/Fairy-Stockfish))) — supports historical and fairy chess variants including medieval piece types.
- **Strength:** Weak to moderate; Courier chess is rarely played and engine evaluation is not tuned for it.
- **Where the proof / tablebase lives (if solved):** — (unsolved; historical interest only)
- **Notes:** Courier chess is primarily of historical significance as a precursor to modern chess; active competitive play is essentially non-existent, making engine tuning and formal analysis very limited.

## Complexity

Larger than chess.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Courier_chess) ([archive](http://web.archive.org/web/20260106104507/https://en.wikipedia.org/wiki/Courier_chess))
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)

## See also

- [Chess](chess.md) · [Capablanca chess](capablanca-chess.md) · [Shatranj](shatranj.md)
- Lexicon: [partisan game](../lexicon/README.md#partisan-game)
