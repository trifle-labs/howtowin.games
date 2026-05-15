# Tribonacci Nim

> A Fibonacci-Nim variant where each move is bounded by *three times* the
> previous move — losing positions track the tribonacci numbers.

| Field | Value |
|-------|-------|
| Also known as | Tribonacci Nim, 3-Fibonacci Nim |
| Players | 2 |
| Type | Impartial subtraction game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Strongly solved |
| **Game-theoretic value** | P-positions characterised by tribonacci representations |
| Year solved | — (folklore extension of Whinihan's Fibonacci Nim) |
| Solved by | — |
| State-space complexity | One pile of size n |
| Game-tree complexity | Polynomial in log n |

## Description

A generalisation of [Fibonacci Nim](fibonacci-nim.md) in which the take-size
restriction is loosened. Where Fibonacci Nim's optimal P-positions sit on
Fibonacci numbers and use Zeckendorf representations, Tribonacci Nim's sit on
**tribonacci** numbers (the recurrence T(n) = T(n−1) + T(n−2) + T(n−3)).

## Rules

1. A single heap of n tokens. The first move may remove any positive number
   strictly less than n.
2. Each subsequent move may remove at most **three times** the number of tokens
   just removed by the opponent, but at least one and not more than the heap
   currently contains.
3. The player who takes the last token wins (normal play).

## Solution status

Strongly solved by Sprague–Grundy analysis: the **P-positions** are exactly the
tribonacci numbers, and from any N-position the unique winning move is to
remove the smallest tribonacci number in the "tribonacci representation"
(analogue of Zeckendorf) of the heap. The proof is the same induction structure
as for Fibonacci Nim.

## Consensus on optimal play

- **Identify if the heap is a tribonacci number** — the tribonacci sequence is 1, 1, 2, 4, 7, 13, 24, 44, …; if the current heap equals a tribonacci number you are in a losing (P-) position with best play by your opponent, so choose a move that forces a tribonacci-number heap.
- **Use the tribonacci (Zeckendorf-like) representation** — write n as a sum of distinct tribonacci numbers using the greedy algorithm; the winning move is to remove the *smallest* summand in that representation.
- **Respect the "at most 3×" constraint** — the winning move from an N-position (heap not a tribonacci number) is always small enough to satisfy the constraint; verify that your chosen removal does not exceed three times your opponent's last move.
- **Limit the opponent's range by removing small amounts** — removing k tokens lets your opponent remove up to 3k; when you are forced to take from a P-position, take as few as possible (1 token) to limit your opponent's reply range.
- **First move is unrestricted** — on the very first move any amount from 1 to n−1 is legal; always identify whether n is itself a tribonacci number before making the opening move.

## Engines & current best play

- **Strongest known program(s):** No game-specific public engine; the winning strategy is a closed-form computation in O(log n) via the tribonacci representation.
- **Strength:** Perfectly solved; a correct implementation wins from any N-position in a single computed move.
- **Where the proof / tablebase lives (if solved):** Follows by induction analogous to Whinihan's Fibonacci Nim proof; referenced in the *Winning Ways* framework ([../references.md#bcg2001](../references.md#bcg2001)).
- **Notes:** Tribonacci Nim is the k=3 case of a general family where the move bound is k times the previous move and P-positions are k-bonacci numbers.

## Complexity

Polynomial in log n; trivially solvable on paper for n up to thousands.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Nim) ([archive](http://web.archive.org/web/20260513001624/https://en.wikipedia.org/wiki/Nim))
- [Berlekamp, Conway & Guy (2001–2004). *Winning Ways for Your Mathematical Plays*.](../references.md#bcg2001) (general framework)
- [Sprague (1935). *Über mathematische Kampfspiele*.](../references.md#sprague1935)

## See also

- [Fibonacci Nim](fibonacci-nim.md) · [Nim](nim.md) · [Wythoff's game](wythoffs-game.md)
- Lexicon: [Sprague–Grundy theorem](../lexicon/README.md#sprague-grundy-theorem) · [nim-value](../lexicon/README.md#nim-value)
