# Sim

> Two players take turns drawing colored lines between six dots. The first person who draws a triangle in their own color loses.

| Field | Value |
|-------|-------|
| Also known as | The game of Sim |
| Players | 2 |
| Type | Achievement/avoidance game on a graph |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Weakly solved |
| **Game-theoretic value** | Second-player win |
| Year solved | 1974 |
| Solved by | E. Mead, A. Rosa & C. Huang |
| State-space complexity | 3^15 colourings of the 15 edges (small) |
| Game-tree complexity | Small enough for exhaustive analysis |
| **Playable** | sim |

## Description

The game uses six dots, each connected to every other dot by a line (15 lines total). Players take turns coloring a line in their own color. If a player is forced to complete a triangle where all three sides are their own color, that player loses.

Because of a mathematical rule called Ramsey's theorem, no matter how you color the 15 lines with two colors, there will always be at least one triangle of a single color. This means Sim can never end in a draw — someone will always lose.

## Solution status

Sim is **weakly solved**: [Mead, Rosa & Huang (1974)](../references.md#mead-sim1974)
proved that with perfect play the **second player wins**. The game is small
enough (15 edges, three states each) that the result has since been confirmed
by exhaustive computer search many times.

A complete, human-memorable winning strategy for the second player is not
especially simple, which is why Sim remains playable in practice despite being
solved — most casual players cannot execute the winning line.

## Consensus on optimal play

- **Second player wins with perfect play** — this is mathematically proven. If you are the first player, your only chance is that the second player makes a mistake.
- **Avoid having two lines of the same triangle** — before each move, check how many triangles you already have two sides of. Coloring the third side of any such triangle means you lose immediately.
- **Watch which triangles the opponent is close to completing** — if the opponent has two sides of a triangle, it is safe to color the third side (since it would be a triangle in the opponent's color, which hurts them, not you). But doing so wastes a turn for both players.
- **Force the opponent into a no-win situation** — the second-player winning strategy works by setting up the board so that every line the first player colors either creates a triangle for the first player or gives the second player a safe response.
- **A draw is impossible** — because of Ramsey's theorem, all 15 lines will eventually be colored and someone will have a triangle. Never try to "play for a draw."

## Engines & current best play

- **Strongest known program(s):** Complete exhaustive-search solvers (the game has only 15 edges); any correct minimax over the small game tree plays perfectly.
- **Strength:** Perfect play trivially achievable by any exhaustive search.
- **Where the proof / tablebase lives (if solved):** [Mead, Rosa & Huang (1974)](../references.md#mead-sim1974); [Wikipedia](https://en.wikipedia.org/wiki/Sim_(game))
- **Notes:** The game is solved but is still competitive among humans because the winning strategy is non-trivial to memorise.

## Complexity

Tiny by modern standards — the full game tree is exhaustively searchable.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Sim_(game))
- [Mead, E., Rosa, A. & Huang, C. (1974). *The game of Sim: A winning strategy for the second player*.](../references.md#mead-sim1974)

## See also

- [Hexapawn](hexapawn.md) (another small second-player win) · [Bridg-it](bridg-it.md)
- Lexicon: [weakly solved](../lexicon/README.md#weakly-solved) · [first-player advantage](../lexicon/README.md#first-player-advantage)
