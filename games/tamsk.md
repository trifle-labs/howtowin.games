# TAMSK

> The GIPF-project's time-pressure game — pieces are sand-timers that "run out."

| Field | Value |
|-------|-------|
| Also known as | TAMSK |
| Players | 2 |
| Type | Partisan time-pressure abstract |
| Perfect information | Yes (modulo the timers) |
| Chance element | No |
| **Solution status** | Unsolved |
| **Game-theoretic value** | Unknown |
| Year solved | — |
| Solved by | — |
| State-space complexity | Small board, large timing state |
| Game-tree complexity | Moderate |

## Description

TAMSK (Kris Burm, 1998) is the GIPF-project's most unusual entry: each "piece"
is a small **sand-timer**. The state of the game depends on which side of each
timer is up, encoding how much sand has fallen. Moves must be made within the
time the relevant timer still has remaining.

## Rules

1. Board: hexagonal grid of cells; each cell has a fixed maximum capacity.
2. Each player owns a set of small sand-timers (three colours of timers,
   varying sand durations).
3. On a turn, the player picks one of their timers from the board, flips it
   onto an empty cell — the cell's timer-count constraint must be respected —
   and the sand starts running.
4. Once a timer runs out of sand, it can no longer be moved.
5. The player who can no longer legally move a timer loses; final scoring is
   on the number of timers each player has used to claim "territory."

## Solution status

TAMSK is **not solved**. Its time-state makes the game extension non-standard
relative to other GIPF entries, and there is no published solving result.

## Consensus on optimal play

- **Prioritise long-duration timers in contested cells** — timers with more remaining sand stay mobile longer; placing them on cells that will be fought over maintains flexibility while short-lived timers lock down peripheral positions.
- **Freeze opponent timers early** — moving so that an opponent's timers run dry in poor positions permanently removes them from play; deliberately contest the cells opponents must visit to keep timers active.
- **Do not flip timers unnecessarily** — each flip uses the timer's remaining sand; unnecessary moves waste that sand and may strand a timer in the wrong location.
- **Corner cells are low-risk anchors** — cells on the periphery of the hex board are contested by fewer approaches; placing a medium-duration timer there early secures territory at minimal future flip-cost.
- **Track the sand state, not just positions** — the total amount of sand remaining across your timers is a resource; the player who runs out of movable timers first loses, so managing sand longevity is the primary metric.

## Engines & current best play

- **Strongest known program(s):** No game-specific public engine known to the cataloguer. Playable in general-purpose abstract-game frameworks (e.g., [Ludii](https://ludii.games/)).
- **Strength:** Not benchmarked.
- **Where the proof / tablebase lives (if solved):** —
- **Notes:** TAMSK's real-time sand-timer mechanic is unique among GIPF-project games and creates an unusual time-state space that standard game-tree search handles poorly.

## Complexity

Small board but a large time-state continuum makes formal analysis awkward.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/TAMSK) ([archive](http://web.archive.org/web/20260115011947/https://en.wikipedia.org/wiki/TAMSK))
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)

## See also

- [GIPF](gipf.md) · [DVONN](dvonn.md) · [YINSH](yinsh.md)
- Lexicon: [game-tree complexity](../lexicon/README.md#game-tree-complexity)
