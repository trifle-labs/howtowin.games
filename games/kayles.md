# Kayles

> The archetypal octal game: knock down one pin, or two adjacent pins, from a
> row.

| Field | Value |
|-------|-------|
| Also known as | Kayles (from an old word for ninepins) |
| Players | 2 |
| Type | Impartial combinatorial game (octal game 0.77) |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Strongly solved |
| **Game-theoretic value** | Depends on the row(s); determined by nim-values |
| Year solved | 1956 |
| Solved by | Richard K. Guy & Cedric A. B. Smith |
| State-space complexity | Polynomial in the number of pins |
| Game-tree complexity | Polynomial in the number of pins |

## Description

A row of pins. On a turn a player removes either a single pin or two *adjacent*
pins, which may split the row into two independent shorter rows. Under
[normal play](../lexicon/README.md#normal-play-convention) the player removing
the last pin wins.

## Solution status

Kayles is **strongly solved**. [Guy & Smith (1956)](../references.md#guy-smith1956)
showed that the [nim-value](../lexicon/README.md#nim-value) sequence of a single
row of *n* pins is **eventually periodic** — periodic with period 12 for all
*n* ≥ 71, with only finitely many exceptional values before that. Because a
position with several rows decomposes into a [nim-sum](../lexicon/README.md#nim-sum)
of independent rows (by the [Sprague–Grundy theorem](../lexicon/README.md#sprague-grundy-theorem)),
the entire game is solved: any position's value, and an optimal move, is
computable instantly from the periodic table.

Kayles is the historically important first example showing octal-game nim-value
sequences can be proven periodic — a property that is *known* for many octal
games and *conjectured but unproven* for others (see
[Grundy's game](grundys-game.md)).

## Consensus on optimal play

- **Look up the nim-value from the period-12 table** — for any single row of n pins, the nim-value is given by the precomputed periodic table (period 12 for n ≥ 71); this is a one-step table lookup.
- **Nim-sum all row values to get the position value** — with multiple rows, XOR their nim-values; if the nim-sum is non-zero you are in a winning position and can find the correct move.
- **Winning move: reduce nim-sum to zero** — find a move in one of the rows that changes its nim-value so the new XOR of all rows equals 0; this is always possible from a non-zero (winning) position.
- **Removing two adjacent pins splits the row** — removing two adjacent pins from the interior of a row of n creates two independent rows of sizes k and (n−k−2); calculate both halves' nim-values and choose the split that zeroes the nim-sum.
- **Rows of size 0 (empty) are zero** — rows that have been completely removed contribute 0 to the nim-sum and can be ignored; focus on rows with non-zero nim-values.

## Engines & current best play

- **Strongest known program(s):** Any CGT toolkit implementing the period-12 table and nim-sum (e.g., CGSuite by Aaron Siegel) solves any Kayles position instantly.
- **Strength:** Perfectly and efficiently solvable; O(number of rows) per-move computation.
- **Where the proof / tablebase lives (if solved):** [Guy & Smith (1956)](../references.md#guy-smith1956); [Berlekamp, Conway & Guy (2001)](../references.md#bcg2001).
- **Notes:** Historically the first octal game proven to have an eventually-periodic nim-value sequence; contrasts with Grundy's game whose periodicity remains unproven.

## Complexity

The period-12 table makes per-position analysis O(number of rows).

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Kayles) ([archive](http://web.archive.org/web/20251201221417/https://en.wikipedia.org/wiki/Kayles))
- [Guy, R. K. & Smith, C. A. B. (1956). *The G-values of various games*.](../references.md#guy-smith1956)
- [Berlekamp, Conway & Guy (2001). *Winning Ways for Your Mathematical Plays*.](../references.md#bcg2001)

## See also

- [Dawson's chess](dawsons-chess.md) · [Treblecross](treblecross.md) · [Nim](nim.md) · [Grundy's game](grundys-game.md)
- Lexicon: [octal game](../lexicon/README.md#octal-game) · [nim-value](../lexicon/README.md#nim-value)
