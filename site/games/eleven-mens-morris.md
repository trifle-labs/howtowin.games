# Eleven Men's Morris

> A larger morris variant with 11 stones per player. Not formally solved.

| Field | Value |
|-------|-------|
| Also known as | Eleven Men's Morris |
| Players | 2 |
| Type | Partisan placement+movement game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Unsolved **[verify]** |
| **Game-theoretic value** | Unknown |
| Year solved | — |
| Solved by | — |
| State-space complexity | Larger than Nine Men's Morris |
| Game-tree complexity | Larger than Nine Men's Morris |
| **Playable** | eleven-mens-morris |

## Description

Eleven Men's Morris is a morris variant that sits between
[Nine Men's Morris](nine-mens-morris.md) and
[Twelve Men's Morris](twelve-mens-morris.md). It is played on a larger board
with 24 points (or 32, depending on the version) and **11 stones per player**.
It appears in several European historical traditions but is much less played
and studied than the 9- or 12-stone games.

## Rules

1. Board: usually the standard 24-point morris board, sometimes with extra diagonal lines added so mills can be made along more lines.
2. Each player has **11 stones**.
3. **Placement phase**: Players take turns placing stones on empty points. When you make a mill (three in a row), you remove one opponent stone.
4. **Movement phase**: After all 22 stones are placed, players take turns sliding stones to neighboring empty points. Mills remove opponent stones as before.
5. A player who has fewer than 3 stones left, or cannot move, loses.

## Solution status

To this archive's knowledge, no peer-reviewed solving result exists for Eleven
Men's Morris. The state space is larger than Nine Men's Morris, but well within
modern retrograde-analysis reach — the gap is a matter of effort and rule
canonicalisation rather than feasibility. Treat as **unsolved** and **[verify]**.

## Consensus on optimal play

- **Make mills while blocking opponent mills during placement** — the placement phase decides the game. The best move is one that makes a mill for you (removing an opponent stone) while also blocking a near-mill of theirs.
- **When you get a mill, remove the opponent's most connected stone** — when you make three in a row, take the opponent stone that is part of the most of their potential mill lines. This cripples their future attacks most efficiently.
- **Create double-mill "hammers"** — a piece that can slide back and forth between two mill positions creates a mill every other turn. Setting up this swinging structure with 11 stones is a key winning technique.
- **Keep at least 4 stones to avoid the "flying" phase** — in most morris games, a player with 3 stones gets to jump anywhere on the board. If you have exactly 3 stones you lose this advantage. Keep well above 3 while wearing the opponent down toward that 3-stone threshold.
- **Nine Men's Morris strategy carries over** — principles proven for the solved 9-stone game also apply here: control corner and T-junction points, build crossed mill threats, and force the opponent into bad positions in the movement phase.

## Engines & current best play

- **Strongest known program(s):** No game-specific public engine known to the cataloguer. General morris engines (e.g., those for Nine Men's Morris) can approximate strong play with minor rule adaptation.
- **Strength:** Not benchmarked.
- **Notes:** Eleven Men's Morris has a small competitive community and no published peer-reviewed solving result; the state space is larger than Nine Men's Morris (~10^10 positions) but likely within reach of modern retrograde analysis if attempted.

## Complexity

Larger than Nine Men's Morris's ~10^10 positions, but presumably tractable.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Nine_men%27s_morris) ([archive](http://web.archive.org/web/20260328233608/https://en.wikipedia.org/wiki/Nine_Men%27s_Morris))
- [Gasser (1996). *Solving Nine Men's Morris*.](../references.md#gasser1996) (general framework)

## See also

- [Nine Men's Morris](nine-mens-morris.md) · [Twelve Men's Morris](twelve-mens-morris.md) · [Lasker Morris](lasker-morris.md)
- Lexicon: [retrograde analysis](../lexicon/README.md#retrograde-analysis)
