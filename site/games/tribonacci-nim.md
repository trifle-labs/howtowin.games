# Tribonacci Nim

> A game where players remove tokens from a pile, and each move cannot take more than three times what the opponent just took. It is fully solved.

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
| **Playable** | tribonacci-nim |

## Description

A variation of Fibonacci Nim. Players take turns removing tokens from a pile. The first player may remove any number of tokens less than the total pile. After that, each move may remove at most three times the number of tokens the opponent just removed. The player who takes the last token wins.

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

- **Know the tribonacci numbers** — the losing pile sizes follow the tribonacci sequence: 1, 1, 2, 4, 7, 13, 24, 44, and so on (each number is the sum of the three before it). If the pile size is a tribonacci number, you are in a losing position if the opponent plays perfectly.
- **Use tribonacci representation to find the winning move** — from a winning position, write the pile size as a sum of tribonacci numbers (using the biggest ones first). The winning move is to remove the smallest number in that sum.
- **Respect the "at most 3x" rule** — your move cannot take more than three times what the opponent just took. The winning move from a non-tribonacci pile is always small enough to satisfy this.
- **Limit the opponent's options when you must take from a losing position** — if you are stuck in a losing position (pile is a tribonacci number), take just 1 token. This limits how many the opponent can take on their next turn (at most 3).
- **The first move has no restriction** — on the very first move, you can take any number of tokens from 1 to one less than the pile. Check if the pile is a tribonacci number before deciding how many to take.

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
