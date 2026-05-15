# Makruk

> Thai chess — a chess relative with weak long-range pieces and a distinctive
> counting endgame; unsolved.

| Field | Value |
|-------|-------|
| Also known as | Thai chess, Makruk |
| Players | 2 |
| Type | Partisan board game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Unsolved (some endgame tables computed) |
| **Game-theoretic value** | Unknown |
| Year solved | — |
| Solved by | — |
| State-space complexity | Comparable to chess (~10^40 order) |
| Game-tree complexity | Comparable to chess |

## Description

Played on an 8×8 board. Makruk descends, like Western chess, from the older
[shatranj](shatranj.md) tradition: its Queen-equivalent (Met) moves only one
square diagonally, its Bishop-equivalent (Khon) is also short-range, and pawns
promote on the *sixth* rank. Pieces start one rank advanced compared to chess. A
detailed **counting rule** forces a draw if the stronger side cannot mate within
a bounded number of moves.

## Solution status

Makruk is **unsolved**. With weaker long-range pieces than chess, games tend to
be slower and more manoeuvring, but the state-space and game-tree complexity
remain on the order of chess's — far beyond exhaustive search. Endgame
tablebases have been generated for small material counts (and matter a great
deal in practice because of the counting rule), giving exact solutions to those
sub-games; the full game's value is unknown.

## Consensus on optimal play

- **The counting rule shapes the entire endgame** — once the last pawn is promoted or captured, the defending side starts counting; the attacker must mate within the allotted moves (determined by the count rule) or the game is drawn; knowing when the count begins and how many moves remain is essential.
- **Pawns promote on the sixth rank, not the eighth** — promoted pawns (Met/queen equivalent) come into play faster; use pawn advances early to threaten early promotion and force defensive commitments.
- **The Met is a short-range piece — treat it as a bishop/knight hybrid** — the Met (queen) moves only one square diagonally; centralise it to maximise its impact rather than leaving it on the flank where it can only cover one or two adjacent squares.
- **The Khon (bishop-equivalent) covers only one colour** — like chess bishops, Khon pieces are colour-bound (one square diagonal); if both Khon are on the same colour, coordinate them as a pair; if on different colours, one will always cover gaps the other cannot.
- **Endgame: consult the tablebase for small material counts** — makruk tablebases for positions with a few pieces are publicly used by Thai competitive players; a position that looks winning may be drawn due to the counting rule; check before committing to a piece exchange.
- **Opening: advance both flanks to create Met activity** — because pieces start one rank closer than in chess, early activation is easier; develop both wings simultaneously to avoid giving the opponent a free centralisation advantage.

## Engines & current best play

- **Strongest known program(s):** No dominant publicly-named engine; Thai-language programs and Fairy-Stockfish (with Makruk variant) are used in the Thai competitive community.
- **Strength:** Strong amateur; stronger than casual human play.
- **Where the proof / tablebase lives (if solved):** Endgame tablebases computed for small material counts; the counting rule makes these tablebases particularly important in practical play.
- **Notes:** Makruk is the most widely played traditional chess variant in mainland Southeast Asia; the counting rule distinguishes its endgames sharply from chess.

## Complexity

Comparable to chess: state-space on the order of 10^40, game-tree far beyond
search.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Makruk) ([archive](http://web.archive.org/web/20260302012918/https://en.wikipedia.org/wiki/Makruk))
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002) (general framework)

## See also

- [Shatranj](shatranj.md) · [Chess](chess.md) · [Xiangqi](xiangqi.md)
- Lexicon: [endgame tablebase](../lexicon/README.md#endgame-tablebase)
