# Sokoban

> Single-player box-pushing puzzle — PSPACE-complete.

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

Sokoban (Hiroyuki Imabayashi, 1981) is a solo puzzle in which a warehouse
keeper pushes crates onto designated target cells. **Deciding whether a
Sokoban level is solvable is PSPACE-complete** (Culberson, 1997).

## Rules

1. Board: rectangular grid containing walls, crates, target cells, and a
   single "keeper" piece.
2. On each step the keeper moves orthogonally one cell to an empty cell (no
   wall, no crate).
3. The keeper may **push** a single crate one cell in the direction of motion
   if that cell is empty (no wall, no second crate).
4. The keeper cannot pull crates.
5. The puzzle is solved when every target cell holds a crate.

## Solution status

Sokoban's **general decision problem** — given a level, is it solvable? —
has been proven **PSPACE-complete** (Culberson 1997/1999). Individual levels
are solved by hand or by automated solvers; large levels can stay unsolved
for years.

## Consensus on optimal play

- **Avoid deadlocks immediately** — a crate pushed into a corner (two walls meeting) is permanently frozen; scanning for corner-deadlock before every push prunes most failed branches.
- **Identify goal packing order first** — work out which target cell each crate should occupy before moving anything; assigning wrong crates to goals wastes many moves.
- **Clear the path to targets, not just targets** — a corridor crate that blocks access to a distant target must be moved early; experienced solvers plan the "routing layer" before the "placement layer."
- **Keep the keeper path short** — unnecessary keeper repositioning inflates move count; prefer pushing sequences where the keeper naturally arrives behind the next crate.
- **Freeze analysis saves depth** — if pushing a crate creates a frozen group (two crates and a wall forming an unmovable block) that covers an unclaimed target, the state is a dead loss; cut it.
- **Work backwards for hard levels** — pull analysis (imagine pulling crates away from targets) reveals which keeper positions are reachable and which paths are geometrically impossible.

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
