# Snort

> A map-coloring game where neighboring regions must share the same color instead of avoiding each other's color.

| Field | Value |
|-------|-------|
| Also known as | Snort (the "kissing" game) |
| Players | 2 |
| Type | Partisan combinatorial game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Partially solved |
| **Game-theoretic value** | Computable for a given position; no simple global characterisation |
| Year solved | — (theory developed 1976; not fully characterised) |
| Solved by | Simon Norton (game); analysis in Conway / *Winning Ways* |
| State-space complexity | Depends on the map |
| Game-tree complexity | Depends on the map |
| **Playable** | snort |

## Description

Played on a map like Col, but with the opposite rule: one player colors regions blue, the other red, and neighboring regions must not have different colors — neighbors may share a color but cannot clash. A player unable to move loses.

## Solution status

Snort is **partially solved**. It is fully amenable to combinatorial game
theory — any specific position can be evaluated by the disjunctive-sum
calculus, and values for many small maps and useful gadget positions are
tabulated in [*Winning Ways*](../references.md#bcg2001). But unlike
[Col](col.md), whose values are always "number or number-plus-star," **Snort's
values are not so constrained**: they include genuinely [hot](../lexicon/README.md#temperature--hot-game)
positions and a richer zoo of CGT values, and there is no simple closed
characterisation covering all maps.

So Snort is solved *in principle* by CGT but, in contrast to Col, has no tidy
global theory — it is the harder twin.

## Consensus on optimal play

- **Play in the most valuable region first** — Snort positions often have one region that is much more valuable than the others. If you leave the most valuable region for the opponent, you will likely lose.
- **Claim large isolated regions early** — a region with no neighboring constraints is valuable for its size alone. Take these before they become contested.
- **Force clashes on the opponent's side** — if you can color two neighboring regions the same color as the opponent's pieces, you deny them both spots.
- **Split the map into independent parts** — when the board divides into separate areas, think about each area on its own. Play in the area where you have the most to gain.
- **Watch for second-player-win positions** — some board shapes mean that whoever moves next (even if it is the opponent) will force a win. Learn to recognize these shapes and avoid creating them for your opponent.

## Engines & current best play

- **Strongest known program(s):** No game-specific public engine known to the cataloguer. Positions can be evaluated with CGT software such as Combinatorial Game Suite or custom implementations of the Sprague–Grundy / surreal-number calculus.
- **Strength:** Not benchmarked against humans.
- **Where the proof / tablebase lives (if solved):** Partial — tabulated values in *Winning Ways* ([../references.md#bcg2001](../references.md#bcg2001)).
- **Notes:** Snort is the harder twin of Col; its richer CGT values make exhaustive characterisation an open research problem.

## Complexity

Depends on the map; the lack of a value-restriction theorem makes it harder than
Col.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Snort_(game))
- [Conway, J. H. (1976). *On Numbers and Games*.](../references.md#conway1976)
- [Berlekamp, Conway & Guy (2001). *Winning Ways for Your Mathematical Plays*.](../references.md#bcg2001)

## See also

- [Col](col.md) · [Hackenbush](hackenbush.md) · [Domineering](domineering.md)
- Lexicon: [partisan game](../lexicon/README.md#partisan-game) · [temperature / hot game](../lexicon/README.md#temperature--hot-game)
