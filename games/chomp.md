# Chomp

> A game where we know the first player wins — but remarkably, nobody knows how.

| Field | Value |
|-------|-------|
| Also known as | Chomp |
| Players | 2 |
| Type | Impartial combinatorial game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Ultra-weakly solved |
| **Game-theoretic value** | First-player win (all non-trivial boards) |
| Year solved | 1974 |
| Solved by | David Gale (game and result); strategy-stealing argument |
| State-space complexity | Grows rapidly with board size |
| Game-tree complexity | Grows rapidly with board size |
| **Playable** | chomp |

## Description

Played on a rectangular grid of cells, imagined as a chocolate bar. The
top-left cell is "poisoned." On your turn, you pick a cell and "chomp" it
along with every cell below it and to the right of it (removing that whole
chunk from the bar). The player who is forced to eat the poisoned top-left
cell loses.

## Solution status

Chomp is **ultra-weakly solved**, and it is the textbook illustration of why
that category exists. A [strategy-stealing argument](../lexicon/README.md#strategy-stealing)
shows the first player wins on any board larger than 1×1: if the second player
had a winning reply to the first player's "chomp only the bottom-right cell,"
the first player could have played that winning move themselves to begin with.

This proves a winning strategy **exists** — but the argument is
non-constructive. For general *m*×*n* boards **no explicit winning strategy is
known**, and finding one is a well-known open problem. (Explicit strategies are
known only for special cases such as square boards, 2×*n* boards, and 3×*n*
boards.) Chomp is thus solved in value but not in strategy: the canonical
ultra-weak solution.

## Consensus on optimal play

- **First player wins on any non-trivial rectangular board** — this is proven (by a strategy-stealing argument). If you are the first player, you are in a winning position. The problem is finding the actual winning move.
- **On a 2×n board, the winning first move is to take from the bottom row leaving a 2×1 column** — exact winning strategies are known for 2×n boards. The pattern usually involves leaving the opponent with an L-shaped position they cannot handle.
- **On square boards, first move: take only the bottom-right corner** — this leaves a non-square position. The winning strategy on square n×n boards is known: keep a specific symmetry until the opponent is forced to eat the poison.
- **On large general boards, no one knows a quick winning strategy** — the proof only shows a winner exists. Actually finding the winning move for large boards requires searching through possible moves, and no fast (polynomial-time) method is known.
- **As second player on a general board, your only hope is opponent error** — against a perfect opponent, the second player loses. Focus on specific board sizes (narrow or small boards) where winning strategies are known.

## Engines & current best play

- **Strongest known program(s):** No dedicated public Chomp engine known to the cataloguer; custom minimax programs solve small boards.
- **Strength:** Perfect play on small boards (2×n, 3×n, square boards with known strategies); no known efficient algorithm for general large boards.
- **Where the proof / tablebase lives (if solved):** Ultra-weak solution: Gale (1974) strategy-stealing argument; explicit strategies for special cases in [Berlekamp, Conway & Guy (2001)](../references.md#bcg2001).
- **Notes:** Chomp is the canonical example of a game whose value is proven without a constructive strategy; finding a general polynomial winning strategy remains an open problem in combinatorial game theory.

## Complexity

The number of positions on an *m*×*n* board equals the number of monotone
staircase shapes, which grows quickly; no polynomial strategy is known.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Chomp) ([archive](http://web.archive.org/web/20260509224037/https://en.wikipedia.org/wiki/Chomp))
- [Berlekamp, Conway & Guy (2001). *Winning Ways for Your Mathematical Plays*.](../references.md#bcg2001)
- D. Gale (1974). *A curious Nim-type game*. American Mathematical Monthly 81:876–879. **[verify]**

## See also

- [Hex](hex.md) (also ultra-weakly solved by strategy stealing) · [Nim](nim.md) · [Sprouts](sprouts.md)
- Lexicon: [strategy-stealing argument](../lexicon/README.md#strategy-stealing) · [ultra-weakly solved](../lexicon/README.md#ultra-weakly-solved)
