# Notakto

> Tic-tac-toe where both players play X, and making three-in-a-row *loses* —
> impartial misère tic-tac-toe.

| Field | Value |
|-------|-------|
| Also known as | Neutral tic-tac-toe, "no tac toe" |
| Players | 2 |
| Type | Impartial combinatorial game (misère play) |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Weakly solved (single board and multi-board versions analysed) |
| **Game-theoretic value** | Single 3×3 board: second player can avoid losing → first player loses with best play (see below) |
| Year solved | 2013 |
| Solved by | Thane E. Plambeck & Greg Whitehead |
| State-space complexity | Small (single board); grows with number of boards |
| Game-tree complexity | Small per board |
| **Playable** | notakto |

## Description

Notakto is [impartial](../lexicon/README.md#impartial-game) tic-tac-toe: **both**
players mark cells with an X, and a player who completes three X's in a row
**loses** ([misère](../lexicon/README.md#misère-play) convention). It is
typically played on **several** 3×3 boards at once — a move is an X on any one
live board, and you lose when forced to complete a line on the last board.

## Solution status

Notakto is **weakly solved** by [Plambeck & Whitehead (2013)](../references.md#plambeck-notakto2013),
who gave a complete analysis using **misère quotient** theory — the algebraic
machinery developed precisely because misère impartial games do not submit to
ordinary [Sprague–Grundy](../lexicon/README.md#sprague-grundy-theorem) theory.
They showed the multi-board game is governed by a finite commutative monoid (of
order 18), so the value of any number of boards in any position is computable.

For the **single 3×3 board**, the player forced to move first into a losing
configuration is determined: with perfect play the first player cannot avoid
eventually being the one to complete a line. The clean closed-form result is the
monoid for the multi-board game.

## Consensus on optimal play

- **Avoid the last X — the loser completes a line** — every move should aim to leave the opponent in a position where every cell they can play completes a three-in-a-row somewhere.
- **On a single board, first player loses with perfect play** — the second player can always mirror the winning response; knowing this, the first player should try to create symmetric or forcing positions as early as possible.
- **Multi-board: track the misère monoid value** — compute each board's equivalence class in the order-18 monoid described by Plambeck & Whitehead, then combine by monoid multiplication; a position with a losing monoid value means you are to move into a loss.
- **Fork to create two "live" lines** — placing an X that threatens two potential completions forces your opponent to complete one, keeping you safe for another turn.
- **Avoid "dead" boards in your own move** — completing a line on a board you are forced to play on ends the game for you if it is the last board; delay exhausting boards until the opponent is in a worse state.

## Engines & current best play

- **Strongest known program(s):** Plambeck & Whitehead's solver (2013) — misère quotient monoid analysis.
- **Strength:** Perfect play via the monoid arithmetic; the solution is compact and computable.
- **Where the proof / tablebase lives (if solved):** [Plambeck & Whitehead (2013)](../references.md#plambeck-notakto2013)
- **Notes:** The closed-form monoid solution means any program implementing the 18-element multiplication table plays perfectly on any number of boards.

## Complexity

Small; the achievement is the *algebraic* solution, not raw search.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Notakto) ([archive](http://web.archive.org/web/20260326083823/https://en.wikipedia.org/wiki/Notakto))
- [Plambeck, T. E. & Whitehead, G. (2013). *The Secrets of Notakto*.](../references.md#plambeck-notakto2013)

## See also

- [Tic-tac-toe](tic-tac-toe.md) · [Treblecross](treblecross.md) · [Misère Nim](misere-nim.md)
- Lexicon: [misère play](../lexicon/README.md#misère-play) · [impartial game](../lexicon/README.md#impartial-game)
