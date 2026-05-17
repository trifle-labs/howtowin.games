# L game

> Edward de Bono's minimalist game on a 4×4 board — tiny, elegant, and a
> complete draw with perfect play.

| Field | Value |
|-------|-------|
| Also known as | The L-Game |
| Players | 2 |
| Type | Partisan combinatorial game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Strongly solved |
| **Game-theoretic value** | Draw (neither player can force a win) |
| Year solved | Game published 1967; solved by exhaustive analysis |
| Solved by | Edward de Bono (game); exhaustive computer/hand analysis |
| State-space complexity | 2,296 distinct positions |
| Game-tree complexity | Tiny |
| **Playable** | l-game |

## Description

Played on a 4×4 board. Each player has one L-shaped piece (covering 4 squares);
there are also two 1×1 neutral pieces. On a turn a player **must** pick up their
L-piece and place it back in a different position (any orientation, including
flipped), and **may** then move one neutral piece to any empty square. A player
who cannot move their L-piece to a new position loses.

## Solution status

The L game is **strongly solved**. The whole game has only **2,296** distinct
positions, so exhaustive analysis — done both by computer and, famously, by hand
— covers every position. The result: with perfect play **neither player can
force a win; the game is a draw**. A player loses only by making a mistake; from
any position, the side to move can always avoid loss.

De Bono designed the game deliberately as the simplest possible "real" strategy
game, and its complete solvability is part of the point.

## Consensus on optimal play

- **You can always draw with correct play** — the full position graph (2,296 positions) confirms that from any reachable position, the player to move can find at least one drawing response; losing requires an actual error.
- **Move your L-piece before considering the neutrals** — evaluate all legal L-piece placements first, identify which ones are safe (no immediate losing response), then use neutral placement to maximise your flexibility or restrict the opponent's next L-placement.
- **Neutral pieces are powerful blockers** — placing a neutral in a cell that an opponent's L-piece would need can cut off many of the opponent's legal moves; use neutrals proactively to reduce the opponent's options, not just to "waste" the option.
- **Avoid leaving only one legal L-placement** — if your next position has only one legal L-placement, the opponent can potentially block it next turn with a neutral; maintain at least two valid placements from any position you enter.
- **Symmetry traps are the main winning motif** — most wins in the L game occur when one player reduces the other to a single legal L-placement and then blocks it with a neutral; recognising when you are one neutral-move away from this is the core tactical pattern.

## Engines & current best play

- **Strongest known program(s):** Any exhaustive solver over the 2,296-position graph; the full game tree is trivially small and perfect play is lookup-based.
- **Strength:** Perfect; the complete position graph has been enumerated.
- **Where the proof / tablebase lives (if solved):** Complete exhaustive analysis; see [Wikipedia](https://en.wikipedia.org/wiki/L_game) for a summary.
- **Notes:** Designed by Edward de Bono as the simplest possible "real" strategy game; the draw result with perfect play is a deliberate feature of the design.

## Complexity

2,296 positions — trivially exhaustible.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/L_game)
- E. de Bono (1969). *The Five-Day Course in Thinking* (introduces the L-Game). **[verify]**

## See also

- [Tic-tac-toe](tic-tac-toe.md) · [Hexapawn](hexapawn.md) · [Mū tōrere](mu-torere.md)
- Lexicon: [strongly solved](../lexicon/README.md#strongly-solved) · [draw](../lexicon/README.md#draw)
