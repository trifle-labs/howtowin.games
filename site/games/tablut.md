# Tablut

> An asymmetric Viking-style board game where one side tries to protect a king and the other side tries to capture it. It has not been formally solved.

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
| **Playable** | tablut |

## Description

Played on a 9x9 board. The defender controls a king on the central square plus 8 soldiers. The attacker controls 16 soldiers around the edges. All pieces move any number of squares up, down, left, or right (like a rook in chess). A piece is captured when it is sandwiched between two enemies (called custodial capture). The king wins by reaching the edge of the board (or a corner, depending on the rules). The attackers win by capturing the king. Tablut is the version recorded by the naturalist Linnaeus among the Sámi people in 1732, and most modern tafl games are based on it — but the historical rules are incomplete, so many different rule sets exist.

## Solution status

Tablut is **not formally solved**. The biggest obstacle is not only size but
**rule ambiguity**: the historical record is incomplete, and the game-theoretic
value depends heavily on which edge/corner-win and king-armament rules are used —
several rule sets are known to be lopsided wins for one side. Strong AI players
and endgame tablebases exist for particular rule sets (and Tablut is a common
test bed for game-AI competitions), but no peer-reviewed weak or strong solution
of a standard Tablut has been published.

## Consensus on optimal play

- **Attackers must build a full blockade** — with 16 pieces surrounding a 9x9 board, the attackers win by encircling the king so it has no clear path to the edge. A partial blockade that leaves one open path will fail.
- **Defenders should value king movement over saving pieces** — keeping the king able to move in at least two directions is more important than protecting individual soldiers. Sacrifice defending pieces if it opens a route for the king.
- **Set up capture chains as the attacker** — moving a single piece to complete a sandwich capture removes an enemy piece and threatens others. Attackers should position pieces so every forward move threatens or completes a capture.
- **Control corner squares immediately (if corners win)** — under rules where the king wins by reaching a corner, defenders should head for the nearest corner from the start. Attackers must place pieces on the two squares next to each corner right away.
- **Know which rule set you are using** — whether the king needs a corner or an edge, whether the king can capture enemy pieces, and whether the central throne blocks movement all change the best strategy. Confirm the rules before applying any opening theory.

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
