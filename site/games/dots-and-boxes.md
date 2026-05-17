# Dots and Boxes

> A childhood classic with surprisingly deep theory — solved for small grids,
> open in general.

| Field | Value |
|-------|-------|
| Also known as | Dots and Boxes, La Pipopipette, Boxes |
| Players | 2 |
| Type | Scoring game (last-move structure with capture) |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Partially solved (small boards solved exactly) |
| **Game-theoretic value** | Known for small boards; e.g. analysed exhaustively up to roughly the 4×5-box grid |
| Year solved | Ongoing; theory from Berlekamp, exact solutions by computer |
| Solved by | Elwyn Berlekamp (theory); David Wilson and others (exact small-board solutions) |
| State-space complexity | ~10^? — grows extremely fast with grid size |
| Game-tree complexity | Grows extremely fast with grid size |
| **Playable** | dots-and-boxes |

## Description

On a grid of dots, players alternately draw one unit edge between adjacent dots.
Completing the fourth side of a 1×1 box scores that box **and grants another
move**. When all boxes are claimed, the player with more boxes wins.

## Solution status

Dots and Boxes is **partially solved**. The standard competition boards (e.g.
5×5 boxes) are **not** solved. However:

- **Small boards are solved exactly.** Exhaustive computer analysis (notably
  David Wilson's) has determined the optimal result for grids up to around the
  4×5-box size, and selected larger cases.
- **A deep partial theory exists.** [Berlekamp's](../references.md#berlekamp-dotsandboxes2000)
  analysis recasts the endgame as a *Nimber* / loony-endgame theory built on the
  **long-chain rule** and the strategic device of the *double-cross*. This does
  not solve the game, but it gives strong, often provably optimal, endgame play
  and explains why parity of long chains dominates expert play.

So Dots and Boxes sits between "solved" and "unsolved": rigorous for small
boards and for endgames, open for full-size competition play.

## Consensus on optimal play

- **Avoid completing the third side of any box until forced** — drawing the third side "opens" a chain for the opponent to sweep; expert play delays entering chains as long as possible and aims to force the opponent to open them.
- **Count long chains and control their parity** — a "long chain" is a sequence of 3+ boxes that, once opened, can all be captured in one turn; Berlekamp's long-chain rule: if the number of long chains is odd, the first player wins (in normal play); use this parity count to guide your moves.
- **Use the double-cross sacrifice to control chain parity** — when forced to give up a chain, you can sacrifice two boxes by leaving a "double-cross" (cross instead of completing the end of the chain); this hands the opponent two boxes but lets you close the chain yourself and take the rest, while changing the chain-parity count in your favour.
- **Never take a 3-chain without considering the sacrifice** — automatically sweeping a 3-box chain may give your opponent the winning parity; the sacrifice (give 2, take the rest) is often the correct play to maintain favourable chain parity.
- **In the opening, create loops not chains** — closed loops are harder to exploit offensively than open chains; preferring loop-forming moves over chain-creating moves in the midgame gives more endgame flexibility.

## Engines & current best play

- **Strongest known program(s):** Various research programs implementing Berlekamp's chain-parity theory with alpha-beta search; David Wilson's solver for small boards.
- **Strength:** Perfect on small boards (up to ~4×5); strong (but not provably optimal) on larger boards using chain-parity heuristics.
- **Where the proof / tablebase lives (if solved):** [Berlekamp (2000)](../references.md#berlekamp-dotsandboxes2000); small-board exact solutions by David Wilson (unpublished/circulated).
- **Notes:** Dots and Boxes is deceptively deep; Berlekamp's chain-parity theory shows that expert endgame play is essentially nim-like, but the opening and midgame of large boards remain open research questions.

## Complexity

State space grows roughly as 3^(number of edges); full-size boards are far
beyond exhaustive search.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Dots_and_Boxes) ([archive](http://web.archive.org/web/20260503203320/https://en.wikipedia.org/wiki/Dots_and_boxes))
- [Berlekamp, E. R. (2000). *The Dots and Boxes Game: Sophisticated Child's Play*.](../references.md#berlekamp-dotsandboxes2000)
- [Berlekamp, Conway & Guy (2001). *Winning Ways for Your Mathematical Plays*.](../references.md#bcg2001)

## See also

- [Nimber theory via Nim](nim.md) · [Sprouts](sprouts.md)
- Lexicon: [temperature / hot game](../lexicon/README.md#temperature--hot-game) · [partially solved](../lexicon/README.md#solved-game)
