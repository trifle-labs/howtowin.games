# Skewb

> A corner-rotating cube puzzle. Any scramble can be solved in 11 or fewer moves.

| Field | Value |
|-------|-------|
| Also known as | Skewb |
| Players | 1 |
| Type | Solo permutation puzzle |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Strongly solved |
| **Game-theoretic value** | Any scramble solvable in ≤ 11 moves |
| Year solved | 1980s |
| Solved by | Tomas Rokicki and others |
| State-space complexity | 3,149,280 positions |
| Game-tree complexity | Solved by exhaustive table |
| **Playable** | skewb |

## Description

The Skewb (Tony Durham, 1982; popularised by Uwe Mèffert) is a puzzle cube that turns at its corners instead of its faces. The puzzle has 3,149,280 possible positions, and any scramble can be solved in 11 turns or fewer (this is called God's number).

## Rules

1. Puzzle: a cube whose 8 corners are connected to one of two interlocking tetrahedra (four-sided pyramids). The moving parts turn along the 4 body diagonals of the cube.
2. On a move, the solver rotates a corner by 120 or 240 degrees, which twists half the cube around that diagonal.
3. The puzzle is solved when every face shows a single color.

## Solution status

**Strongly solved**: any scramble solvable in **≤ 11 moves** (face-turn
metric).

## Consensus on optimal play

- **Sarah's Advanced Method** — the most popular speedsolving method: first orient the bottom face and the centers, then position and rotate the top layer corners. This can achieve solve times well under 5 seconds.
- **Understand how corner turns work** — unlike face-turning puzzles, each Skewb move rotates half the cube. Learning which corners are affected by each turn is the first skill to develop.
- **Solve the top layer last** — solve the four corners of one face and all six centers by intuition first, then use memorized sequences to place the remaining four corners. This two-phase approach is easier than learning a single global method.
- **Optimal solve is 11 moves or fewer** — the puzzle has only 3,149,280 positions, so a complete lookup table easily fits on a computer. Any correct search confirms that 11 moves is the most needed.
- **No parity errors** — unlike the standard 3x3 Rubik's Cube, the Skewb never runs into impossible configurations. Any scramble can be solved using a single consistent layer-by-layer method.

## Engines & current best play

- **Strongest known program(s):** Complete lookup-table solvers (exhaustive BFS from the solved state).
- **Strength:** Perfect (optimal solve in ≤ 11 moves guaranteed).
- **Where the proof / tablebase lives (if solved):** [Wikipedia](https://en.wikipedia.org/wiki/Skewb); complete state space of 3,149,280 positions.
- **Notes:** God's number of 11 is verified by complete enumeration; any implementation with the full BFS table solves optimally.

## Complexity

Very small.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Skewb)
- [Rokicki *et al.* (2017). *The diameter of the Rubik's cube group is twenty*.](../references.md#rokicki2014) (related)

## See also

- [Rubik's Cube](rubiks-cube.md) · [Pocket Cube](pocket-cube.md) · [Pyraminx](pyraminx.md) · [Megaminx](megaminx.md)
- Lexicon: [strongly solved](../lexicon/README.md#strongly-solved) · [God's number](../lexicon/README.md#gods-number)
