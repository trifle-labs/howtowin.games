# Rush Hour

> Sliding-car traffic puzzle — generalised version is PSPACE-complete.

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

## Description

Rush Hour (Nob Yoshigahara, ~1996) is a 6×6 sliding-car puzzle: cars and
trucks occupying 2 or 3 cells can be slid along their long axis; the goal is
to free the red car by sliding it to the right edge. The generalised version
is **PSPACE-complete** (Flake & Baum, 2002).

## Rules

1. Board: 6×6 grid with the right edge open at one row (the exit row).
2. Pieces are cars (length 2) and trucks (length 3), each placed horizontally
   or vertically.
3. On a move the player slides one piece any number of cells along its long
   axis, passing through empty cells only.
4. The player wins when the **red car** (length 2, horizontal, on the exit
   row) leaves the board through the right edge.

## Solution status

Generalised n×n Rush Hour is **PSPACE-complete** (Flake & Baum 2002 — the
"Generalised Rush Hour Logic" reduction). The classical 6×6 puzzles are
solved trivially by BFS.

## Consensus on optimal play

- **BFS gives the optimal solution** — breadth-first search on the state graph (each node = board configuration, each edge = single-car slide) finds the minimum-move sequence; the 6×6 board has at most a few thousand reachable states per puzzle.
- **Clear the exit row first** — the red car must exit right; identify which cars block the exit row and plan to slide them out of the way as the first priority.
- **Work backward from the exit** — if car A blocks the red car, find what blocks A, and what blocks those blockers; the dependency tree reveals the order of necessary moves.
- **A single slide can move multiple cells** — cars can slide as many cells as open space allows in one move; prefer slides that create large openings over multiple small shuffles.
- **Avoid unnecessarily locking your own exits** — sliding a car to clear one path can inadvertently block another; preview the full downstream effect before committing to a move.

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
