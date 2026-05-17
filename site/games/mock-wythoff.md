# Mock Wythoff

> A Wythoff-like two-pile game with a slightly modified diagonal move — its
> P-positions are conjectured to follow a Beatty-style sequence, but the
> general theory is incomplete.

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

Mock Wythoff modifies the diagonal move of [Wythoff's game](wythoffs-game.md):
where Wythoff allows removal of the same number from both piles, Mock Wythoff
allows the diagonal move only when the two amounts are nearly but not exactly
equal (or restricts diagonal moves to a parity class). Different authors define
"mock Wythoff" with small variations; specific rule statements differ
**[verify]**.

## Rules

1. Two piles of tokens, sizes (a, b).
2. On your turn, pick any one of:
   - Remove any positive number from a single pile (Nim move);
   - Remove (k, k+1) tokens (or some other diagonal-with-offset move),
     depending on the variant.
3. The player who takes the last token wins (normal play).

## Solution status

Partially solved. For specific variants of Mock Wythoff the **P-positions** can
be written using Beatty sequences with irrational moduli closely related to the
golden ratio, with proofs by induction analogous to Wythoff's classical
analysis. A clean general theory matching the elegance of plain Wythoff has not,
to this archive's knowledge, been published; treat detailed value claims as
**[verify]**.

## Consensus on optimal play

- **Compute P-positions by induction** — for any specific rule set, enumerate P-positions from (0,0) upward: (a,b) is a P-position if no move from (a,b) lands on a P-position; the pattern becomes recognisable quickly for small piles.
- **In Wythoff-like games, steer toward the P-set** — the P-positions in Mock Wythoff form a sparse set, likely following a Beatty-sequence pattern similar to Wythoff's (floor(nφ), floor(nφ²)); from a winning position, any move that reaches a P-position wins.
- **The offset diagonal move is the key tactical tool** — the modified diagonal (e.g., remove (k, k+1)) is the move that differs from ordinary Nim; use it to reach specific pile-difference targets that land on P-positions.
- **Pile differences matter** — in Wythoff-family games, the difference |a − b| between pile sizes plays a role analogous to a pile count in regular Nim; keep track of differences as you enumerate P-positions.
- **When in doubt, enumerate small cases and look for periodicity** — the P-position table for reasonable pile sizes is quickly computed; once the pattern is recognised, it serves as a decision rule for the rest of the game.

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
