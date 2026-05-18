# Hexapawn

> A tiny chess-like game on a 3x3 board with only pawns. Famous because a matchbox computer can learn to play it perfectly.

| Field | Value |
|-------|-------|
| Also known as | Hexapawn |
| Players | 2 |
| Type | Partisan combinatorial game (chess-derived) |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Strongly solved |
| **Game-theoretic value** | Second-player win (standard 3×3 board) |
| Year solved | 1962 |
| Solved by | Martin Gardner (game); trivially solvable by hand or machine |
| State-space complexity | A few dozen reachable positions |
| Game-tree complexity | Tiny |
| **Playable** | hexapawn |

## Description

Played on a 3x3 board, each side starting with three pawns on its back row. Pawns move and capture exactly as chess pawns (one step forward, capture one step diagonally forward). A player wins by advancing a pawn to the far rank, by capturing all enemy pawns, or by leaving the opponent with no legal move. Introduced by Martin Gardner (1962).

## Solution status

Hexapawn is **strongly solved**. The position space is tiny — only a few dozen
reachable positions — so the entire game tree is trivial to evaluate exhaustively.
With perfect play the **second player wins** on the standard 3×3 board.

Hexapawn is historically important less for the result than as a teaching
device: Gardner used it to describe a *learning* machine, and Donald Michie's
contemporaneous MENACE ([Michie, 1963](../references.md#michie-menace1963))
showed a matchbox-and-bead "computer" converging on perfect play of such small
games — an early, tangible demonstration of reinforcement learning.

## Consensus on optimal play

- **Second player's core defense: mirror or block** — in the standard 3x3 start, White (first player) has only three opening moves. For each one the best Black response is known and can be memorized. Black's goal is to either advance a pawn to promotion or leave White with no legal move.
- **Avoid diagonal captures that open lanes for promotion** — capturing an opponent's pawn can clear a path for their neighboring pawn to advance. Count promotable pawn lines before capturing.
- **Block all three advance lanes** — with three columns, controlling the path of each opposing pawn is the whole game. A pawn that reaches the far rank wins immediately, so no lane can be left open.
- **The second player wins by steering into the right lines** — the full game tree is tiny. Memorize the three or four key branching points and the correct response at each. There is nothing more.

## Engines & current best play

- **Strongest known program(s):** Any minimax search, including MENACE (Michie's matchbox computer, 1963) — the entire game tree is trivially small.
- **Strength:** Perfect play is achievable by exhaustive search and learnable by humans with minimal study.
- **Where the proof / tablebase lives (if solved):** [Gardner (1962)](../references.md#gardner-hexapawn1962); complete game tree solvable by hand.
- **Notes:** Famous as a reinforcement-learning teaching example (MENACE); the result (second-player win) is a memorisable fact, not a computational challenge.

## Complexity

Negligible; solvable by hand.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Hexapawn) ([archive](http://web.archive.org/web/20260405012433/https://en.wikipedia.org/wiki/Hexapawn))
- [Gardner, M. (1962). *Mathematical Games* (Hexapawn).](../references.md#gardner-hexapawn1962)
- [Michie, D. (1963). *Experiments on the mechanization of game-learning* (MENACE).](../references.md#michie-menace1963)

## See also

- [Minichess](minichess.md) · [Tic-tac-toe](tic-tac-toe.md) · [Breakthrough](breakthrough.md)
- Lexicon: [strongly solved](../lexicon/README.md#strongly-solved) · [first-player advantage](../lexicon/README.md#first-player-advantage)
