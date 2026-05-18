# Horde chess

> An uneven chess game where one side has a normal army and the other has 36 pawns. The pawn side has no king.

| Field | Value |
|-------|-------|
| Also known as | Horde chess, Dunsany's chess (related) |
| Players | 2 |
| Type | Partisan asymmetric chess variant |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Unsolved |
| **Game-theoretic value** | Unknown |
| Year solved | — |
| Solved by | — |
| State-space complexity | Similar to chess |
| Game-tree complexity | Similar to chess |
| **Playable** | horde-chess |

## Description

In Horde chess, Black plays a standard chess army and White plays 36 pawns (four rows of pawns). White wins by checkmating the Black king. Black wins by capturing every White pawn.

## Rules

1. Setup: Black has the normal chess starting army. White has 36 pawns occupying rows 1-4 (with the second row shifted to fill the 36-pawn pattern in the common online variant).
2. White moves first. White pawns move and capture as ordinary pawns. Pawns on their starting row may move one or two squares.
3. White has no king — White is never in check, and can only lose when no pawns remain.
4. Black plays normal chess. Black wins by removing all White pawns.
5. White wins by delivering checkmate to the Black king.
6. Draws by stalemate are draws as usual.

## Solution status

Horde chess is **not solved**. Engines play it well but its asymmetry and
material imbalance defeat standard endgame theory.

## Consensus on optimal play

- **For Black: never trade pieces for pawns one-for-one** — Black is outnumbered 36-to-16. Even trades of material favor the horde. Black must use pieces as long-range attackers, often with knights and bishops attacking backward into the horde from outside its reach.
- **For Black: target the back ranks** — the horde must keep its front line intact to threaten promotions. Getting rooks behind enemy lines forces the horde to waste moves.
- **For Black: blockade promotion squares** — a knight on the seventh row stops a column of pawns indefinitely.
- **For White (horde): march in waves, not lines** — keep the front row advancing only when the second can immediately fill gaps. Isolated advanced pawns get picked off.
- **For White: prefer captures that gain time over promotions** — promoting a pawn is only valuable when the new queen survives the next move.

## Engines & current best play

- **Strongest known programs:** [Fairy-Stockfish](https://github.com/ianfab/Fairy-Stockfish) ([archive](http://web.archive.org/web/20230224150112/https://github.com/ianfab/Fairy-Stockfish)) (open source); engine analysis is available on [Lichess](https://lichess.org/variant/horde).
- **Strength:** Super-human at both sides.
- **Notes:** Engine self-play consistently shows Black (the army side) winning a clear majority — counter to naive material intuition.

## Complexity

Similar to chess.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/List_of_chess_variants) ([archive](http://web.archive.org/web/20260508095621/https://en.wikipedia.org/wiki/List_of_chess_variants))
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)

## See also

- [Chess](chess.md) · [King of the Hill](king-of-the-hill.md)
- Lexicon: [partisan game](../lexicon/README.md#partisan-game)
