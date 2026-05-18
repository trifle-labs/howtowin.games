# Tic-Tac-Chec

> A game that combines chess pieces with a tic-tac-toe-style win condition. It has not been solved.

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
| **Playable** | tic-tac-chec |

## Description

A commercial game from the 2000s that combines chess piece movement with a connect-four-style goal. Each player has four chess pieces in reserve (a pawn, a knight, a bishop, and a rook). The goal is to be the first to get all four of your pieces in a row, column, or diagonal on a 4x4 board.

## Rules

1. Board: a 4x4 grid, empty at the start.
2. Each player has a reserve of one pawn, one knight, one bishop, and one rook.
3. On a turn, a player may either:
   - Drop a reserve piece onto any empty square it could legally move to from off the board; or
   - Move one of their on-board pieces according to its chess movement rules (within the 4x4 grid), and may capture an opposing piece.
4. Captured pieces return to their owner's reserve.
5. The first player to get all four of their pieces in a row, column, or diagonal wins.

## Solution status

Tic-Tac-Chec is **not solved**. The 4×4 board and small piece count make it
plausibly tractable to modern retrograde analysis, but no published solution
exists.

## Consensus on optimal play

- **Deploy the rook as an anchor piece** — a rook on the board controls its entire row and column, threatening to line up along any of them. Play the rook early to lock down one of those lines.
- **Use the knight for tricky threats** — knights jump over other pieces and are the hardest to block. Threatening a line with a knight already in a corner or edge forces the opponent to solve two problems at once.
- **Capture carefully** — captured pieces return to the opponent's reserve. If you capture the opponent's rook, they get it back to drop anywhere. Make sure capturing is worth giving them that powerful piece.
- **Target a diagonal from the start** — with only a 4x4 board, the main diagonals are the shortest winning line. Controlling both ends of a diagonal early creates a lasting threat.
- **Block the opponent before extending your own line** — the board is too small to ignore even a two-piece alignment. Check that your move does not leave the opponent one step from winning.

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
