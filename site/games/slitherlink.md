# Slitherlink

> A logic puzzle where you draw a single closed loop based on number clues. General puzzles are NP-complete.

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
| **Playable** | slitherlink |

## Description

Slitherlink (Nikoli, 1989) is a logic puzzle in which the solver draws a single closed loop along the edges of a rectangular grid of dots. Numbers in some cells tell you how many of that cell's four edges are part of the loop.

## Rules

1. Board: a rectangular grid of cells. Each cell may contain a clue number 0, 1, 2, or 3.
2. The solver draws a single closed loop along grid edges so that:
   - The loop does not branch or cross itself.
   - Every cell with a number has exactly that many of its four edges used by the loop.
3. Edges not part of the loop may be marked with X's or left blank.
4. A well-formed puzzle has exactly one correct solution.

## Solution status

The general Slitherlink decision problem is **NP-complete** (Yato & Seta
2003 and others). Standard Nikoli puzzles are tractable by hand or SAT
solvers in negligible time.

## Consensus on optimal play

- **Zero clues block all edges** — immediately mark all four edges of any cell with a 0 as "not used." This often forces decisions in neighboring cells.
- **Three clues are nearly complete** — three of four edges must be used, and the one missing edge is heavily restricted by neighbors. Solve these cells early.
- **Corner and edge clues have fewer possibilities** — a cell with clue 2 in a corner has only two possible edge patterns. The forced shape often affects many nearby cells.
- **Even junctions rule** — every dot on the grid must have either 0 or 2 loop lines meeting at it. If a dot already has 1 line, you must add exactly 1 more. Use this to eliminate wrong possibilities.
- **Avoid making small loops too early** — forming a closed loop before all clues are satisfied is illegal. Use this rule to rule out otherwise ambiguous branches.
- **Think about inside vs. outside** — once part of the loop is drawn, it divides the grid into inside and outside areas. Use this to determine which remaining edges are possible.

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
