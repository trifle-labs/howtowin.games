# Mock Turtles

> A coin-turning game whose every position decomposes into a tidy nim-sum of
> "Mock Turtle numbers."

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

A row of coins, each heads or tails. On a turn a player turns over up to **three**
coins, of which the **rightmost must go from heads to tails**. The game ends
when all coins are tails; under [normal play](../lexicon/README.md#normal-play-convention)
the player making the last move wins.

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

- **XOR all Mock Turtle values for heads coins** — for each coin at position n (0-indexed from the right) that is heads, look up the Mock Turtle number for n; nim-sum (XOR) all those values; if the result is non-zero you are in a winning position.
- **Winning move: choose coins to XOR the nim-sum to 0** — find a set of up to three coins (rightmost must be flipped from heads to tails) whose combined flip reduces the nim-sum to 0; this is always possible from a non-zero position.
- **Mock Turtle value of position n is the odious number nearest to 2n** — "odious" means having an odd number of 1-bits in binary; the Mock Turtle value is 2n if 2n is odious, otherwise 2n+1; memorise or compute this quickly.
- **Turning multiple coins can target multiple positions** — the flexibility to flip up to three coins (rightmost from heads to tails) means you can alter the nim-sum by changing up to three components; use this freedom to zeroise the nim-sum efficiently.
- **All-tails is a losing position for the player to move** — the empty position (all tails) has nim-value 0 and is a P-position (previous player wins); steer toward leaving your opponent with all-tails.

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
