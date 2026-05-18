# Hackenbush

> A cutting game with colored edges. The game's positions can be described using surreal numbers, which is a kind of arithmetic for games.

| Field | Value |
|-------|-------|
| Also known as | Hackenbush (Blue-Red, Blue-Red-Green variants) |
| Players | 2 |
| Type | Partisan combinatorial game (Green Hackenbush is impartial) |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Strongly solved (as a theory) |
| **Game-theoretic value** | Any position has a computable CGT value (a surreal number, or a value with infinitesimals/nimbers) |
| Year solved | 1976 |
| Solved by | John H. Conway (theory); Berlekamp, Conway & Guy |
| State-space complexity | Depends on the picture |
| Game-tree complexity | Depends on the picture |
| **Playable** | hackenbush |

## Description

A drawing of colored line segments ("edges") connected to the ground. In Blue-Red Hackenbush, one player may remove blue edges, the other removes red edges. In Green Hackenbush, all edges are green and either player may remove any edge. Removing an edge also removes anything that is no longer connected to the ground. The player who cannot move loses.

## Solution status

Hackenbush is **strongly solved as a theory**: every position has an exactly
computable combinatorial-game value, and from that value the winner (and how
much "in hand" each side is) follows immediately.

- **Blue-Red Hackenbush** values are exactly the [surreal numbers](../lexicon/README.md#surreal-number);
  a string of edges evaluates by a simple sign-expansion rule, and arbitrary
  pictures add. This is the historical origin of surreal numbers in
  [Conway (1976)](../references.md#conway1976).
- **Green Hackenbush** is [impartial](../lexicon/README.md#impartial-game); its
  values are [nimbers](../lexicon/README.md#nim-value), computed by the
  "colon" and "fusion" principles for trees and general graphs.
- **Blue-Red-Green** combines both, yielding values with numbers,
  infinitesimals, and nimbers.

Hackenbush is "solved" in the strongest theoretical sense — there is a complete
calculus — even though evaluating a specific large picture can still take work.

## Consensus on optimal play

- **Blue-Red strings: read the value step by step** — in a vertical string of edges, each edge is like a bit (Blue = positive step, Red = negative step). The value is found by reading the string as a kind of number. Remove whichever edge shifts the total value most in your favor.
- **Trees: evaluate from the bottom up** — the "colon principle" lets you replace any branch with its game value (a Grundy value for Green edges, or a regular game value for Blue-Red). Work from the leaves to the root rather than the other way around.
- **Cycles: apply the fusion principle** — in Green Hackenbush, any loop (cycle) contributes a value equal to its length modulo 2 (odd loop has value 1, even loop has value 0). Merge the loop into a single point connected to the ground.
- **Blue-Red: aim for a positive total value as Blue, negative as Red** — if the sum of all component values is positive, Blue wins regardless of who moves first. The size of the number tells you how many "free moves" you have.
- **Balance losing components against winning ones** — if your position has a component with a bad value (negative for Blue), try to make a move in an equally good component to cancel it out. Balancing values is the arithmetic of Hackenbush strategy.

## Engines & current best play

- **Strongest known program(s):** CGSuite (Aaron Siegel) — a general CGT toolkit that evaluates Hackenbush positions exactly.
- **Strength:** Exact solution for any position that can be represented; no uncertainty remains.
- **Where the proof / tablebase lives (if solved):** [Conway (1976)](../references.md#conway1976) and [Berlekamp, Conway & Guy (2001)](../references.md#bcg2001) contain the complete theory.
- **Notes:** Hackenbush is "solved" in the deepest theoretical sense; every position has an exact surreal/nimber value and optimal play follows mechanically.

## Complexity

Evaluation cost depends on the picture; trees are easy, general graphs require
the fusion principle.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Hackenbush)
- [Conway, J. H. (1976). *On Numbers and Games*.](../references.md#conway1976)
- [Berlekamp, Conway & Guy (2001). *Winning Ways for Your Mathematical Plays*.](../references.md#bcg2001)

## See also

- [Nim](nim.md) · [Domineering](domineering.md) · [Toads and Frogs](toads-and-frogs.md)
- Lexicon: [surreal number](../lexicon/README.md#surreal-number) · [combinatorial game theory](../lexicon/README.md#combinatorial-game-theory)
