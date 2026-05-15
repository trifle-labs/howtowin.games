# Atropos

> A Sperner-lemma-flavoured colouring game — its decision problem is
> PSPACE-complete.

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

## Description

Atropos is a board game inspired by **Sperner's lemma**. The board is a
triangulated triangle whose corner vertices are pre-coloured 1, 2, 3 (one each).
Players alternately colour internal vertices subject to constraints, and the
losing player is the one forced to complete a tricoloured (1-2-3) triangle —
Sperner's lemma guarantees such a triangle eventually exists.

## Rules

1. A triangular grid (a triangulation of a large triangle) is given, with each
   corner labelled 1, 2, 3 and edge vertices restricted to the two
   adjacent-corner colours.
2. Players alternate colouring an internal vertex with one of {1, 2, 3}; the
   first move colours any vertex adjacent to the last move. (Atropos enforces
   a chain rule: each move must be next to the previous move.)
3. A player who is **forced to create a tricoloured triangle** loses.

## Solution status

Solved as a theory: Burke & Teng (2008) **[verify]** proved Atropos is
**PSPACE-complete**, by reduction from a Boolean-formula game. Small instances
are solvable by direct backward induction, but no efficient algorithm exists
in general.

## Consensus on optimal play

- **Avoid completing the third colour in a near-Sperner triangle** — whenever a triangle already shows two of the three colours on its vertices, colouring the third vertex with the missing colour hands your opponent the losing condition; scan for such triangles before every move.
- **Force your opponent into constrained positions** — because each move must be adjacent to the previous one (the chain rule), steer the chain toward dense regions where your opponent will have fewer safe colour choices.
- **Colour ambiguously where possible** — choosing a colour that does not immediately threaten any near-complete Sperner triangle maximises your future options and minimises risk.
- **Control the last few uncoloured vertices** — the endgame typically funnels down to a small cluster; the player who can force their opponent to colour the final triangle-completing vertex wins; work backward from likely endgame configurations.
- **PSPACE-hardness means no simple heuristic suffices on large boards** — on small (≤ size-3 or size-4) triangulations, exhaustive backward induction is feasible and should be used; for larger boards there is no known efficient strategy.

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
