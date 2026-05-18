# Shove

> The destructive cousin of Push — sliding a piece pushes the leading piece off the board.

| Field | Value |
|-------|-------|
| Also known as | Shove |
| Players | 2 |
| Type | Partisan combinatorial game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Strongly solved as a theory |
| **Game-theoretic value** | Position-dependent (switches and integers) |
| Year solved | 1982 |
| Solved by | Berlekamp, Conway, Guy |
| State-space complexity | Small per position |
| Game-tree complexity | Small |
| **Playable** | shove |

## Description

A close relative of [Push](push.md). Pieces slide on a row of squares, but **the piece at the front is pushed off the board** every time a group is shoved. This makes Shove faster and creates bigger swings in value.

## Rules

1. A row of squares, some filled with blue or red checkers.
2. **Left** (blue) moves: slide a blue piece **one square to the right**, pushing any line of pieces ahead of it. Whatever is at the far right end of that line is pushed off the board for good.
3. **Right** (red) moves: the mirror image — slide a red piece **one square to the left**.
4. The player who cannot move loses (normal play).

## Solution status

Strongly solved as a theory in [*Winning Ways*](../references.md#bcg2001): each
Shove position has an explicit CGT value, computed recursively. Sums of
positions add by ordinary CGT arithmetic.

## Consensus on optimal play

- **Compute the CGT value recursively** — evaluate each position by considering what each player gains from their best move; the value is a surreal number or switch, computed bottom-up from terminal positions.
- **Shove eliminates material permanently** — unlike Push (which merely moves pieces), every shove destroys the leading piece; this makes Shove positions hotter (more valuable to move in) on average.
- **Hot games first in a sum** — in a sum of Shove positions, play in the component with the highest temperature; leaving a very hot game for the opponent to exploit is the most common error.
- **Switches require careful timing** — a Shove position with value {a | b} where a ≠ b is a switch; take it when the temperature exceeds the rest of the sum.
- **Lookup short rows, recurse for longer ones** — positions up to ~5 pieces have known CGT values; for longer rows, apply the recursive definition from *Winning Ways*.

## Engines & current best play

- **Strongest known program(s):** No competitive engine; CGT computation tools (e.g. Aaron Siegel's CGSuite) compute positions analytically.
- **Strength:** Exact optimal play via CGT formula.
- **Where the proof / tablebase lives (if solved):** [Berlekamp, Conway & Guy (2001)](../references.md#bcg2001); [Conway (1976)](../references.md#conway1976)
- **Notes:** Shove is a theoretical CGT exercise, not a competitive game; CGSuite can compute values for any specific row.

## Complexity

Small per position.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Shove_(game))
- [Berlekamp, Conway & Guy (2001–2004). *Winning Ways for Your Mathematical Plays*.](../references.md#bcg2001)
- [Conway (1976). *On Numbers and Games*.](../references.md#conway1976)

## See also

- [Push](push.md) · [Toads and Frogs](toads-and-frogs.md) · [Domineering](domineering.md)
- Lexicon: [partisan game](../lexicon/README.md#partisan-game) · [surreal number](../lexicon/README.md#surreal-number)
