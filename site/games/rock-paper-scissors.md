# Rock-paper-scissors

> The classic example of a game with no single best move. The only solution is to play all three options equally at random.

| Field | Value |
|-------|-------|
| Also known as | RPS, Roshambo, Jan-ken (related) |
| Players | 2 |
| Type | Simultaneous-move zero-sum game |
| Perfect information | No (moves are simultaneous / hidden until revealed) |
| Chance element | No (randomisation is a strategy, not a rule) |
| **Solution status** | Solved (unique Nash equilibrium known) |
| **Game-theoretic value** | Draw — value 0 under the equilibrium mixed strategy |
| Year solved | folklore (an instance of von Neumann's 1928 minimax theorem) |
| Solved by | Classical game theory (von Neumann; Nash) |
| State-space complexity | Trivial (3 actions each, one simultaneous move) |
| Game-tree complexity | Trivial |
| **Playable** | rock-paper-scissors |

## Description

Both players pick rock, paper, or scissors at the same time. Rock beats scissors, scissors beats paper, paper beats rock. If you both pick the same thing, it is a draw. This is the classic example of a game where both players move at once and one player's gain is the other's loss.

## Solution status

Rock-paper-scissors is **solved** by classical game theory. It has **no
pure-strategy equilibrium** — for any deterministic choice there is a winning
counter — but by [von Neumann's minimax theorem](../lexicon/README.md#nash-equilibrium)
it has a value in **mixed strategies**. The unique [Nash equilibrium](../lexicon/README.md#nash-equilibrium)
is for each player to choose **uniformly at random (⅓, ⅓, ⅓)**; this guarantees
each player an expected payoff of 0 regardless of what the opponent does, so the
game's value is a **draw**. This is the standard introductory example of why
optimal play can require randomisation.

## Consensus on optimal play

- **Play rock, paper, and scissors equally at random** — this is the only strategy that cannot be exploited. It guarantees that, on average, you will neither win nor lose against any opponent.
- **Any predictable pattern can be exploited** — if you play rock even slightly more than one third of the time, an opponent who notices can play paper more often to beat you.
- **Use your knowledge of human habits** — people are bad at being random. Studies show that humans tend to play rock more after a loss, repeat winning moves, and cycle rock-paper-scissors. Taking advantage of these patterns beats pure random play against real people.
- **After losing, most people change** — if your opponent just threw rock and lost, they are less likely to throw rock again. Adjust your prediction based on this.
- **Top-level play is about psychology** — in tournaments, players try to out-think each other's thinking. The random strategy is a safety net, not a way to win.

## Engines & current best play

- **Strongest known program(s):** RoShamBo programming competition bots — agents that exploit opponent patterns via statistical learning (e.g. frequency analysis, history-based prediction).
- **Strength:** Human-pattern-exploiting bots beat human players; equilibrium bots guarantee ≥ 0 expected payoff against any opponent.
- **Where the proof / tablebase lives (if solved):** [Wikipedia](https://en.wikipedia.org/wiki/Rock_paper_scissors); classical minimax theorem (von Neumann 1928).
- **Notes:** The uniform mixed strategy is the complete theoretical solution; practical competitive play adds meta-game psychology on top.

## Complexity

Trivial: three actions per player, a single simultaneous move. Its interest is
conceptual — it is the simplest game whose solution is irreducibly mixed.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Rock_paper_scissors) ([archive](http://web.archive.org/web/20260506060951/https://en.wikipedia.org/wiki/Rock_paper_scissors))
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002) (general framework)

## See also

- [Sim](sim.md) · [Liar's dice](liars-dice.md)
- Lexicon: [Nash equilibrium](../lexicon/README.md#nash-equilibrium) · [draw](../lexicon/README.md#draw) · [zero-sum game](../lexicon/README.md#zero-sum-game)
