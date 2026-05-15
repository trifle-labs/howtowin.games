# Domineering

> A partisan tiling game — one player places vertical dominoes, the other
> horizontal — weakly solved for many board sizes.

| Field | Value |
|-------|-------|
| Also known as | Crosscram, Stop-Gate |
| Players | 2 |
| Type | Partisan combinatorial game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Partially solved (many rectangular boards weakly solved) |
| **Game-theoretic value** | Depends on board; e.g. the 11×11 board is a first-player win |
| Year solved | Ongoing; major results through 2016 |
| Solved by | Dennis Breuker, Jos Uiterwijk, H. Jaap van den Herik, and others |
| State-space complexity | Depends on board dimensions |
| Game-tree complexity | Depends on board dimensions |

## Description

Played on a rectangular grid. One player ("Vertical") places 1×2 dominoes
vertically, the other ("Horizontal") places them horizontally; dominoes may not
overlap. A player unable to place a domino loses
([normal play](../lexicon/README.md#normal-play-convention)).

## Solution status

Domineering is **partially solved**: it is fully amenable to combinatorial game
theory (positions decompose into disjunctive sums with exact CGT values), and
many specific boards have been **weakly solved** by a combination of CGT and
search. Known results include all small rectangles and a continuing series of
square boards. [Uiterwijk (2016)](../references.md#uiterwijk-domineering2016)
weakly solved the **11×11** board (a first-player win), extending earlier
solutions for 8×8, 9×9, 10×10 and many *m*×*n* rectangles.

The standard game has no single canonical board size, so "Domineering" as a
whole is not "solved" — but a large and growing table of board sizes is.

## Consensus on optimal play

- **Vertical wants tall open corridors; Horizontal wants wide open corridors** — each player benefits from regions shaped for their orientation; early play should occupy and block regions that suit the opponent's orientation while exploiting those that suit yours.
- **Decompose the board into independent regions and evaluate each** — as the game progresses, the board breaks into disconnected areas; each area has an exact CGT value; the game result is determined by the sum of these values, so evaluate each region separately.
- **A region with CGT value 0 favours the second player; > 0 favours Vertical; < 0 favours Horizontal** — reading off the CGT sum tells you directly who wins and roughly by how much without playing out all moves.
- **Play in "hot" regions first** — temperature measures how urgently you should move in a region; always play in the highest-temperature region to maximise your advantage per move.
- **Square boards tend to favour first player by slight margins** — solved square boards (up through 11×11) generally give the first player the win; the advantage arises from asymmetric region formation that slightly favours the first player's orientation.

## Engines & current best play

- **Strongest known program(s):** Custom research solvers (Breuker, Uiterwijk, van den Herik group) combined with CGT tools (e.g., CGSuite).
- **Strength:** Perfect for solved board sizes; CGT-guided play is strong on unsolved larger boards.
- **Where the proof / tablebase lives (if solved):** [Uiterwijk (2016)](../references.md#uiterwijk-domineering2016) for 11×11; earlier results in [Berlekamp, Conway & Guy (2001)](../references.md#bcg2001).
- **Notes:** Domineering is one of the most theoretically rich partisan games in CGT; it serves as a primary test case for hot-game theory, temperature, and thermographic analysis.

## Complexity

Grows quickly with board size; CGT decomposition is what makes boards up to
~11×11 tractable.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Domineering) ([archive](http://web.archive.org/web/20251112162954/https://en.wikipedia.org/wiki/Domineering))
- [Uiterwijk, J. W. H. M. (2016). *11×11 Domineering Is Solved: The First Player Wins*.](../references.md#uiterwijk-domineering2016)
- [Berlekamp, Conway & Guy (2001). *Winning Ways for Your Mathematical Plays*.](../references.md#bcg2001)
- [Conway, J. H. (1976). *On Numbers and Games*.](../references.md#conway1976)

## See also

- [Cram](cram.md) (impartial sibling) · [Col](col.md) · [Snort](snort.md) · [Hackenbush](hackenbush.md)
- Lexicon: [partisan game](../lexicon/README.md#partisan-game) · [weakly solved](../lexicon/README.md#weakly-solved)
