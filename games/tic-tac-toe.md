# Tic-tac-toe

> The game everyone solves as a child — and the standard first example of a
> strongly solved game.

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

## Description

Played on a 3×3 grid. Players alternately mark cells (X and O); the first to
place three of their marks in a row — horizontally, vertically, or diagonally —
wins. If the grid fills with no line, the game is a draw.

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

- **Take the centre first** — the centre square participates in 4 of the 8 winning lines (row, column, and both diagonals); it is the most valuable cell on the board.
- **If you go second and the opponent takes centre, play a corner** — corners participate in 3 winning lines; an edge square participates in only 2. Never open with an edge as the second player.
- **Block every two-in-a-row immediately** — with only 9 cells, leaving any two-in-a-row unblocked loses outright; defence is mandatory before extending your own line.
- **Create a fork (double threat) to win** — a fork sets up two simultaneous unblockable three-in-a-rows; the most common winning sequence for first player is centre → corner → opposite corner → fork.
- **Counter a fork threat by threatening to win** — if your opponent is setting up a fork, force them to block your own three-in-a-row instead; this derails the fork at no cost if you can complete the threat on the next move.
- **Optimal play always draws** — against any legal move sequence, a correct defensive reply exists; the entire draw-guarantee fits in an 8-rule decision tree.

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
