# Ruler game

> A classic take-away game whose values follow the "ruler" pattern (1, 2, 1, 3, 1, 2, 1, 4...). A clean example of how game values work.

| Field | Value |
|-------|-------|
| Also known as | Ruler / .07 in octal-game notation |
| Players | 2 |
| Type | Impartial take-and-break game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Strongly solved |
| **Game-theoretic value** | Determined by nim-sum of pile nim-values |
| Year solved | 1956 |
| Solved by | Guy & Smith |
| State-space complexity | One pile of size n |
| Game-tree complexity | Polynomial |
| **Playable** | ruler-game |

## Description

Played with piles of tokens. The game gets its name from the pattern of its values, called the **ruler function** — the largest power of 2 that divides the pile size. This creates a sequence that looks like the markings on a ruler: 1, 2, 1, 3, 1, 2, 1, 4, 1, 2, 1, 3, and so on.

## Rules

1. One or more piles of tokens.
2. On your turn, pick one pile of size n and remove some tokens (between 1 and n). The exact rule for which removals are allowed is given by the octal code .07 — in practice, you may remove any number and may optionally split what is left according to a fixed rule.
3. The player who cannot move loses (normal play).

In practice, this game is usually described by its pattern of game values rather than by the removal rule.

## Solution status

Strongly solved by [Guy & Smith (1956)](../references.md#guy-smith1956). The
nim-value of a single pile of size n is the **2-adic valuation** of n (the
largest k such that 2^k divides n) plus 1 — the "ruler sequence." Combine
several piles by [nim-sum](../lexicon/README.md#nim-sum).

## Consensus on optimal play

- **Find the value using the ruler function** — for a pile of size n, find the largest number k such that 2^k divides evenly into n. The value is k + 1. The values cycle as 1, 2, 1, 3, 1, 2, 1, 4, and so on.
- **Combine multiple piles with XOR** — with more than one pile, XOR their values together. If the result is 0, the position is a loss for the player whose turn it is.
- **Make the XOR equal to 0 on every move** — like in Nim, the winning strategy is to leave the opponent with an XOR of 0.
- **Powers of two are the most important** — a pile of size 2^k has the highest value possible for a pile of that size. These piles dominate in multi-pile positions.
- **The game is solved by a formula, not by searching** — figuring out the value of a pile takes only a simple calculation. No need to explore the game tree.

## Engines & current best play

- **Strongest known program(s):** No game-specific engine needed — the ruler nim-value formula gives an instant solution.
- **Strength:** Perfect play by any implementation of the ruler nim-value formula.
- **Where the proof / tablebase lives (if solved):** [Guy & Smith (1956)](../references.md#guy-smith1956); [Berlekamp, Conway & Guy (2001)](../references.md#bcg2001)
- **Notes:** A teaching example in Sprague–Grundy theory; the closed-form nim-sequence is unusual in that it has an easily recognisable pattern.

## Complexity

Trivial: O(log n) to compute a heap's nim-value.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Ruler_game)
- [Guy & Smith (1956). *The G-values of various games*.](../references.md#guy-smith1956)
- [Berlekamp, Conway & Guy (2001–2004). *Winning Ways for Your Mathematical Plays*.](../references.md#bcg2001)

## See also

- [Kayles](kayles.md) · [Dawson's chess](dawsons-chess.md) · [Nim](nim.md)
- Lexicon: [octal game](../lexicon/README.md#octal-game) · [nim-value](../lexicon/README.md#nim-value)
