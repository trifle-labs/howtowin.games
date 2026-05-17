# Turkish draughts

> Orthogonal draughts where pieces move along ranks and files — unsolved.

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
| State-space complexity | Similar to English draughts |
| Game-tree complexity | Similar to English draughts |

## Description

Turkish draughts is played on an 8×8 board where pieces move **orthogonally**
rather than diagonally. The starting position fills the 2nd and 3rd ranks
with 16 men per side, and kings are long-range orthogonal movers.

## Rules

1. Board: 8×8. Each side has 16 men on the 2nd and 3rd ranks (or 7th and 6th).
2. Men move one square forward or sideways (never backward, never diagonally).
3. Men capture by jumping an adjacent enemy piece **forward or sideways** to
   the next empty square; captures are mandatory.
4. Multiple captures chain; the player must take the maximum number of pieces.
5. A man reaching the far rank becomes a **king**, which moves and captures
   any number of squares along a rank or file in one move (like a rook).
6. A side with no pieces or no legal moves loses; a single king vs. a single
   king is drawn.

## Solution status

Turkish draughts is **not solved**. The orthogonal geometry makes its
state-graph distinct from diagonal draughts variants.

## Consensus on optimal play

- **Trade men for kings aggressively** — a king in Turkish draughts is vastly more powerful than a man (full rook movement); accepting an unfavourable man trade to promote is usually correct if the resulting king cannot be quickly captured.
- **Mandatory multi-capture is the dominant tactic** — a chain capture that removes two or three men is almost always better than a positional move; position pieces to enable or threaten long chains, and watch for your opponent setting a trap with an apparent capture bait.
- **Occupy the centre ranks early** — controlling ranks 4 and 5 with men allows forward-and-sideways threats in multiple directions; edge men are hemmed in and contribute to fewer captures.
- **Never allow a sideways blockade** — because men can move sideways, a wall of men along a rank can be attacked from both sides; spread your men slightly to avoid a single orthogonal sweep stripping an entire rank.
- **King vs. king endings often draw** — a lone king against a lone king is explicitly drawn; if losing material, steer for a single-king-vs.-single-king endgame to secure a half-point.

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
