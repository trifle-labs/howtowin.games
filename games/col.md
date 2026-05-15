# Col

> A map-colouring partisan game, fully solved by combinatorial game theory: its
> positions have exact values.

| Field | Value |
|-------|-------|
| Also known as | Col |
| Players | 2 |
| Type | Partisan combinatorial game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Strongly solved (as a theory) |
| **Game-theoretic value** | Every position has an exact CGT value (a number or number-plus-star) |
| Year solved | 1976 |
| Solved by | Colin Vout (game); analysis in Conway / *Winning Ways* |
| State-space complexity | Depends on the map |
| Game-tree complexity | Depends on the map |

## Description

Played on a map (a graph of regions). One player colours regions **blue**, the
other **red**, with the rule that **adjacent regions may not share a colour**
(as in proper map colouring). A player who cannot legally colour a region loses
([normal play](../lexicon/README.md#normal-play-convention)).

## Solution status

Col is **strongly solved as a theory**. [Conway (1976)](../references.md#conway1976)
and [*Winning Ways*](../references.md#bcg2001) showed that every Col position
has an exact combinatorial-game value, and — a notable structural fact — those
values are always either a [number](../lexicon/README.md#surreal-number) or a
number plus the infinitesimal `*` (star). A region already adjacent to both
colours is "dead"; a clever device of *tinting* with a region adjacent to a
colour-of-itself lets the whole position be evaluated by the standard CGT
disjunctive-sum calculus.

So although a particular large map still takes computation to evaluate, the
*game* is solved: there is a complete, exact method to value any position and
play optimally.

## Consensus on optimal play

- **Compute the CGT value of each component, then sum** — a Col position decomposes into independent sub-maps; each has an exact value (a number or number + *); the overall position value is the sum, which determines who wins and by how much.
- **A position with value > 0 is a Left win, < 0 a Right win, = 0 is a second-player win** — reading the numeric CGT value directly gives the game result; no tree search is needed once values are computed.
- **Mark "dead" regions immediately** — a region adjacent to both blue and red is unavailable to either player; identifying and discarding dead regions simplifies the position and avoids wasted computation.
- **Prefer moves that maximise the remaining position's value (for Left) or minimise it (for Right)** — in CGT parlance, Left always wants to leave a position as positive as possible; at each step choose the move from the component that shifts the total sum furthest in your favour.
- **Tinting technique eliminates constrained regions** — a region already adjacent to one colour can be replaced by a simpler representation (its "tint"); applying this before summing reduces the position to its canonical form.

## Engines & current best play

- **Strongest known program(s):** No dedicated Col engine known to the cataloguer; symbolic CGT tools (e.g., CGSuite) can evaluate arbitrary Col positions analytically.
- **Strength:** Perfect — any position is solvable exactly by the CGT value computation method; no game-tree search required.
- **Where the proof / tablebase lives (if solved):** [Conway (1976)](../references.md#conway1976) and [Berlekamp, Conway & Guy (2001)](../references.md#bcg2001).
- **Notes:** Col is solved as a *theory*: the evaluation method is polynomial for maps with bounded treewidth; for general maps it may be computationally expensive but the method is exact and complete.

## Complexity

Depends on the map; the CGT decomposition keeps it tractable for modest maps.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Col_(game)) ([archive](http://web.archive.org/web/20260503203320/https://en.wikipedia.org/wiki/Col_(game)))
- [Conway, J. H. (1976). *On Numbers and Games*.](../references.md#conway1976)
- [Berlekamp, Conway & Guy (2001). *Winning Ways for Your Mathematical Plays*.](../references.md#bcg2001)

## See also

- [Snort](snort.md) (its "kissing" companion game) · [Hackenbush](hackenbush.md) · [Domineering](domineering.md)
- Lexicon: [partisan game](../lexicon/README.md#partisan-game) · [combinatorial game theory](../lexicon/README.md#combinatorial-game-theory)
