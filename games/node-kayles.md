# Node Kayles

> A graph-theoretic relative of Kayles whose decision problem is
> PSPACE-complete.

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

## Description

Node Kayles lifts the row-of-pins [Kayles](kayles.md) game to an arbitrary
graph. Players alternately *remove a vertex together with all its neighbours*
— equivalently, they alternately enlarge an independent set.

## Rules

1. An undirected graph G is given. Set S of "claimed" vertices starts empty.
2. On your turn, pick a vertex v not in S and not adjacent to any vertex of S,
   and add v to S.
3. The player who cannot move loses (normal play).

Equivalently: players alternately remove a vertex *together with* all its
neighbours, until the graph is empty.

## Solution status

Solved as a theory. [Schaefer (1978)](../references.md#schaefer1978) proved
**Node Kayles is PSPACE-complete** (along with several other graph games). For
small graphs the game is trivially solvable by backward induction. The natural
families — paths, cycles, trees — have closed-form nim-values and are an
exercise in the Sprague–Grundy formalism; the hardness applies to the general
graph problem.

## Consensus on optimal play

- **Use tabulated nim-values for named families** — on paths (ordinary Kayles), cycles, and complete graphs the Sprague–Grundy values are known; look up the table and pick the move that sets nim-sum to 0.
- **Isolate high-degree vertices early** — removing a vertex with many neighbours shrinks the graph rapidly; the resulting smaller components can then be analysed independently.
- **Decompose into components** — once the graph breaks into disconnected components, compute the Grundy value of each and XOR them (Sprague–Grundy additivity).
- **In symmetric positions, mirror** — if the graph has a structural symmetry your opponent is about to exploit, consider playing the mirror vertex to restore balance.
- **General graphs are hard** — for arbitrary graphs no efficient algorithm is known (PSPACE-complete); rely on brute-force retrograde analysis for small instances.

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
