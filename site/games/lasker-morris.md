# Lasker Morris

> A variant of Nine Men's Morris that fixes a stalling problem in the original. Solved as a draw.

| Field | Value |
|-------|-------|
| Also known as | Lasker Morris, Mill (Lasker variant) |
| Players | 2 |
| Type | Partisan placement+movement game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Weakly solved |
| **Game-theoretic value** | Draw |
| Year solved | 1996 |
| Solved by | Ralph Gasser |
| State-space complexity | ~10^10 positions |
| Game-tree complexity | ~10^50 |
| **Playable** | lasker-morris |

## Description

A modification of Nine Men's Morris proposed by world chess champion Emanuel Lasker (1931). The key change: a player may either place a new stone or move an existing one on every turn, instead of completing the entire placement phase first. This eliminates the rigid two-phase structure that, in standard Morris, gives a strong advantage to the defender in the placement phase.

## Rules

1. Same 24-point board as Nine Men's Morris, with nine stones per player.
2. On each turn a player may either place a new (reserve) stone on an empty point or move one of their on-board stones to a neighboring empty point.
3. Forming a row of three ("mill") allows the player to remove one opposing stone, as in standard Morris.
4. The "flying" endgame rule (move anywhere when down to 3 stones) usually applies.
5. A player reduced to 2 stones, or unable to move, loses.

## Solution status

Weakly solved by [Gasser (1996)](../references.md#gasser-laskermorris1996) at
the same time as standard Nine Men's Morris and using the same retrograde
analysis: the game is a **draw** with perfect play. Lasker Morris fixes the
"who-places-first" tempo issue without changing the headline result.

## Consensus on optimal play

- **Mix placements and moves from the start** — unlike standard Morris, you can move an existing stone instead of placing a new one; use this to set up mills while simultaneously developing stone positions, gaining the "chess-like" tempo advantage Lasker intended.
- **Prevent the opponent's mills before they form** — placing or moving a stone to break a near-complete opponent mill takes priority over building your own; a mill gives the opponent a removal and is very difficult to recover from.
- **Keep stones mobile** — stones on board points with no adjacent empty points are stuck; maintain each stone near at least one empty adjacent point so it can contribute to mills later.
- **Removal targets: take the opponent's most mobile stone** — when you form a mill and must remove a stone, take the one that would be hardest to replace — typically the stone closest to the opponent's two other mills.
- **Flying (3-stone) phase is a drawing resource** — being reduced to 3 stones triggers the flying rule (move anywhere); if you have set up a pattern the opponent cannot break and you still have 3 stones, you may hold a draw; knowing this prevents premature resignation.

## Engines & current best play

- **Strongest known program(s):** Gasser's solver (retrograde analysis, 1996) — provides perfect play from any position in the ~10^10-position database.
- **Strength:** Perfect; the complete game has been solved.
- **Where the proof / tablebase lives (if solved):** [Gasser (1996)](../references.md#gasser-laskermorris1996) — same retrograde analysis that solved Nine Men's Morris.
- **Notes:** The game is a draw with perfect play; Lasker's rule change produces a more dynamic game than standard Morris without changing the game-theoretic outcome.

## Complexity

State-space and tablebase size on the order of 10^10 — within the same range as
Nine Men's Morris and handled by Gasser's solver.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Nine_men%27s_morris) ([archive](http://web.archive.org/web/20260328233608/https://en.wikipedia.org/wiki/Nine_Men%27s_Morris))
- [Gasser (1996). *Solving Nine Men's Morris* — Lasker variant.](../references.md#gasser-laskermorris1996)

## See also

- [Nine Men's Morris](nine-mens-morris.md) · [Six Men's Morris](six-mens-morris.md) · [Twelve Men's Morris](twelve-mens-morris.md)
- Lexicon: [weakly solved](../lexicon/README.md#weakly-solved) · [retrograde analysis](../lexicon/README.md#retrograde-analysis)
