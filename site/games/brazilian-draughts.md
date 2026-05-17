# Brazilian draughts

> 8×8 international draughts — flying kings on a small board, unsolved.

| Field | Value |
|-------|-------|
| Also known as | Damas brasileiras |
| Players | 2 |
| Type | Partisan draughts |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Unsolved |
| **Game-theoretic value** | Unknown |
| Year solved | — |
| Solved by | — |
| State-space complexity | Similar to English draughts |
| Game-tree complexity | Similar to English draughts |
| **Playable** | brazilian-draughts |

## Description

Brazilian draughts is essentially international draughts (Polish draughts)
played on an 8×8 board: men capture backward, kings fly, and capture
sequences must take the maximum number of pieces.

## Rules

1. Board: 8×8 with dark squares to the player's left. Each side has 12 men.
2. Men move one square diagonally forward; men capture by jumping enemy
   pieces forward or backward.
3. Captures are mandatory and must take the **maximum number of pieces**
   available.
4. Men promoting on the back rank during a chain capture continue as kings if
   they can still capture.
5. Kings move and capture any distance along a diagonal (flying king); they
   must land on the square immediately past the captured piece's row, but may
   choose any empty square along the line.
6. Loss conditions: no legal moves available.

## Solution status

Brazilian draughts is **not solved**. Tablebase work covers small endgames;
engines are strong but no full proof exists.

## Consensus on optimal play

- **Maximum-capture rule dominates tactics** — all legal captures are mandatory and you must take the maximum number of pieces; your entire tactical calculation must start by finding the longest capture chain available to each side before considering positional moves.
- **Promote to flying king as fast as possible** — a king that can sweep diagonals is vastly more powerful than a man; advancing pieces toward the back rank while blocking opponent promotions is the primary strategic objective.
- **Control the long diagonal** — as in international draughts, the long diagonal is a key highway for flying kings; anchoring a man or king on the central long diagonal squares restricts opponent king mobility.
- **Maintain piece balance; avoid forced-exchange disadvantage** — the maximum-capture rule means exchanges can be forced; make sure your capture chains do not leave you with fewer or weaker pieces after the sequence resolves.
- **Tempo matters in king endings** — king vs. king endings often hinge on who has the opposition (the right diagonal relationship); flying kings make triangulation manoeuvres important in pure king endgames.

## Engines & current best play

- **Strongest known program(s):** Various draughts engines adapted for Brazilian rules (e.g., Kingsrow or Cake variants); no single canonical public engine for this specific variant is prominently documented.
- **Strength:** Super-human for endgame positions covered by tablebases; strong amateur to expert-level in midgame.
- **Where the proof / tablebase lives (if solved):** Endgame tablebases for small piece counts exist; full game is unsolved.
- **Notes:** Brazilian draughts sits between English draughts (solved) and international draughts (10×10, unsolved) in complexity; its flying-king rules make it considerably harder to solve than English draughts despite the same 8×8 board.

## Complexity

Similar to English draughts.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Brazilian_draughts) ([archive](http://web.archive.org/web/20260312045332/https://en.wikipedia.org/wiki/Brazilian_draughts))
- [Schaeffer et al. (2007). *Checkers is Solved*.](../references.md#schaeffer2007) (related)
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)

## See also

- [International draughts](international-draughts.md) · [English draughts](checkers.md) · [Russian draughts](russian-draughts.md)
- Lexicon: [endgame tablebase](../lexicon/README.md#endgame-tablebase)
