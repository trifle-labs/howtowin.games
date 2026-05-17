# TwixT

> A connection game of pegs and links; popular, elegant, and unsolved.

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

Played on a square grid of holes (commonly 24×24). Players alternately place a
peg of their colour; whenever two of your pegs are a chess-knight's-move apart
with no crossing link in the way, you may connect them with a link. Each player
tries to build a continuous linked chain between their two opposite edges.
Unlike [Hex](hex.md), **TwixT can be drawn** — links can block each other so
that neither side completes a connection.

## Solution status

TwixT is **unsolved**. Because draws are possible, the
[strategy-stealing argument](../lexicon/README.md#strategy-stealing) that settles
Hex and Y does **not** directly give TwixT's value — it would only rule out a
second-player win, not establish a first-player win versus a draw. Small boards
have been studied and the game has a long history of strong human and computer
play, but the standard board's game-theoretic value is not known.

## Consensus on optimal play

- **Use the swap rule to correct for first-mover advantage** — TwixT is typically played with a swap (pie) rule: if the second player considers the first move too strong, they can swap colours; always open with a move you would be happy to defend from either side.
- **Build diagonal ladders along the 3/4-column** — chains running at a ~45-degree angle are the most space-efficient routes; experienced players route through the 3rd or 4th column from each edge to leave room for defensive detours.
- **Block by crossing links, not just placing pegs** — a link between two of your pegs permanently blocks any link that would cross it; strategic link placement can cut off the opponent's entire routing corridor without adding a peg directly in their path.
- **Avoid isolated pegs far from your chain** — a peg not already connected to your chain offers no immediate benefit and requires future moves to incorporate; keep pegs within knight's-move range of your existing links.
- **Contest the narrow "bridging" points** — the grid has certain bottleneck squares where both sides' optimal paths converge; placing a peg at such a pivot forces the opponent to route around, often gaining a column of space.
- **Draws arise from deadlocked links** — if the midgame produces a fully cut-off corridor for both players, accept a draw; do not weaken your own formation chasing a win that is geometrically impossible.

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
