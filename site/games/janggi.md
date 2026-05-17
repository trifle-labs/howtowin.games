# Janggi

> Korean chess — closely related to xiangqi, and likewise unsolved.

| Field | Value |
|-------|-------|
| Also known as | Korean chess |
| Players | 2 |
| Type | Partisan board game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Unsolved |
| **Game-theoretic value** | Unknown |
| Year solved | — |
| Solved by | — |
| State-space complexity | Comparable to xiangqi (~10^40 order) |
| Game-tree complexity | Comparable to xiangqi |
| **Playable** | janggi |

## Description

Played on a 9×10 board derived from [xiangqi](xiangqi.md), but with several rule
differences: there is **no river**, pieces sit and move on intersections, the
Elephant has a longer move, players may **pass**, and a distinctive opening
"setup" choice lets each side swap the starting squares of their horse and
elephant on either wing. A bare-general "draw by counting" (material score)
rule resolves long endgames.

## Solution status

Janggi is **unsolved**. Its complexity is broadly comparable to its relative
[xiangqi](xiangqi.md) — on the order of 10^40 positions — placing it far beyond
exhaustive solving. The ability to pass and the opening setup choices add
further branching. Janggi has competitive engines but no proof of the standard
game's value, and it has received noticeably less computational-solving
attention than chess, shogi, or xiangqi.

## Consensus on optimal play

- **Opening setup choice sets the character of the game** — choosing "horse-elephant" vs. "elephant-horse" order on each wing changes attack patterns for the whole game; standard competitive practice favours specific setup pairings based on what the opponent selects.
- **The pass rule is a tempo weapon** — unlike xiangqi or chess, a legal pass is allowed; passing to force the opponent into zugzwang (a position where any move worsens their position) is a key endgame and certain middlegame technique.
- **Elephants are stronger in Janggi than in xiangqi** — the Janggi elephant has a slightly different leap and is more active; treat it as a major piece and don't trade it casually.
- **Palace diagonals are critical attack lines** — the general (king) moves freely within the nine-cell palace, including diagonally; threatening the general along a palace diagonal forces defensive responses and can enable back-rank tactics.
- **Material count resolves long endgames** — the draw-by-counting rule means a player with more material can claim a draw after 100 moves; know the piece values and when to invoke or avoid this rule.
- **Cannons weaken as pieces are traded** — cannons must jump over exactly one piece to capture; in open positions with few pieces, cannons become passive; plan exchanges with cannon activity in mind.

## Engines & current best play

- **Strongest known program(s):** No dominant public engine known to the cataloguer; Korean-language competitive programs are used in the online Janggi community.
- **Strength:** Strong amateur; engines exceed casual human play but are less developed than chess or shogi engines.
- **Where the proof / tablebase lives (if solved):** Not solved; no published complete endgame tablebase.
- **Notes:** Less computational-solving attention than chess/shogi/xiangqi; competitive theory is primarily human-derived and passed through Korean competitive channels.

## Complexity

Comparable to xiangqi: state-space on the order of 10^40, game-tree far beyond
search.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Janggi) ([archive](http://web.archive.org/web/20260513200804/https://en.wikipedia.org/wiki/Janggi))
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002) (general framework)

## See also

- [Xiangqi](xiangqi.md) · [Chess](chess.md) · [Shogi](shogi.md)
- Lexicon: [game-tree complexity](../lexicon/README.md#game-tree-complexity)
