# Fibonacci Nim

> A one-heap take-away game with a moving limit, solved via the Zeckendorf
> (Fibonacci) representation of numbers.

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

## Description

A single heap of *n* objects. The first player may remove any positive number
of objects but **not the entire heap**. Thereafter a player may remove at most
*twice* the number their opponent just removed (and at least one). The player
taking the last object wins.

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

- **If *n* is a Fibonacci number, you are in a P-position (second player wins)** — being first to move from any Fibonacci heap size is losing with optimal opponent play; your only strategy is to hope for opponent error.
- **Otherwise, write *n* in its Zeckendorf representation and take the smallest Fibonacci summand** — the Zeckendorf representation of *n* is its unique sum of non-consecutive Fibonacci numbers; removing that smallest Fibonacci piece leaves the opponent in a P-position (a Fibonacci number remainder), and every response they make allows you to apply the same rule again.
- **Never take so many that your move number doubles to the opponent's desired response** — the doubling-limit rule means your opponent can respond with up to twice your removal; after your Zeckendorf move, the remaining pile is a Fibonacci number, and any removal from a Fibonacci number leads to a non-Fibonacci position — which is an N-position for the next player. The strategy self-reinforces.
- **On the first move, take only the smallest Fibonacci summand of *n*** — the restriction that you cannot take the entire heap on the first move is the only special constraint; the Zeckendorf rule already handles this because the smallest Fibonacci summand of any non-Fibonacci *n* is always less than *n*.
- **Fibonacci pairs in Wythoff's game are the analogous safe positions** — the golden-ratio structure here (Fibonacci P-positions) mirrors Wythoff's game; players familiar with one can read across to the other.

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
