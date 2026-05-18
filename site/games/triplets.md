# Triplets

> A three-pile game where players remove 1, 2, or 3 tokens from a pile. It is fully solved.

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

Triplets is played with three piles of tokens. On each turn, a player chooses one pile and removes 1, 2, or 3 tokens from it. The player who cannot move loses.

## Rules

1. Three piles of tokens.
2. A move chooses one pile and removes 1, 2, or 3 tokens from it.
3. The player who cannot move loses.

## Solution status

Strongly solved by [Guy & Smith (1956)](../references.md#guy-smith1956): the
single-heap nim-values follow a short period-3 cycle, and the multi-heap
position is decided by the [nim-sum](../lexicon/README.md#nim-sum) of pile
nim-values.

## Consensus on optimal play

- **Each pile has a value based on its size** — each pile's value follows a simple three-step repeating pattern based on its size. Piles with size divisible by 3 have value 0. Piles where size divided by 3 leaves remainder 1 have value 1. Piles where size divided by 3 leaves remainder 2 have value 2.
- **Add up the pile values using nim-sum** — combine the three pile values using the nim-sum (binary XOR) method. If the result is not zero, you are in a winning position and a winning move exists.
- **Make the total nim-sum zero** — find a pile whose value you can change to make the total nim-sum become zero. This is always possible from a winning position.
- **Never leave a nim-sum of zero for the opponent** — giving the opponent a position with a total nim-sum of zero gives them a winning position. Always check before you move.
- **A pile of size divisible by 3 is irrelevant** — such a pile has value 0 and contributes nothing to the nim-sum. You can ignore it when looking for the winning move in the other piles.

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
