# Tablut

> A Sámi member of the asymmetric tafl family — strong programs and endgame
> databases exist, but the standard game has no published formal solution.

| Field | Value |
|-------|-------|
| Also known as | Sáhkku-adjacent tafl variant; one of the *hnefatafl* family |
| Players | 2 (asymmetric: attackers vs. king's defenders) |
| Type | Partisan asymmetric capture game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Partially solved / strongly analysed (no published full solution) |
| **Game-theoretic value** | Unknown (rule-set dependent) |
| Year solved | — |
| Solved by | — |
| State-space complexity | Large (rule-set dependent) |
| Game-tree complexity | Large |

## Description

Played on a 9×9 board. The **defender** controls a king on the central throne
plus 8 soldiers; the **attacker** controls 16 soldiers around the edges. All
pieces move like a rook. Pieces are captured by being sandwiched between two
enemies (custodial capture). The king wins by reaching the board edge (or a
corner, depending on the rule set); the attackers win by capturing the king.
Tablut is the variant Linnaeus recorded among the Sámi in 1732, and the modern
tafl revival largely descends from it — but the surviving rules are incomplete,
so many incompatible rule sets exist.

## Solution status

Tablut is **not formally solved**. The biggest obstacle is not only size but
**rule ambiguity**: the historical record is incomplete, and the game-theoretic
value depends heavily on which edge/corner-win and king-armament rules are used —
several rule sets are known to be lopsided wins for one side. Strong AI players
and endgame tablebases exist for particular rule sets (and Tablut is a common
test bed for game-AI competitions), but no peer-reviewed weak or strong solution
of a standard Tablut has been published.

## Consensus on optimal play

- **Attackers must build a full blockade** — with 16 pieces surrounding a 9×9 board, attackers win by encircling the king so it has no clear path to the edge; a partial blockade that leaves a single corridor will fail.
- **Defenders prioritise king mobility over piece count** — keeping the king able to move in at least two directions is more important than saving individual soldiers; trapped defenders should sacrifice pieces to open king routes.
- **Custodial chains create tempo** — moving a single piece to complete a custodial sandwich removes an enemy piece and threatens others; attackers should stage pieces so each advancing move threatens or completes a capture.
- **Corner squares (if they win) demand immediate control** — under rule sets where the king wins by reaching a corner, defenders should aim for the nearest corner from the opening; attackers must post pieces on the two squares adjacent to each corner immediately.
- **Rule-set awareness is paramount** — whether the king needs a corner or an edge, whether the king is "armed" (can participate in captures), and whether the throne blocks movement all change optimal strategy substantially; confirm the rule set before applying any opening theory.

## Engines & current best play

- **Strongest known program(s):** Humans and AI bots (e.g., Hnefatafl AI by Martin Windisch and entries in computer-tafl tournaments) — alpha-beta search with endgame databases for specific rule sets.
- **Strength:** Strong amateur to competitive; engines dominate recreational play under fixed rule sets.
- **Where the proof / tablebase lives (if solved):** Partial endgame tablebases for reduced-material Tablut positions; no full-game solution published.
- **Notes:** Tablut's game-theoretic value is rule-set dependent and no single "standard" rule set is universally accepted, making a definitive solution elusive.

## Complexity

Large — comparable to other 9×9 capture games; well beyond hand analysis,
though small enough that endgame retrograde databases are feasible for reduced
material.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Tafl_games) ([archive](http://web.archive.org/web/20260404190502/https://en.wikipedia.org/wiki/Tafl_games))
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002) (general framework)

## See also

- [Brandubh](brandubh.md) · [Fox and Geese](fox-and-geese.md)
- Lexicon: [partisan game](../lexicon/README.md#partisan-game) · [first-player advantage](../lexicon/README.md#first-player-advantage)
