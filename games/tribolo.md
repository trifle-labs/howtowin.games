# Tribolo

> A three-player area-capture game on a hex grid — unsolved.

| Field | Value |
|-------|-------|
| Also known as | Tribolo |
| Players | 3 |
| Type | Partisan multi-player placement game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Unsolved |
| **Game-theoretic value** | Unknown (multi-player; no unique value) |
| Year solved | — |
| Solved by | — |
| State-space complexity | Moderate |
| Game-tree complexity | Moderate |

## Description

Tribolo (Christian Freeling, 1980s/90s) is one of the few well-known three-
player abstract games with Othello-like capture mechanics: stones flip when
surrounded, and the player who has the most stones at the end wins. As a
multi-player game it lies outside the usual two-player solving framework —
"optimal play" requires non-equilibrium reasoning about alliances and
threats.

## Rules

1. Board: hexagonal grid of cells.
2. Three players take turns in fixed order, placing a stone of their colour on
   an empty cell adjacent to at least one stone of a different colour. (Exact
   placement and flipping rules vary by sub-variant — **[verify]**.)
3. When a stone is placed, neighbouring runs of one opposing colour bracketed
   by the placer and one other colour are flipped to the placer's colour, in
   an Othello-style sandwich rule generalised to three colours.
4. When no legal moves remain for any player, the game ends and the player
   with the most stones on the board wins.

## Solution status

Tribolo is **not solved**. Three-player solving lacks a unique game-theoretic
value in the standard sense; the analysis is best framed as a search for Nash
equilibria, of which there may be many. No published solution exists.

## Consensus on optimal play

- **Avoid leaving a clear leader unopposed** — in any three-player game, if one player pulls ahead while the other two compete, the leader usually wins; target the current leader's stones with your placements to maintain a balanced stone count.
- **Create chains along multiple flanks** — placing a stone that can bracket long runs in more than one direction simultaneously is stronger than a one-direction flip; multi-directional flips maximise your stone gain per move.
- **Be the kingmaker only under duress** — if you genuinely cannot win, the next goal is deciding which of the remaining players wins; flipping stones toward the weaker opponent is a form of tactical control even in apparent defeat.
- **Control the centre of the hex grid** — central cells on a hex board adjoin more cells, so centre stones can be brackets for flips across multiple hex directions; peripheral stones can only bracket in fewer directions.
- **Protect large clusters by caging them** — a group of your stones entirely surrounded by your own stones (so no opponent can bracket them) is safe from flipping; building enclosed territories early secures a floor on your score.

## Engines & current best play

- **Strongest known program(s):** No game-specific public engine known to the cataloguer. Playable in general-purpose abstract-game frameworks (e.g., [Ludii](https://ludii.games/)).
- **Strength:** Not benchmarked.
- **Where the proof / tablebase lives (if solved):** —
- **Notes:** Three-player games resist standard game-theoretic solving because "optimal" requires specifying a solution concept (e.g., Nash equilibrium or maximin); no published analysis exists for Tribolo.

## Complexity

Moderate.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Tribolo)
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)

## See also

- [Othello](othello.md) · [Quixo](quixo.md)
- Lexicon: [Nash equilibrium](../lexicon/README.md#nash-equilibrium) · [partisan game](../lexicon/README.md#partisan-game)
