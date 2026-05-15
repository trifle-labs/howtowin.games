# Bridge

> The classical trick-taking game — unsolved as a competitive game.

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

Bridge is the canonical 4-player partnership trick-taking game. Two phases —
**bidding** (an information-revealing auction for the contract) and
**play** (taking tricks against the contract) — combine into a game with
hidden information, partner inference, and probabilistic squeeze play.
"Solving" bridge in any robust sense remains an open problem; computer
double-dummy solvers handle single-hand analysis where all cards are visible.

## Rules

1. Players: 4, sitting as two opposing partnerships (N–S vs. E–W); a standard
   52-card deck is dealt 13 cards to each.
2. **Bidding**: starting with the dealer, each player makes a "bid" (a level
   1–7 and a denomination of one of four suits or No-Trump), passes, doubles,
   or redoubles. Bidding continues until three consecutive passes; the final
   bid becomes the **contract**.
3. The opener's left-hand opponent leads to the first trick; the partner of
   the declaring player puts their hand face-up as **dummy**.
4. **Play**: 13 tricks; standard trick-taking rules — must follow suit, may
   trump if no suit card, highest card of led suit (or highest trump) wins.
5. Scoring: the declaring side scores points based on contract level and
   bonuses (game/slam/honours/vulnerability). The non-declaring side scores
   for setting the contract.

## Solution status

Bridge is **not solved**. The hidden-information and partnership-signalling
aspects mean optimality is best framed in equilibrium terms; the
double-dummy (open-hands) restriction has been well analysed by
combinatorial solvers (e.g., Bo Haglund's `dds` library).

## Consensus on optimal play

- **Bid to the correct level based on combined partnership strength** — game contracts (3NT, 4♥, 4♠, 5♣/♦) score a large bonus; the key threshold is roughly 25+ high-card points for 3NT/4-of-a-major, 33+ for small slam; bidding short or past this threshold wastes or overspends the hand's value.
- **Plan the play before playing to trick one** — the declarer should count winners and losers before leading from dummy; a plan that avoids blocking suit entries or prematurely releasing key controls prevents many avoidable defeats.
- **Count the hand as a defender** — both defenders should track which high cards have appeared and infer from partner's signals (attitude, count, suit-preference leads) where the remaining honours sit; this inference replaces the missing full information.
- **Signals and leads follow standard agreements** — standard fourth-best leads, attitude signals on partner's lead, and count signals when declarer draws trumps allow both defenders to build an accurate picture of the hidden cards; deviating from agreed signals hands declarer an inference advantage.
- **Double-dummy analysis gives the absolute best play for each hand** — when all hands are known (e.g., post-deal analysis), the `dds` library computes the maximum tricks achievable for every possible contract; this is the gold standard for evaluating defensive or declaring errors.

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
