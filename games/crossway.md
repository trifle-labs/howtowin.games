# Crossway

> A drawless connection game where a "no checkerboard pattern" rule rules out
> draws — first-player win by strategy stealing.

| Field | Value |
|-------|-------|
| Also known as | Crossway |
| Players | 2 |
| Type | Partisan connection game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Ultra-weakly solved **[verify]** |
| **Game-theoretic value** | First-player win |
| Year solved | — |
| Solved by | Strategy-stealing argument (Mark Steere & connection-game community) |
| State-space complexity | Comparable to Hex |
| Game-tree complexity | Large |

## Description

Crossway (Mark Steere, 2007) is a connection game on a square grid that uses a
clever rule to **prevent draws**: a player may not create a 2×2 "checkerboard"
pattern. Combined with a Hex-style connection win condition, this guarantees
exactly one player connects.

## Rules

1. Square board (commonly 19×19, but any size works). Each player owns two
   opposite sides.
2. Players alternate placing one stone of their colour on any empty cell, with
   one restriction: the move **must not create any 2×2 block of cells with a
   checkerboard pattern** of the two colours.
3. The first player to form a connected chain of their stones linking their two
   sides wins. (Orthogonal *and* diagonal connection both count.)
4. Draws are impossible.

## Solution status

Ultra-weakly solved by strategy-stealing: drawless plus symmetric makes it a
**first-player win**. **[verify]** the formal statement — Crossway's strategy-
stealing argument is community-folklore rather than a formal paper. As with
[Hex](hex.md) and [Y](y.md), the proof is non-constructive.

## Consensus on optimal play

- **First player wins with optimal play (strategy stealing)** — the game is provably a first-player win; use the swap (pie) rule in competitive play to restore fairness.
- **Treat the no-checkerboard restriction as a dual-use tool** — the restriction prevents you from creating a 2×2 checkerboard pattern, but it equally prevents your opponent; spots where your opponent is blocked from playing (because placing there would create a checkerboard) are free real estate — probe those areas.
- **Diagonal connections count equally with orthogonal** — unlike many connection games, both diagonal and orthogonal adjacency form a path; this makes connection easier to achieve and means your threat detection must account for diagonal chains.
- **Build broad chains rather than narrow lines** — a chain two or more cells wide is harder to cut than a single-cell corridor; investing extra stones to widen your connection makes it more robust against the checkerboard restriction interfering with a thin path.
- **Virtual connection reasoning from Hex applies at the path level** — groups with two disjoint connecting paths to the goal are virtually connected; once established, these cannot both be cut simultaneously.

## Engines & current best play

- **Strongest known program(s):** No game-specific public engine known to the cataloguer. Playable in general-purpose abstract-game frameworks (e.g., [Ludii](https://ludii.games/)).
- **Strength:** Not benchmarked.
- **Notes:** Crossway has a small community of connection-game enthusiasts but no dedicated published engine; its ultra-weak solution (first-player win) rests on a strategy-stealing argument that is community folklore rather than a peer-reviewed proof.

## Complexity

Comparable to Hex on the same board size.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Crossway_(game))
- [Schensted & Titus (1975). *Mudcrack Y and Poly-Y*.](../references.md#schensted-titus1975) (general framework for drawless connection games)

## See also

- [Hex](hex.md) · [Y](y.md) · [Gonnect](gonnect.md) · [Havannah](havannah.md)
- Lexicon: [ultra-weakly solved](../lexicon/README.md#ultra-weakly-solved) · [strategy-stealing argument](../lexicon/README.md#strategy-stealing-argument)
