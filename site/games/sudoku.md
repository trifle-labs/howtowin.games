# Sudoku

> A number-placement puzzle where the solver fills a 9x9 grid so each row, column, and 3x3 box contains the digits 1-9 exactly once.

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

Sudoku is a number-placement puzzle played on a 9x9 grid divided into nine 3x3 boxes. The solver fills empty cells with digits 1 through 9 so that each row, each column, and each 3x3 box contains every digit exactly once. Mathematicians have proved that larger versions of Sudoku (with n x n boxes) belong to a class of problems called NP-complete, meaning they are very hard for a computer to solve in general.

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

- **Fill in forced cells first (naked singles)** — if a cell has only one possible digit left, write it in right away. These forced moves often unlock large parts of the puzzle without any guessing.
- **Look for hidden singles** — if a digit can only go in one cell within a row, column, or box, place it there even if that cell has other candidates. Check every row, column, and box for each digit.
- **Use pairs and triples to eliminate candidates** — if two cells in the same row, column, or box share exactly the same two possible digits, those digits cannot appear anywhere else in that row, column, or box. Use this to narrow down possibilities before guessing.
- **X-Wing and swordfish patterns** — when a candidate digit appears in exactly two rows at the same two columns, it can be removed from those columns in other rows (this is called an X-Wing). Swordfish extends this to three rows and columns.
- **Coloring (chaining) for medium difficulty** — mark cells that share a candidate with alternating colors. If the same color appears twice in the same row, column, or box, that color's cells can be eliminated.
- **Guessing is the last resort** — for the hardest puzzles, pick the most constrained cell, guess a value, and see if it leads to a contradiction. Computers use this approach with an algorithm called dancing-links.

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
