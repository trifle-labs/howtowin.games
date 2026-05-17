# Catch the Hare

> An asymmetric chase game where hounds try to corner a single hare. Partially solved.

| Field | Value |
|-------|-------|
| Also known as | El Coyote, La Liebre y los Galgos |
| Players | 2 (asymmetric) |
| Type | Partisan asymmetric hunt game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Solved for several boards **[verify]** |
| **Game-theoretic value** | Depends on board; small boards favour the hounds **[verify]** |
| Year solved | — |
| Solved by | — |
| State-space complexity | Small |
| Game-tree complexity | Small |
| **Playable** | catch-the-hare |

## Description

Catch the Hare is the general name for a family of chase games where a small
number of hounds (usually 3) try to trap a single hare on a small board.
Different versions of this game appear across medieval Europe and the Americas.

## Rules

1. Board: a small cross-shaped or diamond-shaped grid (exact shape varies by tradition).
2. One player controls 3 (sometimes 4) hounds; the other controls 1 hare.
3. Hounds can move one step **forward or sideways** but never backward. The hare can move one step in any direction. No pieces are captured.
4. The hounds win if the hare cannot move (it is cornered).
5. The hare wins by **sneaking past** the hounds and reaching the back row where the hounds started.

## Solution status

Several specific Catch-the-Hare boards have been solved by exhaustive search;
the hounds typically win with perfect play if the board geometry favours
them, while the hare wins on more open boards. **[verify]** the canonical
board's value.

## Consensus on optimal play

- **Hounds must move forward as a solid wall** — the hare can slip through any gap in the hound line. The hounds must stay side by side with no spaces between them. A single empty space between two hounds lets the hare squeeze through and win.
- **Hounds: keep all hounds together** — all three hounds should advance together at roughly the same row. If one hound gets ahead of the others, it is easily outflanked and the formation breaks.
- **Hare: look for gaps right away** — the hare's only winning move is to find or force a gap in the hound line and run through it. Moves that threaten multiple gaps at once are strongest.
- **Hare: move sideways to stretch the hounds** — moving to the side forces the hounds to spread out wider, which makes gaps more likely. Diagonal escapes toward the corners are often the last hope.
- **Board shape decides everything** — on narrow boards (few columns), the hounds can cover all gaps easily and win reliably. On wide open boards, the hare has room to run around the line and escape. Know which kind of board you are playing on.

## Engines & current best play

- **Strongest known program(s):** No game-specific public engine known to the cataloguer. Playable in general-purpose abstract-game frameworks (e.g., [Ludii](https://ludii.games/)).
- **Strength:** Not benchmarked.
- **Notes:** Several specific board variants have been solved by exhaustive search in the academic literature; the state space is small enough that a complete minimax solve is straightforward for any fixed board geometry.

## Complexity

Small.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Hare_games) ([archive](http://web.archive.org/web/20260405215833/https://en.wikipedia.org/wiki/Hare_games))
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)

## See also

- [Fox and Geese](fox-and-geese.md) · [Halatafl](halatafl.md) · [Tablut](tablut.md)
- Lexicon: [hunt game](../lexicon/README.md#hunt-game)
