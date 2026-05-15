# 15 puzzle

> The classic sliding-tile puzzle — its solvability is fully characterised and
> the worst-case optimal solution length ("God's Number") is known to be 80.

| Field | Value |
|-------|-------|
| Also known as | Fifteen puzzle, Gem Puzzle, 15-14 puzzle, Mystic Square |
| Players | 1 (puzzle) |
| Type | Single-player sliding-tile puzzle |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Strongly solved (solvability characterised; diameter = 80) |
| **Game-theoretic value** | N/A (puzzle) — exactly half of all start states are solvable |
| Year solved | solvability: 1879; diameter (80): 2011 **[verify]** |
| Solved by | Johnson & Story (solvability); Brüngger / later computations (diameter) **[verify]** |
| State-space complexity | 16!/2 = 10,461,394,944,000 ≈ 1.0 × 10^13 reachable states |
| Game-tree complexity | N/A (puzzle) |

## Description

Fifteen numbered tiles in a 4×4 frame with one empty space; a tile orthogonally
adjacent to the gap can slide into it. The goal is to reach the ordered
configuration. As a puzzle it has no game-theoretic value; the meaningful results
are **which** scrambles are solvable and **how far** the hardest solvable one is
from solved.

## Solution status

The 15 puzzle is **strongly solved** as a puzzle:

- **Solvability** was settled by Johnson & Story in 1879: a configuration is
  solvable if and only if the permutation parity of the tiles matches the parity
  of the blank's taxicab distance from its home square. Exactly **half** of the
  16! arrangements are reachable — the famous "14-15" swap is one of the
  unsolvable half.
- **Diameter.** Brute-force breadth-first search over all ~10^13 solvable states
  established that the hardest positions require **80** moves to solve optimally
  — the 15-puzzle's "God's Number" — with 17 positions at that maximum distance.
  **[verify]** the exact attribution and date of the diameter computation.

## Consensus on optimal play

- **First, check solvability with the parity test** — count the number of inversions in the tile sequence, then add the row number of the blank (counting from the bottom); if that sum is even, the puzzle is solvable; if odd, it is unsolvable (famously, a 14-15 swap produces an unsolvable configuration).
- **For humans: solve row by row, top to bottom, then column by column** — the standard human method (fill rows 1 and 2, then columns, then solve the last 2×4 or 2×3 block with known sequences) is far from optimal but tractable to learn and apply.
- **For computers: use IDA* with a 6-6-3 or 5-5-5 pattern database heuristic** — iterative deepening A* with a precomputed lower-bound heuristic (summing taxicab distances of disjoint tile subsets) finds optimal solutions efficiently; this is the standard benchmark algorithm for the 15-puzzle and sliding-tile puzzles generally.
- **The maximum optimal solution is 80 moves** — any solvable position can be solved in at most 80 single-tile slides; a solver that exceeds 80 moves is suboptimal.
- **Memorise a few "commutator" sequences for 2×2 and 2×3 blocks** — the hardest part of the puzzle for humans is the final 3-tile block; several short sequences (typically 8–12 moves) cycle tiles without disturbing the rest of the board and can be combined to solve any configuration.

## Engines & current best play

- **Strongest known program(s):** IDA* with pattern databases — the standard optimal solver. No single canonical named program, but the algorithm is widely implemented (e.g., in academic search-algorithm libraries).
- **Strength:** Perfect — IDA* with the 6-6-3 pattern database finds an optimal (shortest) solution for any solvable 15-puzzle position.
- **Where the proof / tablebase lives (if solved):** Solvability: Johnson & Story (1879); diameter (80 moves): computational result attributed to various groups, ~2011 [verify]; see also [Ratner & Warmuth (1990)](../references.md#ratner-warmuth1990).
- **Notes:** The 15-puzzle is a canonical AI search benchmark; solving it optimally with IDA* and pattern databases is a standard textbook exercise in heuristic search. The n×n generalisation is NP-hard to solve optimally.

## Complexity

16!/2 ≈ 1.0 × 10^13 reachable states; configuration-graph diameter 80 in the
single-move metric. The n×n generalisation is NP-hard to solve optimally.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/15_puzzle) ([archive](http://web.archive.org/web/20260403031423/https://en.wikipedia.org/wiki/15_puzzle))
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002) (general framework)
- [Ratner & Warmuth (1990). *The (n²−1)-puzzle and related relocation problems*.](../references.md#ratner-warmuth1990)

## See also

- [Rubik's Cube](rubiks-cube.md) · [Peg solitaire](pegs-solitaire.md)
- Lexicon: [God's number](../lexicon/README.md#gods-number) · [strongly solved](../lexicon/README.md#strongly-solved)
