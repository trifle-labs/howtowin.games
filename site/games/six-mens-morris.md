# Six Men's Morris

> A smaller version of Nine Men's Morris played on a board of two connected squares. With perfect play it ends in a draw.

| Field | Value |
|-------|-------|
| Also known as | Six Men's Morris |
| Players | 2 |
| Type | Partisan placement-and-movement ("mill") game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Weakly solved |
| **Game-theoretic value** | Draw **[verify]** |
| Year solved | — (within reach of the methods that solved Nine Men's Morris) |
| Solved by | — |
| State-space complexity | Smaller than Nine Men's Morris |
| Game-tree complexity | Smaller than Nine Men's Morris |
| **Playable** | six-mens-morris |

## Description

Played on a board of two squares (one inside the other) connected by lines at their midpoints — 16 spaces in total, with no diagonal lines. Each player has six pieces. Like other morris games, there is a placement phase (putting pieces on empty spaces) followed by a movement phase (sliding pieces along lines). Forming a "mill" (three pieces in a straight line) lets a player remove one of the opponent's pieces. A player reduced to two pieces, or with no legal moves, loses.

## Solution status

Six Men's Morris is **weakly solved**. It is smaller than
[Nine Men's Morris](nine-mens-morris.md), which was itself weakly solved by
[Gasser (1996)](../references.md#gasser1996) using
[retrograde analysis](../lexicon/README.md#retrograde-analysis); the same
techniques settle the six-piece board comfortably. The reported game-theoretic
value is a **draw** with perfect play.

> **[verify]** — The draw verdict is consistent with the literature on the
> morris family, but a specific primary citation for Six Men's Morris (as
> distinct from Nine Men's Morris) should be added.

## Consensus on optimal play

- **Placement shapes the outcome** — as in Nine Men's Morris, place all six pieces so that you threaten two different mills (three-in-a-rows) at the same time. The opponent can only block one, so you will complete the other.
- **Two-mill configurations are the key weapon** — a setup where one piece slides back and forth between two mills lets you capture a piece every turn. Setting this up before the opponent can stop it is your main goal.
- **The 16-point board without diagonals is more limited** — with only two squares and midline connections (no diagonals), there are fewer ways to form mills. Learn the possible double-mill patterns on this smaller board.
- **Force the opponent below three pieces to win** — a player reduced to two pieces loses. Plan your captures to bring the opponent closer to this threshold.
- **Draw with correct play** — the game is a draw when both players play perfectly. Look for opponent mistakes in the placement phase, as that is where most decisive errors happen.

## Engines & current best play

- **Strongest known program(s):** No game-specific public engine known to the cataloguer; Gasser-style retrograde analysis methods apply directly and are sufficient to build a complete database.
- **Strength:** Not benchmarked publicly; a complete retrograde database would give perfect play.
- **Where the proof / tablebase lives (if solved):** [Gasser (1996)](../references.md#gasser1996) (Nine Men's Morris methodology); no specific Six Men's Morris primary citation confirmed.
- **Notes:** The draw verdict is widely reported but a specific Six Men's Morris primary source should be verified.

## Complexity

Smaller than Nine Men's Morris (which has on the order of 10^10 positions).

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Six_men%27s_morris)
- [Gasser, R. (1996). *Solving Nine Men's Morris*.](../references.md#gasser1996)
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)

## See also

- [Three Men's Morris](three-mens-morris.md) · [Nine Men's Morris](nine-mens-morris.md) · [Twelve Men's Morris](twelve-mens-morris.md)
- Lexicon: [weakly solved](../lexicon/README.md#weakly-solved) · [retrograde analysis](../lexicon/README.md#retrograde-analysis)
