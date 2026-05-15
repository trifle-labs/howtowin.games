# Shannon switching game

> An abstract graph game, completely solved by matroid theory — the winner is
> decided by the graph's structure before play begins.

| Field | Value |
|-------|-------|
| Also known as | The switching game |
| Players | 2 (asymmetric roles: "Short" and "Cut") |
| Type | Partisan connection game on a graph |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Strongly solved |
| **Game-theoretic value** | Determined by the graph: Short wins, Cut wins, or it depends on who moves first |
| Year solved | 1964 |
| Solved by | Alfred Lehman |
| State-space complexity | Depends on the graph |
| Game-tree complexity | Depends on the graph |

## Description

Played on a graph with two distinguished vertices, A and B. One player, **Short**,
"secures" edges; the other, **Cut**, deletes edges. Short wins by securing a
path of edges connecting A and B; Cut wins by deleting enough edges that no such
path can exist. (Bridg-it is the special case where the graph is a grid.)

## Solution status

The Shannon switching game is **strongly solved** by
[Lehman (1964)](../references.md#lehman1964), who gave a complete
characterisation in terms of **matroids / spanning trees**:

- **Short wins as second player** (i.e. whoever the graph favours, regardless of
  who moves) if and only if the graph contains **two edge-disjoint trees** each
  connecting A and B — equivalently, the relevant matroid has the right
  structure.
- **Cut wins as second player** if Short cannot even win going first.
- Otherwise the first player wins.

So the outcome is decided by a graph-theoretic property computable in
polynomial time, and an explicit optimal strategy follows from the two
edge-disjoint trees. This is one of the cleanest "completely solved by pure
mathematics" results in game theory.

## Consensus on optimal play

- **Check the two edge-disjoint spanning trees condition** — before playing, determine whether the graph contains two edge-disjoint trees (spanning trees) each connecting A to B; if yes, Short wins as second player.
- **Short's strategy: maintain a spanning tree** — Short should always claim the edge that "saves" one of their two target spanning trees; whenever Cut deletes an edge from one tree, Short claims an edge that rebuilds the other.
- **Cut's strategy: target the bridge** — Cut wins by finding a "bridge" edge (one whose deletion disconnects A from B) and deleting it; if no such bridge exists in the secured subgraph, Cut must try to prevent Short from completing a path.
- **The outcome is determined before play** — since the winner is decided purely by graph structure (a polynomial-time check), the strategic value of the game is entirely in computing the matroid condition, not in tactical play.
- **Bridg-it is the canonical instance** — the special case on a grid graph (Bridg-it) is the most studied; Short wins as second player by the pairing strategy on the symmetric grid.

## Engines & current best play

- **Strongest known program(s):** No competitive engine needed — optimal play is determined by a polynomial-time matroid computation.
- **Strength:** Perfect play by any program that computes the two edge-disjoint spanning trees and executes the corresponding maintenance strategy.
- **Where the proof / tablebase lives (if solved):** [Lehman (1964)](../references.md#lehman1964); [Berlekamp, Conway & Guy (2001)](../references.md#bcg2001)
- **Notes:** One of the cleanest "solved by pure mathematics" results in combinatorial game theory; no search is needed.

## Complexity

The deciding condition and an optimal strategy are computable in polynomial time
in the size of the graph.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Shannon_switching_game) ([archive](http://web.archive.org/web/20260107194010/https://en.wikipedia.org/wiki/Shannon_switching_game))
- [Lehman, A. (1964). *A solution of the Shannon switching game*.](../references.md#lehman1964)
- [Berlekamp, Conway & Guy (2001). *Winning Ways for Your Mathematical Plays*.](../references.md#bcg2001)

## See also

- [Bridg-it](bridg-it.md) · [Hex](hex.md)
- Lexicon: [strongly solved](../lexicon/README.md#strongly-solved) · [pairing strategy](../lexicon/README.md#pairing-strategy)
