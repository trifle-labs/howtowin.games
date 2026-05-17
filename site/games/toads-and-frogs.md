# Toads and Frogs

> A one-dimensional partisan game devised by Conway as a CGT teaching example;
> some position families are solved, a general theory is not.

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

Played on a 1×*n* strip. One player owns "Toads" (which move rightward), the
other "Frogs" (which move leftward). A piece may step into an adjacent empty
cell in its direction, or **jump** over a single opposing piece into an empty
cell beyond. A player unable to move loses
([normal play](../lexicon/README.md#normal-play-convention)).

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

- **Compute the CGT value of each segment independently** — the strip often splits into independent sub-games separated by gaps; evaluate each sub-game's surreal-number or nimber value, sum them, and play in the hottest component.
- **Jumps are usually stronger than steps** — a jump removes the jumped piece from blocking your future moves while also advancing your own piece two cells; prioritise jumps unless the step sets up a future jump chain.
- **Avoid deadlock configurations** — a Toad and a Frog facing each other with no room to jump are permanently frozen; do not create a head-to-head standoff in a sub-strip unless it benefits you (e.g., locks in an opponent's piece).
- **Temperature guides endgame priorities** — as the strip fills, identify which remaining moves have the highest temperature (i.e., whose value differs most depending on who goes next); always answer your opponent's move in the highest-temperature remaining component.
- **Symmetric positions are second-player wins** — if the strip is symmetric (equal number of Toads and Frogs in mirror arrangement), the second player can often mirror to maintain balance; the first player must break symmetry profitably.

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
