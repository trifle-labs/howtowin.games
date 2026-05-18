# Quixo

> A sliding-cube game like tic-tac-toe on a 5x5 board. Solved in 2020: the result is a draw.

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

Played with a 5x5 grid of cubes, where each face is either blank, marked X, or marked O. On your turn you take a blank or your own marked cube **from the border**, set it to your mark, and push it back into a row or column from one end — sliding all the other cubes along. The winner is the first to make a line of five of their marks. (A move that would complete a line of *both* marks at the same time counts for the opponent, which discourages certain pushes.)

## Solution status

Quixo on the standard **5×5** board is **weakly solved**.
[Tanaka, Bonnet, Tixeuil & Tamura (2020)](../references.md#tanaka-quixo2020)
solved it using [retrograde analysis](../lexicon/README.md#retrograde-analysis):
with perfect play the game is a **draw** — the first player cannot force a win.
The same work also reported results for smaller boards (e.g. first-player wins
on some reduced sizes), and noted that without a rule capping repetition the
game could in principle continue indefinitely, which the analysis accounts for.

## Consensus on optimal play

- **Only take cubes from the border** — you can only take pieces from the outer edge. Keep your inner pieces (which cannot be moved) in positions that do not help the opponent make a line.
- **Use push direction to break opponent lines** — inserting a cube from one end of a row slides all pieces one step. Think about whether your push will break an opponent's near-complete line or, worse, complete one for them.
- **Do not complete lines for both players at once** — if a move completes a line for both players, it counts as a win for the opponent. Always check before pushing.
- **Claim blank border cubes before the opponent does** — a blank cube can become either player's mark. Taking border blanks first gives you flexibility and stops the opponent from using them.
- **Draw with perfect play** — neither side can force a win. Practical play exploits small mistakes instead of looking for a theoretical forced win.

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
