# Russian draughts

> An 8x8 draughts variant where kings can fly across the board and men can capture backward. It has not been solved.

| Field | Value |
|-------|-------|
| Also known as | Shashki |
| Players | 2 |
| Type | Partisan draughts |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Unsolved |
| **Game-theoretic value** | Unknown |
| Year solved | — |
| Solved by | — |
| **Playable** | russian-draughts |
| State-space complexity | Similar to English draughts (~5×10^20) |
| Game-tree complexity | Similar to English draughts |

## Description

Russian draughts is the main 8x8 draughts game played in the former Soviet countries. Unlike English draughts (checkers), men can capture backward, kings can move any distance along a diagonal (called a "flying king"), and if a man reaches the back row during a capture sequence it becomes a king right away.

## Rules

1. Board: standard 8x8 draughts board. Each player has 12 men on the dark squares.
2. Men move one square diagonally forward to an empty square.
3. Men **capture** by jumping diagonally forward **or backward** over a neighboring enemy piece onto an empty square. Captures are required and may chain together (multiple captures in one turn).
4. A man reaching the far row becomes a **king**. If it reaches the far row during a chain capture and can continue capturing as a king, it does so right away as a king.
5. Kings can move and capture any number of squares along an unblocked diagonal (flying king).
6. A player who cannot move loses.

## Solution status

Russian draughts is **not solved**. Engines are very strong (Tundra, Kestog,
etc.); endgame tablebases up to some piece counts exist but no full proof of
the value has been published.

## Consensus on optimal play

- **Flying kings rule the endgame** — a king can cross the whole board in one move. Getting a king changes the game completely and is the main goal once pieces are few.
- **Use backward captures** — unlike English draughts, men can capture backward. Use this to set up multi-jump combinations that English checkers players would not expect.
- **Watch for mid-capture promotion** — if a man reaches the back row during a forced capture chain and can keep jumping as a king, it does so immediately. Plan capture sequences carefully to see if you can promote mid-chain.
- **Keep pieces in the centre** — pieces in the centre of the board have more capture options and are harder to trap. Pieces on the edge have fewer diagonal paths.
- **Build breakthrough groups** — lining up two or three men in a diagonal toward the promotion row forces captures that thin the opponent's defence. This is a key attacking idea in top-level Russian draughts.

## Engines & current best play

- **Strongest known program(s):** Kestog and Tundra — the strongest Russian draughts-specific engines, widely used in the competitive community.
- **Strength:** Super-human; top engines consistently defeat grandmasters.
- **Where the proof / tablebase lives (if solved):** Not solved; endgame tablebases cover positions up to a few pieces but no full solution exists.
- **Notes:** The game remains unsolved; engines are strong but their strength comes from deep search and evaluation rather than a solved database.

## Complexity

Similar to English draughts.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Russian_draughts) ([archive](http://web.archive.org/web/20260315193309/https://en.wikipedia.org/wiki/Russian_draughts))
- [Schaeffer et al. (2007). *Checkers is Solved*.](../references.md#schaeffer2007) (related)
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)

## See also

- [English draughts](checkers.md) · [Italian draughts](italian-draughts.md) · [Brazilian draughts](brazilian-draughts.md) · [International draughts](international-draughts.md)
- Lexicon: [endgame tablebase](../lexicon/README.md#endgame-tablebase)
