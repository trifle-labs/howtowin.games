# DVONN

> A stacking game where three red "DVONN" pieces anchor the board. Unsolved, but a common target for game AI research.

| Field | Value |
|-------|-------|
| Also known as | DVONN |
| Players | 2 |
| Type | Partisan stacking game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Unsolved |
| **Game-theoretic value** | Unknown |
| Year solved | — |
| Solved by | — |
| State-space complexity | Large |
| Game-tree complexity | Large |
| **Playable** | dvonn |

## Description

DVONN (by Kris Burm, 2001) is the third game in the GIPF project. The two
players have pieces of their own color (black and white). A small set of red
**DVONN pieces** act as anchors for stacks of pieces. The board shrinks as
groups of stacks that are not connected to a DVONN piece fall off.

## Rules

1. Board: a hexagonal grid with 49 cells.
2. **Placement phase**: First, the red DVONN pieces are placed. Then players take turns placing their own colored pieces on empty cells until the board is full.
3. **Movement phase**: Players take turns moving a stack they control (a stack is controlled by whoever has their color on top). A stack moves exactly as many cells as its height, in any of six directions, and must land on top of another stack (it cannot move to an empty cell).
4. After every move, any stack that is not connected (through other stacks) to a DVONN piece falls off the board.
5. A player who cannot move passes. When both players pass in a row, the game ends and the player with the **greater total height of their controlled stacks** wins.

## Solution status

DVONN is **not solved**. It is a common research target for Monte-Carlo and
neural-network game programs, and engines play it strongly, but no formal
solution exists.

## Consensus on optimal play

- **Control access to the DVONN pieces** — every stack must stay connected to a DVONN piece. Keeping your stacks connected while cutting off your opponent's stacks from the DVONN pieces is the main strategic goal.
- **During placement, surround the DVONN pieces with your color** — stacks near a DVONN piece are harder to isolate. Placing your pieces in a loose ring around the DVONN pieces during setup gives you reliable anchors for the movement phase.
- **Build tall stacks before moving, not while moving** — tall stacks are harder to isolate (they move farther and land on more targets), but building height requires merging short stacks early. Figure out which merges build height efficiently without leaving isolated pieces.
- **Cut the opponent's connections to DVONN pieces** — moving a stack between an opponent stack and the nearest DVONN piece cuts that stack's lifeline. Threatening to isolate pieces forces the opponent into defensive moves that waste their turn.
- **Try to have the last move in tight endgames** — when most stacks are large, the player who makes the last key move to absorb the remaining DVONN-connected stacks often wins. Counting turns matters in the late game.

## Engines & current best play

- **Strongest known program(s):** Various MCTS and neural-network programs from Computer Olympiad entries; no single widely-distributed canonical engine known to the cataloguer.
- **Strength:** Super-human; top engines consistently outperform top human players.
- **Where the proof / tablebase lives (if solved):** — (unsolved)
- **Notes:** DVONN has been a Computer Olympiad event; MCTS with domain-specific heuristics has been the dominant engine architecture, though neural-network approaches have also been applied successfully.

## Complexity

Large.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/DVONN) ([archive](http://web.archive.org/web/20260130165830/https://en.wikipedia.org/wiki/DVONN))
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)

## See also

- [GIPF](gipf.md) · [ZÈRTZ](zertz.md) · [YINSH](yinsh.md) · [LYNGK](lyngk.md)
- Lexicon: [game-tree complexity](../lexicon/README.md#game-tree-complexity)
