# Wythoff's game

> A two-pile game where you can remove tokens from one pile or the same number from both piles. The losing positions follow the golden ratio. It is fully solved.

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

Two piles of objects. On a turn, a player either removes any positive number of objects from one pile, or removes the same positive number from both piles. The player who takes the last object(s) wins.

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

- **Check if the starting position is a losing position using the golden ratio formula** — for piles of sizes (a, b), find n = the smaller of a and b. If the pair equals (floor(n times phi), floor(n times phi squared)) for some integer n (where phi is the golden ratio, about 1.618), you are in a losing position. Otherwise, you can win.
- **Win by moving to a losing position** — from any winning position, there is always a move (either reduce one pile, or reduce both by the same amount) that reaches a losing position. Find it using the formula and make that move.
- **The standard Nim XOR method does not work here** — Wythoff's game adds the option to remove the same number from both piles (the diagonal move). Unlike ordinary Nim, the losing positions are not found by XOR. The golden ratio formula is the only clean way to identify them.
- **Use diagonal moves when piles are close in size** — when the two piles differ by a small amount and the pair is not already a losing position, the diagonal move can adjust both piles at once to reach a losing position. This is often the winning move when the piles are near each other in size.
- **Use single-pile moves when piles are very unequal** — when one pile is much larger than the other, reducing just that pile (like in regular Nim) can land directly on a losing position. Check single-pile options before working out diagonal moves.

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
