# Shisima

> The Kenyan three-in-a-row game on an octagonal board — strongly solved as a
> draw.

| Field | Value |
|-------|-------|
| Also known as | Shisima |
| Players | 2 |
| Type | Partisan placement+movement game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Strongly solved |
| **Game-theoretic value** | Draw |
| Year solved | folklore |
| Solved by | Exhaustive enumeration |
| State-space complexity | Tiny |
| Game-tree complexity | Tiny |

## Description

A traditional Tiriki (Kenyan) game played on an octagonal board: a central
point and eight points around it, with lines from the centre to each outer
point and between adjacent outer points. "Shisima" means "body of water" — the
centre is "the pond."

## Rules

1. Board: 9 points (1 centre + 8 around it) connected by lines from the centre
   and around the ring.
2. Each player has 3 stones; the **placement phase** is skipped — both players
   start with three stones already on opposite outer "starting" positions, and
   the centre is empty.
3. Players alternate sliding one of their stones along a line to an adjacent
   empty point.
4. A player wins by making **three in a row through the centre**.

## Solution status

Strongly solved by trivial enumeration; **draw** with correct play. The very
small state space and the requirement that any winning line pass through the
centre give an easy pairing strategy for whichever player is on the defensive.

## Consensus on optimal play

- **All winning lines pass through the centre** — only a three-in-a-row that includes the centre point wins; this means controlling or denying the centre is the single most important positional concern.
- **Block the centre when the opponent threatens it** — if the opponent has two stones aligned to use the centre for a winning line, move into the centre immediately to block.
- **Keep your stones within one move of the centre** — stones placed on outer ring points adjacent to the centre can enter the centre on the next move; staying "one step away" keeps winning threats alive.
- **The pairing strategy guarantees the draw** — the defender can always mirror the attacker's approach using a pairing of ring positions; understanding this means you need never lose against a correct defender.
- **Draw is the correct result** — neither player can force a win with correct play; competitive play aims to induce the opponent's error.

## Engines & current best play

- **Strongest known program(s):** No game-specific public engine known to the cataloguer; the full state graph is trivially enumerable.
- **Strength:** Perfect play by any complete minimax over the tiny state graph.
- **Where the proof / tablebase lives (if solved):** [Wikipedia](https://en.wikipedia.org/wiki/Shisima)
- **Notes:** A traditional Kenyan game; the draw with correct play is confirmed by exhaustive enumeration.

## Complexity

Tiny.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Shisima) ([archive](http://web.archive.org/web/20260203141438/https://en.wikipedia.org/wiki/Shisima))
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)

## See also

- [Picaria](picaria.md) · [Tapatan](tapatan.md) · [Three Men's Morris](three-mens-morris.md) · [Mū tōrere](mu-torere.md)
- Lexicon: [strongly solved](../lexicon/README.md#strongly-solved) · [pairing strategy](../lexicon/README.md#pairing-strategy)
