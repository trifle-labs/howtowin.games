# Treblecross

> A one-row game where both players mark X's and the first to make three in a row wins. It is fully solved.

| Field | Value |
|-------|-------|
| Also known as | Octal game 0.007 |
| Players | 2 |
| Type | Impartial combinatorial game (octal game 0.007) |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Strongly solved |
| **Game-theoretic value** | Depends on strip length; determined by nim-values |
| Year solved | 1956 |
| Solved by | Richard K. Guy & Cedric A. B. Smith |
| State-space complexity | Polynomial in strip length |
| Game-tree complexity | Polynomial in strip length |
| **Playable** | treblecross |

## Description

Played on a single row of cells. Both players mark cells with the same symbol (an X). A player who completes three X's in a row wins immediately. Because both players use the same symbol, the game is impartial — the available moves depend only on the position, not on whose turn it is.

## Solution status

Treblecross is **strongly solved**. Reformulated as a take-and-break game it is
the octal game **0.007**, and [Guy & Smith (1956)](../references.md#guy-smith1956)
showed its [nim-value](../lexicon/README.md#nim-value) sequence is eventually
periodic. Hence the winner of a strip of any length, and the winning move, is
known. Positions composed of several independent segments resolve by
[nim-sum](../lexicon/README.md#nim-sum).

It is a tidy example of how a "make three in a row" game — which sounds like a
[k-in-a-row](gomoku.md) Maker game — collapses to standard impartial theory once
both players use the same symbol.

## Consensus on optimal play

- **Learn the winning and losing segment sizes** — for each separate segment of empty cells, know whether it is a winning or losing position for the player whose turn it is. This has been completely calculated and follows a repeating pattern.
- **Never complete three in a row for the opponent** — finishing three in a row wins the game, so you must never place a mark that gives the opponent a winning three-in-a-row on their next turn.
- **Leave losing segments for the opponent** — a segment of a certain length is a losing position for the player to move. Whenever possible, give the opponent a position where they can only play in a losing segment.
- **When the row is split, add up the values of all segments** — when the row has been broken into several independent segments, the game is decided by combining the values of all segments using a special math operation (binary XOR, also called nim-sum). If the result is non-zero, you can win. If it is zero, you are losing.
- **Small segments are tricky** — on very short segments (1, 2, or 4 cells), any mark risks giving the opponent a win. The correct response is often to play in the way that gives the opponent the fewest threats.

## Engines & current best play

- **Strongest known program(s):** No game-specific public engine; any implementation of the Guy–Smith nim-value table plays perfectly.
- **Strength:** Perfectly solved via the periodic nim-value sequence.
- **Where the proof / tablebase lives (if solved):** Guy & Smith (1956) ([../references.md#guy-smith1956](../references.md#guy-smith1956)); see also *Winning Ways* ([../references.md#bcg2001](../references.md#bcg2001)).
- **Notes:** Treblecross is the standard example of how a "make three-in-a-row" game becomes a tractable impartial game once both players use the same symbol.

## Complexity

Per-position analysis is linear in the number of independent segments once the
periodic table is known.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Treblecross)
- [Guy, R. K. & Smith, C. A. B. (1956). *The G-values of various games*.](../references.md#guy-smith1956)
- [Berlekamp, Conway & Guy (2001). *Winning Ways for Your Mathematical Plays*.](../references.md#bcg2001)

## See also

- [Kayles](kayles.md) · [Dawson's chess](dawsons-chess.md) · [Notakto](notakto.md) · [Gomoku](gomoku.md)
- Lexicon: [octal game](../lexicon/README.md#octal-game) · [impartial game](../lexicon/README.md#impartial-game)
