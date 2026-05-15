# Turning Turtles

> The simplest coin-turning game — and it turns out to be exactly Nim in
> disguise.

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

## Description

A row of coins, each heads or tails, positions numbered 1, 2, 3, …. On a turn a
player turns over **one or two** coins, with the constraint that the
**rightmost coin turned must go from heads to tails**. Under
[normal play](../lexicon/README.md#normal-play-convention) the last player to
move wins.

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

- **Treat every heads coin as a Nim heap** — a heads coin at position n is exactly a Nim heap of size n; the entire row is the disjunctive sum of those heaps.
- **Compute the nim-sum (XOR) of all heads positions** — XOR together the positions of every heads coin; if the result is 0 you are in a losing position, otherwise you are in a winning position.
- **Win by turning one or two coins to zero-out the XOR** — find a heads coin at position n and a way to turn it (and optionally one earlier coin) such that the XOR of the remaining heads positions becomes 0; this is the unique (or one of the) winning moves.
- **Flipping two coins can increase or decrease the effective nim-heap** — when you turn a coin from tails to heads (the leftward coin in a two-coin move) you are adding a new heap; use this to reach the target XOR when a single-coin flip cannot.
- **Opponent must always flip the rightmost coin from heads to tails** — this constraint is the "Nim heap removal" analogue; every legal move reduces the position of at least one heads coin, guaranteeing the game terminates.

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
