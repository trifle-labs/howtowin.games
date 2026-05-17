# Dara

> A West African three-in-a-row game on a bigger board than the morris family. Unsolved.

| Field | Value |
|-------|-------|
| Also known as | Dara |
| Players | 2 |
| Type | Partisan placement+movement game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Unsolved |
| **Game-theoretic value** | Unknown |
| Year solved | — |
| Solved by | — |
| State-space complexity | Moderate (5×6 or 6×6 board, ~12 pieces a side) |
| Game-tree complexity | Moderate |
| **Playable** | dara |

## Description

Dara is a traditional abstract strategy game from Nigeria and the Sahel region,
often played in sand or on a wooden board. It looks a bit like
[Nine Men's Morris](nine-mens-morris.md) — you place pieces, then move them,
and you win by making lines — but the bigger board (usually 5×6 with 24 pieces
total) and the rule that **you capture by making three in a row** make it quite
different.

## Rules

1. Board: a 5×6 grid of intersections (some versions use 6×6).
2. Each player has **12 stones**.
3. **Placement phase**: Players take turns placing stones on empty intersections. You are **not** allowed to make three in a row during this phase.
4. **Movement phase**: Players take turns sliding one of their stones one square up, down, left, or right to an empty neighboring intersection.
5. If you make a line of exactly three stones in a straight row (across or up-down, not diagonal), you **capture** one enemy stone of your choice. Lines of four or more do not count.
6. The first player who has fewer than 3 stones left (and so can never make three in a row) loses.

## Solution status

Dara is **not solved**. The state space — a 5×6 board with up to 24 placed
stones — is moderate but no formal solving result has been published. There are
practical Dara-playing programs and a competitive human tradition, but no proven
game-theoretic value.

## Consensus on optimal play

- **During placement, set up near-rows without finishing them** — three in a row is not allowed during placement. Place stones that create two-in-a-row setups, which will turn into immediate capture threats the moment the movement phase starts.
- **When you capture, take the opponent's most useful piece** — when you get three in a row and can remove an enemy stone, take the one that is most important to their next potential three in a row. This stops them from making a line and gets them closer to the 3-stone losing limit.
- **Control the center rows and columns** — center intersections are part of more possible three-in-a-row lines (both across and up-down) than edge intersections. A piece in the center can help make several lines at once.
- **Avoid rows of four or more** — only exactly three in a row scores. A line of four does not count, so extending your own three into a four wastes your capture and blocks the scoring line. Know when to stop.
- **Watch your piece count** — you win by reducing the opponent below 3 pieces. Count captures and plan whether you are on track to win by attrition or need to slow down to protect your own pieces.

## Engines & current best play

- **Strongest known program(s):** No game-specific public engine known to the cataloguer. Playable in general-purpose abstract-game frameworks (e.g., [Ludii](https://ludii.games/)).
- **Strength:** Not benchmarked.
- **Notes:** Dara has a living competitive tradition in Nigeria and the Sahel but limited computational analysis; the state space is comparable to Nine Men's Morris (which has been strongly solved), suggesting a formal solution is feasible but has not been published.

## Complexity

Moderate — comparable in size to Nine Men's Morris, plausibly within reach of
modern solvers but not yet attempted.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Dara_(game)) ([archive](http://web.archive.org/web/20260111160444/https://en.wikipedia.org/wiki/Dara_(game)))
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002) (general framework)

## See also

- [Nine Men's Morris](nine-mens-morris.md) · [Twelve Men's Morris](twelve-mens-morris.md)
- Lexicon: [partisan game](../lexicon/README.md#partisan-game) · [state-space complexity](../lexicon/README.md#state-space-complexity)
