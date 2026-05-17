# Hashiwokakero

> Bridge-building logic puzzle — NP-complete.

| Field | Value |
|-------|-------|
| Also known as | Bridges, Hashi |
| Players | 1 |
| Type | Solo logic puzzle |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | NP-complete |
| **Game-theoretic value** | Per-puzzle (unique solution by convention) |
| Year solved | 2009 (NP-completeness) |
| Solved by | Andersson |
| State-space complexity | Up to exponential in island count |
| Game-tree complexity | NP-complete |
| **Playable** | hashiwokakero |

## Description

Hashiwokakero (橋をかけろ — "build bridges"; Nikoli, 1990) is a logic puzzle
on a grid of "islands" each labelled with a number. The solver draws straight
horizontal or vertical bridges connecting islands; each island's degree must
equal its number, the bridge graph must be connected, and bridges may not
cross.

## Rules

1. Board: rectangular grid with some cells marked as islands; each island
   carries a label 1–8.
2. The solver draws bridges between islands subject to:
   - Bridges run only **horizontally or vertically** between two distinct
     islands.
   - **At most two** bridges may connect the same pair of islands.
   - Bridges may not cross other bridges and may not pass through islands.
3. The number of bridge endpoints at each island must equal its label.
4. The graph formed by all bridges must be **connected** (single component).

## Solution status

Hashiwokakero is **NP-complete** (Andersson 2009 and others).

## Consensus on optimal play

- **Max-capacity islands first** — an island labelled 8 in the interior must have exactly two bridges in all four directions; resolve these immediately with no deduction required.
- **Force-fill constrained islands** — an island labelled N that has exactly N/2 neighbours (where each can bear at most 2 bridges) must use both bridges to every neighbour; identify and fill these early.
- **Avoid premature isolation** — never draw bridges that would create a connected component cut off from the rest of the grid (no further bridge can reach in or out); connectivity is the hardest global constraint to undo.
- **Use "must connect" logic near the boundary** — corner and edge islands have fewer neighbour directions; a label of 3 in a corner with only two neighbours forces at least one double-bridge.
- **Propagate through chains** — once one bridge is placed, update all islands in both the row and column, rechecking forced moves from high-label islands; many puzzles cascade-solve with pure propagation.
- **Branch only as a last resort** — well-designed Hashiwokakero puzzles are solvable without backtracking; if forced to guess, pick the choice that most constrains subsequent islands.

## Engines & current best play

- **Strongest known program(s):** Simon Tatham's Bridges solver (part of his Portable Puzzle Collection) — constraint propagation with backtracking.
- **Strength:** Solves all standard Nikoli-published puzzles (which are designed to have unique solutions deducible without backtracking).
- **Where the proof / tablebase lives (if solved):** NP-completeness proof: Andersson (2009); individual puzzles have unique solutions by construction.
- **Notes:** As a single-player puzzle, "solving" means finding the unique answer; the NP-hardness applies to arbitrary instances, not well-formed published puzzles.

## Complexity

NP-complete.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Hashiwokakero) ([archive](http://web.archive.org/web/20260425160159/https://en.wikipedia.org/wiki/Hashiwokakero))
- [Andersson. *Hashiwokakero is NP-complete*.](../references.md#slitherlink-np)
- [Yato & Seta (2003). *Complexity and Completeness of Finding Another Solution and its Application to Puzzles*.](../references.md#selman-sudoku2003)

## See also

- [Sudoku](sudoku.md) · [Slitherlink](slitherlink.md) · [Nonograms](nonograms.md)
- Lexicon: [NP-completeness](../lexicon/README.md#np-completeness)
