# Pong hau k'i

> A tiny traditional blocking game — small enough to solve completely by hand;
> with correct play it is a draw.

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

Played on a board of 5 points connected by lines (the classic shape has a square
of 4 points with a diagonal, plus a 5th apex point). Each player has 2 pieces;
one point is empty. Players alternate sliding a piece along a line into the empty
point. A player who cannot move loses (their pieces are blocked).

## Solution status

Pong hau k'i is **strongly solved** — trivially. The entire game graph has only
a handful of distinct positions, so every position's value can be enumerated by
hand. With correct play **neither side can force a win**: the game is a **draw**
(in practice, an endless cycle, since a player simply avoids ever being blocked).
It is a standard classroom example of a game whose full state graph fits on a
single page.

## Consensus on optimal play

- **Never slide into a corner where both exits are blocked** — the only way to lose is to allow your two pieces to simultaneously occupy points with no shared empty neighbour; always check that at least one of your pieces has an exit.
- **Use the apex point to prevent opponent blockade** — the 5th apex point is adjacent to more connections than the four square corners; controlling it gives your pieces more routing options.
- **Mirror the opponent's move when possible** — if the board has a symmetry your opponent just exploited, sliding the mirrored piece preserves your own mobility and denies theirs.
- **Draw by cycling** — both players can maintain the cycle indefinitely; a player at risk of being blocked should immediately retreat to the safe cycle of positions rather than trying to trap the opponent.
- **The game is decided entirely by blocking** — there is no scoring or capture; the sole goal is to retain at least one legal move at all times.

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
