# Catch the Hare

> Asymmetric hunt game: hounds versus a single hare — partially analysed.

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

Catch the Hare is the generic name for a family of asymmetric pursuit games
in which a small number of hounds (typically 3) try to corner a single hare
on a small board. Versions appear across medieval Europe and the Americas.

## Rules

1. Board: small cross- or diamond-shaped grid (varies by tradition).
2. One side controls 3 (sometimes 4) hounds; the other side controls 1 hare.
3. Hounds may move one step **forward or sideways** but never backward;
   the hare moves one step in any direction. No captures.
4. The hounds win if the hare cannot move (cornered).
5. The hare wins by **escaping past** the hounds — reaching the back row from
   which the hounds started.

## Solution status

Several specific Catch-the-Hare boards have been solved by exhaustive search;
the hounds typically win with perfect play if the board geometry favours
them, while the hare wins on more open boards. **[verify]** the canonical
board's value.

## Consensus on optimal play

- **Hounds must advance as an unbroken line** — because the hare can escape through any gap in the hound formation, the hounds must maintain a contiguous front with no jumpable spaces; a single-step gap between two adjacent hounds allows the hare to slip through and win.
- **Hounds: never let a hound fall behind the others** — all three hounds should advance together at roughly the same rank; an isolated hound ahead of its companions is easily flanked and the formation breaks.
- **Hare: immediately probe for and exploit gaps** — the hare's only winning strategy is to find or force a gap in the hound line and sprint through it; probing moves that threaten multiple gaps simultaneously are strongest.
- **Hare: use lateral movement to stretch the hound line** — moving to the side forces hounds to spread their formation wider, increasing the risk of a gap; diagonal escapes to the corner regions are often the last resort.
- **Geometry is decisive** — on narrow boards (few columns) the hounds can close all gaps easily and win reliably; on wide open boards the hare has room to manoeuvre around the line and escape. Know which regime your specific board falls into.

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
