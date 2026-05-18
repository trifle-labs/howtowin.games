# Brussels Sprouts

> A game that looks strategic, but the winner is fixed before any move is made. The ultimate strong solution.

| Field | Value |
|-------|-------|
| Also known as | Brussels Sprouts |
| Players | 2 |
| Type | Impartial combinatorial game (topological); a "fake" game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Strongly solved |
| **Game-theoretic value** | Completely determined by the number of starting crosses — no choice affects it |
| Year solved | Folklore (Conway); treated in *Winning Ways* |
| Solved by | John H. Conway; Berlekamp, Conway & Guy |
| State-space complexity | N/A (outcome independent of play) |
| Game-tree complexity | N/A (outcome independent of play) |
| **Playable** | brussels-sprouts |

## Description

A variant of [Sprouts](sprouts.md). The game starts with *n* plus signs (+),
each with four free ends. On a turn, a player draws a curve connecting two
free ends (without crossing any existing lines) and adds a small cross-bar
in the middle of that curve, which creates two new free ends. The player who
cannot move loses.

## Solution status

Brussels Sprouts is **strongly solved** — trivially and completely. A simple
Euler-characteristic argument shows that **every game starting from *n* crosses
lasts exactly 5n − 2 moves**, no matter what either player does. Therefore the
outcome depends only on the parity of 5n − 2: the first player wins iff that
number is odd, i.e. iff *n* is odd.

No move ever matters. Brussels Sprouts is the canonical example of a
**"fake" game** whose result is predetermined — a useful counterpoint to its
genuinely deep cousin [Sprouts](sprouts.md), and a reminder that "strongly
solved" can sometimes mean "there was never anything to solve."

## Consensus on optimal play

- **The winner is decided entirely by how many crosses you start with (*n*)** — every game starting from *n* crosses lasts exactly 5n minus 2 moves, no matter what. If that number is odd (when *n* is odd), the first player wins. If even (*n* is even), the second player wins. No move by either player can change this.
- **There is no strategy** — because the game always lasts the same number of moves regardless of what anyone does, there is simply no "better" or "worse" play. Every legal move leads to the same result as any other.
- **Use this as a teaching example of a fixed-outcome game** — Brussels Sprouts shows that a game can look like it involves decision-making without actually having any strategic depth.

## Engines & current best play

- **Strongest known program(s):** Any program that counts the starting crosses and returns the result in O(1) is "optimal." No game-playing engine is meaningful here.
- **Strength:** Perfect — trivially, since the outcome is computable without any game-tree search.
- **Where the proof / tablebase lives (if solved):** [Berlekamp, Conway & Guy (2001)](../references.md#bcg2001) — Euler-characteristic argument for the fixed game length 5n − 2.
- **Notes:** Brussels Sprouts is the archetypal "predetermined game" in CGT literature; it is useful pedagogically but has no strategic content whatsoever.

## Complexity

Not applicable — the game tree's depth is constant and the value is
play-independent.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Sprouts_(game)) ([archive](http://web.archive.org/web/20260511093257/https://en.wikipedia.org/wiki/Sprouts_(game)))
- [Berlekamp, Conway & Guy (2001). *Winning Ways for Your Mathematical Plays*.](../references.md#bcg2001)

## See also

- [Sprouts](sprouts.md) · [Conway's Soldiers](conways-soldiers.md)
- Lexicon: [strongly solved](../lexicon/README.md#strongly-solved)
