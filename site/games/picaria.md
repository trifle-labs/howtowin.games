# Picaria

> The Zuni Pueblo three-in-a-row game — a strongly-solved cousin of
> tic-tac-toe; perfect play is a draw.

| Field | Value |
|-------|-------|
| Also known as | Picaria, Pichaya |
| Players | 2 |
| Type | Partisan placement+movement game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Strongly solved (small board) |
| **Game-theoretic value** | Draw |
| Year solved | folklore |
| Solved by | Exhaustive enumeration |
| State-space complexity | Tiny |
| Game-tree complexity | Tiny |
| **Playable** | picaria |

## Description

A traditional Zuni Pueblo game played on a small board of nine points (a 3×3
grid plus diagonals). Like several Indigenous "three-in-a-row" games, it has a
**placement phase** followed by a **movement phase** so the game cannot stall
into [tic-tac-toe](tic-tac-toe.md)'s trivial draws.

## Rules

1. Board: nine intersection points in a 3×3 lattice connected by horizontal,
   vertical, and diagonal lines.
2. Each player has **3 stones**.
3. **Placement phase**: players alternate placing one of their stones on any
   empty point. Three-in-a-row at this stage wins.
4. **Movement phase**: after all 6 stones are on the board, players alternate
   sliding one of their stones along a line to an adjacent empty point. Forming
   three-in-a-row wins.
5. A player who cannot move loses **[verify]** (some sources call it a draw).

## Solution status

Strongly solved by trivial exhaustive search. The state graph is tiny and the
**value is a draw** with correct play, like other compact 3-in-a-row games
([Three Men's Morris](three-mens-morris.md), [Nine Holes](nine-holes.md)).

## Consensus on optimal play

- **Occupy the centre in placement** — the centre point lies on every line (row, column, and both diagonals); placing there first limits the opponent's winning paths to only the four perimeter lines through corners.
- **Corner before edge in placement** — corners participate in three lines each; edge midpoints only in two; corner placement should precede edge midpoint placement when the centre is taken.
- **Create a two-way threat on the last placement** — placing the third stone to threaten two different three-in-a-row completions simultaneously forces a win, since only one can be blocked.
- **In the movement phase, avoid sliding into forks** — a fork is a position from which you can complete a line by sliding in two different directions; setting up a fork leaves the opponent unable to block both.
- **Draw is the result with mutual correct play** — neither player can force a win; the correct objective in competitive play is to spot the opponent's error quickly.

## Engines & current best play

- **Strongest known program(s):** No game-specific public engine known to the cataloguer. Playable in general-purpose abstract-game frameworks (e.g., [Ludii](https://ludii.games/)).
- **Strength:** Not benchmarked; the game is trivially solved by brute-force enumeration.
- **Notes:** The entire game graph is tiny; any complete minimax search confirms the draw verdict.

## Complexity

Tiny.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Picaria)
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002) (general framework)

## See also

- [Three Men's Morris](three-mens-morris.md) · [Achi](achi.md) · [Tapatan](tapatan.md)
- Lexicon: [strongly solved](../lexicon/README.md#strongly-solved) · [draw](../lexicon/README.md#draw)
