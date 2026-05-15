# Havannah

> A connection game with three different winning shapes — solved only on small
> boards.

| Field | Value |
|-------|-------|
| Also known as | Havannah |
| Players | 2 |
| Type | Partisan connection game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Partially solved (small boards) |
| **Game-theoretic value** | Unknown for tournament-size boards |
| Year solved | Small boards: 2000s–2010s |
| Solved by | Various (e.g. exhaustive search by computer-games researchers) |
| State-space complexity | Very large for tournament boards (base-10 hexagonal board) |
| Game-tree complexity | Very large |

## Description

Played on a hexagonal board of hexagons (tournament size: 10 cells per side).
Players alternately place stones. A player wins by completing any one of three
shapes: a **ring** (a loop around at least one cell), a **bridge** (connecting
two of the six corners), or a **fork** (connecting three of the six edges).

## Solution status

Havannah is **partially solved**: exhaustive search has settled small boards
(side length up to roughly 4–5 cells, depending on the study), and these tend
to be first-player wins. The tournament-size board is far too large for current
exhaustive methods and is **unsolved**. Havannah was for some years a noted
challenge for game AI — its large branching factor and the difficulty of
recognising the ring/bridge/fork goals made it resistant to classical search —
before Monte-Carlo tree search and later neural methods produced strong
players.

## Consensus on optimal play

- **Threaten multiple win shapes simultaneously** — a stone that advances toward both a fork and a bridge is much harder to counter than one aimed at a single goal; forcing the opponent to block two threats at once is the central attacking principle.
- **Corners are double-edged** — a corner counts as one edge point for a fork AND as a corner piece for a bridge; occupying or contesting corners early gives threats in both categories.
- **Respond to ring attempts aggressively** — rings require encircling at least one cell; if the opponent is building a loose loop, inserting a stone inside the potential ring breaks it; don't let rings grow uncontested.
- **Use the swap rule wisely** — if swap is in effect, the first move should occupy a modestly strong but not obviously dominant cell; too-powerful first moves will be swapped.
- **Keep groups connected** — disconnected stones give the opponent opportunities to cut and isolate; a network of stones with short bridge-connections (moving to adjacent hexes through two cells) maintains both fork and ring potential.
- **Deny the opponent's key junction cells** — cells where several of the opponent's groups would connect (completing a fork or bridge) are worth contesting even at material cost.

## Engines & current best play

- **Strongest known program(s):** No single dominant public engine; Wanderer and various MCTS-based programs competed in computer games tournaments (e.g., ICGA).
- **Strength:** Strong amateur to competitive; modern MCTS engines play well above casual human level.
- **Where the proof / tablebase lives (if solved):** Small boards (up to roughly side-5) solved by exhaustive search; tournament board unsolved.
- **Notes:** The swap rule is standard in competitive play; first player is generally considered advantaged on full boards.

## Complexity

Tournament board (271 cells): state and game-tree complexity comparable to
large connection games; precise standardised figures are not well established.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Havannah) ([archive](http://web.archive.org/web/20250906172227/https://en.wikipedia.org/wiki/Havannah))
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002) (general framework)

## See also

- [Hex](hex.md) · [Y](y.md) · [TwixT](twixt.md)
- Lexicon: [game-tree complexity](../lexicon/README.md#game-tree-complexity) · [partially solved](../lexicon/README.md#solved-game)
