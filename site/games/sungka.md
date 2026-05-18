# Sungka

> The traditional Filipino game of sowing and capturing shells with seven pits on each side.

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

Sungka is the traditional mancala game of the Philippines. It is played on a board with 14 small pits (7 per side) and two large home stores for each player. In the traditional version, both players move at the same time to start the game — an unusual feature for a mancala game — but most analysis uses the alternating-turn version.

## Rules

1. Board: 7 small pits per player plus one home store per player (also called "heads").
2. Each small pit starts with 7 shells.
3. On a turn, the player picks up all shells from one of their pits and sows (distributes) them counterclockwise, dropping one shell into each pit and into the player's own home store (but not the opponent's home store).
4. If the last shell lands in the player's own home store, the player gets another turn.
5. If the last shell lands in an empty pit on the player's own side, the player captures that shell plus all shells in the opposing pit directly across (this is called the sungka capture).
6. If the last shell lands in an empty pit on the opponent's side, the turn ends with no capture.
7. The game ends when one side has no shells in any of their pits. All remaining shells go to the other player's home store. Whoever has the most shells wins.

## Solution status

Sungka is **not solved**. The large state space and traditional simultaneous
opening complicate analysis.

## Consensus on optimal play

- **Set up extra turns (relay chains)** — landing your last shell in your home store gives you a free move. Plan your sowing so that you pass through your home store multiple times, giving you extra moves in a row.
- **Feed your home store steadily** — adding shells to your home store consistently throughout the game is more reliable than hoping for a single big capture. Emptying your pits to go for one large capture leaves you vulnerable.
- **Bait empty-pit captures** — deliberately leave one of your own pits empty, directly across from a heavily loaded opponent pit. Then sow a move that lands your last shell in that empty pit to capture the opponent's pile.
- **Keep your far pits active** — pits near your home are easy to sow from. The farthest pit can send a large batch of shells past your home and around to the opponent's side, which is valuable late in the game.
- **Deny the opponent extra turns** — watch which of the opponent's pits, if sown, would end in their home store. If possible, fill or drain those pits before the opponent can use them to get extra turns.

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
