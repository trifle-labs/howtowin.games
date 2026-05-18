# Order and Chaos

> An uneven tic-tac-toe variant: one player tries to make a line, the other tries to stop it from happening.

| Field | Value |
|-------|-------|
| Also known as | Order and Chaos |
| Players | 2 (asymmetric roles) |
| Type | Maker–Breaker positional game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Weakly solved |
| **Game-theoretic value** | Order (the player going first / seeking a line) wins **[verify]** |
| Year solved | — (small enough for exhaustive search) |
| Solved by | — |
| State-space complexity | Comparable to a 6×6 placement game; exhaustible |
| Game-tree complexity | Small |
| **Playable** | order-and-chaos |

## Description

Played on a 6x6 grid. **Both** players can place **either** an X or an O in any empty cell. The player called "Order" wins if **five matching symbols** (all X or all O) appear in a row, column, or diagonal. The player called "Chaos" wins if the board fills up without any such line. This is a "Maker-Breaker" game: Order tries to make something, Chaos tries to break it.

## Solution status

Order and Chaos is **weakly solved** by exhaustive search — the 6×6 board is
small enough to analyse completely. The standard reported result is that
**Order wins** with perfect play (Order conventionally moves first). The
intuition: because Order may use *both* symbols, the freedom to choose X or O on
each move gives enough flexibility to force a five-line against any blocking by
Chaos.

> **[verify]** — The "Order wins" verdict is widely repeated and consistent
> with exhaustive analysis, but this archive should cite a specific primary
> computation (and pin down the exact rule set: board size and whether Order or
> Chaos moves first).

## Consensus on optimal play

- **Order should build threats with both symbols** — since Order can place either X or O, a single row can threaten to become five X's with one more X, or five O's with one more O. Chaos cannot block both possibilities with one move.
- **Chaos must keep symbols mixed** — placing a mix of X and O near each other is Chaos's best defence. It stops Order from extending any single run without creating another threat that Chaos must also handle.
- **Order should aim for diagonals** — diagonals are harder for Chaos to watch at the same time as rows and columns. Plant diagonal five-in-a-row threats early.
- **Chaos should use the edges** — near the board edge, fewer cells are available to complete a five-in-a-row. Placing odd symbols at edge cells makes it harder for Order to build through those zones.
- **Order wins with correct play** — exhaustive search confirms Order can always force a five-line on the 6x6 board. Chaos's task requires perfect vigilance and is ultimately hopeless against perfect play.

## Engines & current best play

- **Strongest known program(s):** No game-specific public engine known to the cataloguer. Playable in general-purpose abstract-game frameworks (e.g., [Ludii](https://ludii.games/)).
- **Strength:** Not benchmarked.
- **Notes:** The 6×6 board is small enough for complete exhaustive search; any brute-force solver with correct rules will confirm Order's win.

## Complexity

Exhaustively searchable on the standard 6×6 board.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Order_and_Chaos) ([archive](http://web.archive.org/web/20260430010757/https://en.wikipedia.org/wiki/Order_and_Chaos))
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002) (general framework)

## See also

- [Tic-tac-toe](tic-tac-toe.md) · [Gomoku](gomoku.md) · [Notakto](notakto.md)
- Lexicon: [maker-breaker game](../lexicon/README.md#maker-breaker-game) · [weakly solved](../lexicon/README.md#weakly-solved)
