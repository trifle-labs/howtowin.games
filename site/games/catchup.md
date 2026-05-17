# Catchup

> Hex-grid placement game where leading lets the trailing player play more — unsolved.

| Field | Value |
|-------|-------|
| Also known as | Ketchup, Catchup |
| Players | 2 |
| Type | Partisan placement game with catch-up mechanic |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Unsolved |
| **Game-theoretic value** | Unknown |
| Year solved | — |
| Solved by | — |
| State-space complexity | Moderate |
| Game-tree complexity | Moderate |
| **Playable** | catchup |

## Description

Catchup (Nick Bentley, 2010) is a connection-style game on a hexagonal grid
with an unusual move structure: the **size of the largest opposing group**
determines how many pieces you place on your next turn, dynamically
"catching up" the trailing player.

## Rules

1. Board: hexagonal grid (commonly side 5 or 6, with 61 cells).
2. The first player places one stone; thereafter the rule is:
   - At the start of your turn, find the size *G* of the **largest connected
     group of either colour** currently on the board.
   - You then place **as many** stones as the lesser of *G* and the number of
     empty cells, distributed one per cell.
3. After the board is full, the player with the largest connected group wins;
   ties are broken by next-largest group, then third-largest, etc.
4. Stones once placed are never moved or removed.

## Solution status

Catchup is **not solved**. The dynamic move sizing makes the game tree
unusual but no formal value has been computed.

## Consensus on optimal play

- **Avoid creating large groups prematurely** — the catch-up rule means that growing the board's largest group hands your opponent more stones on their next turn; building many small scattered groups may be better than one large connected one until the late game.
- **Cluster your stones before the endgame** — the winner is the player with the largest connected group at the end; stones must eventually connect, but the timing of merging clusters is key — merge just when the opponent cannot mount an equal-sized response.
- **Exploit the opponent's catch-up moves against them** — when the opponent gets to place many stones (because your group is large), they are forced to spread across the board; use those forced placements to your advantage by ensuring they create only fragmented groups.
- **Control the centre of the hexagonal board** — as in most hexagonal placement games, central stones are reachable from more directions and can join clusters on multiple axes; peripheral stones are easier to cut off.
- **Count group sizes before each move** — precisely knowing the current largest group size tells you how many stones you will place next turn and how many your opponent will place; planning several moves ahead with these counts avoids being surprised by a sudden opponent surge.

## Engines & current best play

- **Strongest known program(s):** No game-specific public engine known to the cataloguer. Playable in general-purpose abstract-game frameworks (e.g., [Ludii](https://ludii.games/)).
- **Strength:** Not benchmarked publicly.
- **Notes:** Catchup's variable-move-count mechanic makes it an interesting research game for MCTS and planning algorithms; no dedicated competitive engine has been published.

## Complexity

Moderate.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Catchup_(game))
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)

## See also

- [Hex](hex.md) · [Y](y.md) · [Hive](hive.md) · [Volo](volo.md)
- Lexicon: [partisan game](../lexicon/README.md#partisan-game)
