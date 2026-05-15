# Treblecross

> A one-dimensional "three-in-a-row" game that is secretly an impartial octal
> game.

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

## Description

Played on a 1×*n* strip of cells. **Both** players mark cells with the same
symbol (an X). A player who completes three consecutive X's *wins immediately*.
Because the players share the marking symbol, the game is
[impartial](../lexicon/README.md#impartial-game): the moves available depend
only on the position, not on whose turn it is.

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

- **Consult the nim-value table** — the nim-value sequence for strip segments is eventually periodic (period 34); look up the nim-value for each independent segment, XOR them all, and move to make the total XOR equal to zero.
- **Never fill the third cell of three adjacent marked cells yourself** — completing three-in-a-row wins for you, so equally it means you must not place a mark that gives your opponent a winning three-in-a-row next turn.
- **Leave nim-value-zero segments for the opponent** — a segment of length n with nim-value 0 is a losing position for the player to move; whenever possible, transfer control so your opponent must act in a nim-zero segment.
- **Multiple segments combine by nim-sum** — when the strip has been split into several independent marked fragments, XOR the nim-values; a non-zero XOR means the player to move wins, and the winning move is the one that makes the XOR zero.
- **Small strips (n ≤ 4) are trivially losing for the mover** — on strips of length 1, 2, or 4 any mark risks completing or setting up three-in-a-row; the correct response often fills the position that minimises the opponent's threat.

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
