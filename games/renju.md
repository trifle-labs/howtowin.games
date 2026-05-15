# Renju

> Professional five-in-a-row: handicaps on the first player tame Gomoku's
> advantage — but the first player still wins.

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

## Description

Renju is [Gomoku](gomoku.md) on a 15×15 board with rules that **handicap the
first player (Black)**: Black is forbidden to make "double-three," "double-four,"
or "overline" (six or more) — these are all losing fouls for Black — while White
has no such restrictions. The handicaps were introduced precisely because
free-style Gomoku is a clear first-player win.

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

- **Avoid Black's forbidden patterns** — as Black, never place a stone that creates a double-three (two open threes simultaneously), double-four (two open fours simultaneously), or overline (six or more in a row); these are immediate fouls.
- **White should force Black into foul situations** — as White, direct play toward positions where every Black winning move is also a foul; this "forbidden trap" strategy is uniquely available in Renju.
- **Five-in-a-row beats the foul for Black** — if Black can form exactly five-in-a-row in the same move that would create a forbidden pattern, the five-in-a-row wins; this requires precise counting.
- **Threat-space search drives strong play** — both humans and programs build winning strategies by iteratively discovering forced-win tree paths (VCF = victory by consecutive fours, VCT = victory by consecutive threats).
- **Opening protocols matter in practice** — competitive play adds swap2 or other opening neutralisations; prepare specific openings that steer into positions the Wágner–Virág winning tree covers.

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
