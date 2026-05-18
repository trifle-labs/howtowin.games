# 15 puzzle

> The classic sliding tile puzzle. We know exactly which starting positions can be solved and that the hardest one takes 80 moves.

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
| **Playable** | fifteen-puzzle |

## Description

Fifteen numbered tiles sit in a 4×4 frame with one empty space. A tile next to
the empty space (up, down, left, or right) can slide into it. The goal is to
get the tiles in order from 1 to 15. Since this is a puzzle, not a game, the
interesting questions are **which** scrambled positions can be solved and
**how many moves** the hardest solvable one takes.

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

- **First, check if your puzzle can be solved** — count how many pairs of tiles are out of order (inversions), then add the row number of the empty space (counting from the bottom). If the total is even, the puzzle can be solved. If odd, it cannot (the famous "14-15 swap" produces an impossible puzzle).
- **For humans: solve row by row, top to bottom** — the standard method (fill rows 1 and 2 first, then solve the last rows as columns) is not the shortest path, but it is easy to learn and use.
- **For computers: use a smart search algorithm** — computers use IDA* (a search algorithm) with precomputed lookup tables to find the shortest solution for any position efficiently.
- **The hardest puzzle takes 80 moves** — any solvable position can be solved in at most 80 single-tile slides. If your solver takes more than 80 moves, it is not finding the shortest path.
- **Learn a few key move sequences for the final block** — the hardest part for humans is the last 3-tile block. Several short sequences (usually 8-12 moves) can cycle tiles without disturbing the rest of the board and can solve any final position.

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
