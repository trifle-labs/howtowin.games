# Undirected Vertex Geography

> The polynomial-time twin of generalised Geography — solved by maximum
> matching.

| Field | Value |
|-------|-------|
| Also known as | UVG, Undirected Geography |
| Players | 2 |
| Type | Impartial graph game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Strongly solved (polynomial algorithm) |
| **Game-theoretic value** | First-player wins iff every maximum matching covers the start vertex |
| Year solved | 1993 |
| Solved by | Fraenkel, Scheinerman & Ullman |
| State-space complexity | Polynomial |
| Game-tree complexity | Polynomial via matching |

## Description

The undirected analogue of [Generalised Geography](geography.md). Where the
directed problem is PSPACE-complete, the undirected version yields to a
beautiful **matching argument**.

## Rules

1. An undirected graph G and a starting vertex v are given.
2. A token starts at v. Players alternate moving the token along an edge to an
   unvisited vertex.
3. The player unable to move loses (normal play).

## Solution status

Solved in polynomial time. The classical result (Fraenkel, Scheinerman &
Ullman, 1993; the matching-based characterisation is sometimes credited
earlier) is:

> The first player wins Undirected Vertex Geography from v iff **every** maximum
> matching of G covers v.

Equivalently, the first player wins iff v is *essential* for the maximum
matching. A winning strategy is to play along edges of a fixed maximum matching
that includes v.

## Consensus on optimal play

- **Determine whether the start vertex is essential to a maximum matching** — compute any maximum matching of the graph; if the start vertex v is covered by every maximum matching, the first player wins; if some maximum matching leaves v uncovered, the second player wins.
- **First player: always move along an edge of a fixed maximum matching** — pick a maximum matching M that covers v; on every turn, move the token along an M-edge to its M-matched partner vertex. This strategy guarantees a win by matching-theoretic argument.
- **Second player: stay off matching edges if possible** — as the second player (in a position where some maximum matching leaves v uncovered), respond to each first-player move by moving along a matching edge in your chosen maximum matching; this ensures you are never stranded.
- **The key structural insight** — the value of the game is entirely determined by a single maximum-matching computation; no game-tree search is needed beyond that O(V·E) calculation.
- **Edge direction is the complexity switch** — in the directed version (Generalised Geography) the same problem is PSPACE-complete; the undirected case is solvable in polynomial time, making UVG the standard textbook example of how undirecting edges can collapse game complexity.

## Engines & current best play

- **Strongest known program(s):** Any implementation of Edmonds' blossom maximum-matching algorithm — O(V·E) to determine the winner and optimal first move.
- **Strength:** Perfectly solved in polynomial time; no game-tree search needed.
- **Where the proof / tablebase lives (if solved):** Fraenkel, Scheinerman & Ullman (1993); referenced via [../references.md#schaefer1978](../references.md#schaefer1978) framework.
- **Notes:** UVG is the canonical example of a game whose complexity drops from PSPACE-complete (directed) to polynomial (undirected) simply by removing edge orientation.

## Complexity

Polynomial — a sharp contrast to the PSPACE-complete directed case. UVG is
often cited as the canonical example of how the **direction of edges** can
swing a game's complexity from P to PSPACE-complete.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Generalized_geography) ([archive](http://web.archive.org/web/20251116130356/https://en.wikipedia.org/wiki/Generalized_geography))
- [Schaefer (1978). *On the complexity of some two-person perfect-information games*.](../references.md#schaefer1978)

## See also

- [Generalized Geography](geography.md) · [Shannon switching game](shannon-switching-game.md)
- Lexicon: [PSPACE-complete / EXPTIME-complete](../lexicon/README.md#pspace-complete--exptime-complete)
