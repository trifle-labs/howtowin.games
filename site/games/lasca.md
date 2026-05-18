# Lasca

> A checkers variant where captured pieces are stacked underneath the capturing piece instead of being removed. Unsolved.

| Field | Value |
|-------|-------|
| Also known as | Laska, Lasker draughts |
| Players | 2 |
| Type | Partisan board game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Unsolved |
| **Game-theoretic value** | Unknown |
| Year solved | — |
| Solved by | — |
| State-space complexity | Large — towers of pieces give very many distinct positions |
| Game-tree complexity | Large |
| **Playable** | lasca |

## Description

Invented by chess world champion Emanuel Lasker (1911). Played on a 7x7 board (25 playing squares), 11 pieces per side. The defining rule: when you capture by jumping, the captured piece is not removed — it is placed underneath the jumping piece, forming a column (tower). Only the top piece of a column determines who owns it and how it moves. Capturing the top piece can "liberate" an enemy piece beneath it. A player wins when the opponent cannot move.

## Solution status

Lasca is **unsolved**. The stacking rule is what makes it hard: a single square
can hold a tower of many pieces in many colour-orderings, so the state space is
vastly larger than a same-sized flat draughts board — pieces are never
permanently removed, only re-buried and re-exposed. This blocks the
[retrograde-analysis](../lexicon/README.md#retrograde-analysis) "few pieces
left" simplification that made [checkers](checkers.md) solvable. Lasca has only
a small competitive and programming community, and no game-theoretic value has
been established.

## Consensus on optimal play

- **Control the top of your towers** — only the top piece determines who controls a tower. Capturing the top frees the piece beneath and hands it to the opponent. Prioritize keeping your own color on top of your valuable towers.
- **Build tall towers carefully** — a tall tower with enemy pieces buried beneath it is a liability. Losing the top piece in a jump turns those enemy pieces into mobile attackers. Keep your deepest towers guarded.
- **Check what is underneath before capturing** — before making a jump, check what color the piece beneath your target is. Freeing a strong enemy piece from under a tower can instantly swing the position.
- **The player who can access buried pieces first has an advantage** — jumping a tower to claim the top can unearth a piece of the right color that becomes a new attacker. Plan sequences with the tower composition in mind.
- **Mobility wins in the endgame** — a player with more movable towers wins by wearing the opponent down. Avoid positions where all your towers are locked behind opponent towers.

## Engines & current best play

- **Strongest known program(s):** No widely-known public engine; a handful of amateur programs exist.
- **Strength:** Not benchmarked; engine community is small.
- **Where the proof / tablebase lives (if solved):** Not solved; the tower mechanic prevents straightforward retrograde analysis.
- **Notes:** Emanuel Lasker's 1911 invention has a tiny competitive community; the stacking rule makes the state space much larger than standard 7×7 draughts.

## Complexity

Large and not well quantified in the literature; the tower mechanic is the key
source of blow-up.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Lasca) ([archive](http://web.archive.org/web/20251219095839/https://en.wikipedia.org/wiki/Lasca))
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002) (general framework)

## See also

- [Checkers (English draughts)](checkers.md) · [International draughts](international-draughts.md)
- Lexicon: [retrograde analysis](../lexicon/README.md#retrograde-analysis) · [state-space complexity](../lexicon/README.md#state-space-complexity)
