# Eleven Men's Morris

> A larger morris variant — not formally solved.

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

## Description

A morris variant intermediate between [Nine Men's Morris](nine-mens-morris.md)
and [Twelve Men's Morris](twelve-mens-morris.md): an extended board with 24
points (or 32, depending on the regional variant) and **11 stones per player**.
It is documented historically in several European traditions but is much less
played and analysed than the 9- or 12-stone games. **[verify]** — the exact
board geometry varies by source.

## Rules

1. Board: typically the standard 24-point morris board, possibly with extra
   connections (diagonals) added to enable mills along extra lines. **[verify]**
2. Each player has **11 stones**.
3. **Placement phase**: players alternate placing stones on empty points,
   removing an opponent's stone for each mill (three-in-a-row) formed.
4. **Movement phase**: when all 22 stones are placed, players alternate sliding
   stones to adjacent empty points; mills again remove opponent stones.
5. A player reduced below 3 stones, or unable to move, loses.

## Solution status

To this archive's knowledge, no peer-reviewed solving result exists for Eleven
Men's Morris. The state space is larger than Nine Men's Morris, but well within
modern retrograde-analysis reach — the gap is a matter of effort and rule
canonicalisation rather than feasibility. Treat as **unsolved** and **[verify]**.

## Consensus on optimal play

- **Form mills while denying opponent mills during placement** — the placement phase is decisive; placing a stone that creates your mill (removing an opponent stone) while blocking a near-mill of theirs simultaneously is the highest-value move type.
- **Remove opponent stones that support multiple potential mills** — when you make a mill, target the opponent stone that participates in the most of their potential mill lines; this cripples their future attack options most efficiently.
- **Create double-mill "hammers"** — a piece that can slide back and forth between two mill-forming positions creates a mill on every other turn; setting up this oscillating structure with 11 stones is the key winning technique.
- **Maintain at least 4 stones to avoid the "flying" endgame** — in most morris variants, a player with 3 stones gains the right to jump anywhere; if you have exactly 3 stones you lose this deterrent; keep well above 3 while grinding the opponent down toward the 3-stone threshold.
- **Nine Men's Morris strategy carries over** — principles proven for the solved 9-stone game (e.g., Gasser 1996) apply here: controlling corner and T-junction points, building crossed mill threats, and forcing zugzwang in the movement phase are all valid strategic goals.

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
