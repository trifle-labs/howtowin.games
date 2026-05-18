# ZÈRTZ

> A game where the board gets smaller as players place marbles and remove rings from the edge. It has not been solved.

| Field | Value |
|-------|-------|
| Also known as | ZÈRTZ, Zertz |
| Players | 2 |
| Type | Partisan abstract strategy game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Unsolved |
| **Game-theoretic value** | Unknown |
| Year solved | — |
| Solved by | — |
| State-space complexity | Moderate (shrinks during play) |
| Game-tree complexity | Moderate-large |
| **Playable** | zertz |

## Description

ZÈRTZ (Kris Burm, 1998) is the second GIPF-project game. The board is a
hexagonal array of **rings** containing three colours of marbles. The unusual
feature: the board itself **shrinks** as the game progresses, by removing
rings.

## Rules

1. Board: hexagonal arrangement of 37 rings, with a shared pool of black,
   white, and grey marbles.
2. On a turn, a player must either:
   - **Place a marble** on an empty ring, then **remove a free ring** (one with
     at most one neighbouring ring still attached) from the edge of the board;
     **or**
   - **Capture**: if a marble can jump over an adjacent marble into an empty
     ring beyond, the captured marble goes to the capturing player. Captures
     are chained and mandatory when available.
3. A player wins by collecting one of these capture totals: 3 marbles of each
   colour; or 4 white; or 5 grey; or 6 black. **[verify]** the precise
   totals.

## Solution status

ZÈRTZ is **not solved**. The shrinking board and mandatory-capture rules give
the search a peculiar shape; no published solving result.

## Consensus on optimal play

- **Control the board-shrinking pace** — you choose which ring to remove after placing a marble; remove rings that cut off the opponent's capture routes or reduce the space available for the colour of marbles they need to collect.
- **Force mandatory captures onto your opponent** — if you place a marble that the opponent must immediately capture (mandatory capture rule), you can often orchestrate chains that hand you valuable marbles or leave the opponent in an awkward follow-up position.
- **Collect grey marbles consistently** — grey is typically the hardest colour to accumulate in quantity; securing a steady grey count while letting white and black balance out is a common expert approach.
- **Sacrifice black marbles to obtain whites** — black marbles are plentiful; white are scarce; chains that trade blacks for whites often accelerate a win via the "4 whites" condition.
- **Shrink the board toward the opponent's preferred marbles** — by removing rings near clusters of a colour the opponent needs, you reduce the supply of that colour and force them to chase scarce marbles deeper into the shrinking board.

## Engines & current best play

- **Strongest known program(s):** No game-specific public engine known to the cataloguer. Playable in general-purpose abstract-game frameworks (e.g., [Ludii](https://ludii.games/)).
- **Strength:** Not benchmarked.
- **Where the proof / tablebase lives (if solved):** —
- **Notes:** ZÈRTZ's shrinking board creates a fundamentally non-stationary search problem; the winning conditions (multiple possible collection targets) add further complexity to evaluation.

## Complexity

Moderate — the board shrinks rapidly, but the search-relevant branching is
wide.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/ZERTZ) ([archive](http://web.archive.org/web/20210507031603/http://en.wikipedia.org/wiki/Zertz))
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)

## See also

- [GIPF](gipf.md) · [DVONN](dvonn.md) · [YINSH](yinsh.md)
- Lexicon: [game-tree complexity](../lexicon/README.md#game-tree-complexity)
