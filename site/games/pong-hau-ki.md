# Pong hau k'i

> A tiny traditional blocking game. Small enough to solve completely by hand — with perfect play it is a draw.

| Field | Value |
|-------|-------|
| Also known as | Pong hau k'i (Chinese), Ou-moul-ko-no (Korean), "the gourd game" |
| Players | 2 |
| Type | Partisan blocking game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Strongly solved |
| **Game-theoretic value** | Draw |
| Year solved | folklore (trivially solvable) |
| Solved by | Exhaustive enumeration |
| State-space complexity | ~10 positions |
| Game-tree complexity | Tiny |
| **Playable** | pong-hau-ki |

## Description

Played on a board with 5 points connected by lines (the classic shape is a square of 4 points with a diagonal line through it, plus a 5th point at the top). Each player has 2 pieces; one point is always empty. Players take turns sliding a piece along a line into the empty point. A player who cannot move loses (their pieces are blocked).

## Solution status

Pong hau k'i is **strongly solved** — trivially. The entire game graph has only
a handful of distinct positions, so every position's value can be enumerated by
hand. With correct play **neither side can force a win**: the game is a **draw**
(in practice, an endless cycle, since a player simply avoids ever being blocked).
It is a standard classroom example of a game whose full state graph fits on a
single page.

## Consensus on optimal play

- **Never get trapped in a corner** — the only way to lose is to let both of your pieces sit on points with no empty neighbor between them. Always make sure at least one of your pieces has a way out.
- **Use the top point to avoid being blocked** — the 5th point at the top connects to more lines than the four square points. Controlling it gives your pieces more escape routes.
- **Mirror the opponent when you can** — if the board has a symmetry the opponent just used, sliding the matching piece preserves your own options and limits theirs.
- **Draw by cycling** — both players can keep the game going in a cycle forever. If you are at risk of being blocked, retreat to the safe cycle rather than trying to trap the opponent.
- **The game is all about blocking** — there is no scoring or capturing. The only goal is to keep at least one legal move at all times.

## Engines & current best play

- **Strongest known program(s):** No game-specific public engine needed — the full position graph (≈10 states) is trivially enumerable by hand.
- **Strength:** Perfect play by any correct minimax implementation of the ~10 position graph.
- **Where the proof / tablebase lives (if solved):** [Wikipedia](https://en.wikipedia.org/wiki/Pong_hau_ki)
- **Notes:** Among the smallest games in any catalogue; a draw with mutual correct play.

## Complexity

About ten reachable positions — among the smallest non-trivial games in this
archive.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Pong_hau_ki)
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002) (general framework)

## See also

- [Mū tōrere](mu-torere.md) · [Three Men's Morris](three-mens-morris.md)
- Lexicon: [strongly solved](../lexicon/README.md#strongly-solved) · [draw](../lexicon/README.md#draw)
