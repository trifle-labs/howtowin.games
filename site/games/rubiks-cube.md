# Rubik's Cube

> The most famous mechanical puzzle. Solved: God's Number (the longest shortest solution anyone needs) is proven to be 20.

| Field | Value |
|-------|-------|
| Also known as | Magic Cube, 3×3×3 cube |
| Players | 1 (puzzle) |
| Type | Single-player permutation puzzle |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Strongly solved (God's Number = 20, half-turn metric) |
| **Game-theoretic value** | N/A (puzzle) — every position is solvable; diameter = 20 |
| Year solved | 2010 (announced); 2014 (published) |
| Solved by | Rokicki, Kociemba, Davidson & Dethridge |
| State-space complexity | 43,252,003,274,489,856,000 ≈ 4.3 × 10^19 reachable states |
| Game-tree complexity | N/A (puzzle) |
| **Playable** | rubiks-cube |

## Description

A 3x3x3 cube whose six faces can each be rotated. The 26 visible pieces can be scrambled into about 4.3 x 10^19 different reachable positions. The goal is to return every face to a single colour. Since this is a solo puzzle, there is no winner or loser — the interesting question is the **diameter** of the puzzle: the largest number of moves that is ever needed to solve any position in the shortest possible way.

## Solution status

The Rubik's Cube is **strongly solved** in the puzzle sense.
[Rokicki, Kociemba, Davidson & Dethridge (2014)](../references.md#rokicki2014)
proved that **every** configuration can be solved in at most **20** moves in the
half-turn metric, and that some positions ("superflip" and others) genuinely
require 20 — so the diameter, "**God's Number**," is exactly 20. The proof
partitioned all 4.3 × 10^19 states into ~2 billion cosets and searched them with
massive donated Google computing time. (In the quarter-turn metric the
corresponding number is 26.)

## Consensus on optimal play

- **CFOP method (beginner to advanced)** — solve the cross on the bottom, then the four first-layer corners, then the second-layer edges, then the top layer. Most speedcubers use this 4-step method and average 50-60 moves per solve.
- **Roux method uses fewer moves** — build two 1x2x3 blocks on the left and right sides, then finish the top. Uses fewer moves than CFOP but is harder to learn.
- **Kociemba's two-phase algorithm (computers)** — first reduce the cube to a smaller set of positions (phase 1, 20 moves or fewer), then solve from there (phase 2). Finds near-optimal solutions (usually 22 moves or fewer) in milliseconds.
- **Optimal IDA* solver** — searches all possibilities using pattern databases to find the shortest possible solution. Can prove a solution is the shortest, but may take seconds for scrambled positions.
- **No position needs more than 20 moves** — God's Number is 20. If any method claims to need more than 20 moves, it is not optimal.

## Engines & current best play

- **Strongest known program(s):** Kociemba's two-phase algorithm (open source at [https://kociemba.org/cube.htm](https://kociemba.org/cube.htm)); optimal IDA* solvers based on Korf (1997).
- **Strength:** Perfect (optimal in ≤ 20 HTM moves for any scramble).
- **Where the proof / tablebase lives (if solved):** [Rokicki et al. (2014)](../references.md#rokicki2014); [Wikipedia](https://en.wikipedia.org/wiki/Rubik%27s_Cube)
- **Notes:** The 2010/2014 proof required ~35 CPU-years on donated Google resources; no single machine holds the full tablebase.

## Complexity

4.3 × 10^19 reachable states; configuration-graph diameter proven to be 20
(half-turn metric). Generalised n×n×n cube solving is known to be NP-hard.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Rubik%27s_Cube) ([archive](http://web.archive.org/web/20260513023211/https://en.wikipedia.org/wiki/Rubik%27s_Cube))
- [Rokicki, Kociemba, Davidson & Dethridge (2014). *The Diameter of the Rubik's Cube Group Is Twenty*.](../references.md#rokicki2014)

## See also

- [15 puzzle](fifteen-puzzle.md) · [Peg solitaire](pegs-solitaire.md)
- Lexicon: [God's number](../lexicon/README.md#gods-number) · [strongly solved](../lexicon/README.md#strongly-solved) · [state-space complexity](../lexicon/README.md#state-space-complexity)
