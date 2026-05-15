# Backgammon

> The ancient race game — superhuman computer players exist and equity is known
> to high precision, but the dice make a formal "solution" effectively
> unattainable.

| Field | Value |
|-------|-------|
| Also known as | Backgammon (Tavli, Tavla and other regional variants are related) |
| Players | 2 |
| Type | Stochastic race game |
| Perfect information | Yes (no hidden information) |
| Chance element | Yes (dice) |
| **Solution status** | Unsolved (superhuman play exists; equity known approximately) |
| **Game-theoretic value** | Unknown exactly — first player has a small known equity edge |
| Year solved | — |
| Solved by | — |
| State-space complexity | ~10^20 positions |
| Game-tree complexity | Effectively infinite (21 dice outcomes × ~20 moves each per ply) |

## Description

Two players race 15 checkers each around a 24-point board in opposite
directions, moving according to the roll of two dice; a lone checker ("blot") can
be hit and sent back. The doubling cube adds a wagering dimension. Backgammon has
**no hidden information** but is **stochastic** — every move depends on a dice
roll — which places it outside the perfect-information solving framework that
covers most of this archive.

## Solution status

Backgammon is **not solved** and, realistically, cannot be solved in the strong
sense: the dice give each ply ~21 distinct roll outcomes, each with ~20 legal
plays, so the game tree is astronomically branchy and there is no single
"game-theoretic value," only an **expected equity**. What exists instead is
**superhuman approximate play**: starting with [TD-Gammon](../references.md#tesauro1995)
(Tesauro, 1992–95), which learned near-expert evaluation from self-play,
neural-network engines (GNU Backgammon, XG, etc.) now exceed the best humans and
agree closely on equities. Endgame ("bearoff") databases *are* solved exactly by
retrograde analysis. The opening-position equity is known to be a small edge for
the player on roll — but this is a precise statistical estimate, not a proof.

## Consensus on optimal play

- **Prime your opponent** — building a consecutive wall of 6 points (a "prime") that an opponent's checker cannot pass is the single most powerful strategic structure; a checker trapped behind a 6-prime is out of the game until the prime breaks.
- **Hit loose blots early, especially on your home board** — sending an opponent checker to the bar when you have a strong home board forces them to re-enter from scratch; timing hits with a strong board maximises this penalty.
- **Double aggressively, take marginal cubes** — the doubling cube swings equity dramatically; engines show that players double too late and drop too readily; the correct take/drop threshold is around 25% winning chances (accounting for gammon chances).
- **Race equity: use pip count** — in pure racing positions (no contact), the player ahead in raw pip count has winning equity proportional to the lead; top players count pips mentally to calibrate cube decisions.
- **Anchor on opponent's high points to survive backgame** — when behind in a race, establishing an "anchor" (your own point deep in the opponent's home board) gives re-entry from hits, delays bearoff, and threatens counterplay.
- **Bearoff accuracy is exact** — retrograde databases give perfect play for all bearoff positions; memorise the key bearoff equities (e.g., single vs. two-checker bearoffs) to avoid errors in the final race.

## Engines & current best play

- **Strongest known program(s):** eXtreme Gammon (XG) and GNU Backgammon ([https://www.gnu.org/software/gnubg/](https://www.gnu.org/software/gnubg/) ([archive](http://web.archive.org/web/20260512225409/http://www.gnu.org/software/gnubg/))) — neural-network evaluation with rollout verification; TD-Gammon (Tesauro, 1992–95) was the original breakthrough.
- **Strength:** Super-human; top engines exceed world-champion humans.
- **Where the proof / tablebase lives (if solved):** Bearoff databases (exact, up to ~15 checkers per side) are widely distributed; full game is unsolved.
- **Notes:** TD-Gammon's self-play learning (reinforcement learning from temporal differences) was a landmark in game AI; modern engines use similar but deeper neural networks with vastly more rollout data.

## Complexity

State-space on the order of 10^20 positions; the effective game-tree complexity
is enormous because of the dice branching, which is the fundamental obstacle to a
formal solution.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Backgammon) ([archive](http://web.archive.org/web/20260513154445/https://en.wikipedia.org/wiki/Backgammon))
- [Tesauro (1995). *Temporal Difference Learning and TD-Gammon*.](../references.md#tesauro1995)
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)

## See also

- [EinStein würfelt nicht!](einstein-wurfelt-nicht.md) · [Yahtzee](yahtzee.md)
- Lexicon: [chance element](../lexicon/README.md#chance-element) · [solving vs. strong play](../lexicon/README.md#solving-vs-strong-play) · [retrograde analysis](../lexicon/README.md#retrograde-analysis)
