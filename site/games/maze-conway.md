# Maze (Conway)

> A path-tracing game from John Conway's book On Numbers and Games. Fully solved using combinatorial game theory.

| Field | Value |
|-------|-------|
| Also known as | Conway's Maze |
| Players | 2 |
| Type | Partisan combinatorial game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Strongly solved as a theory |
| **Game-theoretic value** | Position-dependent |
| Year solved | 1976 |
| Solved by | Conway |
| State-space complexity | Small per maze |
| Game-tree complexity | Small |
| **Playable** | maze-conway |

## Description

A short instructional game from John Conway's book On Numbers and Games. Players take turns moving a token through a small maze with colored arrows that only certain players may use.

## Rules

1. A directed graph (a network of connected points with arrows) with edges colored blue (L), red (R), or green (either) is given, with a token on a designated start point.
2. Left's moves: follow a blue or green arrow from the current point.
3. Right's moves: follow a red or green arrow.
4. The player unable to move loses.

## Solution status

Strongly solved as a theory. Each maze position has a CGT value computed
recursively; the value algebra is the standard one of *On Numbers and Games*.

## Consensus on optimal play

- **Compute the position value from the end backwards** — points with no outgoing arrows are losses for the player whose turn it is. Work backward from these to assign exact values to each point.
- **Move to the point with the most favorable value** — Left wants to reach a position with the highest Left advantage. Always move to the next point with the value most favorable to you.
- **Green arrows are shared resources** — a green arrow that both players can follow is a flexible move option. Using it yourself denies the opponent a future move, which may be strategically important even if it leads to a less favorable point for you.
- **Dead-end paths for only one player are decisive** — if one player's only remaining moves lead to a dead end while the other still has options, the game is effectively won by the one with remaining moves. Identify such exclusive dead ends early.
- **Every position has an exact game value** — unlike games with luck or hidden information, every Conway Maze position has an exact mathematical value. Two positions with the same value are interchangeable, which allows simplification of compound mazes.

## Engines & current best play

- **Strongest known program(s):** CGSuite (Aaron Siegel) — general CGT toolkit that evaluates any Conway Maze position exactly.
- **Strength:** Perfect; the full theory is a standard application of CGT value calculus.
- **Where the proof / tablebase lives (if solved):** [Conway (1976)](../references.md#conway1976); [Berlekamp, Conway & Guy (2001)](../references.md#bcg2001).
- **Notes:** Conway's Maze is primarily a pedagogical example in CGT; its positions are small by design and the theory is a direct application of the surreal-number value algebra.

## Complexity

Small.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Maze_(solitaire)) ([archive](http://web.archive.org/web/20251230102226/https://en.wikipedia.org/wiki/Maze_(solitaire)))
- [Conway (1976). *On Numbers and Games*.](../references.md#conway1976)
- [Berlekamp, Conway & Guy (2001–2004). *Winning Ways for Your Mathematical Plays*.](../references.md#bcg2001)

## See also

- [Generalized Geography](geography.md) · [Hackenbush](hackenbush.md)
- Lexicon: [partisan game](../lexicon/README.md#partisan-game) · [surreal number](../lexicon/README.md#surreal-number)
