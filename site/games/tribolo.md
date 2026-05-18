# Tribolo

> A three-player game on a hexagonal grid where stones flip when surrounded. It has not been solved.

| Field | Value |
|-------|-------|
| Also known as | Tribolo |
| Players | 3 |
| Type | Partisan multi-player placement game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Unsolved |
| **Game-theoretic value** | Unknown (multi-player; no unique value) |
| Year solved | — |
| Solved by | — |
| State-space complexity | Moderate |
| Game-tree complexity | Moderate |
| **Playable** | tribolo |

## Description

Tribolo (Christian Freeling, 1980s/90s) is one of the few well-known three-player abstract games. Stones flip to your color when they are surrounded, similar to Othello. The player with the most stones on the board at the end wins. Being a three-player game, it falls outside the usual two-player solving framework — optimal play involves thinking about alliances and threats between multiple opponents.

## Rules

1. Board: a hexagonal grid of cells.
2. Three players take turns in fixed order, placing a stone of their color on an empty cell that is next to at least one stone of a different color.
3. When a stone is placed, any neighboring line of one opponent's color that is bracketed by the placer's stone and another color flips to the placer's color (similar to Othello's sandwich rule, but with three colors).
4. When no player can make a legal move, the game ends. The player with the most stones on the board wins.

## Solution status

Tribolo is **not solved**. Three-player solving lacks a unique game-theoretic
value in the standard sense; the analysis is best framed as a search for Nash
equilibria, of which there may be many. No published solution exists.

## Consensus on optimal play

- **Do not let one player get too far ahead** — in a three-player game, if one player pulls ahead while the other two fight each other, the leader will probably win. Target the leader's stones to keep the stone counts balanced.
- **Flip stones in multiple directions at once** — placing a stone that flips runs in more than one direction is stronger than flipping in just one direction. Multi-directional flips give you the most stones per move.
- **Play kingmaker only when you must** — if you genuinely cannot win, your next goal is deciding which of the other players wins. Flipping stones toward the weaker player gives you tactical control even when losing.
- **Control the center of the hex grid** — center cells on a hex board touch more cells, so center stones can be used for flips in more directions. Edge stones can only flip in fewer directions.
- **Protect large groups by surrounding them** — a group of your stones that is completely surrounded by your own stones (so no opponent can flip them) is safe. Build enclosed areas early to secure a minimum score.

## Engines & current best play

- **Strongest known program(s):** No game-specific public engine known to the cataloguer. Playable in general-purpose abstract-game frameworks (e.g., [Ludii](https://ludii.games/)).
- **Strength:** Not benchmarked.
- **Where the proof / tablebase lives (if solved):** —
- **Notes:** Three-player games resist standard game-theoretic solving because "optimal" requires specifying a solution concept (e.g., Nash equilibrium or maximin); no published analysis exists for Tribolo.

## Complexity

Moderate.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Tribolo)
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)

## See also

- [Othello](othello.md) · [Quixo](quixo.md)
- Lexicon: [Nash equilibrium](../lexicon/README.md#nash-equilibrium) · [partisan game](../lexicon/README.md#partisan-game)
