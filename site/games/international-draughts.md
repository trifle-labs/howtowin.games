# International draughts

> Draughts on a 10×10 board with flying kings — much bigger than English
> checkers, and unsolved.

| Field | Value |
|-------|-------|
| Also known as | Polish draughts, 10×10 draughts |
| Players | 2 |
| Type | Partisan board game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Unsolved (endgame tables computed) |
| **Game-theoretic value** | Unknown (widely believed to be a draw) |
| Year solved | — |
| Solved by | — |
| State-space complexity | ~10^30 |
| Game-tree complexity | ~10^54 |
| **Playable** | international-draughts |

## Description

Played on the 50 dark squares of a 10×10 board, 20 pieces per side. Men capture
both forward and backward; captures are compulsory and the **maximum capture**
must be taken; kings are "flying" — they move and capture any distance along a
diagonal. These rules make captures long and forcing.

## Solution status

International draughts is **unsolved**. It is roughly **ten orders of magnitude
larger** than [English checkers](checkers.md) (~10^30 vs ~5 × 10^20 positions),
which puts a checkers-style weak solution well out of current reach. Substantial
**endgame tablebases** have been computed (covering positions up to several
pieces), giving exact solutions to those sub-games and supporting very strong
engine play; competitive games between top humans and engines draw at a very
high rate. But the game-theoretic value of the standard opening has not been
proven.

## Consensus on optimal play

- **Maximum-capture obligation is a tactical fulcrum** — you must take the largest number of pieces in a capture sequence; skilled play involves setting up "shots" that force the opponent into a long capture that leaves their pieces badly positioned after it completes.
- **Flying kings control the long diagonals** — a king on an open diagonal threatens pieces at any range and restricts the opponent's movement; centralise kings to long diagonals that cross the board.
- **Guard against backwards captures on your men** — unlike English checkers, men must capture backwards; leaving a man that can be captured backwards while extending your own chain weakens your structure.
- **Endgame: king vs. two or three men is tablebase-decided** — many such endings are well-studied; knowing the theoretical outcome from your endgame tables prevents wasting moves in drawn or lost positions.
- **Avoid isolated men on the wings** — wing pieces are harder to retreat to safety and easier to surround; maintain a connected front that can shift laterally.
- **Tempo in the opening determines midgame piece activity** — losing tempo by retreating or making obligatory bad captures early lets the opponent seize the long diagonals; opening systems focus on compact, tempo-preserving development.

## Engines & current best play

- **Strongest known program(s):** Kingsrow International (Ed Trice variant), Damage, and Tornado — all use alpha-beta search with extensive endgame tablebases.
- **Strength:** Super-human; engines vastly exceed top human play at elite time controls.
- **Where the proof / tablebase lives (if solved):** Endgame tablebases computed for positions up to roughly 6–8 pieces; game-theoretic value of starting position unproven.
- **Notes:** Elite human-vs-engine matches draw at very high rates, reinforcing the consensus that the starting position is drawn, though this is not proven.

## Complexity

State-space ~10^30; game-tree ~10^54
([van den Herik et al., 2002](../references.md#vandenherik2002)).

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/International_draughts) ([archive](http://web.archive.org/web/20260511121115/https://en.wikipedia.org/wiki/International_draughts))
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)
- [Schaeffer, J. et al. (2007). *Checkers Is Solved*.](../references.md#schaeffer2007) (the smaller, solved cousin)

## See also

- [Checkers (English draughts)](checkers.md) · [Fanorona](fanorona.md) · [Lasca](lasca.md)
- Lexicon: [endgame tablebase](../lexicon/README.md#endgame-tablebase) · [solving vs. strong play](../lexicon/README.md#solving-vs-strong-play)
