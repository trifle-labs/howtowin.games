# Mogul

> A coin-turning game related to Mock Turtles. All of its position values are known from a table.

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
| **Playable** | mogul |

## Description

A coin-flipping game from the book *Winning Ways*. A row of coins sits in front of you, some heads up and some tails up. Players take turns flipping coins according to specific rules, chosen so that the resulting game values form a rich and interesting sequence.

## Rules

1. A row of n coins, each showing heads or tails, in positions 1, 2, ..., n.
2. On your turn, pick one of the allowed flipping patterns from the game's "octal code" (a code that defines which flips are allowed). You flip 2 or 3 coins at chosen positions, and the rightmost coin you flip must go from heads to tails. The exact octal code is **.55... [verify]** — different sources give slightly different digits.
3. The player who cannot make a legal move loses (normal play).

Like other turning games, the value of any position is found by taking the values of each heads coin separately and XOR-ing them together.

## Solution status

Strongly solved by [Guy & Smith (1956)](../references.md#guy-smith1956): the
single-coin nim-values form a tabulated sequence (well-defined by the octal
code), and the game value of any position is the nim-sum of nim-values of
heads-coins. Optimal play follows.

## Consensus on optimal play

- **Make a table of values for each coin position** — the value of a single heads-up coin at position n is found by the game's octal code. Write these values down for positions 0, 1, 2, ... up to the board size.
- **XOR all the single-coin values to get the position's total** — once you have the table, XOR together the values for every coin that shows heads. If the result is not zero, you are in a winning position.
- **Winning move: pick flips that make the XOR total become 0** — among all legal moves (flipping 2 or 3 coins, with the rightmost going from heads to tails), choose one that makes the XOR of the new position equal to 0.
- **The rightmost-coin rule is the key limitation** — every move must flip at least one coin from heads to tails (the rightmost one in your chosen group). This keeps the game finite and makes the value sequence well-defined.
- **Update only what changes** — after each move, you only need to recalculate the values for the coins you flipped, not the whole board. This makes in-game calculation fast.

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
