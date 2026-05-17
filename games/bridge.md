# Bridge

> The classic trick-taking card game with partnerships, bidding, and hidden information. Unsolved as a competitive game.

| Field | Value |
|-------|-------|
| Also known as | Contract bridge |
| Players | 4 (two partnerships) |
| Type | Trick-taking, imperfect information, partial-information |
| Perfect information | No (each hand is private) |
| Chance element | Yes (random deal) |
| **Solution status** | Unsolved as a full game; **double-dummy** (open hands) cases are computationally tractable |
| **Game-theoretic value** | Unknown |
| Year solved | — |
| Solved by | — |
| State-space complexity | ~10^29 deal × bidding state |
| Game-tree complexity | Enormous |

## Description

Bridge is a 4-player card game played with two partnerships (two teams of two).
It has two phases: **bidding** (an auction where players reveal information
about their hands and compete for the contract) and **play** (taking tricks to
try to meet the contract). The game involves hidden information, reading your
partner's signals, and probabilistic reasoning. "Solving" bridge in any
meaningful way is still an open problem. Computer "double-dummy" solvers can
analyze a single hand where all four players' cards are visible.

## Rules

1. Four players sit in two partnerships (North-South vs. East-West). A standard 52-card deck is dealt, 13 cards to each player.
2. **Bidding**: Starting with the dealer, players take turns making a "bid" (a number from 1-7 plus a suit or No-Trump), passing, doubling, or redoubling. Bidding ends after three consecutive passes. The final bid becomes the **contract**.
3. The player to the left of the opening bidder leads the first card. The partner of the declaring player then puts their hand face-up on the table as the **dummy** (to be played by the declarer).
4. **Play**: 13 tricks are played. Standard trick-taking rules apply: you must play a card of the suit that was led if you have one; if you don't, you may play a trump card. The highest card of the led suit (or the highest trump) wins the trick.
5. **Scoring**: The declaring partnership scores points based on the contract level plus bonuses (for game, slam, honors, vulnerability). The defending partnership scores points if the declaring side fails to make their contract.

## Solution status

Bridge is **not solved**. The hidden-information and partnership-signalling
aspects mean optimality is best framed in equilibrium terms; the
double-dummy (open-hands) restriction has been well analysed by
combinatorial solvers (e.g., Bo Haglund's `dds` library).

## Consensus on optimal play

- **Bid to the right level based on your partnership's combined strength** — game-level contracts (3NT, 4 hearts, 4 spades, 5 clubs/diamonds) give a big score bonus. The key threshold is about 25 or more "high-card points" for 3NT or a major suit game, and 33+ for a small slam. Bidding too low or too high wastes value.
- **Plan the play before the first card is led** — the declarer should count their winners and losers before playing from dummy. A plan that avoids blocking suit entries or wasting key cards prevents many avoidable losses.
- **Defenders: track the cards that have been played** — both defenders should keep track of which high cards have appeared and use their partner's signals (showing attitude, count, or suit preference) to figure out where the remaining honors are. This is how defenders make up for not seeing each other's cards.
- **Use standard signals and leads** — standard fourth-best leads, attitude signals on partner's lead, and count signals when declarer draws trumps help both defenders build an accurate picture of the hidden cards. Deviating from your agreed signals gives the declarer an advantage.
- **Double-dummy analysis shows perfect play for each hand** — when all hands are visible (for post-game analysis), computer solvers can calculate the maximum tricks possible for every contract. This is the gold standard for finding mistakes in defense or declaring.

## Engines & current best play

- **Strongest known program(s):** Double-dummy solver: Bo Haglund's `dds` library; full-game AI: NooK (DeepMind/Google), BBO (Bridge Base Online) AI bots.
- **Strength:** Double-dummy play is solved exactly; full-game bots are competitive with expert humans but not definitively stronger across all bidding and play situations.
- **Where the proof / tablebase lives (if solved):** `dds` is open-source; full-game bridge remains unsolved.
- **Notes:** Bridge is the hardest major card game to solve owing to its combination of hidden information, partnership communication (bidding system), and deep play; recent neural-network bots (NooK) have reached strong amateur level in full-game play.

## Complexity

Enormous in full form.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Contract_bridge) ([archive](http://web.archive.org/web/20260508033633/https://en.wikipedia.org/wiki/Contract_bridge))
- [Thompson, K. (1997). *Bridge-card analysis history*.](../references.md#thompson-bridge) **[verify]**

## See also

- [Skat](skat.md) · [Hanabi](hanabi.md)
- Lexicon: [imperfect information](../lexicon/README.md#imperfect-information)
