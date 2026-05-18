# Generalized Geography

> A word game played on a network of connected points. Figuring out who wins is extremely hard for large networks.

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

The real-life version is the children's game where players take turns naming places — each new place must start with the last letter of the previous one, and you cannot repeat a place already used. In the general version, this is played on a directed graph (a network of points connected by arrows). A token sits on a starting point. Players take turns moving the token along an arrow to a new point that has not been visited before. The player who cannot move loses.

## Rules

1. A directed graph (a network of points connected by one-way arrows) and a starting point are given.
2. A token starts at the starting point. Players take turns moving the token along an arrow to a point that has not been visited before.
3. The player who cannot move loses.

Variants:

- **Vertex Geography** — once a point has been visited, it cannot be visited again.
- **Edge Geography** — once an arrow has been traveled, it cannot be used again.

## Solution status

Solved as a theory. [Schaefer (1978)](../references.md#schaefer1978) proved
**Generalized Geography is PSPACE-complete** — given a graph and start vertex,
deciding who wins is hard for polynomial space, and it is the canonical reduction
target used to prove other games PSPACE-hard (Hex, Othello, Amazons, many
others). The undirected variant differs sharply: see
[Undirected Vertex Geography](undirected-vertex-geography.md).

## Consensus on optimal play

- **Move to points with the fewest outgoing arrows** — limiting the opponent's future options is the key idea. A point with only one outgoing arrow is like a trap door for the opponent.
- **Force the opponent into a dead-end path** — count how long the available chains of moves are. If you can steer into a path with an odd number of moves, the opponent will face the last move and lose.
- **On certain graphs, the first player loses if the starting point is matched in every possible pairing** — for special types of graphs (bipartite graphs), checking the maximum matching tells you the winner.
- **Cut points are key** — moving through a point that connects two otherwise separate parts of the graph seals off that part. Figure out which player benefits from that part being cut off before committing.
- **For small graphs, work backward from the end** — start from positions where no moves are possible (a loss for the player whose turn it is) and mark every reachable position as a win or loss.

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
