# Nim

> The classic solved game. A complete mathematical theory has been known since 1901.

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

Several piles of objects are placed between two players. On your turn you remove any number of objects (at least one) from a single pile. Under the normal play rule, the player who takes the last object wins. The version where taking the last object makes you lose is treated separately ([Misère Nim](misere-nim.md)).

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

- **Make the XOR of all pile sizes equal to 0** — take the pile sizes, write them in binary (base-2), and compute their XOR (a special math operation where bits cancel if they appear twice). If the result is 0, the position is a loss for the player whose turn it is. If it is not 0, make a move that brings it to 0.
- **When piles are large, target the biggest one** — a winning move often involves taking from the largest pile to bring the XOR back to 0, especially near the end of the game.
- **One pile is easy** — with only one pile left, just take everything (in normal play) or leave one object (in misere play).
- **Misere exception** — in misere play (where taking the last object loses), use the same XOR strategy except when all piles are size 1 or smaller. In that case, leave an odd number of piles instead.
- **The big idea: any impartial game can be treated as Nim** — a famous theorem (Sprague-Grundy) says that every impartial game with no luck or hidden information is equivalent to a single pile of Nim of some size. To combine two games, just XOR their equivalent pile sizes.

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
