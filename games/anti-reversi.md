# Anti-Reversi

> Reversi played to lose — fewer discs wins. Largely unsolved despite the
> small board.

| Field | Value |
|-------|-------|
| Also known as | Reverse Othello, Anti-Othello |
| Players | 2 |
| Type | Partisan placement game (misère) |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Unsolved (6×6 solved **[verify]**; 8×8 open) |
| **Game-theoretic value** | Unknown |
| Year solved | — |
| Solved by | — |
| State-space complexity | Same as Reversi |
| Game-tree complexity | Same as Reversi |

## Description

The misère cousin of [Othello](othello.md): the rules are identical, but **the
player with the fewest discs at the end wins**. As with most misère games,
strategy diverges sharply from the normal-play version.

## Rules

1. Same board, setup, and movement rules as [Othello](othello.md):
   - 8×8 board with the standard four-disc cross opening.
   - On a turn a player places a disc that **must** bracket at least one
     opposing run of discs, flipping all bracketed discs.
   - If no legal placement exists, the player passes; if neither player can
     move, the game ends.
2. At the end, the player with the **fewer** discs on the board wins.

## Solution status

Anti-Reversi is **not formally solved** on the standard 8×8 board. There are
strong programs and some claim of a 6×6 solution, but the headline result for
[Othello](othello.md) — Takizawa's 2023 weak solution showing a draw — has no
analogous published proof for the anti-variant. The misère nature of the game
inverts the usual evaluations; opening theory is markedly different.

## Consensus on optimal play

- **Avoid big flip chains** — in normal Othello you want to flip many discs at once; in Anti-Reversi, large flips move discs to your colour, which is bad. Prefer moves that flip as few discs as possible.
- **Surrender edge and corner squares** — in normal Othello corners are gold; here, landing on a corner anchors your disc permanently (it cannot be flipped back), which is a liability. Avoid corners unless forced.
- **Aim for fewer discs throughout, not just at the end** — disc count shifts dramatically in late-game mass flips; trailing in disc count mid-game is usually good.
- **Force the opponent to flip your discs** — set up positions where the opponent's only legal moves are ones that convert your discs to theirs.
- **Parity still matters** — like normal Othello, the final sequence of forced moves is often decisive; maintaining move-parity in the last region can determine who makes the last large flip.

## Engines & current best play

- **Strongest known program(s):** No widely-distributed dedicated Anti-Reversi engine known to the cataloguer; general Othello/Reversi engines can be adapted with inverted evaluation.
- **Strength:** Not benchmarked publicly.
- **Where the proof / tablebase lives (if solved):** — (8×8 unsolved; 6×6 claimed but no canonical public source)
- **Notes:** Misère Othello strategy is essentially the inverse of normal Othello; engine-derived opening books exist in competitive Anti-Othello circles but are not publicly documented in the literature.

## Complexity

Same as Othello.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Reversed_Othello)
- [Takizawa (2023). *Othello is Solved*.](../references.md#takizawa2023) (related)
- [Feinstein (1993). *Amenor Wins World 6×6 Championships*.](../references.md#feinstein-othello6x61993)

## See also

- [Othello](othello.md) · [Quixo](quixo.md) · [Losing chess](losing-chess.md)
- Lexicon: [misère play](../lexicon/README.md#misere-play)
