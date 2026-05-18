# Atoll

> A connection game where each player must link their two islands. Unsolved.

| Field | Value |
|-------|-------|
| Also known as | Atoll |
| Players | 2 |
| Type | Partisan connection game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Unsolved |
| **Game-theoretic value** | Unknown |
| Year solved | — |
| Solved by | — |
| State-space complexity | Comparable to Hex |
| Game-tree complexity | Large |
| **Playable** | atoll |

## Description

Atoll (by Mark Steere) is played on a hexagonal board. Instead of connecting two
opposite edges of the board like in Hex, each player has two **specific spots**
(called "islands") that they must connect with a chain of their pieces.

## Rules

1. The board is made of hexagons (hexagonal grid) with four marked spots (two per player), usually near the four corners or on opposite sides.
2. Players take turns placing one stone of their color on any empty cell. (In some versions, you cannot place a stone next to one of your own if it would create a clump — rules differ by version.)
3. The first player to create a connected chain of their color linking **both** of their islands wins.
4. Draws are not possible.

## Solution status

Atoll is **unsolved**. The two-target connection objective is closer to
[Bridg-it](bridg-it.md) and [TwixT](twixt.md) than to Hex, and no formal
solution has been published.

## Consensus on optimal play

- **Build toward both islands at the same time** — you need a path connecting your two islands. Advancing a chain that only helps one side wastes moves and leaves you open to being cut off.
- **Use "virtual connections"** — as in Hex, two groups that have two separate paths connecting them are "virtually connected" and cannot both be blocked. Learn to spot these patterns so you can play confidently without filling every gap.
- **Cut between the opponent's islands** — find the narrowest passage between the opponent's two islands and put your stone there. A stone in that corridor forces the opponent to take a longer path.
- **Play toward the center early** — cells near the center of the board sit on more possible paths between any pair of islands. Central stones are harder to make useless than edge stones.
- **An extra stone never hurts in a connection game** — in theory, having one more piece on the board is always good for you, so the first player has at least a draw. This is why the swap rule (letting the second player switch sides) is used to keep things fair.

## Engines & current best play

- **Strongest known program(s):** No game-specific public engine known to the cataloguer. Playable in general-purpose abstract-game frameworks (e.g., [Ludii](https://ludii.games/)).
- **Strength:** Not benchmarked.
- **Notes:** Atoll has a modest online player community but no dedicated published engine; general connection-game heuristics from Hex programs offer the strongest available guidance.

## Complexity

Comparable to Hex on similar board sizes.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Atoll_(game))
- [Schensted & Titus (1975). *Mudcrack Y and Poly-Y*.](../references.md#schensted-titus1975) (general framework)

## See also

- [Hex](hex.md) · [TwixT](twixt.md) · [Bridg-it](bridg-it.md) · [Havannah](havannah.md)
- Lexicon: [strategy-stealing argument](../lexicon/README.md#strategy-stealing-argument)
