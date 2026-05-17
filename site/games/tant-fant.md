# Tant Fant

> An Indian three-in-a-row game — strongly solvable but the standard rule set
> tends to favour the second player.

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

A traditional Indian three-in-a-row game on a 3×3 grid, played without
diagonals. Two distinguishing features: stones start in fixed home rows
(no placement phase), and the goal is to make a row of three on **any straight
line that is not your starting row**.

## Rules

1. Board: 3×3 grid of points connected horizontally and vertically (some
   sources include diagonals — **[verify]** the canonical version).
2. Each player has 3 stones on their home row at the start; the middle row is
   empty.
3. Players alternate sliding one stone to an adjacent empty point along a line.
4. A player wins by making three of their stones in a row along **any line
   other than their starting row**.

## Solution status

Strongly solvable by trivial enumeration. The reported value depends on the
exact rule set: most analyses give a **draw with perfect play**, but some
sources report a **second-player win** in restricted variants. Treat the value
as **[verify]** pending a canonical statement of rules.

## Consensus on optimal play

- **Advance to the middle row first** — getting all three stones into the central row allows them to slide in any direction on subsequent turns, maximising the threat of a winning three-in-a-row.
- **Do not overcommit to a single line** — with only a 3×3 board, telegraphing a particular winning line lets the opponent block with one stone while threatening their own; keep threats on multiple rows simultaneously.
- **Mirror or counter symmetrically** — the small board means the second player can often mirror first-player advances to maintain balance; strong first-player play must break symmetry purposefully.
- **Block the opponent before completing your own three** — because the board is tiny, allowing your opponent one more step is usually fatal; blocking is frequently higher priority than advancing.
- **Avoid your home row** — any three-in-a-row along your starting row does not count as a win; never retreat all three stones back to the home row hoping to reassemble.

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
