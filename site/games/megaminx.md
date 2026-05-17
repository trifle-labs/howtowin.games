# Megaminx

> Dodecahedral twist puzzle — God's number not yet established.

| Field | Value |
|-------|-------|
| Also known as | Megaminx |
| Players | 1 |
| Type | Solo permutation puzzle |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Not fully solved (lower/upper bounds known) |
| **Game-theoretic value** | God's number: lower bound 45 face turns; upper bound ~ several dozen **[verify]** |
| Year solved | — |
| Solved by | — |
| State-space complexity | ~10^68 positions |
| Game-tree complexity | Vastly larger than Rubik's Cube |

## Description

The Megaminx is a dodecahedral analogue of Rubik's Cube: 12 pentagonal
faces, 30 edges, 20 corners. Its state space is roughly 10^68 positions —
many orders of magnitude beyond the Rubik's Cube — so the exact diameter
("God's number") of its move graph has not been pinned down.

## Rules

1. Puzzle: dodecahedron with each of 12 faces rotatable by 72°.
2. On a move the solver rotates one face by 72° clockwise or
   counterclockwise.
3. The puzzle is solved when every face shows a single colour.

## Solution status

Megaminx is **not fully solved**. Specific *lower bounds* on God's number
(currently 45 face turns) are known; tight upper bounds remain
elusive. **[verify]** the current authoritative best bound.

## Consensus on optimal play

- **Use layer-by-layer methods adapted for 12 faces** — the standard speed-solving approach solves the top face and top layer first, then proceeds layer by layer to the bottom, using F2L (first two layers) and OLL/PLL analogues adapted for pentagonal faces.
- **Learn commutators for edge and corner insertion** — the Megaminx has the same piece types as the Rubik's Cube (corners, edges, centres) and the same commutator/conjugate technique for inserting a piece without disturbing already-solved pieces; the pattern is the same, just more of it.
- **Solve "star" on the first face first** — the first face plus its five adjacent edge pieces (the "star" pattern) is the natural starting sub-goal; getting the star right sets up the entire first layer.
- **Last layer algorithms: carry over cube knowledge** — the OLL and PLL algorithms for the Rubik's Cube last layer translate to Megaminx last-layer cases; a speed-cuber with advanced cube knowledge can apply the same patterns with adapted move sequences.
- **For speedsolving: learn fewer algorithms, use insertions** — because the Megaminx has more cases than the cube, beginners solve it with longer human-friendly methods; competitive solvers use full-algorithm sets, but efficient insertions reduce move count.

## Engines & current best play

- **Strongest known program(s):** Optimal solvers exist but are computationally expensive given the ~10^68 state space; no standard named public optimal solver for Megaminx is widely known.
- **Strength:** Near-optimal solving for practical scrambles; God's number not yet established.
- **Where the proof / tablebase lives (if solved):** Not fully solved; lower bound 45 face turns is known; exact God's number unknown.
- **Notes:** State space (~10^68) vastly exceeds the Rubik's Cube (~4.3 × 10^19); a complete BFS/tablebase approach is computationally infeasible with current resources.

## Complexity

Astronomically larger than the Rubik's Cube state space.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Megaminx) ([archive](http://web.archive.org/web/20260504110719/https://en.wikipedia.org/wiki/Megaminx))
- [Rokicki *et al.* (2017). *The diameter of the Rubik's cube group is twenty*.](../references.md#rokicki2014) (related)

## See also

- [Rubik's Cube](rubiks-cube.md) · [Pocket Cube](pocket-cube.md) · [Pyraminx](pyraminx.md) · [Skewb](skewb.md)
- Lexicon: [God's number](../lexicon/README.md#gods-number)
