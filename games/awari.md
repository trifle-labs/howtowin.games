# Awari (Oware)

> The classic two-row mancala game. Every one of its ~900 billion positions was solved in 2002.

| Field | Value |
|-------|-------|
| Also known as | Oware, Awele, wari, ouri |
| Players | 2 |
| Type | Partisan sowing (mancala) game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Strongly solved |
| **Game-theoretic value** | Draw |
| Year solved | 2002 |
| Solved by | John W. Romein & Henri E. Bal |
| State-space complexity | ~8.9 × 10^11 positions (all enumerated) |
| Game-tree complexity | Fully covered by the database |
| **Playable** | awari |

## Description

Awari is played on a board with two rows of six pits (holes) and 48 seeds
total (4 seeds in each pit at the start). On your turn, you pick up all the
seeds from one of your pits and **sow** them one by one into each following
pit going counter-clockwise. If the last seed lands in an enemy pit and makes
that pit hold exactly 2 or 3 seeds, you capture those seeds (and possibly the
seeds in the pits before it too). The player who captures more than 24 seeds
wins.

## Solution status

Awari is **strongly solved**. [Romein & Bal (2003)](../references.md#romein-bal2003)
computed the game-theoretic value of **every one of its ~889 billion positions**
by massively parallel [retrograde analysis](../lexicon/README.md#retrograde-analysis)
on a cluster — building, in effect, a complete tablebase for the whole game. The
result: **with perfect play Awari is a draw** (each side captures exactly 24
seeds).

Because the entire state space is stored, optimal play is available from *any*
position, not just the opening — the [strong-solution](../lexicon/README.md#strongly-solved)
standard. Awari was, at the time, one of the largest games to be solved this
completely.

## Consensus on optimal play

- **Perfect play leads to a 24-24 tie** — if both players play perfectly, each captures exactly 24 seeds. Any mistake lets the opponent pull ahead.
- **Avoid leaving your opponent with no seeds** — a move that would leave the opponent with no seeds on their side is not allowed. Plan ahead so you don't give your opponent no pits to play from, which costs you capture chances.
- **Count seeds before you sow** — where the last seed lands decides what you capture. Doing the math on pit counts (especially pits with 12 or more seeds that wrap all the way around) is what separates strong from weak players.
- **Look for capture chains** — when you sow, you might trigger a chain of captures in several pits, as long as each one has exactly 2 or 3 seeds after your last seed lands. Spotting these multi-pit chains is a key skill.
- **Keep your seeds spread out** — keeping seeds spread across your pits gives you more options later. Having one or two fat pits makes you predictable and lets the opponent count your landing spots easily.

## Engines & current best play

- **Strongest known program(s):** Romein & Bal's 2002 retrograde tablebase — complete lookup for all positions.
- **Strength:** Perfect (optimal play from every position is computable in constant time by tablebase lookup).
- **Where the proof / tablebase lives (if solved):** Romein & Bal (2003) — see [../references.md#romein-bal2003](../references.md#romein-bal2003); the full ~889 billion-position database was held at Vrije Universiteit Amsterdam.
- **Notes:** At time of publication this was one of the largest completely solved games; the tablebase is too large for casual download but the result (draw) is definitively established.

## Complexity

~8.9 × 10^11 positions — all enumerated in the 2002 solution.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Oware) ([archive](http://web.archive.org/web/20260503155212/https://en.wikipedia.org/wiki/Oware))
- [Romein, J. W. & Bal, H. E. (2003). *Solving Awari with Parallel Retrograde Analysis*.](../references.md#romein-bal2003)
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)

## See also

- [Kalah](kalah.md) · [Bao](bao.md) · [Nine Men's Morris](nine-mens-morris.md)
- Lexicon: [strongly solved](../lexicon/README.md#strongly-solved) · [retrograde analysis](../lexicon/README.md#retrograde-analysis)
