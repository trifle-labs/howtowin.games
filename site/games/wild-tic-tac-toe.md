# Wild tic-tac-toe

> A version of tic-tac-toe where each player can place either X or O on their turn. The first player has a guaranteed win.

| Field | Value |
|-------|-------|
| Also known as | Wild tic-tac-toe, "Your Choice" tic-tac-toe |
| Players | 2 |
| Type | Partisan placement game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Strongly solved |
| **Game-theoretic value** | First-player win |
| Year solved | folklore |
| Solved by | Exhaustive enumeration |
| State-space complexity | Tiny |
| Game-tree complexity | Tiny |
| **Playable** | wild-tic-tac-toe |

## Description

A small variant of tic-tac-toe. On each turn, the player chooses whether to place an X or an O. The first player to complete a three-in-a-row of either symbol wins.

## Rules

1. Standard 3x3 board, empty at the start.
2. On each turn, the player places either an X or an O (their choice) on any empty cell.
3. The first player to complete a three-in-a-row of any symbol — even a symbol they did not place themselves — wins.
4. If the board fills with no three-in-a-row, the game is a draw (this is very rare).

## Solution status

Strongly solved by trivial exhaustive search. With both players able to pick
symbols, the **first player wins** — they can play the centre, then mirror or
fork to force completion of a line on the next few moves. Misère Wild
tic-tac-toe (last-to-complete-loses) is also solved by exhaustive search, and
the answer is more nuanced; **[verify]** the precise misère value.

## Consensus on optimal play

- **First player takes the center on move 1** — the center is part of 4 of the 8 winning lines. Combined with the freedom to place either X or O, the first player immediately threatens a line.
- **Use the "complete any symbol" rule to your advantage** — you can win by finishing a row of O's even if you have been placing X's. Keep track of near-complete lines of both symbols and race to complete one.
- **Create a fork with two near-complete lines** — if you can create a position where two three-in-a-rows are each one cell away, the opponent cannot block both. Choose the symbol that contributes to both threatened lines.
- **The defender cannot easily block both symbols** — in regular tic-tac-toe, the defender knows which symbol to block. In Wild tic-tac-toe, you can switch symbols each turn, making defense much harder.
- **The misere variant (completing a row loses) is harder** — in this version, avoid being the one to place the final piece of any three-in-a-row. The strategy requires careful symbol selection to force the opponent into completing a row.

## Engines & current best play

- **Strongest known program(s):** No game-specific engine; exhaustive search over the tiny state space gives a complete strategy table.
- **Strength:** Perfectly solved; the first player wins with correct play in the normal convention.
- **Where the proof / tablebase lives (if solved):** Follows from trivial exhaustive enumeration; discussed in the *Winning Ways* framework ([../references.md#bcg2001](../references.md#bcg2001)).
- **Notes:** The misère variant's precise first/second-player value should be verified — the normal-play first-player win is unambiguous.

## Complexity

Tiny — the entire game tree fits on a small page.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Tic-tac-toe_variants)
- [Berlekamp, Conway & Guy (2001–2004). *Winning Ways for Your Mathematical Plays*.](../references.md#bcg2001) (general framework)

## See also

- [Tic-tac-toe](tic-tac-toe.md) · [Order and Chaos](order-and-chaos.md) · [Notakto](notakto.md)
- Lexicon: [strongly solved](../lexicon/README.md#strongly-solved) · [misère play](../lexicon/README.md#misere-play)
