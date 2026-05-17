# Brandubh

> A small Irish tafl (Viking board game) on a 7×7 board. Small enough for endgame databases, but no formal solution has been published.

| Field | Value |
|-------|-------|
| Also known as | Brandub, Brandubh (one of the *hnefatafl* / tafl family) |
| Players | 2 (asymmetric: attackers vs. king's defenders) |
| Type | Partisan asymmetric capture game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Partially solved / analysed (no published full solution) **[verify]** |
| **Game-theoretic value** | Unknown (rule-set dependent) **[verify]** |
| Year solved | — |
| Solved by | — |
| State-space complexity | Moderate |
| Game-tree complexity | Moderate |
| **Playable** | brandubh |

## Description

Brandubh is the smallest widely-played tafl (Viking board game) variant. It is
played on a 7×7 board with a center square (the "throne") and four corner
squares. One player is the **defender**, with a king plus 4 soldiers. The other
is the **attacker**, with 8 soldiers. All pieces move like a rook in chess (any
number of squares up, down, left, or right). To capture, you sandwich an enemy
piece between two of your pieces (this is called "custodial capture"). The king
wins by reaching a corner square. The attackers win by capturing the king. Like
all tafl games, the original rules were not fully recorded, so several modern
rule sets exist.

## Solution status

Brandubh is **not formally solved** in the literature, though its 7×7 board makes
it the most tractable tafl variant — small enough that endgame retrograde
databases and strong solvers are feasible, and several tafl-community analyses
report particular rule sets as decisive wins for one side. As with [Tablut](tablut.md),
**rule ambiguity** is the central problem: there is no single canonical Brandubh
whose value could be quoted. Treat any specific value claim as **[verify]**
pending a peer-reviewed solution of a clearly stated rule set.

## Consensus on optimal play

- **Defenders: break out early** — the king wins by reaching a corner, not by just surviving. Moving aggressively toward a corner early puts the attacker on defense and is generally the stronger strategy.
- **Attackers: seal off the diagonals** — the four corners are the king's only escape routes. Attackers must block the diagonal paths to the corners while also setting up captures around the king.
- **Forks decide close games** — a piece that can capture two enemy pieces at once (by threatening to sandwich either one) either wins material or forces the opponent into a bad move.
- **The throne helps and hurts defenders** — the throne counts as a friendly piece for trapping the king when the king is next to it (in most rule sets), but the king cannot always re-enter it. Know your exact rules about throne interactions.
- **Balance depends on the rules** — the small board means small rule differences (like how corner entry works) can change everything. Opening moves that are strong in one rule set may be losing in another.

## Engines & current best play

- **Strongest known program(s):** No widely-distributed dedicated Brandubh engine known to the cataloguer. Playable in general-purpose abstract-game frameworks (e.g., [Ludii](https://ludii.games/)); the competitive tafl community uses custom programs for analysis.
- **Strength:** Not benchmarked publicly.
- **Notes:** Brandubh's 7×7 board makes full retrograde analysis computationally feasible; informal community analyses exist for specific rule sets, but no peer-reviewed solution of a canonical rule set has been published.

## Complexity

Moderate — the 7×7 board and small piece count put full retrograde analysis of
fixed rule sets within computational reach, even though none has been formally
published as a solution.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Brandubh) ([archive](http://web.archive.org/web/20210126053031/http://en.wikipedia.org/wiki/Brandubh))
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002) (general framework)

## See also

- [Tablut](tablut.md) · [Fox and Geese](fox-and-geese.md)
- Lexicon: [retrograde analysis](../lexicon/README.md#retrograde-analysis) · [partisan game](../lexicon/README.md#partisan-game)
