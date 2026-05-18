# Tant Fant

> An Indian three-in-a-row game where stones start already placed on the board. It is strongly solved.

| Field | Value |
|-------|-------|
| Also known as | Tant Fant |
| Players | 2 |
| Type | Partisan placement+movement game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Strongly solved **[verify]** |
| **Game-theoretic value** | Draw **[verify]** (some sources: second-player win) |
| Year solved | folklore |
| Solved by | Exhaustive enumeration |
| State-space complexity | Tiny |
| Game-tree complexity | Tiny |
| **Playable** | tant-fant |

## Description

A traditional Indian three-in-a-row game on a 3x3 grid, played without diagonal lines. Two features set it apart: stones start already placed in fixed home rows (no placement phase), and a player wins by making three in a row on any straight line that is not their own starting row.

## Rules

1. Board: a 3x3 grid of points connected horizontally and vertically (some versions also include diagonals).
2. Each player has 3 stones on their home row at the start. The middle row is empty.
3. Players take turns sliding one stone to a neighboring empty point along a line.
4. A player wins by making three of their stones in a row along any line other than their own starting row.

## Solution status

Strongly solvable by trivial enumeration. The reported value depends on the
exact rule set: most analyses give a **draw with perfect play**, but some
sources report a **second-player win** in restricted variants. Treat the value
as **[verify]** pending a canonical statement of rules.

## Consensus on optimal play

- **Advance to the middle row first** — getting all three stones into the central row lets them slide in any direction on future turns, giving you the most ways to form a winning three-in-a-row.
- **Threaten multiple lines at once** — with only a 3x3 board, if you focus on one winning line, the opponent can block it with one stone while threatening their own. Keep threats on several rows at the same time.
- **Use symmetry as the second player** — the small board means the second player can often mirror the first player's moves to keep the game balanced. The first player needs to break the symmetry purposefully to gain an advantage.
- **Block first, win second** — because the board is tiny, giving the opponent one more move is usually fatal. Blocking is often more important than advancing your own pieces.
- **Stay away from your home row** — three in a row on your starting row does not count as a win. Do not retreat all three stones back to the home row hoping to reform them there.

## Engines & current best play

- **Strongest known program(s):** No game-specific public engine; exhaustive enumeration over the trivially small state space suffices.
- **Strength:** Perfectly solved by search; any implementation plays flawlessly.
- **Where the proof / tablebase lives (if solved):** No published formal proof available to the cataloguer; the game-theoretic value (draw or second-player win) is rule-set dependent — treat as **[verify]**.
- **Notes:** Closely related to Tapatan and Three Men's Morris; the distinguishing feature is the fixed home-row start and the exclusion of the starting row from winning lines.

## Complexity

Tiny.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Tant_fant)
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002) (general framework)

## See also

- [Picaria](picaria.md) · [Tapatan](tapatan.md) · [Three Men's Morris](three-mens-morris.md)
- Lexicon: [strongly solved](../lexicon/README.md#strongly-solved) · [draw](../lexicon/README.md#draw)
