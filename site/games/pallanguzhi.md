# Pallanguzhi

> A South Indian mancala game where sowing is chained (you keep going after each drop). It has not been solved.

| Field | Value |
|-------|-------|
| Also known as | Pallanguli, Pallam Kuzhi |
| Players | 2 |
| Type | Partisan mancala |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Unsolved |
| **Game-theoretic value** | Unknown |
| Year solved | — |
| Solved by | — |
| State-space complexity | Large |
| Game-tree complexity | Large |
| **Playable** | pallanguzhi |

## Description

Pallanguzhi is the traditional mancala (seed-sowing game) of Tamil Nadu, played on a 2x7 board (2 rows of 7 pits each). The special feature is **chain sowing**: after you drop the last seed, you pick up the seeds from the next pit and keep going, repeating until a stopping condition is met.

## Rules

1. Board: 7 pits per player, no large stores (unlike some mancala games). Each pit starts with 6 seeds (though this varies by region).
2. On your turn, you pick up all the seeds from one of your own pits and sow them (drop one seed in each pit) going counterclockwise.
3. **Chain sowing**: after you drop the last seed, you immediately pick up the seeds from the very next pit and keep sowing them the same way. The chain continues until either you drop the last seed into an empty pit, or into a pit that is followed by an empty pit on your own side.
4. **Capture**: when the chain ends on an empty pit, you capture any seeds in the pit after it.
5. When a player empties all pits on their own side, they pass. The round ends when both sides are empty. Seeds left on the opponent's side may go to that opponent (depending on the variant).
6. The game is played over several rounds with reseeding. A player who cannot fill all of their own pits at the start of a round loses.

## Solution status

Pallanguzhi is **not solved**. Chain-sowing analysis is complex and no
published values exist for the standard ruleset.

## Consensus on optimal play

- **Try to trigger long chains** — moves that start a long chain sow go through many pits and create harder-to-predict results. Opponents will find it harder to see where the chain will stop.
- **Spread your seeds around** — putting all your seeds in one pit wastes turns on a single long sow. Spreading them out gives you more chain-starting options each turn.
- **Aim for the opponent's full pits** — if a chain stops just before a pit that has many seeds in it, you capture those seeds. Watch for this opportunity.
- **Protect your full pits** — do not let one of your loaded pits sit one position past where the opponent's chain is likely to end. Shift seeds around before they can set up a capture.
- **Count seeds in the endgame** — with few seeds left, keep track of exactly which positions will let a chain continue versus stop. The player who can keep chains going the longest captures the final seeds.

## Engines & current best play

- **Strongest known program(s):** No game-specific public engine known to the cataloguer. Playable in general-purpose abstract-game frameworks (e.g., [Ludii](https://ludii.games/)).
- **Strength:** Not benchmarked.
- **Notes:** No published formal analysis; the game is played recreationally and competitively in Tamil Nadu but lacks a computational study.

## Complexity

Large.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Pallanguzhi)
- [Romein & Bal (2003). *Awari is Solved*.](../references.md#romein-bal2003) (related)
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)

## See also

- [Awari](awari.md) · [Bao](bao.md) · [Kalah](kalah.md) · [Sungka](sungka.md)
- Lexicon: [partisan game](../lexicon/README.md#partisan-game)
