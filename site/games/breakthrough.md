# Breakthrough

> A modern racing game with simple rules. Solved on small boards, but the standard 8×8 game is still open.

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
| **Playable** | breakthrough |

## Description

Breakthrough was invented by Dan Troyka in 2000 (it won a design competition in
2001). It is played on a rectangular board — usually 8×8. Each player has two
rows of identical pieces. A piece moves one square forward (straight or
diagonally) and can **only capture diagonally** forward. Pieces never move
backward. The first player to reach the opponent's back row — or to capture all
of the opponent's pieces — wins. Draws are impossible: pieces only get removed,
and someone must eventually break through.

## Solution status

Breakthrough is **partially solved**. [Saffidine, Jouandeau & Cazenave (2012)](../references.md#saffidine-breakthrough2012)
weakly solved several small boards (e.g. 3×n and other reduced sizes) using race
patterns and job-level proof-number search; subsequent work extended weak
solutions to further small boards (such as 6×5). The **standard 8×8 game is
unsolved** — its state space (~10^28) and branching factor remain out of reach of
a full weak solution, though it is a popular test bed for game-AI research and
strong programs play it well.

## Consensus on optimal play

- **Advance on a broad front, not in one column** — since you can only capture diagonally, a piece moving straight forward in one column can be blocked by a single enemy piece directly ahead. Spreading your attack across multiple columns creates threats the opponent cannot block all at once.
- **Create a piece that cannot be stopped** — a piece with no enemy piece that can diagonally intercept it on the way to the back row is as good as a win. Creating such a "runner" while stopping the opponent from making one is the main strategic goal.
- **Trade pieces to open a path** — captures are always diagonal. Use them to remove pieces that block your advance. Choose trades that leave your pieces in a better position to race forward.
- **Count moves in a race** — both players advance at the same time. Count how many moves each side needs to get a piece across. This tells you whether you can afford to capture or must push straight ahead.
- **Attack from the sides to distract** — advancing on the flank forces the opponent to defend there, which can open up a path in the middle for your winning breakthrough.

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
