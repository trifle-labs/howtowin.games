# Songo

> A West African seed-sowing game where capturing seeds is required whenever possible.

| Field | Value |
|-------|-------|
| Also known as | Songo, Soro (regional names) **[verify]** |
| Players | 2 |
| Type | Partisan mancala |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Unsolved |
| **Game-theoretic value** | Unknown |
| Year solved | — |
| Solved by | — |
| State-space complexity | Moderate–large |
| Game-tree complexity | Moderate–large |
| **Playable** | songo |

## Description

Songo is a West African mancala game in the broader Awari/Oware family. It is played on a board with two rows of six pits each. Different regions have different rules for sowing seeds, capturing, and ending the game.

## Rules

1. Board: 6 pits per side, with no large home stores (captured seeds are kept off the board by each player).
2. Each pit starts with 4 seeds.
3. On a turn, the player picks up all seeds from one of their own pits and sows (distributes) them counterclockwise, one seed per pit, including across the opponent's row.
4. Capture: if the last seed sown lands in an opponent's pit and brings the count there to 2 or 3, those seeds are captured. Captures also spread backward to previous opponent pits that also reach 2 or 3.
5. A move that would leave the opponent with no seeds at all is illegal unless no other move is available.
6. The game ends when one side cannot move. The player with the most captured seeds wins.

## Solution status

Songo is **not solved**. Several variants are mathematically close to Awari
(which has been solved by Romein & Bal as a draw), but Songo's specific
ruleset has no published value.

## Consensus on optimal play

- **Keep the opponent's pits thin** — stopping the opponent from building large seed piles reduces their capture threats. Spreading their seeds thinly limits their options.
- **Keep seeds flowing on your side** — if you empty too many of your own pits, you will run out of legal moves. Try to keep at least two or three pits with seeds.
- **Set up capture chains backward from the landing pit** — the rule that captures spread backward rewards landing your last seed in a pit that turns a chain of pits with 2 or 3 seeds on the opponent's side. Plan the full chain before you move.
- **Do not starve the opponent early** — moves that would leave the opponent with no seeds are illegal unless no other move is possible. Learn which setups force this situation so you can steer toward it late in the game.
- **Endgame: count seeds, not moves** — once most pits are thinly seeded, having more captured seeds overall matters more than making the "best" positional move.

## Engines & current best play

- **Strongest known program(s):** No game-specific public engine known to the cataloguer. Playable in general-purpose abstract-game frameworks (e.g., [Ludii](https://ludii.games/)).
- **Strength:** Not benchmarked.
- **Where the proof / tablebase lives (if solved):** —
- **Notes:** Songo's specific ruleset has no published solution; the closely related Awari was solved (draw) by Romein & Bal (2003).

## Complexity

Moderate.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Mancala) ([archive](http://web.archive.org/web/20260509062903/https://en.wikipedia.org/wiki/Mancala))
- [Romein & Bal (2003). *Awari is Solved*.](../references.md#romein-bal2003) (related)
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)

## See also

- [Awari](awari.md) · [Oware](awari.md) · [Bao](bao.md) · [Kalah](kalah.md)
- Lexicon: [partisan game](../lexicon/README.md#partisan-game)
