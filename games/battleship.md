# Battleship

> The childhood guessing game — an imperfect-information game; "optimal play"
> means probabilistic search strategy, and the standard game is not solved in
> the game-theoretic sense.

| Field | Value |
|-------|-------|
| Also known as | Battleships, Sea Battle |
| Players | 2 |
| Type | Imperfect-information game (simultaneous hidden placement, then search) |
| Perfect information | No |
| Chance element | No (deterministic, but hidden information) |
| **Solution status** | Unsolved (as a game); search heuristics well studied |
| **Game-theoretic value** | Unknown — depends on opponent placement strategy |
| Year solved | — |
| Solved by | — |
| State-space complexity | Large (number of fleet placements) |
| Game-tree complexity | N/A in the usual sense (hidden information) |

## Description

Each player secretly places a fleet of ships on a 10×10 grid. Players then
alternate calling shots at coordinates on the opponent's grid; the opponent
announces hit or miss (and, in most rules, when a ship is sunk). The first player
to sink the opponent's entire fleet wins. Because each player's board is hidden,
this is a game of **imperfect information**, unlike most entries in this archive.

## Solution status

Battleship is **not "solved"** in the combinatorial-game-theory sense, and the
notion barely applies: there is no single game-theoretic value because the
outcome depends on each player's *placement* policy and *shooting* policy against
the other's. What *is* well studied is the **search problem** — given the
information revealed so far, which square maximises the chance of a hit.
Probability-density ("parity" plus hit-following) heuristics are known to be
strong and near-optimal for the shooting phase against a uniformly random
placement. The full game — including adversarial placement — is best modelled as
a two-player game with hidden information and has no published optimal-strategy
solution.

## Consensus on optimal play

- **Use probability-density targeting during the hunting phase** — mentally (or computationally) track which squares can still contain an unsunk ship given all misses; always shoot at the square with the highest probability of being occupied.
- **Exploit parity to reduce wasted shots** — ships occupy at least 2 consecutive squares; during the hunting phase, only fire at every other square in a checkerboard pattern to guarantee touching every possible 2-square ship with minimal shots.
- **Follow hits in both directions** — when you score a hit, shoot the adjacent squares along a line until you find both ends of the ship before switching back to hunting; this sinks ships faster than scattering shots after a hit.
- **Avoid placing ships at edges and corners** — against a probability-density hunter, ships near the edges are statistically easier to locate because fewer ship orientations fit there; interior placement forces the opponent to waste more shots.
- **Separate your ships** — placing ships adjacent or near each other concentrates targets; a spread-out fleet makes each hit less informative about where neighbouring ships are.
- **Vary your placement pattern against repeated opponents** — because Battleship has hidden information and depends on opponent strategy, the "optimal" placement is really a mixed strategy; avoid predictable patterns that a learning opponent can exploit.

## Engines & current best play

- **Strongest known program(s):** Various AI agents implementing probability-density search (e.g., academic and hobbyist implementations); no single canonical named engine.
- **Strength:** Optimal search-phase play is well approximated by probability-density algorithms; placement strategy against adversarial opponents remains heuristic.
- **Where the proof / tablebase lives (if solved):** — (not solved as a full adversarial game)
- **Notes:** The shooting sub-problem is a well-studied probability puzzle; the full two-player adversarial game including placement is an open problem in imperfect-information game theory.

## Complexity

The placement space is large (hundreds of thousands of legal fleet layouts), and
because information is hidden the game does not have a game-tree complexity in
the perfect-information sense.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Battleship_(game)) ([archive](http://web.archive.org/web/20260505154451/https://en.wikipedia.org/wiki/Battleship_(game)))
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002) (general framework)

## See also

- [Liar's dice](liars-dice.md) · [Mastermind](mastermind.md) · [Heads-up limit hold'em](heads-up-limit-holdem.md)
- Lexicon: [perfect information](../lexicon/README.md#perfect-information) · [solving vs. strong play](../lexicon/README.md#solving-vs-strong-play)
