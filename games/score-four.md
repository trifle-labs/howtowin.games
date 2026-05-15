# Score Four

> Connect Four with gravity in three dimensions — four-in-a-row on a 4×4×4 grid
> of beads on pegs.

| Field | Value |
|-------|-------|
| Also known as | 3-D Connect Four, Score 4 |
| Players | 2 |
| Type | Partisan positional (k-in-a-row, with gravity) game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Weakly solved **[verify]** |
| **Game-theoretic value** | First-player win **[verify]** |
| Year solved | — |
| Solved by | — |
| State-space complexity | Up to 3^64 cell states (64-cell cube), far fewer reachable |
| Game-tree complexity | Large but within reach of modern solvers |

## Description

Played with a 4×4 array of vertical pegs. Players alternately slide a bead of
their colour onto a peg; like [Connect Four](connect-four.md), gravity forces
each bead to the lowest free position on its peg. The winner is the first to
make four of their beads in a straight line anywhere in the 4×4×4 cube — along
rows, columns, pegs, or any 2-D or 3-D diagonal.

## Solution status

Score Four occupies the same cube as [Qubic](qubic.md) but adds gravity, which
*reduces* the move choices (you pick a peg, not an arbitrary cell). With Qubic
itself weakly solved as a first-player win ([Patashnik, 1980](../references.md#patashnik1980)),
and Score Four being a constrained version on the same 76-line cube, Score Four
is **reported to be weakly solved as a first-player win** and is well within the
reach of modern exhaustive solvers.

> **[verify]** — This archive has not pinned a single canonical primary source
> giving Score Four's exact game-theoretic value. The first-player-win claim is
> consistent with the literature and the game's modest size, but a specific
> solving citation should be added.

## Consensus on optimal play

- **Centre pegs are the most powerful** — the four central pegs of the 4×4 array participate in the most winning lines (rows, columns, and 3-D diagonals); fill them early to maximise winning-line coverage.
- **Vertical columns are dangerous to gift** — if you allow the opponent to stack many beads on a single peg uncontested, they gain a complete peg-column line easily; contest central pegs immediately.
- **3-D diagonals are hard to see but decisive** — the four space diagonals of the cube (corner to opposite corner) are easy to miss; check all 76 winning lines after every move, not just the obvious 2-D rows.
- **First player should impose early threats** — with correct play the first player wins; exploit first-move advantage by building a multi-direction threat cluster on the first 4–5 moves.
- **Gravity limits flexibility** — unlike Qubic you cannot place freely; if a needed cell is not at the bottom of its peg you must wait or fill lower cells first, which the opponent can anticipate.

## Engines & current best play

- **Strongest known program(s):** No widely distributed public engine known to the cataloguer; solvers based on the Qubic-style search (Patashnik 1980 / Allis 1994 approach) are applicable.
- **Strength:** Likely solvable to perfection with a modern exhaustive search; no benchmarked program is publicly available.
- **Where the proof / tablebase lives (if solved):** No canonical primary source confirmed; see [Patashnik (1980)](../references.md#patashnik1980) for the gravity-free sibling Qubic.
- **Notes:** First-player win is widely reported but this archive has not verified a primary citation; see [Qubic](qubic.md) for the related confirmed solution.

## Complexity

64-cell cube; the gravity constraint keeps the reachable state space and game
tree well within modern exhaustive search.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Score_Four)
- [Patashnik, O. (1980). *Qubic: 4×4×4 Tic-Tac-Toe*.](../references.md#patashnik1980) (the no-gravity sibling)
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)

## See also

- [Connect Four](connect-four.md) · [Qubic](qubic.md) · [Tic-tac-toe](tic-tac-toe.md)
- Lexicon: [weakly solved](../lexicon/README.md#weakly-solved) · [first-player advantage](../lexicon/README.md#first-player-advantage)
