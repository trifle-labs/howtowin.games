# Onyx

> A connection game on a board made of both squares and triangles. It has not been solved.

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

Onyx (by Larry Back, 1996) is a connection game played on a grid of squares with extra points added at the centre of some squares, creating a mix of square and triangle connections. Each player tries to connect their two sides of the board. You can also capture enemy stones by surrounding them.

## Rules

1. Board: 12x12 square grid with extra points at the centre of certain squares (creating local triangle-shaped connections).
2. White wants to connect the left and right edges with white stones; Black wants to connect the top and bottom edges with black stones.
3. On each turn, a player places one stone of their colour on any empty point.
4. **Capture**: when you surround one or two of the opponent's stones on all sides, those stones are removed.
5. The first player to create an unbroken chain of their stones between their two target edges wins.
6. A "pie rule" (swap rule) may be used to balance the first-player advantage.

## Solution status

Onyx is **not solved**. By the strategy-stealing argument it is at worst a
draw for the first player; capture-based connection games rarely admit
strategy-stealing proofs of win, so its value remains open. **[verify]**

## Consensus on optimal play

- **Route through the triangle centres** — the extra points in the centre of squares create shortcut connections. Running your chain through them makes it harder for the opponent to cut you off.
- **Keep two separate paths to your goal** — as in Hex, work on two independent ways to connect your target edges at the same time. The opponent usually cannot block both at once.
- **Only capture if it helps your connection** — removing an enemy stone is only useful if it opens a path for you or breaks a blocking chain. Random captures that do not affect the connection are a waste of a move.
- **Use the pie rule wisely** — if the game has a swap rule, pick a first move that is as balanced as possible, or else the opponent will swap sides and leave you with a worse position.
- **Watch out for the mixed grid** — because the board has both square and triangle connections, paths that look blocked sometimes have hidden shortcuts through triangle centres. Do not assume a cut is solid.

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
