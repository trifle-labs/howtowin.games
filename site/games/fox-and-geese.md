# Fox and Geese

> A classic asymmetric hunt game on a cross-shaped board — solved in the
> combinatorial-game-theory literature as a win for the geese with correct play.

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

Played on a cross-shaped (plus-shaped) subset of a checkers board. One player
controls a single **fox**, the other controls a group of **geese** (commonly 13,
though counts vary by tradition). The fox moves like a checkers king and may, in
some rule sets, capture geese by jumping; the geese move forward/sideways only
and never capture. The geese win by hemming the fox in so it cannot move; the
fox wins by breaking through the goose formation (or reducing the geese below a
threshold where they can no longer trap it).

## Solution status

Fox and Geese is **weakly solved**. The game and its optimal strategy are
analysed in [*Winning Ways*](../references.md#bcg2001): with correct play the
**geese win** — they can advance in a solid phalanx that never offers the fox a
gap, eventually walling it into a corner. The result is sensitive to the exact
rule set and number of geese; the headline "geese win" applies to the standard
13-geese, no-goose-capture version analysed in the CGT literature. Because the
state space is tiny, the game is also trivially solvable by exhaustive search.

## Consensus on optimal play

- **Maintain an unbroken front** — the geese must advance as a solid, gapless line; any hole lets the fox slip through and the game is lost.
- **Never retreat a goose** — geese can only move forward or sideways, so a goose committed to the wrong square can create permanent weaknesses; plan each step.
- **Advance the centre geese first** — building a convex front that pushes the fox toward the corners before compressing it minimises the chance of a flank break.
- **Fox: probe the flanks** — the fox's only winning chance is an edge or corner escape; head for the sides and look for the slightest gap in the formation.
- **Fox: force pace changes** — threatening a rush can bait geese into out-of-sync moves; the fox should use the entire board to disrupt the rhythm of the advancing wall.
- **Endgame: geese aim to corner, not just stop** — hemming the fox against a wall without a second row of geese behind can allow a diagonal escape; the trap needs depth.

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
