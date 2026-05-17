# Russian draughts

> 8×8 draughts variant with flying kings and backward man-captures — unsolved.

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
| State-space complexity | Similar to English draughts (~5×10^20) |
| Game-tree complexity | Similar to English draughts |

## Description

Russian draughts is the dominant 8×8 draughts variant in the former Soviet
sphere. Unlike English draughts it allows men to capture backward, kings move
any distance along a diagonal ("flying king"), and a man that reaches the back
rank during a capture sequence is immediately promoted.

## Rules

1. Board: 8×8 standard draughts board. Each player has 12 men on dark squares.
2. Men move one square diagonally forward to an empty square.
3. Men **capture** by jumping diagonally forward **or backward** over an
   adjacent enemy piece onto an empty square; captures are mandatory and may
   chain.
4. A man reaching the far rank becomes a **king**. If the man reaches the far
   rank during a chain capture and can continue capturing as a king, it does
   so immediately as a king.
5. Kings move and capture any number of squares along an unblocked diagonal.
6. A player who cannot move loses.

## Solution status

Russian draughts is **not solved**. Engines are very strong (Tundra, Kestog,
etc.); endgame tablebases up to some piece counts exist but no full proof of
the value has been published.

## Consensus on optimal play

- **Flying kings dominate endgames** — a king can traverse the entire board in one move; securing a king promotion radically changes the position and is the primary strategic goal once material is reduced.
- **Backward captures extend man mobility** — unlike English draughts, men can capture backward; use this to set up multi-jump combinations that English-draughts players would overlook.
- **Mid-capture promotion is critical** — if a man reaches the back rank during a forced capture chain and can continue as a king, it does so immediately; calculate capture sequences carefully to see whether mid-chain crowning is available.
- **Centralise to control diagonals** — pieces in the centre of the board control more capture options and cannot be easily cornered; pieces on the edge have fewer diagonals available.
- **Build breakthrough structures** — getting two or three men in a diagonal cluster toward the promotion rank forces captures that thin the opponent's defence, a key attacking motif in Shashki grandmaster games.

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
