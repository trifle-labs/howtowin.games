# Connect6

> A six-in-a-row game designed for fairness — each player places two stones per turn. Unsolved by design.

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
| **Playable** | connect6 |

## Description

Connect6 was introduced by Professor I-Chen Wu in 2003. It is played on a Go
board (or larger). The first player places **one** stone. After that, **each
player places two stones per turn**. The first player to get **six** (or more)
of their stones in a row — horizontally, vertically, or diagonally — wins.

## Solution status

Connect6 is **unsolved**. The two-stones-per-turn rule was chosen specifically
to neutralise the overwhelming first-player advantage that plagues
[Gomoku](gomoku.md): after the opening single stone, each side always has the
same total number of stones on the board, which makes the game empirically very
balanced — and that balance, plus the large board, makes it hard to solve.
Connect6 has an active competitive and computer-games community, but no proof of
the game-theoretic value of the standard opening exists.

## Consensus on optimal play

- **Build "live fours" (four in a row with both ends open) using your two-stone turns** — since you place two stones per turn, you can advance two different threats at once. A live four is nearly impossible to block because the opponent cannot cover both ends in a single two-stone turn while also building their own attack.
- **Create double live-four threats (a "double four")** — having two separate live fours on the board at the same time is an instant win, since the opponent's two stones cannot block both. Expert Connect6 strategy revolves around creating this double-four situation.
- **Respond to opponent threats first, then build yours** — with two stones per turn, you can usually block one serious threat and create a new threat of your own in the same move. Falling behind in threats is usually fatal.
- **Spread your stones across multiple lines** — putting all your stones in one row makes your plan obvious. Mixing horizontal, vertical, and diagonal threats makes it harder for the opponent to block everything.
- **The one-stone opening does not give a lasting advantage** — unlike Gomoku, the single opening stone is quickly balanced out. Do not play as though you have a permanent first-move edge. Play for balanced development.

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
