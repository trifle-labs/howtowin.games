# Pocket Cube

> The 2x2x2 version of Rubik's Cube. Fully solved: any position can be solved in 11 moves or fewer.

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

The Pocket Cube is the 2x2x2 version of Rubik's Cube. It has only 3,674,160 possible positions — small enough to be fully analyzed. Every scrambled cube can be solved in **at most 11 face-turn moves** (rotating a face by 90 or 180 degrees) or 14 quarter-turn moves (90-degree rotations only).

## Rules

1. Puzzle: a 2x2x2 cube made of 8 corner pieces. Each of the six faces has its own colour.
2. On each move, you rotate one of the 6 faces by 90 degrees or 180 degrees (called face-turn metric); some systems count only 90-degree rotations (quarter-turn metric).
3. The puzzle is solved when every face shows a single solid colour.
4. No pieces are captured or removed — you just apply a sequence of moves to rearrange the pieces.

## Solution status

**Strongly solved**. The position graph has been fully enumerated and the
**diameter** is 11 FTM (equivalently 14 QTM).

## Consensus on optimal play

- **Beginner: solve by layers** — first place the four corners of the top layer, then orient and move the bottom four into place. This takes 6-8 moves on average and is easy to learn.
- **Intermediate: Ortega method** — orient both the top and bottom faces first (OLL, or "orientation of the last layer"), then move the corners into their correct spots. Average moves drop to about 6-8.
- **Advanced: CLL / EG methods** — recognize the top face orientation and the top/bottom corner positions all at once, then apply one algorithm. Top speed-solvers do the whole puzzle in a single algorithm.
- **Any position can be solved in 11 face-turn moves or fewer** — an optimal solver using the complete table of all positions finds the shortest solution instantly.
- **Only corner pieces, no edges** — unlike the 3x3 Rubik's Cube, the Pocket Cube has no edge pieces. This makes some rules simpler and algorithms shorter.

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
