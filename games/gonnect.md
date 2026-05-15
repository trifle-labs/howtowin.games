# Gonnect

> A Go-based connection game on the Go board — ultra-weakly solved as a
> first-player win by strategy stealing.

| Field | Value |
|-------|-------|
| Also known as | Gonnect |
| Players | 2 |
| Type | Partisan connection game on a Go board |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Ultra-weakly solved |
| **Game-theoretic value** | First-player win |
| Year solved | 2000 |
| Solved by | João Pedro Neto (strategy-stealing) |
| State-space complexity | Comparable to Go on the same board |
| Game-tree complexity | Large |

## Description

Gonnect (João Pedro Neto, 2000) plays on a Go board and uses Go's capture rules,
but with a **Hex-style connection win condition**: connect any two opposite
sides of the board. Combining Go captures with a connection goal makes a game
with rich tactics in a small ruleset.

## Rules

1. Go board (commonly 13×13 or 19×19).
2. Players alternate placing one stone of their colour on an empty intersection,
   subject to Go's no-suicide rule and an extra no-pass rule: a player must
   move if any legal move exists.
3. Standard Go captures: a group with no liberties is removed.
4. The first player to form a connected group spanning their two opposite sides
   (orthogonal connection) wins. If a player has **no legal move**, they win
   (no-passing forced-no-move rule). The ko rule applies.

## Solution status

Ultra-weakly solved: the **first player wins** by a strategy-stealing argument
[(Neto, 2000)](../references.md#schensted-titus1975) **[verify]** — Gonnect
cannot be drawn (the win condition is symmetric and an extra stone never hurts).
The proof is non-constructive.

## Consensus on optimal play

- **Build groups with multiple connection paths** — a single-path chain across the board is easily cut by captures; maintain at least two separate pathways to each side so the opponent must deal with both simultaneously.
- **Exploit the no-pass rule** — unlike Go, you cannot pass; creating positions where any opponent move either completes your connection or puts their own group in atari can be decisive.
- **Prioritise liberties in contested areas** — because groups can be captured Go-style, a connection attempt through a low-liberty group is fragile; connect through living or unkillable groups whenever possible.
- **Cutting the opponent's chain is often better than extending yours** — inserting a stone that divides the opponent's path forces them to rescue one branch, letting you extend the other leg of your connection uncontested.
- **Central stones serve both connection directions** — a stone in the middle of the board contributes to horizontal and vertical connection alike; edge stones commit to only one side.

## Engines & current best play

- **Strongest known program(s):** No game-specific public engine known to the cataloguer. Playable in general-purpose abstract-game frameworks (e.g., [Ludii](https://ludii.games/)).
- **Strength:** Not benchmarked.
- **Where the proof / tablebase lives (if solved):** Ultra-weak solution (first-player win) via strategy-stealing argument; no constructive proof or tablebase.
- **Notes:** The strategy-stealing proof is non-constructive; the actual winning strategy for the first player is not known.

## Complexity

Comparable to Go on the same board.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Gonnect) ([archive](http://web.archive.org/web/20260315150103/https://en.wikipedia.org/wiki/Gonnect))
- [Schensted & Titus (1975). *Mudcrack Y and Poly-Y*.](../references.md#schensted-titus1975) (general framework for connection-game strategy stealing)

## See also

- [Hex](hex.md) · [Go](go.md) · [Crossway](crossway.md)
- Lexicon: [ultra-weakly solved](../lexicon/README.md#ultra-weakly-solved) · [strategy-stealing argument](../lexicon/README.md#strategy-stealing-argument)
