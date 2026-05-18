# Unlur

> A connection game where the two players have different win conditions: one connects opposite sides, the other forms a closed loop. It has not been solved.

| Field | Value |
|-------|-------|
| Also known as | Unlur |
| Players | 2 (asymmetric) |
| Type | Partisan asymmetric connection game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Unsolved |
| **Game-theoretic value** | Unknown (balanced by bidding / handicap rule) |
| Year solved | — |
| Solved by | — |
| State-space complexity | Comparable to Hex |
| Game-tree complexity | Large |
| **Playable** | unlur |

## Description

Unlur (Jorge Gomez Arrausi, 2002) is a connection game on a hexagonal board where the two players have different win conditions. One player (Black) wins by connecting two opposite sides of the board with their stones. The other player (White) wins by forming a closed loop (a ring) of their own stones. A bidding system at the start sets the handicap to balance the game.

## Rules

1. Hexagonal grid board (commonly 6 or 7 cells per side).
2. Bidding opening: one player offers a handicap (a number of free Black moves). The other player then chooses which side to play. This creates a roughly fair starting position.
3. Players then take turns placing one stone on an empty cell.
4. Black wins by connecting their two opposite sides of the board with a chain of their own stones.
5. White wins by making a closed loop (a ring) of their own stones — any cycle that fully surrounds one or more cells.

## Solution status

Unlur is **unsolved**. The asymmetric win conditions and the bidding handicap
make the game harder to analyse than ordinary connection games, and there is no
published solution.

## Consensus on optimal play

- **Black must keep a connection threat across the board** — as in Hex, Black needs a path from one side to the other. Creating virtual connections (two partial connections that share a key cell) lets Black advance efficiently and is harder for White to cut.
- **White should aim for loops, not just blocking** — White wins by forming any closed loop, not just by stopping Black's connection. White should aim for triangular or small hexagonal loops in the center while still disrupting Black's path.
- **The bidding handicap sets the pace** — when setting the handicap in the opening bid, judge whether a large Black handicap would give Black too many pre-placed stones. Bid the smallest number that keeps the game balanced.
- **Black should go through the center** — the center of the hexagonal board offers the shortest path from side to side. Going around the edges to avoid White's pieces usually costs more moves than it saves.
- **White can form a loop anywhere, so Black must watch the whole board** — White can build a loop in any corner. Black must pay attention to the entire board and cut off White's forming cycles before they close.

## Engines & current best play

- **Strongest known program(s):** No game-specific public engine known to the cataloguer. Playable in general-purpose abstract-game frameworks (e.g., [Ludii](https://ludii.games/)).
- **Strength:** Not benchmarked.
- **Where the proof / tablebase lives (if solved):** —
- **Notes:** Unlur's asymmetric win conditions (connection vs. enclosing loop) are unusual among connection games and make standard Hex strategies only partially applicable.

## Complexity

Comparable to Hex on similar boards, with the loop condition adding extra
evaluation work.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Unlur)
- [Schensted & Titus (1975). *Mudcrack Y and Poly-Y*.](../references.md#schensted-titus1975) (general framework)

## See also

- [Hex](hex.md) · [Havannah](havannah.md) · [Y](y.md)
- Lexicon: [partisan game](../lexicon/README.md#partisan-game) · [first-player advantage](../lexicon/README.md#first-player-advantage)
