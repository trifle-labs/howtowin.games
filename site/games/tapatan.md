# Tapatan

> A Filipino three-in-a-row game — strongly solved as a draw.

| Field | Value |
|-------|-------|
| Also known as | Tapatan |
| Players | 2 |
| Type | Partisan placement+movement game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Strongly solved |
| **Game-theoretic value** | Draw |
| Year solved | folklore |
| Solved by | Exhaustive enumeration |
| State-space complexity | Tiny |
| Game-tree complexity | Tiny |
| **Playable** | tapatan |

## Description

A traditional Filipino game in the [Three Men's Morris](three-mens-morris.md)
family: nine points in a 3×3 lattice (with diagonals), three stones per player,
and a two-phase placement-then-movement structure.

## Rules

1. Board: 3×3 grid of points connected by lines including both diagonals.
2. Each player has 3 stones.
3. **Placement**: players alternate placing stones on empty points. Three in a
   row wins.
4. **Movement**: once all six stones are placed, players alternate sliding a
   stone along a line to an adjacent empty point.
5. A player making three-in-a-row wins. If no progress is being made (typical
   repetition rule: 30 moves without a three-in-a-row), the game is a draw.

## Solution status

Strongly solved by trivial enumeration: the value with perfect play is a
**draw**. Tapatan is essentially the same game as
[Three Men's Morris](three-mens-morris.md), with the cosmetic difference that
some sources omit the diagonals — the diagonal-on version is the one whose
correct value is a draw.

## Consensus on optimal play

- **Take the centre on the first move** — the centre point lies on four of the eight possible lines (row, column, and both diagonals); occupying it first maximises winning threats and forces the opponent to respond defensively.
- **If the centre is taken, reply with a corner** — corners lie on three lines each, more than edge points (two lines each); owning two corners connected through the centre is the most common winning setup.
- **Block every two-in-a-row immediately** — with only 3 stones per side and a tiny board, any unblocked double threat wins in one move; defence is non-negotiable.
- **In the movement phase, shuttle rather than over-commit** — with draws available by repetition, the key is to create a double threat (fork) where one stone will complete a row regardless of the opponent's block.
- **Avoid giving the opponent a fork** — a fork occurs when one player threatens two different three-in-a-rows simultaneously; in the movement phase, never step your stone to a position that creates a fork for your opponent.

## Engines & current best play

- **Strongest known program(s):** No game-specific public engine; exhaustive enumeration over the tiny state space suffices.
- **Strength:** Perfectly solved by search; any implementation plays flawlessly.
- **Where the proof / tablebase lives (if solved):** No dedicated publication; result by exhaustive enumeration, consistent with Three Men's Morris analyses cited in [../references.md#vandenherik2002](../references.md#vandenherik2002).
- **Notes:** Tapatan is functionally identical to Three Men's Morris with diagonals; the draw result assumes both diagonals are enabled.

## Complexity

Tiny.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Three_men%27s_morris) ([archive](http://web.archive.org/web/20251231113758/https://en.wikipedia.org/wiki/Three_men's_morris))
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)

## See also

- [Three Men's Morris](three-mens-morris.md) · [Picaria](picaria.md) · [Achi](achi.md)
- Lexicon: [strongly solved](../lexicon/README.md#strongly-solved) · [draw](../lexicon/README.md#draw)
