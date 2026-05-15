# Heads-up limit hold'em

> The first competitively-played imperfect-information game to be essentially
> solved — a near-draw with a tiny dealer edge.

| Field | Value |
|-------|-------|
| Also known as | HULHE, heads-up limit Texas hold'em |
| Players | 2 |
| Type | Stochastic imperfect-information game (poker) |
| Perfect information | No (hidden hole cards) |
| Chance element | Yes (shuffled deck) |
| **Solution status** | Essentially weakly solved (ε-Nash equilibrium, ε below lifetime-detectable) |
| **Game-theoretic value** | Near-draw — a small first-player (dealer) advantage |
| Year solved | 2015 |
| Solved by | Bowling, Burch, Johanson & Tammelin (Cepheus) |
| State-space complexity | ~3.19 × 10^14 decision points |
| Game-tree complexity | ~10^17 game states |

## Description

Two-player Texas hold'em with **fixed bet sizes** (limit betting): each player is
dealt two private cards, five community cards are revealed across four betting
rounds, and bets/raises are capped per round. Because hole cards are hidden and
the deck is shuffled, this is a game of both **imperfect information** and
**chance** — "solving" it means computing a Nash-equilibrium strategy, not a
single win/lose/draw value.

## Solution status

Heads-up limit hold'em is **essentially weakly solved**.
[Bowling, Burch, Johanson & Tammelin (2015)](../references.md#bowling2015), with
the program **Cepheus**, used a variant of counterfactual regret minimisation
(CFR+) running on a large cluster to compute a strategy whose exploitability is
**ε-small** — small enough that it could not be beaten with statistical
significance even over a human lifetime of play. That is not a *perfect*
equilibrium (the qualifier "essentially"), but it is as close as is practically
meaningful. The result: the game is a **near-draw**, with a measured **small
advantage to the dealer** (first player). It was the first nontrivial
imperfect-information game played competitively by humans to be solved to this
standard.

## Consensus on optimal play

- **Mix your actions to stay unexploitable** — Nash-equilibrium play requires randomising bet/call/fold frequencies so that the opponent cannot profitably deviate; pure strategies (always bet with X, always fold with Y) are exploitable.
- **The dealer (BTN) has a persistent edge** — acting last on every post-flop street is a structural advantage; the button should play a slightly wider range and apply more pressure in position.
- **Defend big blind wide in limit** — because pot odds in limit are fixed and generous when facing a raise, the big blind must call with a wide range to prevent the button from profitably raising with any two cards.
- **Thin value bets are correct** — in limit hold'em, the fixed bet-to-pot ratio is small; betting one pair for thin value on the river is correct far more often than in no-limit, where sizing risk is larger.
- **Cepheus's equilibrium mixes heavily on the river** — even with strong hands the correct equilibrium strategy sometimes checks back to protect checking ranges; don't polarise bet ranges completely.
- **Statistical exploitability over a human lifetime is near zero** — the Cepheus solution proved that even a slightly sub-optimal strategy (within ε of equilibrium) cannot be beaten with statistical significance in any realistic number of hands.

## Engines & current best play

- **Strongest known program(s):** Cepheus (Bowling, Burch, Johanson & Tammelin, 2015) — CFR+ equilibrium solver.
- **Strength:** Essentially unexploitable; below the statistical detection threshold over a human lifetime.
- **Where the proof / tablebase lives (if solved):** [Bowling et al. (2015)](../references.md#bowling2015); Cepheus strategy table was publicly released by the University of Alberta.
- **Notes:** First nontrivial competitively-played imperfect-information game to be essentially solved; the result is a near-draw with a small dealer advantage.

## Complexity

About 3.2 × 10^14 decision points were tracked during the solve; the full game
has roughly 10^17 states. The achievement was managing this with CFR+ and disk
storage, not enumerating the game outright.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Texas_hold_%27em) ([archive](http://web.archive.org/web/20260506223844/https://en.wikipedia.org/wiki/Texas_hold_%27em))
- [Bowling, Burch, Johanson & Tammelin (2015). *Heads-up Limit Hold'em Poker is Solved*.](../references.md#bowling2015)

## See also

- [Heads-up no-limit hold'em](heads-up-nolimit-holdem.md) · [Liar's dice](liars-dice.md)
- Lexicon: [ultra-weakly solved](../lexicon/README.md#ultra-weakly-solved) · [Nash equilibrium](../lexicon/README.md#nash-equilibrium) · [solving vs. strong play](../lexicon/README.md#solving-vs-strong-play)
