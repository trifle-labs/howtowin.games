# Generalized Geography

> The textbook PSPACE-complete game — a directed-graph reachability game whose
> complexity is the gold standard for "solved games are hard."

| Field | Value |
|-------|-------|
| Also known as | Geography, Directed Vertex Geography, Edge Geography |
| Players | 2 |
| Type | Impartial graph game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Strongly solved as a theory (decision problem PSPACE-complete) |
| **Game-theoretic value** | Position-dependent |
| Year solved | 1978 (PSPACE-completeness) |
| Solved by | Schaefer |
| State-space complexity | Exponential in graph size |
| Game-tree complexity | Exponential |
| **Playable** | geography |

## Description

The motivating example is the children's game in which players alternate
naming places, each starting with the last letter of the previous one; "places
already used" are forbidden. Generalised on a directed graph, this becomes the
standard model for hardness reductions in combinatorial game theory.

## Rules

1. A directed graph G and a starting vertex v are given.
2. A token starts at v. Players alternate moving the token along a directed
   edge to an unvisited vertex.
3. The player unable to move loses (normal play).

Variants:

- **Vertex Geography** — once a vertex is visited, it cannot be re-entered.
- **Edge Geography** — once an edge is traversed, it cannot be re-used.

## Solution status

Solved as a theory. [Schaefer (1978)](../references.md#schaefer1978) proved
**Generalized Geography is PSPACE-complete** — given a graph and start vertex,
deciding who wins is hard for polynomial space, and it is the canonical reduction
target used to prove other games PSPACE-hard (Hex, Othello, Amazons, many
others). The undirected variant differs sharply: see
[Undirected Vertex Geography](undirected-vertex-geography.md).

## Consensus on optimal play

- **Move to vertices with the fewest outgoing edges** — restricting the opponent's future options is the core heuristic; a vertex with degree 1 is essentially a trap to push the opponent toward.
- **Force the opponent into a dead-end path** — count the length of reachable chains; if you can steer into a path of odd length, the opponent faces the last move and loses.
- **Bipartite structure is decisive** — on bipartite directed graphs, the first player loses if and only if the starting vertex is matched in every maximum matching; checking this is the efficient algorithm for those cases.
- **Cut vertices are key resources** — moving through a cut vertex seals off a subgraph; identify which player benefits from that subgraph being isolated before committing.
- **For small instances, retrograde analysis is the exact solver** — work backwards from positions with no moves (losses for the mover) to classify every reachable position as W or L.

## Engines & current best play

- **Strongest known program(s):** No game-specific public engine known to the cataloguer. Any retrograde-analysis tool on directed graphs solves specific instances.
- **Strength:** Not benchmarked (PSPACE-complete in general; polynomial for bipartite graphs).
- **Where the proof / tablebase lives (if solved):** [Schaefer (1978)](../references.md#schaefer1978) — proof of PSPACE-completeness; no universal tablebase possible.
- **Notes:** Geography is primarily a complexity-theory benchmark; for any fixed small graph, position evaluation is fast via retrograde analysis.

## Complexity

PSPACE-complete in the size of the input graph.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Generalized_geography) ([archive](http://web.archive.org/web/20251116130356/https://en.wikipedia.org/wiki/Generalized_geography))
- [Schaefer (1978). *On the complexity of some two-person perfect-information games*.](../references.md#schaefer1978)
- [Lichtenstein & Sipser (1980). *GO is polynomial-space hard*.](../references.md#lichtenstein-sipser1980)

## See also

- [Undirected Vertex Geography](undirected-vertex-geography.md) · [Node Kayles](node-kayles.md) · [Shannon switching game](shannon-switching-game.md)
- Lexicon: [PSPACE-complete / EXPTIME-complete](../lexicon/README.md#pspace-complete--exptime-complete)
