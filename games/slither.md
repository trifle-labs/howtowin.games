# Slither

> A modern connection-with-sliding game — unsolved.

| Field | Value |
|-------|-------|
| Also known as | Slither |
| Players | 2 |
| Type | Partisan connection game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Unsolved |
| **Game-theoretic value** | Unknown |
| Year solved | — |
| Solved by | — |
| State-space complexity | Large |
| Game-tree complexity | Large |

## Description

Slither (Corey Clark, 2010s) is a connection game played on a square grid with
**no diagonal-touching** restriction and an additional **sliding** move. The
balance between the placement and sliding rules gives a different feel from
[Hex](hex.md) — and a much harder analysis problem.

## Rules

1. Square board (commonly 8×8 or larger). Each player owns two opposite sides.
2. On each turn a player either:
   - **Place** a new stone on an empty cell, **provided** the placement does
     not result in any two same-colour stones being diagonally adjacent without
     an orthogonal connector; **or**
   - **Slide** one of their existing stones one orthogonal step, again subject
     to the no-illegal-diagonal-pair rule.
3. The first player to make an orthogonally-connected chain of their stones
   spanning their two sides wins.
4. Draws are not possible under the standard rule set.

## Solution status

Slither is **unsolved**. The slider move blows up the game tree and the
no-diagonal rule complicates evaluation; engine play exists but no formal
solution.

## Consensus on optimal play

- **Maintain orthogonal connectivity in your chain** — unlike diagonal-connection games, only orthogonal links count toward your spanning chain; always verify that newly placed or slid stones are part of your orthogonal main group.
- **Use slides to extend without over-committing** — a slide moves an existing stone rather than adding a new one, preserving stone count while repositioning; use slides to bridge gaps without the cost of a permanent new placement.
- **The no-diagonal rule prevents loose coupling** — two of your stones diagonally adjacent with no orthogonal connector violates placement rules; avoid creating such configurations as they restrict future placements in that area.
- **Threaten two crossing paths** — as in all connection games, the key is to maintain two separate path threats to your goal sides simultaneously; this forces the opponent to block both or concede one.
- **First player advantage is presumed but unproven** — draws are impossible (one player must complete a spanning chain); first-player advantage is widely observed but no formal proof exists.

## Engines & current best play

- **Strongest known program(s):** No game-specific public engine known to the cataloguer. Playable in general-purpose abstract-game frameworks (e.g., [Ludii](https://ludii.games/)).
- **Strength:** Not benchmarked.
- **Notes:** A small competitive community exists; no published computational analysis or formal solution is known.

## Complexity

Large; the sliding move makes ply branching much wider than placement-only
connection games.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Slither_(board_game))
- [Schensted & Titus (1975). *Mudcrack Y and Poly-Y*.](../references.md#schensted-titus1975) (general framework)

## See also

- [Hex](hex.md) · [Crossway](crossway.md) · [Havannah](havannah.md) · [TwixT](twixt.md)
- Lexicon: [game-tree complexity](../lexicon/README.md#game-tree-complexity)
