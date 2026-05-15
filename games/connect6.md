# Connect6

> A k-in-a-row game deliberately designed for fairness — two stones per turn —
> and, partly by design, still unsolved.

| Field | Value |
|-------|-------|
| Also known as | Connect6, Connect 6 |
| Players | 2 |
| Type | Partisan positional (k-in-a-row) game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Unsolved |
| **Game-theoretic value** | Unknown |
| Year solved | — |
| Solved by | — |
| State-space complexity | Very large (typically played on a 19×19 or larger board) |
| Game-tree complexity | Very large |

## Description

Introduced by Professor I-Chen Wu in 2003. Played on a Go board (or larger).
The first player places **one** stone; thereafter **each player places two
stones per turn**. The winner is the first to get **six** (or more) of their
stones in a row, horizontally, vertically, or diagonally.

## Solution status

Connect6 is **unsolved**. The two-stones-per-turn rule was chosen specifically
to neutralise the overwhelming first-player advantage that plagues
[Gomoku](gomoku.md): after the opening single stone, each side always has the
same total number of stones on the board, which makes the game empirically very
balanced — and that balance, plus the large board, makes it hard to solve.
Connect6 has an active competitive and computer-games community, but no proof of
the game-theoretic value of the standard opening exists.

## Consensus on optimal play

- **Build "live fours" (four-in-a-row with both ends open) with two-stone turns** — placing two stones in one turn means you can simultaneously advance two different threats; a live four is nearly unblockable because the opponent cannot cover both ends in a single two-stone turn while also advancing their own attack.
- **Create double live-four threats ("double four")** — having two independent live fours on the board at once is an immediate win, since the opponent's two stones cannot block both; the entire strategy of expert Connect6 play converges on creating this double-four situation.
- **Respond to opponent threats first, then build** — with two stones per turn, you can usually block one serious threat and create a new one in the same move; falling behind in threat count is typically fatal.
- **Spread your stones over multiple lines, not one** — concentrating all stones in a single row telegraphs your intention; mixing line directions (horizontal, vertical, two diagonals) makes it harder for the opponent to pre-emptively block.
- **The opening single stone confers no lasting advantage** — unlike Gomoku, the one-stone start is quickly equalised; do not play as though you have a persistent first-move edge; play for balanced development.

## Engines & current best play

- **Strongest known program(s):** NCTU6-Lite and related programs from I-Chen Wu's group at NCTU; these use MCTS combined with pattern-matching threat-space search.
- **Strength:** Super-human; top engines consistently defeat the best human players.
- **Where the proof / tablebase lives (if solved):** — (unsolved; no tablebase)
- **Notes:** Connect6 has been a Computer Olympiad event since 2006; the NCTU family of programs has dominated competition, and the game is widely regarded as one of the better-balanced unsolved k-in-a-row games.

## Complexity

Played on boards as large as 19×19 or 59×59; state and game-tree complexity are
on the order of Go's or larger.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Connect6)
- I-C. Wu, D.-Y. Huang (2005). *A New Family of k-in-a-row Games*. Advances in Computer Games. **[verify]**
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002) (general framework)

## See also

- [Gomoku](gomoku.md) · [Renju](renju.md) · [Pente](pente.md) · [Connect Four](connect-four.md)
- Lexicon: [first-player advantage](../lexicon/README.md#first-player-advantage) · [maker-breaker game](../lexicon/README.md#maker-breaker-game)
