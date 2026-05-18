# Surakarta

> An Indonesian game from Java where pieces capture by travelling around curved tracks at the corners of the board.

| Field | Value |
|-------|-------|
| Also known as | Permainan |
| Players | 2 |
| Type | Partisan capture game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Unsolved |
| **Game-theoretic value** | Unknown |
| Year solved | — |
| Solved by | — |
| State-space complexity | Moderate |
| Game-tree complexity | Moderate |
| **Playable** | surakarta |

## Description

Surakarta is a capture game from Java (Indonesia) played on a 6x6 grid with four curved tracks connecting the corners. Pieces capture by travelling around at least one of these curved loops and landing on an enemy piece. There are no captures by normal step-by-step movement.

## Rules

1. Board: a 6x6 grid of intersections with four curved loops connecting the outer rows on each side.
2. Each player has 12 pieces placed on the two rows closest to them.
3. On a turn, a player either:
   - Moves one piece one step to a neighboring empty intersection (up, down, left, right, or diagonally); or
   - Captures by sliding one of their pieces in a straight line, then around at least one corner loop, and onto an enemy piece (the captured piece is removed). The entire path must be clear — no other pieces can block it.
4. The player who captures all of the opponent's pieces wins. If neither side can force a capture, the game is drawn or decided by counting (varies by ruleset).

## Solution status

Surakarta is **not solved**. Some endgame analysis exists; engines play well
but no formal value is known.

## Consensus on optimal play

- **Control the loop entry points** — pieces near the points where the curved corner loops connect to the main grid can threaten captures and block the opponent's loop attacks. Fight for these key spots early.
- **Use ordinary moves to set up loop attacks** — normal step-by-step moves position a piece for a future loop capture. Move pieces into lines that line up with a loop so that a single step later sets up a capture.
- **Do not leave pieces on loop paths unguarded** — a piece sitting on a straight line leading to a loop is vulnerable to a long-range capture if the path is clear. Keep threatened pieces off the main paths, or place a blocker between them and the loop.
- **Try to get more pieces than the opponent** — with 12 pieces per side on a 6x6 board, trading pieces evenly is neutral. Getting a piece advantage helps you win because the opponent has fewer pieces to block with.
- **Corner clusters are both strong and risky** — pieces grouped near a corner control multiple loop exits, but they are also reachable from two different loops. A packed corner can be cleared out by back-to-back loop captures.

## Engines & current best play

- **Strongest known program(s):** No game-specific public engine known to the cataloguer. Playable in general-purpose abstract-game frameworks (e.g., [Ludii](https://ludii.games/)).
- **Strength:** Not benchmarked.
- **Where the proof / tablebase lives (if solved):** —
- **Notes:** No formal computational solution has been published; Surakarta is primarily studied as a cultural and recreational game.

## Complexity

Moderate.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Surakarta_(game))
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)

## See also

- [Yote](yote.md) · [Seega](seega.md) · [Picaria](picaria.md)
- Lexicon: [partisan game](../lexicon/README.md#partisan-game)
