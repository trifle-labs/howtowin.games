# Picaria

> A Zuni Pueblo three-in-a-row game. A solved cousin of tic-tac-toe — with perfect play it is a draw.

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

A traditional Zuni Pueblo game played on a small board with nine points (a 3x3 grid with diagonal lines added). Like several Indigenous three-in-a-row games, it has a **placement phase** followed by a **movement phase**, so the game cannot end in the quick draws you see in [tic-tac-toe](tic-tac-toe.md).

## Rules

1. Board: nine points in a 3x3 grid, connected by horizontal, vertical, and diagonal lines.
2. Each player has **3 stones**.
3. **Placement phase**: players take turns placing one of their stones on any empty point. If you make three in a row during this phase, you win.
4. **Movement phase**: after all 6 stones are on the board, players take turns sliding one of their stones along a line to a neighboring empty point. Making three in a row wins.
5. A player who cannot move loses **[verify]** (some sources call it a draw).

## Solution status

Strongly solved by trivial exhaustive search. The state graph is tiny and the
**value is a draw** with correct play, like other compact 3-in-a-row games
([Three Men's Morris](three-mens-morris.md), [Nine Holes](nine-holes.md)).

## Consensus on optimal play

- **Take the centre first** — the centre point sits on every line (row, column, and both diagonals). Placing there first limits the opponent to only the four outer lines through the corners.
- **Corners before edges** — corners sit on three lines each; edge midpoints sit on only two. If the centre is taken, go for corners before edge points.
- **Create a fork on your last placement** — if placing your third stone threatens two different three-in-a-row completions at once, you win, since the opponent can only block one.
- **In the movement phase, set up forks** — a fork is a position where you can make a line by sliding in two different directions. Setting one up means the opponent cannot block both.
- **Draw with perfect play** — neither player can force a win. The real skill is spotting the opponent's mistake quickly.

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
