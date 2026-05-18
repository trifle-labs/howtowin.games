# Fox and Geese

> An uneven chase game on a cross-shaped board. The geese can always win if they play correctly.

| Field | Value |
|-------|-------|
| Also known as | Fox Game, Fox and Hounds (loosely) |
| Players | 2 (asymmetric: one fox vs. several geese) |
| Type | Partisan hunt game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Weakly solved |
| **Game-theoretic value** | Geese win with correct play |
| Year solved | — (analysed in *Winning Ways*, 1982) |
| Solved by | Berlekamp, Conway & Guy (and earlier analysts) |
| State-space complexity | Small |
| Game-tree complexity | Small |
| **Playable** | fox-and-geese |

## Description

Played on a cross-shaped (plus-shaped) board made from a checkers board. One player controls a single fox, and the other controls a group of geese (usually 13, though the number varies). The fox moves like a checkers king (any direction, any distance diagonally) and may be allowed to capture geese by jumping over them. The geese can only move forward or sideways and never capture. The geese win by trapping the fox so it cannot move. The fox wins by breaking through the geese formation (or by reducing the number of geese below what they need to trap it).

## Solution status

Fox and Geese is **weakly solved**. The game and its optimal strategy are
analysed in [*Winning Ways*](../references.md#bcg2001): with correct play the
**geese win** — they can advance in a solid phalanx that never offers the fox a
gap, eventually walling it into a corner. The result is sensitive to the exact
rule set and number of geese; the headline "geese win" applies to the standard
13-geese, no-goose-capture version analysed in the CGT literature. Because the
state space is tiny, the game is also trivially solvable by exhaustive search.

## Consensus on optimal play

- **Keep a solid, unbroken line** — the geese must advance as a single, gap-free wall. Any hole lets the fox slip through, and the game is lost.
- **Never move a goose backward** — geese can only move forward or sideways, so putting a goose in the wrong spot creates permanent weaknesses. Plan each step.
- **Advance the center geese first** — build a curved front that pushes the fox toward the corners before closing in. This minimizes the chance of the fox breaking out on the side.
- **Fox: test the edges** — the fox's only winning chance is an escape along the edge or into a corner. Head for the sides and look for the smallest gap in the geese formation.
- **Fox: change speed to cause mistakes** — threatening a fast rush can trick the geese into moving out of sync. Use the whole board to disrupt the rhythm of the advancing wall.
- **Endgame: don't just trap the fox, pin it in a corner** — stopping the fox against a wall without a second row of geese behind it can let the fox escape diagonally. The trap needs depth.

## Engines & current best play

- **Strongest known program(s):** No game-specific public engine known to the cataloguer. Playable in general-purpose abstract-game frameworks (e.g., [Ludii](https://ludii.games/)).
- **Strength:** Not benchmarked.
- **Where the proof / tablebase lives (if solved):** Analysed in *Winning Ways* (Berlekamp, Conway & Guy, 1982/2001); no separate online tablebase.
- **Notes:** The state space is small enough that exhaustive search is trivial; any competent tree-search implementation finds optimal play instantly.

## Complexity

The board has only 33 squares and one fox, so the state space is small and the
game is fully tractable to search; its interest is strategic and historical, not
computational.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Fox_games) ([archive](http://web.archive.org/web/20260311131615/https://en.wikipedia.org/wiki/Fox_games))
- [Berlekamp, Conway & Guy (2001–2004). *Winning Ways for Your Mathematical Plays*.](../references.md#bcg2001)
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)

## See also

- [Hare and Hounds](hare-and-hounds.md) · [Tablut](tablut.md) · [Brandubh](brandubh.md)
- Lexicon: [weakly solved](../lexicon/README.md#weakly-solved) · [partisan game](../lexicon/README.md#partisan-game)
