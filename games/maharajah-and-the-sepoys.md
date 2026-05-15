# Maharajah and the Sepoys

> An asymmetric chess variant: one super-piece against a full army. The army
> wins.

| Field | Value |
|-------|-------|
| Also known as | The Maharajah and the Sepoys, Shatar (loosely related variants) |
| Players | 2 (asymmetric) |
| Type | Partisan board game (asymmetric chess variant) |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Weakly solved |
| **Game-theoretic value** | Second player (the Sepoys) wins with correct play |
| Year solved | Folklore / classical analysis |
| Solved by | Folklore; the winning method is a well-known classical result |
| State-space complexity | Small relative to chess (one side has a single piece) |
| Game-tree complexity | Modest |

## Description

An asymmetric chess variant. One player has a **full standard chess army** (the
"Sepoys"); the other has a **single piece**, the **Maharajah**, which moves as a
combined Queen + Knight (an "amazon"). The Maharajah wins by capturing the enemy
king; the Sepoys win by capturing the Maharajah. The Sepoys move first.

## Solution status

Maharajah and the Sepoys is **weakly solved**, and the result is a classical
piece of chess-variant folklore: **the Sepoys win with correct play.** The
Maharajah, however powerful as a single piece, cannot survive against a
coordinated full army that simply advances its pawns in a connected phalanx and
never leaves the Maharajah a profitable capture. The standard winning method is
well known and humanly executable: keep pawns mutually defended, advance the
wall, and the Maharajah is eventually trapped.

The Sepoys must avoid careless captures — a single undefended piece can let the
Maharajah equalise material — which is why the result is "weakly solved with
correct play" rather than "trivially won."

## Consensus on optimal play

- **Sepoys: advance pawns in a mutually defended wall** — never leave a pawn undefended; the Maharajah can afford one capture that equalises material; a defended pawn-phalanx denies all such opportunities and slowly compresses the Maharajah's space.
- **Sepoys: do not rush pieces forward singly** — pieces advanced alone become targets for the Maharajah's Amazon (queen+knight) move; bring the whole army forward together, subordinating individual activity to collective safety.
- **Maharajah: fork whenever possible** — the Amazon's combined queen and knight reach makes two-attack forks against undefended Sepoy pieces the only realistic path to material gain; look for cells the Amazon can reach that attack two pieces simultaneously.
- **Maharajah: avoid the edge** — the Amazon is weakest near the board edge where its mobility is cut in half; stay central to maximise threat range and escape paths.
- **Sepoys: trade material freely except for pawns** — giving up a piece to keep the pawn wall intact is usually correct; pawns form the impenetrable front that drives the Maharajah into a corner.
- **Maharajah: stalemate is a draw** — if the Sepoys leave no legal move for the Maharajah (without capturing it), the game is drawn; as the Maharajah player, steer toward positions with minimal legal squares and hope for a stalemate error.

## Engines & current best play

- **Strongest known program(s):** No dedicated public engine; any chess-variant program (e.g., Fairy-Stockfish with Amazon piece) can play this correctly.
- **Strength:** Sepoys win with correct play; optimal Sepoy strategy is humanly teachable.
- **Where the proof / tablebase lives (if solved):** Classical folklore; see [Wikipedia](https://en.wikipedia.org/wiki/Maharajah_and_the_Sepoys) for a summary of the winning method.
- **Notes:** A demonstration game rather than a competitive one; the Sepoy win is well-known in chess-variant circles as a teaching example in piece coordination.

## Complexity

Small by chess standards — one side has a single piece, sharply limiting
branching.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Maharajah_and_the_Sepoys) ([archive](http://web.archive.org/web/20251207100534/https://en.wikipedia.org/wiki/Maharajah_and_the_Sepoys))
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002) (general framework)

## See also

- [Chess](chess.md) · [Fox and Geese](fox-and-geese.md) · [Hare and Hounds](hare-and-hounds.md)
- Lexicon: [weakly solved](../lexicon/README.md#weakly-solved) · [first-player advantage](../lexicon/README.md#first-player-advantage)
