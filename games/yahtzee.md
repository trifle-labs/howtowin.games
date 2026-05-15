# Yahtzee

> The dice game — solved in the solitaire sense: the strategy maximising
> expected score is fully computed.

| Field | Value |
|-------|-------|
| Also known as | Yahtzee, Yatzy (Scandinavian variant), Generala (related) |
| Players | 1+ (the optimal-play result is for the solitaire scoring problem) |
| Type | Stochastic dice game |
| Perfect information | Yes (no hidden information) |
| Chance element | Yes (dice rolls) |
| **Solution status** | Solved (optimal solitaire strategy computed) |
| **Game-theoretic value** | N/A (solitaire) — optimal expected score ≈ 254.59 |
| Year solved | 2006 (and independently by others) |
| Solved by | James Glenn; Tom Verhoeff; others |
| State-space complexity | Tractable (scorecard × dice states) |
| Game-tree complexity | N/A (Markov decision process) |

## Description

On a turn a player rolls five dice, may re-roll any subset up to two more times,
then must enter a score in one of 13 categories on their scorecard (each used
exactly once). Categories include the upper section (count of each face value,
with a bonus for reaching 63) and the lower section (three/four of a kind, full
house, straights, the 50-point "Yahtzee," and chance). The game involves chance
but **no hidden information** — every relevant state is fully observable.

## Solution status

Yahtzee is **solved** in the relevant sense: as a single-player
expected-value-maximisation problem it is a finite **Markov decision process**,
and the optimal policy can be computed exactly by dynamic programming over the
scorecard-and-dice state space. [Glenn (2006)](../references.md#glenn-yahtzee2006)
computed the strategy maximising expected total score — about **254.59 points**
per game — and the policy maximising the probability of beating a fixed target
can be computed the same way. The "solution" is a large lookup table of optimal
decisions, not a game-theoretic value, because solo Yahtzee is an optimisation
problem, not an adversarial game.

## Consensus on optimal play

- **Always aim for the upper-section bonus first** — the 35-point bonus (for scoring ≥ 63 in the upper section) is worth pursuing aggressively; an optimal strategy keeps the upper section on track by accepting slightly suboptimal lower-section plays.
- **Yahtzee bonus plays are high-leverage** — the 100-point bonus for each additional Yahtzee (after the first) has extremely high expected value; when you have four of a kind on the first roll, keep all five dice on both rerolls to chase it.
- **Sacrifice chance early** — the "Chance" category is a flexible dump for any five dice; preserving it until the last few turns lets you use it as a free safety net when all better categories are used.
- **Take an upper-section category over zeros when forced** — entering a 1 (e.g., scoring 1 in "Ones" to preserve a slot) is usually better than taking zero in a lower-section category; zeros in the upper section forfeit bonus progress permanently.
- **In multiplayer, shift strategy to target your opponent's score** — the optimal solitaire policy maximises expected score; if you need to beat a specific opponent total, switch to the probability-of-exceeding-target policy, which often differs significantly (e.g., taking higher-variance plays when behind).

## Engines & current best play

- **Strongest known program(s):** Exact dynamic-programming solvers — Glenn (2006) and Verhoeff computed the full optimal-policy lookup table by backward induction over the (scorecard, dice-state, rerolls-remaining) state space.
- **Strength:** Exactly optimal; expected score ≈ 254.59 points per game.
- **Where the proof / tablebase lives (if solved):** Glenn (2006) ([../references.md#glenn-yahtzee2006](../references.md#glenn-yahtzee2006)); the full policy table is available from several researchers' websites.
- **Notes:** Yahtzee is solved as a Markov decision process, not as a two-player adversarial game; the "solution" is a decision policy, not a game-theoretic value.

## Complexity

The state space (current scorecard × current dice × rerolls remaining) is large
but very much within reach of exact dynamic programming, which is why the optimal
policy is known precisely rather than approximated.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Yahtzee) ([archive](http://web.archive.org/web/20260507114418/https://en.wikipedia.org/wiki/Yahtzee))
- [Glenn (2006). *An Optimal Strategy for Yahtzee*.](../references.md#glenn-yahtzee2006)

## See also

- [Klondike solitaire](klondike-solitaire.md) · [Backgammon](backgammon.md) · [Liar's dice](liars-dice.md)
- Lexicon: [chance element](../lexicon/README.md#chance-element) · [solving vs. strong play](../lexicon/README.md#solving-vs-strong-play)
