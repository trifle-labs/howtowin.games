# Achi

> A traditional game from Ghana where players try to line up three pieces on a small board.

| Field | Value |
|-------|-------|
| Also known as | Achi (Ghana) |
| Players | 2 |
| Type | Partisan positional / sliding game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Weakly solved (small enough for exhaustive analysis) |
| **Game-theoretic value** | Draw **[verify]** |
| Year solved | — (analysable by exhaustive search) |
| Solved by | — |
| State-space complexity | A few thousand positions |
| Game-tree complexity | Small |
| **Playable** | achi |

## Description

Achi comes from Ghana. It is played on a 3×3 board made of dots connected by
lines, including both diagonal lines (which makes the center dot extra
important). Each player has **four** pieces. First, players take turns placing
their pieces on empty dots. Once all pieces are on the board, players take
turns sliding one piece along a line to an empty neighboring dot. The first
player to get three of their pieces in a row along a drawn line wins.

## Solution status

Achi is **small enough to be solved by exhaustive search** — its state space is
only a few thousand positions, comparable to [Three Men's Morris](three-mens-morris.md)
and [Nine Holes](nine-holes.md). It is generally reported, like its close
relatives, to be a **draw** with perfect play, the first player's central
advantage notwithstanding.

> **[verify]** — This archive has not located a single canonical primary
> source giving Achi's exact game-theoretic value; the "draw" claim is by
> analogy with the closely related morris games and from general references.
> A direct exhaustive-search citation should be added.

## Consensus on optimal play

- **Take the center on your first turn** — the center dot connects to all lines (horizontal, vertical, and both diagonals), which gives you more ways to win than any corner or edge dot.
- **Fill corners before edges** — corner dots connect to 3 lines each; edge dots connect to only 2, so corners are more valuable during placement.
- **Stop your opponent from getting two in a row** — because the board is tiny (4 pieces each, 9 dots), letting the opponent get two in a row without blocking usually means they will win.
- **In the movement phase, use the center as a hub** — the center connects to every other dot; controlling it during sliding gives you more options.
- **Mirror or block immediately** — if both players play perfectly, the game ends in a draw. Any careless move that lets the opponent get an unblocked two in a row is a loss.

## Engines & current best play

- **Strongest known program(s):** No game-specific public engine known to the cataloguer. Playable in general-purpose abstract-game frameworks (e.g., [Ludii](https://ludii.games/)).
- **Strength:** Not benchmarked.
- **Notes:** The state space is small enough that a complete minimax solve is trivial to implement; no dedicated competitive engine has been published.

## Complexity

A few thousand positions.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Achi_(game)) ([archive](http://web.archive.org/web/20251222103232/https://en.wikipedia.org/wiki/Achi_(game)))
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)

## See also

- [Three Men's Morris](three-mens-morris.md) · [Nine Holes](nine-holes.md) · [Tic-tac-toe](tic-tac-toe.md)
- Lexicon: [weakly solved](../lexicon/README.md#weakly-solved) · [draw](../lexicon/README.md#draw)
