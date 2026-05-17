# King of the Hill

> Chess variant where the king reaching the centre wins — unsolved.

| Field | Value |
|-------|-------|
| Also known as | KotH, King of the Hill chess |
| Players | 2 |
| Type | Partisan chess variant |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Unsolved |
| **Game-theoretic value** | Unknown |
| Year solved | — |
| Solved by | — |
| State-space complexity | Similar to chess |
| Game-tree complexity | Similar to chess |
| **Playable** | king-of-the-hill |

## Description

King of the Hill keeps orthodox chess unchanged except that a player wins
immediately by safely moving the king to one of the four central squares
(d4, e4, d5, e5). The new objective makes king activity matter from move one.

## Rules

1. Standard chess setup, movement, and rules.
2. Additional winning condition: a player wins immediately if they move (or
   leave) their own king onto **d4, e4, d5, or e5** such that the king is not
   in check on that square.
3. Standard checkmate, stalemate, and draw rules also apply.
4. A move that would place the king on a central square while in check is
   illegal as usual.

## Solution status

King of the Hill is **not solved**. Engine play is strong and many opening
lines are deeply analysed but no formal value is proven.

## Consensus on optimal play

Heuristics from strong online play:

- **Restrain the centre, then race** — the same four central squares that decide chess strategically now win the game outright. Standard openings that fight for d4/e4/d5/e5 (1.e4, 1.d4) carry over, but the priority shifts toward controlling those squares with pieces (not just pawns) so the opposing king cannot safely walk there.
- **Don't castle into a wall** — long castling moves the king *away* from the hill; short castling keeps it within striking distance later in the endgame.
- **Trade the queens early** — without queens, sending the king to the centre becomes safe. Strong players often happily trade queens once the centre is locked.
- **King marches in the endgame** — the classical chess maxim that the king is a strong endgame piece becomes a primary winning plan.

## Engines & current best play

- **Strongest known programs:** [Fairy-Stockfish](https://github.com/ianfab/Fairy-Stockfish) ([archive](http://web.archive.org/web/20230224150112/https://github.com/ianfab/Fairy-Stockfish)) (open source) — the win-by-king-on-d4 condition is encoded as a terminal condition.
- **Strength:** Super-human; [Lichess King of the Hill leaderboard](https://lichess.org/variant/kingOfTheHill) ([archive](http://web.archive.org/web/20260511091235/https://lichess.org/variant/kingOfTheHill)) shows engines dominating top humans.
- **Notes:** No specific tablebases; orthodox-chess tablebases give wrong answers because they ignore the centre-square win.

## Complexity

Similar to chess.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Chess_variant) ([archive](http://web.archive.org/web/20260508053202/https://en.wikipedia.org/wiki/Chess_variant))
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)

## See also

- [Chess](chess.md) · [Three-check chess](three-check-chess.md) · [Horde chess](horde-chess.md)
- Lexicon: [partisan game](../lexicon/README.md#partisan-game)
