# Toads and Frogs

> A one-row game where Toads move right and Frogs move left. Some starting positions are solved, but no general solution exists.

| Field | Value |
|-------|-------|
| Also known as | Toads-and-Frogs |
| Players | 2 |
| Type | Partisan combinatorial game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Partially solved (specific position families) |
| **Game-theoretic value** | Known for several families; no full classification |
| Year solved | — (introduced 1982; partial results ongoing) |
| Solved by | John H. Conway (game); Jeff Erickson and others (partial results) |
| State-space complexity | Depends on strip length |
| Game-tree complexity | Depends on strip length |
| **Playable** | toads-and-frogs |

## Description

Played on a single row of spaces. One player controls Toads (which move to the right), and the other controls Frogs (which move to the left). A piece may step into a neighboring empty cell in its direction, or jump over a single opposing piece into an empty cell beyond. A player who cannot move loses.

## Solution status

Toads and Frogs is **partially solved**. Conway introduced it in
[*Winning Ways*](../references.md#bcg2001) precisely to exercise the CGT value
calculus, and it is a famous source of positions with subtle values. Jeff
Erickson and others determined exact values for several infinite *families* of
starting positions and posed a list of open problems; some of those have since
been resolved and others remain open. There is no complete classification of
all starting positions, so the game as a whole is unsolved — but it is a
well-studied partially-solved case.

## Consensus on optimal play

- **Break the row into separate sections** — the row often splits into independent segments separated by gaps. Think about each segment on its own, and play in the segment where you have the most to gain.
- **Jumps are usually better than steps** — a jump removes the jumped piece as a blocker while also advancing your piece two spaces. Prioritize jumps unless a step sets up a future jump chain.
- **Avoid head-to-head deadlocks** — when a Toad and Frog face each other with no room to jump, they are both stuck. Do not create this situation unless it benefits you (for example, by locking in an opponent's piece).
- **Focus on the most valuable remaining moves** — as the row fills up, some moves are much more valuable than others. Always respond to the opponent's most valuable available move.
- **Symmetric positions favor the second player** — if the row is symmetric (equal numbers of Toads and Frogs arranged as mirror images), the second player can often mirror the first player's moves to keep control. The first player must break the symmetry to gain an advantage.

## Engines & current best play

- **Strongest known program(s):** No game-specific public engine; positions are evaluated with CGT software (e.g., Combinatorial Game Suite) or custom surreal-number implementations.
- **Strength:** Not benchmarked against humans; the interest is theoretical.
- **Where the proof / tablebase lives (if solved):** Partial — families solved in *Winning Ways* ([../references.md#bcg2001](../references.md#bcg2001)) and Erickson's *New Toads and Frogs results* (1996).
- **Notes:** A complete classification of all starting positions remains an open problem in combinatorial game theory.

## Complexity

Grows with strip length; the interest is theoretical rather than computational.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Toads_and_Frogs)
- [Berlekamp, Conway & Guy (2001). *Winning Ways for Your Mathematical Plays*.](../references.md#bcg2001)
- J. Erickson (1996). *New Toads and Frogs results*. In *Games of No Chance*. **[verify]**

## See also

- [Hackenbush](hackenbush.md) · [Clobber](clobber.md) · [Domineering](domineering.md)
- Lexicon: [partisan game](../lexicon/README.md#partisan-game) · [combinatorial game theory](../lexicon/README.md#combinatorial-game-theory)
