# Checkers (English draughts)

> The most complex game ever weakly solved — eighteen years of computation
> ending in a single word: draw.

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

## Description

Played on the 32 dark squares of an 8×8 board, 12 pieces per side. Men move and
capture diagonally forward; captures are **compulsory**; reaching the far rank
makes a king, which moves and captures diagonally in any direction.

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

- **Hold the centre** — central squares (especially the "dog hole" squares d4/e5) control more diagonal lines than edge squares; a piece in the centre limits the opponent's manoeuvre options significantly.
- **Maintain piece count parity; compulsory captures can be traps** — because all captures are mandatory, setting up a multi-jump sequence where you sacrifice one piece to capture two is a standard tactic; always check whether your intended move exposes you to a forced recapture chain.
- **Promote kings without losing the back row** — a king is far stronger than a man; race to promote while keeping enough back-rank men to prevent opponent promotions; letting the opponent king up freely loses quickly.
- **King mobility dominates endgames** — in king vs. king endings, the player whose king can reach the centre diagonal faster usually wins; triangulation (wasting moves to put the opponent in zugzwang) is a key technique.
- **Avoid the "single-corner" trap** — a common tactical motif is forcing the opponent's king into a corner where it can only oscillate between two squares while your pieces tighten the net; recognise this pattern both to execute and to escape it.
- **Draw technique: 3-2 or 2-1 king endings** — with correct play by the defender, many king-heavy endings are draws by repeated position; knowing the exact drawing moves in these endings avoids needless losses.

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
