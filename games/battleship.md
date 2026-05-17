# Battleship

> The classic guessing game where you hide ships and try to find the enemy's. Since you can't see the opponent's board, it is not the kind of game that can be "solved" in the usual way.

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
| **Playable** | battleship |

## Description

Each player secretly places a fleet of ships on a 10×10 grid. Players then take
turns calling out coordinates to shoot at on the opponent's grid. The opponent
says whether it was a hit or a miss (and in most versions, tells you when a ship
is fully sunk). The first player to sink all of the opponent's ships wins.
Because each player's board is hidden from the other, this is a game of **hidden
information** — unlike most games in this archive.

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

- **Use probability targeting when hunting** — keep track of which squares could still hold an unsunk ship based on your misses. Always shoot at the square most likely to be occupied.
- **Use a checkerboard pattern to save shots** — ships take up at least 2 squares in a row. When hunting, shoot every other square (like a checkerboard pattern) to cover all possible 2-square ships with the fewest shots.
- **Follow hits in both directions** — when you get a hit, keep shooting in a straight line in both directions until you find both ends of the ship before going back to hunting. This sinks ships faster than scattering shots.
- **Don't put ships on edges or corners** — if the opponent is using probability targeting, ships near the edges are easier to find because fewer ship arrangements fit there. Placing ships in the middle forces the opponent to waste more shots.
- **Spread your ships apart** — putting ships next to each other clusters your targets. A spread-out fleet makes each hit less useful for finding nearby ships.
- **Vary where you put your ships against repeat opponents** — since Battleship has hidden information and depends on what the opponent does, the best placement is random. Don't use predictable patterns that an observant opponent can learn.

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
