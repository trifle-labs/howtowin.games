# Red-Blue-Green Hackenbush

> Hackenbush with three edge colours — a partisan game whose values introduce
> *switches* and require the full surreal-number machinery.

| Field | Value |
|-------|-------|
| Also known as | RBG Hackenbush, Three-colour Hackenbush |
| Players | 2 (Blue and Red, with neutral Green) |
| Type | Partisan combinatorial game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Strongly solved as a theory (each position has a CGT value) |
| **Game-theoretic value** | Each position has a surreal-number / switch value |
| Year solved | 1976 |
| Solved by | Conway; *Winning Ways* |
| State-space complexity | Exponential in graph size |
| Game-tree complexity | Exponential |
| **Playable** | red-blue-green-hackenbush |

## Description

Hackenbush is played on a graph attached to "the ground." In RBG Hackenbush
each edge is coloured **blue** (Left's), **red** (Right's), or **green**
(either player's). Removing an edge causes any subgraph no longer connected to
the ground to fall off. The partisan moves on differently-coloured edges give a
much richer value space than the impartial Green-only [Hackenbush](hackenbush.md).

## Rules

1. A graph with one or more *ground* vertices and edges coloured blue, red, or
   green is given.
2. Left moves: remove a blue or green edge. Right moves: remove a red or green
   edge.
3. After removing an edge, any subgraph no longer connected to the ground is
   removed too.
4. The player unable to move loses (normal play).

## Solution status

Strongly solved as a theory. Each RBG-Hackenbush position has a well-defined
**game value** in Conway's surreal-number system; the value of a string is
computed by the "sign-expansion" / Berlekamp's algorithm, and disjoint
components add as games. Green edges contribute *star* (a nimber); switches and
infinitesimals appear naturally in mixed positions. See
[*Winning Ways* / On Numbers and Games](../references.md#bcg2001).

## Consensus on optimal play

- **Compute each component's surreal value separately** — disjoint subgraphs add as games; analyse each connected component in isolation and combine by CGT addition.
- **Blue/Red edges on strings have dyadic-rational values** — a Blue-Red path from ground gives value equal to the "sign-expansion" of the edge sequence; memorise short strings and use Berlekamp's algorithm for longer ones.
- **Green edges add nimbers (stars)** — a single green edge contributes *1 (star); groups of green edges in a tree produce larger nimbers by XOR; add these to the Blue-Red value of the position.
- **Play the hottest component first** — in a sum, the move with the highest temperature (half the gap between Left and Right game values) is usually the correct "hot game" choice.
- **Switches require careful timing** — a switch {a | b} should be taken by Left when a > b and it is your turn; converting a switch too early when the rest of the sum is hotter wastes opportunity.

## Engines & current best play

- **Strongest known program(s):** No competitive game-engine; CGT computation tools (e.g. Aaron Siegel's CGSuite) compute positions analytically.
- **Strength:** Exact optimal play via CGT formula for any position whose value can be computed.
- **Where the proof / tablebase lives (if solved):** [Conway (1976)](../references.md#conway1976); [Berlekamp, Conway & Guy (2001)](../references.md#bcg2001)
- **Notes:** RBG Hackenbush is primarily a theoretical framework; no competitive human game has an established engine.

## Complexity

Exponential in general; specific structured families (Hackenbush "strings,"
"flowers") have polynomial value-formulas.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Hackenbush)
- [Conway (1976). *On Numbers and Games*.](../references.md#conway1976)
- [Berlekamp, Conway & Guy (2001–2004). *Winning Ways for Your Mathematical Plays*.](../references.md#bcg2001)

## See also

- [Hackenbush](hackenbush.md) · [Domineering](domineering.md) · [Toads and Frogs](toads-and-frogs.md)
- Lexicon: [surreal number](../lexicon/README.md#surreal-number) · [partisan game](../lexicon/README.md#partisan-game)
