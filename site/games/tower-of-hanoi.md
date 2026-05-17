# Tower of Hanoi

> The classic recursive disc-stacking puzzle — fully solved.

| Field | Value |
|-------|-------|
| Also known as | Tour de Hanoï, Lucas's Tower |
| Players | 1 |
| Type | Solo puzzle |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Strongly solved |
| **Game-theoretic value** | Always solvable in 2^n − 1 moves |
| Year solved | 1883 (Édouard Lucas, on publication) |
| Solved by | Édouard Lucas |
| State-space complexity | 3^n |
| Game-tree complexity | 2^n − 1 (optimal) |
| **Playable** | tower-of-hanoi |

## Description

The Tower of Hanoi (Édouard Lucas, 1883) is the canonical recursion puzzle:
move a stack of *n* discs from one peg to another, never placing a larger
disc on a smaller. Its minimum solution length is exactly 2^n − 1 moves.

## Rules

1. Three pegs labelled A, B, C. *n* discs of distinct sizes start stacked on
   peg A, largest at the bottom.
2. On each move the player transfers the top disc of one peg to another peg.
3. A disc may never be placed on top of a smaller disc.
4. The puzzle is solved when all *n* discs are stacked, in order, on peg C.

## Solution status

**Strongly solved**: the minimum number of moves is 2^n − 1, and the optimal
strategy is well known (recursive: move the top n−1 discs to the spare peg,
move disc n to the goal peg, then move the n−1 discs onto it).

## Consensus on optimal play

- **Use the recursive algorithm** — to move n discs from A to C using B as spare: (1) move n−1 discs from A to B, (2) move disc n from A to C, (3) move n−1 discs from B to C. This exactly 2^n − 1-move strategy is provably optimal.
- **Odd-numbered discs move to the goal peg, even-numbered to the spare** — for three pegs the smallest disc cycles A→C→B→A (or the reverse); knowing the peg-cycle for your disc size eliminates guesswork on each step.
- **The iterative rule: alternate moving the smallest disc with the unique legal move for all other discs** — on every odd step move the smallest disc one position in its cycle direction; on every even step make the only non-smallest-disc move available. This produces the optimal solution without recursion.
- **State encodes position** — represent each disc's peg as a ternary digit; the state number from 0 to 3^n − 1 maps exactly to a position, and the move sequence corresponds to reflected Gray-code counting.
- **Four-peg (Frame–Stewart) variant is harder** — with an extra peg the optimal number of moves is still an open problem in general; the Frame–Stewart algorithm gives the best known solution but its optimality is unproven beyond small n.

## Engines & current best play

- **Strongest known program(s):** Any correct recursive or iterative implementation — the optimal algorithm is closed-form.
- **Strength:** Perfectly solved; the exact minimum-move solution is always achievable.
- **Where the proof / tablebase lives (if solved):** Lucas (1883); see also [Wikipedia](https://en.wikipedia.org/wiki/Tower_of_Hanoi) and [../references.md#gardner-tower-of-hanoi](../references.md#gardner-tower-of-hanoi).
- **Notes:** The standard three-peg puzzle is the textbook recursion example; the four-peg generalisation (Frame–Stewart problem) remains an open problem in combinatorics.

## Complexity

Linear in n for description; exponential in n for total move count.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Tower_of_Hanoi) ([archive](http://web.archive.org/web/20260508043356/https://en.wikipedia.org/wiki/Tower_of_Hanoi))
- [Gardner. *Mathematical Recreations* (various editions on Hanoi).](../references.md#gardner-tower-of-hanoi)

## See also

- [Klotski](klotski.md) · [Sokoban](sokoban.md) · [Pocket Cube](pocket-cube.md)
- Lexicon: [strongly solved](../lexicon/README.md#strongly-solved)
