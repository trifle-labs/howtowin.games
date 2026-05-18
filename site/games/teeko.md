# Teeko

> A placement-and-movement game on a 5x5 board. Computer analysis shows it is a draw with perfect play.

| Field | Value |
|-------|-------|
| Also known as | Teeko |
| Players | 2 |
| Type | Partisan placement-and-movement game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Weakly solved |
| **Game-theoretic value** | Draw **[verify]** |
| Year solved | — (exhaustively analysable; computer solutions reported) |
| Solved by | — (game designed by John Scarne, 1937/1952) |
| State-space complexity | A few million positions |
| Game-tree complexity | Small by modern standards |
| **Playable** | teeko |

## Description

Played on a 5x5 board. Each player has four pieces. In the placement phase, players take turns placing their four pieces on empty cells. In the movement phase, they slide a piece to a neighboring empty cell (up, down, left, right, or diagonally). A player wins by getting their four pieces into a row, column, diagonal, or any 2x2 square.

## Solution status

Teeko is **weakly solved**. The 5×5 board with four pieces per side yields only
a few million positions — well within exhaustive search — and computer analyses
have reported the game to be a **draw** with perfect play. John Scarne promoted
Teeko for decades as a deep "perfect" alternative to chess and checkers; the
exhaustive verdict is more modest: against best defence neither side can force a
win.

> **[verify]** — The draw result is the commonly reported one and is fully
> consistent with the game's small size, but this archive should cite the
> specific exhaustive computation (and fix the rule variant, since Teeko has
> "American"/advanced rule sets that differ over diagonal moves and the 2×2 win).

## Consensus on optimal play

- **Place pieces to threaten multiple wins at once** — a piece placed so it helps form a row, a diagonal, and a 2x2 square at the same time forces the opponent to block two threats with one move, often deciding the game.
- **Fight for the center of the 5x5 board** — central pieces reach the most winning lines. Pieces on the edge contribute to fewer configurations.
- **During placement, block the opponent's three-in-a-row** — if the opponent has three pieces in line with room to extend, they are one move from winning. Block before all four pieces are placed.
- **Use the 2x2 square as a hidden threat in the movement phase** — straight lines are easy to spot, but a 2x2 cluster forming in a corner is often overlooked and can win faster than completing a row.
- **Force a draw by repeating moves** — if you are behind in the movement phase, shuttle a piece back and forth to force a draw by repetition. The board is small enough that this is often possible.

## Engines & current best play

- **Strongest known program(s):** Exhaustive search programs (reported in the 1990s–2000s) — retrograde analysis over the few-million-position state space.
- **Strength:** Perfectly solved for the analysed rule variant; humans cannot match a correct implementation.
- **Where the proof / tablebase lives (if solved):** No single canonical published proof known to the cataloguer; result consistent with [../references.md#vandenherik2002](../references.md#vandenherik2002) framework.
- **Notes:** Multiple rule variants exist (standard vs. advanced Teeko, diagonal-move rules); the draw result applies to the standard American edition with the 2×2 square win condition.

## Complexity

A few million positions — exhaustively searchable.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Teeko) ([archive](http://web.archive.org/web/20260508193822/https://en.wikipedia.org/wiki/Teeko))
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002) (general framework)

## See also

- [Tic-tac-toe](tic-tac-toe.md) · [Nine Holes](nine-holes.md) · [Connect Four](connect-four.md)
- Lexicon: [weakly solved](../lexicon/README.md#weakly-solved) · [draw](../lexicon/README.md#draw)
