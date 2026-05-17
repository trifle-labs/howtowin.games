# Ninuki-renju

> Renju with captures — the historical Japanese ancestor of Pente.

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

Ninuki-renju is the Japanese 19th-century forerunner of [Pente](pente.md). It
plays on a Go board with five-in-a-row as the primary winning condition, plus
a custodial capture rule: a pair of opposing stones sandwiched between two of
yours is removed. A player reaching a fixed number of captures (usually 5
pairs) also wins.

## Rules

1. Go board (commonly 15×15 or 19×19), initially empty.
2. Players alternate placing one stone of their colour on any empty
   intersection.
3. **Capture**: if a placement creates the pattern X**O**O**X** (your stones
   bracketing exactly two adjacent opposing stones in a straight line), the two
   bracketed stones are removed and counted toward your capture total.
4. A player **wins** by either:
   - Forming an unbroken five-in-a-row of their stones, **or**
   - Accumulating 5 pairs of captures (10 captured stones), **or** depending on
     the variant, **[verify]** other thresholds.
5. (Some variants of Ninuki-renju also borrow Renju's restrictions on Black's
   3-3, 4-4, and overline moves.)

## Solution status

Ninuki-renju is **not solved**. The capture rule complicates the careful
threat-tree analysis that solved plain Renju ([Wágner & Virág 2001](../references.md#wagner-virag2001)),
and no formal solution exists.

## Consensus on optimal play

- **Dual threat: five-in-a-row OR five captures** — always be aware of both winning paths; a position threatening row-completion forces a different defence than one racing toward 5 capture-pairs.
- **Custodial traps over pure extension** — placing a stone to bracket an enemy pair (capturing immediately) is often stronger than extending your own row, because captures simultaneously remove material and advance your capture count.
- **Break open overlines** — unlike standard Renju, overlines (6+) do not lose here; a player threatening both an exact five and an overline creates a double win-threat.
- **Restrict opponent's pairing** — avoid leaving two of your own stones sitting adjacent in a line where the opponent can bracket both ends; pairs on the board are permanent capture bait.
- **Race the capture win against a row threat** — if the opponent is one move from five-in-a-row, capturing a pair may not help; calculate whether row defence or racing your own capture count is faster.

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
