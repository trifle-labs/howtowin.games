# Dara

> A West African three-in-a-row game with a much larger board than the morris
> family — unsolved.

| Field | Value |
|-------|-------|
| Also known as | Dara |
| Players | 2 |
| Type | Partisan placement+movement game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Unsolved |
| **Game-theoretic value** | Unknown |
| Year solved | — |
| Solved by | — |
| State-space complexity | Moderate (5×6 or 6×6 board, ~12 pieces a side) |
| Game-tree complexity | Moderate |

## Description

Dara is a traditional Nigerian/Sahelian abstract strategy game played in sand
or on a wooden board. Although superficially related to
[Nine Men's Morris](nine-mens-morris.md) — placement followed by movement,
winning by making a "line" — the larger board (commonly 5×6 with 24 pieces
total) and the **capture-on-three-in-a-row** rule give it a quite different
character.

## Rules

1. Board: 5 × 6 grid (some variants 6×6) of intersections.
2. Each player has **12 stones**.
3. **Placement phase**: players alternate placing stones on empty
   intersections. Three-in-a-row is **not** allowed during placement.
4. **Movement phase**: players alternate sliding one of their stones one square
   orthogonally to an empty adjacent intersection.
5. A player who makes a row of exactly three stones in a straight line (along
   the grid, not diagonal) **captures** one opponent stone of their choice.
   Only horizontal and vertical lines count; rows of four or more do not score.
6. The first player reduced to fewer than 3 stones (and so unable ever to make
   a three-row) loses.

## Solution status

Dara is **not solved**. The state space — a 5×6 board with up to 24 placed
stones — is moderate but no formal solving result has been published. There are
practical Dara-playing programs and a competitive human tradition, but no proven
game-theoretic value.

## Consensus on optimal play

- **In the placement phase, build near-rows without completing them** — three-in-a-row is prohibited during placement; place stones that create two-in-a-row configurations that will become immediate capture threats the moment the movement phase begins, without triggering the placement ban.
- **Capture pieces that support opponent three-row threats** — when you score a three-in-a-row and can remove an opponent stone, prioritise removing the stone that is most integral to their next potential three-in-a-row; this both denies them a capture and may reduce them below the three-stone losing threshold faster.
- **Control the centre columns/rows** — central intersections participate in more potential three-in-a-row lines (horizontal and vertical) than edge intersections; a piece in the centre can contribute to multiple future rows simultaneously.
- **Avoid rows of four or more** — only exactly three-in-a-row scores; a line of four does not, so extending a three into a four on your own initiative wastes the capture and blocks the scoring line. Know when to stop.
- **Manage piece count carefully** — the game is won by reducing the opponent below 3 pieces; count captures and plan whether you are on a winning attrition track or need to slow down to preserve your own material.

## Engines & current best play

- **Strongest known program(s):** No game-specific public engine known to the cataloguer. Playable in general-purpose abstract-game frameworks (e.g., [Ludii](https://ludii.games/)).
- **Strength:** Not benchmarked.
- **Notes:** Dara has a living competitive tradition in Nigeria and the Sahel but limited computational analysis; the state space is comparable to Nine Men's Morris (which has been strongly solved), suggesting a formal solution is feasible but has not been published.

## Complexity

Moderate — comparable in size to Nine Men's Morris, plausibly within reach of
modern solvers but not yet attempted.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Dara_(game)) ([archive](http://web.archive.org/web/20260111160444/https://en.wikipedia.org/wiki/Dara_(game)))
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002) (general framework)

## See also

- [Nine Men's Morris](nine-mens-morris.md) · [Twelve Men's Morris](twelve-mens-morris.md)
- Lexicon: [partisan game](../lexicon/README.md#partisan-game) · [state-space complexity](../lexicon/README.md#state-space-complexity)
