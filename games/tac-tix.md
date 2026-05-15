# Tac-Tix (Bynum)

> Piet Hein's misère row-removing Nim variant on a 5×5 grid — fully solved.

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

## Description

Tac-Tix was invented by Piet Hein in the 1950s and popularised in Martin
Gardner's column. It is a **misère** take-away game on a 5×5 grid of counters:
on each turn a player removes any contiguous run of counters from a single row
or column; the player forced to remove the last counter **loses**.

## Rules

1. Set up: a 5×5 grid filled with 25 counters.
2. On your turn, choose a **single row or column** and remove any contiguous
   subsequence of counters within it (at least one counter).
3. Misère play: the player who takes the **last** counter loses.

## Solution status

Strongly solved by exhaustive enumeration: J. Bynum (in correspondence with
Martin Gardner) computed the value of every Tac-Tix position. The game's misère
analysis is delicate — unlike normal-play Nim, simple nim-sum reasoning does
not work, but the full state space is small enough that a complete value table
is straightforward to construct.

## Consensus on optimal play

- **Mirror strategy wins for the second player from the start** — on the symmetric 5×5 board the second player can mirror every first-player move about the board's centre; this forces the first player to make the last move and lose.
- **Symmetry breaks only when a centre-row move is made** — the mirror strategy fails if the first player takes from the exact centre of the central row/column; Bynum's solution handles this case explicitly via table lookup.
- **Take large runs to destroy rows quickly** — clearing whole rows/columns early limits future opportunities for both players; the player who can force the last remaining counter onto their opponent wins.
- **Avoid leaving isolated single counters** — a position with only individual isolated counters in distinct rows/columns is a pure misère counting problem; the player facing an odd number of such counters must take the last one and loses.
- **Do not split rows carelessly** — removing a middle segment of a row creates two separate fragments in the same row; each fragment is an independent sub-game, complicating the misère analysis for the opponent.

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
