# GIPF

> A game on a hexagonal board where you push pieces in from the edge. The first to run out of pieces loses.

| Field | Value |
|-------|-------|
| Also known as | GIPF |
| Players | 2 |
| Type | Partisan abstract strategy game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Unsolved |
| **Game-theoretic value** | Unknown |
| Year solved | — |
| Solved by | — |
| State-space complexity | Large |
| Game-tree complexity | Large |
| **Playable** | gipf |

## Description

GIPF (1997, by Kris Burm) is the first and main game in the GIPF Project — a series of six connected abstract games (see [ZÈRTZ](zertz.md), [DVONN](dvonn.md), [YINSH](yinsh.md), [PÜNCT](punct.md), [TZAAR](tzaar.md), [TAMSK](tamsk.md), [LYNGK](lyngk.md)). It is played on a small hexagonal board. Instead of placing pieces on the board, you push them onto the board from the edges, sliding all pieces in that line by one space. When four of your pieces line up in a row, you capture them (and any opponent pieces at the ends of that row). The first player who cannot push a piece onto the board loses.

## Rules

1. Board: a hexagonal star shape made of intersecting points (a small hex grid with the corners cut off).
2. Each player has a reserve of pieces (15 in the standard setup) and may also have "GIPF" double-pieces in some versions.
3. On your turn, you push one of your pieces onto the board from one of the edge-entry points along a line. This slides every piece already on that line by one cell.
4. Whenever a row of four of your pieces lines up, you capture those pieces. Any opponent pieces at either end of that row are also captured by you.
5. The first player who cannot push a piece onto the board loses (usually because their reserve is empty).
6. **Tournament variant**: each player starts with a fixed number of "GIPF pieces" (double-stacked pieces). Losing all your GIPF pieces is also a loss condition.

## Solution status

GIPF is **not solved**. The combination of the small board with the sliding /
row-of-four-captures dynamics gives a rich, non-monotone tactical structure.
There is a small competitive community and some computer players, but no
published solution.

## Consensus on optimal play

- **Control the center intersections** — pushes from the edge affect lines that go through the center. Owning the center cells makes it easier to threaten a row-of-four from multiple directions.
- **Create two threats at once** — one row-of-four threat can be blocked by a single push from the opponent. Two threats at once (a "fork") forces the opponent to give ground somewhere.
- **Use your GIPF pieces wisely** — GIPF double-pieces cannot be captured and return captured pieces to your reserve. Keeping at least one GIPF piece in play is very important in the tournament variant.
- **Run the opponent out of pieces, not just the board** — the game ends when you cannot push a piece in. Forcing captures that return pieces to your reserve while denying the opponent that luxury is the path to victory.
- **Don't line up too many of your own pieces on the same line** — four in a row is good, but three of your pieces already lined up invites the opponent to make a blocking push that spoils your plan. Spread your threats across different directions.
- **Endgame: count pieces carefully** — when reserves are low, each push brings you closer to running out. Figure out who will run out of pieces first and steer the game so it favors you.

## Engines & current best play

- **Strongest known program(s):** No game-specific public engine known to the cataloguer. Playable in general-purpose abstract-game frameworks (e.g., [Ludii](https://ludii.games/)).
- **Strength:** Not benchmarked.
- **Where the proof / tablebase lives (if solved):** Not solved; no tablebase.
- **Notes:** Small but active competitive community; human expert theory is more developed than published computer analysis.

## Complexity

Large enough to be out of reach of full search; small enough that strong
programs are feasible.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/GIPF_(game)) ([archive](http://web.archive.org/web/20251004213101/https://en.wikipedia.org/wiki/GIPF_(game)))
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002) (general framework)

## See also

- [ZÈRTZ](zertz.md) · [DVONN](dvonn.md) · [YINSH](yinsh.md) · [TZAAR](tzaar.md)
- Lexicon: [game-tree complexity](../lexicon/README.md#game-tree-complexity)
