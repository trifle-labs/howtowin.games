# Sokoban

> A single-player puzzle where you push boxes onto target spots in a warehouse.

| Field | Value |
|-------|-------|
| Also known as | Sokoban (倉庫番) |
| Players | 1 |
| Type | Solo puzzle |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Per-instance solvability is PSPACE-complete |
| **Game-theoretic value** | Per-puzzle (varies) |
| Year solved | n/a (complexity result: Culberson 1997/1999) |
| Solved by | Joseph Culberson (complexity) |
| State-space complexity | Up to exponential in board size |
| Game-tree complexity | Up to exponential in board size |
| **Playable** | sokoban |

## Description

Sokoban (Hiroyuki Imabayashi, 1981) is a solo puzzle in which a warehouse keeper pushes crates onto designated target spots. Deciding whether a Sokoban level is solvable is PSPACE-complete (a measure of how hard the problem is for a computer to solve in general).

## Rules

1. Board: rectangular grid containing walls, crates, target spots, and a single "keeper" piece.
2. On each step, the keeper moves one cell up, down, left, or right to an empty cell (no wall, no crate).
3. The keeper may push a single crate one cell in the direction of movement if that cell is empty (no wall, no second crate).
4. The keeper cannot pull crates.
5. The puzzle is solved when every target spot holds a crate.

## Solution status

Sokoban's **general decision problem** — given a level, is it solvable? —
has been proven **PSPACE-complete** (Culberson 1997/1999). Individual levels
are solved by hand or by automated solvers; large levels can stay unsolved
for years.

## Consensus on optimal play

- **Avoid deadlocks right away** — a crate pushed into a corner (where two walls meet) is stuck forever. Check for corner deadlocks before every push — this eliminates most losing paths.
- **Decide which crate goes to which target first** — figure out which target each crate should end up on before you start moving anything. Assigning crates to the wrong targets wastes many moves.
- **Clear access paths, not just targets** — a crate blocking a hallway must be moved early even if it is not near any target yet. Experienced solvers plan the routing before the placement.
- **Keep the keeper's walking path short** — unnecessary movement wastes moves. Prefer pushing sequences where the keeper naturally ends up behind the next crate to push.
- **Watch for frozen groups** — if pushing a crate creates an immovable block (two crates and a wall) that covers an unclaimed target, the position is hopeless. Abandon that plan.
- **Work backwards for hard levels** — imagine pulling crates away from targets instead of pushing them. This reveals which positions are reachable and which paths are impossible.

## Engines & current best play

- **Strongest known program(s):** YASS (Yet Another Sokoban Solver) and Takaken's solver — heuristic iterative-deepening A* with pattern databases.
- **Strength:** Super-human on most classic level sets; some hardest user-made levels remain unsolved by any automated solver.
- **Where the proof / tablebase lives (if solved):** Per-puzzle; no universal tablebase. Culberson's PSPACE-completeness proof is at [../references.md#culberson-sokoban1999](../references.md#culberson-sokoban1999).
- **Notes:** The Sokoban community maintains level databases and solution archives; the official "original" 90-level set was fully solved automatically, but community-designed hard sets still stump solvers.

## Complexity

Per-instance can be exponential; family-level decision is PSPACE-complete.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Sokoban) ([archive](http://web.archive.org/web/20260511233436/https://en.wikipedia.org/wiki/Sokoban))
- [Culberson (1999). *Sokoban is PSPACE-complete*.](../references.md#culberson-sokoban1999)

## See also

- [Klotski](klotski.md) · [Rush Hour](rush-hour.md) · [Tower of Hanoi](tower-of-hanoi.md)
- Lexicon: [PSPACE](../lexicon/README.md#pspace)
