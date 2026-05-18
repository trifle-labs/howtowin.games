# Halatafl

> A Norse version of fox and geese, played on a cross-shaped board. The outcome depends on the exact rules used.

| Field | Value |
|-------|-------|
| Also known as | Fox and Geese (Halatafl variant) |
| Players | 2 (asymmetric) |
| Type | Partisan asymmetric hunt game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Partially analysed **[verify]** (small variants) |
| **Game-theoretic value** | Geese win with optimal play on standard board **[verify]** |
| Year solved | — |
| Solved by | — |
| State-space complexity | Small |
| Game-tree complexity | Small |
| **Playable** | halatafl |

## Description

Halatafl is a Norse variant of fox-and-geese, mentioned in the 13th-century Grettis saga. It is played on a cross-shaped board where one player controls a single fox and the other controls a flock of geese trying to corner it.

## Rules

1. Board: cross-shaped grid of 33 cells (the standard fox-and-geese diagram).
2. One player has 13 geese starting on the lower arm and center; the other has 1 fox starting in the upper center.
3. Geese move one step up, down, left, or right (no backward in some variants). Geese never capture.
4. The fox moves one step up/down/left/right or jumps over a neighboring goose along a straight line to an empty cell beyond, removing that goose.
5. The fox wins by reducing the geese to a number too small to trap it (e.g., fewer than 6). The geese win by surrounding the fox so it cannot move.

## Solution status

Halatafl is closely related to classical Fox-and-Geese, for which several
small variants are solved. The standard variant is broadly believed to be a
**geese win** with optimal play; **[verify]** the specific Halatafl ruleset
for an authoritative solution.

## Consensus on optimal play

- **Geese: keep a gap-free advancing line** — as in classical Fox and Geese, the key is never leaving a hole in the formation that the fox can jump through. Advance the line evenly.
- **Geese: use the flanks to contain, not just chase** — wrapping geese around the fox's sides prevents diagonal escapes and compresses its space.
- **Fox: head for the corners or edges immediately** — the fox's best escape route is along the board edge or toward a corner where the geese's wider formation cannot follow efficiently.
- **Fox: create forced goose moves** — a jump that captures one goose while threatening another forces the geese to react inefficiently, potentially opening a gap.
- **Geese: never leave a single goose ahead of the rest** — an isolated goose that is ahead of the line is a free capture for the fox, reducing the flock below the trapping threshold.

## Engines & current best play

- **Strongest known program(s):** No game-specific public engine known to the cataloguer. Playable in general-purpose abstract-game frameworks (e.g., [Ludii](https://ludii.games/)).
- **Strength:** Not benchmarked.
- **Where the proof / tablebase lives (if solved):** Partially analysed; no published complete solution specific to the Halatafl ruleset.
- **Notes:** Closely related to classical Fox and Geese (see [fox-and-geese.md](fox-and-geese.md)); strategic principles carry over.

## Complexity

Small.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Hnefatafl) ([archive](http://web.archive.org/web/20251004212953/https://en.wikipedia.org/wiki/Hnefatafl))
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)

## See also

- [Fox and Geese](fox-and-geese.md) · [Catch the Hare](catch-the-hare.md) · [Tablut](tablut.md)
- Lexicon: [hunt game](../lexicon/README.md#hunt-game)
