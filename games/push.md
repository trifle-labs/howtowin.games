# Push

> A small one-dimensional partisan game from *Winning Ways* — a teaching
> example for "switches" and game arithmetic.

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

## Description

Push is a partisan one-row game in the same spirit as [Toads and Frogs](toads-and-frogs.md)
and [Shove](shove.md): pieces of two colours slide along a track, with each
player controlling pieces of one colour. Its compact rules produce a rich
catalogue of CGT values.

## Rules

1. A row of squares, with some squares occupied by blue or red checkers.
2. **Left** (blue) moves: slide a blue piece **one square right**, pushing any
   contiguous run of pieces ahead of it (including red pieces) over by one;
   the rightmost piece of any such run that would fall off the end is removed.
3. **Right** (red) moves: mirror-image — slide a red piece **one square left**
   under the same pushing rule.
4. The player unable to move loses (normal play).

## Solution status

Strongly solved as a theory in [*Winning Ways*](../references.md#bcg2001): each
Push position has an explicit surreal-number / switch value, computed by
recursively evaluating Left's and Right's best moves. Sums of independent Push
positions add by ordinary CGT arithmetic.

## Consensus on optimal play

- **Compute the CGT value of each component** — each independent stretch of the row has a well-defined surreal-number or switch value; calculate it by evaluating Left's and Right's best moves recursively.
- **Combine components by CGT addition** — a sum of independent Push positions has value equal to the sum of their individual values; play in the component with the most temperature (hottest game first).
- **Push to eliminate rather than to advance** — using the push-and-remove rule to remove an opponent's piece is usually worth more than gaining a square, since it permanently reduces their move count.
- **Exploit switches** — a position with value {a | b} is a "switch"; the player who moves there gains temperature (a − b)/2; left should move in positive-value switches, right in negative-value ones.
- **Pass to your opponent when the sum is fuzzy** — in a sum of hot games, forcing the opponent to move when all remaining games are positive for them is sometimes the correct "Nim-like" endgame strategy.

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
