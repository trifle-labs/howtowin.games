# Dawson's chess

> A chess-like game that reduces to a math puzzle (octal game 0.137). Fully solved by a repeating number pattern.

| Field | Value |
|-------|-------|
| Also known as | Octal game 0.137; closely related to Dawson's Kayles (0.07) |
| Players | 2 |
| Type | Impartial combinatorial game (octal game) |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Strongly solved |
| **Game-theoretic value** | Depends on the row; determined by nim-values |
| Year solved | 1956 |
| Solved by | Richard K. Guy & Cedric A. B. Smith |
| State-space complexity | Polynomial in row length |
| Game-tree complexity | Polynomial in row length |
| **Playable** | dawsons-chess |

## Description

Dawson's chess was proposed by T. R. Dawson in 1935 as a chess problem. Pawns of
opposite colors face each other on a 3×*n* board, captures are **required**
(you must capture if you can), and the question is which player is forced to
make the last capture. The position can be simplified to a take-and-break game
on a single row, and under normal play rules it is known as the octal game
**0.137** (where you remove a group of three pawns, or related moves, possibly
splitting the row into smaller groups).

## Solution status

Dawson's chess is **strongly solved**. [Guy & Smith (1956)](../references.md#guy-smith1956)
computed its [nim-values](../lexicon/README.md#nim-value) and proved the
single-row sequence is **eventually periodic with period 34** (with finitely
many exceptions). Multi-component positions then resolve by
[nim-sum](../lexicon/README.md#nim-sum), so every position has a known value and
optimal move.

Historically Dawson intended the *misère* version; the misère analysis is
substantially more delicate, but the normal-play octal game is the clean,
fully-solved object usually meant by "Dawson's chess" in CGT.

## Consensus on optimal play

- **Look up the value from the repeating table** — for normal play, the nim-value (a number that tells you who wins) of a single row of length *n* follows a pattern that repeats every 34 steps (after a short uneven start). The table is the complete strategy.
- **Combine multiple rows with XOR (nim-sum)** — if the position has several separate rows, find each row's nim-value separately, then XOR (a math operation) all of them together. A total of 0 means the second player wins. Any other number means the first player wins.
- **To win from a winning position, make the XOR total 0** — find a row whose nim-value you can change (by making a legal move) so that the new XOR total becomes 0. That is your best move.
- **For misere play (last move loses), use a slightly different rule** — the normal strategy usually works, except when all rows have nim-value 0 or 1. In that special case, flip the condition: move to leave an odd number of 1s instead of an even number.
- **The game is essentially a math problem** — once you have the table, playing perfectly is just doing simple math. There is no room for creativity.

## Engines & current best play

- **Strongest known program(s):** Any program that implements the period-34 nim-value table and nim-sum calculation plays perfectly. No game-specific competitive engine needed.
- **Strength:** Perfect — the nim-value table and nim-sum give the exact optimal move in constant time per component.
- **Where the proof / tablebase lives (if solved):** [Guy & Smith (1956)](../references.md#guy-smith1956); see also [Berlekamp, Conway & Guy (2001)](../references.md#bcg2001).
- **Notes:** Dawson's chess is a canonical example of an octal game solved by eventual periodicity of Grundy values; it illustrates how CGT reduces a combinatorial game to pure arithmetic.

## Complexity

Period-34 nim-value table; per-position analysis is linear in the number of
components.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Dawson%27s_chess) ([archive](http://web.archive.org/web/20251016032223/https://en.wikipedia.org/wiki/Dawson%27s_chess))
- [Guy, R. K. & Smith, C. A. B. (1956). *The G-values of various games*.](../references.md#guy-smith1956)
- [Berlekamp, Conway & Guy (2001). *Winning Ways for Your Mathematical Plays*.](../references.md#bcg2001)

## See also

- [Kayles](kayles.md) · [Treblecross](treblecross.md) · [Mock Turtles](mock-turtles.md) · [Grundy's game](grundys-game.md)
- Lexicon: [octal game](../lexicon/README.md#octal-game) · [misère play](../lexicon/README.md#misère-play)
