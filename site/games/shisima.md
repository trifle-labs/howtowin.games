# Shisima

> A Kenyan three-in-a-row game on an octagonal board. Solved with perfect play: it is a draw.

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
| **Playable** | shisima |

## Description

A traditional Tiriki (Kenyan) game played on an octagonal board: a centre point and eight points around it, with lines from the centre to each outer point and between neighboring outer points. "Shisima" means "body of water" — the centre is called "the pond."

## Rules

1. Board: 9 points (1 centre + 8 around it) connected by lines from the centre and around the ring.
2. Each player has 3 stones. There is no placement phase — both players start with three stones already on opposite outer starting positions, and the centre is empty.
3. Players take turns sliding one of their stones along a line to a neighboring empty point.
4. A player wins by making **three in a row that goes through the centre**.

## Solution status

Strongly solved by trivial enumeration; **draw** with correct play. The very
small state space and the requirement that any winning line pass through the
centre give an easy pairing strategy for whichever player is on the defensive.

## Consensus on optimal play

- **All winning lines go through the centre** — only a three-in-a-row that includes the centre point wins. Controlling or blocking the centre is the most important thing.
- **Block the centre when the opponent threatens** — if the opponent has two stones lined up to use the centre for a winning line, move into the centre right away to block.
- **Keep your stones one step from the centre** — stones on outer ring points next to the centre can enter it in one move. Staying "one step away" keeps your winning threats alive.
- **Use the pairing strategy to force a draw** — the defender can always mirror the attacker using a pairing of ring positions. If you understand this, you never have to lose against a correct defender.
- **Draw is the right result** — neither player can force a win with perfect play. Real games are about getting the opponent to make a mistake.

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
