# Pylos

> A 4×4 stacking pyramid game — reported weakly solved as a first-player win
> by distributed retrograde analysis.

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

## Description

Pylos (David Parlett, 1990s) is played on a 4×4 base of indentations that
support a pyramid; each layer up has one fewer row and column. Players
alternately place balls of their colour on empty positions; balls placed on
**four square-adjacent same-level balls** can be played on top, stacking up
the pyramid. The player forced to place the apex ball loses.

## Rules

1. Board: 4×4 base; balls form a stable pyramid as 4×4 + 3×3 + 2×2 + 1×1 = 30
   positions.
2. Each player has 15 balls of their colour, held off-board in reserve.
3. On a turn, a player either:
   - **Place** a new ball on any empty base position; **or**
   - **Place** a new ball on top of any 2×2 square of balls (regardless of
     colour) that is fully filled — *promotion*; **or**
   - **Move up**: take one of your own balls from a *lower* level (where its
     removal doesn't undermine an upper ball) and replay it onto a 2×2 square
     it can be promoted to.
4. **Bonus**: forming a row of four same-coloured balls (horizontally or
   vertically) on any layer lets the player remove one or two of their own
   balls back to reserve.
5. The player who places the **apex** ball loses (it is the 30th ball, and the
   loser is the one who has no playable move except the apex).

## Solution status

A distributed retrograde-analysis solve of Pylos was reported circa 2010,
finding a **first-player win** with perfect play. **[verify]** the canonical
solver attribution; this archive author has not located a peer-reviewed
write-up.

## Consensus on optimal play

- **Avoid being the one to complete a 2×2 square the opponent can promote from** — promoting is free tempo for the opponent; completing the last side of a 2×2 square only to hand promotion rights to the opponent is a common beginner error.
- **Earn row bonuses aggressively** — forming a four-in-a-row on any layer allows you to reclaim one or two balls; this conserves your reserve and extends your options, especially in the endgame when the apex approaches.
- **Control the upper layers** — placing on higher levels early locks in the pyramid structure; the player who places at level 2 and 3 has earlier visibility of the apex position and can manoeuvre to force the opponent to fill it.
- **Reclaim before the apex is forced** — use bonus reclaims to avoid running out of balls just as the apex becomes the only legal move.
- **The loser places the apex ball** — therefore force the opponent to take the last available non-apex slot; count remaining empty positions carefully in the endgame.

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
