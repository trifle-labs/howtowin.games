# Dawson's chess

> A chess-derived impartial game that reduces to the octal game 0.137 and is
> fully solved by a periodic nim-value sequence.

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

Dawson's chess was posed by T. R. Dawson (1935) as a chess problem: pawns of
opposite colours face off on a 3×*n* board, captures are *compulsory*, and —
analysed under the [misère](../lexicon/README.md#misère-play) convention as
Dawson intended — it asks who is forced to make the last capture. The position
abstracts to a take-and-break game on a row, and under
[normal play](../lexicon/README.md#normal-play-convention) it is the octal game
**0.137** (remove a run of three, or related moves, splitting the row).

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

- **Look up the nim-value from the period-34 table** — for normal play, the nim-value (Grundy value) of a single row of length *n* follows a period-34 pattern (after a short non-periodic prefix); the table is the complete strategy — no other reasoning is needed.
- **Combine multi-component positions with nim-sum** — if the position has multiple independent rows/components, compute each component's nim-value separately, then XOR (nim-sum) them; a position with nim-sum 0 is a second-player win, any non-zero nim-sum is a first-player win.
- **To win from a non-zero nim-sum position, move to make the nim-sum 0** — find the component whose nim-value, when replaced by a reachable nim-value, makes the total nim-sum zero; that is your optimal move.
- **For misère play, apply misère-quotient theory** — the normal-play strategy almost always works for misère too, with the exception: when all components have nim-value 0 or 1, invert the normal-play winning condition (move to leave an *odd* number of 1s instead of an even number).
- **Period-34 means the game is essentially mechanical** — after looking up the table, optimal play requires no insight beyond nim-sum arithmetic; the game has no room for creative play.

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
