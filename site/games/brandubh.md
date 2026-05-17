# Brandubh

> The small Irish tafl game on a 7×7 board — compact enough for endgame
> databases, but with no published formal solution of the standard rules.

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

The smallest widely-played tafl variant: a 7×7 board with a central throne and
four corner squares. The **defender** has a king plus 4 soldiers; the
**attacker** has 8 soldiers. All pieces move like a rook; captures are custodial
(sandwiching an enemy between two friendly pieces). The king wins by reaching a
corner; the attackers win by capturing the king. As with all tafl games, the
historical rules are incompletely recorded, so several modern rule sets coexist.

## Solution status

Brandubh is **not formally solved** in the literature, though its 7×7 board makes
it the most tractable tafl variant — small enough that endgame retrograde
databases and strong solvers are feasible, and several tafl-community analyses
report particular rule sets as decisive wins for one side. As with [Tablut](tablut.md),
**rule ambiguity** is the central problem: there is no single canonical Brandubh
whose value could be quoted. Treat any specific value claim as **[verify]**
pending a peer-reviewed solution of a clearly stated rule set.

## Consensus on optimal play

- **Defenders: break out early** — the king wins by reaching a corner, not by surviving indefinitely; early aggressive movement toward a corner puts the attacker on the back foot and is generally considered the stronger defensive strategy.
- **Attackers: seal the diagonals** — the four corners are the king's only escape; attackers must cover the diagonal corridors leading to corners while simultaneously building a custodial capture threat around the king.
- **Custodial forks decide close games** — a piece that simultaneously threatens to sandwich two different enemy pieces (a custodial fork) either wins material or forces the opponent into a losing repositioning.
- **The throne is a double-edged asset for defenders** — the throne counts as a friendly piece for capturing the king when the king is adjacent to it (under most rule sets), but the king cannot re-enter it under some rules; know your rule set's throne interactions precisely.
- **Balance is rule-set-sensitive** — the small board makes Brandubh highly sensitive to exact rules about shieldwall capture, corner entry, and throne mechanics; opening moves that are strong under one rule set may be losing under another.

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
