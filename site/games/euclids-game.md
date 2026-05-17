# Euclid's game

> A two-pile subtraction game whose winning positions are governed by the
> golden ratio.

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

A small impartial game with a number-theoretic flavour: it strips down the
Euclidean algorithm into a two-player contest. Despite its tiny rules, the
losing-position structure is exactly the [Wythoff](wythoffs-game.md)-style
golden-ratio one.

## Rules

1. The position is an ordered pair of positive integers (a, b).
2. On your turn, you must subtract a positive multiple of the smaller from the
   larger — i.e. replace (a, b) with (a, b − ka) for some k ≥ 1 with b − ka ≥ 0.
3. The player who reduces one pile to zero (or who cannot move, equivalently)
   *wins* under the standard convention (alt: the player who makes the last
   legal move wins — same outcomes).

## Solution status

Strongly solved. [Cole & Davie](../references.md#vandenherik2002) **[verify]**
proved that the position (a, b) with a ≤ b is a **first-player win** iff
`b/a ≥ φ`, where φ = (1+√5)/2 ≈ 1.618 — and in that case the winning move is
the unique one that *crosses* the golden-ratio boundary. From positions with
`b/a < φ` only one move is legal up to flipping order, and it lands in a
P-position.

## Consensus on optimal play

- **Check whether b/a ≥ φ (≈ 1.618) — if yes, you win; if no, you are in a P-position** — this single inequality is the complete decision rule; from a winning (N-position) you can always move to a P-position; from a P-position any move leads to an N-position for your opponent.
- **From an N-position, your winning move crosses the golden-ratio boundary** — find k such that b − ka satisfies a/(b − ka) ≥ φ (i.e., leave the ratio below φ); there is exactly one such valid k in any N-position (or occasionally two, if b is an exact multiple of a).
- **When b/a < φ, you are in a P-position — only one move is legal** — there is only one integer multiple k available (k = floor(b/a) = 1), so you have no choice; you will hand your opponent an N-position. There is nothing to optimise here.
- **The game terminates quickly** — because each move strips the larger pile by at least the smaller pile, the position shrinks like the Euclidean algorithm: at most O(log(max(a,b))) moves total. A game starting from (8, 13) or any Fibonacci pair is a P-position.
- **Fibonacci pairs are the canonical P-positions** — (1,1), (1,2), (2,3), (3,5), (5,8)… (consecutive Fibonacci numbers) all satisfy b/a → φ from below and are second-player wins; recognise these to avoid playing into them.

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
