# Checkers (English draughts)

> The most complex game ever solved. After 18 years of computation, the answer is one word: draw.

| Field | Value |
|-------|-------|
| Also known as | English draughts, American checkers |
| Players | 2 |
| Type | Partisan board game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Weakly solved |
| **Game-theoretic value** | Draw |
| Year solved | 2007 |
| Solved by | Jonathan Schaeffer and the Chinook team (University of Alberta) |
| State-space complexity | ~5 × 10^20 |
| Game-tree complexity | ~10^31 |
| **Playable** | checkers |

## Description

Played on the 32 dark squares of an 8×8 board, with 12 pieces per side. Regular
pieces (called "men") move one square forward diagonally and capture by jumping
over enemy pieces diagonally forward. Captures are **required** — if you can
capture, you must. When a man reaches the opponent's back row, it becomes a
king, which can move and capture diagonally in any direction (forward or
backward).

## Solution status

Checkers is **weakly solved**. [Schaeffer et al. (2007)](../references.md#schaeffer2007),
publishing in *Science*, proved that **with perfect play the game is a draw**.
The proof combined two halves that met in the middle:

- a complete endgame [tablebase](../lexicon/README.md#endgame-tablebase) for all
  positions with ≤10 pieces (~3.9 × 10^13 positions), built by
  [retrograde analysis](../lexicon/README.md#retrograde-analysis); and
- a forward [proof-number search](../lexicon/README.md#proof-number-search) from
  the opening that drove every relevant line into the tablebase.

The computation ran (with interruptions) from 1989 to 2007. At ~5 × 10^20 legal
positions, checkers was — and for many years remained — the most complex game
to be solved. The Chinook program had already become the first machine to win a
human World Championship match (1994); the 2007 result proved it could never,
even in principle, be beaten.

## Consensus on optimal play

- **Control the center** — central squares (especially the "dog hole" squares d4 and e5) give you more diagonal options than edge squares. A piece in the center limits the opponent's movement.
- **Keep piece count even; forced captures can be traps** — since captures are required, setting up a multi-jump where you sacrifice one piece to take two is a standard trick. Always check if your move leaves you open to a forced chain of captures.
- **Get kings without giving up your back row** — a king is much stronger than a regular piece. Race to promote while keeping enough men on your back row to stop the opponent from promoting. Letting the opponent get a king for free loses quickly.
- **King movement decides endgames** — when only kings are left, whoever can reach the center diagonal faster usually wins. Using moves that force the opponent into a bad position is a key technique.
- **Watch for the "single-corner" trap** — a common trick is forcing the opponent's king into a corner where it can only move back and forth between two squares while your pieces close in. Learn to spot this pattern both to use it and to escape it.
- **Know your drawing techniques: 3-2 and 2-1 king endings** — with correct defense, many king-heavy endings are draws through repeated positions. Knowing the exact drawing moves in these endings prevents unnecessary losses.

## Engines & current best play

- **Strongest known program(s):** Chinook ([research page](https://webdocs.cs.ualberta.ca/~chinook/) ([archive](http://web.archive.org/web/20260424021226/https://webdocs.cs.ualberta.ca/~chinook/))) — alpha-beta with a complete endgame tablebase; weakly solved the game.
- **Strength:** Perfect play available via the proof (draw from initial position); endgame tablebase covers all positions ≤10 pieces.
- **Where the proof / tablebase lives (if solved):** [Schaeffer et al. (2007)](../references.md#schaeffer2007); tablebase at the University of Alberta Chinook project page.
- **Notes:** Chinook became World Checkers Champion in 1994 and proved the draw result in 2007 after 18 years of computation; no human or program can beat the tablebase in the solved endgame positions.

## Complexity

State-space ~5 × 10^20; game-tree ~10^31
([Schaeffer et al., 2007](../references.md#schaeffer2007)).

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/English_draughts) ([archive](http://web.archive.org/web/20260310161143/https://en.wikipedia.org/wiki/English_draughts))
- [Schaeffer, J. et al. (2007). *Checkers Is Solved*.](../references.md#schaeffer2007)
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)

## See also

- [International draughts](international-draughts.md) · [Fanorona](fanorona.md) · [Lasca](lasca.md) · [Othello](othello.md)
- Lexicon: [weakly solved](../lexicon/README.md#weakly-solved) · [retrograde analysis](../lexicon/README.md#retrograde-analysis) · [proof-number search](../lexicon/README.md#proof-number-search)
