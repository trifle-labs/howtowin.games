# Lights Out

> Linear-algebra puzzle: toggle lights to turn them all off.

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

## Description

Lights Out (Tiger Electronics, 1995) is a 5×5 grid of buttons; pressing a
button toggles itself and its orthogonal neighbours. The goal is to turn off
every light from a given initial pattern. The puzzle reduces to solving a
linear system over GF(2).

## Rules

1. Board: 5×5 grid; each cell is either lit or dark.
2. On a move the player presses one cell; that cell and its orthogonal
   neighbours (up, down, left, right, if any) toggle on/off.
3. The objective is to reach the all-dark configuration.
4. The order in which cells are pressed does not matter (each cell needs only
   to be pressed 0 or 1 times in total).

## Solution status

**Strongly solved**: Anderson & Feil (1998) showed that the set of
solvable initial states is the image of the toggle matrix *M* over GF(2);
exactly 2^23 of the 2^25 initial states on the 5×5 board are solvable. For
*n*×*n* boards the analysis generalises straightforwardly.

## Consensus on optimal play

- **"Chase the lights" row by row** — working from row 1 to row 4, press the cell in the current row that toggles the lit cell in the row above; this systematically eliminates lights one row at a time.
- **Order of presses does not matter** — because toggling is an XOR operation, each button needs to be pressed 0 or 1 times total; rearranging the order gives the same result; simplify by planning a press-set, not a sequence.
- **Check the bottom row after chasing** — after chasing through rows 1–4, the bottom row will have a specific lit pattern; there are only 5 cells (32 possible patterns); a lookup table maps each pattern to the required top-row presses that correct it (a second sweep solves).
- **First check solvability** — approximately 1/4 of random 5×5 initial states are unsolvable (outside the image of the toggle matrix); if the puzzle does not resolve after the standard procedure, it may be genuinely unsolvable.
- **For the minimum-press solution, use Gaussian elimination** — the linear-algebra formulation over GF(2) finds not just a solution but the minimum-button-press solution directly.

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
