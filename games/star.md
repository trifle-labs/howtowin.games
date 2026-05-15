# *Star

> Ea Ea's connection game — a Y-relative where peripheral cells score points,
> not territory.

| Field | Value |
|-------|-------|
| Also known as | *Star, "Star" |
| Players | 2 |
| Type | Partisan connection / scoring game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Unsolved |
| **Game-theoretic value** | Unknown |
| Year solved | — |
| Solved by | — |
| State-space complexity | Comparable to Hex on the same-size board |
| Game-tree complexity | Large |

## Description

*Star (Craige Schensted / Ea Ea, 1980s) is a connection game on a hexagonal
board with peripheral "edge cells." Where [Hex](hex.md) wins by connecting two
opposite edges, *Star scores by **owning peripheral cells** through connecting
groups — making it a *scoring* connection game rather than an all-or-nothing
race.

## Rules

1. A hexagonal board, with the edge cells specially marked (each peripheral cell
   has a number indicating how many "peries" — board edges — it touches).
2. Players alternate placing one stone of their colour on any empty cell.
3. At the end of the game (the board fills, or both players pass), each player
   scores: for every connected group of their stones, count the number of
   *peripheral* cells touched minus 2 (clipped to 0). The higher score wins.
4. Pass is allowed once both players agree the position is settled.

## Solution status

*Star is **not solved**. Like other large connection games, the combination of
a moderately large board and the *scoring* objective (not just a binary win
condition) puts a full solution out of reach. *Star is widely respected in the
abstract-games community as a deeper successor to Y / Hex; engine play exists
but is much less developed than for the headline connection games.

## Consensus on optimal play

- **Aim for groups touching three or more peripheral cells** — a connected group scores (peries − 2) points; groups touching exactly 1 or 2 peripheral cells score 0, so only groups spanning three or more peries have value.
- **Connect across the board, not just along edges** — long diagonal chains that link multiple peripheral arcs accumulate more peries per stone invested than hugging a single edge.
- **Contest high-perie corner cells early** — the true corner cells of the hexagonal board touch the most boundary edges; capturing them cheaply forms the nucleus of a high-scoring group.
- **Cutting the opponent's bridge is often better than extending your own** — splitting an opponent's large group into two sub-groups, each below the scoring threshold, can swing multiple points at once.
- **Sacrifice low-perie extensions** — small peripheral stubs that add only one perie to a group below the threshold are often not worth defending; redeploy those moves elsewhere.

## Engines & current best play

- **Strongest known program(s):** No game-specific public engine known to the cataloguer. Playable in general-purpose abstract-game frameworks (e.g., [Ludii](https://ludii.games/)).
- **Strength:** Not benchmarked.
- **Where the proof / tablebase lives (if solved):** —
- **Notes:** *Star has a small but dedicated competitive community; strategic theory is primarily found in informal publications and the abstract-games forums rather than academic literature.

## Complexity

Comparable to Hex on equivalent board sizes, with the scoring objective adding
extra evaluation depth.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Star_(board_game))
- [Schensted & Titus (1975). *Mudcrack Y and Poly-Y*.](../references.md#schensted-titus1975) (related connection-game theory)

## See also

- [Hex](hex.md) · [Y](y.md) · [Poly-Y](poly-y.md) · [Havannah](havannah.md)
- Lexicon: [strategy-stealing argument](../lexicon/README.md#strategy-stealing-argument)
