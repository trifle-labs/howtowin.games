# Rubik's Cube

> The most famous mechanical puzzle — strongly solved in the sense that "God's
> Number" (the worst-case optimal solution length) is proven to be 20.

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

## Description

A 3×3×3 cube whose six faces can each be rotated. The 26 visible "cubies" can be
scrambled into about 4.3 × 10^19 distinct reachable configurations; the goal is
to return every face to a single colour. As a single-player puzzle it has no
game-theoretic value — the meaningful question is the **diameter** of its
configuration graph: the largest number of moves ever needed to solve a position
optimally.

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

- **CFOP (Fridrich method) for beginners to advanced** — solve the cross (bottom layer edges), then four first-layer corners, then the second layer edges, then orient and permute the top layer; most speedcubers use this 4-phase approach and average 50–60 moves.
- **Roux method reduces move count** — build two 1×2×3 blocks on left and right, then finish the top with M-slice and last-six-edges algorithms; requires fewer moves than CFOP but is harder to learn.
- **Kociemba's two-phase algorithm (computers)** — reduce to a subgroup using phase 1 (≤20 moves), then solve the reduced position in phase 2; finds near-optimal solutions (usually ≤22 moves) in milliseconds.
- **Optimal IDA* solver** — search with the Korf (1997) IDA* algorithm using pattern-database heuristics; finds a provably minimal-move solution for any position but can take seconds for deep scrambles.
- **God's Number is 20 (half-turn metric)** — no position requires more than 20 moves; any solver claiming more than 20 moves is sub-optimal.

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
