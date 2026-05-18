# Fanorona

> Madagascar's national board game. You capture by moving toward or away from enemy pieces. Solved in 2008 — it is a draw with perfect play.

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
| **Playable** | fanorona |

## Description

The standard board (called *Fanorona-Tsivy*) is a 9×5 grid of points connected
by lines. Pieces capture in two ways: by **approach** (moving toward a
neighboring enemy piece) or by **withdrawal** (moving away from one). Either
way, you remove the entire line of enemy pieces beyond the one you touch.
Capturing is required if you can, and capture chains can continue in the same
turn. A player wins by removing all enemy pieces.

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

- **Go for capture chains, not single captures** — each capture lets you take another move in the same turn (using a different direction and piece). A chain that removes 4-6 enemy pieces in one turn is often a winning move. Plan the chain before making the first capture.
- **Know the difference between approach and withdrawal** — approach captures the line of pieces in front of you (the ones you move toward), while withdrawal captures the line behind you (the ones you move away from). Choosing the right direction often doubles or triples how many pieces you remove.
- **Use the center points for the most capture options** — the Fanorona board has both up/down/left/right and diagonal lines. Center points connect to more lines than edge points and give pieces more directions to capture in a chain.
- **The "passing" rule stops infinite loops** — a piece cannot go back to a spot it already visited in the same capture chain. Keep track of where you have been to avoid accidentally ending your chain early.
- **With perfect play, the game is a draw** — neither side should expect to win against a strong opponent. The correct defensive goal is to keep enough pieces to answer any capture chain, not to race for a material advantage.

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
