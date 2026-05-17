# Dao

> A 4×4 board game where stones slide to the edge. Solved by exhaustive search.

| Field | Value |
|-------|-------|
| Also known as | Dao |
| Players | 2 |
| Type | Partisan movement game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Strongly solved **[verify]** |
| **Game-theoretic value** | First-player win **[verify]** |
| Year solved | ~2002 **[verify]** |
| Solved by | van den Herik et al. **[verify]** |
| State-space complexity | Small (~10^7) |
| Game-tree complexity | Small |
| **Playable** | dao |

## Description

Dao (by Ben van Buskirk, 1999) is a 4×4 abstract game where each player has 4
stones and tries to create any of three winning patterns. The board is small
enough to be fully analyzed by computer.

## Rules

1. Board: a 4×4 grid. Each player has 4 stones placed in opposite corners (one player starts at a1, b2, a3, b4 — the other is mirrored).
2. On your turn, you pick one of your stones and **slide** it in any of the eight directions as far as it can go until it hits the edge of the board or another piece. You cannot stop short.
3. Stones never capture. The pieces on the board shift around but never leave.
4. A player wins right away by making any of these patterns:
   - All 4 stones in one row, column, or diagonal.
   - All 4 stones on the four corners.
   - All 4 stones in a 2×2 square.
   - All 4 stones surrounding a single enemy stone (this one varies by version).

## Solution status

Dao has been **strongly solved** by exhaustive analysis: results circulated
on the abstract-games mailing list around 2002 suggest a first-player win.
**[verify]** the canonical attribution and published date.

## Consensus on optimal play

- **Work toward multiple winning patterns at once** — Dao has three winning patterns (line/diagonal, four corners, 2×2 square). Threatening two different patterns at once forces the opponent to defend both, which is usually impossible on the tiny 4×4 board.
- **Stones slide to the edge — plan where they end up, not how they get there** — a stone with nothing in its way always slides to the board edge. Before you move, trace exactly where each stone will land and which patterns get created or blocked by that landing spot.
- **The 2×2 square is the easiest threat to hide** — a 2×2 square can form in nine different positions on the board. Grouping your stones in the center gives you the most possible 2×2 formations and makes your plan hardest to read.
- **Your stones block the opponent too** — your own stones block the opponent's slides and vice versa. Placing a stone that both blocks the opponent and threatens one of your own patterns is the best use of a turn.
- **The four-corners pattern is hardest to block** — to stop it, the opponent must keep pieces off all four corners. Threatening the corners forces the opponent to occupy them, which limits their own pattern options.

## Engines & current best play

- **Strongest known program(s):** No game-specific public engine known to the cataloguer; the exhaustive-search solution from ~2002 serves as the perfect-play oracle.
- **Strength:** Perfect play achievable via the solved tables; not benchmarked against humans.
- **Where the proof / tablebase lives (if solved):** Community analysis from the abstract-games mailing list, ~2002; see [../references.md#herik-dao2002](../references.md#herik-dao2002) [verify].
- **Notes:** Dao's small state space makes it trivially solvable by exhaustive search; the result (first-player win) is widely reported but lacks a peer-reviewed published citation.

## Complexity

Small.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Dao_(game)) ([archive](http://web.archive.org/web/20251125063343/https://en.wikipedia.org/wiki/Dao_(game)))
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)
- [van den Herik *Dao* analysis (2002).](../references.md#herik-dao2002) **[verify]**

## See also

- [Quarto](quarto.md) · [Quixo](quixo.md) · [Volo](volo.md)
- Lexicon: [strongly solved](../lexicon/README.md#strongly-solved)
