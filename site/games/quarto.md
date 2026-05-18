# Quarto

> A four-in-a-row game with a tricky twist: your opponent chooses the piece you have to place. Reported solved as a draw.

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
| **Playable** | quarto |

## Description

Played on a 4x4 board with 16 different pieces, each with four yes/no qualities (tall or short, light or dark, round or square, solid or hollow). The twist: on your turn you place the piece **your opponent gives you**, then you give them the piece they have to place next. A player wins by getting four pieces in a row that **share at least one quality**. (A common variant also counts 2x2 squares.)

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

- **Never hand the opponent a piece that would let them win** — before giving the opponent their next piece, check all rows of three that share a quality. If any such line exists and the piece you are about to hand over would complete it, give them a different piece.
- **Build lines that need rare pieces** — a partial row of three "tall round" pieces needs one more tall round piece to finish. If only one such piece is left unplaced, controlling that piece is decisive.
- **Trap the opponent into handing you a winning piece** — set up the board so that almost every remaining piece completes some line. This corners the opponent into giving you a piece that wins.
- **The 2x2 square variant is harder to defend** — if playing with the 2x2 square win condition, also watch for partial 2x2 groups. The extra winning conditions sharply cut down the number of "safe" pieces to hand over.
- **Choosing what to give is half the game** — you can place pieces perfectly but still lose by handing over a bad piece. The hand-over decision is just as important as where you place.

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
