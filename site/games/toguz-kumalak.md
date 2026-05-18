# Toguz Kumalak

> A Central Asian mancala game where players capture pebbles by making an opponent's pit have an even number. It has not been solved.

| Field | Value |
|-------|-------|
| Also known as | Toguz Korgool (Kyrgyz) |
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
| **Playable** | toguz-kumalak |

## Description

Toguz Kumalak (which means "nine pebbles" in Kazakh) is the national mancala game of Kazakhstan and Kyrgyzstan. It is played on a board with two rows of nine holes each, plus two large stores (called kazans). Each small hole starts with nine pebbles, for 162 pebbles total.

## Rules

1. Board: 9 small pits per player plus one kazan (store) per player. Each small pit starts with 9 pebbles (162 total).
2. On a turn, the player picks up all pebbles from one of their own pits and sows them one per pit counterclockwise, starting with the same pit if it held more than one pebble, otherwise into the next pit.
3. Capture: if the last pebble lands in an opponent's pit and makes the total there an even number, all pebbles in that pit are captured to the player's kazan.
4. Tuzdyk (special hole): a player may claim one of the opponent's pits as a permanent capturing pit under specific conditions. All pebbles sown into a tuzdyk go to that player's kazan. Each player can have at most one tuzdyk, and it cannot be placed symmetrically to the opponent's.
5. The game ends when one side cannot move. Remaining pebbles go to the other side's kazan. Whoever has the most pebbles wins.

## Solution status

Toguz Kumalak is **not solved**. Engines have been developed for
international competition but no game-theoretic value is published.

## Consensus on optimal play

- **Claim a tuzdyk (special hole) on a heavily loaded pit** — getting a tuzdyk on one of the opponent's busiest pits gives you a steady stream of captured pebbles for the rest of the game. Time your tuzdyk claim for when the target pit holds many pebbles.
- **Target opponent pits that will become even** — the capture rule triggers when the last pebble lands in an opponent's pit and makes the total even. Count ahead to find sowing distances that land on opponent pits with an odd current count (since adding one pebble makes them even).
- **Manage your overall lead, not just the current move** — Toguz Kumalak is about who has the most pebbles. Favor moves that increase your store count even if they pass up an immediate capture, since small steady gains add up.
- **Keep large pits for long-range sowing** — a pit with many pebbles lets you sow past the midpoint into the opponent's side, threatening captures or setting up a tuzdyk that a short sow cannot reach.
- **Prevent the opponent from claiming a tuzdyk** — the conditions for claiming a tuzdyk are specific. Watch for when the opponent is one move away from meeting those conditions and disrupt their plan.

## Engines & current best play

- **Strongest known program(s):** Competition engines developed for Central Asian Toguz Kumalak tournaments (no widely available open-source implementation known to the cataloguer).
- **Strength:** Competitive with strong human players; used for national-level training in Kazakhstan and Kyrgyzstan.
- **Where the proof / tablebase lives (if solved):** —
- **Notes:** Toguz Kumalak is an official sport in Kazakhstan and Kyrgyzstan; competitive play has a well-developed opening and endgame theory, though no formal game-theoretic solution has been published.

## Complexity

Large.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Toguz_korgool) ([archive](http://web.archive.org/web/20260113231550/https://en.wikipedia.org/wiki/Toguz_korgool))
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)

## See also

- [Awari](awari.md) · [Bao](bao.md) · [Kalah](kalah.md) · [Oware](awari.md)
- Lexicon: [partisan game](../lexicon/README.md#partisan-game)
