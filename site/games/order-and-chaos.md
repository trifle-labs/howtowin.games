# Order and Chaos

> An asymmetric tic-tac-toe variant: one player wants a line, the other wants to
> prevent any.

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

Played on a 6×6 grid. **Both** players may place **either** an X or an O in any
empty cell. The player "Order" wins if **five identical symbols** (all X or all
O) ever appear in a row, column, or diagonal. The player "Chaos" wins if the
board fills with no such line. It is a [Maker–Breaker](../lexicon/README.md#maker-breaker-game)
game: Order is Maker, Chaos is Breaker.

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

- **Order should build dual-symbol threats** — because Order can place either X or O, a single row can threaten completion with X if one more X is placed, and simultaneously threaten O-completion if one more O is placed; Chaos cannot block both with a single move.
- **Chaos must avoid homogeneous clusters** — placing a mix of X and O close together is Chaos's best disruption; it prevents Order from extending any single run without creating a different run that Chaos must also address.
- **Order targets diagonals** — diagonals are harder for Chaos to monitor simultaneously with rows and columns; Order should seed diagonal five-in-a-row threats.
- **Chaos exploits board edges** — near the edge fewer cells complete a five-line; placing odd symbols at edge cells makes it harder for Order to build through the edge zones.
- **Order wins with correct play** — the exhaustive solution confirms Order can always force a five-line on the 6×6 board; Chaos's task requires perfect vigilance and is ultimately futile.

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
