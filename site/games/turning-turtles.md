# Turning Turtles

> A coin-turning game that is secretly the same game as Nim. It is fully solved.

| Field | Value |
|-------|-------|
| Also known as | — (a Berlekamp–Conway–Guy coin-turning game) |
| Players | 2 |
| Type | Impartial combinatorial game (coin-turning game) |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Strongly solved |
| **Game-theoretic value** | Equivalent to a Nim position; second-player win iff the nim-sum of head positions is 0 |
| Year solved | 1956–1982 (octal-game era; full treatment in *Winning Ways*) |
| Solved by | Berlekamp, Conway & Guy |
| State-space complexity | Depends on the row length |
| Game-tree complexity | Depends on the row length |
| **Playable** | turning-turtles |

## Description

A row of coins, each showing heads or tails, with positions numbered 1, 2, 3, and so on. On a turn, a player flips over one or two coins. The rightmost coin that is flipped must go from heads to tails. The player who makes the last move wins.

## Solution status

Turning Turtles is **strongly solved** — and the solution is especially clean:
it is **[Nim](nim.md) in disguise**. A single heads coin at position *n* behaves
exactly like a Nim heap of size *n*, and a whole row is the
[nim-sum](../lexicon/README.md#nim-sum) of those heaps. So the position is a
second-player win exactly when the XOR of the positions of all heads coins is 0,
and otherwise the player to move wins by the ordinary Nim rule.

This makes Turning Turtles the standard worked example of the coin-turning
framework: it shows that "turn coins" games inherit the entire
[Sprague–Grundy](../lexicon/README.md#sprague-grundy-theorem) theory.

## Consensus on optimal play

- **Each heads-up coin acts like a pile in Nim** — a coin showing heads at position n behaves like a pile of n tokens in the game of Nim. The whole row is the combination of all these piles.
- **Calculate the nim-sum of all heads positions** — write each heads coin's position number in binary and add them without carrying (called XOR). If the result is 0, you are in a losing position. If it is not 0, you can win.
- **Find a move that makes the XOR zero** — look for a way to flip one or two coins so that the XOR of the remaining heads positions becomes 0. This is the winning move.
- **Flipping two coins is sometimes necessary** — when you flip two coins (the rightmost from heads to tails, and an earlier coin from tails to heads), you are effectively changing two piles at once. Use this when flipping a single coin cannot make the XOR zero.
- **The rightmost flipped coin must always go from heads to tails** — this rule ensures the game always progresses toward an end. Each move reduces the value of at least one heads coin.

## Engines & current best play

- **Strongest known program(s):** No game-specific engine needed; the Nim XOR strategy is a closed-form O(n) computation.
- **Strength:** Perfectly solved; any implementation of the XOR strategy wins from all N-positions.
- **Where the proof / tablebase lives (if solved):** *Winning Ways* ([../references.md#bcg2001](../references.md#bcg2001)); coin-turning games framework by Berlekamp, Conway & Guy.
- **Notes:** Turning Turtles is the standard introductory example of the coin-turning game equivalence; its one-to-one correspondence with Nim is the cleanest illustration of the Sprague–Grundy theorem in action.

## Complexity

Linear in the row length to evaluate a position.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Nim) ([archive](http://web.archive.org/web/20260513001624/https://en.wikipedia.org/wiki/Nim))
- [Berlekamp, Conway & Guy (2001). *Winning Ways for Your Mathematical Plays*.](../references.md#bcg2001)
- [Bouton, C. L. (1901). *Nim, A Game with a Complete Mathematical Theory*.](../references.md#bouton1901)

## See also

- [Nim](nim.md) · [Mock Turtles](mock-turtles.md) · [Northcott's game](northcotts-game.md)
- Lexicon: [nim-sum](../lexicon/README.md#nim-sum) · [Sprague–Grundy theorem](../lexicon/README.md#sprague-grundy-theorem)
