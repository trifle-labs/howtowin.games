# Pente

> Five-in-a-row with captures by surrounding. The capture rule makes it deeper than Gomoku, and it is still unsolved.

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
| **Playable** | pente |

## Description

Played on a 19x19 grid. Players take turns placing stones, trying to get **five in a row**. The special rule is **custodial capture**: if two of your stones are surrounded on both ends by enemy stones (in a straight line), those two stones are captured and removed. A player can also win by making **five captures** (capturing ten stones total). Because stones can be removed, Pente is very different from [Gomoku](gomoku.md) where stones stay put.

## Solution status

Pente is **unsolved**. The capture mechanic both enlarges the effective state
space (stones can leave the board and the same cell be re-contested) and breaks
the [threat-space search](../lexicon/README.md#proof-number-search) techniques
that cracked Gomoku, since a "permanent" threat can be undone by a capture. The
first player is widely believed to have a significant advantage on the standard
board — strong enough that tournament rule sets restrict the first player's
early moves — but no game-theoretic value has been proven.

## Consensus on optimal play

- **Keep both winning paths alive** — always have at least one path to five-in-a-row AND a realistic race to five captures. If the opponent has to defend both at the same time, they will fail to stop one.
- **Control the capture race** — captures remove enemy stones, bring you closer to winning by captures, and reduce the opponent's capture count. Threatening a capture on every other move puts constant pressure on the opponent.
- **Build capture-proof rows** — if a five-in-a-row is protected at both ends so it cannot be surrounded, it is immune to capture disruption. Look for patterns where the end stones cannot be sandwiched.
- **The opening is restricted because the first player is too strong** — tournament rules force the first player's third stone to be placed at least five intersections away or further. Do not try to exploit the opening trivially in casual play.
- **Counter-capture to defend** — when the opponent is about to surround your pair, the fastest defence is often to threaten a capture of your own, forcing them to protect their own pair instead.

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
