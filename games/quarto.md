# Quarto

> A four-in-a-row game with a devious twist — *your opponent* chooses the piece
> you must place. Reported solved as a draw.

| Field | Value |
|-------|-------|
| Also known as | Quarto |
| Players | 2 |
| Type | Partisan positional game with opponent-chosen pieces |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Weakly solved **[verify]** |
| **Game-theoretic value** | Draw **[verify]** |
| Year solved | — (small enough for exhaustive search; solutions reported) |
| Solved by | — |
| State-space complexity | A few million reachable positions |
| Game-tree complexity | Small by modern standards |

## Description

Played on a 4×4 board with 16 distinct pieces, each having four binary
attributes (tall/short, light/dark, round/square, solid/hollow). The twist: on
your turn you place the piece **your opponent hands you**, then hand them the
piece they must place next. A player wins by completing a line of four pieces
that **share at least one attribute**. (A common variant also counts 2×2
squares.)

## Solution status

Quarto is small — a 4×4 board and 16 pieces give only a few million reachable
positions — and is **reported to be weakly solved by exhaustive search, with
the standard game a draw**: with perfect play neither player can force a
shared-attribute line, because the opponent always retains a safe piece to hand
over.

> **[verify]** — The draw verdict is the commonly cited result and is
> consistent with exhaustive analysis of a game this size, but this archive has
> not confirmed a single canonical primary citation. The rule variant matters:
> adding the 2×2-square winning condition changes the analysis, and a solving
> source should specify which rules it used.

## Consensus on optimal play

- **Never hand over a "quarto-completing" piece** — before handing the opponent their next piece, check all partial lines of three with a shared attribute; if any such line exists and the piece completes it, find a different piece to hand over.
- **Build lines that require rare attributes** — a partial row of three "tall round" pieces needs one more tall round piece to complete it; if only one such piece remains unplaced, control of that piece is decisive.
- **Force the opponent to hand you a dangerous piece** — by holding the board in a state where almost every remaining piece completes some line, you corner the opponent into handing over a winner.
- **The 2×2 square variant is harder to defend** — if playing with the 2×2 square win condition, also track partial 2×2 groups; the extra winning conditions sharply limit the "safe" pieces to hand over.
- **Midgame piece selection matters as much as placement** — placing optimally but handing over a game-losing piece is the same as playing a losing move; the hand-over decision is half the game.

## Engines & current best play

- **Strongest known program(s):** No game-specific public engine known to the cataloguer. Playable in general-purpose abstract-game frameworks (e.g., [Ludii](https://ludii.games/)).
- **Strength:** Not benchmarked publicly; the game is small enough for any complete search to play perfectly.
- **Where the proof / tablebase lives (if solved):** No canonical primary citation confirmed; draw verdict widely reported.
- **Notes:** The draw result should be treated as preliminary until a verified publication is located; the rule variant (with/without 2×2 squares) must be specified.

## Complexity

A few million positions — exhaustively searchable.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Quarto_(board_game))
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002) (general framework)

## See also

- [Tic-tac-toe](tic-tac-toe.md) · [Teeko](teeko.md) · [Connect Four](connect-four.md)
- Lexicon: [weakly solved](../lexicon/README.md#weakly-solved) · [draw](../lexicon/README.md#draw)
