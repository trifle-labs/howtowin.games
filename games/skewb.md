# Skewb

> Corner-rotation twist puzzle — fully solved: God's number is 11.

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

## Description

The Skewb (Tony Durham, 1982; popularised by Uwe Mèffert) is a corner-turning
cube puzzle. The state graph contains 3,149,280 positions and **God's
number** is 11 turns.

## Rules

1. Puzzle: cube whose 8 corners are connected to one of two interlocking
   tetrahedra; the moveable axes are the 4 body diagonals.
2. On a move the solver rotates a corner-axis by 120° or 240°; this twists
   half the cube around that diagonal.
3. The puzzle is solved when every face shows a single colour.

## Solution status

**Strongly solved**: any scramble solvable in **≤ 11 moves** (face-turn
metric).

## Consensus on optimal play

- **Sarah's Advanced Method** — the dominant speedsolving approach: orient the bottom face and centres in the first phase, then permute and orient the top layer corners; achieves average times well under 5 seconds.
- **Corner-axis intuition is key** — unlike face-turning puzzles, each Skewb move rotates half the cube; building intuition for which corners are affected by each axis move is the first skill to develop.
- **Top layer last** — solve the four corners of one face and all six centres by intuition, then use algorithms to place the remaining four corners; this two-phase approach is easier to learn than global strategies.
- **Optimal solve ≤ 11 moves** — with only 3,149,280 states, the complete optimal lookup table fits in a few MB; any correct search of the full state space confirms 11 as God's number.
- **Parity does not exist** — unlike the 3×3, the Skewb has no parity algorithms needed; any scramble is always solvable in a single consistent layer-by-layer approach.

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
