# Ultimate tic-tac-toe

> Nine tic-tac-toe boards nested inside one — small-looking, but its standard
> game is not solved.

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

## Description

Played on a 3×3 arrangement of nine small [tic-tac-toe](tic-tac-toe.md) boards.
A move's cell *within* a small board dictates *which* small board the opponent
must play in next. Winning a small board claims it; winning three small boards
in a row wins the game. (Rules vary on what happens when you are sent to an
already-decided board.)

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

- **Winning the centre macro-board is the highest strategic goal** — the centre small board participates in all four winning lines (row, column, and both diagonals) of the meta-board; fight hard for it and send the opponent to weak macro-cells when possible.
- **Send your opponent to already-decided or unfavourable boards** — a move in cell X of the current small board sends the opponent to small board X; send them to boards you have won (they play in the neutral cell) or to boards where they have few good options.
- **Control local boards with tic-tac-toe principles** — within each small board, take the centre first, corners second, block two-in-a-rows; strong local play is necessary to claim macro-boards.
- **Use the "free choice" rule wisely** — under most rule variants, when you are sent to an already-won or full board you may play anywhere; this is a powerful tempo advantage, so deliberately fill contested boards to earn free-choice turns.
- **Balance board wins with strategic sends** — winning a small board is only worthwhile if it does not send the opponent to a macro-pivotal board; sometimes deliberately losing a small board is correct to control where the opponent plays next.

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
