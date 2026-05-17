# Liar's dice

> A bluffing dice game — small variants yield to game-theoretic equilibrium
> computation, but the common multi-die game has no published full solution.

| Field | Value |
|-------|-------|
| Also known as | Liar's dice, Dudo, Perudo, Bluff, Mexican (related) |
| Players | 2+ |
| Type | Stochastic imperfect-information bluffing game |
| Perfect information | No (each player's dice are hidden) |
| Chance element | Yes (dice) |
| **Solution status** | Unsolved in general; small two-player variants solved (Nash equilibria computed) |
| **Game-theoretic value** | Variant-dependent |
| Year solved | — (small cases via standard equilibrium computation) |
| Solved by | — |
| State-space complexity | Grows rapidly with dice count and players |
| Game-tree complexity | Large |
| **Playable** | liars-dice |

## Description

Each player rolls a set of dice and keeps them hidden under a cup. Players take
turns making escalating **bids** about the dice on the table as a whole (e.g.
"four 5s"), or **challenging** the previous bid. When a bid is challenged the
dice are revealed: whoever was wrong loses a die. A player eliminated of all dice
is out; the last player standing wins. The whole game turns on bluffing and
probabilistic inference from hidden information.

## Solution status

Liar's dice is **not solved** in general. As an imperfect-information game,
"solving" means computing a Nash-equilibrium strategy; this is tractable for
**small two-player variants** (few dice per player), where the game can be
expressed as a manageable extensive-form game and solved by linear programming or
counterfactual regret minimisation — and such small variants are a common
teaching and benchmark example in the equilibrium-computation literature. But the
**standard multi-die, multi-player game** has a state space that grows too fast
for a published full-game equilibrium, and multi-player equilibria are not even
uniquely defined. No comprehensive solution exists.

## Consensus on optimal play

- **Compute the expected number of each face before bidding** — with N total dice on the table, each face appears roughly N/6 times; wild-1 variants count 1s as wild, raising expected counts; bid slightly above the expected count and call bluffs when bids go well above it.
- **Bluff proportionally to the uncertainty** — when you have none of the bid face yourself, the bid relies entirely on opponents' dice; with many opponents still in, high bids are plausible; with few opponents left, high bids become statistically unlikely and should be challenged.
- **Randomise your honest/bluff ratio to stay unexploitable** — a player who only bids truthfully or only bluffs is quickly read; mix strategies so opponents cannot reliably deduce your dice from your bidding pattern.
- **Challenge conservatively with many dice remaining** — early in the game, losing a die is a small setback; challenge only when a bid significantly exceeds statistical plausibility.
- **Challenge aggressively with few dice remaining** — with 1 or 2 dice left, losing a die is catastrophic; call anything that requires opponents to have more of a face than is likely given remaining dice.
- **Track what faces opponents have bid confidently** — repeated high bids of a specific face by one player likely reflect their actual dice; use this information to update your probability estimates for challenges.

## Engines & current best play

- **Strongest known program(s):** CFR-based bots for fixed configurations; no publicly named dominant engine for the standard multi-player game.
- **Strength:** Strong for small two-player variants (Nash equilibria computable); heuristic-level for standard multi-player game.
- **Where the proof / tablebase lives (if solved):** Small two-player cases solved via linear programming / CFR; no published full solution for the standard game.
- **Notes:** Multi-player equilibria are not uniquely defined even in theory; practical play relies on probabilistic heuristics and opponent modelling.

## Complexity

Scales steeply with the number of dice and players; the bidding tree plus the
hidden-information structure put the standard game beyond current full-solution
methods.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Liar%27s_dice) ([archive](http://web.archive.org/web/20260417235754/https://en.wikipedia.org/wiki/Liar%27s_dice))
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002) (general framework)

## See also

- [Heads-up limit hold'em](heads-up-limit-holdem.md) · [Battleship](battleship.md) · [Mastermind](mastermind.md)
- Lexicon: [Nash equilibrium](../lexicon/README.md#nash-equilibrium) · [perfect information](../lexicon/README.md#perfect-information)
