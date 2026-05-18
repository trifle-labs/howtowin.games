# Frisian draughts

> A checkers variant from Friesland played on a 10×10 board. The big difference: pieces can capture up, down, left, or right, not just diagonally.

| Field | Value |
|-------|-------|
| Also known as | Frysk dammen |
| Players | 2 |
| Type | Partisan draughts |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Unsolved |
| **Game-theoretic value** | Unknown |
| Year solved | — |
| Solved by | — |
| **Playable** | frisian-draughts |
| State-space complexity | Similar to international draughts |
| Game-tree complexity | Similar to international draughts |

## Description

Frisian draughts (Frisian checkers) is a 10×10 checkers variant from the Friesland region of the Netherlands. The key difference from international checkers: pieces can capture not only diagonally but also up, down, left, or right (orthogonally). This extra capture power makes the game much sharper and more tactical.

## Rules

1. Board: 10×10, same starting setup as international checkers (20 pieces per side on the dark squares of the first four rows).
2. Regular pieces move and capture diagonally forward, same as in international checkers.
3. **Orthogonal capture (up, down, left, or right)**: in addition to the usual diagonal jump, pieces may capture by jumping over a neighboring enemy piece in a straight up/down/left/right line to the next empty cell. Kings may capture this way at any distance (like a rook in chess).
4. The maximum-capture rule applies: if you have multiple capture options, you must choose the sequence that captures the most pieces.
5. Pieces become kings when they reach the opponent's back row. Flying kings (kings that can slide any distance) move and capture any distance along diagonals, and also up/down/left/right.
6. A player with no legal moves loses.

## Solution status

Frisian draughts is **not solved**. Engines exist (e.g., Damage) but the
orthogonal capture rule makes the state-graph distinct from international
draughts and tablebases are correspondingly smaller.

## Consensus on optimal play

- **Threats from all directions are more dangerous** — a king that threatens both diagonal and straight-line captures can attack from angles impossible in standard checkers. Always check both types of lines when planning.
- **Get kings to the center early** — Frisian kings are very powerful because they can capture straight lines. Getting kings to the center files lets them dominate entire rows and columns.
- **Use the maximum-capture rule against your opponent** — you can sacrifice a piece that forces the opponent into a long capture sequence, leaving their pieces out of position. Look for "shot" combinations that flip the material balance.
- **Watch out for long-range straight-line sweeps** — a king on an open row or column can sweep up multiple pieces. Keep your pieces clustered diagonally from the opponent's kings, not lined up with them.
- **Piece count matters more than in regular checkers** — the extra capture power means being one piece down is often immediately decisive. Avoid leaving pieces unprotected.
- **Endgames: king vs. two pieces is often a win for the king** — the ability to capture straight lines lets the king catch pieces that would escape in international checkers.

## Engines & current best play

- **Strongest known program(s):** Damage — dedicated Frisian draughts engine by Bert Tuyt.
- **Strength:** Super-human at competitive level.
- **Where the proof / tablebase lives (if solved):** Not solved; no public complete tablebase.
- **Notes:** Competitive scene centred in the Netherlands; Damage is the reference engine used in online play on Toernooibase and lidraughts.

## Complexity

Similar to international draughts.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Frisian_draughts) ([archive](http://web.archive.org/web/20251004011548/https://en.wikipedia.org/wiki/Frisian_draughts))
- [Schaeffer et al. (2007). *Checkers is Solved*.](../references.md#schaeffer2007) (related)
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)

## See also

- [International draughts](international-draughts.md) · [Turkish draughts](turkish-draughts.md) · [Russian draughts](russian-draughts.md)
- Lexicon: [partisan game](../lexicon/README.md#partisan-game)
