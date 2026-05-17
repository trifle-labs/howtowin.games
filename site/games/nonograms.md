# Nonograms

> Picture-by-numbers grid puzzles — NP-complete in general.

| Field | Value |
|-------|-------|
| Also known as | Picross, Hanjie, Griddlers |
| Players | 1 |
| Type | Solo logic puzzle |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | NP-complete in general |
| **Game-theoretic value** | Per-puzzle (unique solution by convention) |
| Year solved | 1996 (Ueda & Nagao NP-completeness) |
| Solved by | Ueda & Nagao |
| State-space complexity | Up to exponential in grid size |
| Game-tree complexity | NP-complete |
| **Playable** | nonograms |

## Description

Nonograms (Non Ishida / James Dalgety, 1980s) are grid puzzles whose row and
column clues are sequences of run-lengths. The solver shades cells so each
row's shaded runs match the row clue, and each column's shaded runs match
the column clue. The general problem is **NP-complete**.

## Rules

1. Board: rectangular grid of cells.
2. Each row and each column has a sequence of positive integers (the
   **clue**) listing the lengths of consecutive shaded runs in that row or
   column, in order.
3. Different runs in the same row or column must be separated by at least one
   unshaded cell.
4. The solver shades a subset of cells so that every row clue and every
   column clue is satisfied.
5. A well-formed puzzle has a unique solution.

## Solution status

The general decision problem is **NP-complete** (Ueda & Nagao 1996).
SAT/ILP solvers handle typical Nikoli-sized puzzles instantly.

## Consensus on optimal play

- **Overlap (interval) deduction first** — for each clue, find the leftmost and rightmost placement of each run; cells covered by both placements are definitely shaded; gaps between them are definitely empty.
- **Cross-reference rows against columns** — after deducing cells in a row, use those fixed cells to constrain the intersecting columns, and iterate until no new deductions arise.
- **Start with the longest runs** — clues with a single large run leave little slack; their cells are nearly all deterministic and anchor the rest of the grid.
- **Use edge constraints** — runs that touch a board edge have no offset uncertainty on one side; this can pin them precisely even when the interior is ambiguous.
- **Backtrack sparingly and only on contradiction** — well-formed Nikoli puzzles are uniquely solvable by logic alone; if constraint propagation stalls, a single hypothesis-and-test branch is usually enough.

## Engines & current best play

- **Strongest known program(s):** Various open-source solvers (e.g., Jan Wolter's JavaScript solver, pbnsolve) use constraint propagation + backtracking.
- **Strength:** Solves all well-formed Nikoli-sized puzzles (up to ~50×50) instantly; handles larger puzzles with minimal backtracking.
- **Where the proof / tablebase lives (if solved):** [Wikipedia](https://en.wikipedia.org/wiki/Nonogram); NP-completeness proof: Ueda & Nagao (1996).
- **Notes:** NP-completeness applies to the general decision problem; typical published puzzles are much easier in practice.

## Complexity

NP-complete in general.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Nonogram)
- [Yato & Seta (2003). *Complexity and Completeness of Finding Another Solution and its Application to Puzzles*.](../references.md#selman-sudoku2003)

## See also

- [Sudoku](sudoku.md) · [Slitherlink](slitherlink.md) · [Hashiwokakero](hashiwokakero.md)
- Lexicon: [NP-completeness](../lexicon/README.md#np-completeness)
