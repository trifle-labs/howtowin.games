# Kōnane

> Hawaiian checkers — a capture-by-jump game that is a prime testbed for
> combinatorial game theory.

| Field | Value |
|-------|-------|
| Also known as | Konane, Hawaiian checkers |
| Players | 2 |
| Type | Partisan combinatorial game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Partially solved (CGT theory of positions; small boards and many endgame shapes) |
| **Game-theoretic value** | Known for small boards and many decomposed positions; standard large boards unsolved |
| Year solved | — (CGT analyses from the 2000s onward) |
| Solved by | Michael Ernst; later Alice Chan, Michael Albert, and others |
| State-space complexity | Depends on board size |
| Game-tree complexity | Depends on board size |

## Description

Played on a rectangular board initially filled with black and white stones in a
checkerboard pattern. After two opening removals, a player moves by **jumping
one of their stones over an orthogonally adjacent enemy stone** into an empty
cell, capturing the jumped stone; multi-jumps in a straight line are allowed.
A player with no legal move loses ([normal play](../lexicon/README.md#normal-play-convention)).

## Solution status

Kōnane is **partially solved**. It is unusually friendly to
[combinatorial game theory](../lexicon/README.md#combinatorial-game-theory)
because late positions break into independent regions whose exact CGT values can
be computed and summed — Kōnane is a standard example used to demonstrate the
CGT value calculus on a "real" cultural game. Exact values are known for many
small boards and for large catalogues of endgame fragments, and small full
boards have been solved by search. The standard large playing boards, however,
are not solved as a whole. The generalised game has also been studied from a
computational-complexity standpoint.

## Consensus on optimal play

- **Multi-jump chains are decisive** — a stone that can jump multiple enemy stones in a straight line removes several opponents in one move; seek positions that set up long chains and deny the opponent similar opportunities.
- **Preserve jumping ability for your key stones** — once a stone has no orthogonally adjacent enemy stone it can no longer move; avoid allowing your active stones to become isolated islands with no targets.
- **Opening removal choice shapes the game** — the two opening removals (one from each player) determine which lanes become active; removing an edge stone opens a long jump lane along that side; central removals create more branching paths.
- **In endgame, apply CGT value analysis** — late Kōnane positions decompose into independent rectangular regions; compute the CGT value of each region (often a small integer or fraction) and nim-sum them to find the winning move.
- **Temperature of components guides move selection** — in decomposed endgames, play in the highest-temperature (hottest) component first; deferring hot moves is a losing strategy in CGT-valued games.

## Engines & current best play

- **Strongest known program(s):** No game-specific public engine known to the cataloguer. CGT software (e.g., CGSuite) can evaluate decomposed endgame fragments exactly.
- **Strength:** Not benchmarked for full-board play; endgame positions solvable exactly via CGT.
- **Where the proof / tablebase lives (if solved):** M. Ernst (1995) and subsequent CGT analyses; no full-board tablebase for large boards.
- **Notes:** Kōnane is a standard CGT teaching example because its late-game positions cleanly decompose into independent sums; the opening game is a harder search problem.

## Complexity

Depends on board dimensions; CGT decomposition makes endgames tractable, openings
remain hard.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Konane) ([archive](http://web.archive.org/web/20251004213934/https://en.wikipedia.org/wiki/Konane))
- [Berlekamp, Conway & Guy (2001). *Winning Ways for Your Mathematical Plays*.](../references.md#bcg2001)
- M. Ernst (1995). *Playing Konane mathematically: A combinatorial game-theoretic analysis*. **[verify]**

## See also

- [Checkers (English draughts)](checkers.md) · [Clobber](clobber.md) · [Amazons](amazons.md)
- Lexicon: [combinatorial game theory](../lexicon/README.md#combinatorial-game-theory) · [partisan game](../lexicon/README.md#partisan-game)
