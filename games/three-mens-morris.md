# Three Men's Morris

> The smallest of the morris games — placement then movement, three in a row to
> win — and a comfortable draw with perfect play.

| Field | Value |
|-------|-------|
| Also known as | Three Men's Morris, Nine Holes (related), Achi (related) |
| Players | 2 |
| Type | Partisan positional / sliding game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Strongly solved |
| **Game-theoretic value** | Draw |
| Year solved | Folklore (exhaustively analysable) |
| Solved by | Folklore |
| State-space complexity | A few thousand positions |
| Game-tree complexity | Small |

## Description

Played on a 3×3 grid of points (often with diagonals marked). Each player has
three pieces. Players first **place** their three pieces alternately, then enter
a **movement phase**, sliding a piece along a marked line to an adjacent empty
point. Forming a mill — three pieces in a marked row — wins.

## Solution status

Three Men's Morris is **strongly solved**. With only a few thousand reachable
positions, the entire game graph is exhaustively known, and under standard rules
the game-theoretic value is a **draw**. A common practical wrinkle: the first
player's natural placement in the centre is so strong that some rule sets ban
the opening centre move to keep the game interesting — but even without that
ban, best play by both sides yields a draw.

It is the simplest member of the [morris family](nine-mens-morris.md), which
scales up through [Six](six-mens-morris.md), [Nine](nine-mens-morris.md), and
[Twelve Men's Morris](twelve-mens-morris.md).

## Consensus on optimal play

- **Take the centre on the first move** — the centre connects to all four rows, columns, and both diagonals; it is the most powerful point on the board and must be contested immediately.
- **If the centre is taken, play a corner** — corners lie on three lines (row, column, diagonal) while edge points lie on only two; corner placement gives the most future winning threats.
- **Block every two-in-a-row before extending your own** — the board is too small to allow even one unblocked two-in-a-row; defence is always the priority.
- **In the movement phase, shuttle to create forks** — a fork (two simultaneous three-in-a-row threats) cannot be blocked by a single move; create forks by sliding a piece to a point that threatens two lines at once.
- **Accept the draw if you cannot fork** — with three pieces each on a 3×3 board, creating an unstoppable fork against an alert opponent is usually impossible; steer toward repetition rather than weakening your position chasing a win.

## Engines & current best play

- **Strongest known program(s):** Exhaustive search (trivial; thousands of positions) — any correct implementation plays perfectly.
- **Strength:** Perfectly solved; the full position graph is known.
- **Where the proof / tablebase lives (if solved):** Result embedded in the van den Herik et al. survey ([../references.md#vandenherik2002](../references.md#vandenherik2002)); the game is too small for a dedicated publication.
- **Notes:** Some rule variants ban the first-player centre move to introduce practical difficulty; the draw result holds even without that restriction.

## Complexity

A few thousand positions — trivially exhaustible.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Three_men%27s_morris) ([archive](http://web.archive.org/web/20251231113758/https://en.wikipedia.org/wiki/Three_men's_morris))
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)
- [Gasser, R. (1996). *Solving Nine Men's Morris*.](../references.md#gasser1996)

## See also

- [Nine Holes](nine-holes.md) · [Achi](achi.md) · [Six Men's Morris](six-mens-morris.md) · [Nine Men's Morris](nine-mens-morris.md)
- Lexicon: [strongly solved](../lexicon/README.md#strongly-solved) · [draw](../lexicon/README.md#draw)
