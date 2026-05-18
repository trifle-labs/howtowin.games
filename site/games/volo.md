# Volo

> A game where players build and move groups of stones on a hexagonal grid. The player with the largest connected group wins. It has not been solved.

| Field | Value |
|-------|-------|
| Also known as | Volo |
| Players | 2 |
| Type | Partisan placement-and-movement game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Unsolved |
| **Game-theoretic value** | Unknown |
| Year solved | — |
| Solved by | — |
| State-space complexity | Moderate |
| Game-tree complexity | Moderate |
| **Playable** | volo |

## Description

Volo (Nick Bentley) is a placement-and-movement game on a hexagonal grid. Players place stones and move connected groups of stones to create the largest possible flock of their color.

## Rules

1. Board: a hexagonal grid (commonly 5 or 6 cells per side).
2. Players take turns. On a turn, a player either:
   - Places two stones of their color onto empty cells; or
   - Moves an entire connected group of their stones one step in a chosen direction, as long as all destination cells are empty.
3. The game ends when neither player can place any more stones. The player with the largest single connected group wins. Ties are broken by total number of stones on the board.

## Solution status

Volo is **not solved**. The combination of placement and group movement makes
the branching factor substantial.

## Consensus on optimal play

- **Grow one big flock instead of many small ones** — only the largest single connected group counts toward your score. Spreading your stones into multiple groups wastes moves that could be used to grow your main group.
- **Use group movement to merge separated pieces** — when you have a small detached cluster near your large group, move the large group one step toward the cluster or vice versa. Merging them can dramatically increase your largest-group count.
- **Block the opponent from merging their groups** — placing stones between two of the opponent's separate groups prevents them from combining. A single well-placed stone can keep two large enemy groups permanently apart.
- **Place stones next to your largest group** — when placing two stones, always put at least one next to your existing largest group to grow it. Stones placed in distant corners are hard to connect later.
- **Keep your main group in the center** — moving your flock to the edge or corner limits its future movement and makes it harder to absorb new placements. Keep your main group in the center where it can move in all directions.

## Engines & current best play

- **Strongest known program(s):** No game-specific public engine known to the cataloguer. Playable in general-purpose abstract-game frameworks (e.g., [Ludii](https://ludii.games/)).
- **Strength:** Not benchmarked.
- **Where the proof / tablebase lives (if solved):** —
- **Notes:** Volo was designed by Nick Bentley; the combination of dual-placement and full-group-movement creates a distinctive branching factor that makes it more complex than its small board suggests.

## Complexity

Moderate.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Volo_(game))
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)

## See also

- [Catchup](catchup.md) · [Hive](hive.md) · [Hex](hex.md)
- Lexicon: [partisan game](../lexicon/README.md#partisan-game)
