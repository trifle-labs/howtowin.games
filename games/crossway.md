# Crossway

> A connection game where a "no checkerboard" rule prevents draws. First player wins, proven by strategy stealing.

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
| **Playable** | crossway |

## Description

Crossway (by Mark Steere, 2007) is a connection game on a square grid. It uses
a clever rule to **prevent draws**: you cannot create a 2×2 checkerboard
pattern of black and white squares. Combined with a Hex-style connection win
condition, this guarantees that exactly one player will connect their sides.

## Rules

1. A square board (usually 19×19, but any size works). Each player owns two opposite sides.
2. Players take turns placing one stone of their color on any empty cell, with one rule: the move **must not create any 2×2 block of cells where the colors form a checkerboard pattern**.
3. The first player to make a connected chain of their stones linking their two sides wins. (Both up/down/left/right and diagonal connections count.)
4. Draws are impossible.

## Solution status

Ultra-weakly solved by strategy-stealing: drawless plus symmetric makes it a
**first-player win**. **[verify]** the formal statement — Crossway's strategy-
stealing argument is community-folklore rather than a formal paper. As with
[Hex](hex.md) and [Y](y.md), the proof is non-constructive.

## Consensus on optimal play

- **First player wins with perfect play (proven by strategy stealing)** — the game is provably a first-player win. Use the swap (pie) rule in competitive play to keep things fair.
- **Use the no-checkerboard rule against the opponent** — the restriction also applies to your opponent. Spots where the opponent cannot play (because placing there would create a checkerboard) are safe spaces for you. Probe those areas.
- **Diagonal connections count the same as up/down/left/right** — unlike many connection games, both diagonal and straight connections create a path. This makes connecting easier, and you must watch for diagonal chains as threats.
- **Build wide chains, not narrow lines** — a chain two or more cells wide is harder to cut than a single-cell path. Spending extra stones to widen your connection makes it harder for the checkerboard rule to break your path.
- **Use virtual connection thinking from Hex** — groups with two separate connecting paths to the goal are virtually connected. Once established, both paths cannot be cut at the same time.

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
