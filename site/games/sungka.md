# Sungka

> Filipino mancala with seven pits per side — unsolved.

| Field | Value |
|-------|-------|
| Also known as | Sungka, Chongkak (related variants) |
| Players | 2 |
| Type | Partisan mancala |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Unsolved |
| **Game-theoretic value** | Unknown |
| Year solved | — |
| Solved by | — |
| State-space complexity | Large |
| Game-tree complexity | Large |
| **Playable** | sungka |

## Description

Sungka is the traditional mancala of the Philippines, played on a board of 14
small "houses" (7 per side) plus two large home stores. The traditional
opening has both players moving simultaneously — a unique feature for a
mancala — though analysis typically considers the alternating version.

## Rules

1. Board: 7 small pits per player plus one **home** store per player.
2. Each small pit starts with 7 shells.
3. On a turn the player picks up all shells in one of their pits and sows
   them counterclockwise, dropping one into each pit and into the player's
   own home (but not the opponent's home).
4. If the last shell lands in the player's own home, the player goes again.
5. If the last shell lands in an empty pit on the player's own side, the
   player captures that shell plus all shells in the opposing pit directly
   across (the **sungka capture**).
6. If the last shell lands in an empty pit on the opponent's side, the turn
   ends with no capture.
7. Game ends when one side has no shells in any of their pits; remaining
   shells go to the other player's home. Most shells wins.

## Solution status

Sungka is **not solved**. The large state space and traditional simultaneous
opening complicate analysis.

## Consensus on optimal play

- **Maximise relay chains (extra turns)** — landing your last shell in your home store earns a free move; plan multi-pit sowing sequences that thread through your home repeatedly to compound tempo.
- **Feed your home store steadily** — seeding the store consistently throughout the game is more reliable than banking on a single massive capture; depleting your pits trying for one big capture leaves you vulnerable.
- **Bait empty-pit captures** — deliberately leave one of your own pits empty opposite a heavily loaded opponent pit, then sow into it with the last shell landing there to capture the opponent's pile.
- **Keep your far pits alive** — pits close to your home are easy to sow from; the far pit (pit 7) can send a large batch past the home and around to the opponent's side, making it valuable late in the game.
- **Deny the opponent relay chains** — watch which of their pits, when sown, would end in their home; if possible, fill or drain those pits before they can exploit the chain.

## Engines & current best play

- **Strongest known program(s):** No game-specific public engine known to the cataloguer. Playable in general-purpose abstract-game frameworks (e.g., [Ludii](https://ludii.games/)).
- **Strength:** Not benchmarked.
- **Where the proof / tablebase lives (if solved):** —
- **Notes:** Sungka has not been subject to formal game-theoretic analysis; the traditional simultaneous-opening variant adds further complexity absent from most mancala studies.

## Complexity

Large.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Sungka)
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)

## See also

- [Awari](awari.md) · [Bao](bao.md) · [Kalah](kalah.md) · [Oware](awari.md) · [Pallanguzhi](pallanguzhi.md)
- Lexicon: [partisan game](../lexicon/README.md#partisan-game)
