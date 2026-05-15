# Tic-Tac-Chec

> A chess-piece-based tic-tac-toe — players bring on chess pieces and try to
> line up four of their colour.

| Field | Value |
|-------|-------|
| Also known as | Tic-Tac-Chec |
| Players | 2 |
| Type | Partisan placement+movement game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Unsolved |
| **Game-theoretic value** | Unknown |
| Year solved | — |
| Solved by | — |
| State-space complexity | Moderate |
| Game-tree complexity | Moderate |

## Description

A commercial game from the 2000s combining chess movement with a connect-four
flavour. Each player has four chess pieces in reserve (a pawn, knight, bishop,
rook); the goal is to be the first to align all four of your pieces along a
row, column, or diagonal on a 4×4 board.

## Rules

1. Board: 4×4 grid, empty initially.
2. Each player has a reserve of **one pawn, one knight, one bishop, one rook**.
3. On a turn, a player may either:
   - **Drop** a reserve piece onto any empty square it could legally move to
     from off-board (some sources allow drops on any empty square — **[verify]**
     the canonical rule); or
   - **Move** one of their on-board pieces according to its chess movement
     rules (within the 4×4 grid), optionally capturing an opposing piece.
4. Captured pieces return to the owner's reserve.
5. The first player to align **all four of their pieces** in a row, column, or
   diagonal wins.

## Solution status

Tic-Tac-Chec is **not solved**. The 4×4 board and small piece count make it
plausibly tractable to modern retrograde analysis, but no published solution
exists.

## Consensus on optimal play

- **Deploy the rook as a locking piece** — a rook on the board covers its entire rank and file, threatening alignment along any row or column it occupies; play it early to anchor one of those two lines.
- **Use the knight for non-linear threats** — knights jump over pieces and are the hardest to block; threatening alignment with a knight already placed in a corner or edge forces the opponent to solve two problems at once.
- **Capture strategically, not reflexively** — captured pieces return to the captor's reserve, so capturing an opponent's rook gives them back a powerful drop piece; be certain capturing is worth the gift.
- **Target the diagonal from the start** — with only a 4×4 board, the main diagonals are the most compact winning line (all four pieces must occupy one of eight specific squares); controlling both endpoints of a diagonal early is a lasting threat.
- **Block opponent alignment before extending your own** — the board is too small to ignore even a two-piece alignment; verify that your drop or move does not leave the opponent one step from winning.

## Engines & current best play

- **Strongest known program(s):** No game-specific public engine known to the cataloguer. Playable in general-purpose abstract-game frameworks (e.g., [Ludii](https://ludii.games/)).
- **Strength:** Not benchmarked.
- **Where the proof / tablebase lives (if solved):** —
- **Notes:** The 4×4 board makes full retrograde analysis feasible in principle; no research team has published a solution as of this writing.

## Complexity

Moderate — within range of full retrograde solution if undertaken.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Tic-tac-chec)
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002) (general framework)

## See also

- [Quarto](quarto.md) · [Tic-tac-toe](tic-tac-toe.md) · [Minichess](minichess.md)
- Lexicon: [retrograde analysis](../lexicon/README.md#retrograde-analysis)
