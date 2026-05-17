# Cram

> The impartial version of Domineering: both players place dominoes in either
> orientation.

| Field | Value |
|-------|-------|
| Also known as | Plugg, Dots-and-Pairs |
| Players | 2 |
| Type | Impartial combinatorial game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Partially solved (parity arguments + computed nim-values for many boards) |
| **Game-theoretic value** | Depends on board; many boards settled by symmetry parity |
| Year solved | Ongoing |
| Solved by | Various; framework in *Winning Ways* |
| State-space complexity | Depends on board dimensions |
| Game-tree complexity | Depends on board dimensions |
| **Playable** | cram |

## Description

Played on a rectangular grid. **Both** players place 1×2 dominoes in **either**
orientation (horizontal or vertical). Since both have the same moves, Cram is
[impartial](../lexicon/README.md#impartial-game). The player unable to move loses.

## Solution status

Cram is **partially solved**. Two ingredients give a lot for free:

- **Symmetry strategy.** On boards with both dimensions even, the second player
  wins by central-point reflection; on boards with exactly one even dimension,
  the first player wins by playing the centre domino and then reflecting. So
  *all even-related boards are settled by a one-line parity argument.*
- For the remaining (odd×odd) boards, [nim-values](../lexicon/README.md#nim-value)
  have been computed by machine for many sizes, settling them individually.

There is no general closed form for all boards, so the game as a whole is not
solved — but a large fraction of board sizes are, and the easy ones fall to pure
symmetry.

## Consensus on optimal play

- **On even×even boards, second player wins by central-reflection** — after any first-player domino placement, the second player places the rotationally symmetric (180°) domino; this strategy guarantees the second player always has a legal move as long as the first player does.
- **On odd×even boards (one dimension odd, one even), first player wins by playing the centre domino first, then reflecting** — placing the domino on the central axis removes the symmetry centre and lets first player adopt the same reflection strategy for the remainder.
- **For odd×odd boards, consult computed nim-value tables** — parity arguments do not directly settle these; the winner is determined by the nim-value of the position, which has been computed by machine for many specific sizes.
- **Blocking open spaces is as important as placing efficiently** — a domino that creates two isolated single squares (unable to fit a 1×2 domino) is often a strong move because it reduces the opponent's future options significantly.
- **In late-game tight positions, count remaining placements** — when only a few regions remain, count exactly how many dominoes can fit in each; the player who leaves the opponent with an even total of remaining moves wins.

## Engines & current best play

- **Strongest known program(s):** No widely-distributed dedicated Cram engine known to the cataloguer; nim-value computations for specific boards appear in academic research.
- **Strength:** Perfect on symmetry-settled boards (by the mirroring strategy); computed-optimal for boards whose nim-values have been tabulated.
- **Where the proof / tablebase lives (if solved):** Symmetry strategy and partial results in [Berlekamp, Conway & Guy (2001)](../references.md#bcg2001).
- **Notes:** Cram nicely illustrates how symmetry arguments can solve a large class of positions without any search; the remaining odd×odd cases are an ongoing area of combinatorial game theory research.

## Complexity

Even-related boards: trivial. Odd×odd boards: nim-value computation grows quickly
with size.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Cram_(game))
- [Berlekamp, Conway & Guy (2001). *Winning Ways for Your Mathematical Plays*.](../references.md#bcg2001)

## See also

- [Domineering](domineering.md) (partisan sibling) · [Nim](nim.md)
- Lexicon: [impartial game](../lexicon/README.md#impartial-game) · [nim-value](../lexicon/README.md#nim-value)
