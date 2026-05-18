# Tigers and Goats (Bagh-Chal)

> An asymmetric hunt game from Nepal where four tigers try to capture goats, and twenty goats try to trap the tigers. It is believed to be a draw with perfect play.

| Field | Value |
|-------|-------|
| Also known as | Bagh-Chal, Bagha-Chall, "Tigers and Goats" |
| Players | 2 (asymmetric: 4 tigers vs. 20 goats) |
| Type | Partisan hunt game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Partially solved / analysed (value believed drawn) **[verify]** |
| **Game-theoretic value** | Believed a draw with perfect play **[verify]** |
| Year solved | — |
| Solved by | — (strong solvers and endgame analysis exist) |
| State-space complexity | ~10^9 positions |
| Game-tree complexity | Moderate |
| **Playable** | tigers-and-goats |

## Description

Played on a 5x5 grid of points with diagonals included. Four tigers start on the corners. The goat player has 20 goats, entered one per turn in a placement phase. Tigers move along lines and capture a goat by jumping over it (like in checkers). Goats never move during placement and never capture. Tigers win by capturing enough goats (usually 5). Goats win by trapping all four tigers so they cannot move.

## Solution status

Tigers and Goats is **not formally solved** in the published literature, but it
has been heavily analysed: the state space (~10^9) is small enough that strong
programs with endgame databases play it essentially perfectly, and the
widely-reported result is that **the game is a draw** with best play — goats can
avoid fatal captures, tigers can avoid being fully trapped. This is engine
consensus rather than a peer-reviewed proof; treat the value as **[verify]**.

## Consensus on optimal play

- **Goats: block jump paths during placement** — during the opening 20 placements, do not leave a goat where a tiger can jump over it. Every goat should have its escape route blocked behind it along the tiger's attack line.
- **Goats: build a dense wall to trap tigers** — cluster goats along one or two rows to slowly restrict the tigers' movement. Goats win by fully trapping the tigers, so systematic encirclement works better than scattered defense.
- **Tigers: attack right away during placement** — tigers can move and capture from the very first turn. Aggressive early jumps force the goat player to place defensively instead of building their ideal blockade.
- **Tigers: keep multiple attack directions open** — a tiger with no jump available and only one way to move is already nearly trapped. Keep at least two possible jump paths for each tiger.
- **Goats: do not let the tigers capture 5 goats** — once 5 goats are captured, the tigers win. If you let 3 or 4 goats get captured, you must play nearly perfectly for the rest of the game. Avoid any capture in the mid-game.
- **Sacrifice placement to keep the blockade intact** — placing a goat in a less-than-ideal spot to close a jump path is usually correct. A live goat in a non-ideal spot is better than a gap that lets a tiger roam free.

## Engines & current best play

- **Strongest known program(s):** Bagh-Chal solvers with endgame databases (several implementations exist, including Android apps and board-game sites); alpha-beta search with retrograde endgame tables.
- **Strength:** Near-perfect play; engines are vastly stronger than human players on both sides.
- **Where the proof / tablebase lives (if solved):** No peer-reviewed full-game solution published; engine consensus value is draw. See also [../references.md#vandenherik2002](../references.md#vandenherik2002).
- **Notes:** The ~10⁹ state space is within reach of full retrograde analysis; a formal proof would be publishable but has not appeared in the literature as of this writing.

## Complexity

State-space on the order of 10^9 — within reach of exhaustive retrograde
analysis, which is why play is effectively perfect even absent a formal
publication.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Bagh-Chal)
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002) (general framework)

## See also

- [Fox and Geese](fox-and-geese.md) · [Hare and Hounds](hare-and-hounds.md) · [Konane](konane.md)
- Lexicon: [retrograde analysis](../lexicon/README.md#retrograde-analysis) · [strong play vs. solving](../lexicon/README.md#solving-vs-strong-play)
