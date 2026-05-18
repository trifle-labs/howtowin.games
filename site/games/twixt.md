# TwixT

> A connection game where players place pegs and connect them with links. Unlike most connection games, it can end in a draw. It has not been solved.

| Field | Value |
|-------|-------|
| Also known as | TwixT |
| Players | 2 |
| Type | Partisan connection game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Unsolved |
| **Game-theoretic value** | Unknown |
| Year solved | — |
| Solved by | — |
| State-space complexity | Large (commonly 24×24 board of holes) |
| Game-tree complexity | Large |
| **Playable** | twixt |

## Description

Played on a square grid of holes (commonly 24x24). Players take turns placing a peg of their color on the board. Whenever two of your pegs are a knight's move apart in chess (two steps in one direction and one step perpendicular) with no link crossing the path, you may connect them with a link. Each player tries to build a continuous linked chain between their two opposite edges of the board. Unlike Hex, TwixT can end in a draw — links can block each other so that neither side completes a connection.

## Solution status

TwixT is **unsolved**. Because draws are possible, the
[strategy-stealing argument](../lexicon/README.md#strategy-stealing) that settles
Hex and Y does **not** directly give TwixT's value — it would only rule out a
second-player win, not establish a first-player win versus a draw. Small boards
have been studied and the game has a long history of strong human and computer
play, but the standard board's game-theoretic value is not known.

## Consensus on optimal play

- **Use the swap rule to balance first-move advantage** — TwixT is usually played with a swap rule: if the second player thinks the first move is too strong, they can swap colors. Always start with a move you would be comfortable defending from either side.
- **Build diagonal chains along the 3rd or 4th column** — chains running at about a 45-degree angle are the most space-efficient routes. Experienced players build through the 3rd or 4th column from each edge to leave room for defensive detours.
- **Block by crossing the opponent's links, not just placing pegs** — a link between two of your pegs permanently blocks any link that would cross it. Placing links strategically can cut off the opponent's routing paths without needing to put a peg directly in their way.
- **Keep pegs close to your main chain** — a peg not connected to your chain offers no immediate benefit and needs future moves to connect. Keep pegs within a knight's move of your existing links.
- **Fight for the bottleneck points** — the grid has certain key squares where both players' optimal paths cross. Placing a peg at such a point forces the opponent to go around, often gaining you a whole column of space.
- **Know when to accept a draw** — if the game reaches a point where both sides have fully blocked corridors, accept a draw. Do not weaken your own formation chasing a geometrically impossible win.

## Engines & current best play

- **Strongest known program(s):** Twixt-playing programs (various, including entries in computer-games competitions); Monte Carlo tree search implementations have been developed.
- **Strength:** Competitive with strong human players; no super-human benchmarked open-source engine is publicly well-known to the cataloguer.
- **Where the proof / tablebase lives (if solved):** —
- **Notes:** TwixT is unique among popular connection games in allowing draws via link-blocking; this makes strategy-stealing inapplicable and the game-theoretic value genuinely open.

## Complexity

Large; the 24×24 board and link-blocking rules make exhaustive analysis
infeasible with current methods.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/TwixT) ([archive](http://web.archive.org/web/20260324115453/https://en.wikipedia.org/wiki/TwixT))
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002) (general framework)

## See also

- [Hex](hex.md) · [Y](y.md) · [Havannah](havannah.md)
- Lexicon: [strategy-stealing argument](../lexicon/README.md#strategy-stealing) · [draw](../lexicon/README.md#draw)
