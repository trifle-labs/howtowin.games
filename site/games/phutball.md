# Phutball

> Conway's "Philosopher's Football." Even figuring out whether a single move wins is provably very hard.

| Field | Value |
|-------|-------|
| Also known as | Philosopher's Football, Phil's Football |
| Players | 2 |
| Type | Partisan combinatorial game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Unsolved |
| **Game-theoretic value** | Unknown |
| Year solved | — |
| Solved by | — |
| State-space complexity | Large (typically a 19×15 grid) |
| Game-tree complexity | Large |
| **Playable** | phutball |

## Description

Played on a grid (usually 19x15). There is one shared ball. On your turn you either place a "man" on an empty point, or make the ball **jump** over a line of men that are next to each other (up, down, left, right, or diagonally), removing the men it jumps over — and jumps can be chained one after another. You score by getting the ball onto or past the opponent's goal line. Importantly, **both players use the same men** (there are no teams of men), so the game is impartial in terms of who owns what.

## Solution status

Phutball is **unsolved**, and there is a precise reason to expect it to stay
hard: [Demaine, Demaine & Eppstein (2002)](../references.md#demaine-phutball2002)
proved that **deciding whether the player to move has a move that wins
immediately is NP-hard**. That is — not "who wins the game," but merely "is
there a winning *single move* right now" — is already computationally
intractable. This makes Phutball one of the standard examples of a game whose
*local* tactics, never mind global strategy, resist analysis.

## Consensus on optimal play

- **Build a line of men toward your goal** — placing men in a diagonal or straight line lets the ball chain-jump over all of them in one move. A long ready-made chain can carry the ball to or past the goal line in a single turn.
- **Block the opponent's jump paths** — place men to break the lines the opponent could use. A single gap in their chain stops a decisive long jump.
- **Control the centre** — men near the centre can be used in more potential jump chains, and the ball can be redirected through the centre toward either goal.
- **Watch out for jumps that fall short** — a greedy chain jump that moves the ball far but stops just before the goal line might leave it in a worse position for the opponent to take next turn.
- **Do not underestimate placing a man** — placing a man instead of jumping keeps your chain structure for future turns and can block an opponent's chain at the same time. Do not jump just because you can.

## Engines & current best play

- **Strongest known program(s):** No game-specific public engine known to the cataloguer. Playable in general-purpose abstract-game frameworks (e.g., [Ludii](https://ludii.games/)).
- **Strength:** Not benchmarked.
- **Notes:** Even deciding whether a single winning move exists is NP-hard; no strong AI has been publicly published for Phutball.

## Complexity

The board is large and chained jumps give a high, variable branching factor; no
useful exhaustive analysis exists.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Phutball) ([archive](http://web.archive.org/web/20260203090111/https://en.wikipedia.org/wiki/Phutball))
- [Demaine, E. D., Demaine, M. L. & Eppstein, D. (2002). *Phutball Endgames are Hard*.](../references.md#demaine-phutball2002)
- [Berlekamp, Conway & Guy (2001). *Winning Ways for Your Mathematical Plays*.](../references.md#bcg2001)

## See also

- [Amazons](amazons.md) · [Hex](hex.md)
- Lexicon: [PSPACE-complete / EXPTIME-complete](../lexicon/README.md#pspace-complete--exptime-complete) · [impartial game](../lexicon/README.md#impartial-game)
