# Connect Four

> The classic game where you drop discs into a vertical grid. Solved in 1988: first player wins.

| Field | Value |
|-------|-------|
| Also known as | Four in a Row, Captain's Mistress, Plot Four |
| Players | 2 |
| Type | Partisan positional (k-in-a-row, with gravity) game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Weakly solved (standard 7×6); strongly solved in practice via full databases |
| **Game-theoretic value** | First-player win (with the correct first move in the centre column) |
| Year solved | 1988 |
| Solved by | Victor Allis; independently James Dow Allen and John Tromp |
| State-space complexity | ~4.5 × 10^12 legal positions (7×6 board) |
| Game-tree complexity | ~10^21 |
| **Playable** | connect-four |

## Description

Played on a vertical board with 7 columns and 6 rows. Players take turns
dropping a disc into a column; it falls to the lowest empty space in that
column. The first player to get four of their discs in a row — horizontally,
vertically, or diagonally — wins.

## Solution status

Connect Four is **weakly solved**. [Allis (1988)](../references.md#allis1988)
solved the standard 7×6 board in his M.Sc. thesis using a knowledge-based
approach with nine strategic rules plus search; **James Dow Allen** and
**[John Tromp](../references.md#tromp-connectfour)** reached the same result
independently around the same time. The verdict: with perfect play the
**first player wins**, and must do so by playing the **centre column** first —
any other opening move at least throws away the win (the centre is the unique
winning first move).

Modern solvers carry full databases and effectively play perfectly from every
position, so Connect Four is now solved in the strongest practical sense; Tromp
also solved many non-standard board sizes.

## Consensus on optimal play

- **Always open in column 4 (the center)** — the center column is the only winning first move. Every other first move either loses or draws against perfect play. This is the most famous single-move result in solved game theory.
- **Control the center columns (3-5) throughout the game** — pieces in the center are part of more possible four-in-a-row lines (horizontal, diagonal, vertical) than pieces on the edges. Control of the center also stops the opponent from threatening from multiple directions.
- **Create threats on odd-numbered rows** — who wins partly depends on which rows you threaten. The first player benefits from threats on odd rows (1, 3, 5 from the bottom) because of how turns work. The second player should aim for even-row threats.
- **Use double threats** — threatening four-in-a-row in two places at once forces the opponent to block only one. Creating positions where your opponent has to fill a column on their turn that activates your second threat is the main winning technique.
- **Don't fill columns below an opponent threat** — dropping a disc into a column can give the opponent a free win if they are waiting to place their disc on the row above. Count ahead which columns trigger threats before committing.

## Engines & current best play

- **Strongest known program(s):** Various implementations of Tromp's and Allis's solver; Pascal Pons's open-source Connect-4 solver is a clean modern reference.
- **Strength:** Perfect — full databases allow optimal play from any position.
- **Where the proof / tablebase lives (if solved):** [Allis (1988)](../references.md#allis1988); Tromp's analysis at [../references.md#tromp-connectfour](../references.md#tromp-connectfour); online solvers widely available.
- **Notes:** Connect Four was one of the first commercially popular games to be solved; its solution is widely cited as a milestone in game AI and is routinely used to teach alpha-beta pruning and game-tree search.

## Complexity

~4.5 × 10^12 legal positions; game-tree complexity ~10^21
([van den Herik et al., 2002](../references.md#vandenherik2002)).

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Connect_Four) ([archive](http://web.archive.org/web/20260503215600/https://en.wikipedia.org/wiki/Connect_Four))
- [Allis, V. (1988). *A Knowledge-based Approach of Connect-Four*.](../references.md#allis1988)
- [Allis, V. (1994). *Searching for Solutions in Games and Artificial Intelligence*.](../references.md#allis1994)
- [Tromp, J. *John's Connect Four Playground*.](../references.md#tromp-connectfour)

## See also

- [Score Four](score-four.md) · [Qubic](qubic.md) · [Gomoku](gomoku.md) · [Connect6](connect6.md)
- Lexicon: [weakly solved](../lexicon/README.md#weakly-solved) · [first-player advantage](../lexicon/README.md#first-player-advantage)
