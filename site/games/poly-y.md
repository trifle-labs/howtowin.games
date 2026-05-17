# Poly-Y

> A multi-cornered relative of Y — first-player win by strategy stealing.

| Field | Value |
|-------|-------|
| Also known as | Poly-Y |
| Players | 2 (or more, in some variants) |
| Type | Partisan connection game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Ultra-weakly solved |
| **Game-theoretic value** | First-player win |
| Year solved | 1975 (Schensted & Titus) |
| Solved by | Craige Schensted & Charles Titus |
| State-space complexity | Comparable to Hex / Y |
| Game-tree complexity | Large |
| **Playable** | poly-y |

## Description

Poly-Y generalises [Y](y.md) from a triangular board (three "corners") to
boards with **more corners** — pentagonal, hexagonal, and beyond. The winning
condition: own a connected group that **touches at least three different
corner regions** of the board. As in Y and Hex, draws are structurally
impossible.

## Rules

1. A polygonal board (pentagon, hexagon, etc.) tiled with hexagonal cells.
   The boundary is divided into "corner regions" — one for each corner of the
   outer polygon.
2. Players alternate placing one stone of their colour on any empty cell.
3. The first player to form a single connected group of their colour touching
   **at least three different corner regions** wins.
4. Draws are impossible (a parity/no-pair-of-disjoint-spans argument).

## Solution status

[Schensted & Titus (1975)](../references.md#schensted-titus1975) proved Poly-Y
cannot be drawn and that the **first player has a winning strategy** — exactly
as in Hex and Y, by the [strategy-stealing argument](../lexicon/README.md#strategy-stealing-argument).
The proof is non-constructive: ultra-weakly solved, no explicit strategy given.

## Consensus on optimal play

- **Aim for three corners from the start** — since you need to touch at least three distinct corner regions, plan your overall path to branch toward corners rather than building a single straight connection.
- **Multi-corner threats beat single-path play** — forcing the opponent to defend two or more of your potential corner-touches simultaneously is the key tactical objective.
- **Occupy the board centre to preserve routing flexibility** — central cells are equidistant to multiple corners; stones placed there can be incorporated into paths heading in any direction.
- **Block opponent corner approaches** — a group touching three corners wins immediately; defending one of their potential third corners is as urgent as advancing your own.
- **Draws are impossible** — unlike many board games, there is no need to consider a drawing defence; every game is decided, which simplifies the calculation of whether a position is winning or losing.

## Engines & current best play

- **Strongest known program(s):** No game-specific public engine known to the cataloguer. Playable in general-purpose abstract-game frameworks (e.g., [Ludii](https://ludii.games/)).
- **Strength:** Not benchmarked.
- **Notes:** The first-player win is proved by strategy-stealing; no explicit winning strategy is known.

## Complexity

Comparable in size to Hex and Y on equivalent boards.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Y_(game))
- [Schensted & Titus (1975). *Mudcrack Y and Poly-Y*.](../references.md#schensted-titus1975)

## See also

- [Y](y.md) · [Hex](hex.md) · [*Star](star.md)
- Lexicon: [ultra-weakly solved](../lexicon/README.md#ultra-weakly-solved) · [strategy-stealing argument](../lexicon/README.md#strategy-stealing-argument)
