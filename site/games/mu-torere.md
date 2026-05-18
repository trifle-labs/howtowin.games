# Mū tōrere

> A Maori game played on an eight-pointed star. It is small, elegant, and ends in a draw when both players play perfectly.

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
| **Playable** | mu-torere |

## Description

Played on a star with eight outer points (called *kewai*) and one centre (called *putahi*). Each player has four pieces, starting on four neighboring outer points. On your turn you slide a piece to an empty neighboring point — but you can only move from an outer point into the centre if at least one of the piece's neighbors is an enemy piece. If you cannot move, you lose (the opponent has blocked you).

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

- **Keep your four pieces together** — your pieces start on four neighboring outer points. If you move one too far from the group, it becomes hard to bring back into a blocking formation.
- **Control access to the centre** — a piece can only move to the centre if it is next to at least one enemy piece. If you hold the centre, the opponent might not be able to enter it if their pieces are not next to yours. Use this to control who can go through the centre.
- **Avoid getting stuck** — the game ends when a player cannot move. Do not put yourself in a position where all your pieces are blocked by your own pieces and the centre is out of reach. Every move should leave you with at least two ways to move next turn.
- **Mirror the opponent's moves** — in the draw structure of this game, copying the opponent's moves on the opposite side of the star tends to keep the balance. Breaking the symmetry carelessly can create a blocked position that makes you lose.
- **The centre-entry rule is everything** — without the rule restricting centre entry, the game would be trivially won by rushing to the centre. Knowing exactly when you can and cannot use the centre is the key skill.

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
