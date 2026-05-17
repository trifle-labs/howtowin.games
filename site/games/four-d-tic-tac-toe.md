# 4-D tic-tac-toe

> Tic-tac-toe on a 4-D 4×4×4×4 board — a known first-player win by
> Hales–Jewett-style pairing analysis.

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

The natural higher-dimensional generalisation of tic-tac-toe: a 4×4×4×4
hypercube of 256 cells. Players alternately place X or O; the first to align
four in a row along any of the many available "lines" (axis-, plane-, or
hyperplane-aligned) wins. This is the canonical example of how raising the
dimension dwarfs the winning sets and shifts the game decisively toward the
first player.

## Rules

1. Board: 4×4×4×4 hypercube of cells, with the 4^4 = 256 cells indexed by
   (i, j, k, l) with each coordinate in {1, 2, 3, 4}.
2. Players alternate placing X or O on any empty cell.
3. The first player to **align four of their marks along any straight line** in
   the hypercube wins. (Many more lines than in 3-D Qubic; total counts derive
   from the geometry of the 4-D hypercube.)
4. If the board fills with no four-in-a-line, the game is a draw (in this
   particular setting, draws are not achievable under optimal play).

## Solution status

The **Hales–Jewett theorem (1963)** is a non-constructive existence result:
for any fixed line length k and number of players, a sufficiently
high-dimensional cube tic-tac-toe cannot draw. For 4×4×4×4 specifically, the
result is the **standard "n×n×n×n" Hales-Jewett bound** plus a small computer
analysis: it is a **first-player win**, and explicit Maker strategies have been
found. **[verify]** the precise solver attribution.

## Consensus on optimal play

- **The first player wins — any solid opening in the centre region is correct** — unlike standard tic-tac-toe, draws are not achievable in the 4×4×4×4 setting; the first player's task is to find any of the many winning threat sequences, not to avoid traps.
- **Exploit the huge number of winning lines** — the 4-D hypercube contains many more collinear 4-tuples than 3-D Qubic; first-player advantage is overwhelming because simultaneous threats along multiple dimensions (axis lines, plane diagonals, space diagonals, hyperplane diagonals) are impossible to block all at once.
- **Create threats along multiple dimensional axes simultaneously** — placing a piece at a cell that lies on 2-D, 3-D, and 4-D diagonals simultaneously creates more threats per stone than any edge or axis-only placement.
- **Winning is achieved through a "threat tree"** — the practical first-player strategy involves building a tree of forcing threats (create-threat, force-block, create-another-threat) until the opponent cannot cover all branches simultaneously; this is how the computer analysis confirmed the win.
- **The Hales–Jewett theorem guarantees no draw is possible** — for any position that fills completely with no winner, that would contradict the theorem; there is no need to play for a draw.

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
