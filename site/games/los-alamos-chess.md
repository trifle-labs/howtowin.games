# Los Alamos chess

> Chess on a 6x6 board. The first chess-like game ever played by a computer program.

| Field | Value |
|-------|-------|
| Also known as | Los Alamos chess, MANIAC chess |
| Players | 2 |
| Type | Partisan chess variant |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Solved |
| **Game-theoretic value** | First-player (White) win |
| Year solved | 1956 (first computer chess program) |
| Solved by | MANIAC I (Los Alamos) |
| State-space complexity | ~10^14 |
| Game-tree complexity | ~10^18 |
| **Playable** | los-alamos-chess |

## Description

Los Alamos chess was the first chess-like program to run on a computer, written for the MANIAC I at Los Alamos National Laboratory in 1956. It is played on a 6x6 board with simplified pieces: King, Queen, Rook, two Knights, and six Pawns per side (no Bishops, since they would be severely limited on a 6x6 board). The first public match pitted the MANIAC I against a human volunteer, who lost in 23 moves.

## Rules

1. Board: 6 columns by 6 rows.
2. Each side: King, Queen, Rook, 2 Knights, 6 Pawns.
3. No bishops, no castling, no en-passant (capturing a pawn that just moved two squares forward).
4. Pawns promote on the 6th row (to Queen or Knight).
5. Standard check and checkmate. Stalemate is a draw.

## Solution status

Effectively solved in 1956 by the MANIAC I program, which demonstrated a first-player win with competent play. The small board size makes the game computationally tractable for retrograde analysis, though a formal solution of the starting position is a known result.

## Consensus on optimal play

- **Control the center** — with only 6 columns, central control is even more critical than in chess. The d- and e-files (columns 3 and 4) dominate the board.
- **Knights are strong** — without bishops, knights are the only minor pieces. A knight on a central square can reach most of the board in two moves.
- **Queen activity decides games** — the queen is the only long-range piece and can dominate the 6x6 board. Early queen development is more viable than in chess.
- **Pawn promotion is decisive** — with a small board, an extra queen is overwhelming. Endgame play revolves around pushing the passed pawn.

## Engines & current best play

- **Strongest known program(s):** Any modern chess engine with 6×6 board support.
- **Strength:** Completely solved.
- **Where the proof / tablebase lives (if solved):** Known from exhaustive search.

## Complexity

Tiny: ~10^14 positions.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Los_Alamos_chess) ([archive](http://web.archive.org/web/20260424074849/https://en.wikipedia.org/wiki/Los_Alamos_chess))
- Original 1956 paper by Kister et al.

## See also

- [Chess](chess.md) · [Capablanca chess](capablanca-chess.md)
- Lexicon: [solved game](../lexicon/README.md#solved-game)
