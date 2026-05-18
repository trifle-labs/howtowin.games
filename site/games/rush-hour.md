# Rush Hour

> A sliding-car traffic puzzle. The general version (on any size board) is PSPACE-complete (very hard to solve).

| Field | Value |
|-------|-------|
| Also known as | Rush Hour |
| Players | 1 |
| Type | Solo sliding-block puzzle |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Generalised n×n version PSPACE-complete (Flake & Baum, 2002) |
| **Game-theoretic value** | Per-puzzle |
| Year solved | 2002 (complexity result) |
| Solved by | Gary William Flake, Eric B. Baum |
| State-space complexity | Up to exponential in board size |
| Game-tree complexity | PSPACE-complete in general |
| **Playable** | rush-hour |

## Description

Rush Hour (Nob Yoshigahara, about 1996) is a 6x6 sliding-car puzzle. Cars (2 cells long) and trucks (3 cells long) can be slid along the direction they are facing. The goal is to free the red car by sliding it out through the right edge. The general version (on any size board) is **PSPACE-complete** (very hard to solve in the worst case).

## Rules

1. Board: 6x6 grid with the right side open at one row (the exit row).
2. Pieces are cars (2 cells long) and trucks (3 cells long), each placed either horizontally or vertically.
3. On each move, you slide one piece any number of cells along its long direction, but only through empty cells.
4. You win when the **red car** (2 cells long, horizontal, on the exit row) drives out through the right edge of the board.

## Solution status

Generalised n×n Rush Hour is **PSPACE-complete** (Flake & Baum 2002 — the
"Generalised Rush Hour Logic" reduction). The classical 6×6 puzzles are
solved trivially by BFS.

## Consensus on optimal play

- **Breadth-first search (BFS) finds the shortest solution** — by exploring all possible moves from the start, spreading out evenly, you find the minimum number of moves. The 6x6 board has at most a few thousand possible states per puzzle.
- **Clear the exit row first** — the red car needs to go out the right side. Find which cars are blocking the exit row and plan to move them out of the way first.
- **Work backward from the goal** — if car A blocks the red car, find what blocks A, and what blocks those blockers. This chain reveals the right order of moves.
- **One slide can cover many cells** — cars can slide as far as open space allows in a single move. Prefer one big slide over several small shuffles.
- **Do not trap your own exit** — moving one car to clear a path can accidentally block another. Think ahead about all the downstream effects before committing.

## Engines & current best play

- **Strongest known program(s):** BFS or A* solvers for 6×6 instances (e.g. open-source implementations in most intro-AI courses).
- **Strength:** Optimal (minimum moves) for all standard 6×6 puzzles; solves any instance in milliseconds.
- **Where the proof / tablebase lives (if solved):** Complexity result: [Flake & Baum (2002)](../references.md#demaine-rushhour2002); [Wikipedia](https://en.wikipedia.org/wiki/Rush_Hour_(puzzle))
- **Notes:** The commercial 6×6 puzzles are easy for computers; PSPACE-completeness applies only to the generalised n×n problem.

## Complexity

PSPACE-complete in general.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Rush_Hour_(puzzle))
- [Flake & Baum (2002). *Rush Hour is PSPACE-complete*.](../references.md#demaine-rushhour2002)

## See also

- [Klotski](klotski.md) · [Sokoban](sokoban.md) · [Tower of Hanoi](tower-of-hanoi.md)
- Lexicon: [PSPACE](../lexicon/README.md#pspace)
