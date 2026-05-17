# Teeko

> John Scarne's "perfect game" — a compact placement-and-movement game that
> exhaustive analysis shows to be a draw.

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

Played on a 5×5 board. Each player has four pieces. In the **placement phase**
players alternately place their four pieces; in the **movement phase** they
slide a piece to an adjacent (orthogonal or diagonal) empty cell. A player wins
by getting their four pieces into a row, column, diagonal, or — in the standard
rules — any 2×2 square.

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

- **Place pieces to threaten multiple win conditions** — a piece placed where it simultaneously contributes to a row, a diagonal, and a potential 2×2 square forces the opponent to block two threats at once, often fatally.
- **Contest the centre of the 5×5 board** — central placement reaches the most winning lines and squares; peripheral pieces contribute to fewer configurations.
- **During placement, prevent the opponent from forming three-in-a-line** — three aligned opponent pieces with a clear extension are one move from winning; block before all four placements are complete.
- **In the movement phase, use the 2×2 square as a stealth threat** — linear threats are easy to spot; a 2×2 cluster forming in a corner is often missed and provides a quicker win than completing a row.
- **Draw by forcing repetition** — if behind in the movement phase, shuttle a piece back and forth to force a repetition draw; the board is small enough that repetition is achievable when the win is lost.

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
