# Frisian draughts

> Dutch-Frisian draughts on 10×10 with orthogonal capture by kings — unsolved.

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
| State-space complexity | Similar to international draughts |
| Game-tree complexity | Similar to international draughts |

## Description

Frisian draughts is a 10×10 draughts variant from Friesland in which pieces
may also capture **orthogonally** in addition to diagonally. The orthogonal
captures make the tactical play distinctively sharp.

## Rules

1. Board: 10×10, same starting positions as international draughts (20 men
   per side on dark squares of the first four ranks).
2. Men move and capture diagonally forward as in international draughts.
3. **Orthogonal capture**: in addition to the usual diagonal jump, men may
   capture by jumping an adjacent enemy piece orthogonally (sideways or
   forward) to the next empty cell. Kings may capture orthogonally at any
   distance.
4. The maximum-capture rule applies: a player must choose a capture sequence
   taking the largest number of pieces.
5. Promotion happens on the back rank; flying kings move any distance along
   diagonals (and capture diagonally or orthogonally).
6. A player with no legal move loses.

## Solution status

Frisian draughts is **not solved**. Engines exist (e.g., Damage) but the
orthogonal capture rule makes the state-graph distinct from international
draughts and tablebases are correspondingly smaller.

## Consensus on optimal play

- **Orthogonal threats multiply danger** — a king that threatens both diagonal and orthogonal captures can fork positions impossible in standard draughts; always scan both axes when calculating.
- **Centralise kings early** — Frisian kings are exceptionally powerful because of orthogonal range; getting kings to central files lets them dominate entire ranks and files simultaneously.
- **Maximum-capture obligations can be exploited** — sacrificing a piece that forces the opponent into a long capture sequence can leave their pieces out of position; look for "shot" combinations that reverse material count.
- **Guard against long-range orthogonal sweeps** — a king on an open rank or file can hoover multiple pieces; keep your piece clusters diagonal to the opponent's kings, not aligned orthogonally.
- **Piece count matters more than in regular draughts** — the extra capture power means a man-down position is often immediately decisive; avoid loose pieces.
- **Endgames: king vs. two men is often won for the king** — the orthogonal range allows the king to catch men that would escape in international draughts.

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
