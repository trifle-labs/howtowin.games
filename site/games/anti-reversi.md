# Anti-Reversi

> Reversi played in reverse — the player with the fewest discs wins. Mostly unsolved despite the small board.

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
| **Playable** | anti-reversi |

## Description

Anti-Reversi is a twist on [Othello](othello.md) (also called Reversi). The
rules are the same, but **the player with the fewest discs on the board at
the end wins**. This small change completely flips the strategy upside down.

## Rules

1. The board, setup, and basic rules are the same as [Othello](othello.md):
   - 8×8 board. The game starts with four discs in a cross pattern in the center.
   - On your turn you place a disc so that it **traps** at least one line of
     the opponent's discs between your new disc and one of your existing discs.
     All trapped discs flip to your color.
   - If you have no legal move, you pass. If neither player can move, the game ends.
2. At the end, the player with **fewer** discs on the board wins.

## Solution status

Anti-Reversi is **not formally solved** on the standard 8×8 board. There are
strong programs and some claim of a 6×6 solution, but the headline result for
[Othello](othello.md) — Takizawa's 2023 weak solution showing a draw — has no
analogous published proof for the anti-variant. The misère nature of the game
inverts the usual evaluations; opening theory is markedly different.

## Consensus on optimal play

- **Avoid flipping big groups** — in normal Othello you want to flip many discs at once. In Anti-Reversi, large flips put more discs in your color, which is bad. Prefer moves that flip as few discs as possible.
- **Give up edge and corner squares** — in normal Othello, corners are gold. Here, landing on a corner locks your disc there forever (it can never be flipped back), which hurts you. Avoid corners unless you have no other choice.
- **Try to have fewer discs throughout the game, not just at the end** — disc counts can change a lot near the end with big flips. Having fewer discs in the middle of the game is usually good.
- **Force the opponent to flip your discs** — set up positions where the opponent's only legal moves turn your discs into their color (helping you).
- **Who gets the last move still matters** — just like normal Othello, the final sequence of moves often decides the game. Making the last move in each area can determine who gets stuck with a big group of discs.

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
