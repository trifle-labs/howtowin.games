# Six Men's Morris

> A mid-sized morris game; like its bigger sibling, it comes out a draw with
> perfect play.

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

Played on a board of two concentric squares with connecting midlines (16
points, **no** diagonals). Each player has six pieces. As in all morris games
there is a **placement phase** then a **movement phase**; forming a *mill*
(three in a line) lets a player remove an enemy piece. A player reduced to two
pieces, or unable to move, loses.

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

- **Placement shapes the outcome** — as in Nine Men's Morris, place all six pieces to threaten two different mills simultaneously; an opponent who can only block one opening will concede the other.
- **Two-mill configurations are the key weapon** — a pattern where one piece slides back and forth between two mills generates a forced capture every turn; establishing this before the opponent can counter is the decisive strategic goal.
- **The 16-point board without diagonals is more constrained** — with only two squares and midlines (no diagonal connections), mill configurations are limited; memorise the possible double-mill patterns on the smaller board.
- **Force the opponent below three pieces to win** — a player reduced to two pieces loses; plan piece-removal to approach this threshold rather than removing randomly.
- **Draw with correct play** — the game is a draw under mutual perfect play; look for opponent errors in the placement phase, as errors there are the most common decisive mistakes.

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
