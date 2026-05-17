# Nim

> The foundational solved game: a complete mathematical theory has been known
> since 1901.

| Field | Value |
|-------|-------|
| Also known as | — (the name covers a whole family of heap games) |
| Players | 2 |
| Type | Impartial combinatorial game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Strongly solved |
| **Game-theoretic value** | First-player win unless the nim-sum of all heaps is 0 |
| Year solved | 1901 |
| Solved by | Charles L. Bouton |
| State-space complexity | Depends on starting heaps (unbounded family) |
| Game-tree complexity | Depends on starting heaps |
| **Playable** | nim |

## Description

Several heaps of objects are placed between two players. On a turn a player
removes any positive number of objects from a single heap. Under the
[normal play convention](../lexicon/README.md#normal-play-convention) the
player who takes the last object wins; the [misère](../lexicon/README.md#misère-play)
variant is treated separately ([Misère Nim](misere-nim.md)).

## Solution status

Nim is **strongly solved**. [Bouton (1901)](../references.md#bouton1901) gave a
complete theory: compute the [nim-sum](../lexicon/README.md#nim-sum) — the
bitwise XOR of the heap sizes. The position is a loss for the player to move
(a second-player win) if and only if the nim-sum is 0; otherwise the player to
move wins, and a winning move always exists that makes the nim-sum 0.

Nim's importance extends far beyond itself: by the
[Sprague–Grundy theorem](../lexicon/README.md#sprague-grundy-theorem) *every*
finite impartial game under normal play is equivalent to a single Nim heap, so
Nim is in effect the universal impartial game.

## Consensus on optimal play

- **XOR to zero** — compute the nim-sum (bitwise XOR of all heap sizes); the position is a second-player win iff the nim-sum is 0; otherwise move to make it 0.
- **Reduce the largest heap** — when multiple heaps are large, a winning move often targets the largest heap to restore nim-sum 0, especially in end-game positions.
- **Single heap is trivial** — with one heap left, take everything (normal play) or leave one object (misère).
- **Misère exception** — under misère play, use the same nim-sum strategy except when all heaps are size ≤ 1; in that case leave an odd number of heaps.
- **The Sprague–Grundy lens** — any impartial position is equivalent to a single Nim heap of some Grundy value; combine components by XOR-ing their Grundy values.

## Engines & current best play

- **Strongest known program(s):** No game-specific engine needed — the strategy is a closed-form formula.
- **Strength:** Perfect play by any computer implementing Bouton's formula.
- **Where the proof / tablebase lives (if solved):** [Bouton (1901)](../references.md#bouton1901); [Wikipedia](https://en.wikipedia.org/wiki/Nim)
- **Notes:** Nim is solved by a polynomial-time formula, not search; any correct implementation plays perfectly.

## Complexity

Nim is a family rather than a single position, so it has no fixed complexity.
For any specific starting configuration the optimal strategy is computable in
time linear in the number of heaps.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Nim) ([archive](http://web.archive.org/web/20260513001624/https://en.wikipedia.org/wiki/Nim))
- [Bouton, C. L. (1901). *Nim, A Game with a Complete Mathematical Theory*.](../references.md#bouton1901)
- [Sprague, R. P. (1935). *Über mathematische Kampfspiele*.](../references.md#sprague1935)
- [Grundy, P. M. (1939). *Mathematics and games*.](../references.md#grundy1939)
- [Berlekamp, Conway & Guy (2001). *Winning Ways for Your Mathematical Plays*.](../references.md#bcg2001)

## See also

- [Misère Nim](misere-nim.md) · [Wythoff's game](wythoffs-game.md) · [Kayles](kayles.md) · [Northcott's game](northcotts-game.md) · [Turning Turtles](turning-turtles.md)
- Lexicon: [nim-sum](../lexicon/README.md#nim-sum) · [Sprague–Grundy theorem](../lexicon/README.md#sprague-grundy-theorem) · [impartial game](../lexicon/README.md#impartial-game)
