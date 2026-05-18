# Tower of Hanoi

> A classic puzzle where you move a stack of discs from one peg to another without placing a larger disc on a smaller one. It is fully solved.

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

The Tower of Hanoi (Édouard Lucas, 1883) is a classic puzzle. You move a stack of discs from one peg to another, never placing a larger disc on top of a smaller one. The puzzle can always be solved in exactly 2 to the power of n minus 1 moves (where n is the number of discs).

## Rules

1. Three pegs labeled A, B, C. Some number of discs of different sizes start stacked on peg A, largest at the bottom.
2. On each move, the player moves the top disc of one peg to another peg.
3. A disc may never be placed on top of a smaller disc.
4. The puzzle is solved when all discs are stacked in order on peg C.

## Solution status

**Strongly solved**: the minimum number of moves is 2^n − 1, and the optimal
strategy is well known (recursive: move the top n−1 discs to the spare peg,
move disc n to the goal peg, then move the n−1 discs onto it).

## Consensus on optimal play

- **Use the recursive method** — to move n discs from peg A to peg C using peg B as the spare: (1) move n-1 discs from A to B, (2) move the largest disc from A to C, (3) move the n-1 discs from B to C. This is proven to be the fastest possible method.
- **Odd-numbered discs go to the goal peg, even-numbered to the spare** — the smallest disc follows a cycle (A to C to B to A and back). Knowing which peg each disc should move to eliminates guesswork.
- **Alternate between moving the smallest disc and making the only other legal move** — on odd-numbered steps, move the smallest disc one position in its cycle. On even-numbered steps, make the only other legal move available. This produces the perfect solution without needing to think recursively.
- **For the standard three-peg version, the solution is always known** — you can solve any Tower of Hanoi puzzle in the minimum number of moves by following the simple rules above.
- **The four-peg version (Frame-Stewart) is much harder** — with an extra peg, the optimal number of moves is still an open mathematical problem for large numbers of discs. The best known method may not be the fastest possible for all cases.

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
