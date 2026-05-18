# Atropos

> A coloring game based on a famous math idea (Sperner's lemma). Proven to be PSPACE-complete, which means it is very hard to solve in general.

| Field | Value |
|-------|-------|
| Also known as | Atropos |
| Players | 2 |
| Type | Partisan combinatorial game (graph colouring) |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Strongly solved as a theory (PSPACE-complete) |
| **Game-theoretic value** | Position-dependent |
| Year solved | 2008 |
| Solved by | Burke & Teng |
| State-space complexity | Exponential in board size |
| Game-tree complexity | Exponential |
| **Playable** | atropos |

## Description

Atropos is a board game based on a math idea called **Sperner's lemma**. The
board is a triangle made of many smaller triangles, like a sliced-up pizza.
The three corner dots are pre-colored 1, 2, and 3 (one color each). Players
take turns coloring the inside dots, following certain rules. The player who
is forced to be the first to complete a triangle that contains all three
colors (1-2-3) loses. Sperner's lemma says that such a triangle is guaranteed
to show up eventually.

## Rules

1. The board is a large triangle made of smaller triangles. The three corner dots are labeled 1, 2, and 3. Dots along the edges can only use the two colors of the corners they sit between.
2. Players take turns coloring an inside dot with one of the colors (1, 2, or 3). Each move must be next to the previous move (you have to color a dot that touches the last colored dot).
3. A player who is **forced to create a triangle that has all three colors** loses.

## Solution status

Solved as a theory: Burke & Teng (2008) **[verify]** proved Atropos is
**PSPACE-complete**, by reduction from a Boolean-formula game. Small instances
are solvable by direct backward induction, but no efficient algorithm exists
in general.

## Consensus on optimal play

- **Avoid finishing a triangle with all three colors** — whenever a triangle already has two of the three colors on its corners, coloring the third corner with the missing color makes you lose. Look for these triangles before every move.
- **Force your opponent into tight spots** — because each move must be next to the previous one, steer the chain of moves toward crowded areas where your opponent will have fewer safe color choices.
- **Choose safe colors when you can** — picking a color that does not complete any triangle keeps your options open and reduces risk.
- **Control the last few empty dots** — near the end of the game, the action comes down to a small cluster. The player who can force the opponent to complete the final triangle wins. Think ahead about how the end will play out.
- **On small boards, you can calculate every possibility** — on small triangles (up to size 3 or 4), you can work out every possible move. On larger boards, there is no known shortcut strategy.

## Engines & current best play

- **Strongest known program(s):** No game-specific public engine known to the cataloguer. Playable in general-purpose abstract-game frameworks (e.g., [Ludii](https://ludii.games/)).
- **Strength:** Not benchmarked.
- **Notes:** Atropos is primarily a complexity-theory research object; PSPACE-completeness (Burke & Teng, 2008) means computing optimal play on large boards is intractable in general.

## Complexity

PSPACE-complete in the size of the triangulation.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Atropos_(game))
- [Hearn & Demaine (2009). *Games, Puzzles, and Computation*.](../references.md#hearn-demaine2009)
- [Schaefer (1978). *On the complexity of some two-person perfect-information games*.](../references.md#schaefer1978)

## See also

- [Sim](sim.md) · [Generalized Geography](geography.md)
- Lexicon: [PSPACE-complete / EXPTIME-complete](../lexicon/README.md#pspace-complete--exptime-complete)
