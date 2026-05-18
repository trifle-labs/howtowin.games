# Col

> A map-coloring game where players take turns coloring regions. Fully solved by combinatorial game theory.

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
| **Playable** | col |

## Description

Played on a map (a drawing of connected regions). One player colors regions
**blue**, the other **red**, with the rule that **neighboring regions cannot
share the same color** (like a proper map coloring). A player who cannot
legally color any remaining region loses.

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

- **Figure out the value of each separate part, then add them up** — a Col position splits into independent sub-maps. Each sub-map has an exact value (a number or a number plus star). Adding them up gives the overall position value, which tells you who wins.
- **Positive value means one player wins, negative means the other wins, zero means the second player wins** — reading the numeric value directly tells you the game result. No searching through moves needed once values are known.
- **Mark "dead" regions right away** — a region next to both blue and red is unavailable to either player. Spotting and ignoring dead regions simplifies the position.
- **Choose moves that maximize the remaining value (if you are one player) or minimize it (if you are the other)** — in game theory terms, one player always wants to leave the position as positive as possible. On each turn, pick the move that shifts the total value furthest in your favor.
- **Use "tinting" to simplify** — a region already next to just one color can be replaced by a simpler version (its "tint"). Doing this before adding up values makes the position easier to work with.

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
