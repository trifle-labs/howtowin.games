# Tapatan

> A Filipino three-in-a-row game played on a 3x3 grid with diagonals. With perfect play it always ends in a draw.

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

A traditional Filipino game similar to Three Men's Morris. It is played on a 3x3 grid of dots (with diagonal lines included), with three stones per player. There is a placement phase followed by a movement phase.

## Rules

1. Board: a 3x3 grid of points connected by lines, including both diagonals.
2. Each player has 3 stones.
3. Placement: players take turns placing stones on empty points. Three in a row wins immediately.
4. Movement: once all six stones are placed, players take turns sliding a stone along a line to a neighboring empty point.
5. A player making three in a row wins. If neither player can win (typically after 30 moves without a three-in-a-row), the game is a draw.

## Solution status

Strongly solved by trivial enumeration: the value with perfect play is a
**draw**. Tapatan is essentially the same game as
[Three Men's Morris](three-mens-morris.md), with the cosmetic difference that
some sources omit the diagonals — the diagonal-on version is the one whose
correct value is a draw.

## Consensus on optimal play

- **Take the center on the first move** — the center point sits on four of the eight possible lines (row, column, and both diagonals). Taking it first gives you the most winning threats and forces the opponent to play defensively.
- **If the center is taken, take a corner** — corners sit on three lines each, more than edge points (which sit on two lines each). Owning two corners connected through the center is the most common winning setup.
- **Block every two-in-a-row immediately** — with only 3 stones per side and a tiny board, an unblocked two-in-a-row wins in one move. Defense is absolutely necessary.
- **In the movement phase, create double threats** — try to create a fork where one stone threatens to complete a row in two different ways. Even if the opponent blocks one, the other wins.
- **Do not give the opponent a fork** — a fork means a player threatens two different three-in-a-rows at the same time. Never move your stone to a position that creates a fork for the opponent.

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
