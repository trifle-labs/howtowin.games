# Bridg-it

> A connection game with a complete, elegant solution — the first player wins,
> and we know exactly how.

| Field | Value |
|-------|-------|
| Also known as | Gale, the Game of Gale, Bird Cage |
| Players | 2 |
| Type | Partisan connection game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Strongly solved |
| **Game-theoretic value** | First-player win |
| Year solved | 1964 (matroid solution); explicit pairing strategy also known |
| Solved by | Alfred Lehman (matroid theory); Oliver Gross (pairing strategy) |
| State-space complexity | Depends on board size |
| Game-tree complexity | Depends on board size |
| **Playable** | bridg-it |

## Description

Bridg-it (David Gale's game, marketed in the 1960s) is played on two
interleaved grids of dots — one for each player. Players alternately draw a
short edge connecting two adjacent dots of their own colour, never crossing an
opponent's edge. One player tries to build a connected path between the top and
bottom, the other between left and right. It is a specific instance of the
[Shannon switching game](shannon-switching-game.md).

## Solution status

Bridg-it is **strongly solved**, and unusually it has *two* clean solutions:

- **Pairing strategy.** Oliver Gross found an explicit
  [pairing strategy](../lexicon/README.md#pairing-strategy) for the first player:
  the board's edges can be paired up so that, after the first player's strong
  opening move, every opponent move has a designated partner edge whose play
  maintains the winning connection. This is a complete, easily executed winning
  strategy.
- **Matroid solution.** [Lehman (1964)](../references.md#lehman1964) solved the
  general Shannon switching game (of which Bridg-it is a case) using matroid
  theory, characterising exactly when the connecting player can win.

Either way, the first player wins from the standard start, with a known
strategy — the definition of strongly solved.

## Consensus on optimal play

- **First player makes one strong opening move, then mirrors using the pairing strategy** — after the opening, every edge on the board (except the one already played) can be paired with a partner edge; whenever the opponent plays one edge of a pair, the first player immediately plays its partner, guaranteeing a connected path regardless of what the opponent does.
- **The pairing strategy is the complete answer** — there is no need for heuristic reasoning; the pairing strategy is a mathematically proven winning strategy and can be executed move-by-move without lookahead.
- **Second player cannot win against the pairing strategy** — the game is decided; playing second in Bridg-it is a losing position with no recourse, making the swap (pie) rule essential for competitive fair play.
- **The game has no draws** — by the parity of the board construction, one player must form a winning connection before the other; this is guaranteed by a topological argument (similar to Hex's no-draw proof).

## Engines & current best play

- **Strongest known program(s):** Any program that implements the pairing strategy plays perfectly. No specialised commercial engine needed.
- **Strength:** Perfect play is achievable by a simple rule (pairing strategy) — no search required.
- **Where the proof / tablebase lives (if solved):** Lehman (1964) via matroid theory; Gross pairing strategy described in [Berlekamp, Conway & Guy (2001)](../references.md#bcg2001).
- **Notes:** Bridg-it is one of the rare non-trivial two-player games with a clean, human-executable winning strategy rather than a lookup table or deep search tree.

## Complexity

Grows with board size, but the pairing strategy makes optimal play O(1) per move
regardless.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Shannon_switching_game) ([archive](http://web.archive.org/web/20260107194010/https://en.wikipedia.org/wiki/Shannon_switching_game))
- [Lehman, A. (1964). *A solution of the Shannon switching game*.](../references.md#lehman1964)
- [Berlekamp, Conway & Guy (2001). *Winning Ways for Your Mathematical Plays*.](../references.md#bcg2001)

## See also

- [Shannon switching game](shannon-switching-game.md) · [Hex](hex.md) · [Y](y.md)
- Lexicon: [pairing strategy](../lexicon/README.md#pairing-strategy) · [strongly solved](../lexicon/README.md#strongly-solved)
