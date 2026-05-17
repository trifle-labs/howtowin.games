# Hackenbush

> The game that taught combinatorial game theory how to do arithmetic — its
> positions *are* numbers.

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

A drawing of coloured line segments ("edges") connected to the ground. In
**Blue-Red Hackenbush** one player may remove blue edges, the other red edges;
in **Green Hackenbush** all edges are green and either player may remove any.
Removing an edge also removes anything no longer connected to the ground. Under
[normal play](../lexicon/README.md#normal-play-convention) the player unable to
move loses.

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

- **Blue-Red strings: read the value by sign expansion** — in a vertical string, each edge is a bit (Blue = positive step, Red = negative step); the value is the surreal number given by reading the string as a binary fraction after the first sign change; remove whichever edge collapses the most positive (or negative) value.
- **Trees: evaluate bottom-up** — the colon principle lets you replace any branch with its nimber (Green) or game value (Blue-Red); work leaf-to-root rather than root-to-leaf.
- **Cycles: apply the fusion principle** — in Green Hackenbush, any cycle contributes a nimber equal to its length modulo 2 (odd cycle → nimber 1, even cycle → nimber 0); merge vertices on the cycle to a single ground-connected node.
- **Blue-Red: aim for positive total value as Blue, negative as Red** — if the sum of all component values is positive, Blue wins under optimal play regardless of who moves first; the magnitude is the "number of free moves" in hand.
- **Match losing components** — if your position has a negative component (bad for you), try to make a move in an equal-and-opposite good component to cancel it; hedging is the arithmetic of Hackenbush strategy.

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
