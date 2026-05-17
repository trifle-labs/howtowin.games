# Quixo

> A sliding-cube tic-tac-toe-like on a 5×5 board — solved in 2020 as a draw.

| Field | Value |
|-------|-------|
| Also known as | Quixo |
| Players | 2 |
| Type | Partisan positional / sliding game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Weakly solved (standard 5×5) |
| **Game-theoretic value** | Draw |
| Year solved | 2020 |
| Solved by | Satoshi Tanaka, François Bonnet, Sébastien Tixeuil & Yasumasa Tamura |
| State-space complexity | ~3^25 cube states (5×5 board), far fewer reachable |
| Game-tree complexity | Within reach of retrograde analysis |
| **Playable** | quixo |

## Description

Played with a 5×5 grid of cubes, each face blank, marked X, or marked O. On a
turn a player takes a blank or own-marked cube **from the border**, sets it to
their mark, and pushes it back into a row or column from one end — sliding the
other cubes along. The winner is the first to form a line of five of their
marks. (A move that would complete a line of *both* marks counts for the
opponent, discouraging some pushes.)

## Solution status

Quixo on the standard **5×5** board is **weakly solved**.
[Tanaka, Bonnet, Tixeuil & Tamura (2020)](../references.md#tanaka-quixo2020)
solved it using [retrograde analysis](../lexicon/README.md#retrograde-analysis):
with perfect play the game is a **draw** — the first player cannot force a win.
The same work also reported results for smaller boards (e.g. first-player wins
on some reduced sizes), and noted that without a rule capping repetition the
game could in principle continue indefinitely, which the analysis accounts for.

## Consensus on optimal play

- **Only take from the border** — pieces can only be drawn from the perimeter; keep your inner pieces (which cannot be moved) in positions that resist line completion for the opponent.
- **Use push direction to disrupt opponent lines** — inserting from one end of a row slides all existing pieces one step; calculate whether the insertion breaks an opponent's near-complete line or, worse, completes one.
- **Avoid completing lines for both players simultaneously** — the rule that a move completing both players' five-in-a-row scores for the opponent is a critical trap; always check the pushed-row result for unintended opponent wins.
- **Claim blank border cubes before the opponent** — a blank cube can be turned to either player's mark; securing border blanks early gives flexibility and denies conversion opportunities.
- **Draw is the correct result** — with perfect play neither side wins; practical play exploits small inaccuracies rather than trying to find a theoretical forced win.

## Engines & current best play

- **Strongest known program(s):** Tanaka et al. 2020 retrograde solver — complete 5×5 database.
- **Strength:** Perfect play (weakly solved).
- **Where the proof / tablebase lives (if solved):** [Tanaka, Bonnet, Tixeuil & Tamura (2020)](../references.md#tanaka-quixo2020)
- **Notes:** The solved database is the result of the 2020 paper; no standalone downloadable engine for Quixo is widely available.

## Complexity

The border-only move rule and cube-pushing keep the reachable state space within
reach of retrograde analysis, despite the 25-cell board.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Quixo)
- [Tanaka, S., Bonnet, F., Tixeuil, S. & Tamura, Y. (2020). *Quixo Is Solved*.](../references.md#tanaka-quixo2020)

## See also

- [Tic-tac-toe](tic-tac-toe.md) · [Othello](othello.md) · [Pentago](pentago.md)
- Lexicon: [weakly solved](../lexicon/README.md#weakly-solved) · [retrograde analysis](../lexicon/README.md#retrograde-analysis)
