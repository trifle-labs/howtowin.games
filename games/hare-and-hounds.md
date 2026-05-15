# Hare and Hounds

> A small asymmetric pursuit game — fully solved by exhaustive search; with
> correct play the hounds can confine the hare.

| Field | Value |
|-------|-------|
| Also known as | French Military Game, Soldiers and Officers |
| Players | 2 (asymmetric: one hare vs. three hounds) |
| Type | Partisan pursuit game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Weakly solved |
| **Game-theoretic value** | Hounds win with correct play; hare escapes if hounds err **[verify]** |
| Year solved | — |
| Solved by | Exhaustive search (folklore / multiple analysts) |
| State-space complexity | Very small (a few thousand positions) |
| Game-tree complexity | Very small |

## Description

Played on a small board of 11 points connected by lines. Three **hounds** start
at one end, a single **hare** in the middle. Hounds may move along lines
vertically or forward but never backward (toward their own side); the hare moves
along any line in any direction. The hounds win by trapping the hare so it
cannot move; the hare wins by slipping past all three hounds, or — in the
standard rule set — if the hounds make a number of non-advancing "side" moves in
a row (a stalling rule that prevents the hounds from playing for a draw).

## Solution status

Hare and Hounds is **weakly solved** by trivial exhaustive search: the position
graph has only a few thousand states. With correct play the **hounds confine the
hare** — they advance in a connected line that the hare cannot pierce. The hare
wins only if the hounds break formation or violate the no-stalling rule. The
exact value statement is sensitive to which traditional stalling/repetition rule
is used. **[verify]** the precise value against a primary combinatorial analysis.

## Consensus on optimal play

- **Hounds: advance as an unbroken wall** — the three hounds must maintain contact (no gaps between adjacent pieces) as they advance; a single gap in the line lets the hare slip through and escape.
- **Hounds: don't stall on side moves** — stalling rules prevent the hounds from playing indefinitely without advancing; every move should bring the formation one step closer to the end of the board, otherwise the hare wins on the stalling count.
- **Hounds: coordinate the outer pair** — the two edge hounds must keep pace with the centre hound; letting an edge hound fall behind opens a flank lane for the hare.
- **Hare: immediately probe the flanks** — the hare cannot wait in the middle while the hounds advance; sprint toward an edge and force the outer hound to make a choice between closing and leaving a gap.
- **Hare: provoke asymmetry** — move in ways that require two different hounds to respond, making it impossible for both to act without one falling out of formation.

## Engines & current best play

- **Strongest known program(s):** No game-specific public engine known to the cataloguer. The game is small enough that any tree-search program solves it instantly.
- **Strength:** Perfectly solvable by exhaustive search; state space is a few thousand positions.
- **Where the proof / tablebase lives (if solved):** Folklore / multiple analyses; see [Berlekamp, Conway & Guy (2001)](../references.md#bcg2001).
- **Notes:** A classic teaching example of how a coordinated group confines a faster lone piece; the full game graph can be enumerated in milliseconds.

## Complexity

Tiny: the board and piece count make the full game graph small enough to
enumerate by hand-assisted search.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Hare_and_Hounds) ([archive](http://web.archive.org/web/20251007041441/https://en.wikipedia.org/wiki/Hare_and_Hounds))
- [Berlekamp, Conway & Guy (2001–2004). *Winning Ways for Your Mathematical Plays*.](../references.md#bcg2001)
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)

## See also

- [Fox and Geese](fox-and-geese.md) · [Tigers and Goats (Bagh-Chal)](tigers-and-goats.md)
- Lexicon: [weakly solved](../lexicon/README.md#weakly-solved) · [partisan game](../lexicon/README.md#partisan-game)
