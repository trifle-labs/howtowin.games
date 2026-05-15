# Unlur

> An asymmetric connection game — the two players win in different ways,
> on different sides.

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

## Description

Unlur (Jorge Gómez Arrausi, 2002) is a hexagonal-board connection game in
which **the two players have different victory conditions**. One player ("Black")
wins by connecting opposite sides; the other ("White") wins by *preventing*
the connection and forming any closed loop of their own stones. A bidding
opening rule sets the handicap.

## Rules

1. Hexagonal grid board (commonly side 6 or 7).
2. **Bidding opening**: one player offers a handicap (a number of free Black
   moves); the other chooses which side to play. This sets up a near-fair
   starting position.
3. Players then alternate placing one stone on an empty cell.
4. **Black** wins by connecting their two opposite sides with a chain of their
   own stones.
5. **White** wins by making a closed loop ("ring") of their own stones — any
   cycle that fully encloses one or more cells.

## Solution status

Unlur is **unsolved**. The asymmetric win conditions and the bidding handicap
make the game harder to analyse than ordinary connection games, and there is no
published solution.

## Consensus on optimal play

- **Black (connector) must maintain a spanning threat** — as in Hex, Black needs a connection path from side to side; virtual connections (two half-connections sharing a pivot cell) allow Black to advance efficiently and are harder for White to cut.
- **White (ring-maker) aims for enclosing loops, not just blocking** — White wins by forming any closed cycle, not by preventing Black's connection per se; White should aim for triangular or small hexagonal loops in the centre-board while still disrupting Black's path.
- **The bidding handicap sets the tempo for the entire game** — in Unlur's bidding opening, assess whether a large Black handicap gives Black too many pre-placed stones; bid the minimum that keeps the position balanced.
- **Black should route through the central corridor** — the centre of the hexagonal board offers the shortest path from side to side; detouring to the edge to avoid White's pieces usually costs more moves than the detour saves in safety.
- **White's loop can form anywhere, so defend globally** — Black cannot simply block one cluster; White can build a loop in any corner, so Black must watch the whole board and cut White's forming cycles before they close.

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
