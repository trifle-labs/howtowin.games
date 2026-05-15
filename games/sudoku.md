# Sudoku

> Number-placement puzzle — generalised solving is NP-complete.

| Field | Value |
|-------|-------|
| Also known as | Number Place, 数独 |
| Players | 1 |
| Type | Solo logic puzzle |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Per-instance polynomial for 9×9; n×n is NP-complete |
| **Game-theoretic value** | Per-puzzle (typically unique solution by convention) |
| Year solved | 2003 (NP-completeness for n×n) |
| Solved by | Yato & Seta |
| State-space complexity | ~6.67×10^21 valid 9×9 grids |
| Game-tree complexity | NP-complete (n²×n²) |
| **Playable** | sudoku |

## Description

Sudoku is a number-placement puzzle on a 9×9 grid divided into nine 3×3
sub-grids. The solver fills empty cells with digits 1–9 so each row, column,
and sub-grid contains each digit exactly once. Yato & Seta (2003) proved
that the general n²×n² version is **NP-complete**.

## Rules

1. Board: 9×9 grid divided into nine 3×3 sub-grids. Some cells start with
   given digits.
2. The solver fills each empty cell with a digit 1–9.
3. Constraints: each row, each column, and each 3×3 sub-grid must contain
   every digit 1–9 exactly once.
4. A well-formed Sudoku puzzle has a **unique** solution; the solver must
   find it.

## Solution status

For the standard 9×9 board every puzzle can be solved by exact-cover search
(e.g., Knuth's Algorithm X / dancing links) in tiny time. The n²×n²
generalisation is **NP-complete** (Yato & Seta 2003).

## Consensus on optimal play

- **Single-candidate (naked single) first** — if a cell has only one remaining possible digit, fill it immediately; these cascades often resolve large portions of the puzzle without guessing.
- **Hidden singles reveal forced placements** — if a digit can go in only one cell within a row, column, or box, place it there even if that cell has multiple candidates; scan all three scopes for each digit.
- **Naked and hidden pairs/triples prune candidates** — two cells in a unit that share exactly two candidates exclude those digits from all other cells in the unit; applying this before guessing usually avoids backtracking.
- **X-Wing and swordfish eliminate distant candidates** — when a candidate digit appears in exactly two rows' same two columns (X-Wing), it can be removed from those columns' other rows; swordfish extends this to three rows/columns.
- **Colouring (chaining) handles medium difficulty** — assign conjugate pairs of the same candidate alternating colours; if both same-colour instances appear in the same unit, that colour is false and its cells can be eliminated.
- **Backtracking (guessing) is the universal fallback** — for hardest puzzles, pick the most constrained cell, guess a value, propagate constraints, and backtrack on contradiction; computers use this via dancing-links Algorithm X.

## Engines & current best play

- **Strongest known program(s):** Knuth's Algorithm X / dancing links — exact-cover backtracking solver; widely implemented (e.g., in Python's `dlx` libraries).
- **Strength:** Solves any valid 9×9 puzzle in milliseconds; super-human on all published puzzle sets.
- **Where the proof / tablebase lives (if solved):** NP-completeness of n²×n² Sudoku: Yato & Seta (2003), [../references.md#selman-sudoku2003](../references.md#selman-sudoku2003).
- **Notes:** All ~6.67×10²¹ valid 9×9 completions were enumerated by Felgenhauer & Jarvis (2005); a minimum of 17 clues is required for a unique solution (McGuire et al., 2012).

## Complexity

NP-complete in the generalised setting.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Sudoku)
- [Yato & Seta (2003). *Complexity and Completeness of Finding Another Solution and its Application to Puzzles*.](../references.md#selman-sudoku2003)

## See also

- [Slitherlink](slitherlink.md) · [Hashiwokakero](hashiwokakero.md) · [Nonograms](nonograms.md) · [Lights Out](lights-out.md)
- Lexicon: [NP-completeness](../lexicon/README.md#np-completeness)
