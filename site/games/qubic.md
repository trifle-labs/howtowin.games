# Qubic

> Three-dimensional tic-tac-toe on a 4×4×4 cube — and a first-player win.

| Field | Value |
|-------|-------|
| Also known as | 4×4×4 tic-tac-toe, 3-D tic-tac-toe, Score Four (gravity variant — see [Score Four](score-four.md)) |
| Players | 2 |
| Type | Partisan positional (k-in-a-row) game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Weakly solved |
| **Game-theoretic value** | First-player win |
| Year solved | 1980 |
| Solved by | Oren Patashnik (1980); independently confirmed by Victor Allis (1994) |
| State-space complexity | ~3^64 upper bound on cell states |
| Game-tree complexity | Large but within reach of the methods used |
| **Playable** | qubic |

## Description

Played in a 4×4×4 cube of 64 cells. Players alternately claim cells; the winner
is the first to claim four cells in a straight line — along any of the cube's
rows, columns, pillars, or the 2-D and 3-D diagonals (76 winning lines in all).

## Solution status

Qubic is **weakly solved**. [Patashnik (1980)](../references.md#patashnik1980)
proved it a **first-player win**, using a carefully structured proof combining
human strategic reasoning with computer verification of the resulting case
tree — an early landmark in computer-assisted game solving. The result was later
re-derived independently by [Allis (1994)](../references.md#allis1994) using
proof-number search, confirming the first-player win.

Unlike flat [tic-tac-toe](tic-tac-toe.md) (a draw), the extra dimension gives the
first player enough overlapping threats to force a win against any defence.

## Consensus on optimal play

- **First player must threaten multiple lines simultaneously** — with 76 winning lines in a 4×4×4 cube, the winning strategy depends on building multiple overlapping threats; a single line is easily blocked.
- **3-D diagonals are hard to visualise and defend** — the four long space-diagonals of the cube (corner to opposite corner) are frequently overlooked by defenders; build through them early.
- **Centre layers are more valuable than faces** — cells in the two inner layers (z=2, z=3) participate in more winning lines than surface cells; prioritise them in the opening.
- **The 2×2 threat cluster** — claiming the four corners of any face of a sub-cube creates multiple simultaneous winning-line seeds; the opponent cannot address all resulting threats.
- **First player wins with correct play** — the Patashnik/Allis result is definitive; as second player your only hope is an error by the first player in the intricate winning tree.

## Engines & current best play

- **Strongest known program(s):** Patashnik's 1980 computer-aided solver; Allis's proof-number search implementation (1994).
- **Strength:** Both solve perfectly from the start position; neither is packaged as a downloadable competitive program.
- **Where the proof / tablebase lives (if solved):** [Patashnik (1980)](../references.md#patashnik1980); [Allis (1994)](../references.md#allis1994)
- **Notes:** The first-player win is double-confirmed by two independent methods; the full winning tree is intricate but finite.

## Complexity

A 64-cell board with 76 winning lines; the solution tree was large for 1980 but
tractable with the structured approach used.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/3D_tic-tac-toe) ([archive](http://web.archive.org/web/20260311160137/https://en.wikipedia.org/wiki/3D_tic-tac-toe))
- [Patashnik, O. (1980). *Qubic: 4×4×4 Tic-Tac-Toe*.](../references.md#patashnik1980)
- [Allis, V. (1994). *Searching for Solutions in Games and Artificial Intelligence*.](../references.md#allis1994)

## See also

- [Tic-tac-toe](tic-tac-toe.md) · [Score Four](score-four.md) · [Gomoku](gomoku.md) · [Connect Four](connect-four.md)
- Lexicon: [weakly solved](../lexicon/README.md#weakly-solved) · [proof-number search](../lexicon/README.md#proof-number-search)
