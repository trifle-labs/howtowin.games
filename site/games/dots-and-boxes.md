# Dots and Boxes

> A childhood classic with surprisingly deep strategy. Solved for small grids, open for large ones.

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

On a grid of dots, players take turns drawing one line between two neighboring
dots. If you draw the fourth side of a 1×1 box, you claim that box **and get
another turn**. When all boxes are claimed, the player with more boxes wins.

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

- **Avoid drawing the third side of any box until you have to** — drawing the third side "opens" a chain for the opponent to take. Expert players delay opening chains as long as possible and try to force the opponent to open them instead.
- **Count long chains and control whether they are odd or even** — a "long chain" is a line of 3 or more connected boxes that, once opened, can all be taken in one turn. Berlekamp's rule: if the number of long chains is odd, the first player wins. Use this count to guide your moves.
- **Use the double-cross sacrifice to control chain count** — when forced to give up a chain, you can sacrifice two boxes by leaving what is called a "double-cross." This gives the opponent two boxes but lets you close the chain yourself and take the rest, while changing the chain count in your favor.
- **Never take a 3-chain without thinking about the sacrifice** — automatically taking a 3-box chain may give the opponent the winning chain count. The sacrifice (give 2, take the rest) is often the right move to keep the chain count favorable.
- **In the opening, create loops instead of chains** — closed loops are harder for the opponent to exploit. Preferring loop-forming moves over chain-creating moves in the midgame gives you more endgame flexibility.

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
