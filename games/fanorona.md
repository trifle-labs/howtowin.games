# Fanorona

> Madagascar's national board game, with capture by approach and withdrawal —
> weakly solved in 2008 as a draw.

| Field | Value |
|-------|-------|
| Also known as | Fanorona (Madagascar) |
| Players | 2 |
| Type | Partisan board game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Weakly solved |
| **Game-theoretic value** | Draw |
| Year solved | 2008 |
| Solved by | Maarten Schadd, Mark Winands, Jos Uiterwijk, H. Jaap van den Herik & Maurice Bergsma |
| State-space complexity | ~10^21 |
| Game-tree complexity | ~10^46 |

## Description

The standard board (*Fanorona-Tsivy*) is a 9×5 grid of points connected by
lines. Pieces capture by **approach** (moving toward an adjacent enemy line) or
**withdrawal** (moving away from one), removing the whole line of enemy pieces
beyond; capturing is compulsory when possible and capture-chains can continue.
A player wins by removing all enemy pieces.

## Solution status

Fanorona is **weakly solved**. [Schadd et al. (2008)](../references.md#schadd-fanorona2008)
proved that **with perfect play the standard game is a draw**, using
[proof-number search](../lexicon/README.md#proof-number-search) together with
endgame [databases](../lexicon/README.md#endgame-tablebase) built by
[retrograde analysis](../lexicon/README.md#retrograde-analysis) — the same
meet-in-the-middle methodology used for checkers and Nine Men's Morris. At
~10^21 positions, Fanorona is of comparable scale to English
[checkers](checkers.md).

## Consensus on optimal play

- **Prioritise capture chains over single captures** — each capture allows an additional move in the same turn (using a different direction and piece); a multi-capture sequence that removes 4–6 enemy pieces in one turn is often decisive; plan the chain before committing to the first capture.
- **Distinguish approach from withdrawal before each capture** — approach captures the line of pieces in front of you (the ones you move toward), withdrawal captures the line behind you (the ones you move away from); choosing the correct direction often doubles or triples the number of pieces removed.
- **Use the central points for maximum capture reach** — the Fanorona board has both orthogonal and diagonal lines; central points intersect more lines than edge points and give pieces more potential capture directions in a chain.
- **The "passing" capture restriction prevents infinite loops** — a piece cannot revisit a position it has already occupied in the current capture chain; keep track of where you have been to avoid cutting off your own chain mid-sequence.
- **With perfect play the game is a draw** — neither side should expect to win against a strong opponent; the correct defensive goal is to maintain sufficient piece density to answer all capture chains, not to race for a material advantage.

## Engines & current best play

- **Strongest known program(s):** Schadd et al.'s 2008 proof-search engine combined with endgame tablebases; the program that proved the draw result.
- **Strength:** Perfect from the proven weak solution; the endgame databases give exact play for all covered positions.
- **Where the proof / tablebase lives (if solved):** [Schadd et al. (2008)](../references.md#schadd-fanorona2008); endgame databases computed at Maastricht University.
- **Notes:** Fanorona's solution required combining proof-number search from the opening with retrograde-analysis endgame databases in a meet-in-the-middle approach, mirroring the technique used for checkers.

## Complexity

State-space ~10^21; game-tree ~10^46
([Schadd et al., 2008](../references.md#schadd-fanorona2008)).

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Fanorona) ([archive](http://web.archive.org/web/20260129053911/https://en.wikipedia.org/wiki/Fanorona))
- [Schadd, M. P. D. et al. (2008). *Best Play in Fanorona Leads to Draw*.](../references.md#schadd-fanorona2008)

## See also

- [Checkers (English draughts)](checkers.md) · [International draughts](international-draughts.md) · [Awari](awari.md)
- Lexicon: [weakly solved](../lexicon/README.md#weakly-solved) · [proof-number search](../lexicon/README.md#proof-number-search)
