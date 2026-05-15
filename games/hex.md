# Hex

> The connection game that *cannot* be drawn — proven a first-player win, but
> the proof refuses to say how.

| Field | Value |
|-------|-------|
| Also known as | Nash, John, Polygon, Con-tac-tix |
| Players | 2 |
| Type | Partisan connection game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Ultra-weakly solved (standard 11×11); weakly solved for small boards (through ~10×10) |
| **Game-theoretic value** | First-player win (on any symmetric n×n board) |
| Year solved | Ultra-weak: c. 1949 (Nash). Small-board weak solutions: 2000s |
| Solved by | John Nash (strategy-stealing); Jing Yang (7×7–9×9); Hayward's group (8×8–10×10) |
| State-space complexity | ~10^56 (11×11 board) |
| Game-tree complexity | ~10^98 (11×11 board) |

## Description

Played on a rhombic board of hexagons (commonly 11×11). One player connects the
top and bottom edges with a chain of their stones, the other connects left and
right. Players alternately place one stone; stones are never moved or removed.

## Solution status

Hex has a striking split between *value* and *strategy*.

- **Hex cannot end in a draw** — a filled board always contains exactly one
  winning chain ([Gale, 1979](../references.md#gale1979) ties this to the
  Brouwer fixed-point theorem).
- Because there are no draws, the [strategy-stealing argument](../lexicon/README.md#strategy-stealing)
  ([Nash, c. 1949](../references.md#nash-hex)) proves the **first player has a
  winning strategy** on any symmetric board. This makes Hex
  **[ultra-weakly solved](../lexicon/README.md#ultra-weakly-solved)** — the
  value is known — but the proof is non-constructive and exhibits *no*
  strategy.
- **Explicit (weak) solutions** have been found for small boards: Jing Yang
  gave winning strategies for 7×7, 8×8, and 9×9 in the early 2000s, and Ryan
  Hayward's group weakly solved 8×8 ([Henderson, Arneson & Hayward, 2009](../references.md#hayward-hex2009))
  and later 9×9 and 10×10.

The standard **11×11** board is still only ultra-weakly solved: we know the
first player wins, but no full winning strategy is known. (The opening-move
"swap" rule is used in play precisely to neutralise this proven first-player
advantage.)

## Consensus on optimal play

- **Virtual connections are the currency of Hex** — two groups of the same colour are "virtually connected" if they can be joined regardless of the opponent's next move; maintaining virtual connections across the board is the core calculation.
- **The acute corners belong to no one, and to both** — the corner cells are weak entry points for both sides; the critical real estate is the cells adjacent to the corner that control the corner approaches.
- **Ladders and ladder escapes decide games** — a ladder (a forced sequence pushing a chain along an edge) is unavoidable unless a pre-placed "escape" stone breaks it; recognising potential ladders and placing escape stones early is essential.
- **Take the short-path cells** — cells that lie on most shortest winning paths between your two sides have the highest value; prioritise them and contest the opponent's equivalent cells.
- **The swap rule changes first-move selection** — with swap in effect, the first move should be on a moderately strong cell; too-central or too-corner openings will be swapped; the classic swappable cell is the exact centre.
- **Block by building, not by responding** — placing a stone that advances your own connection while also threatening the opponent's chain is more efficient than pure defence; pure response play cedes tempo.

## Engines & current best play

- **Strongest known program(s):** Mohex (Ryan Hayward's group) — Monte Carlo tree search with hex-specific knowledge; MoHex-3HNN adds neural networks.
- **Strength:** Super-human on 11×11; top engines vastly exceed expert human play.
- **Where the proof / tablebase lives (if solved):** 8×8–10×10 weakly solved by Hayward et al. ([Henderson, Arneson & Hayward, 2009](../references.md#hayward-hex2009)); 11×11 ultra-weakly solved (first-player win proven, strategy unknown).
- **Notes:** The swap rule is standard in competitive 11×11 play; without it the first player wins with best play.

## Complexity

State-space ~10^56, game-tree ~10^98 for 11×11
([van den Herik et al., 2002](../references.md#vandenherik2002)). Generalised
Hex is PSPACE-complete.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Hex_(board_game)) ([archive](http://web.archive.org/web/20260511121115/https://en.wikipedia.org/wiki/Hex_(board_game)))
- [Nash, J. — strategy-stealing argument for Hex.](../references.md#nash-hex)
- [Gale, D. (1979). *The Game of Hex and the Brouwer Fixed-Point Theorem*.](../references.md#gale1979)
- [Henderson, Arneson & Hayward (2009). *Solving 8×8 Hex*.](../references.md#hayward-hex2009)
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)

## See also

- [Y](y.md) · [Havannah](havannah.md) · [TwixT](twixt.md) · [Bridg-it](bridg-it.md) · [Chomp](chomp.md)
- Lexicon: [strategy-stealing argument](../lexicon/README.md#strategy-stealing) · [ultra-weakly solved](../lexicon/README.md#ultra-weakly-solved)
