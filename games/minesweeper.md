# Minesweeper

> Logic-deduction puzzle — inference problem is NP-complete.

| Field | Value |
|-------|-------|
| Also known as | Minesweeper |
| Players | 1 |
| Type | Solo logic puzzle |
| Perfect information | No (mine positions hidden) |
| Chance element | Yes (forced guesses on ambiguous configurations) |
| **Solution status** | Inference subproblem is NP-complete (Kaye, 2000) |
| **Game-theoretic value** | Per-puzzle |
| Year solved | 2000 (Minesweeper-consistency NP-completeness) |
| Solved by | Richard Kaye |
| State-space complexity | Up to exponential in board size |
| Game-tree complexity | NP-complete inference subproblem |
| **Playable** | minesweeper |

## Description

Minesweeper is the well-known Windows-era logic puzzle: numeric clues on
uncovered cells indicate the count of adjacent mines, and the solver must
flag all mines without detonating one. Kaye (2000) proved that the
**Minesweeper Consistency Problem** — given a partial board, can it be
completed consistently? — is **NP-complete**.

## Rules

1. Board: rectangular grid of hidden cells; a fixed number of mines are
   placed randomly.
2. On a turn the solver clicks one cell:
   - If the cell contains a mine, the game ends in loss.
   - Otherwise it reveals a number 0–8 indicating the count of adjacent
     mines; if the number is 0 the cell auto-clears its neighbours.
3. The solver may **flag** a cell as a suspected mine (no consequence except
   marker).
4. The puzzle is solved when every non-mine cell has been revealed.

## Solution status

The pure inference subproblem (deciding whether a partial board has any
consistent mine arrangement) is **NP-complete**. Practical games often
require guesses on configurations where inference cannot decide.

## Consensus on optimal play

- **Exhaust constraint propagation before guessing** — assign mines and safe cells using basic constraint logic (if a "3" has exactly 3 unrevealed neighbours, all are mines; if a "1" has exactly 1 unrevealed neighbour, it is a mine); never guess when deduction is possible.
- **Use set-difference deduction** — if the constraint of one cell is a subset of another's constraint region, the difference gives exact mine/safe information; e.g., if cells A and B each constrain a shared area plus unique cells, subtract to determine the unique cells.
- **When forced to guess, choose the cell with the lowest mine probability** — compute approximate mine probabilities for ambiguous regions using the remaining mine count and configuration; open the cell with the smallest chance of being a mine.
- **The corners and edges are riskier for opening guesses** — the first click is conventionally mine-free in most implementations; open in the centre area to maximise the auto-clear cascade and expose the most cells early.
- **Mine-counting constraints span the whole board** — the global mine count minus flagged mines limits how many mines remain; when the remaining mine count equals the number of unrevealed cells, all remaining cells are mines and can be flagged without further deduction.
- **Guessing is sometimes unavoidable** — in approximately 1–3% of standard Expert games, even perfect play requires a 50/50 guess to complete; accept this and choose the lower-probability cell systematically.

## Engines & current best play

- **Strongest known program(s):** Minesweeper bots combining complete constraint propagation with global probability analysis (e.g., Minesweeper Arbiter solvers used in international tournaments).
- **Strength:** Near-optimal; human-competitive on standard boards when guesses are avoided.
- **Where the proof / tablebase lives (if solved):** NP-completeness of the consistency problem: [Kaye (2000)](../references.md#kaye-minesweeper2000); per-puzzle solutions via constraint propagation.
- **Notes:** Tournament Minesweeper is timed; speed of constraint propagation matters more than perfect probability calculation; human world records exist for Expert, Intermediate, and Beginner boards.

## Complexity

Per-instance can be exponential; consistency is NP-complete.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Minesweeper_(video_game)) ([archive](http://web.archive.org/web/20260501224147/https://en.wikipedia.org/wiki/Minesweeper_(video_game)))
- [Kaye (2000). *Minesweeper is NP-complete*.](../references.md#kaye-minesweeper2000)

## See also

- [Sudoku](sudoku.md) · [Slitherlink](slitherlink.md) · [Hashiwokakero](hashiwokakero.md)
- Lexicon: [NP-completeness](../lexicon/README.md#np-completeness)
