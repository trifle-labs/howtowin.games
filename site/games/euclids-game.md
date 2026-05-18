# Euclid's game

> A subtraction game with two piles of numbers. The winning positions follow the golden ratio. Fully solved.

| Field | Value |
|-------|-------|
| Also known as | Euclid's game (Cole & Davie, 1969) |
| Players | 2 |
| Type | Impartial subtraction game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Strongly solved |
| **Game-theoretic value** | First-player win iff (max/min) ≥ φ (golden ratio) |
| Year solved | 1969 |
| Solved by | A. J. Cole & A. J. T. Davie |
| State-space complexity | Position-dependent (two non-negative integers) |
| Game-tree complexity | O(log(max pile)) per game |
| **Playable** | euclids-game |

## Description

A small math game that turns the Euclidean algorithm (the method for finding
the greatest common divisor of two numbers) into a two-player contest. Despite
its simple rules, the losing positions follow the golden ratio, just like
[Wythoff's game](wythoffs-game.md).

## Rules

1. The game starts with two positive whole numbers (a, b).
2. On your turn, you must subtract a positive multiple of the smaller number from the larger one. For example, if the numbers are (3, 14), you could subtract 3 × 4 = 12 from 14 to get (3, 2).
3. The player who reduces one number to zero wins.

## Solution status

Strongly solved. [Cole & Davie](../references.md#vandenherik2002) **[verify]**
proved that the position (a, b) with a ≤ b is a **first-player win** iff
`b/a ≥ φ`, where φ = (1+√5)/2 ≈ 1.618 — and in that case the winning move is
the unique one that *crosses* the golden-ratio boundary. From positions with
`b/a < φ` only one move is legal up to flipping order, and it lands in a
P-position.

## Consensus on optimal play

- **Check if the bigger divided by the smaller is at least about 1.618 — if yes, you win; if no, you are in a losing position** — this single math check is the complete rule. From a winning position you can always move to a losing one for your opponent. From a losing position, any move you make gives the opponent a winning position.
- **From a winning position, your move must cross the golden ratio boundary** — find a multiple to subtract so that the new ratio of the numbers falls below 1.618. There is always exactly one such move (or two if the bigger is an exact multiple of the smaller).
- **When the ratio is below 1.618, you are in a losing position and only one move is legal** — you have no real choice. You will hand the opponent a winning position.
- **The game ends fast** — each move cuts the larger number by at least the smaller, so the game shrinks quickly, like the Euclidean algorithm. A game starting from (8, 13) or any consecutive Fibonacci numbers is a losing position for the first player.
- **Fibonacci pairs are the classic losing positions** — (1,1), (1,2), (2,3), (3,5), (5,8)... (consecutive Fibonacci numbers) are all losing for the first player. Learn to recognize these so you do not move into them.

## Engines & current best play

- **Strongest known program(s):** Any program that checks b/a ≥ φ and computes the unique crossing move plays perfectly. No dedicated engine needed.
- **Strength:** Perfect — O(1) per move.
- **Where the proof / tablebase lives (if solved):** Cole & Davie (1969); also in [Berlekamp, Conway & Guy (2001)](../references.md#bcg2001).
- **Notes:** Euclid's game is a gem of elementary game theory: rules that mirror the Euclidean algorithm, a complete solution in one inequality, and P-positions at exactly the Fibonacci/golden-ratio pairs.

## Complexity

Trivial: each game lasts at most O(log min(a,b)) moves, and the decision rule
is O(1).

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Euclid_game)
- [Berlekamp, Conway & Guy (2001–2004). *Winning Ways for Your Mathematical Plays*.](../references.md#bcg2001)
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)

## See also

- [Wythoff's game](wythoffs-game.md) · [Nim](nim.md) · [Fibonacci Nim](fibonacci-nim.md)
- Lexicon: [strongly solved](../lexicon/README.md#strongly-solved) · [nim-value](../lexicon/README.md#nim-value)
