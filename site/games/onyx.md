# Onyx

> Connection game on a mixed square/triangle grid — unsolved.

| Field | Value |
|-------|-------|
| Also known as | Onyx |
| Players | 2 |
| Type | Partisan connection game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Unsolved |
| **Game-theoretic value** | Unknown (first-player win suspected via strategy stealing **[verify]**) |
| Year solved | — |
| Solved by | — |
| State-space complexity | Large |
| Game-tree complexity | Large |
| **Playable** | onyx |

## Description

Onyx (Larry Back, 1996) is a connection game on a hybrid grid of squares
with additional points at certain square centres, forming a mix of square
and triangular adjacency. Players race to connect their two sides while
capture rules allow stones to be removed by surrounding.

## Rules

1. Board: 12×12 square grid with extra points at the centre of certain
   squares (forming local triangular adjacency).
2. White connects the left and right edges with white stones; Black connects
   top and bottom with black stones.
3. On each turn a player places one stone of their colour on any empty point.
4. **Capture**: when a player completes a pattern in which one or two
   opposing stones are surrounded by the player's own stones at all
   adjacent points (within the local geometry), those stones are removed.
5. The first player to form an unbroken chain of their stones between their
   two designated edges wins.
6. The pie rule may be used to neutralise first-player advantage.

## Solution status

Onyx is **not solved**. By the strategy-stealing argument it is at worst a
draw for the first player; capture-based connection games rarely admit
strategy-stealing proofs of win, so its value remains open. **[verify]**

## Consensus on optimal play

- **Connect through the triangular hubs** — the extra centre-of-square points create shortcut adjacencies; routing your chain through them can make it harder for the opponent to cut.
- **Dual-threat paths** — as in Hex, maintain two independent connection paths toward your goal edges; forcing the opponent to block both simultaneously is usually impossible.
- **Captures serve connection, not material** — removing an opponent stone is valuable only when it directly opens a connection path or collapses a blocking chain; random captures that don't affect the chain topology are wasted tempo.
- **Use the pie rule to equalise** — if playing with the swap rule, aim for a first move that is as close to balanced as possible to avoid being swapped into a losing position.
- **Treat the hybrid grid carefully** — the square/triangle adjacency means that apparent "cuts" sometimes have bypass routes through triangle centres that are easy to miss.

## Engines & current best play

- **Strongest known program(s):** No game-specific public engine known to the cataloguer. Playable in general-purpose abstract-game frameworks (e.g., [Ludii](https://ludii.games/)).
- **Strength:** Not benchmarked.
- **Notes:** The competitive community for Onyx is small; no published engine is known.

## Complexity

Large.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Onyx_(game))
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)

## See also

- [Hex](hex.md) · [Y](y.md) · [Poly-Y](poly-y.md) · [Star](star.md)
- Lexicon: [strategy stealing](../lexicon/README.md#strategy-stealing)
