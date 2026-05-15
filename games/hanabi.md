# Hanabi

> Cooperative card game of hidden information — unsolved.

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

Hanabi (Antoine Bauza, 2010) is a fully cooperative card game in which each
player holds their hand **facing away from themselves** — they see everyone
else's cards but not their own. The team works together to play fireworks
(suit colours in ascending order from 1 to 5) using limited information
tokens.

## Rules

1. Deck: 50 cards in 5 colours; each colour has three 1s, two each of 2/3/4,
   and one 5.
2. Each player is dealt a hand (4 or 5 cards depending on player count) held
   facing outward.
3. The team starts with 8 **information** tokens and 3 **fuse** tokens.
4. On a turn the active player does **one** of:
   - **Give a clue** (spends 1 information token): pick another player and
     indicate either a colour or a rank; identify all cards in that player's
     hand matching the clue.
   - **Discard a card** (returns 1 information token, up to the cap of 8).
   - **Play a card**: place it on the table starting (or continuing) a
     firework of its colour 1, 2, 3, 4, 5. A wrong play discards the card
     and burns 1 fuse token.
5. After a card is played or discarded, the player draws a new card if any
   remain.
6. Game ends when the deck is exhausted (one final round is played), all 5
   fireworks reach 5, or all 3 fuse tokens are spent. The score is the sum
   of the top card of each firework, max 25.

## Solution status

Hanabi is **not solved**. The cooperative-information aspect attracted
machine-learning research (DeepMind's Hanabi Learning Environment, 2019)
showing AI struggles with conventional human play.

## Consensus on optimal play

- **Clues should convey the most information possible** — in the H-group convention system, a clue carries meaning beyond its literal content ("this colour clue to the newest card means play it immediately"); teams pre-agree on conventions to pack maximum information into each token.
- **Protect 5s and unique cards** — cards that exist only once in the deck (each colour's 5, and any card whose duplicates have been discarded) are irreplaceable; clue or protect them before discarding becomes necessary.
- **The discard pile is a shared board state** — track discards carefully; a discarded card that makes a later play impossible changes the team's scoring ceiling and should inform clue priorities.
- **Save information tokens by discarding lowest-value unneeded cards** — when the information token pool is full (8) you must play or clue; maintain a 3–5 token reserve to avoid forced bad plays.
- **Finesse and prompt clues** — advanced convention: a clue pointing at a card in position N can implicitly tell an intermediate player that their newest unclued card is the "bridge" card to be played first; this allows complex sequences with a single token.
- **Never waste the last fuse token on a speculative play** — with one fuse token remaining, only play a card when the team has established its identity beyond doubt; the game ends on the third misplay.

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
