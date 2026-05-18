# Renju

> Professional five-in-a-row with rules that handicap the first player. The first player still wins.

| Field | Value |
|-------|-------|
| Also known as | Professional Gomoku |
| Players | 2 |
| Type | Partisan positional (k-in-a-row) game with first-player restrictions |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Weakly solved |
| **Game-theoretic value** | First-player win |
| Year solved | 2001 |
| Solved by | János Wágner & István Virág |
| State-space complexity | ~10^105 (15×15 board) |
| Game-tree complexity | ~10^70 |
| **Playable** | renju |

## Description

Renju is [Gomoku](gomoku.md) played on a 15x15 board with rules that **handicap the first player (Black)**: Black is not allowed to make "double-three" (two open threes at once), "double-four" (two open fours at once), or "overline" (six or more in a row) — these are all fouls that make Black lose. White has no such restrictions. These handicaps were added because free-style Gomoku is too easy for the first player to win.

## Solution status

Renju is **weakly solved**. [Wágner & Virág (2001)](../references.md#wagner-virag2001)
proved that, even with the forbidden-move handicaps, **the first player still
wins** with perfect play (under the rule set without opening restrictions such
as the modern swap/opening protocols). They used
[proof-number search](../lexicon/README.md#proof-number-search) and threat-based
search techniques in the lineage of Allis's Gomoku solution.

The result is a notable cautionary tale about game balancing: the Renju fouls
substantially narrow Black's options but do not eliminate the first-player win —
which is why modern competitive Renju also layers on opening-move protocols.

## Consensus on optimal play

- **As Black, avoid the forbidden patterns** — never make a move that creates double-three (two open threes at once), double-four (two open fours at once), or overline (six or more in a row). These are immediate fouls that make you lose.
- **As White, try to trap Black into a foul** — steer the game toward positions where every winning move Black has is also a foul. This "forbidden trap" strategy is unique to Renju.
- **Five-in-a-row beats a foul for Black** — if Black makes exactly five in a row while also creating a forbidden pattern, the five-in-a-row counts as a win. This requires exact counting.
- **Build chains of forced moves** — the strongest players and programs build winning sequences by chaining together moves that force the opponent to block four-in-a-row over and over (VCF = victory by consecutive fours, VCT = victory by consecutive threats).
- **Opening rules matter in real play** — competitive Renju adds swap2 or other opening rules to balance the game. Practice specific openings that lead into positions covered by the Wagner-Virag winning tree.

## Engines & current best play

- **Strongest known program(s):** Renju-specific solvers built on threat-space search (Wágner & Virág's 2001 system); community programs such as Gomoku/Renju engines available in online play.
- **Strength:** Super-human on the solved opening; beats top professionals from the starting position.
- **Where the proof / tablebase lives (if solved):** [Wágner & Virág (2001)](../references.md#wagner-virag2001)
- **Notes:** The proof covers the basic Renju rule set without swap/opening protocols; competitive engines additionally handle modern tournament rule sets.

## Complexity

State-space ~10^105, game-tree ~10^70 (same board as Gomoku;
[van den Herik et al., 2002](../references.md#vandenherik2002)).

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Renju) ([archive](http://web.archive.org/web/20260311032313/https://en.wikipedia.org/wiki/Renju))
- [Wágner, J. & Virág, I. (2001). *Solving Renju*.](../references.md#wagner-virag2001)
- [Allis, van den Herik & Huntjens (1996). *Go-Moku Solved by New Search Techniques*.](../references.md#allis-gomoku1996)

## See also

- [Gomoku](gomoku.md) · [Pente](pente.md) · [Connect6](connect6.md)
- Lexicon: [weakly solved](../lexicon/README.md#weakly-solved) · [first-player advantage](../lexicon/README.md#first-player-advantage)
