# Bao

> The deepest mancala — a four-row East African game of legendary complexity,
> and unsolved.

| Field | Value |
|-------|-------|
| Also known as | Bao la Kiswahili |
| Players | 2 |
| Type | Partisan sowing (mancala) game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Unsolved |
| **Game-theoretic value** | Unknown |
| Year solved | — |
| Solved by | — |
| State-space complexity | Large — far beyond two-row mancalas |
| Game-tree complexity | Large |

## Description

Played on **four** rows of eight pits (two rows per player), with an additional
private store pit (*nyumba*, "the house"). Bao has an elaborate rule set: a
distinct opening "namua" phase in which reserve seeds are entered one per turn,
multi-lap sowing, captures that feed seeds into the player's own rows, and
direction choices. It is widely regarded as the most strategically deep of all
mancala games.

## Solution status

Bao is **unsolved**. Its four-row board, multi-lap sowing (a single move can
cascade around the board many times), and the two-phase structure with reserve
seeds give it a state space and branching factor far beyond the two-row
mancalas. Where [Awari](awari.md) was strongly solved by enumerating ~10^12
positions, Bao's complexity has kept it out of reach; it has a competitive
human community and some playing programs, but no game-theoretic value has been
established and even strong computer play is comparatively undeveloped.

## Consensus on optimal play

- **Protect the nyumba throughout the namua phase** — the home pit (nyumba) accumulates seeds during opening; a well-defended nyumba gives a powerful late-game resource while an exposed one is a vulnerability to opponent captures.
- **Control the front-row inner pits** — the two inner pits of each player's front row are the capture trigger points; keeping seeds in these pits maximises capture opportunity while denying the opponent access reduces their attacking options.
- **Initiate multi-lap chains that end on opponent-facing pits** — the power of Bao lies in relay sowing; a move that cascades through several pits and terminates opposite a loaded enemy pit can clear a large section of their row in one turn.
- **Namua entry point matters** — during the namua (reserve) phase, where you introduce a seed into your row determines which relay cascade follows; experienced players choose the entry pit to generate immediate captures rather than passive placements.
- **Maintaining seed density in the back row provides flexibility** — back-row seeds are difficult to capture; building a seed reserve there allows sustained front-row attacks even after the front is depleted.
- **Direction choice is a major weapon** — at key junctions where sowing direction is optional, choosing the direction that avoids completing a dead-end relay and instead feeds a capture chain is the primary high-level skill.

## Engines & current best play

- **Strongest known program(s):** No widely-available dedicated Bao engine known to the cataloguer. Playable in general-purpose abstract-game frameworks (e.g., [Ludii](https://ludii.games/)).
- **Strength:** Not benchmarked publicly.
- **Notes:** Bao has a strong human competitive tradition in East Africa (particularly Tanzania and Kenya); computational analysis lags far behind the human game's depth, and no game-theoretic value has been established.

## Complexity

Not well quantified in the solving literature, but clearly orders of magnitude
beyond Awari/Kalah owing to four rows and multi-lap sowing.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Bao_(game)) ([archive](http://web.archive.org/web/20260210162711/https://en.wikipedia.org/wiki/Bao_(game)))
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002) (general framework)

## See also

- [Awari (Oware)](awari.md) · [Kalah](kalah.md)
- Lexicon: [state-space complexity](../lexicon/README.md#state-space-complexity)
