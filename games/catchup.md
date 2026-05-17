# Catchup

> A hexagonal board game where the player who is behind gets to place more stones. Unsolved.

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

Catchup (by Nick Bentley, 2010) is a connection game played on a hexagonal
grid. It has an unusual rule: the **size of the biggest group of either color**
on the board decides how many stones you get to place on your next turn. This
dynamically helps the player who is behind.

## Rules

1. The board is a hexagonal grid (commonly 5 or 6 cells per side, with 61 cells total).
2. The first player places just one stone. After that:
   - At the start of your turn, check the size *G* of the **biggest connected group of either color** on the board.
   - You then place that many stones (one per empty cell), or as many as there are empty cells, whichever is fewer.
3. When the board is full, the player with the biggest connected group wins. Ties are broken by comparing the next-biggest group, then the third-biggest, and so on.
4. Stones are never moved or removed once placed.

## Solution status

Catchup is **not solved**. The dynamic move sizing makes the game tree
unusual but no formal value has been computed.

## Consensus on optimal play

- **Don't make big groups too early** — the catch-up rule means that if you make the board's biggest group bigger, your opponent gets more stones on their next turn. Spreading your stones in small separate groups may be better than making one big group until late in the game.
- **Cluster your stones before the game ends** — the winner is whoever has the biggest connected group when the board is full. Stones must eventually connect, but *when* you merge them is key. Merge just when the opponent cannot build an equally big group in response.
- **Turn the opponent's catch-up moves against them** — when the opponent gets to place lots of stones (because your group is big), they have to spread them across the board. Use this to your advantage by forcing them to create only scattered, disconnected groups.
- **Control the center of the hexagonal board** — as in most hexagonal games, stones in the center can connect in more directions. Stones on the edges are easier to cut off.
- **Count group sizes before every move** — knowing the current biggest group size tells you how many stones you and your opponent will place next turn. Planning ahead with these numbers helps you avoid a surprise big move by the opponent.

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
