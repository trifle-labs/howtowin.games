# Mock Turtles

> A coin-turning game where each position breaks down into a simple XOR sum of special numbers called Mock Turtle numbers.

| Field | Value |
|-------|-------|
| Also known as | — (a Berlekamp–Conway–Guy coin-turning game) |
| Players | 2 |
| Type | Impartial combinatorial game (coin-turning game) |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Strongly solved |
| **Game-theoretic value** | Depends on the coin configuration (nim-sum of component values) |
| Year solved | 1956–1982 (octal-game era; full treatment in *Winning Ways*) |
| Solved by | Richard K. Guy, Cedric A. B. Smith; Berlekamp, Conway & Guy |
| State-space complexity | Depends on the row length |
| Game-tree complexity | Depends on the row length |
| **Playable** | mock-turtles |

## Description

A row of coins, each showing heads or tails. On your turn you flip up to **three**
coins, and the **rightmost coin you flip must change from heads to tails**. The
game ends when all coins show tails, and the player who makes the last move wins.

## Solution status

Mock Turtles is **strongly solved** as one of the classic *coin-turning games*.
In any coin-turning game, a position is the [nim-sum](../lexicon/README.md#nim-sum)
of the single-coin games given by each heads coin, so the whole game reduces to
knowing the [nim-value](../lexicon/README.md#nim-value) of "a single head in
position *n*." For Mock Turtles those values are the **Mock Turtle numbers**:
the *n*-th value is 2n or 2n+1, chosen to have an odd number of binary 1s
(an "odious" number). With this closed form every position's value and an
optimal move are immediate.

## Consensus on optimal play

- **XOR all the Mock Turtle values for coins showing heads** — for each heads coin at position n (counting from 0 at the rightmost position), look up that position's Mock Turtle number and XOR all those numbers together. If the result is not zero, you are in a winning position.
- **Winning move: make the XOR result become 0** — find up to three coins (the rightmost one you flip must go from heads to tails) whose combined flip reduces the XOR total to 0. From a non-zero position this is always possible.
- **The Mock Turtle value of position n is the "odious" number closest to 2n** — an odious number is one with an odd number of 1s when written in binary. The Mock Turtle value is 2n if 2n is odious, otherwise 2n+1.
- **Flipping multiple coins lets you adjust several values at once** — since you can flip up to three coins (the rightmost from heads to tails), you can change up to three parts of the XOR at the same time. Use this to zero out the total efficiently.
- **All-tails is a losing position for the player whose turn it is** — when all coins show tails the XOR is 0, which means the previous player won. Aim to leave your opponent with all tails.

## Engines & current best play

- **Strongest known program(s):** Any nim-value calculator implementing the Mock Turtle closed form; no dedicated software needed.
- **Strength:** Perfect; the strategy is a closed-form calculation requiring only XOR operations.
- **Where the proof / tablebase lives (if solved):** [Berlekamp, Conway & Guy (2001)](../references.md#bcg2001); [Guy & Smith (1956)](../references.md#guy-smith1956).
- **Notes:** Mock Turtles is a classic coin-turning game; the "Mock Turtle numbers" (odious numbers near 2n) provide a clean closed-form solution demonstrating the power of the nim-value calculus.

## Complexity

Linear in the row length to evaluate a position.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Nim) ([archive](http://web.archive.org/web/20260513001624/https://en.wikipedia.org/wiki/Nim))
- [Berlekamp, Conway & Guy (2001). *Winning Ways for Your Mathematical Plays*.](../references.md#bcg2001)
- [Guy, R. K. & Smith, C. A. B. (1956). *The G-values of various games*.](../references.md#guy-smith1956)

## See also

- [Turning Turtles](turning-turtles.md) · [Nim](nim.md) · [Kayles](kayles.md)
- Lexicon: [nim-sum](../lexicon/README.md#nim-sum) · [nim-value](../lexicon/README.md#nim-value)
