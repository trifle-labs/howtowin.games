# LYNGK

> The cooperative-style GIPF-project closer — stacking discs to capture colour
> sets.

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

## Description

LYNGK (Kris Burm, 2017) is the seventh GIPF-project release, designed to close
the series. Each player secretly chooses **two colours** out of six; the
goal is to capture stacks containing all six colours by claiming and stacking
discs.

## Rules

1. Board: hexagonal grid of 49 cells, each cell with one or two discs of one
   of six colours.
2. Each player secretly picks **two colours** to "own."
3. On a turn, the player moves a stack containing their colour, leaping over an
   adjacent stack containing a colour they do **not** own, landing on a stack
   in their direction of choice and **stacking on top**.
4. A stack of height 5 containing all distinct colours (or specific
   colour-counts depending on the variant) is **captured** by the player who
   completes it.
5. The first player to capture a target number of "stacks-of-five" wins.

## Solution status

LYNGK is **not solved**. The hidden-colour assignment makes the game effectively
imperfect-information for some analyses; even the perfect-information version
has no published solution.

## Consensus on optimal play

- **Claim your two colours early** — declaring ownership locks your strategy for the rest of the game; pick colours that are densely distributed on the board and offer many stacking opportunities.
- **Track the opponent's likely colour claim** — their early moves reveal which colours they own; once you have identified both of their colours, you know which stacks they can legally move, allowing you to block or redirect their path to five-colour completion.
- **Build partial stacks that only you can complete** — a four-colour stack missing one colour you own is one move from a capture for you but potentially unmoveable for the opponent; build these controlled near-complete stacks.
- **Block stacks containing all the opponent's colours** — a stack that includes both of the opponent's colours is a potential five-colour completion threat; interfere with it by stacking a disc on top with a neutral or your own colour, adding height but changing the required remaining piece.
- **Tempo matters on a 49-cell board** — with limited stacks and finite colours, each move either advances a five-colour completion or delays the opponent; don't make neutral moves unless they also constrain the opponent.

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
