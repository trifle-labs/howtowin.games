# Tigers and Goats (Bagh-Chal)

> The Nepalese hunt game — strong computer analysis exists and the value is
> widely believed to be a draw, but no fully published formal solution.

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

## Description

Played on a 5×5 grid of points with diagonals (the traditional *aadu puli*
board). Four **tigers** begin on the corners; the **goat** player has 20 goats,
entered one per turn in an opening "placement" phase. Tigers move along lines and
capture a goat by jumping it (as in draughts); goats never move during placement
and never capture. Tigers win by capturing enough goats (commonly 5); goats win
by immobilising all four tigers.

## Solution status

Tigers and Goats is **not formally solved** in the published literature, but it
has been heavily analysed: the state space (~10^9) is small enough that strong
programs with endgame databases play it essentially perfectly, and the
widely-reported result is that **the game is a draw** with best play — goats can
avoid fatal captures, tigers can avoid being fully trapped. This is engine
consensus rather than a peer-reviewed proof; treat the value as **[verify]**.

## Consensus on optimal play

- **Goats: place to block jump lanes in the placement phase** — during the opening 20 goat placements, avoid ever leaving a goat on a point where a tiger can jump over it; no goat should be placed with an empty escape cell behind it on the tiger's attack line.
- **Goats: build a dense wall to trap tigers** — cluster goats along one or two rows to progressively restrict tiger mobility; the win condition for goats is full tiger immobilisation, so systematic encirclement beats piecemeal defence.
- **Tigers: attack immediately during placement** — tigers can move (and capture) from the very first turn; aggressive early jumps force goats into defensive placements rather than the ideal blockade pattern.
- **Tigers: keep multiple attack directions open** — a tiger cornered with no jump available and only one move is already effectively trapped; maintain at least two possible jump lines for each tiger.
- **Goats: 5-capture loss is a hard cliff** — once 5 goats are captured the tigers win; a goat player who tolerates 3 or 4 captures must play near-perfectly for the rest of the game; avoid any capture in the mid-game.
- **Sacrifice placement to maintain blockade integrity** — occasionally placing a goat in a suboptimal square to patch a jump lane is correct; a live goat in a non-ideal spot is better than a gap that lets a tiger roam freely.

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
