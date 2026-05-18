# Nonograms

> Grid puzzles where you shade cells based on number clues to reveal a hidden picture. General case is NP-complete.

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

Nonograms (also called Picross, Hanjie, or Griddlers) are grid puzzles where each row and column has a number clue telling you the lengths of consecutive shaded blocks in that line. You shade cells so that every row's shaded blocks match its clue, and every column's shaded blocks match its clue. The shaded cells form a hidden picture. The general problem of solving one from scratch is **NP-complete** (very hard in the worst case).

## Rules

1. Board: a rectangular grid of cells.
2. Each row and each column has a sequence of positive numbers (the **clue**) that tells you the lengths of consecutive shaded blocks in that row or column, in order from left to right or top to bottom.
3. Different shaded blocks in the same row or column must be separated by at least one unshaded cell.
4. The solver shades cells so that every row clue and every column clue is satisfied.
5. A well-made puzzle has exactly one correct solution.

## Solution status

The general decision problem is **NP-complete** (Ueda & Nagao 1996).
SAT/ILP solvers handle typical Nikoli-sized puzzles instantly.

## Consensus on optimal play

- **Use overlap deduction first** — for each clue, figure out the leftmost and rightmost possible position for each block. Cells that are shaded in both positions are definitely shaded; cells that are empty in both are definitely empty.
- **Cross-check rows against columns** — after you figure out some cells in a row, use those fixed cells to narrow down the intersecting columns. Repeat back and forth until no new deductions appear.
- **Start with the longest blocks** — clues with one big block leave little room for guesswork. Those cells are almost completely certain and help anchor the rest of the puzzle.
- **Use the edges** — blocks that touch the board edge have no uncertainty on one side. This can pin them down exactly even when the middle of the board is still unclear.
- **Guess only as a last resort** — well-designed puzzles can be solved by logic alone. If you get stuck, one careful guess-and-check branch is usually enough to get going again.

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
