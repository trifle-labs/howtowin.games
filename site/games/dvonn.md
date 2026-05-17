# DVONN

> A stacking game with three "DVONN" pieces that anchor the board — unsolved
> but a frequent computer-game research target.

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

DVONN (Kris Burm, 2001) is the third GIPF-project game. Two players have
single-coloured pieces (black and white); a small set of red **DVONN pieces**
anchor groups of pieces. The board shrinks as orphaned stacks (groups not
connected via a DVONN piece) fall off.

## Rules

1. Board: 49-cell hexagonal grid.
2. **Placement phase**: starting with the DVONN pieces (red), then alternating
   their own colours, players place all pieces onto empty cells until the board
   is filled.
3. **Movement phase**: players alternate moving a stack they control on top of
   (= same colour topping the stack). A stack moves exactly the number of
   cells equal to its height, in any of six directions, and must land on
   another stack (cannot move to an empty cell).
4. After every move, any stack not connected (via stacks) to a DVONN piece
   falls off the board.
5. A player who cannot move passes; once both pass, the game ends and the
   player with the **taller controlled total height** wins.

## Solution status

DVONN is **not solved**. It is a common research target for Monte-Carlo and
neural-network game programs, and engines play it strongly, but no formal
solution exists.

## Consensus on optimal play

- **Control DVONN piece proximity** — every stack on the board must stay connected to a DVONN piece; placing your stacks to maintain and threaten connection while forcing opponent stacks to become isolated is the dominant strategic theme.
- **In the placement phase, surround DVONN pieces with your colour** — stacks near a DVONN piece are harder to isolate; placing your pieces in a loose ring around the DVONN pieces in the placement phase gives you reliable anchors for the movement phase.
- **Build tall stacks before moving, not during** — a tall stack is harder to isolate (it moves a long distance and lands on many targets), but building height requires sacrificing short stacks by merging early; identify which merges build height efficiently without leaving isolated pieces.
- **Cut opponent connection lines** — moving a stack between an opponent stack and the nearest DVONN piece severs that stack's lifeline; isolation threats force the opponent into defensive moves that waste their tempo.
- **Prefer to have the last move in tight endgames** — when most stacks are large, the player who can make the last controlling move to absorb the remaining DVONN-connected stacks often wins; parity counting matters in the late game.

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
