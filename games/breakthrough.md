# Breakthrough

> A modern racing game with simple rules — weakly solved on small boards, but
> the standard 8×8 game remains open.

| Field | Value |
|-------|-------|
| Also known as | Breakthrough |
| Players | 2 |
| Type | Partisan racing / capture game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Partially solved (small boards weakly solved; 8×8 unsolved) |
| **Game-theoretic value** | Varies by board size; 8×8 unknown |
| Year solved | small boards: 2012 onward |
| Solved by | Saffidine, Jouandeau & Cazenave (small boards) |
| State-space complexity | ~10^28 (8×8) |
| Game-tree complexity | Large (8×8) |

## Description

Invented by Dan Troyka in 2000 (it won a 2001 design competition). Played on a
rectangular board — standard is 8×8. Each player has two rows of identical
pieces. A piece moves one square straight or diagonally forward; it may **capture
only diagonally** forward. There are no other captures and pieces never move
backward. The first player to reach the opponent's back rank — or to capture all
enemy pieces — wins. Draws are impossible: material is monotonically depleted and
someone must break through.

## Solution status

Breakthrough is **partially solved**. [Saffidine, Jouandeau & Cazenave (2012)](../references.md#saffidine-breakthrough2012)
weakly solved several small boards (e.g. 3×n and other reduced sizes) using race
patterns and job-level proof-number search; subsequent work extended weak
solutions to further small boards (such as 6×5). The **standard 8×8 game is
unsolved** — its state space (~10^28) and branching factor remain out of reach of
a full weak solution, though it is a popular test bed for game-AI research and
strong programs play it well.

## Consensus on optimal play

- **Advance on a broad front, not a single file** — pieces can only capture diagonally, so a piece advancing in a single column can be blocked by a lone defender directly ahead; spreading multiple pieces across files creates threats the opponent cannot all cover.
- **Create a passed pawn equivalent** — a piece with no enemy piece that can diagonally intercept it on the way to the back rank is effectively won; creating such a "passer" while denying the opponent the same is the main strategic goal.
- **Trade advantageously to open a lane** — a capture is always diagonal, never forward; use captures to remove pieces that would block or deflect your advance, choosing exchanges that leave your own pieces better positioned to race.
- **Tempo is decisive in races** — both players simultaneously advance; counting how many moves each side needs to promote a piece (the "race count") tells you whether you can afford to spend a move on a capture or must push straight ahead.
- **Use wing pieces to threaten diversionary attacks** — an advance on the flank forces the opponent to defend it, which can free up a path in the centre for your decisive breakthrough.

## Engines & current best play

- **Strongest known program(s):** Various research bots used in the Computer Olympiad; no single canonical public engine is prominently distributed, but Breakthrough is a standard benchmark in Monte Carlo Tree Search research.
- **Strength:** Super-human; strong MCTS engines consistently outperform human players.
- **Where the proof / tablebase lives (if solved):** Small-board weak solutions (Saffidine, Jouandeau & Cazenave, 2012) — see [../references.md#saffidine-breakthrough2012](../references.md#saffidine-breakthrough2012); 8×8 unsolved.
- **Notes:** Breakthrough is popular in game-AI research because its simple rules and no-draws property make it easy to implement and benchmark; proof-number search and MCTS have both been applied successfully on small boards.

## Complexity

8×8 state-space complexity is roughly 10^28; the branching factor is moderate
but the depth and width together keep a full solution out of reach.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Breakthrough_(board_game)) ([archive](http://web.archive.org/web/20251215011900/https://en.wikipedia.org/wiki/Breakthrough_(board_game)))
- [Saffidine, Jouandeau & Cazenave (2012). *Solving Breakthrough with Race Patterns and Job-Level Proof Number Search*.](../references.md#saffidine-breakthrough2012)
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)

## See also

- [Hexapawn](hexapawn.md) · [Clobber](clobber.md) · [Chess](chess.md)
- Lexicon: [weakly solved](../lexicon/README.md#weakly-solved) · [proof-number search](../lexicon/README.md#proof-number-search)
