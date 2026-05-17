# Arimaa

> A game designed to be hard for computers, playable with a chess set, and still unsolved.

| Field | Value |
|-------|-------|
| Also known as | Arimaa |
| Players | 2 |
| Type | Partisan board game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Unsolved |
| **Game-theoretic value** | Unknown |
| Year solved | — |
| Solved by | — |
| State-space complexity | ~10^43 |
| Game-tree complexity | Extremely large — branching factor in the tens of thousands |

## Description

Arimaa was invented by Omar Syed in 2002 and can be played on a chessboard with
chess pieces. Before the game starts, players **set up** their pieces however
they want on their two home rows. Each turn you get **up to four steps**, which
can move several different pieces. Stronger pieces can **push and pull** weaker
enemy pieces. Pieces are removed when they are forced onto trap squares. The
goal is to get one of your rabbits (pawns) to the opponent's back row.

## Solution status

Arimaa is **unsolved**, and was *engineered* to resist computer solving and
strong computer play. The free setup phase and the up-to-four-steps move
structure give an enormous branching factor — on the order of tens of thousands
of moves per turn — which crippled the brute-force search that dominates
chess engines. A standing "Arimaa Challenge" prize ran from 2004; bots finally
defeated top human defenders in **2015**, ending the challenge. But strong (and
now winning) computer play is, as always,
[not a solution](../lexicon/README.md#solving-vs-strong-play): the game-theoretic
value of Arimaa is unknown and the game is nowhere near solved.

## Consensus on optimal play

- **Control the traps** — the four trap squares are the main way to remove pieces. Keep friendly pieces next to your own traps to protect them (like "guards"), and attack the guards of the opponent's traps.
- **Your setup decides the game** — the free placement phase at the start is crucial. Standard setups put the strongest pieces (elephant, camel) behind rabbits near the traps they will guard, with cats and dogs as trap defenders.
- **Push your elephant forward** — the elephant is the strongest piece and cannot be pushed or pulled by anything. Advancing it aggressively pins down the opponent's elephant in defense and gives you a position advantage.
- **Getting a rabbit across wins the game** — every strategic decision comes down to "can I get a rabbit to the far row?" Keeping open paths for your rabbits while blocking the opponent's rabbit paths is the heart of the game.
- **You can also win by trapping your opponent** — a player with no legal moves loses. Surrounding the opponent's pieces (especially their camel or elephant) to trap them is a major tactic.
- **Don't waste steps** — with up to four steps per turn, wasting steps on useless moves hands the advantage to your opponent. Experienced players try to make every step count toward winning.

## Engines & current best play

- **Strongest known program(s):** bot_sharp (later variants) and Ziltoid — MCTS-based with neural networks; defeated top humans in 2015.
- **Strength:** Super-human since 2015.
- **Where the proof / tablebase lives (if solved):** — (unsolved; no tablebase)
- **Notes:** The Arimaa Challenge (2004–2015) specifically tested whether bots could beat top human players; after that barrier was crossed, neural-network-based engines rapidly improved further.

## Complexity

State-space ~10^43; the per-turn branching factor (tens of thousands) makes the
effective game-tree complexity enormous.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Arimaa) ([archive](http://web.archive.org/web/20260505162323/https://en.wikipedia.org/wiki/Arimaa))
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002) (general framework)

## See also

- [Chess](chess.md) · [Go](go.md) · [Lines of Action](lines-of-action.md)
- Lexicon: [game-tree complexity](../lexicon/README.md#game-tree-complexity) · [solving vs. strong play](../lexicon/README.md#solving-vs-strong-play)
