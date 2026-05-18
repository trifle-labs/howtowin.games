# Go

> The most complex classical board game. Superhuman AI exists for the full 19x19 board, but only tiny boards (5x5) have been fully solved.

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

Played on the intersections of a 19x19 grid. Players take turns placing stones. Stones with no empty neighboring points (liberties) are captured. The goal is to control more territory (plus captured stones) than the opponent. The ko rule (a rule that prevents repeating the same board position) forbids taking back a stone immediately if it would repeat the previous board layout.

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

- **Build influence early, convert to territory late** — early in the game, strong players build large frameworks (moyo) that threaten to become big territories. Turning that influence into solid points before the opponent invades is the central challenge.
- **Two eyes or die** — any group that does not have at least two separate empty spaces (eyes) inside it can eventually be captured. Building eyes (or the potential to make them) is essential for a group to survive.
- **Do not attach to weak stones** — placing a stone directly next to an opponent's already-weak group often strengthens that group while improving their overall position. Instead, attack from a distance (a knight's-move or two-space extension) to stay flexible.
- **Komi compensates for going first** — professional players agree that a komi (point bonus for the second player) of 6.5 or 7.5 points is roughly fair. As Black, play for a narrow win; as White, aim to neutralize that advantage.
- **Sente (initiative) is valuable** — a move that forces the opponent to respond gives you the next "free" move somewhere else. Counting which moves force a response (sente) versus which do not (gote) is essential in the middle and late game.
- **Invade where you can run or live** — invasions (playing inside the opponent's area) succeed when the invader can escape to open space or make two eyes. Make sure your invasion point is not next to a strong opponent wall that would make escape impossible.

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
