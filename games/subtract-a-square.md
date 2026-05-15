# Subtract-a-square

> A one-heap subtraction game in which you may only remove a perfect-square
> number of objects.

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

## Description

A single heap of *n* objects. On a turn a player removes a positive
*perfect-square* number of objects (1, 4, 9, 16, …). Under
[normal play](../lexicon/README.md#normal-play-convention) the player taking the
last object wins.

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

- **Build and consult the nim-value table** — compute nim-values for 0 through n by the mex recurrence; from any position with nim-value > 0, always move to a position with nim-value 0 (the losing positions for the player to move).
- **Losing positions have no simple pattern** — unlike Nim or Wythoff's game, the P-positions (0, 2, 5, 7, 10, 12, 15, 17, 20, 22, 34, 39, …) cannot be predicted by a formula; memorising a table or computing on the fly is required.
- **Removing 1 is rarely correct** — subtracting 1 (the smallest square) almost always leaves a winning position for the opponent; check the table before defaulting to the "safe-looking" small move.
- **From large heaps, many squares are available** — with many choices near √n in magnitude, the winning move is typically within the range 1 to ⌊√n⌋; compute mex over this range to find it.
- **Multi-heap variants require full Sprague–Grundy XOR** — if you play several simultaneous subtract-a-square piles, XOR all nim-values; a combined XOR of 0 is a losing position for the player to move.

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
