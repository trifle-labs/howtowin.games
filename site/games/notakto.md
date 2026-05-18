# Notakto

> Tic-tac-toe where both players use X, and making three in a row makes you lose instead of winning.

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

Notakto is tic-tac-toe where **both** players place X marks, and a player who makes three X's in a row **loses** instead of winning. It is usually played on **several** 3x3 boards at the same time — each turn you place an X on any board that is still active. You lose when you are forced to make a line on the last remaining board.

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

- **Avoid being the one who makes a line** — every move should aim to leave the opponent in a position where every cell they can play would complete a three-in-a-row somewhere.
- **On a single board, the first player loses with perfect play** — the second player can always mirror and counter. If you are first, try to create symmetrical or forcing positions as early as possible.
- **Multiple boards: use the solution table** — each board can be classified into one of 18 types (as described by Plambeck & Whitehead). Combine board types using a special multiplication table. If the combined value is a losing type, you are about to lose.
- **Create forks that threaten two lines at once** — placing an X that threatens two different ways to complete a line forces the opponent to complete one, keeping you safe for another turn.
- **Do not finish a board yourself** — completing a line on a board you are forced to play on ends the game if it is the last board. Delay finishing boards until the opponent is in a worse position.

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
