# Klotski

> Sliding-block puzzle whose generalisation is PSPACE-complete.

| Field | Value |
|-------|-------|
| Also known as | L'Âne Rouge, Huarong Pass, 華容道 |
| Players | 1 |
| Type | Solo sliding-block puzzle |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Generalised n×n sliding-block puzzle PSPACE-complete (Hearn & Demaine, 2005) |
| **Game-theoretic value** | Per-puzzle |
| Year solved | 2005 (complexity result) |
| Solved by | Robert Hearn, Erik Demaine |
| State-space complexity | Up to exponential in board size |
| Game-tree complexity | PSPACE-complete in general |

## Description

Klotski (commonly the *L'Âne Rouge* / Huarong Pass puzzle) is a sliding-block
puzzle in a 4×5 frame: one 2×2 block plus rectangular and square pieces must
be rearranged to slide the 2×2 block out the bottom opening. The generalised
sliding-block puzzle is **PSPACE-complete** (Hearn & Demaine 2005).

## Rules

1. Board: 4×5 frame (in the classical Huarong Pass version) containing one
   2×2 piece, four 1×2 pieces (vertical or horizontal), and four 1×1 pieces.
2. The 4×5 frame has a 2-cell opening on the bottom edge.
3. On a move the solver slides one piece one cell orthogonally to an empty
   space (no rotation, no jumping).
4. The puzzle is solved when the 2×2 piece reaches the bottom-centre and can
   slide out the opening.

## Solution status

Per-instance Klotski puzzles are solved by BFS in seconds. The **generalised
sliding-block problem** (with arbitrary block shapes on an n×n board) is
**PSPACE-complete** (Hearn & Demaine 2005).

## Consensus on optimal play

- **Minimise moves by planning the 2×2 block's route first** — identify the path the 2×2 block must travel from its start to the exit; then work out which other pieces must move out of the way for each step, in reverse order.
- **Create space at the top before pushing down** — in *L'Âne Rouge* / Huarong Pass the 2×2 block starts near the top; the 1×2 and 1×1 pieces must be rotated out of the block's path by first consolidating them in corners.
- **Cycle small pieces through corners** — the four 1×1 squares are the most flexible pieces; route them into corners to open lanes for the larger pieces.
- **BFS gives the provably shortest solution** — for the classical 4×5 Huarong Pass layout, BFS finds the minimum-move solution (81 moves) exactly; hand-solving is only a puzzle challenge, not strategically interesting beyond the minimum.
- **Generalised instances: plan "corridors" for big pieces** — in arbitrary sliding-block puzzles, long pieces need unobstructed corridors; identifying corridor-blocking pieces and clearing them is the key sub-problem.

## Engines & current best play

- **Strongest known program(s):** Standard BFS/IDA* sliding-block solvers (e.g., implementations in Simon Tatham's Puzzle Collection) — exact minimum-move solution in seconds.
- **Strength:** Perfect; BFS is complete and optimal for any fixed-size Klotski instance.
- **Where the proof / tablebase lives (if solved):** Classical *L'Âne Rouge* minimum: 81 moves (well-established); PSPACE-completeness for generalised problem: Hearn & Demaine (2005).
- **Notes:** A single-player puzzle; "solving" means finding the minimum-move path to the exit — BFS accomplishes this trivially for classical board sizes.

## Complexity

PSPACE-complete in general.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Klotski) ([archive](http://web.archive.org/web/20260410144029/https://en.wikipedia.org/wiki/Klotski))
- [Hearn & Demaine (2005). *Nondeterministic Constraint Logic and PSPACE-Completeness*.](../references.md#demaine-rushhour2002)

## See also

- [Rush Hour](rush-hour.md) · [Sokoban](sokoban.md) · [Tower of Hanoi](tower-of-hanoi.md)
- Lexicon: [PSPACE](../lexicon/README.md#pspace)
