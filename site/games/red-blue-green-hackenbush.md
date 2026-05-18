# Red-Blue-Green Hackenbush

> Hackenbush with three colours of edges — a game where different players control different edges. Its values include switches and require the full surreal number system.

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

Hackenbush is played on a drawing (graph) attached to "the ground." In RBG Hackenbush each line is coloured **blue** (one player's), **red** (the other player's), or **green** (either player's). When you remove a line, any part of the drawing that is no longer connected to the ground falls off. The fact that different players can remove different colours makes this game much richer in values than the all-green [Hackenbush](hackenbush.md) where either player can cut anything.

## Rules

1. A drawing with one or more points connected to the ground and lines coloured blue, red, or green is given.
2. One player's moves: remove a blue or green line. The other player's moves: remove a red or green line.
3. After removing a line, any part of the drawing no longer connected to the ground falls off too.
4. The player who cannot move loses (normal play).

## Solution status

Strongly solved as a theory. Each RBG-Hackenbush position has a well-defined
**game value** in Conway's surreal-number system; the value of a string is
computed by the "sign-expansion" / Berlekamp's algorithm, and disjoint
components add as games. Green edges contribute *star* (a nimber); switches and
infinitesimals appear naturally in mixed positions. See
[*Winning Ways* / On Numbers and Games](../references.md#bcg2001).

## Consensus on optimal play

- **Figure out the value of each separate part** — disconnected parts of the drawing add together. Analyse each connected piece on its own and combine the values.
- **Blue/Red lines on strings have simple number values** — a path of blue and red lines from the ground can be turned into a number using a special method (sign-expansion). Memorise short patterns and use the algorithm for longer ones.
- **Green lines add special star values** — a single green line has a value called star. Groups of green lines in a tree produce larger values that combine by XOR. Add these to the blue/red value.
- **Play the biggest-value part first** — when adding up several parts, the move with the largest gap between the two players' values is usually the right choice to play first.
- **Time switches carefully** — a switch position gives an advantage to the player who moves there. But if other parts of the board are more urgent, do not waste your move on a switch too early.

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
