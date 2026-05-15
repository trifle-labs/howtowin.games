# Pocket Cube

> 2×2×2 Rubik's Cube — fully solved: God's number is 11.

| Field | Value |
|-------|-------|
| Also known as | Pocket Cube, Mini Cube |
| Players | 1 |
| Type | Solo permutation puzzle |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Strongly solved |
| **Game-theoretic value** | Any scramble solvable in ≤ 11 face-turn moves (FTM) or ≤ 14 quarter-turn moves (QTM) |
| Year solved | 1980s (initial bounds); 2017 (full QTM/FTM verified) |
| Solved by | Various — Tomas Rokicki et al. |
| State-space complexity | 3,674,160 distinct positions |
| Game-tree complexity | Solved by exhaustive table |
| **Playable** | pocket-cube |

## Description

The Pocket Cube is the 2×2×2 version of Rubik's Cube. Its full state graph
has only 3,674,160 positions and is small enough to be exhaustively analysed:
every scramble is solvable in **at most 11 face-turn moves (FTM)** or 14
quarter-turn moves (QTM).

## Rules

1. Puzzle: 2×2×2 cube of 8 corner cubies. Each face is one of six colours.
2. On a move the solver rotates one of the 6 faces by 90° or 180° (face-turn
   metric); some literature counts only 90° rotations (quarter-turn metric).
3. The puzzle is solved when every face shows a single colour.
4. There are no captured pieces; the solver simply applies a sequence of
   moves.

## Solution status

**Strongly solved**. The position graph has been fully enumerated and the
**diameter** is 11 FTM (equivalently 14 QTM).

## Consensus on optimal play

- **Solve corners by layer (beginner)** — place the top layer's four corners, then orient and permute the bottom four; this takes 6–8 moves on average but is easy to learn.
- **Ortega method** — first orient both top and bottom layer faces (OLL of each face separately, then permute corners); reduces average move count to around 6–8 moves.
- **CLL / EG methods (advanced)** — recognize the combined top-face orientation and top/bottom permutation state in one look and apply a single algorithm; top speed-cubers execute the whole solve in one algorithmic block.
- **Optimal solve ≤ 11 FTM** — any position can be solved in 11 or fewer face-turn moves; an optimal solver (IDA* against the complete tablebase) finds a shortest solution instantly.
- **Pocket Cube has only corners** — unlike the 3×3, there are no edge pieces; every piece is a corner cubie, so parity issues differ and algorithms are simpler.

## Engines & current best play

- **Strongest known program(s):** Kociemba's two-phase algorithm (adapted) and full tablebase solvers for 2×2 — all 3,674,160 positions stored.
- **Strength:** Perfect (optimal solve in ≤ 11 FTM guaranteed).
- **Where the proof / tablebase lives (if solved):** [Wikipedia](https://en.wikipedia.org/wiki/Pocket_Cube); [Rokicki et al.](../references.md#rokicki2014)
- **Notes:** The complete tablebase fits in a few MB; any implementation with the full lookup table solves any scramble instantly with optimal move count.

## Complexity

Small enough to fit in a tablebase of a few megabytes.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Pocket_Cube)
- [Rokicki *et al.* (2017). *The diameter of the Rubik's cube group is twenty*.](../references.md#rokicki2014)

## See also

- [Rubik's Cube](rubiks-cube.md) · [Pyraminx](pyraminx.md) · [Skewb](skewb.md) · [Megaminx](megaminx.md)
- Lexicon: [strongly solved](../lexicon/README.md#strongly-solved) · [God's number](../lexicon/README.md#gods-number)
