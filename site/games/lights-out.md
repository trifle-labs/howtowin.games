# Lights Out

> Press lights to turn them all off. The puzzle is solved using linear algebra.

| Field | Value |
|-------|-------|
| Also known as | Lights Out |
| Players | 1 |
| Type | Solo puzzle |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Strongly solved |
| **Game-theoretic value** | Solvable iff initial state is in the image of the toggle matrix over GF(2) |
| Year solved | 1990s (mathematical analysis) |
| Solved by | Anderson & Feil (1998) and others |
| State-space complexity | 2^25 (for 5×5) |
| Game-tree complexity | Polynomial via linear algebra |
| **Playable** | lights-out |

## Description

Lights Out (Tiger Electronics, 1995) is a 5x5 grid of buttons. Pressing a button toggles (switches on/off) itself and its neighbors up, down, left, and right. The goal is to turn off every light from a given starting pattern. The puzzle can be solved using simple math (linear algebra).

## Rules

1. Board: 5x5 grid. Each cell is either lit or dark.
2. On a move the player presses one cell. That cell and its neighbors up, down, left, and right (if any) toggle on/off.
3. The objective is to reach the all-dark configuration.
4. The order in which cells are pressed does not matter (each cell needs only to be pressed 0 or 1 times in total).

## Solution status

**Strongly solved**: Anderson & Feil (1998) showed that the set of
solvable initial states is the image of the toggle matrix *M* over GF(2);
exactly 2^23 of the 2^25 initial states on the 5×5 board are solvable. For
*n*×*n* boards the analysis generalises straightforwardly.

## Consensus on optimal play

- **"Chase the lights" row by row** — working from row 1 to row 4, press the cell in the current row that toggles the lit cell in the row above. This systematically eliminates lights one row at a time.
- **Order of presses does not matter** — each button needs to be pressed 0 or 1 times total. Rearranging the order gives the same result. Simplify by planning which buttons to press, not what order to press them.
- **Check the bottom row after chasing** — after chasing through rows 1-4, the bottom row will have a specific lit pattern. There are only 5 cells (32 possible patterns). A lookup table maps each pattern to the required top-row presses that correct it.
- **First check solvability** — about 1/4 of random 5x5 starting states cannot be solved. If the puzzle does not resolve after the standard procedure, it may be genuinely impossible.
- **For the minimum-press solution, use the math method** — the linear algebra approach finds not just any solution but the one that uses the fewest button presses.

## Engines & current best play

- **Strongest known program(s):** Any GF(2) Gaussian-elimination solver — exact minimum-press solution in polynomial time.
- **Strength:** Perfect; every solvable instance has an exact minimum-press solution computable instantly.
- **Where the proof / tablebase lives (if solved):** [Anderson & Feil (1998)](../references.md#anderson-feil1998) — complete mathematical analysis; 2^23 of 2^25 5×5 states are solvable.
- **Notes:** A purely mathematical puzzle; "strategy" reduces to linear algebra over GF(2) — there is no opponent and no game-theoretic content beyond the solvability question.

## Complexity

Polynomial via Gaussian elimination.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Lights_Out_(game)) ([archive](http://web.archive.org/web/20260504175703/https://en.wikipedia.org/wiki/Lights_Out_%28game%29))
- [Anderson & Feil (1998). *Turning Lights Out with Linear Algebra*.](../references.md#anderson-feil1998)

## See also

- [Sudoku](sudoku.md) · [Slitherlink](slitherlink.md) · [Nonograms](nonograms.md)
- Lexicon: [strongly solved](../lexicon/README.md#strongly-solved)
