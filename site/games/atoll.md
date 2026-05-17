# Atoll

> An island-connection game by Mark Steere — unsolved.

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

Atoll (Mark Steere) is a hexagonal-board connection game with **island
endpoints**: instead of two opposite *edges* of the board, each player has
two **specific cells** (the "islands") that they must connect.

## Rules

1. Hexagonal grid board with four marked cells (two per player), located near
   the four corners or on opposing sides.
2. Players alternate placing one stone of their colour on any empty cell. (One
   stone may not be played adjacent to a same-colour stone if doing so would
   violate the no-clumping rule — variants differ; **[verify]** the canonical
   version.)
3. The first player to form a connected chain of their colour linking **both**
   of their islands wins.
4. Draws are not possible.

## Solution status

Atoll is **unsolved**. The two-target connection objective is closer to
[Bridg-it](bridg-it.md) and [TwixT](twixt.md) than to Hex, and no formal
solution has been published.

## Consensus on optimal play

- **Build toward both islands simultaneously** — connecting your two islands requires a spanning path; advancing a chain that serves neither island wastes tempo and leaves you vulnerable to being cut.
- **The virtual connection principle applies** — as in Hex, two groups that share two disjoint paths to each other are "virtually connected" and cannot both be cut; recognise these structures to play confidently without fully bridging gaps yet.
- **Cutting between opponent's islands is the primary attack** — find the narrowest crossing between the opponent's two islands and contest it; a stone planted in that corridor forces the opponent to detour.
- **Centralise early** — cells near the centre of the board lie on more potential paths between any pair of islands; central stones are harder to render irrelevant than peripheral ones.
- **The strategy-stealing argument applies** — an extra stone is never a liability in a connection game, so first player has at least a draw theoretically; this implies the pie rule swap is appropriate for fair play.

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
