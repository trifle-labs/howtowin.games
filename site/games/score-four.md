# Score Four

> Connect Four in three dimensions — four in a row on a 4x4x4 grid of beads on pegs.

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
| **Playable** | score-four |

## Description

Played with a 4x4 grid of vertical pegs. Players take turns sliding a bead of their colour onto a peg. Like [Connect Four](connect-four.md), gravity makes each bead fall to the lowest free spot on its peg. The winner is the first to get four of their beads in a straight line anywhere in the 4x4x4 cube — along rows, columns, pegs, or any two-dimensional or three-dimensional diagonal.

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

- **Centre pegs are the most powerful** — the four pegs in the middle of the 4x4 grid sit on the most winning lines (rows, columns, and 3-D diagonals). Fill them early.
- **Do not let the opponent stack a peg** — if you let the opponent stack beads on one peg without contesting it, they can easily get four in a column. Fight for the centre pegs right away.
- **Watch the 3-D diagonals** — the four diagonals that go from one corner of the cube to the opposite corner are easy to miss. Check all 76 winning lines after every move, not just the obvious flat ones.
- **First player should build threats early** — with correct play the first player wins. Use your first 4-5 moves to build threats pointing in multiple directions.
- **Gravity limits where you can place** — unlike Qubic (which has no gravity), you cannot place a bead just anywhere. If the spot you need is not at the bottom of its peg, you must fill lower cells first. The opponent knows this too and can plan around it.

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
