# Gonnect

> A combination of Go and the connection game Hex. The first player can always win, though we do not know the winning strategy.

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
| **Playable** | gonnect |

## Description

Gonnect (Joao Pedro Neto, 2000) is played on a Go board and uses Go's capture rules, but the winning condition comes from the game Hex: you must connect two opposite sides of the board with your stones. Combining Go-style captures with a connection goal creates a game with rich tactics from simple rules.

## Rules

1. Go board (commonly 13x13 or 19x19).
2. Players take turns placing one stone of their color on an empty intersection. You cannot place a stone that would immediately be captured (Go's no-suicide rule), and you must always make a move if any legal move exists (no passing).
3. Standard Go captures: a group with no empty neighboring points (liberties) is removed from the board.
4. The first player to form a connected group of stones linking their two opposite sides (up/down or left/right) wins. If a player has no legal move, they win instead (because passing is not allowed). The ko rule (a rule that prevents repeating the same board position) applies.

## Solution status

Ultra-weakly solved: the **first player wins** by a strategy-stealing argument
[(Neto, 2000)](../references.md#schensted-titus1975) **[verify]** — Gonnect
cannot be drawn (the win condition is symmetric and an extra stone never hurts).
The proof is non-constructive.

## Consensus on optimal play

- **Build groups with multiple connection paths** — a single-path chain across the board is easily cut by captures. Maintain at least two separate pathways to each side so the opponent must deal with both at once.
- **Use the no-passing rule** — unlike Go, you cannot pass. Creating positions where any move the opponent makes either completes your connection or puts their own group in danger (atari) can be decisive.
- **Keep liberties in contested areas** — because groups can be captured Go-style, a connection line that goes through a low-liberty group is fragile. Connect through living or unkillable groups when possible.
- **Cutting the opponent's path is often better than extending yours** — placing a stone that splits the opponent's path forces them to rescue one branch, letting you extend the other side of your connection without interference.
- **Center stones serve both connection directions** — a stone in the middle of the board helps both horizontal and vertical connection at once. Edge stones only help one side.

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
