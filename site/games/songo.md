# Songo

> West African mancala with mandatory captures — unsolved.

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

Songo is a West African mancala variant in the broader Awari/Oware family,
played on a two-row board with six pits per side. Local variants differ on
sowing direction, capture conditions, and end-game rules. **[verify]** the
specific regional ruleset documented here.

## Rules

1. Board: 6 pits per side; no large home stores (captured seeds are held off-
   board by each player).
2. Each pit begins with 4 seeds.
3. On a turn the player picks up all seeds in one of their own pits and sows
   them counterclockwise, one per pit, including across opponent's row.
4. **Capture**: if the last seed sown lands in an opponent's pit and brings
   the count there to 2 or 3, those seeds are captured; captures propagate
   backward to previous opponent pits that also reach 2 or 3.
5. A move that would leave the opponent with no seeds at all is illegal
   unless no other move is available.
6. The game ends when one side cannot move; the player with the most captured
   seeds wins.

## Solution status

Songo is **not solved**. Several variants are mathematically close to Awari
(which has been solved by Romein & Bal as a draw), but Songo's specific
ruleset has no published value.

## Consensus on optimal play

- **Keep opponent's pits lean** — preventing opponents from holding large piles reduces their capture threats; spreading their seeds thin limits their options.
- **Maintain seed flow on your side** — emptying too many of your own pits leaves you without legal moves; try to keep at least two or three pits occupied.
- **Trigger backward-capture chains** — the propagating-capture rule rewards sowing the last seed into a pit that sets up a chain of 2-or-3 pits behind it on the opponent's side; plan the full chain before moving.
- **Do not starve your opponent early** — moves that would leave the opponent with no seeds are illegal unless unavoidable; learn which configurations force that situation so you can steer toward it legitimately late in the game.
- **Endgame seed count matters more than tempo** — once most pits are thinly seeded, securing a cumulative advantage in captured seeds outweighs positional refinements.

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
