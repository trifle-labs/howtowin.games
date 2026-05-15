# Clobber

> A young partisan game (2001) of capturing adjacent enemy stones; rich in CGT
> theory, solved only for small boards.

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

## Description

Played on a grid initially filled in a checkerboard pattern of black and white
stones. On a turn a player moves one of **their own** stones onto an
**orthogonally adjacent enemy** stone, removing ("clobbering") that enemy stone.
A player unable to move loses ([normal play](../lexicon/README.md#normal-play-convention)).

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

- **Preserve mobility while reducing the opponent's** — each capture removes an enemy stone and moves one of yours; the endgame is a race to leave the opponent with no adjacent enemy to move onto; prioritise captures that give you future move options while stranding opponent clusters.
- **Identify components early** — the board typically fragments into regions of alternating stones; each isolated component has a CGT value that can be computed independently; the game value is the sum of component values, so compute these before deciding where to play.
- **Play in the hottest component first** — CGT temperature tells you how much it is worth to move in a given component; always play in the highest-temperature component to maximise your gain.
- **Value zero-temperature components as "free moves" for the opponent** — a component with value 0 is a second-player win in isolation; leaving such a component undisturbed while playing elsewhere often lets you steer the sum toward a winning value.
- **Avoid creating isolated singleton stones** — a stone with no adjacent enemy cannot be moved; creating such orphans prematurely reduces your move count and risks losing by immobility.

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
