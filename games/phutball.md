# Phutball

> Conway's "Philosopher's Football" — a game where even deciding whether *one
> move* wins is provably hard.

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

## Description

Played on a grid (commonly 19×15). There is a single shared "ball." On a turn a
player either places a "man" on an empty point, or makes the ball **jump** over
orthogonally/diagonally adjacent contiguous lines of men, removing the jumped
men — and jumps can be chained. A player scores by getting the ball onto or over
the opponent's goal line. Crucially, **both players use the same men**, so
Phutball is [impartial](../lexicon/README.md#impartial-game) in its material.

## Solution status

Phutball is **unsolved**, and there is a precise reason to expect it to stay
hard: [Demaine, Demaine & Eppstein (2002)](../references.md#demaine-phutball2002)
proved that **deciding whether the player to move has a move that wins
immediately is NP-hard**. That is — not "who wins the game," but merely "is
there a winning *single move* right now" — is already computationally
intractable. This makes Phutball one of the standard examples of a game whose
*local* tactics, never mind global strategy, resist analysis.

## Consensus on optimal play

- **Build a line of men toward your goal** — placing men in a diagonal or straight chain allows the ball to chain-jump over them in a single move; a long ready-made chain can carry the ball to or past the goal line in one turn.
- **Deny the opponent's jump paths** — place men to break contiguous chains the opponent could use; a single gap in their chain prevents a decisive jump sequence.
- **Control the centre of the board** — men near the centre participate in more potential jump chains; the ball can be redirected through the centre to either side of the field.
- **Beware long jump sequences that leave the ball short** — a greedy chain jump that moves the ball far but stops just short of the goal line can leave it in an even more dangerous position for the opponent to claim next turn.
- **The placement move is often underestimated** — placing a man instead of jumping keeps your chain infrastructure intact for future turns, and can simultaneously block an opponent chain; do not jump just because you can.

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
