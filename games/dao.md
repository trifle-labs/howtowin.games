# Dao

> 4×4 line-and-corner movement game — solved by exhaustive search.

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

## Description

Dao (Ben van Buskirk, 1999) is a 4×4 abstract game in which each player has
4 stones and tries to achieve any of three winning patterns. The board is
small enough to be fully analysed.

## Rules

1. Board: 4×4 grid; each player has 4 stones placed in opposite corners
   (one player's at a1, b2, a3, b4 — the other in a mirrored arrangement;
   **[verify]** the canonical starting layout).
2. On a turn the player picks one of their stones and **slides** it in any
   of the eight directions as far as it can go before hitting an edge or
   another piece (cannot stop short).
3. Stones never capture; the board content shifts but never decreases.
4. A player wins immediately by achieving any of:
   - All 4 stones in one row, column, or diagonal.
   - All 4 stones occupying the four corners.
   - All 4 stones occupying a 2×2 square.
   - All 4 stones surrounding a single opposing stone (a 2×2 enclosure rule
     — varies by variant).

## Solution status

Dao has been **strongly solved** by exhaustive analysis: results circulated
on the abstract-games mailing list around 2002 suggest a first-player win.
**[verify]** the canonical attribution and published date.

## Consensus on optimal play

- **Work toward multiple winning threats simultaneously** — Dao has three different winning configurations (line/diagonal, four corners, 2×2 square); threatening two different configurations at once forces the opponent to defend both, which is usually impossible on the tiny 4×4 board.
- **Stones slide to the edge — plan the endpoint, not the path** — a stone in an unobstructed line always slides to the board edge; before moving, trace exactly where each stone will land and which patterns become threatened or blocked by that landing square.
- **The 2×2 winning cluster is easiest to threaten covertly** — a 2×2 square can form in any of nine positions on the board; grouping your stones centrally gives the most potential 2×2 formations and makes your intent hardest to read.
- **Opponent blocking is mutual** — your own stones block your opponent's slides and vice versa; placing a stone as a blocker that simultaneously threatens a pattern of yours is the most efficient use of a turn.
- **The four-corners pattern is hardest to block** — the opponent must keep pieces off all four corners to prevent this; threatening corners forces the opponent to occupy them, which constrains their own pattern formation.

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
