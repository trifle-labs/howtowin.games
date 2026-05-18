# Megaminx

> A 12-sided twist puzzle like a Rubik's Cube but much larger. The hardest position has not yet been determined.

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

The Megaminx is a 12-sided (dodecahedral) version of the Rubik's Cube: 12 five-sided faces, 30 edges, 20 corners. Its state space is roughly 10^68 positions — many steps beyond the Rubik's Cube — so the longest shortest solution (God's number) has not been determined.

## Rules

1. Puzzle: a 12-sided (dodecahedron) shape with each face rotatable by 72 degrees.
2. On a move the solver rotates one face by 72 degrees clockwise or counterclockwise.
3. The puzzle is solved when every face shows a single color.

## Solution status

Megaminx is **not fully solved**. Specific *lower bounds* on God's number
(currently 45 face turns) are known; tight upper bounds remain
elusive. **[verify]** the current authoritative best bound.

## Consensus on optimal play

- **Use layer-by-layer methods adapted for 12 faces** — the standard speed-solving approach solves the top face and top layer first, then proceeds layer by layer to the bottom, using methods adapted for five-sided faces.
- **Learn commutators for edge and corner insertion** — the Megaminx has the same piece types as the Rubik's Cube (corners, edges, centers) and the same technique for inserting a piece without disturbing already-solved pieces. The pattern is the same, just more of it.
- **Solve the "star" on the first face first** — the first face plus its five neighboring edge pieces (the "star" pattern) is the natural starting sub-goal. Getting the star right sets up the entire first layer.
- **Last layer algorithms: carry over cube knowledge** — the algorithms for the Rubik's Cube last layer translate to Megaminx last-layer cases. A speed-solver with advanced cube knowledge can apply the same patterns with adapted move sequences.
- **For speed-solving: learn fewer algorithms, use insertions** — because the Megaminx has more cases than the cube, beginners solve it with longer, easier-to-learn methods. Competitive solvers use full algorithm sets, but efficient insertions reduce move count.

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
