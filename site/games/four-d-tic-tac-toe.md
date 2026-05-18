# 4-D tic-tac-toe

> Tic-tac-toe on a 4-dimensional board. The first player can always win by using a mathematical pairing strategy.

| Field | Value |
|-------|-------|
| Also known as | 4-D tic-tac-toe, "Tesseract tic-tac-toe" |
| Players | 2 |
| Type | Partisan k-in-a-row / placement game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Partially solved (small dimensions); 4×4×4×4 is a first-player win |
| **Game-theoretic value** | First-player win (for sufficiently large dimensions / boards) |
| Year solved | classical (Hales–Jewett 1963; specific cases by computer) |
| Solved by | Hales & Jewett; subsequent computer analyses |
| State-space complexity | Large |
| Game-tree complexity | Large |
| **Playable** | four-d-tic-tac-toe |

## Description

Tic-tac-toe played on a 4-dimensional 4×4×4×4 grid — imagine a cube of cubes, with 256 cells in total. Players take turns placing X or O on empty cells. The first player to get four in a row — along any straight line through the 4-D space — wins. Because the board has so many possible winning lines, the first player has a huge advantage, and a draw is impossible.

## Rules

1. Board: a 4×4×4×4 hypercube — 256 cells arranged like a tesseract (a 4-D cube), with each cell identified by four coordinates (i, j, k, l), each from 1 to 4.
2. Players take turns placing their symbol (X or O) on any empty cell.
3. The first player to get four of their symbols in a straight line — along any of the many lines that exist in 4-D space — wins. (There are far more possible lines than in the 3-D version, Qubic.)
4. If the board fills up with no four-in-a-row, the game is a draw (but with perfect play, a draw never happens in this version).

## Solution status

The **Hales–Jewett theorem (1963)** is a non-constructive existence result:
for any fixed line length k and number of players, a sufficiently
high-dimensional cube tic-tac-toe cannot draw. For 4×4×4×4 specifically, the
result is the **standard "n×n×n×n" Hales-Jewett bound** plus a small computer
analysis: it is a **first-player win**, and explicit Maker strategies have been
found. **[verify]** the precise solver attribution.

## Consensus on optimal play

- **The first player wins — any solid opening in the center area is fine** — unlike regular tic-tac-toe, draws cannot happen in the 4×4×4×4 game. The first player just needs to find any of the many winning move sequences, not avoid traps.
- **Use the huge number of winning lines** — the 4-D board has many more ways to line up four pieces than even the 3-D version. The first player's advantage is huge because threats along multiple dimensions are impossible for the opponent to block all at once.
- **Create threats along multiple dimensions at once** — placing a piece on a cell that lies on several different types of diagonals (through planes, cubes, and the whole 4-D space) creates more threats per move than an edge or axis-only placement.
- **Build a chain of forcing threats** — the winning strategy is to keep making threats; the opponent blocks one, you create another, until the opponent cannot cover all of them at once. This is how computer analysis proved the first-player win.
- **The Hales-Jewett theorem guarantees no draw is possible** — so there is no need to play for a draw.

## Engines & current best play

- **Strongest known program(s):** Computer threat-tree analysis has established the first-player win; no specific public interactive engine for 4-D tic-tac-toe is known to the cataloguer.
- **Strength:** First-player win established computationally; no benchmarked interactive engine.
- **Where the proof / tablebase lives (if solved):** Hales & Jewett (1963) for the general theorem; specific 4×4×4×4 analysis in game-AI literature [verify exact citation].
- **Notes:** The 4×4×4×4 game is primarily of theoretical interest, illustrating how the Hales–Jewett theorem applies to concrete hypercube tic-tac-toe; it is rarely played competitively.

## Complexity

Large — 256 cells means a state space of 3^256 in the trivial bound, well
beyond exhaustive search, though the first-player win has been demonstrated by
threat-tree analysis.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Tic-tac-toe_variants)
- [Berlekamp, Conway & Guy (2001–2004). *Winning Ways for Your Mathematical Plays*.](../references.md#bcg2001)
- [Patashnik (1980). *Qubic: 4×4×4 Tic-Tac-Toe*.](../references.md#patashnik1980) (3-D analogue)

## See also

- [Qubic](qubic.md) · [Tic-tac-toe](tic-tac-toe.md) · [m,n,k-games](mnk-games.md)
- Lexicon: [pairing strategy](../lexicon/README.md#pairing-strategy) · [first-player advantage](../lexicon/README.md#first-player-advantage)
