# Mū tōrere

> A Māori game on an eight-pointed star — small, elegant, and a draw with
> perfect play.

| Field | Value |
|-------|-------|
| Also known as | Mu Torere, Mu-Torere |
| Players | 2 |
| Type | Partisan sliding/blocking game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Strongly solved |
| **Game-theoretic value** | Draw |
| Year solved | Analysed 1987 (Ascher) |
| Solved by | Marcia Ascher (mathematical analysis) |
| State-space complexity | A few dozen positions |
| Game-tree complexity | Tiny |

## Description

Played on a star with eight outer points (*kewai*) and one centre (*pūtahi*).
Each player has four pieces, initially occupying four adjacent outer points. On
a turn a player slides a piece to an *adjacent empty* point — but a move from an
outer point into the centre is allowed only if at least one of the moving
piece's neighbours is an enemy piece. A player who cannot move loses (the
opponent has blocked them).

## Solution status

Mū tōrere is **strongly solved**. The state space is tiny — only a few dozen
positions — so it is fully exhaustible, and [Ascher (1987)](../references.md#ascher-mutorere1987)
gave a complete mathematical analysis. With perfect play the game is a **draw**:
neither player can force the opponent into a no-move position against correct
defence. (The restriction on moving into the centre is exactly what prevents a
quick forced win and makes the drawn structure work.)

Mū tōrere is a frequently cited example in ethnomathematics of a traditional
game whose full game-theoretic structure has been rigorously worked out.

## Consensus on optimal play

- **Keep your four pieces adjacent** — the initial configuration has each player's pieces occupying four consecutive outer points; separating your pieces by moving one too far from the group creates a piece that cannot easily return to contribute to a blocking formation.
- **Guard the centre access condition** — a piece can only move to the centre if it is adjacent to at least one enemy piece; if you occupy the centre, your opponent may be denied access to it if their pieces are not adjacent to yours; use this to control centre traffic.
- **Avoid zugzwang positions** — the game ends when a player cannot move; avoid moving into a position where all your pieces are blocked by friendly pieces and the centre is out of reach; every move should maintain at least two legal responses on your next turn.
- **Mirror the opponent's tempo** — in the draw-structure of the game, matching the opponent's moves on the opposite arc of the star tends to preserve the balance; breaking symmetry carelessly can create the blocked position that loses.
- **The restricted centre-entry rule is the whole game** — without the restriction on entering the centre, the game would be trivially won by rushing to the centre; understanding exactly when you can and cannot use the centre is the decisive tactical knowledge.

## Engines & current best play

- **Strongest known program(s):** Any exhaustive tree-search over the ~few-dozen-position graph; no dedicated software needed.
- **Strength:** Perfect; the entire position graph has been enumerated.
- **Where the proof / tablebase lives (if solved):** [Ascher (1987)](../references.md#ascher-mutorere1987) — complete mathematical analysis.
- **Notes:** A Māori traditional game; cited in ethnomathematics as a clear example of a culturally significant game with a rigorously proven game-theoretic value (draw).

## Complexity

A few dozen positions — trivially exhaustible.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/M%C5%AB_t%C5%8Drere) ([archive](http://web.archive.org/web/20260304162546/https://en.wikipedia.org/wiki/M%C5%AB_t%C5%8Drere))
- [Ascher, M. (1987). *Mu Torere: An Analysis of a Maori Game*.](../references.md#ascher-mutorere1987)

## See also

- [L game](l-game.md) · [Pong hau k'i](pong-hau-ki.md) · [Tic-tac-toe](tic-tac-toe.md)
- Lexicon: [strongly solved](../lexicon/README.md#strongly-solved) · [draw](../lexicon/README.md#draw) · [zugzwang](../lexicon/README.md#zugzwang)
