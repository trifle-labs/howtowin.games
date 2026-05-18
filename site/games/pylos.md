# Pylos

> A stacking pyramid game on a 4x4 base. Reported solved: the first player wins with perfect play.

| Field | Value |
|-------|-------|
| Also known as | Pylos |
| Players | 2 |
| Type | Partisan stacking game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Weakly solved **[verify]** |
| **Game-theoretic value** | First-player win **[verify]** |
| Year solved | ~2010 (distributed solve) **[verify]** |
| Solved by | Jürg Nievergelt et al. **[verify]** |
| State-space complexity | Moderate (~10^8 positions) |
| Game-tree complexity | Moderate |
| **Playable** | pylos |

## Description

Pylos (David Parlett, 1990s) is played on a 4x4 base of holes that support a pyramid. Each layer above has one fewer row and column. Players take turns placing balls of their colour on empty spots. If you place a ball on top of **four same-level balls that form a square**, you can stack up the pyramid. The player who is forced to place the very top (apex) ball loses.

## Rules

1. Board: 4x4 base with layers above getting smaller: 4x4 + 3x3 + 2x2 + 1x1 = 30 total positions.
2. Each player has 15 balls of their colour, kept off the board in reserve.
3. On your turn, you can do one of these:
   - **Place** a new ball on any empty base position; **or**
   - **Place** a new ball on top of any fully-filled 2x2 square of balls (no matter what colour they are) — called a *promotion*; **or**
   - **Move up**: take one of your own balls from a lower level (where removing it will not make a higher ball fall) and replay it onto a 2x2 square it can be promoted to.
4. **Bonus**: if you make a row of four same-coloured balls (horizontally or vertically) on any layer, you may remove one or two of your own balls back to your reserve.
5. The player who places the **apex** (very top) ball loses. It is the 30th and last ball, and the loser is the one with no other legal move.

## Solution status

A distributed retrograde-analysis solve of Pylos was reported circa 2010,
finding a **first-player win** with perfect play. **[verify]** the canonical
solver attribution; this archive author has not located a peer-reviewed
write-up.

## Consensus on optimal play

- **Do not complete a 2x2 square for the opponent** — filling in the last side of a 2x2 square gives the opponent a free promotion (they can place on top of it). A common beginner mistake.
- **Go for row bonuses aggressively** — making four in a row on any layer lets you take one or two of your balls back. This saves your reserve and gives you more options, especially near the end when the apex approaches.
- **Control the higher levels** — placing on upper layers early locks in the structure. The player who gets pieces on levels 2 and 3 first can see the apex coming and force the opponent to place it.
- **Reclaim balls before you run out** — use row bonuses to keep balls in reserve so you are not forced into placing the apex when no other moves remain.
- **The loser places the apex** — count the remaining empty spots carefully. Force the opponent to take the last non-apex position so they are the one stuck with the apex.

## Engines & current best play

- **Strongest known program(s):** Distributed retrograde-analysis solver (attributed to Nievergelt et al., c. 2010) — full position database of ~10^8 positions. **[verify attribution]**
- **Strength:** Perfect play if the solver database is confirmed correct.
- **Where the proof / tablebase lives (if solved):** Not publicly available; no peer-reviewed write-up located by this cataloguer.
- **Notes:** The first-player win result should be treated as preliminary until a verified publication is found.

## Complexity

Moderate: roughly 10^8 reachable positions.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Pylos_(game))
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)

## See also

- [Connect Four](connect-four.md) · [Score Four](score-four.md) · [GIPF](gipf.md)
- Lexicon: [weakly solved](../lexicon/README.md#weakly-solved) · [retrograde analysis](../lexicon/README.md#retrograde-analysis)
