# Turkish draughts

> A checkers variant played on an 8x8 board where pieces move forward, sideways, or backward instead of diagonally. It has not been solved.

| Field | Value |
|-------|-------|
| Also known as | Dama (Turkey, Middle East) |
| Players | 2 |
| Type | Partisan draughts |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Unsolved |
| **Game-theoretic value** | Unknown |
| Year solved | — |
| Solved by | — |
| **Playable** | turkish-draughts |
| State-space complexity | Similar to English draughts |
| Game-tree complexity | Similar to English draughts |

## Description

Turkish draughts is played on an 8x8 board where pieces move forward, sideways, or backward (up, down, left, right) instead of diagonally. The starting position fills the 2nd and 3rd rows with 16 pieces per side. Kings can move any distance along a row or column.

## Rules

1. Board: 8x8. Each side has 16 pieces on the 2nd and 3rd rows (or 7th and 6th, depending on perspective).
2. Pieces move one square forward or sideways (never backward, never diagonally).
3. Pieces capture by jumping over a neighboring enemy piece forward or sideways to the next empty square. Captures are required (mandatory).
4. Multiple captures chain together. The player must take the maximum number of pieces possible.
5. A piece reaching the far row becomes a king, which moves and captures any number of squares along a row or column in one move (like a rook in chess).
6. A player with no pieces or no legal moves loses. A single king against a single king is a draw.

## Solution status

Turkish draughts is **not solved**. The orthogonal geometry makes its
state-graph distinct from diagonal draughts variants.

## Consensus on optimal play

- **Aim to get kings as soon as possible** — a king in Turkish draughts is much more powerful than a regular piece (it can move any distance along rows and columns). Accepting a bad trade of pieces to get a king is usually worth it, as long as the king cannot be captured right away.
- **Chain captures are the most important tactic** — a capture chain that removes two or three pieces is almost always better than making a positional move. Set up your pieces to create or threaten long capture chains, and watch for the opponent doing the same.
- **Control the center rows early** — controlling rows 4 and 5 with your pieces lets you attack in multiple directions. Pieces on the edges are trapped and have fewer capture opportunities.
- **Do not let the opponent block a whole row** — because pieces can move sideways, a wall of pieces along a row can be attacked from both sides. Keep your pieces slightly spread to avoid losing an entire row in one capture chain.
- **King versus king is a draw** — a single king against a single king is always a draw. If you are losing pieces, aim for this endgame to secure a draw.

## Engines & current best play

- **Strongest known program(s):** No widely-known open-source engine dedicated to Turkish draughts; some general draughts engines and online platforms (e.g., on Turkish gaming sites) include it.
- **Strength:** Competitive with strong amateur players; no super-human benchmarked program is publicly documented.
- **Where the proof / tablebase lives (if solved):** —
- **Notes:** Turkish draughts is the primary draughts variant in Turkey and parts of the Middle East; its orthogonal geometry makes it geometrically distinct from diagonal variants like English draughts.

## Complexity

Similar to English draughts.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Turkish_draughts) ([archive](http://web.archive.org/web/20250927084242/https://en.wikipedia.org/wiki/Turkish_draughts))
- [Schaeffer et al. (2007). *Checkers is Solved*.](../references.md#schaeffer2007) (related)
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)

## See also

- [English draughts](checkers.md) · [Russian draughts](russian-draughts.md) · [Frisian draughts](frisian-draughts.md) · [Italian draughts](italian-draughts.md)
- Lexicon: [partisan game](../lexicon/README.md#partisan-game)
