# LYNGK

> A game where you stack colored discs to capture five-of-a-kind. Part of the GIPF game series.

| Field | Value |
|-------|-------|
| Also known as | LYNGK |
| Players | 2–4 |
| Type | Partisan stacking game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Unsolved |
| **Game-theoretic value** | Unknown |
| Year solved | — |
| Solved by | — |
| State-space complexity | Large |
| Game-tree complexity | Large |
| **Playable** | lyngk |

## Description

LYNGK (Kris Burm, 2017) is the seventh game in the GIPF series, designed to close it out. Each player secretly chooses two colors out of six. The goal is to capture stacks containing all six colors by claiming and stacking discs.

## Rules

1. Board: hexagonal grid of 49 cells, each cell with one or two discs of one of six colors.
2. Each player secretly picks two colors to "own."
3. On a turn, the player moves a stack containing their color, leaping over a neighboring stack containing a color they do not own, landing on a stack in their direction of choice and stacking on top.
4. A stack of height 5 containing all six distinct colors is captured by the player who completes it.
5. The first player to capture a target number of "stacks-of-five" wins.

## Solution status

LYNGK is **not solved**. The hidden-colour assignment makes the game effectively
imperfect-information for some analyses; even the perfect-information version
has no published solution.

## Consensus on optimal play

- **Claim your two colors early** — declaring ownership locks your strategy for the rest of the game. Pick colors that are densely distributed on the board and offer many stacking opportunities.
- **Track the opponent's likely color claim** — their early moves reveal which colors they own. Once you have identified both of their colors, you know which stacks they can legally move, allowing you to block or redirect their path to completion.
- **Build partial stacks that only you can complete** — a four-color stack missing one color you own is one move from a capture for you but potentially unmovable for the opponent. Build these controlled near-complete stacks.
- **Block stacks containing all the opponent's colors** — a stack that includes both of the opponent's colors is a potential five-color completion threat. Interfere with it by stacking a disc on top with a neutral or your own color.
- **Every move should advance your goal or delay the opponent** — with limited stacks and finite colors, each move either brings you closer to completing five-color stacks or delays the opponent. Do not make neutral moves unless they also constrain the opponent.

## Engines & current best play

- **Strongest known program(s):** No game-specific public engine known to the cataloguer. Playable in general-purpose abstract-game frameworks (e.g., [Ludii](https://ludii.games/)).
- **Strength:** Not benchmarked.
- **Where the proof / tablebase lives (if solved):** Not solved; no published analysis.
- **Notes:** The newest GIPF-project title (2017); competitive scene is small and published theory is minimal.

## Complexity

Large.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/LYNGK) ([archive](http://web.archive.org/web/20251004213009/https://en.wikipedia.org/wiki/LYNGK))
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)

## See also

- [GIPF](gipf.md) · [DVONN](dvonn.md) · [YINSH](yinsh.md) · [TZAAR](tzaar.md)
- Lexicon: [perfect information](../lexicon/README.md#perfect-information)
