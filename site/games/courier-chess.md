# Courier chess

> A medieval chess variant on a 12×8 board. Extinct and unsolved.

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

Courier chess (from medieval Germany, around 1200 AD, recorded in a 1616 book)
is played on a 12×8 board with extra pieces — most notably the **Courier** (a
long-range bishop). It is considered an ancestor of modern chess. It was no
longer played after the 1800s.

## Rules

1. Board: 12 columns by 8 rows. Each side has 24 pieces — the usual chess pieces plus two Couriers, a Sage (moves like a king but can be captured), a Schleich (moves one step), and extra pawns.
2. The **Courier** moves like a modern bishop (any number of squares along a diagonal).
3. The medieval pieces — Ferz, Alfil, and Mann — keep their old moves: Ferz moves one step diagonally, Alfil jumps two steps diagonally, and Mann moves one step in any direction.
4. Win condition: checkmate the king. Pawn promotion follows medieval rules (a pawn becomes a Ferz when it reaches the 8th row).

## Solution status

Courier chess is **not solved**. As an extinct game its engine analysis is
rudimentary.

## Consensus on optimal play

- **Activate the Couriers early** — the Courier (long-range bishop) is the most powerful piece in the game. An open long diagonal lets it dominate the wide 12-column board in a way the slower medieval pieces cannot match.
- **Treat Couriers like modern bishops** — standard chess principles for bishops (open diagonals, outposts, using both bishops together) apply directly to Couriers. Fighting for both diagonal colors early is a strong positional goal.
- **Be patient with the slow medieval pieces** — the Ferz (one step diagonally), Alfil (two-step diagonal jump), and Mann (one step any direction) have very limited range. Use them for defense and pawn support rather than long-range attacks.
- **The wide board rewards piece coordination over quick tactics** — on a 12×8 board, pieces are often too far apart for fast attacks. Improving your piece positions and controlling key diagonals and columns is more reliable than looking for quick wins.
- **Pawns promote to Ferz, not queen** — unlike modern chess, promoting a pawn gives you a weak Ferz (one diagonal step) instead of a powerful queen. Pawn advances are less decisive than in modern chess, so piece play matters more in the endgame.

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
