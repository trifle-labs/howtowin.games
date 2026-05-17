# Lines of Action

> A connection game on a chessboard; played strongly by engines but not solved.

| Field | Value |
|-------|-------|
| Also known as | LOA |
| Players | 2 |
| Type | Partisan connection game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Unsolved |
| **Game-theoretic value** | Unknown |
| Year solved | — |
| Solved by | — |
| State-space complexity | ~10^23–10^24 |
| Game-tree complexity | ~10^56 |
| **Playable** | lines-of-action |

## Description

Played on an 8×8 board. Each player has pieces (Black on the top and bottom
edges, White on the left and right). A piece moves in a straight line exactly as
many squares as there are pieces (of either colour) on that line; it may jump
its own pieces but not enemy pieces, and may capture by landing on an enemy
piece. **The goal is to connect all of one's own pieces into a single
group** (orthogonally or diagonally).

## Solution status

Lines of Action is **unsolved**. Its complexity is modest by board-game
standards — comparable to Othello — and it has been a strong-AI success story:
LOA programs reached a level widely regarded as superhuman, and the game was a
regular Computer Olympiad event. But no proof of the game-theoretic value of the
standard opening position exists, so it remains unsolved.

The mismatch — a fairly small game that is nonetheless unsolved — reflects that
no group has invested the focused effort a weak solution would require, rather
than any fundamental obstacle.

## Consensus on optimal play

- **Keep your pieces in a compact cluster** — the goal is a single connected group; pieces that wander to the edges become hard to reconnect; keep the cluster tight and avoid isolated outliers.
- **Moves that both connect and disrupt** — the best moves advance your own connectivity (reduce the number of components your pieces form) while simultaneously splitting the opponent's group; evaluate moves by counting components before and after.
- **The move-distance rule rewards centrality** — a piece on a full row or column moves far; a piece on a sparse row or column moves only a little; use dense lines to make long reaching moves and sparse lines for fine positioning.
- **Restrict opponent mobility by occupying shared lines** — placing your pieces on lines the opponent needs to traverse forces their pieces to move longer distances (more of your pieces on that line means longer moves for both), which can overshoot their intended landing squares.
- **Sacrifice pieces on the periphery if they join the core** — capturing an opponent piece that brings your outlier piece into your cluster is often worth the trade; count connectivity gain per move.
- **Force asymmetry early** — symmetric positions reward the second player; break symmetry in a direction that compresses your pieces faster than the opponent's.

## Engines & current best play

- **Strongest known program(s):** MIA (Mark Winands, Maastricht University) and YL — alpha-beta search with Lines-of-Action-specific evaluation functions; MIA was the dominant Computer Olympiad program.
- **Strength:** Super-human; top LOA engines are widely regarded as playing above the strongest humans.
- **Where the proof / tablebase lives (if solved):** Not solved; no published game-theoretic value for the standard opening position.
- **Notes:** The game is a regular Computer Olympiad event; empirical engine consensus on strong play is high despite the absence of a formal proof.

## Complexity

State-space ~10^23–10^24, game-tree ~10^56 (order-of-magnitude figures from the
games-solved literature).

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Lines_of_Action) ([archive](http://web.archive.org/web/20260307215220/https://en.wikipedia.org/wiki/Lines_of_Action))
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)

## See also

- [Amazons](amazons.md) · [Hex](hex.md) · [Breakthrough](breakthrough.md)
- Lexicon: [solving vs. strong play](../lexicon/README.md#solving-vs-strong-play)
