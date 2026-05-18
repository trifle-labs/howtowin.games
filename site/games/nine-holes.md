# Nine Holes

> A medieval ancestor of tic-tac-toe where pieces move after being placed. With perfect play it is a draw.

| Field | Value |
|-------|-------|
| Also known as | Nine Holes, Three Men's Morris (the no-mill variant — see note) |
| Players | 2 |
| Type | Partisan positional / sliding game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Strongly solved |
| **Game-theoretic value** | Draw |
| Year solved | Folklore (small enough for exhaustive analysis) |
| Solved by | Folklore |
| State-space complexity | A few thousand positions |
| Game-tree complexity | Small |
| **Playable** | nine-holes |

## Description

Played on a 3x3 grid of holes. Each player has three pieces. In the **placement phase** players take turns putting their three pieces on the board; in the **movement phase** they slide a piece to an empty neighboring hole. The goal is three in a row. Different versions disagree on whether diagonals count and whether moves can go to any empty hole or only neighboring ones. "Nine Holes" usually does **not** count lines made during placement — you must make a line by moving.

> Note: terminology is muddled in historical sources — "Nine Holes," "Three
> Men's Morris," and "Achi" are closely related and sometimes conflated. This
> archive keeps [Three Men's Morris](three-mens-morris.md) and [Achi](achi.md)
> as separate entries.

## Solution status

Nine Holes is **strongly solved** by exhaustive analysis — its state space is
only a few thousand positions. Under the usual rules, with perfect play the game
is a **draw**: neither side can force a line against correct defence. As with
[tic-tac-toe](tic-tac-toe.md), a player can only lose by error.

## Consensus on optimal play

- **Placement sets up the whole game** — place your pieces so they threaten two winning lines at once. This forces the opponent onto defence and limits their movement options later.
- **Keep a fork threat alive** — having two separate two-in-a-row threats is decisive because the opponent can only block one sliding move at a time.
- **Take the centre** — the centre hole lies on the most potential winning lines. Occupying it during placement limits the opponent's paths to victory.
- **Never leave an opponent's two-in-a-row unblocked** — in the movement phase, always check whether your planned move opens a line the opponent can immediately complete.
- **Draw is the right result** — with correct play on both sides, nobody can force a win. A player who loses has made a mistake.

## Engines & current best play

- **Strongest known program(s):** No game-specific public engine known to the cataloguer. Playable in general-purpose abstract-game frameworks (e.g., [Ludii](https://ludii.games/)).
- **Strength:** Not benchmarked.
- **Notes:** The game is exhaustively solvable in milliseconds; any complete search confirms the draw verdict.

## Complexity

A few thousand positions — trivially exhaustible.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Three_men%27s_morris) ([archive](http://web.archive.org/web/20251231113758/https://en.wikipedia.org/wiki/Three_men's_morris))
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)

## See also

- [Three Men's Morris](three-mens-morris.md) · [Achi](achi.md) · [Tic-tac-toe](tic-tac-toe.md) · [Six Men's Morris](six-mens-morris.md)
- Lexicon: [strongly solved](../lexicon/README.md#strongly-solved) · [draw](../lexicon/README.md#draw)
