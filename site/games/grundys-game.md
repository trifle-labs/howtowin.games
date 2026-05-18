# Grundy's game

> A game where you split heaps into two unequal parts. The winning move can be calculated for any heap size, but the underlying pattern is still a mystery.

| Field | Value |
|-------|-------|
| Also known as | Grundy's game |
| Players | 2 |
| Type | Impartial combinatorial game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Partially solved (algorithmically solved for all practical heap sizes; structure unproven) |
| **Game-theoretic value** | Computable for any given position, but no closed form |
| Year solved | — (open) |
| Solved by | — |
| State-space complexity | Depends on heap sizes |
| Game-tree complexity | Depends on heap sizes |
| **Playable** | grundys-game |

## Description

A heap of objects. On your turn, you split one heap into two non-empty, unequal parts. If you cannot make a move (every heap is size 1 or 2), you lose.

## Solution status

Grundy's game is **partially solved**. Any *specific* position can be analysed:
the [nim-value](../lexicon/README.md#nim-value) of a heap is computed by the
[mex](../lexicon/README.md#mex) recurrence, and positions decompose by
[nim-sum](../lexicon/README.md#nim-sum). The single-heap nim-value sequence has
been computed for billions of heap sizes.

What is **open** — and a celebrated unsolved problem in combinatorial game
theory — is whether that sequence is *eventually periodic*. It is widely
conjectured to be (most octal-style games whose sequences have been studied are
periodic), but no proof exists, and no period has been found despite enormous
computation. So the game is solved in the operational sense for any heap a human
or computer will encounter, but not solved in the theoretical sense.

## Consensus on optimal play

- **Calculate the Grundy value for each heap, then make the total XOR (nim-sum) equal zero** — with multiple heaps, calculate the Grundy value of each heap, then make a move that sets the nim-sum (a mathematical way of combining heap values) to zero. This is the exact winning condition.
- **A heap of size 2 is a dead end** — heaps of size 1 and 2 cannot be split (size 1 is indivisible; size 2 cannot be split into two unequal non-empty parts). Treat them as terminal heaps with Grundy value 0.
- **Heap size 3 has Grundy value 1** — split into {1, 2}. This is the smallest meaningful move and a useful starting point for hand calculation.
- **Use precomputed tables for larger heaps** — beyond small heaps, the Grundy value pattern is irregular enough that looking up a table or computing it is the only practical approach during play.
- **With a single large heap, Grundy value 0 means you lose** — if your only heap has Grundy value 0, every split you make will give the opponent a position they can win from. You lose against perfect play.

## Engines & current best play

- **Strongest known program(s):** No dedicated game engine; any CGT toolkit implementing mex/nim-sum (e.g., Aaron Siegel's CGSuite) solves any given position exactly.
- **Strength:** Perfectly solvable for any position that fits in memory; the nim-value sequence has been computed for billions of heap sizes.
- **Where the proof / tablebase lives (if solved):** Precomputed nim-value tables exist up to large heap sizes; see [Berlekamp, Conway & Guy (2001)](../references.md#bcg2001).
- **Notes:** The celebrated open question — whether the nim-value sequence is eventually periodic — does not affect practical play; any specific position can be evaluated exactly.

## Complexity

Computing the nim-value of a heap of size *n* by the naive recurrence is
polynomial in *n*.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Grundy%27s_game) ([archive](http://web.archive.org/web/20251004213435/https://en.wikipedia.org/wiki/Grundy%27s_game))
- [Berlekamp, Conway & Guy (2001). *Winning Ways for Your Mathematical Plays*.](../references.md#bcg2001)
- [Guy, R. K. & Smith, C. A. B. (1956). *The G-values of various games*.](../references.md#guy-smith1956)

## See also

- [Kayles](kayles.md) · [Dawson's chess](dawsons-chess.md) · [Nim](nim.md) · [Subtract-a-square](subtract-a-square.md)
- Lexicon: [nim-value](../lexicon/README.md#nim-value) · [octal game](../lexicon/README.md#octal-game)
