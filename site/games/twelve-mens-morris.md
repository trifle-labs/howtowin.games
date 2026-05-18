# Twelve Men's Morris

> The largest classic morris game, played on the Nine Men's Morris board with added diagonal lines. Its solution status is not firmly established.

| Field | Value |
|-------|-------|
| Also known as | Twelve Men's Morris, Morabaraba (a closely related African game) |
| Players | 2 |
| Type | Partisan placement-and-movement ("mill") game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Partially solved / status not firmly established here |
| **Game-theoretic value** | Unknown **[verify]** |
| Year solved | — |
| Solved by | — |
| State-space complexity | Larger than Nine Men's Morris |
| Game-tree complexity | Larger than Nine Men's Morris |
| **Playable** | twelve-mens-morris |

## Description

Played on the same board as Nine Men's Morris (24 points) but with the four diagonal lines added, so corner points connect across the diagonals. Each player has twelve pieces. The rules follow Nine Men's Morris: a placement phase followed by a movement phase, with mills (three in a row) letting you remove an opponent's piece. With twelve pieces on 24 points, the board is very full after placement, so the game often hinges on the placement phase.

## Solution status

Twelve Men's Morris is **not firmly established as solved** in this archive. The
methods that weakly solved [Nine Men's Morris](nine-mens-morris.md)
([Gasser, 1996](../references.md#gasser1996)) — endgame databases plus search —
are applicable in principle, and the closely related Southern African game
*Morabaraba* has received computational study. But this archive has not
confirmed a citable primary solution of standard Twelve Men's Morris with a
definite game-theoretic value.

> **[verify]** — If Twelve Men's Morris (or Morabaraba under an equivalent rule
> set) has been weakly or strongly solved, the result and citation should be
> added.

## Consensus on optimal play

- **Diagonal points are extra valuable** — because the four diagonals are added, corner points now sit on three lines (two sides of the square plus one diagonal). Securing corners during placement is even more important than in Nine Men's Morris.
- **The placement phase decides the game** — with 12 pieces filling 24 points, the board is completely full after placement. Forming a mill during placement and removing a key opponent piece can decide the game before the movement phase even starts.
- **Threaten two mills at once** — any mill lets you remove an opponent piece. If you can threaten to close two mills with a single placement, the opponent can only block one, and you complete the other.
- **Protect pieces that are not in a mill** — pieces not part of any mill can be removed if the opponent closes a mill nearby. Keep non-mill pieces in safe positions or use them to block the opponent's mill formations.
- **Open and close mills repeatedly in the movement phase** — sliding a piece one step out of a mill and then back in re-creates the mill and earns another removal each cycle. The opponent must disrupt this pattern or keep losing pieces.

## Engines & current best play

- **Strongest known program(s):** No widely available dedicated Twelve Men's Morris solver known to the cataloguer; the morris-family methodology (endgame databases + alpha-beta search, as used by Gasser for Nine Men's Morris) is applicable.
- **Strength:** No benchmarked super-human engine publicly documented for this variant.
- **Where the proof / tablebase lives (if solved):** No confirmed citable solution; see related Gasser (1996) result for Nine Men's Morris ([../references.md#gasser1996](../references.md#gasser1996)).
- **Notes:** Morabaraba (the Southern African equivalent) has received some computational study; whether its ruleset exactly matches standard Twelve Men's Morris is **[verify]**.

## Complexity

Larger than Nine Men's Morris's ~10^10 positions, owing to the extra diagonal
connections and twelve pieces per side.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Twelve_men%27s_morris) ([archive](http://web.archive.org/web/20251223020816/https://en.wikipedia.org/wiki/Twelve_men%27s_morris))
- [Gasser, R. (1996). *Solving Nine Men's Morris*.](../references.md#gasser1996)
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)

## See also

- [Nine Men's Morris](nine-mens-morris.md) · [Six Men's Morris](six-mens-morris.md) · [Three Men's Morris](three-mens-morris.md)
- Lexicon: [retrograde analysis](../lexicon/README.md#retrograde-analysis) · [weakly solved](../lexicon/README.md#weakly-solved)
