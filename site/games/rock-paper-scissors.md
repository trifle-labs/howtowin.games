# Rock-paper-scissors

> The textbook example of a game with no pure-strategy solution — its unique
> Nash equilibrium is the uniform mixed strategy, and the game is a draw under
> equilibrium play.

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

Both players simultaneously choose rock, paper, or scissors. Rock beats scissors,
scissors beats paper, paper beats rock; identical choices draw. It is the
canonical **simultaneous-move zero-sum game** — there is no "first player," and
because moves are revealed at once it is technically a game of imperfect
information.

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

- **Play uniformly at random (⅓, ⅓, ⅓)** — this is the unique Nash equilibrium; it guarantees expected payoff 0 against any opponent and cannot be exploited.
- **Any deviation from uniform is exploitable** — if you play rock even slightly more than ⅓ of the time, an opponent who detects this can profitably shift toward paper; the uniform strategy is the only strategy with no counter.
- **Against humans, exploit pattern biases** — people are notoriously non-random; studies consistently show that humans throw rock most often after a loss, repeat wins, and cycle R→P→S; pattern-exploitation beats equilibrium play against imperfect opponents.
- **After a loss, most humans switch** — if an opponent just threw rock and lost, they are statistically less likely to throw rock again; updating on this prior can give an edge in competitive human play.
- **Competitive RPS is a psychology game** — at the highest level (e.g. World RPS Society tournaments) players attempt to "level" each other's meta-reasoning, making the equilibrium a baseline to deviate from rather than a target to achieve.

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
