# Wythoff's game

> A two-heap Nim variant whose losing positions are governed by the golden
> ratio.

| Field | Value |
|-------|-------|
| Also known as | Wythoff Nim, Tsyan-shizi ("choosing the stones") |
| Players | 2 |
| Type | Impartial combinatorial game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Strongly solved |
| **Game-theoretic value** | First-player win unless the start is a "cold" position |
| Year solved | 1907 |
| Solved by | Willem A. Wythoff |
| State-space complexity | Depends on the two starting heap sizes |
| Game-tree complexity | Depends on starting heaps |
| **Playable** | wythoffs-game |

## Description

Two heaps of objects. On a turn a player either removes any positive number
from one heap, **or** removes the *same* positive number from both heaps. Under
[normal play](../lexicon/README.md#normal-play-convention) the player taking the
last object(s) wins.

## Solution status

Wythoff's game is **strongly solved**. [Wythoff (1907)](../references.md#wythoff1907)
showed that the *P-positions* (previous-player wins — i.e. losses for the player
to move) are exactly the pairs

  (⌊nφ⌋, ⌊nφ²⌋) for n = 0, 1, 2, …

where φ = (1+√5)/2 is the golden ratio. These pairs form a pair of complementary
[Beatty sequences](https://en.wikipedia.org/wiki/Beatty_sequence). The first
player loses precisely when the starting heaps form such a pair; otherwise a
move to the nearest P-position wins.

## Consensus on optimal play

- **Check if the start is a P-position using the golden-ratio formula** — compute n = min(a, b) if the heaps are (a, b); if (a, b) = (⌊nφ⌋, ⌊nφ²⌋) for some integer n, you are in a losing position; otherwise you are in a winning position.
- **Win by moving to the nearest P-position** — from any N-position (a,b) there exists at least one move (either reduce one heap, or reduce both by the same amount) that reaches a P-position; find it using the formula and make that move.
- **Nim XOR does not work here** — Wythoff's game adds the diagonal move (remove equal amounts from both heaps); unlike ordinary Nim, the losing positions are *not* characterised by XOR = 0 and the golden-ratio Beatty-sequence formula is the only clean characterisation.
- **Diagonal moves close the gap** — if the two heaps differ by Δ and the pair is not already a P-position, the diagonal move can adjust both heaps simultaneously to hit the P-position; this is often the winning move when the heaps are close in size.
- **Single-heap moves suffice when heaps are very unequal** — when one heap is much larger, reducing only that heap (as in standard Nim) can land directly on the nearest P-position; check single-heap options before computing diagonal moves.

## Engines & current best play

- **Strongest known program(s):** No game-specific engine needed; the golden-ratio formula gives the optimal move in O(1) time.
- **Strength:** Perfectly solved with a closed-form expression.
- **Where the proof / tablebase lives (if solved):** Wythoff (1907) ([../references.md#wythoff1907](../references.md#wythoff1907)); also in *Winning Ways* ([../references.md#bcg2001](../references.md#bcg2001)).
- **Notes:** The connection between Wythoff's game and the golden ratio / Beatty sequences makes it one of the most elegant results in combinatorial game theory.

## Complexity

A family of positions; optimal play for a given start is computable directly
from the formula.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Wythoff%27s_game) ([archive](http://web.archive.org/web/20251206112849/https://en.wikipedia.org/wiki/Wythoff%27s_game))
- [Wythoff, W. A. (1907). *A modification of the game of Nim*.](../references.md#wythoff1907)
- [Berlekamp, Conway & Guy (2001). *Winning Ways for Your Mathematical Plays*.](../references.md#bcg2001)

## See also

- [Nim](nim.md) · [Fibonacci Nim](fibonacci-nim.md) · [Subtract-a-square](subtract-a-square.md)
- Lexicon: [impartial game](../lexicon/README.md#impartial-game) · [nim-value](../lexicon/README.md#nim-value)
