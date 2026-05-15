# Seega

> Egyptian custodian-capture game on a 5×5 board — unsolved.

| Field | Value |
|-------|-------|
| Also known as | Siga |
| Players | 2 |
| Type | Partisan capture game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Unsolved |
| **Game-theoretic value** | Unknown |
| Year solved | — |
| Solved by | — |
| State-space complexity | Small–moderate |
| Game-tree complexity | Small–moderate |

## Description

Seega is a traditional Egyptian board game played on a 5×5 grid (other sizes
exist). Players first place their stones in a drop phase, then move and
capture by **custodianship** — sandwiching an opposing stone between two of
their own.

## Rules

1. Board: 5×5 (other sizes 7×7 or 9×9 exist). Each player has 12 (or
   appropriate) stones.
2. **Placement phase**: starting player drops two stones on any empty cells
   (except the centre), opponent does likewise, alternating until all stones
   are placed. The centre remains empty after placement.
3. **Movement phase**: players alternate; each turn a player moves one of
   their stones one cell orthogonally to an empty cell.
4. **Capture**: whenever a player's move sandwiches an opposing stone
   between two of their own along an orthogonal line, the sandwiched stone is
   captured and removed. Multiple captures can occur on the same move.
5. A player who cannot move loses; the player who captures all opposing
   stones wins.

## Solution status

Seega is **not solved**. The 5×5 case is small enough to be tractable to
modern compute but no published proof exists.

## Consensus on optimal play

- **Placement phase: pair your stones for mutual flanking** — placing two stones that share a flank with each other sets up immediate custodial captures in the movement phase; isolated stones are vulnerable to being sandwiched themselves.
- **Keep the centre empty at the start — then contest it** — the centre cell is left empty after placement; moving into the centre early in the movement phase gives orthogonal reach in all four directions, maximising custodial threat potential.
- **Avoid lone stones on the edge** — a single stone on the edge has only three orthogonal neighbours; being sandwiched on an edge requires the opponent to control only two of those, which is easier to arrange.
- **Advance in pairs** — two stones moving together along adjacent parallel rows create a rolling custodial threat; the opponent must address both simultaneously or lose a piece to the flanking motion.
- **The player who runs out of pieces first loses** — do not enter capture trades where you lose more pieces than the opponent; maintain numerical parity until you can set up a finishing trap.

## Engines & current best play

- **Strongest known program(s):** No game-specific public engine known to the cataloguer. Playable in general-purpose abstract-game frameworks (e.g., [Ludii](https://ludii.games/)).
- **Strength:** Not benchmarked.
- **Notes:** The 5×5 board is small enough for modern exhaustive analysis, but no published solution is known.

## Complexity

Small–moderate.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Seega_(game))
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)

## See also

- [Yote](yote.md) · [Dara](dara.md) · [Surakarta](surakarta.md) · [Picaria](picaria.md)
- Lexicon: [partisan game](../lexicon/README.md#partisan-game)
