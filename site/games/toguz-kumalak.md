# Toguz Kumalak

> Central Asian mancala with capture by parity — unsolved.

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

## Description

Toguz Kumalak (Kazakh: "nine pebbles") is the national mancala game of
Kazakhstan and Kyrgyzstan, played on a board of two rows of nine holes plus
two large stores ("kazans"). Each small hole starts with nine pebbles, giving
162 pebbles total.

## Rules

1. Board: 9 small pits per player plus one **kazan** (store) per player. Each
   small pit starts with 9 pebbles (162 total).
2. On a turn the player picks up all pebbles from one of their own pits and
   sows them one per pit counterclockwise, starting **with the same pit** if
   it held more than one pebble (otherwise into the next pit).
3. **Capture**: if the last pebble lands in an opponent's pit and makes the
   total there **even**, all pebbles in that pit are captured to the player's
   kazan.
4. **Tuzdyk** (special hole): a player may claim one of the opponent's pits as
   a permanent capturing pit under specific conditions; all pebbles sown to a
   tuzdyk go to that player's kazan. Each player can have at most one tuzdyk
   and not symmetrically placed.
5. Game ends when one side cannot move; remaining pebbles go to the other
   side's kazan. Most pebbles wins.

## Solution status

Toguz Kumalak is **not solved**. Engines have been developed for
international competition but no game-theoretic value is published.

## Consensus on optimal play

- **Claim a tuzdyk on a loaded pit** — securing a tuzdyk (permanent capturing pit) on one of the opponent's busiest pits generates a steady stream of captured pebbles for the rest of the game; time the tuzdyk claim when the target pit holds many pebbles.
- **Target even-count opponent pits** — the capture rule triggers when the final pebble lands in an opponent's pit and makes it even; count ahead to find sowing distances that land on opponent pits with an odd current count, since adding one pebble makes them even.
- **Manage your kazan lead, not just the current sow** — Toguz Kumalak is a pebble-majority game; favour moves that increase your kazan count even if they forgo an immediate capture, as small steady gains compound.
- **Keep large pits for long-range sowing** — a pit with many pebbles lets you sow past the midpoint and into the opponent's half of the board, threatening captures or enabling tuzdyk conditions that a short sow cannot reach.
- **Prevent the opponent's tuzdyk** — the conditions for claiming a tuzdyk are specific (landing with an odd number ≥ 3 in a pit not directly opposite your own tuzdyk); track when the opponent is one sow away from meeting those conditions and disrupt it.

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
