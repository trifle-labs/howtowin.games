# Volo

> Flock-formation game on a hex grid — unsolved.

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

## Description

Volo (Nick Bentley) is a placement-and-movement game on a hex grid in which
each player tries to form the largest connected "flock" of their colour by
controlled placements and movement of birds in formation.

## Rules

1. Board: hexagonal grid (commonly side 5 or 6).
2. Players take turns. On a turn the player either:
   - **Places** two stones of their colour onto empty cells; **or**
   - **Moves** an entire connected group of their stones one step in a chosen
     direction, provided all destination cells are empty.
3. The game ends when neither player can place. The player with the largest
   single connected group wins; ties are broken by total stones on the board.

## Solution status

Volo is **not solved**. The combination of placement and group movement makes
the branching factor substantial.

## Consensus on optimal play

- **Grow one large connected flock rather than many small groups** — only the largest single connected group scores; spreading stones into multiple clusters wastes placements that could extend your dominant group.
- **Use group movement to consolidate isolated pieces** — when you have a small detached cluster near a large group, move the large group one step toward the cluster or vice versa; merging them can dramatically shift the largest-group count.
- **Block opponent group merges** — placing stones in the gap between two of the opponent's separate groups prevents them from combining into a dominant flock via movement; a single well-placed stone can keep two large enemy groups permanently apart.
- **Place pairs of stones adjacent to your largest group** — when placing two stones, always put at least one adjacent to your existing largest group to grow it; orphaned pairs in distant corners are hard to integrate later.
- **Do not move a group into a corner** — moving a flock to the board edge or corner limits its future movement directions and makes it harder to absorb new placements; keep your main group mobile in the centre.

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
