# Y

> A connection game even purer than Hex — every game has a winner, so the first
> player provably wins.

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

Played on a triangular board tiled with hexagons, with three sides. Players
alternately place stones of their colour; a player wins by forming a single
connected chain that touches **all three sides** of the triangle. Hex is in fact
a special case of Y played on a corner of the board.

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

- **Aim for the board's centroid, not its centre cell** — unlike Hex, where the exact centre point is on the shortest path between two sides, Y's three-way connection requirement means the ideal "hub" is roughly equidistant from all three sides; pieces near the board's centre of mass anchor a spanning structure efficiently.
- **Virtual connections reduce the number of required moves** — a virtual connection between two stones (a bridge using two pivots that the opponent cannot simultaneously block) effectively extends your chain safely; maintain virtual connections toward all three sides.
- **All three sides must be reached, so balance your expansion** — focusing on a two-side connection early is wasteful if the third side is unaddressed; ensure your extending stones stay roughly equidistant from all three sides.
- **Cutting the opponent's bridge is often the best move** — taking the single pivot of an opponent's virtual connection destroys their only clean route to a side; identify these pivots and contest them before the opponent solidifies.
- **The swap (pie) rule addresses the first-mover advantage** — Y is typically played with a swap rule; open with a stone that you would be content to defend from either side, usually near the centroid.

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
