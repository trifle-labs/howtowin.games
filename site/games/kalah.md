# Kalah

> A Western commercial version of the ancient mancala (sowing) game. Solved for most common board sizes. The first player almost always wins.

| Field | Value |
|-------|-------|
| Also known as | Kalaha, Mancala (the commercial game) |
| Players | 2 |
| Type | Partisan sowing (mancala) game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Weakly solved (many (holes, seeds) configurations) |
| **Game-theoretic value** | First-player win for most configurations (often by a large margin) |
| Year solved | 2000 |
| Solved by | Geoffrey Irving, Jeroen Donkers & Jos Uiterwijk |
| State-space complexity | Varies with the number of holes and seeds |
| Game-tree complexity | Varies with configuration |
| **Playable** | kalah |

## Description

Played on two rows of pits plus a scoring store (kalah) for each player. Players sow (distribute) seeds counter-clockwise. If the last seed lands in your own store, you get an extra turn. If the last seed lands in an empty pit on your side, you capture the opposite pit. The game is described by the number of holes per side and seeds per hole — "Kalah(6,4)" is the common commercial version.

## Solution status

Kalah is **weakly solved** for a wide range of configurations.
[Irving, Donkers & Uiterwijk (2000)](../references.md#irving-kalah2000) solved
Kalah(*h*,*s*) for many small-to-moderate (*h*,*s*) by full-game search with
endgame [databases](../lexicon/README.md#endgame-tablebase), and later work
(notably by Anders Carstensen) extended this to the standard **Kalah(6,4)** and
beyond. The recurring verdict: **the first player wins**, frequently by a large
score margin — the "extra turn" rule rewards the first mover heavily. (Some very
small configurations are draws or first-player wins by a single seed; the value
genuinely depends on (*h*,*s*).)

## Consensus on optimal play

- **The first extra-turn chain is decisive** — chains of extra turns (when the last seed lands in your store) can empty your side before the opponent moves much. Counting seeds to maximize your opening chain length is the most important skill.
- **Capture the opponent's largest pit whenever possible** — the capture rule (if the last seed lands in an empty pit on your side, take the opposite pit) is high-value. Set up captures from your pits that face full opponent pits.
- **Deplete pits that enable opponent chains** — if the opponent has a pit whose count lands in their store, emptying or disrupting that pit before they can use it breaks their chain.
- **Keep your store count ahead early** — the game ends when one side's pits are all empty. If your store is well ahead when this happens you win regardless of the opponent sweeping their remaining seeds.
- **Avoid leaving a full strip for your opponent** — if your side has many seeds scattered evenly, the opponent can set up a series of captures. Unevenness on your side (some full, some empty) is harder to exploit.
- **For Kalah(6,4) the first-player winning line starts with pit 3 or 4** — computer analysis shows specific first moves that start winning chains. Knowing even one winning opening line is enough for a human to win against non-computer opponents.

## Engines & current best play

- **Strongest known program(s):** Solver programs by Irving/Donkers/Uiterwijk and Anders Carstensen; no well-known named public engine, but Kalah(6,4) is fully solved.
- **Strength:** Perfect play computable; first player wins with optimal play in Kalah(6,4).
- **Where the proof / tablebase lives (if solved):** [Irving, Donkers & Uiterwijk (2000)](../references.md#irving-kalah2000); Carstensen's extended work.
- **Notes:** The strong first-player advantage makes commercial Kalah a poor competitive game; the interest is mathematical.

## Complexity

Configuration-dependent; standard Kalah(6,4) was within reach of search plus
endgame databases.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Kalah) ([archive](http://web.archive.org/web/20260422060748/https://en.wikipedia.org/wiki/Kalah))
- [Irving, G., Donkers, J. & Uiterwijk, J. (2000). *Solving Kalah*.](../references.md#irving-kalah2000)

## See also

- [Awari (Oware)](awari.md) · [Bao](bao.md)
- Lexicon: [weakly solved](../lexicon/README.md#weakly-solved) · [first-player advantage](../lexicon/README.md#first-player-advantage)
