# Triplets

> An impartial three-pile subtraction game related to ternary nimbers — solved
> via Sprague–Grundy theory.

| Field | Value |
|-------|-------|
| Also known as | Triplets, "Ternary Nim" (loosely) |
| Players | 2 |
| Type | Impartial subtraction game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Strongly solved |
| **Game-theoretic value** | Determined by ternary-based nim-value formula |
| Year solved | 1956 |
| Solved by | Guy & Smith |
| State-space complexity | Three-pile |
| Game-tree complexity | Polynomial |
| **Playable** | triplets |

## Description

Triplets is one of the take-and-break games catalogued in the
Sprague–Grundy / octal-game literature. Its rules deliberately mix three heaps
to produce a nim-sequence with ternary structure.

## Rules

1. Three heaps of tokens.
2. A move chooses one heap and removes one, two, or three tokens (so this is
   the "Subtract {1,2,3}" rule), with the additional constraint inherent to
   "Triplets" that **all three heaps must be touched** by some move under the
   chosen rule code. (Different sources define Triplets slightly differently —
   the octal-game tables give the canonical version. **[verify]** the exact
   variant.)
3. The player who cannot move loses (normal play).

## Solution status

Strongly solved by [Guy & Smith (1956)](../references.md#guy-smith1956): the
single-heap nim-values follow a short period-3 cycle, and the multi-heap
position is decided by the [nim-sum](../lexicon/README.md#nim-sum) of pile
nim-values.

## Consensus on optimal play

- **Look up the nim-value for each pile** — the single-pile nim-values follow a period-3 cycle; determine the cycle phase for each pile's size with a simple modular computation, then read off the nim-value from the short table.
- **XOR the nim-values (nim-sum)** — combine the three piles' nim-values with bitwise XOR; if the result is non-zero you are in a winning position and a winning move exists.
- **Make the nim-sum zero** — find a pile whose nim-value you can reduce to bring the total XOR to zero; this is always possible from an N-position and gives the unique (or one of several) optimal moves.
- **Do not leave a nim-sum of zero** — handing the opponent a position with XOR = 0 is the only error; avoid it on every move.
- **In period-3 nim, a pile of size divisible by 3 has nim-value 0** — such a pile contributes nothing to the XOR and can be safely ignored when looking for the winning move in the other piles.

## Engines & current best play

- **Strongest known program(s):** No game-specific public engine; the strategy is a constant-time table lookup plus XOR.
- **Strength:** Perfectly solved by the Guy–Smith nim-value table.
- **Where the proof / tablebase lives (if solved):** Guy & Smith (1956) ([../references.md#guy-smith1956](../references.md#guy-smith1956)); *Winning Ways* ([../references.md#bcg2001](../references.md#bcg2001)).
- **Notes:** The exact rule variant of "Triplets" varies across sources; verify the octal-game code before applying these tables.

## Complexity

Trivial: O(1) per pile to look up the nim-value.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Combinatorial_game_theory) ([archive](http://web.archive.org/web/20260508023449/https://en.wikipedia.org/wiki/Combinatorial_game_theory))
- [Guy & Smith (1956). *The G-values of various games*.](../references.md#guy-smith1956)
- [Berlekamp, Conway & Guy (2001–2004). *Winning Ways for Your Mathematical Plays*.](../references.md#bcg2001)

## See also

- [Kayles](kayles.md) · [Dawson's chess](dawsons-chess.md) · [Nim](nim.md)
- Lexicon: [octal game](../lexicon/README.md#octal-game) · [Sprague–Grundy theorem](../lexicon/README.md#sprague-grundy-theorem)
