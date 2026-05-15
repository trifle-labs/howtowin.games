# Sim

> A Ramsey-theory game: every full game must produce a triangle, and the player
> forced to make one loses.

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

## Description

Six dots are drawn (the vertices of a complete graph K₆). Players alternately
colour one of the 15 edges, each using their own colour. A player who is forced
to complete a triangle **in their own colour** loses.

Because Ramsey's theorem gives R(3,3) = 6, *any* 2-colouring of all 15 edges of
K₆ contains a monochromatic triangle — so Sim can never end in a draw. Someone
must lose.

## Solution status

Sim is **weakly solved**: [Mead, Rosa & Huang (1974)](../references.md#mead-sim1974)
proved that with perfect play the **second player wins**. The game is small
enough (15 edges, three states each) that the result has since been confirmed
by exhaustive computer search many times.

A complete, human-memorable winning strategy for the second player is not
especially simple, which is why Sim remains playable in practice despite being
solved — most casual players cannot execute the winning line.

## Consensus on optimal play

- **Second player wins with perfect play** — the result is proven; as first player your only hope is an opponent error in the 15-edge game.
- **Avoid contributing two edges to the same triangle** — before each move, count how many triangles you have already "contributed two sides to"; colouring the third side of any such triangle is an immediate loss.
- **Track your opponent's dangerous triangles** — monitor which triangles the opponent has two sides of; completing one of those for them (on your colour) is not dangerous, but it wastes the opponent's turn when they must also avoid their own completions.
- **Force the opponent into a "Zugzwang"** — the second-player strategy works by maintaining a position where every edge the first player colours either completes a first-player triangle or creates a situation where the second player can respond to maintain safety.
- **A draw is impossible** — R(3,3)=6 guarantees that all 15 edges must be coloured before the game ends and someone must have a monochromatic triangle; never try to "play for a draw."

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
