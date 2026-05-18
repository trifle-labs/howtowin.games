# Ultimate tic-tac-toe

> A larger version of tic-tac-toe made of nine smaller tic-tac-toe boards. It has not been solved.

| Field | Value |
|-------|-------|
| Also known as | Super tic-tac-toe, meta tic-tac-toe, (tic-tac-toe)² |
| Players | 2 |
| Type | Partisan positional game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Unsolved |
| **Game-theoretic value** | Unknown (not established by a verified proof) |
| Year solved | — |
| Solved by | — |
| State-space complexity | Far larger than ordinary tic-tac-toe; full figure not standardised |
| Game-tree complexity | Large |
| **Playable** | ultimate-tic-tac-toe |

## Description

Played on a 3x3 grid of nine small tic-tac-toe boards. When you mark a cell in a small board, that cell's position tells the opponent which small board they must play in next. Winning a small board claims it for you. Winning three small boards in a row wins the overall game. (Different rule sets handle what happens when you are sent to an already-decided board differently.)

## Solution status

Ultimate tic-tac-toe is **unsolved**. The forced-board mechanic makes the game
tree much larger and far less symmetric than it looks, and although the game is
small enough that a determined solving effort is plausible, this archive is not
aware of a **verified, citable** proof of its game-theoretic value. Claims of a
solution circulate informally; until a primary source is confirmed, the standard
game should be treated as unsolved.

> **[verify]** — If a rigorous solution (with a fixed rule set for
> already-won boards) has been published, it should be added here.

## Consensus on optimal play

- **Winning the center big board is the most important goal** — the center small board is part of all four winning lines (row, column, and both diagonals) of the overall game. Fight hard for it, and send the opponent to weak boards when you can.
- **Send the opponent to already-decided or bad boards** — when you play in cell X of the current small board, the opponent must play in small board X. Send them to a board you have already won (they will have to play in the neutral leftover cell) or to a board where they have few good moves.
- **Use basic tic-tac-toe strategy within each small board** — in each small board, take the center first, corners second, and block two-in-a-rows. Strong local play is necessary to win big boards.
- **Use the free-choice rule wisely** — under most rules, when sent to an already-won or full board, you can play anywhere on the whole board. This is a powerful advantage, so deliberately fill contested boards to earn free-choice turns.
- **Balance winning boards with sending the opponent to bad boards** — winning a small board is only helpful if it does not send the opponent to a strategically important board. Sometimes it is correct to lose a small board on purpose to control where the opponent plays next.

## Engines & current best play

- **Strongest known program(s):** MCTS-based programs (various informal implementations); online platforms (e.g., BoardGameArena) host AI opponents.
- **Strength:** Competitive with strong amateur humans; top implementations are likely stronger than most casual players.
- **Where the proof / tablebase lives (if solved):** No verified citable solution known to the cataloguer; the game-theoretic value is **[verify]**.
- **Notes:** Informal claims of a first-player win circulate online, but without a published proof with a fixed rule set for already-won boards, the game should be treated as unsolved.

## Complexity

Much larger than tic-tac-toe; exact standardised figures are not well
established in the literature.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Ultimate_tic-tac-toe) ([archive](http://web.archive.org/web/20260320194944/https://en.wikipedia.org/wiki/Ultimate_tic-tac-toe))
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002) (general framework)

## See also

- [Tic-tac-toe](tic-tac-toe.md) · [Qubic](qubic.md) · [Order and Chaos](order-and-chaos.md)
- Lexicon: [game-tree complexity](../lexicon/README.md#game-tree-complexity) · [solving vs. strong play](../lexicon/README.md#solving-vs-strong-play)
