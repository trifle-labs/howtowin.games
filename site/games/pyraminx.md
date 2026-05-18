# Pyraminx

> A pyramid-shaped twist puzzle. Fully solved: any position can be solved in 11 moves (or 6 moves if you ignore the corner tips).

| Field | Value |
|-------|-------|
| Also known as | Pyraminx |
| Players | 1 |
| Type | Solo permutation puzzle |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Strongly solved |
| **Game-theoretic value** | Any scramble solvable in ≤ 11 moves (≤ 6 ignoring tips) |
| Year solved | 1980s |
| Solved by | Tomas Rokicki and others |
| State-space complexity | 75,582,720 positions (933,120 ignoring trivial tips) |
| Game-tree complexity | Solved by exhaustive table |
| **Playable** | pyraminx |

## Description

The Pyraminx (Uwe Meffert, 1981) is a pyramid-shaped twist puzzle with four triangular faces. Its state space is small (under 100 million positions) and has been fully analyzed: any scrambled puzzle can be solved in at most **11 moves**, or **6 moves** if you ignore the four corner tips (which are trivial to twist).

## Rules

1. Puzzle: a pyramid with 4 corner tips, 4 axial pieces, and 6 edge pieces.
2. On each move, you rotate one of the 4 axes by 120 or 240 degrees.
3. Each corner tip has its own axis and can be rotated independently — solving the tips is basically free since it does not affect the rest of the puzzle.
4. The puzzle is solved when every face shows a single colour.

## Solution status

**Strongly solved**: any scramble can be solved in **≤ 11 moves** (≤ 6
ignoring tips).

## Consensus on optimal play

- **Fix the tips whenever you want** — the four corner tips twist independently without affecting anything else. Many speed-solvers fix them last as a simple final step.
- **V method: solve edges in a V-shape on one face** — place three edge pieces on the bottom face first, then solve the top. This is faster than a strict layer-by-layer method.
- **Keyhole / L4E methods** — reduce the remaining pieces to a pattern you recognize from a lookup table, then apply one short algorithm. Top solvers often finish in just one or two algorithms.
- **Any scramble can be solved in 11 moves or fewer** — an optimal solver using the small set of all positions finds the shortest solution instantly.
- **Only 75 million positions** — the full set of positions is small enough for a computer to store and look up instantly.

## Engines & current best play

- **Strongest known program(s):** Complete lookup-table solvers (small enough for exhaustive enumeration).
- **Strength:** Perfect (optimal solve in ≤ 11 moves, ≤ 6 ignoring tips).
- **Where the proof / tablebase lives (if solved):** [Wikipedia](https://en.wikipedia.org/wiki/Pyraminx)
- **Notes:** God's number of 11 (with tips) / 6 (without) is verified by complete enumeration of all ~75 million positions.

## Complexity

Small.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Pyraminx) ([archive](http://web.archive.org/web/20260323231722/https://en.wikipedia.org/wiki/Pyraminx))
- [Rokicki *et al.* (2017). *The diameter of the Rubik's cube group is twenty*.](../references.md#rokicki2014) (related)

## See also

- [Rubik's Cube](rubiks-cube.md) · [Pocket Cube](pocket-cube.md) · [Skewb](skewb.md) · [Megaminx](megaminx.md)
- Lexicon: [strongly solved](../lexicon/README.md#strongly-solved) · [God's number](../lexicon/README.md#gods-number)
