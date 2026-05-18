# Three Men's Morris

> The smallest morris game. Players place three pieces and then slide them to form three in a row. With perfect play it is always a draw.

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
| **Playable** | three-mens-morris |

## Description

Played on a 3x3 grid of points (often with diagonals included). Each player has three pieces. Players first place their three pieces one at a time, then enter a movement phase where they slide a piece along a line to a neighboring empty point. Forming a mill (three pieces in a row) wins.

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

- **Take the center on the first move** — the center connects to all four rows, columns, and both diagonals. It is the most powerful point on the board and must be taken immediately.
- **If the center is taken, take a corner** — corners lie on three lines (row, column, diagonal) while edge points lie on only two. A corner gives you the most future winning threats.
- **Block every two-in-a-row before building your own** — the board is too small to allow even one unblocked two-in-a-row. Defense always comes first.
- **In the movement phase, create forks** — a fork (two simultaneous three-in-a-row threats) cannot be blocked by a single move. Create a fork by sliding a piece to a point that threatens two lines at once.
- **Accept the draw if you cannot create a fork** — with three pieces each on a 3x3 board, creating an unstoppable fork against a careful opponent is usually impossible. Aim for a draw by repetition rather than weakening your position chasing a win.

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
