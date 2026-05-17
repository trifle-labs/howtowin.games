# Xiangqi

> Chinese chess — comparable in complexity to Western chess, and likewise
> unsolved.

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

Played on a 9×10 board, with pieces placed on line intersections. Distinctive
elements include the **river** dividing the board, the **palace** that confines
each general, and pieces such as the Cannon (which captures by jumping). The
generals may not face each other directly along an open file.

## Solution status

Xiangqi is **unsolved**. Its state-space (~10^40) and game-tree (~10^150)
complexity are broadly comparable to [chess](chess.md) — far beyond exhaustive
search. As with chess, **endgame tablebases** have been built for material
configurations with few pieces, giving strong (exact) solutions to those
sub-games, and xiangqi engines play at a superhuman level. But the
game-theoretic value of the standard opening position is not known.

## Consensus on optimal play

- **Cannon forks before crossing the river** — a Cannon on the back rank can pivot to attack along ranks and files using friendly or enemy screens; establishing early cannon pressure (especially targeting the palace) constrains the opponent before they can develop.
- **Control the river-crossing with Horses** — Horses (which move like a knight but can be blocked) are most effective once they cross the river; the two central river-crossing points are natural staging areas; occupy them to threaten the opponent's back ranks.
- **Protect the General from "facing" (Flying General)** — two generals may not stand on the same open file; always verify that advancing a piece does not open a check via the Flying General rule, and use it offensively to threaten the opponent's General on an open file.
- **Restrict the opponent's Elephants early** — Elephants (which move exactly two points diagonally and cannot cross the river) are purely defensive; attacking the squares that would block their paths limits the opponent's palace defence.
- **Palace control wins the endgame** — the 3×3 palace confines each General to only 9 squares; in endgames a Rook supported by a Cannon or Horse in or near the palace is usually decisive; aim to penetrate the palace with a supported piece.
- **Rooks belong on open files and the palace approach** — as in chess, doubled Rooks on an open central file or aimed at the palace are dominant; connect Rooks as early as possible.

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
