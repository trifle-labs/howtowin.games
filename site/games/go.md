# Go

> The largest classical board game — superhuman AI exists, small boards are
> solved, but 19×19 Go is far from solved.

| Field | Value |
|-------|-------|
| Also known as | Weiqi, Baduk, Igo |
| Players | 2 |
| Type | Partisan territory game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Unsolved (19×19); small boards solved — 5×5 weakly solved |
| **Game-theoretic value** | Unknown (19×19). 5×5: first player (Black) wins by 25 |
| Year solved | 5×5: 2002 |
| Solved by | 5×5: Erik van der Werf, H. Jaap van den Herik & Jos Uiterwijk |
| State-space complexity | ~2 × 10^170 legal positions (19×19) |
| Game-tree complexity | ~10^360 (19×19) |

## Description

Played on the intersections of a 19×19 grid. Players alternately place stones;
stones with no liberties are captured; the goal is to control more territory
(plus captures) than the opponent. The *ko* rule forbids immediate board
repetition.

## Solution status

19×19 Go is **unsolved** and is the standard example of a game whose sheer size
defeats solving. Its ~2 × 10^170 legal positions and ~10^360 game-tree complexity
dwarf every other classical game.

- **Small boards are solved.** [Van der Werf, van den Herik & Uiterwijk (2003)](../references.md#vanderwerf-go2003)
  weakly solved **5×5 Go**: the first player (Black) wins, capturing the whole
  board for a 25-point win. Boards up to roughly 5×6 / 6×6 have also been solved
  in subsequent work; **7×7** has been very extensively analysed and its value
  is widely agreed (a small Black win under common komi) though "solved" status
  there is more nuanced.
- **Superhuman play is not a solution.** [AlphaGo](../references.md#silver-alphago2016)
  (2016) and its successors decisively surpassed top human players, and
  [AlphaZero](../references.md#silver-alphazero2018) reached that level from
  self-play alone — but this is [strong play, not solving](../lexicon/README.md#solving-vs-strong-play):
  it establishes no proven game-theoretic value for 19×19.

## Consensus on optimal play

- **Influence over territory early, territory over influence late** — early in the game, strong players build frameworks (moyo) that threaten large territories; converting influence into solid territory before the opponent invades is the central tension.
- **Two eyes or die** — any group without two distinct eye spaces is eventually captured; building eyes (or the potential for them) is the unconditional requirement for group survival.
- **Do not attach to weak stones** — attaching a stone to an opponent's already-weak group strengthens that group while thickening their position; instead, attack from a distance (the knight's move or two-space extension) to maintain flexibility.
- **Komi calibrates the first-move advantage** — professional consensus has settled on 6.5 or 7.5 points komi as roughly fair; playing for a narrow margin win as Black (or neutralising it as White) shapes endgame priorities.
- **Sente (initiative) is a resource** — a move that demands a response grants the player the next "free" move elsewhere; counting sente/gote sequences is essential in the middle and late game.
- **Reducing while maintaining your own thickness** — invasions succeed when the invader can run or live; ensure your invasion point is not adjacent to a strong opponent wall that would make escape impossible.

## Engines & current best play

- **Strongest known program(s):** KataGo ([https://github.com/lightvector/KataGo](https://github.com/lightvector/KataGo) ([archive](http://web.archive.org/web/20260510144301/https://github.com/lightvector/KataGo))) and Leela Zero ([https://github.com/leela-zero/leela-zero](https://github.com/leela-zero/leela-zero)) — both deep-learning Monte Carlo tree search engines in the AlphaGo/AlphaZero lineage.
- **Strength:** Super-human on 19×19; all top engines vastly exceed professional human level.
- **Where the proof / tablebase lives (if solved):** 5×5 solved (van der Werf et al., 2003); 19×19 not solved — no tablebase.
- **Notes:** Engine consensus on "fair komi" (~7 points) is the closest thing to a settled game-theoretic claim for 19×19; the exact value remains unproven.

## Complexity

State-space ~2 × 10^170; game-tree ~10^360
([van den Herik et al., 2002](../references.md#vandenherik2002)). Generalised Go
is EXPTIME-complete.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Go_(game)) ([archive](http://web.archive.org/web/20260508155030/https://en.wikipedia.org/wiki/Go_(game)))
- [van der Werf, E. C. D., van den Herik, H. J. & Uiterwijk, J. W. H. M. (2003). *Solving Go on Small Boards*.](../references.md#vanderwerf-go2003)
- [Silver et al. (2016). *Mastering the game of Go…* (AlphaGo).](../references.md#silver-alphago2016)
- [Silver et al. (2018). *AlphaZero*.](../references.md#silver-alphazero2018)
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)

## See also

- [Atari Go / capture Go](arimaa.md) — see [Arimaa](arimaa.md) for another "designed to be hard for computers" game · [Chess](chess.md) · [Amazons](amazons.md)
- Lexicon: [solving vs. strong play](../lexicon/README.md#solving-vs-strong-play) · [game-tree complexity](../lexicon/README.md#game-tree-complexity)
