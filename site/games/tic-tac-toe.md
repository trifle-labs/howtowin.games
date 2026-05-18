# Tic-tac-toe

> Two players take turns marking X and O on a 3x3 grid. The first to get three in a row wins. It is the most basic example of a solved game.

| Field | Value |
|-------|-------|
| Also known as | Noughts and crosses, Xs and Os |
| Players | 2 |
| Type | Partisan positional (k-in-a-row) game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Strongly solved |
| **Game-theoretic value** | Draw |
| Year solved | Folklore (ancient game; trivially exhaustible) |
| Solved by | Folklore |
| State-space complexity | 765 essentially different positions; 5,478 reachable positions |
| Game-tree complexity | ~26,830 distinct games (up to symmetry) |
| **Playable** | tic-tac-toe |

## Description

Played on a 3x3 grid. Players take turns marking cells with X and O. The first to get three of their marks in a row (horizontally, vertically, or diagonally) wins. If the grid fills up with no winner, the game is a draw.

## Solution status

Tic-tac-toe is **strongly solved**, the textbook example. The game is so small
that every position is exhaustively known: there are 5,478 reachable positions
(765 up to rotation and reflection), and roughly 26,830 distinct complete games
up to symmetry. With perfect play by both sides the result is always a
**draw** — the second player can always prevent three-in-a-row, and the first
player can never be forced to lose.

It is the canonical demonstration of [Zermelo's theorem](../lexicon/README.md#zermelos-theorem)
in action and of a [pairing/blocking strategy](../lexicon/README.md#pairing-strategy)
guaranteeing a draw.

## Consensus on optimal play

- **Take the center first** — the center square is part of 4 of the 8 winning lines (row, column, and both diagonals). It is the most valuable cell on the board.
- **If you go second and the opponent takes the center, take a corner** — corners are part of 3 winning lines. Edge squares are part of only 2. Never take an edge as the second player.
- **Block every two-in-a-row immediately** — with only 9 cells, leaving any two-in-a-row unblocked loses the game. Block first, then build your own line.
- **Create a fork (double threat) to win** — a fork sets up two three-in-a-row threats at the same time. The opponent cannot block both. The most common winning sequence for the first player is center, then corner, then opposite corner, then fork.
- **Counter a fork threat by threatening to win yourself** — if the opponent is setting up a fork, force them to block your own three-in-a-row instead. This derails their fork at no cost if you can complete your threat on your next move.
- **Perfect play always ends in a draw** — against any legal move, a correct defensive reply exists. The complete draw strategy fits in a simple 8-rule decision tree.

## Engines & current best play

- **Strongest known program(s):** Any correct minimax implementation — state space is 5,478 positions; exhaustive search is instantaneous.
- **Strength:** Perfectly solved; any correct program draws against any opponent.
- **Where the proof / tablebase lives (if solved):** Fully described in *Winning Ways* ([../references.md#bcg2001](../references.md#bcg2001)) and countless textbooks; no dedicated paper needed.
- **Notes:** Tic-tac-toe is the canonical textbook example of a strongly solved game and the standard first exercise in minimax / alpha-beta search courses.

## Complexity

Negligible — solvable by hand or by a child.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Tic-tac-toe) ([archive](http://web.archive.org/web/20260503215557/https://en.wikipedia.org/wiki/Tic-tac-toe))
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)
- [Berlekamp, Conway & Guy (2001). *Winning Ways for Your Mathematical Plays*.](../references.md#bcg2001)

## See also

- [Qubic](qubic.md) (4×4×4 tic-tac-toe) · [Ultimate tic-tac-toe](ultimate-tic-tac-toe.md) · [Notakto](notakto.md) · [Order and Chaos](order-and-chaos.md) · [Gomoku](gomoku.md)
- Lexicon: [strongly solved](../lexicon/README.md#strongly-solved) · [pairing strategy](../lexicon/README.md#pairing-strategy)
