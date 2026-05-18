# Fibonacci Nim

> A game where you take objects from a pile, with a limit that changes each turn. Solved using Fibonacci numbers.

| Field | Value |
|-------|-------|
| Also known as | Fibonacci's game |
| Players | 2 |
| Type | Impartial combinatorial game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Strongly solved |
| **Game-theoretic value** | First-player win unless the heap size is a Fibonacci number |
| Year solved | 1963 |
| Solved by | Michael J. Whinihan (analysis attributed to Robert E. Gaskell) |
| State-space complexity | Linear in heap size |
| Game-tree complexity | Polynomial in heap size |
| **Playable** | fibonacci-nim |

## Description

The game starts with a single pile of *n* objects. The first player can take
any number of objects but **cannot take the whole pile**. After that, each
player can take at most *twice* as many objects as the opponent just took
(and must take at least one). The player who takes the last object wins.

## Solution status

Fibonacci Nim is **strongly solved** ([Whinihan, 1963](../references.md#guy-smith1956)
records the result; the analysis is commonly credited to R. E. Gaskell). The
second player wins if and only if *n* is a Fibonacci number. Otherwise the first
player wins, and the winning strategy uses the **Zeckendorf representation** —
the unique way to write *n* as a sum of non-consecutive Fibonacci numbers: take
the *smallest* Fibonacci number in that representation, and continue to respond
analogously.

> Note: the citation anchor above is a placeholder; the standard reference is
> M. J. Whinihan, "Fibonacci Nim," *Fibonacci Quarterly* 1(4):9–13, 1963.
> **[verify]**

## Consensus on optimal play

- **If *n* is a Fibonacci number (1, 2, 3, 5, 8, 13, 21...), you are in a losing position** — going first from any Fibonacci-sized pile means you lose against a perfect opponent. Your only hope is that the opponent makes a mistake.
- **Otherwise, write *n* as a sum of non-consecutive Fibonacci numbers (its Zeckendorf representation) and take the smallest one** — this unique way of breaking down a number leaves the opponent with a Fibonacci-sized pile (a losing position for them). Every response they make lets you apply the same rule again.
- **Never take too many** — the doubling limit means the opponent can take up to twice what you took. After you make your Zeckendorf move, the remaining pile is a Fibonacci number, and any move the opponent makes from a Fibonacci number gives you a winning position. The strategy takes care of itself.
- **On your first move, take only the smallest Fibonacci part of *n*** — the rule that you cannot take the whole pile on the first move is the only special limit. The Zeckendorf method handles this naturally because the smallest Fibonacci part of a non-Fibonacci number is always smaller than the whole pile.
- **This works like Wythoff's game** — the golden ratio pattern here (Fibonacci numbers as losing positions) is similar to Wythoff's game. If you know one, you can understand the other.

## Engines & current best play

- **Strongest known program(s):** Any program implementing Zeckendorf decomposition plays perfectly. No dedicated engine is needed.
- **Strength:** Perfect — O(log n) computation via Zeckendorf representation.
- **Where the proof / tablebase lives (if solved):** Whinihan (1963), *Fibonacci Quarterly* 1(4):9–13; also in [Berlekamp, Conway & Guy (2001)](../references.md#bcg2001).
- **Notes:** Fibonacci Nim is the canonical example of a take-away game whose P-positions form a well-known mathematical sequence; its complete solution via Zeckendorf representations makes it a pedagogically valuable counterpart to standard Nim.

## Complexity

A family of positions; optimal moves computable directly from the Zeckendorf
representation of the heap size.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Fibonacci_nim) ([archive](http://web.archive.org/web/20251219020355/https://en.wikipedia.org/wiki/Fibonacci_nim))
- M. J. Whinihan (1963). *Fibonacci Nim*. Fibonacci Quarterly 1(4):9–13. **[verify]**
- [Berlekamp, Conway & Guy (2001). *Winning Ways for Your Mathematical Plays*.](../references.md#bcg2001)

## See also

- [Nim](nim.md) · [Wythoff's game](wythoffs-game.md) · [Subtract-a-square](subtract-a-square.md)
- Lexicon: [impartial game](../lexicon/README.md#impartial-game)
