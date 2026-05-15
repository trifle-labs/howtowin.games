# Toppling Dominoes

> A row-of-dominoes game whose values cover a clean range of switches and
> infinitesimals — a beloved CGT teaching example.

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

## Description

A simple partisan game played on a row of coloured dominoes. The CGT analysis
yields a value structure of "switches" and "integers" that demonstrates several
core ideas — atomic weight, temperature, and the values of "hot" games — in
miniature.

## Rules

1. A row of dominoes, each coloured **blue (L)**, **red (R)**, or **green
   (either)**.
2. **Left** moves: pick a blue or green domino and topple it **left** or
   **right** — toppling a domino removes it together with every domino that
   would fall in the chosen direction (contiguous tiles in that direction).
3. **Right** moves: pick a red or green domino and topple it left or right.
4. The player unable to move loses (normal play).

## Solution status

Strongly solved as a theory. For a single row, value formulas in CGT are known
for the basic colour patterns; sums of independent rows add by ordinary game
arithmetic. The game is featured prominently in introductory CGT texts because
its value computations stay tractable while exhibiting nontrivial structure
(switches, atomic-weight analysis).

## Consensus on optimal play

- **Compute each row's CGT value independently** — Toppling Dominoes is a disjunctive sum; evaluate each separate row segment, then sum the values and use standard CGT move selection.
- **Play the hottest component first** — in a multi-row game, the row with the highest temperature gives the largest advantage to whichever player moves in it; always respond to the opponent's hot move in the same-hot or next-hottest row.
- **Toppling left vs. right changes which pieces remain** — the direction of topple determines which dominoes are eliminated; choose the direction that leaves a row with the most favourable remaining value for you.
- **Green (either-player) dominoes are often the key** — green dominoes can be toppled by either side; a green domino sitting between large blue and red blocks can swing the game; contest or use them before pure-colour dominoes.
- **Switches favour the player who moves in them last** — a row that is a "switch" (value {a | b} with a ≠ b) favours the player who gets the last topple there; count the parity of remaining moves in each switch row to decide whether to enter it now or wait.

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
