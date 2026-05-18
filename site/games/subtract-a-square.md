# Subtract-a-square

> Players take turns removing a number of objects that must be a perfect square (1, 4, 9, 16...). Whoever takes the last object wins.

| Field | Value |
|-------|-------|
| Also known as | Subtract a square, the subtract-a-square game |
| Players | 2 |
| Type | Impartial combinatorial game (subtraction game) |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Strongly solved |
| **Game-theoretic value** | Depends on heap size; both win/loss values occur with positive density |
| Year solved | 1966 |
| Solved by | Solomon W. Golomb (popularised); attributed earlier to Richard A. Epstein |
| State-space complexity | Linear in the starting heap size |
| Game-tree complexity | Polynomial in the starting heap size |
| **Playable** | subtract-a-square |

## Description

A single pile of some number of objects. On a turn, a player removes a number of objects that must be a perfect square (1, 4, 9, 16, and so on). The player who takes the last object wins.

## Solution status

Subtract-a-square is **strongly solved** in the practical sense: the
[nim-value](../lexicon/README.md#nim-value) of every heap size is computable in
polynomial time by the standard [mex](../lexicon/README.md#mex) recurrence, so
the win/loss status and an optimal move are known for any *n*.

What remains *open* is a closed-form description. Unlike [Nim](nim.md) or
[Wythoff's game](wythoffs-game.md), the losing positions (heap sizes with
nim-value 0: 0, 2, 5, 7, 10, 12, 15, 17, 20, 22, 34, 39, 44, …) do **not** form
a known periodic or otherwise simply describable set. Their density is positive
but a formula is not known. So the game is fully solved algorithmically while
its deeper structure is not understood.

## Consensus on optimal play

- **Learn which pile sizes are losing positions** — the losing pile sizes (where the player whose turn it is will lose with perfect play) are 0, 2, 5, 7, 10, 12, 15, 17, 20, 22, 34, 39, and so on. From any other pile size, there is a winning move.
- **The losing positions have no simple pattern** — unlike Nim or Wythoff's game, there is no known formula to predict them. You need to either memorize them or compute them on the fly.
- **Removing just 1 is rarely the right move** — taking away 1 (the smallest square) almost always leaves a winning position for the opponent. Check before choosing the "safe-looking" small move.
- **From large piles, many choices are available** — when the pile is large, the number of squares you can subtract grows. The winning move is typically some square within the range of 1 up to the square root of the pile size.
- **With multiple piles, use nim-sum calculation** — if playing with several piles at once, write each pile's value in binary and add them without carrying. If the result is 0, the position is losing for the player whose turn it is.

## Engines & current best play

- **Strongest known program(s):** No game-specific public engine; any implementation of the mex recurrence solves the game exactly in O(n·√n) time.
- **Strength:** Algorithmically solved for all practical heap sizes.
- **Where the proof / tablebase lives (if solved):** Computed tables appear in *Winning Ways* ([../references.md#bcg2001](../references.md#bcg2001)) and are trivially reproducible.
- **Notes:** The game is fully solved algorithmically; the open problem is whether the P-positions have a closed-form characterisation.

## Complexity

For a heap of size *n*, the nim-value table is built in O(n·√n) time.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Subtract_a_square) ([archive](http://web.archive.org/web/20260405205210/https://en.wikipedia.org/wiki/Subtract_a_square))
- [Berlekamp, Conway & Guy (2001). *Winning Ways for Your Mathematical Plays*.](../references.md#bcg2001)
- [Guy, R. K. & Smith, C. A. B. (1956). *The G-values of various games*.](../references.md#guy-smith1956)

## See also

- [Nim](nim.md) · [Wythoff's game](wythoffs-game.md) · [Fibonacci Nim](fibonacci-nim.md) · [Grundy's game](grundys-game.md)
- Lexicon: [nim-value](../lexicon/README.md#nim-value) · [mex](../lexicon/README.md#mex)
