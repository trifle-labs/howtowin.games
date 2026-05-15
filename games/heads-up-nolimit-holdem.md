# Heads-up no-limit hold'em

> Superhuman AI exists and beat top professionals — but the game itself, with
> its continuum of bet sizes, is far from formally solved.

| Field | Value |
|-------|-------|
| Also known as | HUNL, heads-up no-limit Texas hold'em |
| Players | 2 |
| Type | Stochastic imperfect-information game (poker) |
| Perfect information | No (hidden hole cards) |
| Chance element | Yes (shuffled deck) |
| **Solution status** | Unsolved (superhuman play exists; no equilibrium computed for the full game) |
| **Game-theoretic value** | Unknown — small first-player edge expected |
| Year solved | — |
| Solved by | — (Libratus, DeepStack achieved superhuman *play* in 2017) |
| State-space complexity | ~10^160+ game states |
| Game-tree complexity | Effectively a continuum (any bet size up to the stack) |

## Description

Two-player Texas hold'em with **no-limit betting**: at any point a player may bet
any amount up to their entire stack. Like the limit version it has hidden hole
cards and a shuffled deck, but the **unrestricted bet sizing** makes the action
space effectively continuous, exploding the game tree far beyond the limit
variant.

## Solution status

Heads-up no-limit hold'em is **not solved**. Its game tree is astronomically
larger than limit hold'em — roughly 10^160 states, with a continuum of legal bet
sizes — so no ε-Nash equilibrium for the full game has been computed. What was
achieved in 2017 is **superhuman play**: [Libratus](../references.md#brown-libratus2018)
(Brown & Sandholm) and [DeepStack](../references.md#moravcik-deepstack2017)
(Moravčík et al.) both decisively beat top human professionals, using
abstraction, continual re-solving and CFR-based techniques. But beating
professionals is [strong play, not solving](../lexicon/README.md#solving-vs-strong-play):
these programs use bet-size abstractions and depth-limited re-solving, and their
residual exploitability for the full continuous game is not bounded to the
lifetime-undetectable standard that [limit hold'em](heads-up-limit-holdem.md)
reached.

## Consensus on optimal play

- **Use solvers to build range-balanced strategies** — modern GTO solvers (PioSOLVER, GTO+, etc.) solve abstracted bet-tree versions of specific spots; professional players study solver outputs and internalise frequency-based strategies rather than playing purely by feel.
- **Bet-size selection is a strategic weapon** — unlike limit hold'em, choosing between small, medium, and pot-sized bets lets you polarise or protect your range; solvers show that different board textures call for different sizing menus.
- **Balance your bluffs with your value bets** — a player who bets the river only with strong hands is exploited by folding; the equilibrium mixes bluffs into every bet size so that the opponent cannot profitably deviate.
- **Positional advantage is amplified by stack depth** — acting last post-flop allows the IP (in-position) player to control pot size and choose when to bluff; deep stacks magnify this advantage because the threat of large future bets is more credible.
- **3-bet / 4-bet ranges must include bluffs** — preflop re-raising ranges that contain only strong hands are easily countered by folding everything below the threshold; mix in suited connectors and suited aces as bluff candidates.
- **Exploit population leaks, not GTO** — against recreational players, pure GTO play leaves money on the table; identify systematic over-folds or over-calls and deviate from equilibrium to maximise expected value against that specific opponent.

## Engines & current best play

- **Strongest known program(s):** Libratus ([Brown & Sandholm, 2018](../references.md#brown-libratus2018)) and DeepStack ([Moravčík et al., 2017](../references.md#moravcik-deepstack2017)) — CFR-based re-solving with abstraction; GTO study tools include PioSOLVER and GTO+.
- **Strength:** Super-human at defeating top professionals in tournament-format matches.
- **Where the proof / tablebase lives (if solved):** Not formally solved; no full-game ε-Nash equilibrium computed — see [heads-up-limit-holdem.md](heads-up-limit-holdem.md) for the solved limit variant.
- **Notes:** Standard professional training now uses solver-generated strategies; the "equilibrium" studied is always an approximation over a discretised bet-size tree.

## Complexity

On the order of 10^160 game states, with an effectively continuous action space.
This is the central reason the full game is unsolved while the limit variant is
essentially solved.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Texas_hold_%27em) ([archive](http://web.archive.org/web/20260506223844/https://en.wikipedia.org/wiki/Texas_hold_%27em))
- [Brown & Sandholm (2018). *Superhuman AI for heads-up no-limit poker: Libratus beats top professionals*.](../references.md#brown-libratus2018)
- [Moravčík et al. (2017). *DeepStack: Expert-level artificial intelligence in heads-up no-limit poker*.](../references.md#moravcik-deepstack2017)

## See also

- [Heads-up limit hold'em](heads-up-limit-holdem.md) · [Liar's dice](liars-dice.md)
- Lexicon: [Nash equilibrium](../lexicon/README.md#nash-equilibrium) · [solving vs. strong play](../lexicon/README.md#solving-vs-strong-play) · [game-tree complexity](../lexicon/README.md#game-tree-complexity)
