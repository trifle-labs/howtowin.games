# Skat

> A German three-player card game where players bid to become the solo player and try to win more points than the two opponents.

| Field | Value |
|-------|-------|
| Also known as | Skat |
| Players | 3 |
| Type | Trick-taking, imperfect information |
| Perfect information | No (private hands) |
| Chance element | Yes (random deal) |
| **Solution status** | Double-dummy values for all deals enumerated (Kupferschmid & Helmert, 2006); the full information-set game is unsolved |
| **Game-theoretic value** | Per-deal double-dummy values known |
| Year solved | 2006 (declarer DD result) |
| Solved by | Sebastian Kupferschmid, Malte Helmert |
| State-space complexity | ~10^11 deal × bidding states |
| Game-tree complexity | Large under information sets |

## Description

Skat is the national card game of Germany. It uses a 32-card deck and a complex system of bidding and play. In 2006, researchers computed the result of every possible deal assuming all cards are visible (called "double-dummy"), effectively solving the card-play phase of the game as a perfect-information problem.

## Rules

1. Deck: 32 cards (7, 8, 9, 10, Jack, Queen, King, Ace in four suits).
2. Each player is dealt 10 cards; 2 cards form the skat (a separate pile, also called the talon).
3. Bidding: players bid for the right to become the declarer (the solo player). The highest bidder takes the skat, discards two cards, and chooses what type of game to play (suit, grand, null, etc.).
4. Play: 10 tricks of three cards each. Standard trick-taking rules apply — players must follow suit when possible, and certain cards act as trumps. Jacks are always trumps in suit and grand games.
5. The declarer plays alone against the other two players as a team. Scoring depends on the contract value, the sequence of jacks (called Spitzen), the points captured, and the bidding level reached.

## Solution status

The double-dummy decision problem for any Skat deal — assuming open hands —
is fully tabulated (Kupferschmid & Helmert 2006). The full imperfect-info
game (bidding + uncertain card play) is **not solved**.

## Consensus on optimal play

- **Jacks are universal trumps** — the four jacks are the highest trumps in most game types. Building your hand around them gives you the strongest trump sequences and increases your potential score.
- **Count your running jacks (Spitzen) accurately before bidding** — the number of consecutive jacks you hold (starting from the club jack) affects the game's multiplier value. Overbidding because you miscounted your jack sequence is the most common bidding mistake.
- **Null contracts need perfect dodging** — in Null, the declarer must take zero tricks. Any card that forces you to win a trick is fatal. Hold only low cards in suits where you can safely pass the lead to opponents.
- **The two defenders coordinate with signals** — on opening leads, defenders should signal which suits they have length in. Setting up a winning long suit or getting a ruff requires communication through card choice.
- **Check double-dummy analysis after the game** — after playing, compare your play to the perfect play line assuming all cards were visible. If you often deviate from the optimal line, you have a technical weakness to work on.

## Engines & current best play

- **Strongest known program(s):** Kupferschmid & Helmert Monte-Carlo simulation engine (2006); commercial Skat programs such as RoSKAt.
- **Strength:** Strong amateur to near-expert in open-hand (double-dummy) play; significantly weaker than top humans in the full imperfect-information game.
- **Where the proof / tablebase lives (if solved):** Kupferschmid & Helmert (2006) — double-dummy enumeration of all deals; [Wikipedia](https://en.wikipedia.org/wiki/Skat_(card_game))
- **Notes:** The double-dummy result covers perfect-information play only; the full bidding + uncertain-hand game remains unsolved.

## Complexity

Large.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Skat_(card_game))
- [Kupferschmid & Helmert (2006). *A Skat Player Based on Monte-Carlo Simulation*.](../references.md#ueda-skat2009)

## See also

- [Bridge](bridge.md) · [Hanabi](hanabi.md)
- Lexicon: [imperfect information](../lexicon/README.md#imperfect-information)
