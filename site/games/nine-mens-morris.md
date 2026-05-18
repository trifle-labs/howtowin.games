# Nine Men's Morris

> One of the oldest board games still played. It was solved in 1993: the result is a draw.

| Field | Value |
|-------|-------|
| Also known as | Mills, Merels, Nine Man Morris |
| Players | 2 |
| Type | Partisan placement-and-movement ("mill") game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Weakly solved |
| **Game-theoretic value** | Draw |
| Year solved | 1993 |
| Solved by | Ralph Gasser |
| State-space complexity | ~10^10 (about 10 billion positions) |
| Game-tree complexity | ~10^50 |
| **Playable** | nine-mens-morris |

## Description

Played on a board of three nested squares connected by lines (24 points total). Each player has nine pieces. In the **placement phase** players take turns putting all nine pieces on the board. In the **movement phase** they slide a piece to a neighboring empty point. Forming a *mill* (three pieces in a row on a marked line) lets you remove an enemy piece. A player with only two pieces left, or who cannot move, loses. (A "flying" rule — letting pieces jump anywhere — is common when a player is down to three pieces.)

## Solution status

Nine Men's Morris is **weakly solved**. [Gasser (1996)](../references.md#gasser1996)
solved it by building complete endgame databases through
[retrograde analysis](../lexicon/README.md#retrograde-analysis) and then
performing an alpha-beta search from the opening that meets those databases. The
result: with perfect play by both sides the game is a **draw**.

It was, at the time, one of the more complex games to be solved (~10^10
positions), and remains a standard reference point for the
retrograde-analysis-plus-search methodology later used on larger games.

## Consensus on optimal play

- **Placement decides the game** — place pieces to set up two possible mills rather than just one. If the opponent must block one line, the other stays open.
- **Go for double mills** — if you can make a piece slide back and forth between two mill positions, you get a forced capture every turn, which overpowers any defence.
- **Remove the opponent's dangerous pieces first** — pieces that cannot form mills have little value. Remove the ones that are part of active mill threats first.
- **Keep pieces active near the centre** — the four corner points of the inner square connect to more potential mills than the edge points do.
- **Never drop to two pieces** — manage captures so you stay above three pieces. Once you are down to three and have to use the "flying" rule (jumping anywhere), it is very hard to recover from a disadvantage.
- **Draw with correct play** — neither side can force a win against good defence. The goal is to avoid mistakes in the placement phase.

## Engines & current best play

- **Strongest known program(s):** Gasser's solver (Ralph Gasser, University of Berne, 1993) — retrograde analysis + alpha-beta search.
- **Strength:** Perfect play (weakly solved); any implementation of Gasser's database plays perfectly.
- **Where the proof / tablebase lives (if solved):** [Gasser (1996)](../references.md#gasser1996)
- **Notes:** The solving databases are not publicly downloadable, but the result (draw) is universally accepted.

## Complexity

State-space ~10^10; game-tree ~10^50
([van den Herik et al., 2002](../references.md#vandenherik2002)).

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Nine_men%27s_morris) ([archive](http://web.archive.org/web/20260328233608/https://en.wikipedia.org/wiki/Nine_Men%27s_Morris))
- [Gasser, R. (1996). *Solving Nine Men's Morris*.](../references.md#gasser1996)
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)

## See also

- [Three Men's Morris](three-mens-morris.md) · [Six Men's Morris](six-mens-morris.md) · [Twelve Men's Morris](twelve-mens-morris.md)
- Lexicon: [weakly solved](../lexicon/README.md#weakly-solved) · [retrograde analysis](../lexicon/README.md#retrograde-analysis) · [endgame tablebase](../lexicon/README.md#endgame-tablebase)
