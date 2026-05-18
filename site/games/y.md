# Y

> A connection game on a triangular board where a player must connect all three sides. It can never end in a draw, so the first player has a proven winning strategy.

| Field | Value |
|-------|-------|
| Also known as | The Game of Y |
| Players | 2 |
| Type | Partisan connection game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Ultra-weakly solved (standard board); small boards weakly solved |
| **Game-theoretic value** | First-player win |
| Year solved | Ultra-weak: from the game's invention (c. 1953) |
| Solved by | Craige Schensted & Charles Titus (game); strategy-stealing argument |
| State-space complexity | Depends on board size |
| Game-tree complexity | Depends on board size |
| **Playable** | y |

## Description

Played on a triangular board made of hexagons, with three sides. Players take turns placing stones of their color. A player wins by forming a single connected chain that touches all three sides of the triangle. Hex is actually a special case of Y, played on just one corner of the board.

## Solution status

Y is **ultra-weakly solved**, by the same logic as [Hex](hex.md):

- **Y cannot be drawn.** A completely filled Y board always contains exactly one
  winning three-side connection — a fact provable by a neat reduction in which
  the board "shrinks" cell by cell to a single deciding cell.
- Since there are no draws and the game is symmetric, the
  [strategy-stealing argument](../lexicon/README.md#strategy-stealing) proves
  the **first player has a winning strategy** — without exhibiting one.

So, like Hex, Y's *value* is settled while its *strategy* is not, on full-size
boards. Small boards are weakly solved by exhaustive search. Y is described in
[Schensted & Titus's *Mudcrack Y and Poly-Y*](../references.md#schensted-titus1975).

## Consensus on optimal play

- **Aim for the center of mass, not the exact center cell** — unlike Hex, where the center is on the shortest path between two sides, Y's three-sided win condition means the best spot is roughly equal distance from all three sides. Pieces near the board's center serve as a hub for all three connections.
- **Use virtual connections to extend safely** — a virtual connection (a bridge using two key cells that the opponent cannot block at the same time) lets you extend your chain safely. Keep building virtual connections toward all three sides.
- **Balance your expansion toward all three sides** — focusing on only two sides early is wasteful if the third side is not addressed. Keep your extending stones roughly equal distance from all three sides.
- **Cut the opponent's bridges** — identifying and taking the key cell of the opponent's virtual connection destroys their only clean path to a side. Fight for these key cells before the opponent locks them down.
- **Use the swap rule to balance first-move advantage** — Y is usually played with a swap rule. Open with a stone near the center of mass that you would be happy to defend from either side.

## Engines & current best play

- **Strongest known program(s):** MoHex (adapted for Y) and other MCTS/neural-network programs for hex-family games; no single dominant open-source engine dedicated specifically to Y is publicly well-known to the cataloguer.
- **Strength:** Strong amateur to competitive; engines are stronger than most human players.
- **Where the proof / tablebase lives (if solved):** Ultra-weak solution via strategy-stealing; small boards weakly solved by exhaustive search. See [Schensted & Titus (1975)](../references.md#schensted-titus1975).
- **Notes:** Y is the "purest" connection game — the three-side condition means no pairing arguments based on two-side symmetry apply, yet the no-draw property plus strategy-stealing fully settles the game's value.

## Complexity

Comparable to Hex of similar board size; generalised Y is PSPACE-hard.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Y_(game))
- [Schensted, C. & Titus, C. (1975). *Mudcrack Y and Poly-Y*.](../references.md#schensted-titus1975)
- [Gale, D. (1979). *The Game of Hex and the Brouwer Fixed-Point Theorem*.](../references.md#gale1979)

## See also

- [Hex](hex.md) · [Havannah](havannah.md) · [TwixT](twixt.md)
- Lexicon: [strategy-stealing argument](../lexicon/README.md#strategy-stealing) · [ultra-weakly solved](../lexicon/README.md#ultra-weakly-solved)
