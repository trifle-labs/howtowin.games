# Minesweeper

> A logic puzzle where you find hidden mines using number clues. The figuring-it-out part is NP-complete.

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

Minesweeper is the classic computer logic puzzle: when you click a cell, a number appears telling you how many mines are in the eight cells around it. You must mark all the mines without clicking on one. Kaye (2000) proved that figuring out whether a partly-revealed board can even be solved logically is NP-complete (a very hard class of problems).

## Rules

1. Board: rectangular grid of hidden cells; a fixed number of mines are placed randomly.
2. On a turn the solver clicks one cell:
   - If the cell contains a mine, the game ends in loss.
   - Otherwise it reveals a number 0–8 telling how many mines are in the eight cells around it; if the number is 0 the cell automatically opens all of its surrounding cells.
3. The solver may **flag** a cell as a suspected mine (just a marker, no consequence).
4. The puzzle is solved when every non-mine cell has been revealed.

## Solution status

The pure inference subproblem (deciding whether a partial board has any
consistent mine arrangement) is **NP-complete**. Practical games often
require guesses on configurations where inference cannot decide.

## Consensus on optimal play

- **Use logic before guessing** — if a "3" has exactly 3 unrevealed cells next to it, all three must be mines; if a "1" has exactly 1 unrevealed cell next to it, that cell is a mine. Never guess when deduction is possible.
- **Compare overlapping clues** — if one number's area of effect is fully inside another's, the leftover cells give you extra information. For example, if cell A and cell B both look over a shared area plus some unique cells, the difference tells you about the unique ones.
- **When forced to guess, pick the cell least likely to be a mine** — figure out approximate mine chances for unclear regions using how many mines are left and which cells are still hidden; open the cell with the smallest chance of holding a mine.
- **Start in the middle for the first click** — most versions make the first click safe anyway; open near the centre to get a big cleared area and reveal many cells at once.
- **Track the total mine count** — the number of mines left equals the total mines minus the ones you have flagged. When that number matches the number of unrevealed cells, every remaining cell is a mine — flag them all.
- **Guessing is sometimes unavoidable** — about 1–3% of standard Expert games require a 50/50 guess even with perfect play; accept this and pick the lower-risk cell when it happens.

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
