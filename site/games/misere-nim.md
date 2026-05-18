# Misère Nim

> Like Nim, but the player who takes the last object loses instead of wins. Solved with a small twist on Bouton's rule.

| Field | Value |
|-------|-------|
| Also known as | Last-player-loses Nim |
| Players | 2 |
| Type | Impartial combinatorial game (misère play) |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Strongly solved |
| **Game-theoretic value** | Depends on heap configuration (see below) |
| Year solved | 1901 |
| Solved by | Charles L. Bouton |
| State-space complexity | Depends on starting heaps |
| Game-tree complexity | Depends on starting heaps |
| **Playable** | misere-nim |

## Description

This is the same as [Nim](nim.md) — piles of objects where you remove any number from one pile per turn — but with one important change: the player who takes the *last* object **loses** instead of winning.

## Solution status

Misère Nim is **strongly solved**, and the solution is almost as simple as
normal-play Nim. [Bouton (1901)](../references.md#bouton1901) showed: play as in
normal Nim (move to [nim-sum](../lexicon/README.md#nim-sum) 0) *until* your move
would leave only heaps of size 1. At that point, move so as to leave an **odd**
number of size-1 heaps. Equivalently: with all heaps of size ≤ 1, the player to
move wins iff the number of heaps is even; with some heap of size ≥ 2, the
normal-play nim-sum rule applies unchanged.

Misère Nim is famously the *easy* case: misère play of impartial games is in
general vastly harder than normal play, and a full misère theory
(Conway's *genus theory*, later misère quotients) was needed for other games.
Nim is the exception where the misère fix is a one-line special case.

## Consensus on optimal play

- **If any pile has size 2 or more, play exactly like normal Nim** — calculate the XOR (a special math operation) of all pile sizes and make a move that brings the result to 0. This is the same as normal-play Nim until only size-1 piles remain.
- **When only size-1 piles remain, leave an odd number** — here is the single exception: once all piles are just 1 object each (or would be after your move), you want to leave an **odd** number of them. The player facing an odd number of single-object piles has to take one, leaving an even number for the other player, who can keep taking one each turn until the opponent is forced to take the last one and lose.
- **Watch for the switch point** — plan ahead for when the piles will all be size 1. Your last move with a pile of size 2 or more should also set up the correct odd/even count of size-1 piles.
- **If all piles are already size 1, just count them** — even number of size-1 piles: the player whose turn it is loses. Odd number: that player wins. No calculation needed.
- **Misère Nim is the easy version of this rule** — for most other games, the "whoever takes the last thing loses" version is much harder. Nim just happens to have a simple one-line exception.

## Engines & current best play

- **Strongest known program(s):** Any nim-sum calculator solves Misère Nim in O(n) time; no dedicated software needed.
- **Strength:** Perfect; the exact strategy is a closed-form rule.
- **Where the proof / tablebase lives (if solved):** [Bouton (1901)](../references.md#bouton1901); [Berlekamp, Conway & Guy (2001)](../references.md#bcg2001).
- **Notes:** The misère rule for Nim is exceptionally simple compared to misère play for other impartial games, which require the full genus theory or misère quotient machinery.

## Complexity

As with Nim, a family of positions rather than one game; optimal play is
computable in linear time per position.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Nim) ([archive](http://web.archive.org/web/20260513001624/https://en.wikipedia.org/wiki/Nim))
- [Bouton, C. L. (1901). *Nim, A Game with a Complete Mathematical Theory*.](../references.md#bouton1901)
- [Berlekamp, Conway & Guy (2001). *Winning Ways for Your Mathematical Plays*.](../references.md#bcg2001)
- [Conway, J. H. (1976). *On Numbers and Games*.](../references.md#conway1976)

## See also

- [Nim](nim.md) · [Notakto](notakto.md) (misère X-only tic-tac-toe)
- Lexicon: [misère play](../lexicon/README.md#misère-play) · [nim-sum](../lexicon/README.md#nim-sum)
