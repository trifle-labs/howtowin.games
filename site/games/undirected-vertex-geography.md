# Undirected Vertex Geography

> A game where players move a token along the edges of a graph without revisiting vertices. It has been fully solved using matching theory.

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
| **Playable** | undirected-vertex-geography |

## Description

This is the undirected version of Generalised Geography. While the directed version is extremely hard for computers to solve in general, the undirected version has an elegant solution using a mathematical concept called maximum matching.

## Rules

1. An undirected graph (a set of points connected by lines) and a starting point are given.
2. A token starts at the starting point. Players take turns moving the token along a line to a point that has not been visited before.
3. The player who cannot move loses.

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

- **Check if the starting point is in every possible maximum matching** — compute the largest possible pairing of connected points (called a maximum matching). If the starting point is in every possible maximum matching, the first player wins. If some maximum matching leaves the starting point out, the second player wins.
- **First player: always move along a matched edge** — pick one maximum matching that includes the starting point. On every turn, move the token from its current point to the point it is paired with in that matching. This guarantees a win.
- **Second player: avoid matched edges when possible** — if the starting point is not in all maximum matchings, respond to each first player move by staying on the matching path. This ensures you always have a safe move.
- **The entire game is decided by one calculation** — whether the first or second player wins depends entirely on a single matching computation. No need to search through game states.
- **Direction matters enormously** — in the directed version (edges have arrows), the same problem is extremely hard (PSPACE-complete). Simply removing the direction makes it easy to solve, making this a classic example of how edge direction can flip a game's complexity.

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
