# Arimaa

> A game deliberately designed to be hard for computers — playable with a chess
> set, and unsolved.

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

Invented by Omar Syed in 2002, playable on a chessboard with chess pieces.
Players first **set up** their pieces freely on their two home ranks. Each turn
consists of **up to four steps**, which may move several pieces; stronger pieces
can **push and pull** weaker enemy pieces. Pieces are lost by being forced onto
trap squares. A player wins by getting a rabbit (pawn) to the far rank.

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

- **Control the traps** — the four trap squares are the primary way pieces are eliminated; placing friendly pieces adjacent to your own traps (as "hosts") protects them, while attacking the defenders of enemy traps is the main tactical theme.
- **Setup determines the game** — the free placement phase is crucial; standard setups place the stronger pieces (elephant, camel) behind rabbits near the traps they will anchor, and cats/dogs as trap defenders.
- **The elephant dominates — push yours forward** — the elephant cannot be pushed or pulled; advancing it aggressively ties down the opponent's elephant in defense and creates a positional wedge.
- **Rabbit advancement is the winning condition** — every strategic decision filters through "can I advance a rabbit to the 8th rank?"; keeping rabbit lanes open while blocking opponent rabbit paths is the strategic core.
- **Immobilisation wins without captures** — a player with no legal moves loses; surrounding the opponent's pieces (especially their camel or elephant) to create a goal-through-immobilisation threat is a major tactical weapon.
- **Tempo matters enormously** — with up to four steps per turn, wasting steps on non-threatening moves hands the initiative to your opponent; experienced players maximise "goal threats" per step.

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
