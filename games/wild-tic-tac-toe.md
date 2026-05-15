# Wild tic-tac-toe

> Tic-tac-toe in which either player may play either symbol — easy to solve,
> and a strong first-player win.

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

## Description

A small variant of [tic-tac-toe](tic-tac-toe.md): on every turn the player on
the move chooses whether to place an X **or** an O. The first player to
*complete* a three-in-a-row of either symbol wins.

## Rules

1. Standard 3×3 board, empty initially.
2. On each turn the player places **either an X or an O** (their choice) on any
   empty cell.
3. The first player to **complete a three-in-a-row** of any symbol — even an
   opponent's — wins. (Variant: misère version in which the player completing a
   three-in-a-row loses.)
4. If the board fills with no three-in-a-row, the game is a draw (rare).

## Solution status

Strongly solved by trivial exhaustive search. With both players able to pick
symbols, the **first player wins** — they can play the centre, then mirror or
fork to force completion of a line on the next few moves. Misère Wild
tic-tac-toe (last-to-complete-loses) is also solved by exhaustive search, and
the answer is more nuanced; **[verify]** the precise misère value.

## Consensus on optimal play

- **First player takes the centre on move 1** — the centre participates in 4 of the 8 winning lines; combined with the freedom to place either symbol, the first player immediately threatens a line.
- **Exploit the "complete your own or opponent's line" rule** — you can win by finishing a row of O's even if you have been placing X's; keep track of near-complete lines of both symbols and race to complete one.
- **Fork by creating two near-complete lines simultaneously** — if you can create a position where two three-in-a-rows are each one cell short, your opponent cannot block both; choose the symbol that contributes to both threatened lines.
- **The defender cannot easily block both symbols at once** — in ordinary tic-tac-toe the defender knows which symbol to block; in Wild tic-tac-toe you can switch symbols each turn, making defensive reasoning far harder for a naive opponent.
- **Misère Wild tic-tac-toe is genuinely harder** — in the misère variant (completing a row loses), avoid being the one to place the final piece of any three-in-a-row; the strategy inverts and requires careful symbol selection to force the opponent to complete a row.

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
