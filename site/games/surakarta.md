# Surakarta

> Indonesian capture game with looped corner tracks — unsolved.

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

Surakarta is a Javanese capture game on a 6×6 grid joined at the corners by
four curved "loop" tracks. Pieces capture exclusively by travelling around at
least one loop and ending on an opposing piece — there are no captures by
short-range movement.

## Rules

1. Board: 6×6 grid of intersections with four curved loops connecting the
   outer four rows on each side to themselves.
2. Each side has 12 pieces placed on the two ranks nearest them.
3. On a turn a player either:
   - **Moves** one piece one step to an adjacent vacant intersection
     (orthogonally or diagonally); **or**
   - **Captures** by sliding one of their pieces in a straight line, then
     around **at least one** corner loop, and onto an opposing piece (the
     captured piece is removed). Captures require the entire path to be
     unobstructed.
4. The player who captures all of the opponent's pieces wins; if neither side
   can force a capture, the game is drawn or decided by counting (varies).

## Solution status

Surakarta is **not solved**. Some endgame analysis exists; engines play well
but no formal value is known.

## Consensus on optimal play

- **Control the loop entry points** — pieces placed at or near the intersections that feed into the curved corner loops can both threaten captures and block enemy loop-travelling attacks; contest these key squares early.
- **Use non-capturing moves to set up loop attacks** — ordinary steps position a piece for a future loop-capture; move pieces into lines that align with a loop so a single step later triggers a capture.
- **Do not leave pieces on loop lanes unguarded** — a piece sitting on a straight segment connecting to a loop is vulnerable to a long-range capture if the path is clear; keep threatened pieces off the main arteries or have a blocker on the path.
- **Maintain numerical superiority** — with 12 pieces per side on a 6×6 board, trading evenly is neutral; gaining a piece advantage accelerates the win since the opponent has fewer blocking pieces.
- **Corner clusters are both strong and dangerous** — pieces concentrated near a corner control multiple loop exits but are also reachable from two loops; a densely packed corner can be stripped by consecutive loop captures.

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
