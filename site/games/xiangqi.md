# Xiangqi

> The Chinese version of chess, played on a 9x10 board with a river in the middle. It has not been solved.

| Field | Value |
|-------|-------|
| Also known as | Chinese chess, Elephant chess |
| Players | 2 |
| Type | Partisan board game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Unsolved (some endgame tables computed) |
| **Game-theoretic value** | Unknown |
| Year solved | — |
| Solved by | — |
| State-space complexity | ~10^40 |
| Game-tree complexity | ~10^150 |
| **Playable** | xiangqi |

## Description

Played on a 9x10 board, with pieces placed on line intersections (like in Go). Distinctive features include the river dividing the board in half, the palace that restricts each general's movement, and pieces like the Cannon (which captures by jumping over another piece). The two generals may not face each other directly along the same column with no pieces between them.

## Solution status

Xiangqi is **unsolved**. Its state-space (~10^40) and game-tree (~10^150)
complexity are broadly comparable to [chess](chess.md) — far beyond exhaustive
search. As with chess, **endgame tablebases** have been built for material
configurations with few pieces, giving strong (exact) solutions to those
sub-games, and xiangqi engines play at a superhuman level. But the
game-theoretic value of the standard opening position is not known.

## Consensus on optimal play

- **Use the Cannon for early pressure** — a Cannon on your back row can attack along rows and columns by using other pieces as screens. Setting up early Cannon pressure, especially aimed at the opponent's palace, limits their options before they can develop their pieces.
- **Control the river crossings with Horses** — Horses (which move like a knight in chess but can be blocked by pieces in their path) are most effective once they cross the river. The two central crossing points are natural staging areas. Occupy them to threaten the opponent's back rows.
- **Watch the Flying General rule** — the two generals may not stand on the same open column with no pieces between them. Check that your move does not open a check through this rule, and use it offensively to threaten the opponent's general.
- **Restrict the opponent's Elephants early** — Elephants move exactly two points diagonally and cannot cross the river. They are purely defensive. Attack the squares that would block their movement to limit the opponent's palace defense.
- **Control the palace to win the endgame** — the 3x3 palace limits each general to only 9 squares. In the endgame, a Rook supported by a Cannon or Horse in or near the palace is usually decisive. Aim to break into the palace with a supported piece.
- **Rooks on open files and aimed at the palace** — as in chess, doubled Rooks on an open central file or aimed at the palace are very powerful. Connect your Rooks as early as possible.

## Engines & current best play

- **Strongest known program(s):** ElephantEye, Cyclone, and various Chinese commercial engines — alpha-beta search with neural-network evaluation; top engines are significantly stronger than top human players.
- **Strength:** Super-human; top engines defeat world champions consistently.
- **Where the proof / tablebase lives (if solved):** Endgame tablebases for small piece counts are built and used by competitive engines; no full-game solution. See [../lexicon/README.md#endgame-tablebase](../lexicon/README.md#endgame-tablebase).
- **Notes:** Xiangqi's game-tree complexity (~10¹⁵⁰) is comparable to chess; it is practically unsolvable by exhaustive means for the foreseeable future.

## Complexity

State-space ~10^40; game-tree ~10^150
([van den Herik et al., 2002](../references.md#vandenherik2002)). Generalised
xiangqi is EXPTIME-complete.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Xiangqi) ([archive](http://web.archive.org/web/20260429225338/https://en.wikipedia.org/wiki/Xiangqi))
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)

## See also

- [Chess](chess.md) · [Janggi](janggi.md) · [Shogi](shogi.md) · [Makruk](makruk.md)
- Lexicon: [endgame tablebase](../lexicon/README.md#endgame-tablebase) · [solving vs. strong play](../lexicon/README.md#solving-vs-strong-play)
