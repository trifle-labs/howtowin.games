# Ninuki-renju

> Like Renju but with captures. The historical Japanese game that Pente came from.

| Field | Value |
|-------|-------|
| Also known as | Ninuki-renju, "Capturing Renju" |
| Players | 2 |
| Type | Partisan k-in-a-row game with captures |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Unsolved |
| **Game-theoretic value** | Unknown |
| Year solved | — |
| Solved by | — |
| State-space complexity | Large |
| Game-tree complexity | Large |
| **Playable** | ninuki-renju |

## Description

Ninuki-renju is a 19th-century Japanese game that came before [Pente](pente.md). It is played on a Go board. Getting five stones in a row is one way to win. There is also a capture rule: if you surround two of your opponent's stones from both ends in a straight line, those two stones are captured and removed. The first player to reach a set number of captures (usually 5 pairs, or 10 stones) also wins.

## Rules

1. Go board (commonly 15x15 or 19x19), empty at the start.
2. Players take turns placing one stone of their colour on any empty point on the grid.
3. **Capture**: if your move creates the pattern X**O**O**X** (your stones surrounding exactly two of the opponent's stones that are next to each other in a straight line), those two stones are captured and removed, and counted toward your capture total.
4. A player **wins** by either:
   - Making an unbroken line of five stones in a row, **or**
   - Capturing 5 pairs (10 stones total), **or** — depending on the variant — **[verify]** other thresholds.
5. (Some versions of Ninuki-renju also use Renju's restrictions on Black's 3-3, 4-4, and overline (6+) moves.)

## Solution status

Ninuki-renju is **not solved**. The capture rule complicates the careful
threat-tree analysis that solved plain Renju ([Wágner & Virág 2001](../references.md#wagner-virag2001)),
and no formal solution exists.

## Consensus on optimal play

- **Watch both winning paths: five-in-a-row OR five captures** — always keep track of both ways to win. A position that threatens a five-in-a-row forces a different kind of defence than one racing toward 5 capture-pairs.
- **Capturing is often better than extending** — placing a stone to trap two enemy stones (capturing them immediately) is often stronger than adding to your own row, because captures remove enemy stones and bring you closer to a capture win.
- **Overlines are okay here** — unlike standard Renju, having six or more of your stones in a row does not make you lose. If you can threaten both an exact five and a longer line at the same time, the opponent has two problems to deal with.
- **Do not leave two of your stones lined up** — avoid putting two of your stones next to each other in a line where the opponent could surround both ends. Pairs sitting on the board are permanent capture targets.
- **Race the capture win against a row threat** — if the opponent is one move away from five-in-a-row, capturing a pair might not help in time. Figure out whether you need to block their row or race toward your own capture total.

## Engines & current best play

- **Strongest known program(s):** No game-specific public engine known to the cataloguer. Playable in general-purpose abstract-game frameworks (e.g., [Ludii](https://ludii.games/)).
- **Strength:** Not benchmarked.
- **Notes:** No formal solution; stronger bots exist for the closely related game Pente.

## Complexity

Larger than plain Renju because captures dramatically broaden the dynamic
material situation.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Ninuki-renju) ([archive](http://web.archive.org/web/20210504225326/http://en.wikipedia.org/wiki/Ninuki-renju))
- [Wágner & Virág (2001). *Solving Renju*.](../references.md#wagner-virag2001) (related)
- [Allis, van den Herik & Huntjens (1996). *Go-Moku Solved by New Search Techniques*.](../references.md#allis-gomoku1996)

## See also

- [Pente](pente.md) · [Renju](renju.md) · [Gomoku](gomoku.md)
- Lexicon: [first-player advantage](../lexicon/README.md#first-player-advantage)
