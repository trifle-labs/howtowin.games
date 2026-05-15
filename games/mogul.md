# Mogul

> An octal-game cousin of Mock Turtles — its nim-values are tabulated.

| Field | Value |
|-------|-------|
| Also known as | Mogul (.55... in octal-game notation) |
| Players | 2 |
| Type | Impartial turning game / octal game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Strongly solved |
| **Game-theoretic value** | Determined by nim-sum of single-coin nim-values |
| Year solved | 1956 |
| Solved by | Guy & Smith |
| State-space complexity | A row of n coins |
| Game-tree complexity | Polynomial |

## Description

A "turning-coins" game in the *Winning Ways* tradition: a row of coins is given,
each face-up or face-down, and players take turns flipping coins under
constraints chosen so the resulting nim-sequence is rich and irregular.

## Rules

1. A row of n coins, each "heads" or "tails," is laid out in positions
   1, 2, ..., n.
2. On your turn, choose one of the allowed flipping patterns from the octal
   code defining Mogul (turning 2 or 3 coins at chosen positions, subject to
   the rightmost flipped coin going from heads to tails). The exact octal code
   is **.55... [verify]** — different sources differ on the precise digit.
3. The player who cannot move loses (normal play).

Turning-game positions decompose by **Mock-Turtles theorem**: the nim-value of a
position is the nim-sum of the nim-values of single heads-coins.

## Solution status

Strongly solved by [Guy & Smith (1956)](../references.md#guy-smith1956): the
single-coin nim-values form a tabulated sequence (well-defined by the octal
code), and the game value of any position is the nim-sum of nim-values of
heads-coins. Optimal play follows.

## Consensus on optimal play

- **Precompute the single-coin nim-value table** — the nim-value of a single heads-coin in position n is determined by the game's octal code via the mex recurrence; tabulate these values for n = 0, 1, 2, ... up to the board size.
- **XOR all single-coin values to get the position value** — once the table is available, XOR (nim-sum) the values for every heads-coin position; if the result is non-zero you are in a winning (N-) position.
- **Winning move: find a flip that reduces the nim-sum to 0** — among all legal moves (flipping 2 or 3 coins, rightmost going from heads to tails), choose the one that makes the nim-sum of the resulting position equal to 0.
- **The rightmost flipped coin constraint is the key tactical limitation** — every legal move must flip at least one coin from heads to tails (the rightmost in the chosen group); this is what makes the game finite and the nim-sequence well-defined.
- **Use the Mock-Turtles decomposition principle** — positions decompose into independent single-coin games; updating only the affected single-coin values after each move (rather than recomputing from scratch) makes calculation efficient over the board.

## Engines & current best play

- **Strongest known program(s):** Any nim-value calculator implementing the octal-code mex recurrence; no dedicated software needed beyond a lookup table.
- **Strength:** Perfect; the game is strongly solved via Guy & Smith's nim-value tabulation.
- **Where the proof / tablebase lives (if solved):** [Guy & Smith (1956)](../references.md#guy-smith1956); [Berlekamp, Conway & Guy (2001)](../references.md#bcg2001).
- **Notes:** The exact octal code defining Mogul should be verified against a primary source before constructing the nim-value table; different authors use slightly different octal digits.

## Complexity

Trivial — O(n) to evaluate a position.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Combinatorial_game_theory) ([archive](http://web.archive.org/web/20260508023449/https://en.wikipedia.org/wiki/Combinatorial_game_theory))
- [Guy & Smith (1956). *The G-values of various games*.](../references.md#guy-smith1956)
- [Berlekamp, Conway & Guy (2001–2004). *Winning Ways for Your Mathematical Plays*.](../references.md#bcg2001)

## See also

- [Mock Turtles](mock-turtles.md) · [Turning Turtles](turning-turtles.md) · [Ruler game](ruler-game.md)
- Lexicon: [octal game](../lexicon/README.md#octal-game) · [nim-sum](../lexicon/README.md#nim-sum)
