# Pallanguzhi

> South Indian mancala with chain sowing — unsolved.

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

Pallanguzhi is the traditional mancala of Tamil Nadu, played on a 2×7 board.
Sowing is **chained**: when the seed after the last drops into a pit, the
player picks up the contents of the next pit and continues sowing, repeating
until a stopping condition occurs.

## Rules

1. Board: 7 pits per player; no large stores. Each pit begins with 6 seeds
   (varies by regional rule).
2. On a turn the player picks up seeds from one of their own pits and sows
   counterclockwise.
3. **Chain sowing**: after sowing, the pit immediately after the last sown
   pit is picked up and sown the same way; the chain continues until either
   the player drops the last seed into an empty pit, or into a pit followed
   by an empty pit on the same side.
4. **Capture**: when the chain ends on an empty pit, the seeds in the pit
   beyond it (if any) are captured.
5. When a player runs out of seeds on their side, they pass; the round ends
   when both sides empty. Seeds left on the opponent's side may go to that
   opponent (varies by variant).
6. Game is played as a series of rounds with reseeding; the player who can
   no longer fill all their pits at the start of a round loses.

## Solution status

Pallanguzhi is **not solved**. Chain-sowing analysis is complex and no
published values exist for the standard ruleset.

## Consensus on optimal play

- **Prefer long-chain triggers** — moves that initiate a long chain sow often pass through many pits, creating unpredictable stops; opponents find it harder to foresee where the chain will terminate.
- **Keep seeds spread across your pits** — concentrating all seeds in one pit wastes turns on a single long sow; distributing seeds lets you maintain more chain options each turn.
- **Target the opponent's near-empty pits** — a chain that terminates just before an opponent's heavily loaded pit captures those seeds; watching for this opportunity is critical.
- **Protect your loaded pits from capture** — do not allow your large pits to sit one position past an opponent's likely chain-end; rebalance before they can line up a capture.
- **Endgame seed counting** — with few seeds left, track exactly which positions will allow a chain to continue vs. stop; the player who can keep chains going longest captures the final seeds.

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
