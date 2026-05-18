# Tac-Tix (Bynum)

> A game where players remove counters from rows and columns of a 5x5 grid. The player forced to take the last counter loses. It has been fully solved.

| Field | Value |
|-------|-------|
| Also known as | Tac-Tix, Tactix, Bynum's game (loosely) |
| Players | 2 |
| Type | Impartial misère take-away game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Strongly solved (small board) |
| **Game-theoretic value** | Position-dependent (misère convention) |
| Year solved | 1969 |
| Solved by | J. Bynum (in correspondence with Martin Gardner); exhaustive enumeration |
| State-space complexity | Small (5×5 starting position) |
| Game-tree complexity | Small |
| **Playable** | tac-tix |

## Description

Tac-Tix was invented by Piet Hein in the 1950s and popularised in Martin Gardner's column. It is played on a 5x5 grid of counters. On each turn, a player removes any connected group of counters from a single row or column. The player forced to take the last counter loses.

## Rules

1. Set up: a 5x5 grid filled with 25 counters.
2. On your turn, choose a single row or column and remove any connected group of counters within it (at least one counter).
3. The player who takes the last counter loses.

## Solution status

Strongly solved by exhaustive enumeration: J. Bynum (in correspondence with
Martin Gardner) computed the value of every Tac-Tix position. The game's misère
analysis is delicate — unlike normal-play Nim, simple nim-sum reasoning does
not work, but the full state space is small enough that a complete value table
is straightforward to construct.

## Consensus on optimal play

- **Second player can use a mirror strategy from the start** — on the symmetric 5x5 board, the second player can mirror every first-player move across the center of the board. This forces the first player to take the last counter and lose.
- **Symmetry breaks only with a center move** — the mirror strategy fails if the first player takes counters from the exact center of the board. The known solution handles this case using a lookup table.
- **Take large runs to clear rows quickly** — clearing whole rows or columns early limits future options for both players. The player who can force the last remaining counter onto the opponent wins.
- **Avoid leaving isolated single counters** — when only isolated single counters remain in different rows and columns, it becomes a pure counting game. The player facing an odd number of such counters must take the last one and loses.
- **Do not split rows carelessly** — removing a middle segment of a row creates two separate groups in the same row, which creates complications for the analysis of who must take the last counter.

## Engines & current best play

- **Strongest known program(s):** Exhaustive table (Bynum, 1969) — a complete value table for all 2²⁵ subsets of the 5×5 grid, as reported by Martin Gardner.
- **Strength:** Perfectly solved; any program consulting the table plays flawlessly.
- **Where the proof / tablebase lives (if solved):** Described in Gardner's *Mathematical Games* columns and summarised in *Winning Ways* ([../references.md#bcg2001](../references.md#bcg2001)).
- **Notes:** The symmetry-mirror strategy covers most play; the full table is needed only for positions where symmetry has been broken.

## Complexity

Small.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Nim) ([archive](http://web.archive.org/web/20260513001624/https://en.wikipedia.org/wiki/Nim))
- [Berlekamp, Conway & Guy (2001–2004). *Winning Ways for Your Mathematical Plays*.](../references.md#bcg2001)

## See also

- [Misère Nim](misere-nim.md) · [Nim](nim.md) · [Northcott's game](northcotts-game.md)
- Lexicon: [misère play](../lexicon/README.md#misere-play) · [nim-value](../lexicon/README.md#nim-value)
