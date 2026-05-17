# Maze (Conway)

> Conway's "Maze" — a partisan path-tracing game from *On Numbers and Games*.

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

A short, instructive partisan game from [Conway's *On Numbers and Games*](../references.md#conway1976):
players take turns moving a token through a small directed maze with edges
coloured for Left, Right, or either.

## Rules

1. A directed graph with edges coloured **blue (L)**, **red (R)**, or **green
   (either)** is given, with a token on a designated start node.
2. Left moves: traverse a blue or green out-edge from the current node.
3. Right moves: traverse a red or green out-edge.
4. The player unable to move loses (normal play).

## Solution status

Strongly solved as a theory. Each maze position has a CGT value computed
recursively; the value algebra is the standard one of *On Numbers and Games*.

## Consensus on optimal play

- **Compute the position value bottom-up from the terminal nodes** — nodes with no out-edges are losses for the player to move (value 0 for the player without moves, computed as a CGT value); work backwards from these to assign exact values to each node.
- **Move to the node with the most negative value (for Left) or most positive value (for Right)** — Left wants to reach a position with the highest Left-advantage; always move to the successor node with the CGT value most favourable to you.
- **Green edges are shared resources** — a green edge that both players can traverse is a flexible move option; capturing it (by traversing it yourself) denies the opponent a future move, which may be strategically important even if it leads to a less favourable node for you.
- **Terminal paths of only one colour are decisive** — if one player's only remaining moves lead to a dead end while the other still has options, the game is effectively won by the one with remaining moves; identify such colour-exclusive dead ends early.
- **The value is an exact CGT number** — unlike heuristic games, every Conway Maze position has an exact surreal-number or nimber value; two positions with the same value are interchangeable, which allows simplification of compound mazes.

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
