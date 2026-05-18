# Brazilian draughts

> International draughts rules on an 8×8 board, with flying kings. Unsolved.

| Field | Value |
|-------|-------|
| Also known as | Damas brasileiras |
| Players | 2 |
| Type | Partisan draughts |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Unsolved |
| **Game-theoretic value** | Unknown |
| Year solved | — |
| Solved by | — |
| State-space complexity | Similar to English draughts |
| Game-tree complexity | Similar to English draughts |
| **Playable** | brazilian-draughts |

## Description

Brazilian draughts is basically international draughts (Polish draughts) but
played on an 8×8 board. Key differences from regular checkers: pieces can
capture backward as well as forward, kings can move any number of squares
along a diagonal (they "fly"), and when you capture, you must take the
maximum number of pieces possible.

## Rules

1. Board: 8×8 squares, with dark squares on the player's left. Each side starts with 12 pieces ("men").
2. Men move one square forward diagonally. Men capture by jumping over enemy pieces either forward or backward.
3. If you can capture, you must. You must take the **maximum number of pieces** possible in a capture sequence.
4. When a man reaches the opponent's back row during a multi-jump capture and gets promoted to a king, it continues as a king if it can still capture more pieces.
5. Kings can move and capture any distance along a diagonal (called a "flying king"). After jumping a piece, the king must land on the square just past that piece along the same diagonal line, but may stop on any empty square further along that line.
6. You lose if you have no legal moves.

## Solution status

Brazilian draughts is **not solved**. Tablebase work covers small endgames;
engines are strong but no full proof exists.

## Consensus on optimal play

- **The maximum-capture rule controls everything** — if you can capture, you must, and you have to take the most pieces possible. Always start by finding the longest capture chain available to each side before thinking about positioning.
- **Get kings as fast as possible** — a king that can fly along diagonals is much more powerful than a regular piece. Moving pieces toward the back row while blocking the opponent from doing the same is your main goal.
- **Control the long diagonal** — the long diagonal is the main highway for flying kings. Putting a piece on the central long diagonal squares limits the opponent's king movement.
- **Keep piece count even; avoid bad trades** — because you must capture the most pieces possible, trades can be forced. Make sure your capture chains don't leave you with fewer or weaker pieces afterward.
- **In king endings, turn order matters** — when only kings are left, who has the better diagonal position often decides the game. Flying kings make positioning tricks important in these endgames.

## Engines & current best play

- **Strongest known program(s):** Various draughts engines adapted for Brazilian rules (e.g., Kingsrow or Cake variants); no single canonical public engine for this specific variant is prominently documented.
- **Strength:** Super-human for endgame positions covered by tablebases; strong amateur to expert-level in midgame.
- **Where the proof / tablebase lives (if solved):** Endgame tablebases for small piece counts exist; full game is unsolved.
- **Notes:** Brazilian draughts sits between English draughts (solved) and international draughts (10×10, unsolved) in complexity; its flying-king rules make it considerably harder to solve than English draughts despite the same 8×8 board.

## Complexity

Similar to English draughts.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Brazilian_draughts) ([archive](http://web.archive.org/web/20260312045332/https://en.wikipedia.org/wiki/Brazilian_draughts))
- [Schaeffer et al. (2007). *Checkers is Solved*.](../references.md#schaeffer2007) (related)
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)

## See also

- [International draughts](international-draughts.md) · [English draughts](checkers.md) · [Russian draughts](russian-draughts.md)
- Lexicon: [endgame tablebase](../lexicon/README.md#endgame-tablebase)
