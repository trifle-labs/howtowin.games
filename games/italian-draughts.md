# Italian draughts

> 8×8 draughts variant with men that cannot capture kings — unsolved.

| Field | Value |
|-------|-------|
| Also known as | Dama italiana |
| Players | 2 |
| Type | Partisan draughts |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Unsolved |
| **Game-theoretic value** | Unknown |
| Year solved | — |
| Solved by | — |
| State-space complexity | Similar to English draughts |
| Game-tree complexity | Similar to English draughts |

## Description

Italian draughts is played on an 8×8 board with the dark squares oriented to
the right of each player (a 90° rotation of English placement). Men cannot
capture kings, and the rules require players to capture the maximum number of
pieces possible.

## Rules

1. Board: 8×8, with dark squares to each player's right. Each side has 12 men.
2. Men move and capture diagonally forward only; capture is mandatory.
3. **A man may never capture a king.**
4. When multiple captures are available, the player must choose the line that
   captures the **most pieces**; ties are broken by preferring sequences with
   more kings captured (the "majority rule").
5. Men reaching the back rank promote to king; kings move one square in any
   diagonal direction (short kings — not flying).
6. A player who cannot move loses.

## Solution status

Italian draughts is **not solved**. The smaller mobility of kings and the
majority rule make engine analysis distinct from English draughts.

## Consensus on optimal play

- **Protect your kings from men — but not the reverse** — since men cannot capture kings, a king is safe from any man's attack; conversely, your men are vulnerable to the opponent's kings; concentrate on promoting men and shielding them until they crown.
- **Majority-rule triggers force long capture sequences** — when multiple captures are available you must take the most pieces, and when tied, prefer sequences capturing more kings; plan sequences with this in mind so the obligation benefits you, not your opponent.
- **Short kings require close-range tactics** — Italian kings move only one square at a time (no flying); king-vs-king endings are slower and more positional than in international draughts; avoid exchanging men for kings unless you gain a structural advantage.
- **Control the centre with men, not kings** — centralised men advance to promotion faster and cannot be captured by kings; push central men forward early while keeping flank men as backup.
- **Force the opponent's men to capture your kings** — the opponent's men cannot capture your kings; use this asymmetry by placing kings in paths of advancing enemy men, which the opponent cannot remove with those men, creating road-blocks.

## Engines & current best play

- **Strongest known program(s):** No widely-known public engine specific to Italian draughts; general draughts programs adapted to its rules are used in the Italian competitive scene.
- **Strength:** Not benchmarked publicly; engine play is stronger than amateur human level.
- **Where the proof / tablebase lives (if solved):** Not solved; no published tablebase.
- **Notes:** Small competitive scene in Italy; the "men cannot capture kings" rule is the defining asymmetry that separates Italian from English and international draughts.

## Complexity

Similar to English draughts.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Italian_draughts) ([archive](http://web.archive.org/web/20260111103728/https://en.wikipedia.org/wiki/Italian_draughts))
- [Schaeffer et al. (2007). *Checkers is Solved*.](../references.md#schaeffer2007) (related)
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)

## See also

- [English draughts](checkers.md) · [Russian draughts](russian-draughts.md) · [Turkish draughts](turkish-draughts.md)
- Lexicon: [partisan game](../lexicon/README.md#partisan-game)
