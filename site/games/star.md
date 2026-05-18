# \*Star

> A connection game where players score points by controlling the perimeter of the board with connected groups.

| Field | Value |
|-------|-------|
| Also known as | \*Star, "Star" |
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
| **Playable** | star |

## Description

\*Star (Craige Schensted / Ea Ea, 1980s) is a connection game played on a hexagonal board. Unlike Hex, which is won by connecting two opposite sides, \*Star is a scoring game — you earn points by controlling partial-hex perimeter scoring cells (called **peries**) with your connected groups. Each connected group scores the total peries value of its cells minus 2 (minimum 0). The game ends when both players pass consecutively.

## Rules

1. **Board.** A hexagonal grid. Around its outer edge are partial-hex scoring markers called *peries* (visible as small numbers on perimeter cells). Each playable cell on the edge touches a certain number of peries: corner cells touch **3**, non-corner edge cells touch **2**, and interior cells touch none. A cell's peries value is the number of its sides that face outward (not adjacent to another playable cell).

2. **Play.** Players take turns placing one stone of their own colour on any empty cell. You are blue; the AI is orange.

3. **Passing.** Instead of placing a stone, a player may pass. When **both** players pass consecutively (one after the other without a move in between), the game ends and scores are tallied.

4. **Scoring.** After the game ends, each player's score is computed as follows:
   - For each connected group of your stones, add up the peries values of every cell in that group.
   - If the total is 2 or less, the group scores **0 points**.
   - If the total is 3 or more, the group scores **(total − 2) points**.
   - Sum these across all your groups. The player with the higher total wins.

5. **Pie rule (optional).** After the first move, the second player may choose to switch sides, taking over the first player's position. This offsets the first-player advantage and is standard in competitive play. (Not implemented in this playable.)

### Scoring examples

- A single stone on a corner cell (peries = 3) forms a group touching 3 peries → scores **1 point** (3 − 2).
- A single stone on a non-corner edge cell (peries = 2) scores **0 points** (2 − 2 = 0, minimum).
- Two adjacent edge stones, each touching 2 peries (total 4) → group scores **2 points** (4 − 2).
- A large group stretching across several edge cells (e.g. peries 2+2+3+2 = 9) → scores **7 points** (9 − 2).

## Solution status

\*Star is **not solved**. Like other large connection games, the combination of
a moderately large board and the *scoring* objective (not just a binary win
condition) puts a full solution out of reach. \*Star is widely respected in the
abstract-games community as a deeper successor to Y / Hex; engine play exists
but is much less developed than for the headline connection games.

## Consensus on optimal play

- **Aim for groups touching three or more peries** — a connected group scores (peries touched − 2) points, so groups with peries ≤ 2 score nothing. Every group you build must clear this threshold to be worthwhile.
- **Connect across the board, not just along edges** — long chains that link multiple different edges of the board score more points per stone than groups hugging a single edge.
- **Fight for corner cells early** — corner cells touch 3 peries each, giving them the highest per-stone scoring potential. A single corner stone already scores 1 point.
- **Cutting the opponent's connection is often better than building your own** — splitting the opponent's large group into two smaller groups, each below the scoring threshold, can swing many points at once.
- **Sacrifice small edge extensions** — adding a single edge cell to a group that already scores is worth at most 2 additional points. A move that creates a new scoring group elsewhere is often more valuable.
- **Pass when the board is settled** — once no remaining empty cell can improve your position more than it helps your opponent, pass. If your opponent also passes, the game ends.

## Engines & current best play

- **Strongest known program(s):** No game-specific public engine known to the cataloguer. Playable in general-purpose abstract-game frameworks (e.g., [Ludii](https://ludii.games/)).
- **Strength:** Not benchmarked.
- **Where the proof / tablebase lives (if solved):** —
- **Notes:** \*Star has a small but dedicated competitive community; strategic theory is primarily found in informal publications and the abstract-games forums rather than academic literature.

## Complexity

Comparable to Hex on equivalent board sizes, with the scoring objective adding
extra evaluation depth.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Star_(board_game))
- [Schensted & Titus (1975). *Mudcrack Y and Poly-Y*.](../references.md#schensted-titus1975) (related connection-game theory)

## See also

- [Hex](hex.md) · [Y](y.md) · [Poly-Y](poly-y.md) · [Havannah](havannah.md)
- Lexicon: [strategy-stealing argument](../lexicon/README.md#strategy-stealing-argument)
