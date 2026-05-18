# EinStein würfelt nicht!

> A small dice-driven abstract game. Endgames are solved, but the standard game is not formally settled.

| Field | Value |
|-------|-------|
| Also known as | EWN, "Einstein doesn't play dice" |
| Players | 2 |
| Type | Stochastic abstract game |
| Perfect information | Yes (no hidden information) |
| Chance element | Yes (a die chosen each turn) |
| **Solution status** | Partially solved (small boards / endgames; standard 5×5 not formally solved) |
| **Game-theoretic value** | Unknown (a chance game — measured as expected win probability) |
| Year solved | — |
| Solved by | — |
| State-space complexity | Moderate (5×5 board, 6 pieces per side) |
| Game-tree complexity | Moderate, with dice branching |
| **Playable** | einstein-wurfelt-nicht |

## Description

Designed by Ingo Althofer in 2004. On a 5×5 board, each player has six numbered
cubes (1 through 6) starting in one corner. Each turn, a die is rolled. You
must move the cube with that number — or, if that cube has been captured, the
cube with the closest number above or below it. Moves go toward the opposite
corner. If you land on any cube (yours or the opponent's), that cube is removed.
You win by getting a cube to the opposite corner or by capturing all of the
opponent's cubes. The die roll means the game involves **luck, but no hidden
information**.

## Solution status

EinStein würfelt nicht! is **partially solved**. Because it has chance, "solving"
means computing exact **expected win probabilities** rather than a win/draw/loss
value. The board is small (5×5, six pieces a side), so **endgame positions and
reduced material configurations have been solved exactly by retrograde-style
expectimax analysis**, and the game is a regular AI-competition test bed with
strong programs. But a published exact solution of the **full standard game**
from the initial setup — accounting for the players' free initial cube placement
— is not, to this archive's knowledge, established; treat the overall value as
open.

## Consensus on optimal play

- **Put your low-numbered cubes (1 and 2) in the center at setup** — you get to place cubes freely before the first roll. Low numbers are rolled more often per valid move opportunity, so putting small-numbered cubes on the direct path to the goal corner gives you the best odds.
- **Move diagonally toward the goal when you can** — diagonal moves (reducing both row and column at once) bring your cube closest to the opposite corner in a single move. Prefer diagonal over straight moves when both are possible.
- **Use cubes 1 and 2 aggressively — they are your fastest attackers** — when rolled, well-placed low cubes can reach the goal in fewer turns. Protecting them is worth more than shielding your large-numbered cubes.
- **Capturing is often better than advancing** — removing an opponent's cube takes away one of their fast movers and forces their remaining cubes to cover that number's rolls. A capture that also gets you closer to the goal is almost always the right move.
- **Stay away from the edges when possible** — cubes on the edge have fewer diagonal moves. Central or near-central positions give you more options when a specific number is rolled.

## Engines & current best play

- **Strongest known program(s):** Various Computer Olympiad bots implementing expectimax search with endgame evaluation; no single canonical public engine widely distributed.
- **Strength:** Super-human for endgame positions with known exact values; strong for the full game via deep expectimax search.
- **Where the proof / tablebase lives (if solved):** Endgame expectation tables computed by researchers for reduced material; no published full-game solution.
- **Notes:** EWN is a regular Computer Olympiad event; the combination of dice chance and no hidden information makes it a useful benchmark for probabilistic game-tree search (expectimax / expectation-maximisation).

## Complexity

Moderate: the 5×5 board with six pieces per side gives a state space well within
reach of exact analysis for endgames, and within reach of strong expectimax
search for the whole game — the gap to a "solution" is one of formal publication
and the placement phase rather than raw intractability.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/EinStein_w%C3%BCrfelt_nicht!) ([archive](http://web.archive.org/web/20251204160654/https://en.wikipedia.org/wiki/EinStein_w%C3%BCrfelt_nicht!))
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002) (general framework)

## See also

- [Backgammon](backgammon.md) · [Yahtzee](yahtzee.md)
- Lexicon: [chance element](../lexicon/README.md#chance-element) · [retrograde analysis](../lexicon/README.md#retrograde-analysis)
