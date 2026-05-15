# Skat

> German three-player trick-taking game — declarer-side double-dummy values tabulated.

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

Skat is the German national card game: three players, a 32-card deck, and a
complex bidding-and-play system. Kupferschmid & Helmert (2006) computed the
**double-dummy value of every possible Skat deal** — i.e., perfect-play
outcomes assuming open hands — establishing a kind of perfect-information
solving of the play-out phase.

## Rules

1. Deck: 32 cards (7, 8, 9, 10, J, Q, K, A in four suits).
2. Each player is dealt 10 cards; 2 cards form the **skat** (talon).
3. **Bidding**: players bid for the right to be declarer; the high bidder
   takes the skat (in standard contracts), discards two cards, and chooses a
   game (suit, grand, null, etc.).
4. **Play**: 10 tricks of three cards each; standard trick-taking rules
   (follow suit; trump card winners; jacks are trumps in suit and grand
   games).
5. The declarer plays against the partnership of the other two players.
   Scoring depends on contract value, the *Spitzen* (jack sequence), points
   captured, and bidding milestones.

## Solution status

The double-dummy decision problem for any Skat deal — assuming open hands —
is fully tabulated (Kupferschmid & Helmert 2006). The full imperfect-info
game (bidding + uncertain card play) is **not solved**.

## Consensus on optimal play

- **Jacks are universal trumps** — the four jacks are the highest trumps in suit and grand contracts; building your hand around them provides the most powerful top-of-trump sequences (Spitzen) and increases contract value.
- **Count Spitzen accurately before bidding** — the multiplier for Spitzen (the unbroken sequence from club jack down) directly affects game value; overbidding because of a Spitzen miscalculation is the most common bidding error.
- **Null contracts need perfect "anti-patterns"** — in Null the declarer must take zero tricks; any card that forces a win is fatal; hold only "dodging" cards (low suits where you can safely pass to opponents).
- **The partnership coordinates with signals** — the two defenders should signal suit length on opening leads; getting a ruff set up or establishing a long suit requires communication through card choice.
- **Use double-dummy analysis for post-mortem** — after the game, check whether the declarer's play matched the DD-optimal line; systematic deviation from DD recommendations reveals technical leaks.

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
