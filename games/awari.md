# Awari (Oware)

> The classic two-row mancala — strongly solved in 2002, every one of its
> ~900 billion positions catalogued.

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

## Description

Played on two rows of six pits, with 48 seeds (4 per pit at the start). On a
turn a player picks up all seeds from one of their pits and **sows** them one
per pit, counter-clockwise. If the last seed lands in an enemy pit bringing it
to 2 or 3 seeds, those are captured (and possibly preceding pits too). The
player capturing more than 24 seeds wins.

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

- **Both sides capturing exactly 24 seeds is the perfect-play outcome** — every deviation from the drawn line eventually hands the opponent a material edge; the value is 24-24 with best play.
- **Deny grand slams** — a move that would leave the opponent with no seeds on their side is illegal if the opponent has no seeds; under legal-play rules, plan ahead to avoid giving your opponent no valid pits to sow from, which forfeits your capture rights.
- **Count seeds before sowing** — the exact landing pit of the last seed determines captures; precise arithmetic about pit counts (especially pits holding 12+ seeds that wrap the whole board) separates strong from weak play.
- **Capture chains compound** — a sow can trigger a cascade of captures in preceding pits if each of those pits also holds exactly 2 or 3 seeds after the final seed lands; spotting multi-pit capture chains is a core tactical skill.
- **Preserve your own pit count** — keeping seeds spread across your pits maintains future flexibility; having one or two fat pits is predictable and allows your opponent to count your landing squares accurately.

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
