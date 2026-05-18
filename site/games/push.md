# Push

> A small one-dimensional game from the book Winning Ways. A teaching example for how game values work.

| Field | Value |
|-------|-------|
| Also known as | Push |
| Players | 2 |
| Type | Partisan combinatorial game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Strongly solved as a theory |
| **Game-theoretic value** | Position-dependent (switches and integers) |
| Year solved | 1982 (treatment in *Winning Ways*) |
| Solved by | Berlekamp, Conway, Guy |
| State-space complexity | Small per position |
| Game-tree complexity | Small |
| **Playable** | push |

## Description

Push is a game played on a single row, similar to [Toads and Frogs](toads-and-frogs.md) and [Shove](shove.md). Pieces of two colours slide along a track, and each player controls pieces of their own colour. Its simple rules produce a surprising variety of game values.

## Rules

1. A row of squares, some filled with blue or red checkers.
2. **Left** (blue) moves: slide a blue piece **one square to the right**, pushing any pieces in a row ahead of it (including red pieces) one square over. If a piece would be pushed off the end, it is removed.
3. **Right** (red) moves: the mirror image — slide a red piece **one square to the left** under the same pushing rule.
4. The player who cannot move loses (normal play).

## Solution status

Strongly solved as a theory in [*Winning Ways*](../references.md#bcg2001): each
Push position has an explicit surreal-number / switch value, computed by
recursively evaluating Left's and Right's best moves. Sums of independent Push
positions add by ordinary CGT arithmetic.

## Consensus on optimal play

- **Figure out the value of each separate section** — each independent stretch of the row has a game value that you can calculate by looking at what moves Left and Right can make and what the results are worth.
- **Add the values of separate sections together** — if the row has multiple independent sections, the total value is the sum of their individual values. Play in the section with the biggest immediate effect first.
- **Push pieces off the board** — using the push-and-remove rule to make an opponent's piece fall off is usually better than just moving forward, because it permanently reduces the opponent's options.
- **Use switch positions** — some positions have a "switch" value where the first player to move there gets a big advantage. Play in switches that favour you.
- **Force the opponent to move when the overall position is close** — when several sections are still active, making the opponent move first in a position that looks good for them can sometimes backfire on them.

## Engines & current best play

- **Strongest known program(s):** No game-specific engine; CGT analysis by hand or with a computer algebra system suffices.
- **Strength:** Perfect play via the CGT formula for any given row configuration.
- **Where the proof / tablebase lives (if solved):** [Berlekamp, Conway & Guy (2001)](../references.md#bcg2001)
- **Notes:** Push is a pedagogical CGT example; it is not played competitively but is a standard reference for partisan game values.

## Complexity

Small per position; tractable to enumerate exhaustively for any reasonable row
length.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Push_(game))
- [Berlekamp, Conway & Guy (2001–2004). *Winning Ways for Your Mathematical Plays*.](../references.md#bcg2001)
- [Conway (1976). *On Numbers and Games*.](../references.md#conway1976)

## See also

- [Shove](shove.md) · [Toads and Frogs](toads-and-frogs.md) · [Domineering](domineering.md)
- Lexicon: [partisan game](../lexicon/README.md#partisan-game) · [surreal number](../lexicon/README.md#surreal-number)
