# Misère Nim

> Nim played so that taking the last object *loses*; solved by a small twist on
> Bouton's rule.

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

Identical to [Nim](nim.md) — heaps of objects, remove any number from one heap
per turn — but under the [misère play convention](../lexicon/README.md#misère-play)
the player who takes the *last* object **loses**.

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

- **If any heap has size ≥ 2, play exactly as in normal Nim** — compute the nim-sum (XOR) of all heap sizes; move to make it 0; this is optimal identical to normal play until only size-1 heaps remain.
- **When only size-1 heaps remain, leave an odd number** — the single-exception rule: at the moment all remaining heaps are size 1 (or would be after your move), the correct play is to leave an **odd** number of such heaps; the player facing an odd number of single-object heaps must take one, leaving an even number for the opponent, who can mirror until the opponent takes the last one.
- **The "switch" moment is the key calculation** — identify in advance the position where all heaps collapse to size 1; your last move with a heap of size ≥ 2 should also leave the correct (odd/even) parity of unit heaps.
- **If all heaps are size 1 already, count and parity decides immediately** — even number of size-1 heaps: the player to move loses; odd number: wins; no further calculation needed.
- **Misère Nim is the easy misère case** — for most other impartial games, misère theory is far harder; Nim's misère rule is a special one-line exception, not a general template.

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
