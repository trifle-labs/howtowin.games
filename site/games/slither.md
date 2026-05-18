# Slither

> A connection game where stones can also slide to new positions. It has not been solved.

| Field | Value |
|-------|-------|
| Also known as | Slither |
| Players | 2 |
| Type | Partisan connection game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Unsolved |
| **Game-theoretic value** | Unknown |
| Year solved | — |
| Solved by | — |
| State-space complexity | Large |
| Game-tree complexity | Large |
| **Playable** | slither |

## Description

Slither (Corey Clark, 2010s) is a connection game played on a square grid. Stones cannot touch diagonally without an up/down/left/right connection, and players can also slide existing stones to new positions. The combination of placing and sliding makes it very different from Hex.

## Rules

1. Square board (commonly 8x8 or larger). Each player owns two opposite sides of the board.
2. On each turn, a player either:
   - Places a new stone on an empty cell, as long as doing so does not create two same-colored stones that are diagonally next to each other without an up/down/left/right connection between them; or
   - Slides one of their existing stones one cell up, down, left, or right, following the same diagonal restriction.
3. The first player to make a chain of their stones connected up/down/left/right that reaches from one of their sides to the opposite side wins.
4. Draws are not possible under the standard rules.

## Solution status

Slither is **unsolved**. The slider move blows up the game tree and the
no-diagonal rule complicates evaluation; engine play exists but no formal
solution.

## Consensus on optimal play

- **Keep your chain connected up/down/left/right** — only up/down/left/right connections count toward your winning path. Always check that newly placed or slid stones stay connected to your main group.
- **Use slides to extend without overcommitting** — sliding moves an existing stone instead of adding a new one, saving stones while repositioning. Use slides to bridge gaps without permanent new placements.
- **Avoid loose diagonal pairs** — having two of your stones diagonally next to each other without an up/down/left/right connector is illegal. Avoid creating these situations as they block future placements.
- **Threaten two paths at once** — as in all connection games, the key is to have two separate path threats to your goal sides at the same time. This forces the opponent to block both or lose one.
- **First player advantage is suspected but not proven** — draws are impossible (someone must complete a chain). The first player likely has an advantage, but this has not been formally proved.

## Engines & current best play

- **Strongest known program(s):** No game-specific public engine known to the cataloguer. Playable in general-purpose abstract-game frameworks (e.g., [Ludii](https://ludii.games/)).
- **Strength:** Not benchmarked.
- **Notes:** A small competitive community exists; no published computational analysis or formal solution is known.

## Complexity

Large; the sliding move makes ply branching much wider than placement-only
connection games.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Slither_(board_game))
- [Schensted & Titus (1975). *Mudcrack Y and Poly-Y*.](../references.md#schensted-titus1975) (general framework)

## See also

- [Hex](hex.md) · [Crossway](crossway.md) · [Havannah](havannah.md) · [TwixT](twixt.md)
- Lexicon: [game-tree complexity](../lexicon/README.md#game-tree-complexity)
