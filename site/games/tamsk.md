# TAMSK

> A game where the playing pieces are sand-timers that run out of sand over time. It has not been solved.

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
| **Playable** | tamsk |

## Description

TAMSK (Kris Burm, 1998) is the most unusual game in the GIPF project. Each playing piece is a small sand-timer. The state of the game depends on how much sand has fallen in each timer. A move must be made while the relevant timer still has sand remaining.

## Rules

1. Board: a hexagonal grid of cells, each with a fixed maximum number of timers it can hold.
2. Each player owns a set of small sand-timers in three colors, each with different sand durations.
3. On a turn, the player picks one of their timers from the board, flips it onto an empty cell (the cell's timer limit must be respected), and the sand starts running.
4. Once a timer runs out of sand, it can no longer be moved.
5. The player who can no longer make a legal move loses. Final scoring is based on how many timers each player has used to claim territory.

## Solution status

TAMSK is **not solved**. Its time-state makes the game extension non-standard
relative to other GIPF entries, and there is no published solving result.

## Consensus on optimal play

- **Use long-duration timers in contested spots** — timers with more sand left stay moveable longer. Place them where fighting will happen, while using short-lived timers to lock down less important positions.
- **Freeze the opponent's timers early** — force the opponent's timers to run out of sand in bad positions, permanently removing them from play. Fight for the cells the opponent needs to keep their timers active.
- **Do not flip timers needlessly** — each flip uses up some of the timer's remaining sand. Unnecessary flips waste sand and may leave a timer stuck in the wrong place.
- **Corner cells are safe anchors** — edge cells on the hexagonal board are attacked from fewer directions. Placing a medium-duration timer there early secures territory with minimal future flipping.
- **Track sand remaining, not just positions** — the total sand left across all your timers is a resource. The player who runs out of moveable timers first loses, so managing sand is your top priority.

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
