# YINSH

> A game where players flip rings and remove rows of markers on a hexagonal board. It has not been solved.

| Field | Value |
|-------|-------|
| Also known as | YINSH |
| Players | 2 |
| Type | Partisan placement+movement game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Unsolved |
| **Game-theoretic value** | Unknown |
| Year solved | — |
| Solved by | — |
| State-space complexity | Large |
| Game-tree complexity | Large |
| **Playable** | yinsh |

## Description

YINSH (Kris Burm, 2003) is the fourth GIPF-project game. Each player has five
**rings**; markers placed inside rings flip when jumped over, and rows of five
same-coloured markers are removed (along with a ring) for points.

## Rules

1. Board: 85-cell hexagonal grid.
2. Each player has 5 rings of their colour and a shared pool of
   two-sided markers (black on one side, white on the other).
3. **Setup**: players alternate placing all 10 rings on empty cells.
4. **Each turn**:
   1. Place one marker of your colour inside one of your rings.
   2. Move that ring along a straight line of empty cells, then jumping over
      any contiguous run of markers, landing on the first empty cell beyond.
      All markers jumped over are **flipped** to the opposite colour.
   3. If this move creates **any** five-in-a-row of one colour, the entire row
      is removed from the board, and the player whose colour matches removes
      one of their rings (and scores a point).
5. The first player to remove **3 of their own rings** wins.

## Solution status

YINSH is **not solved**. The flipping mechanic gives the game a deep,
non-monotone evaluation surface; engines exist but no published solution.

## Consensus on optimal play

- **Place rings to threaten rows in multiple directions** — a ring on the hex board can project along six lines; position rings so that a single move can create a five-in-a-row along more than one axis, forcing the opponent to decide which threat to block.
- **Flipping opponent markers is as good as placing your own** — every ring move flips all markers it jumps over; moving a ring through a cluster of opponent markers can instantly convert them to your colour and open or close rows simultaneously.
- **Sacrifice a ring strategically, not defensively** — removing a ring when you score shrinks your mobility; score with a ring you planned to remove anyway (e.g., a ring that has become hemmed in), preserving your most flexible rings for longer.
- **Deny opponent five-in-a-rows by disrupting their colour chains** — move a ring through a near-complete opponent row to flip one or more markers and break the sequence; a single flip can invalidate two or three near-wins at once.
- **The endgame (final ring race) is decisive** — when both players need only one more ring removal to win, every move must either score or prevent the opponent from scoring; tactical calculation in this phase overrides all positional considerations.

## Engines & current best play

- **Strongest known program(s):** MCTS and neural-network-based programs (developed within the abstract-games community); no single well-known open-source engine dedicated to YINSH is publicly dominant.
- **Strength:** Competitive with strong human players; top engines likely exceed most club-level humans.
- **Where the proof / tablebase lives (if solved):** —
- **Notes:** YINSH's non-monotone evaluation (flipping reverses piece ownership) makes it particularly challenging for traditional alpha-beta search; neural-network approaches are better suited to its evaluation landscape.

## Complexity

Large.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/YINSH) ([archive](http://web.archive.org/web/20251008041412/https://en.wikipedia.org/wiki/YINSH))
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)

## See also

- [GIPF](gipf.md) · [DVONN](dvonn.md) · [TZAAR](tzaar.md) · [LYNGK](lyngk.md)
- Lexicon: [game-tree complexity](../lexicon/README.md#game-tree-complexity)
