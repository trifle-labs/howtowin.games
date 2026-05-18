# Hanabi

> A cooperative card game where you can see everyone's hand but your own. The team works together to play cards in order.

| Field | Value |
|-------|-------|
| Also known as | Hanabi |
| Players | 2–5 (fully cooperative) |
| Type | Cooperative imperfect-information card game |
| Perfect information | No (each player sees others' cards but not their own) |
| Chance element | Yes (shuffle and draw) |
| **Solution status** | Unsolved |
| **Game-theoretic value** | Unknown (cooperative — expected max score) |
| Year solved | — |
| Solved by | — |
| State-space complexity | Large |
| Game-tree complexity | Large |

## Description

Hanabi (Antoine Bauza, 2010) is a fully cooperative card game where each player holds their hand facing away from themselves — they see everyone else's cards but not their own. The team works together to play fireworks (suits of cards in ascending order from 1 to 5) using limited information tokens.

## Rules

1. Deck: 50 cards in 5 colors; each color has three 1s, two each of 2/3/4, and one 5.
2. Each player is dealt a hand (4 or 5 cards depending on player count) held facing outward.
3. The team starts with 8 information tokens and 3 fuse tokens.
4. On a turn the active player does one of:
   - Give a clue (costs 1 information token): pick another player and point out either a color or a number; show all cards in that player's hand matching the clue.
   - Discard a card (returns 1 information token, up to the maximum of 8).
   - Play a card: place it on the table starting (or continuing) a firework of its color 1, 2, 3, 4, 5. Playing a wrong card discards it and costs 1 fuse token.
5. After a card is played or discarded, the player draws a new card if any remain.
6. The game ends when the deck runs out (one final round is played), all 5 fireworks reach 5, or all 3 fuse tokens are used up. The score is the sum of the top card of each firework, maximum 25.

## Solution status

Hanabi is **not solved**. The cooperative-information aspect attracted
machine-learning research (DeepMind's Hanabi Learning Environment, 2019)
showing AI struggles with conventional human play.

## Consensus on optimal play

- **Clues should carry the most information possible** — in standard convention systems, a clue means more than just its literal content ("this color clue on the newest card means play it immediately"). Teams agree on conventions beforehand to pack maximum information into each token.
- **Protect 5s and unique cards** — cards that exist only once in the deck (each color's 5, and any card whose duplicates have already been discarded) are irreplaceable. Give clues about them or protect them before discarding becomes necessary.
- **The discard pile tells you what is gone** — track discards carefully. A discarded card that makes a later play impossible changes the team's scoring ceiling and should affect which clues you give.
- **Save information tokens by discarding low-value unneeded cards** — when the information token pool is full (8) you must play or give a clue. Keep a reserve of 3-5 tokens to avoid forced bad plays.
- **Finesse and prompt clues** — advanced technique: a clue pointing at one card can implicitly tell another player to play their newest unclued card first. This allows complex sequences with a single token.
- **Never waste the last fuse token on a guess** — with one fuse token remaining, only play a card when the team has confirmed its identity beyond doubt. The game ends on the third wrong play.

## Engines & current best play

- **Strongest known program(s):** WTFWhere (competitive self-play agent) and various DeepMind/academic bots (Sad, SmartBot) from the Hanabi Learning Environment benchmark.
- **Strength:** Top self-play agents score near-perfect (24–25/25) against other bots of the same convention but underperform when paired with humans using different conventions.
- **Where the proof / tablebase lives (if solved):** Not solved; DeepMind's Hanabi Learning Environment (2019) is the standard benchmark.
- **Notes:** Human-AI cooperative play is an active research challenge; the game's hidden-information structure makes cross-agent generalisation hard.

## Complexity

Large.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Hanabi_(card_game)) ([archive](http://web.archive.org/web/20260306094445/https://en.wikipedia.org/wiki/Hanabi_(card_game)))
- [Yoshizoe et al. *Hanabi study (2019).*](../references.md#yoshizoe-hanabi) **[verify]**

## See also

- [Bridge](bridge.md) · [Skat](skat.md)
- Lexicon: [imperfect information](../lexicon/README.md#imperfect-information)
