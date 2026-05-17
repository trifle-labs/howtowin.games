# Achi

> A Ghanaian three-in-a-row game, a close relative of Three Men's Morris.

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

A traditional game of Ghana played on a 3×3 grid of points with both diagonals
marked (giving the centre point a high connectivity). Each player has **four**
pieces. Players place all their pieces alternately, then enter a movement phase,
sliding a piece along a marked line to an adjacent empty point; three in a row
along a marked line wins.

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

- **Take the centre on move 1** — the centre point connects all four lines (horizontal, vertical, two diagonals), giving more winning threats than any corner or edge point.
- **Fill corners before edges** — corners connect 3 lines each; edges connect only 2, making corners more strategically valuable in the placement phase.
- **Deny your opponent two-in-a-row** — because the board is tiny (4 pieces each, 9 points), a single unchallenged two-in-a-row often converts directly to a win.
- **In the movement phase, use the centre as a pivot** — the centre connects to all other points; controlling it in the sliding phase gives mobility advantage.
- **Mirror or block immediately** — with optimal play by both sides the game is a draw; any passive move that allows an unblocked two-in-a-row is fatal.

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
