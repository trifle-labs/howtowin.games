# Yote

> A West African game where after capturing a piece, you get to remove an additional opponent piece of your choice. It has not been solved.

| Field | Value |
|-------|-------|
| Also known as | Yoté |
| Players | 2 |
| Type | Partisan capture game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Unsolved |
| **Game-theoretic value** | Unknown |
| Year solved | — |
| Solved by | — |
| State-space complexity | Moderate |
| Game-tree complexity | Moderate |
| **Playable** | yote |

## Description

Yote is a Senegalese / West African game on a 5×6 board. Each player has 12
stones held in reserve and may either drop a new stone or move/capture. A
distinctive feature: after capturing a stone, the captor must also remove a
second opposing stone of their choice from the board.

## Rules

1. Board: 5×6 grid; both sides start with the board empty and 12 stones each
   in reserve.
2. On a turn a player either drops a stone from reserve onto any empty cell,
   or moves one of their on-board stones one step orthogonally, or captures.
3. **Capture**: jump one of your stones over an adjacent opposing stone to
   the empty cell beyond; capture is optional, not chained.
4. After a capture, the capturing player must also remove **one additional
   opposing stone** of their choice from the board.
5. A player who cannot move and has no reserves loses; alternatively the
   player with stones remaining when the opponent has none wins.

## Solution status

Yote is **not solved**. It is a small game by modern standards but the
removal-rule adds significant branching to the game tree.

## Consensus on optimal play

- **Use the bonus removal to target the opponent's most dangerous piece** — after capturing, you must remove one extra opposing stone; always remove the piece that is most threatening (e.g., one that would enable a return capture or is part of a strong cluster), not just the nearest one.
- **Delay dropping reserve stones until you can threaten a capture** — entering a stone from reserve onto a cell that immediately threatens a jump gives the opponent a defensive dilemma; entering passively fills the board without tempo.
- **Capture when it removes two key pieces, not just to win one** — the double-removal rule means a single capture can eliminate two opposing stones; prioritise captures that remove two pieces in strong positions over captures that only clear a weak piece.
- **Avoid clustering your own stones two apart** — a row of your stones with an empty cell between each pair is a chain-capture opportunity for the opponent; keep stones either adjacent or widely spaced.
- **Endgame piece count is decisive** — with a small board (5×6) and double-removal, piece counts shift rapidly; avoid any sequence that leaves you in a one-for-two exchange unless the position demands it.

## Engines & current best play

- **Strongest known program(s):** No game-specific public engine known to the cataloguer. Playable in general-purpose abstract-game frameworks (e.g., [Ludii](https://ludii.games/)).
- **Strength:** Not benchmarked.
- **Where the proof / tablebase lives (if solved):** —
- **Notes:** Yote is a traditional West African game with competitive play in Senegal and Mali; the double-removal rule after capture is its most distinctive strategic feature and significantly increases the branching factor.

## Complexity

Moderate.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Yot%C3%A9) ([archive](http://web.archive.org/web/20260425005623/https://en.wikipedia.org/wiki/Yot%C3%A9))
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)

## See also

- [Seega](seega.md) · [Dara](dara.md) · [Surakarta](surakarta.md)
- Lexicon: [partisan game](../lexicon/README.md#partisan-game)
