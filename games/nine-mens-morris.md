# Nine Men's Morris

> One of the oldest board games still played — and weakly solved in 1993 as a
> draw.

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

## Description

Played on a board of three concentric squares joined by midlines (24 points).
Each player has nine pieces. In the **placement phase** players place all nine
pieces alternately; in the **movement phase** they slide a piece to an adjacent
empty point. Forming a *mill* (three pieces in a marked line) removes an enemy
piece. A player reduced to two pieces, or with no legal move, loses. (A "flying"
rule for a player down to three pieces is common.)

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

- **Placement determines the game** — place pieces to set up two potential mills rather than a single one; an opponent who must block one line will leave the other open.
- **Prioritise double mills** — a configuration where one piece can slide back and forth between two mills generates a forced removal each turn, overwhelming any defence.
- **Remove the opponent's "flying" candidate last** — pieces that can't form mills have no positional value; remove pieces that are part of active mill threats first.
- **Keep three pieces active near the centre junctions** — the four corner points of the inner square participate in more potential mills than edge midpoints.
- **Never allow yourself to be reduced to two pieces** — manage captures to stay above three pieces; once in "flying" mode the game is very hard to rescue from a deficit.
- **Draw with correct play** — neither side can force a win against accurate defence; objective is not to err in the placement phase.

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
