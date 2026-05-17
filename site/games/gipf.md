# GIPF

> Kris Burm's hex-board flagship of the GIPF project — unsolved.

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

## Description

GIPF (Kris Burm, 1997) is the eponymous first title in the GIPF Project — a
series of six interconnected abstract games (see [ZÈRTZ](zertz.md),
[DVONN](dvonn.md), [YINSH](yinsh.md), [PÜNCT](punct.md), [TZAAR](tzaar.md),
[TAMSK](tamsk.md), [LYNGK](lyngk.md)). It is played on a small hexagonal
board: pieces are pushed onto the board from the edges and captured in lines of
four.

## Rules

1. Board: a hexagonal star of intersections (a small hex grid with the corners
   trimmed).
2. Each player has a reserve of pieces (15 in the standard setup) and a stock
   of "GIPF" double-pieces in the basic variant.
3. On a turn, a player **pushes** one of their pieces onto the board from one
   of the edge-entry points along a line, sliding all pieces in that line by
   one cell.
4. Whenever a row of four same-colour pieces is formed, those pieces are
   **captured** by their owner; any pieces of the *other* colour at either end
   of the run are captured by the player who formed the row.
5. The first player who cannot push a piece in onto the board loses (typically
   because their reserve is empty).
6. **Tournament variant**: each player starts with a fixed number of "GIPF
   pieces" (double-stacked pieces); losing all your GIPF pieces is also a loss
   condition.

## Solution status

GIPF is **not solved**. The combination of the small board with the sliding /
row-of-four-captures dynamics gives a rich, non-monotone tactical structure.
There is a small competitive community and some computer players, but no
published solution.

## Consensus on optimal play

- **Control the centre intersections** — pushes from the edge affect lines that pass through the centre; owning the central cells makes it easier to threaten row-of-four from multiple directions.
- **Create two simultaneous threats** — one row-of-four threat can be blocked by a single push from the opponent; two threats at once (a "fork") forces a concession.
- **Recapture efficiently with GIPF pieces** — GIPF double-pieces are immune to capture and return captured pieces to your reserve; placing and keeping at least one GIPF piece in play is vital in the tournament variant.
- **Deplete the opponent's reserve, not just the board** — the game is lost when you cannot push a piece; forcing captures that return pieces to your reserve while denying the opponent the same is the path to victory.
- **Avoid clustering same-colour pieces on the same line** — four in a row is a reward, but three already-positioned pieces on a line invite an opponent's blocking push that spoils your plan; vary threat directions.
- **Endgame tempo** — when reserves are low, each push is a countdown move; calculate who runs out of pieces first and steer toward positions where that counter favours you.

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
