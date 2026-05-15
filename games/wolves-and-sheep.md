# Wolves and Sheep

> A draughts-style asymmetric racing game on a small chessboard — solvable by
> hand.

| Field | Value |
|-------|-------|
| Also known as | Wolf and Sheep, Le Loup et les Brebis |
| Players | 2 (asymmetric: 1 wolf vs. 4 sheep) |
| Type | Partisan asymmetric racing game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Strongly solved (small board) **[verify]** |
| **Game-theoretic value** | Sheep win with correct play **[verify]** |
| Year solved | — |
| Solved by | Folklore / exhaustive enumeration |
| State-space complexity | Tiny |
| Game-tree complexity | Tiny |

## Description

A traditional asymmetric pursuit game, often shown on an 8×8 chessboard with
diagonal moves only. One wolf tries to slip past four sheep advancing in a
phalanx. It is a classic teaching example of how a coordinated weak group beats
a stronger lone piece — like [Fox and Geese](fox-and-geese.md) in miniature.

## Rules

1. On the black squares of an 8×8 board, place **4 sheep** on the black squares
   of one back rank and **1 wolf** on a black square of the opposite back rank.
2. Pieces move like draughts men: one square diagonally per turn.
3. Sheep may only move **forward** (toward the wolf's home rank); the wolf may
   move forward or backward (any diagonal).
4. The **wolf** wins by reaching the sheep's home rank. The **sheep** win by
   trapping the wolf so it cannot move.
5. No captures.

## Solution status

The game graph is small enough for full enumeration by hand. Standard analyses
report that with correct play the **sheep win** — an unbroken advancing line
leaves the wolf no diagonal lane forward. The result is **[verify]**: it is
widely repeated in popular puzzle books but the archive author has not located
a canonical primary citation.

## Consensus on optimal play

- **Sheep: advance as an unbroken diagonal wall** — keep all four sheep on adjacent diagonal cells in a single rank-wide line as they march forward; a complete wall with no gaps leaves the wolf no diagonal lane to slip through.
- **Sheep: never leave a gap of two or more squares in the wall** — the wolf only needs one open diagonal to slip past; even a single two-square gap lets the wolf dodge through before the sheep can close it.
- **Sheep: advance the sheep nearest to the wolf's lane first** — when the wolf is threading toward a side, advance the sheep that would block that lane rather than the ones already in its path; this closes the escape route with minimum moves.
- **Wolf: probe for the gap on one side while threatening the other** — the wolf's only hope is to induce a sheep to advance prematurely on one wing, opening a gap on the opposite wing; threaten one side of the sheep line to draw an overreactive advance.
- **Wolf: avoid the corners** — being pushed into a corner on your own side means the wolf cannot manoeuvre; keep toward the centre diagonals where two escape lanes remain possible.

## Engines & current best play

- **Strongest known program(s):** No game-specific public engine; the tiny state space is fully exhaustible by hand or any minimax implementation.
- **Strength:** Perfectly solved by trivial enumeration.
- **Where the proof / tablebase lives (if solved):** Widely cited in puzzle books as a sheep win; no canonical primary citation located — treat as **[verify]**.
- **Notes:** Wolves and Sheep is the standard classroom example of how a coordinated defensive phalanx defeats a more mobile lone attacker.

## Complexity

Tiny — the full game graph fits in a small table.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Wolf_and_sheep)
- [Berlekamp, Conway & Guy (2001–2004). *Winning Ways for Your Mathematical Plays*.](../references.md#bcg2001) (general framework; covers Fox and Geese)

## See also

- [Fox and Geese](fox-and-geese.md) · [Hare and Hounds](hare-and-hounds.md)
- Lexicon: [partisan game](../lexicon/README.md#partisan-game) · [strongly solved](../lexicon/README.md#strongly-solved)
