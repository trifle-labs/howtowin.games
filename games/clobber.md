# Clobber

> A game where you move your stones onto neighboring enemy stones to capture them. Rich in math theory, but only solved on small boards.

| Field | Value |
|-------|-------|
| Also known as | Clobber |
| Players | 2 |
| Type | Partisan combinatorial game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Partially solved (small boards; CGT theory of components) |
| **Game-theoretic value** | Known for small boards and many component shapes |
| Year solved | Game introduced 2001; ongoing analysis |
| Solved by | Michael Albert, J. P. Grossman, Richard Nowakowski (game); various for solved boards |
| State-space complexity | Depends on board dimensions |
| Game-tree complexity | Depends on board dimensions |
| **Playable** | clobber |

## Description

Played on a grid that starts filled with black and white stones in a
checkerboard pattern. On your turn, you move one of **your own** stones onto a
**neighboring enemy** stone (up, down, left, or right — not diagonally),
removing ("clobbering") that enemy stone. The player who cannot make a legal
move loses.

## Solution status

Clobber is **partially solved**. It was designed (2001) as a testbed for
combinatorial game theory, and positions split into independent components whose
CGT values can be computed and summed. Values, including
[infinitesimal](../lexicon/README.md#temperature--hot-game) and `*`-type values,
are tabulated for many small components. Specific small boards have been solved
by exhaustive search, and Clobber has been a regular event in computer-games
olympiads. But the standard playing boards are not solved, and there is no
general theory giving every position's value.

## Consensus on optimal play

- **Keep your options open while limiting the opponent's** — each capture removes an enemy stone and moves one of yours. The endgame is a race to leave the opponent with no neighboring enemy to move onto. Prioritize captures that give you future moves while leaving the opponent stranded.
- **Spot the separate regions early** — the board usually breaks into separate areas of alternating stones. Each area has a game value you can figure out on its own. The total game value is the sum of all areas, so figure these out before deciding where to play.
- **Play in the "hottest" area first** — the "temperature" of an area tells you how much you gain by moving there. Always play in the highest-temperature area to maximize your advantage.
- **Treat zero-temperature areas as free moves for the opponent** — an area with value 0 is a second-player win on its own. Leaving it alone while playing elsewhere often helps you steer the overall game toward a win.
- **Avoid creating lone stones** — a stone with no neighboring enemy cannot move. Creating such stranded stones early reduces your move count and risks losing because you cannot move.

## Engines & current best play

- **Strongest known program(s):** Various research bots built for Computer Olympiad play; no single widely-distributed public engine known to the cataloguer.
- **Strength:** Strong on small boards using CGT evaluation; competitive on standard tournament boards.
- **Where the proof / tablebase lives (if solved):** CGT component values tabulated in Albert, Grossman, Nowakowski, Wolfe (2005); see also *Winning Ways* [../references.md#bcg2001](../references.md#bcg2001).
- **Notes:** Clobber was explicitly designed to test CGT methods on a natural board game; it remains a primary research vehicle for infinitesimal game analysis and computer-olympiad benchmarking.

## Complexity

Grows quickly with board size; CGT decomposition helps but does not tame the
largest boards.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Clobber) ([archive](http://web.archive.org/web/20251017003913/https://en.wikipedia.org/wiki/Clobber))
- M. H. Albert, J. P. Grossman, R. J. Nowakowski, D. Wolfe (2005). *An introduction to Clobber*. INTEGERS / Games of No Chance. **[verify]**
- [Berlekamp, Conway & Guy (2001). *Winning Ways for Your Mathematical Plays*.](../references.md#bcg2001)

## See also

- [Domineering](domineering.md) · [Toads and Frogs](toads-and-frogs.md) · [Amazons](amazons.md)
- Lexicon: [partisan game](../lexicon/README.md#partisan-game) · [combinatorial game theory](../lexicon/README.md#combinatorial-game-theory)
