# Pente

> Five-in-a-row with custodial captures — the capture rule makes it richer than
> Gomoku, and it remains unsolved.

| Field | Value |
|-------|-------|
| Also known as | Pente (a commercial development of the traditional game ninuki-renju) |
| Players | 2 |
| Type | Partisan positional (k-in-a-row) game with captures |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Unsolved |
| **Game-theoretic value** | Unknown |
| Year solved | — |
| Solved by | — |
| State-space complexity | Large (typically a 19×19 board) |
| Game-tree complexity | Large |

## Description

Played on a 19×19 grid. Players alternately place stones, aiming for **five in
a row**. The twist is **custodial capture**: a pair of your stones flanked
exactly on both ends by enemy stones is captured and removed. A player can also
win by making **five captures** (ten captured stones). The capture rule means
stones are not permanent — distinguishing Pente sharply from
[Gomoku](gomoku.md).

## Solution status

Pente is **unsolved**. The capture mechanic both enlarges the effective state
space (stones can leave the board and the same cell be re-contested) and breaks
the [threat-space search](../lexicon/README.md#proof-number-search) techniques
that cracked Gomoku, since a "permanent" threat can be undone by a capture. The
first player is widely believed to have a significant advantage on the standard
board — strong enough that tournament rule sets restrict the first player's
early moves — but no game-theoretic value has been proven.

## Consensus on optimal play

- **Keep a dual win-threat alive** — always maintain at least one viable path to five-in-a-row AND a realistic race to five capture-pairs; an opponent who must defend both simultaneously will fail to stop one.
- **Control the 5-capture race** — captures simultaneously remove opponent material, advance your win counter, and reduce the opponent's capture count; threatening a capture on every other move pressures the opponent continuously.
- **Build immune rows** — a potential five-in-a-row where both flanks are guarded against bracketing is "immune" to capture disruption; look for patterns where the endpoint stones cannot be sandwiched.
- **Opening restriction exists because first player is too strong** — tournament rules restrict the first player's third stone to the fifth intersection or further out; respect this by not trivially exploiting the opening in casual play.
- **Defend captures with counter-captures** — when the opponent threatens to bracket your pair, the fastest defence is often a counter-threat that forces them to protect their own pair rather than execute the capture.

## Engines & current best play

- **Strongest known program(s):** Pente Planet bots (online community engines) and custom alpha-beta search programs.
- **Strength:** Strong amateur; competitive with experienced human players but no engine is known to be definitively super-human.
- **Where the proof / tablebase lives (if solved):** Not solved; no tablebase.
- **Notes:** No formal solution; opening restrictions in the strongest tournament formats (e.g. the "tournament opening" rule) reflect practical acknowledgment of first-player strength.

## Complexity

Large; the 19×19 board plus captures puts it well beyond current exhaustive
solving.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Pente)
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002) (general framework)

## See also

- [Gomoku](gomoku.md) · [Renju](renju.md) · [Connect6](connect6.md)
- Lexicon: [first-player advantage](../lexicon/README.md#first-player-advantage)
