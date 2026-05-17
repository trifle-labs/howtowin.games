# Domineering

> One player places vertical dominoes, the other places horizontal ones. Solved for many board sizes.

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
| **Playable** | domineering |

## Description

Played on a rectangular grid. One player ("Vertical") places 1×2 dominoes
standing up (covering two squares top-to-bottom), and the other ("Horizontal")
places them lying down (covering two squares left-to-right). Dominoes cannot
overlap. A player who cannot place a domino loses.

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

- **Vertical wants tall open spaces; Horizontal wants wide open spaces** — each player benefits from areas shaped for their domino orientation. Early on, take and block areas that help the opponent's orientation while using areas that help yours.
- **Break the board into separate areas and evaluate each** — as the game goes on, the board splits into disconnected regions. Each region has an exact game value. The result is the sum of all region values, so evaluate each one separately.
- **A region value of 0 favors the second player; positive favors Vertical; negative favors Horizontal** — reading the total value tells you directly who wins and by roughly how much, without playing out all the moves.
- **Play in "hot" regions first** — "temperature" measures how urgent it is to move in a region. Always play in the highest-temperature region to get the most advantage per move.
- **Square boards usually favor the first player** — solved square boards (up to 11×11) generally give the first player the win. The advantage comes from how the board breaks into regions, which slightly favors whichever domino orientation goes first.

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
