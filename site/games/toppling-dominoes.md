# Toppling Dominoes

> A game played on a row of colored dominoes. Players topple dominoes to remove them while trying to be the one who makes the last move. It is solved as a theory.

| Field | Value |
|-------|-------|
| Also known as | Toppling Dominoes |
| Players | 2 |
| Type | Partisan combinatorial game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Strongly solved as a theory |
| **Game-theoretic value** | Position-dependent (computable closed forms for many rows) |
| Year solved | 1996 |
| Solved by | Albert, Nowakowski (and others); featured in *Lessons in Play* |
| State-space complexity | One row per game |
| Game-tree complexity | Polynomial |
| **Playable** | toppling-dominoes |

## Description

A game played on a row of colored dominoes. Each domino is blue (belongs to one player), red (belongs to the other), or green (either player can topple it). A player topples a domino in either direction, which removes that domino and all others that would fall in that direction. The player who cannot move loses.

## Rules

1. A row of dominoes, each colored blue (one player's color), red (the other player's color), or green (either player can topple it).
2. One player (Left) moves by picking a blue or green domino and toppling it left or right. Toppling removes that domino together with every domino that would fall in that direction.
3. The other player (Right) moves by picking a red or green domino and toppling it left or right.
4. The player who cannot move loses.

## Solution status

Strongly solved as a theory. For a single row, value formulas in CGT are known
for the basic colour patterns; sums of independent rows add by ordinary game
arithmetic. The game is featured prominently in introductory CGT texts because
its value computations stay tractable while exhibiting nontrivial structure
(switches, atomic-weight analysis).

## Consensus on optimal play

- **Think about each row on its own** — the game is made up of separate rows. Evaluate each row on its own and then consider the whole picture. Play in the row where you have the most to gain.
- **Play in the most valuable row first** — when there are multiple rows, one row is usually much more valuable than the others. Always respond to the opponent's move in the most valuable row.
- **Choose your topple direction carefully** — toppling left vs. right determines which dominoes stay on the board. Choose the direction that leaves the best position for you.
- **Green dominoes are critical** — green dominoes can be toppled by either player. A green domino sitting between large blue and red sections can swing the game. Contest them before the plain-colored dominoes.
- **Watch the parity in switch positions** — some row positions give an advantage to whichever player makes the last topple there. Count how many remaining moves are left in each such row to decide whether to play there now or wait.

## Engines & current best play

- **Strongest known program(s):** CGT software (e.g., Combinatorial Game Suite) — closed-form value formulas for standard colour patterns.
- **Strength:** Theoretically solved; any CGT-aware program plays perfectly.
- **Where the proof / tablebase lives (if solved):** *Winning Ways* ([../references.md#bcg2001](../references.md#bcg2001)) and *On Numbers and Games* ([../references.md#conway1976](../references.md#conway1976)).
- **Notes:** Toppling Dominoes is primarily a CGT teaching vehicle; its tractable value structure makes it the standard example of hot games and switch analysis in introductory courses.

## Complexity

Polynomial in row length for the standard rules — a major reason it is used as
a teaching game.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Combinatorial_game_theory) ([archive](http://web.archive.org/web/20260508023449/https://en.wikipedia.org/wiki/Combinatorial_game_theory))
- [Berlekamp, Conway & Guy (2001–2004). *Winning Ways for Your Mathematical Plays*.](../references.md#bcg2001)
- [Conway (1976). *On Numbers and Games*.](../references.md#conway1976)

## See also

- [Push](push.md) · [Shove](shove.md) · [Domineering](domineering.md)
- Lexicon: [temperature / hot game](../lexicon/README.md#temperature--hot-game) · [surreal number](../lexicon/README.md#surreal-number)
