# Slitherlink

> Loop-drawing logic puzzle — NP-complete in general.

| Field | Value |
|-------|-------|
| Also known as | スリザーリンク, Loop the Loop |
| Players | 1 |
| Type | Solo logic puzzle |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | NP-complete in general |
| **Game-theoretic value** | Per-puzzle (unique solution by convention) |
| Year solved | 2000s |
| Solved by | Yato & Seta and others |
| State-space complexity | Up to exponential in grid size |
| Game-tree complexity | NP-complete |

## Description

Slitherlink (Nikoli, 1989) is a logic puzzle in which the solver draws a
single, simple closed loop on the edges of a rectangular dot lattice. Numeric
clues in some cells indicate how many of the cell's four edges are part of
the loop.

## Rules

1. Board: rectangular grid of cells. Each cell may carry a clue 0, 1, 2, or 3.
2. The solver draws a single closed loop along grid edges so that:
   - The loop is **simple** (no branching, no self-crossing).
   - Every clued cell has **exactly that many** of its four bordering edges
     belonging to the loop.
3. Edges not in the loop may be either drawn as crosses (deductions) or left
   blank.
4. A well-formed puzzle has a unique solution.

## Solution status

The general Slitherlink decision problem is **NP-complete** (Yato & Seta
2003 and others). Standard Nikoli puzzles are tractable by hand or SAT
solvers in negligible time.

## Consensus on optimal play

- **Clue-zero cells are fully blocked** — mark all four edges of any 0-cell as "no edge" immediately; this cascades into adjacent cells.
- **Clue-three cells are nearly complete** — three of four edges must be used; the single missing edge is heavily constrained by neighbours, so resolve these early.
- **Corner and edge clues are more constrained** — a clue-2 cell in a grid corner has only two possible shapes; the forced pattern often propagates far.
- **Parity rule at junctions** — every dot on the grid must have an even number (0 or 2) of loop segments meeting it; violations prune branches early.
- **Avoid early loops** — adding a closing edge that would form a proper sub-loop before all clues are satisfied is immediately illegal; use this to block otherwise ambiguous branches.
- **Region-based analysis** — consider which cells are inside vs. outside the loop (Jordan curve theorem); when a partial loop already divides the grid, propagate inside/outside labels to force remaining edges.

## Engines & current best play

- **Strongest known program(s):** No game-specific public engine known to the cataloguer. Puzzles are routinely solved by SAT-based and constraint-propagation solvers (e.g., via [Ludii](https://ludii.games/) or custom Python scripts).
- **Strength:** SAT solvers handle standard Nikoli puzzles in milliseconds.
- **Where the proof / tablebase lives (if solved):** NP-completeness proof — Yato & Seta (2003).
- **Notes:** As a single-player puzzle, "engine strength" means solver speed; human experts solve medium-difficulty puzzles in minutes using the heuristics above.

## Complexity

NP-complete in general.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Slitherlink)
- [Slitherlink is NP-complete.](../references.md#slitherlink-np)

## See also

- [Sudoku](sudoku.md) · [Hashiwokakero](hashiwokakero.md) · [Nonograms](nonograms.md)
- Lexicon: [NP-completeness](../lexicon/README.md#np-completeness)
