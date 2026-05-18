# Seega

> An Egyptian game where you capture by surrounding your opponent's pieces on a 5x5 board. It has not been solved.

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
| **Playable** | seega |

## Description

Seega is a traditional Egyptian board game played on a 5x5 grid (other sizes also exist). Players first place their stones in a placement phase, then move and capture by **custodianship** — trapping an opponent's stone between two of their own.

## Rules

1. Board: 5x5 (other sizes like 7x7 or 9x9 also exist). Each player has 12 (or the right number of) stones.
2. **Placement phase**: the starting player puts two stones on any empty cells (except the centre), the opponent does the same, and they take turns until all stones are placed. The centre cell stays empty after placement.
3. **Movement phase**: players take turns moving one of their stones one cell up, down, left, or right to an empty cell.
4. **Capture**: whenever your move traps an opponent's stone between two of your own in a straight line (up, down, left, or right), the trapped stone is captured and removed. Multiple captures can happen on the same move.
5. A player who cannot move loses. The player who captures all of the opponent's stones wins.

## Solution status

Seega is **not solved**. The 5×5 case is small enough to be tractable to
modern compute but no published proof exists.

## Consensus on optimal play

- **Pair your stones during placement** — put two stones so they can trap an opponent's piece between them. This sets up quick captures in the movement phase. Isolated stones are easy targets.
- **Leave the centre empty at first, then take it** — the centre cell stays empty after the placement phase. Moving into the centre early in the movement phase gives you reach in all four directions, creating more capture threats.
- **Do not put lone stones on the edge** — a single stone on the edge only has three neighbors up/down/left/right. The opponent only needs two of those to trap it.
- **Move in pairs** — two stones moving together along parallel rows create a rolling capture threat. The opponent has to deal with both at once or lose a piece.
- **Do not fall behind on pieces** — do not trade captures where you lose more pieces than the opponent. Keep even numbers until you can set up a winning trap.

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
