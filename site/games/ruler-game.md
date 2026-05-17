# Ruler game

> A textbook octal game whose nim-sequence is the "ruler" function — a clean
> example for the Sprague–Grundy theory.

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

Played on heaps of tokens. The game is named for its nim-sequence, which equals
the **ruler function** — the largest power of 2 dividing the heap size — so the
nim-values look like markings on a ruler: 1, 2, 1, 3, 1, 2, 1, 4, 1, 2, 1, 3,...

## Rules

1. One or more heaps of tokens.
2. A move picks one heap of size n and removes between 1 and n tokens, but the
   exact allowed removals are given by the octal code .07 — concretely, you
   may remove any positive amount and optionally split the remainder according
   to a fixed rule.
3. The player who cannot move loses (normal play).

In practice the game is most often described directly by its nim-value table
rather than by the octal rule.

## Solution status

Strongly solved by [Guy & Smith (1956)](../references.md#guy-smith1956). The
nim-value of a single pile of size n is the **2-adic valuation** of n (the
largest k such that 2^k divides n) plus 1 — the "ruler sequence." Combine
several piles by [nim-sum](../lexicon/README.md#nim-sum).

## Consensus on optimal play

- **Compute the nim-value via the ruler function** — for a heap of size n, find the largest k such that 2^k divides n; the nim-value is k + 1 (so nim-values cycle as 1,2,1,3,1,2,1,4,…).
- **Combine heaps by XOR** — with multiple heaps, XOR all their nim-values; the position is a second-player win (P-position) iff the XOR equals 0.
- **Make the XOR zero on every move** — as in ordinary Nim, the winning strategy is to leave your opponent a position where the nim-sum (XOR) of all piles is 0.
- **Powers of two are the strategic reference points** — heaps of size 2^k have nim-value k+1 (the highest value achievable for that size), making them the dominant heaps in any multi-pile position.
- **The game is solved by a formula, not search** — computing the nim-value takes O(log n) time; no game tree search is needed.

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
