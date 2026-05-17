# Pentago

> Five-in-a-row with a twist — literally: each move rotates a quadrant of the
> board. Strongly solved in 2014.

| Field | Value |
|-------|-------|
| Also known as | Pentago |
| Players | 2 |
| Type | Partisan positional (k-in-a-row) game with board rotation |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Strongly solved |
| **Game-theoretic value** | First-player win |
| Year solved | 2014 |
| Solved by | Geoffrey Irving |
| State-space complexity | ~3.0 × 10^15 positions |
| Game-tree complexity | Within reach of the supercomputer search used |
| **Playable** | pentago |

## Description

Played on a 6×6 board divided into four 3×3 quadrants. A turn has two parts:
place one marble of your colour on any empty cell, **then rotate any one
quadrant 90°** (either direction). The winner is the first to get five of their
marbles in a row — horizontally, vertically, or diagonally — at any point,
including immediately after a rotation. If the board fills with no line, it is a
draw.

## Solution status

Pentago is **strongly solved**. [Geoffrey Irving (2014)](../references.md#irving-pentago2014)
solved it by massive parallel computation on a supercomputer, building a
complete database of all ~3.0 × 10^15 positions. The result: with perfect play
the **first player wins**. Because the whole state space is stored, optimal play
is available from *every* position — the strong-solution standard — and Irving
released an open-source solver and online perfect-play oracle.

The quadrant-rotation rule is what gives Pentago a large, irregular state space
despite a board only slightly bigger than tic-tac-toe's: every placement
interacts with eight possible rotations.

## Consensus on optimal play

- **Rotation is a weapon, not an afterthought** — rotating a quadrant can simultaneously extend your own row and disrupt an opponent's near-complete row; always evaluate rotation options as aggressively as placement options.
- **Avoid the rotational rebound** — placing a marble that creates a three-in-a-row also gives the opponent a quadrant-rotation that can break it; never commit to a near-complete line without considering how the opponent's next rotation interacts.
- **Build in two quadrants at once** — rows and diagonals that span two quadrants are rotation-resistant, because the opponent would need to twist the same quadrant you are building in to disrupt both paths.
- **Centre cells of each quadrant** — the centre of a 3×3 quadrant remains adjacent to the most cells after any rotation; place there early to maximise the reach of your chain.
- **First player wins with correct play** — the 2014 solution confirms first-player advantage; practical play requires exploiting that advantage aggressively from move one.

## Engines & current best play

- **Strongest known program(s):** Geoffrey Irving's solver (2014) — complete positional database (~3 × 10^15 positions).
- **Strength:** Perfect play from any position.
- **Where the proof / tablebase lives (if solved):** [Irving (2014)](../references.md#irving-pentago2014).
- **Notes:** The full database is several terabytes; an online oracle allows perfect-play queries without downloading it.

## Complexity

~3.0 × 10^15 positions, all enumerated in the 2014 solution.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Pentago) ([archive](http://web.archive.org/web/20260515054720/https://en.wikipedia.org/wiki/Pentago))
- [Irving, G. (2014). *Pentago is a first player win*.](../references.md#irving-pentago2014)

## See also

- [Gomoku](gomoku.md) · [Connect Four](connect-four.md) · [Quixo](quixo.md)
- Lexicon: [strongly solved](../lexicon/README.md#strongly-solved) · [first-player advantage](../lexicon/README.md#first-player-advantage)
