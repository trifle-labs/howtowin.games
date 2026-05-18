# Bridg-it

> A connection game with a complete, elegant solution. The first player wins, and we know exactly how.

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

Bridg-it (David Gale's game, sold in the 1960s) is played on two overlapping
grids of dots — one grid for each player. Players take turns drawing a short
line connecting two neighboring dots of their own color, without crossing the
opponent's lines. One player tries to build a path from top to bottom, the
other from left to right. It is a specific version of the
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

- **First player makes one strong opening move, then mirrors using the pairing strategy** — after the opening, every line on the board (except the one already played) can be paired with a partner line. Whenever the opponent plays one line of a pair, the first player immediately plays its partner. This guarantees a winning path no matter what the opponent does.
- **The pairing strategy is all you need** — no need for guesswork. The pairing strategy is a mathematically proven winning method that can be followed move by move without any lookahead.
- **Second player cannot win against the pairing strategy** — the game is decided. Playing second in Bridg-it is a losing position with no way out, which is why the swap (pie) rule is needed for fair competitive play.
- **The game has no draws** — because of how the board is built, one player must form a winning connection before the other. This is guaranteed by a topological proof (similar to Hex's no-draw proof).

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
