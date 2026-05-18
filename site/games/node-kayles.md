# Node Kayles

> A version of Kayles played on any graph. The general problem is PSPACE-complete (very hard to solve).

| Field | Value |
|-------|-------|
| Also known as | Node Kayles, Vertex Kayles |
| Players | 2 |
| Type | Impartial graph game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Strongly solved as a theory (decision problem PSPACE-complete) |
| **Game-theoretic value** | Position-dependent |
| Year solved | 1978 (PSPACE-completeness) |
| Solved by | Schaefer |
| State-space complexity | Exponential |
| Game-tree complexity | Exponential |
| **Playable** | node-kayles |

## Description

Node Kayles takes the idea of [Kayles](kayles.md) (a game about knocking down bowling pins in a row) and plays it on any kind of graph (a network of points connected by lines). On your turn you *remove a point plus all of its neighboring points*. You can also think of it as building a set of points where no two are connected.

## Rules

1. A graph (a set of points connected by lines) is given. Start with an empty set S of "claimed" points.
2. On your turn, pick a point that is not in S and is not next to any point already in S, then add it to S.
3. The player who cannot move loses (normal play).

Another way to think of it: players take turns removing a point *together with* all its neighboring points, until the graph is empty.

## Solution status

Solved as a theory. [Schaefer (1978)](../references.md#schaefer1978) proved
**Node Kayles is PSPACE-complete** (along with several other graph games). For
small graphs the game is trivially solvable by backward induction. The natural
families — paths, cycles, trees — have closed-form nim-values and are an
exercise in the Sprague–Grundy formalism; the hardness applies to the general
graph problem.

## Consensus on optimal play

- **Use known values for common graph types** — for paths (regular Kayles), circles, and complete graphs, the winning values are already known from tables. Look up the value and pick the move that sets the XOR to 0.
- **Remove highly-connected points early** — removing a point that connects to many others shrinks the graph quickly. The smaller pieces left behind can then be analyzed on their own.
- **Break the graph into separate pieces** — once the graph splits into disconnected parts, figure out the value of each part separately and XOR them together to get the total.
- **Mirror symmetrical positions** — if the graph has a mirror image and the opponent is about to exploit it, consider taking the mirror point to restore balance.
- **General graphs are very hard** — for random graphs no efficient method is known (it is PSPACE-complete). For small cases, just brute-force all possibilities by working backward from the end.

## Engines & current best play

- **Strongest known program(s):** No game-specific public engine known to the cataloguer. Playable in general-purpose abstract-game frameworks (e.g., [Ludii](https://ludii.games/)).
- **Strength:** Not benchmarked for arbitrary graphs; perfect play is feasible only for small instances.
- **Notes:** PSPACE-completeness means no efficient solver is expected for general graphs; special-case tables cover common families.

## Complexity

PSPACE-complete in graph size.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Kayles) ([archive](http://web.archive.org/web/20251201221417/https://en.wikipedia.org/wiki/Kayles))
- [Schaefer (1978). *On the complexity of some two-person perfect-information games*.](../references.md#schaefer1978)
- [Guy & Smith (1956). *The G-values of various games*.](../references.md#guy-smith1956)

## See also

- [Kayles](kayles.md) · [Generalized Geography](geography.md) · [Shannon switching game](shannon-switching-game.md)
- Lexicon: [PSPACE-complete / EXPTIME-complete](../lexicon/README.md#pspace-complete--exptime-complete) · [nim-value](../lexicon/README.md#nim-value)
