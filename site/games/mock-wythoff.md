# Mock Wythoff

> A two-pile game like Wythoff but with a slightly different diagonal move. Its losing positions probably follow a Beatty pattern, but the full theory is not complete.

| Field | Value |
|-------|-------|
| Also known as | Mock Wythoff Nim |
| Players | 2 |
| Type | Impartial two-pile game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Partial / largely characterised **[verify]** |
| **Game-theoretic value** | First-player win except on a sparse P-set |
| Year solved | — |
| Solved by | — |
| State-space complexity | Two-pile |
| Game-tree complexity | Small |
| **Playable** | mock-wythoff |

## Description

Mock Wythoff is a variation of [Wythoff's game](wythoffs-game.md) that changes the diagonal move. In regular Wythoff you can remove the same number from both piles; in Mock Wythoff the diagonal move only works when the two piles are close but not exactly equal (or is restricted in some other way). Different sources define "Mock Wythoff" in slightly different ways, so **[verify]** the exact rules for the version you are playing.

## Rules

1. Two piles of tokens, with sizes (a, b).
2. On your turn, you can do one of these:
   - Remove any number of tokens from a single pile (like regular Nim).
   - Remove (k, k+1) tokens (one more from the larger pile), or some other offset diagonal move, depending on the variant.
3. The player who takes the last token wins (normal play).

## Solution status

Partially solved. For specific variants of Mock Wythoff the **P-positions** can
be written using Beatty sequences with irrational moduli closely related to the
golden ratio, with proofs by induction analogous to Wythoff's classical
analysis. A clean general theory matching the elegance of plain Wythoff has not,
to this archive's knowledge, been published; treat detailed value claims as
**[verify]**.

## Consensus on optimal play

- **Find losing positions by working upward from (0,0)** — for any specific set of rules, start from the smallest piles and work up. A position (a,b) is a losing spot if no possible move from it lands on another losing spot. The pattern becomes clear quickly for small piles.
- **Aim for the losing set** — the losing positions in Mock Wythoff form a sparse set, probably following a Beatty pattern similar to Wythoff's (using the golden ratio). From a winning position, any move that reaches a losing position wins.
- **The offset diagonal move is your special tool** — the modified diagonal (like removing (k, k+1)) is the move that makes this game different from regular Nim. Use it to reach specific pile-difference targets that are losing positions.
- **Pay attention to the difference between piles** — in Wythoff-like games, the difference between the two pile sizes |a - b| matters in a way similar to how pile size matters in regular Nim. Keep track of differences as you figure out the losing positions.
- **When unsure, work out small cases and look for patterns** — the table of losing positions for reasonable pile sizes is quick to compute by hand. Once you see the pattern, it will guide you for the rest of the game.

## Engines & current best play

- **Strongest known program(s):** Any two-pile nim-value enumerator; the P-positions are computable by straightforward retrograde analysis for any pile bound.
- **Strength:** Perfect for specific rule sets once P-positions are enumerated.
- **Where the proof / tablebase lives (if solved):** Partially solved for specific variants; [Berlekamp, Conway & Guy (2001)](../references.md#bcg2001) covers Wythoff variants generally; specific Mock Wythoff publications vary by rule definition.
- **Notes:** The exact rule set of "Mock Wythoff" varies across sources; verify the specific diagonal-move modification before applying any stated P-position formula.

## Complexity

Small: the position graph for any reasonable bound on pile size is enumerable
and the P-positions become recognisably structured very quickly.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Wythoff%27s_game) ([archive](http://web.archive.org/web/20251206112849/https://en.wikipedia.org/wiki/Wythoff%27s_game))
- [Berlekamp, Conway & Guy (2001–2004). *Winning Ways for Your Mathematical Plays*.](../references.md#bcg2001) (general framework)
- [Wythoff (1907). *A modification of the game of Nim*.](../references.md#wythoff1907)

## See also

- [Wythoff's game](wythoffs-game.md) · [Nim](nim.md) · [Fibonacci Nim](fibonacci-nim.md)
- Lexicon: [nim-value](../lexicon/README.md#nim-value) · [Sprague–Grundy theorem](../lexicon/README.md#sprague-grundy-theorem)
