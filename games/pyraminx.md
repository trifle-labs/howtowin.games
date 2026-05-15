# Pyraminx

> Tetrahedral twist puzzle — fully solved: God's number is 11 (or 6 ignoring tips).

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

## Description

The Pyraminx (Uwe Mèffert, 1981) is a tetrahedral twist puzzle. Its
state-graph is small (under 10^8) and has been fully analysed: any scramble
solves in at most **11 moves**, or **6 moves** ignoring the four trivial
corner tips.

## Rules

1. Puzzle: tetrahedral puzzle with 4 corner tips, 4 axial "trivial" pieces,
   and 6 edges.
2. On a move the solver rotates one of the 4 axes by 120° or 240°.
3. Each tip is on its own axis and trivially rotates independently — solving
   them is essentially a free operation.
4. The puzzle is solved when every face shows a single colour.

## Solution status

**Strongly solved**: any scramble can be solved in **≤ 11 moves** (≤ 6
ignoring tips).

## Consensus on optimal play

- **Fix tips last (or first — they're free)** — the four corner tips each have a trivial independent axis; orient them at any point without affecting the rest of the puzzle; many speedcubers fix tips last as a final trivial step.
- **V method (solve edges in a V-shape on one face)** — place three edge pieces on the bottom face first, then solve the top cap; this is faster than a strict layer-by-layer approach.
- **Keyhole / L4E methods** — reduce the remaining pieces to a known lookup case and apply a single short algorithm; top speedcubers often reduce the solve to one or two algorithm applications.
- **Optimal solve ≤ 11 moves** — any scramble is within 11 axis rotations of solved; an IDA* search over the small state space finds optimal solutions instantly.
- **Only 75 million positions** — the full state graph is smaller than many games' opening books; brute-force optimal lookup is practical.

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
