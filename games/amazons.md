# Amazons

> A territorial game of queens that shoot arrows; a favourite CGT research
> target, but unsolved on its standard board.

| Field | Value |
|-------|-------|
| Also known as | El Juego de las Amazonas, Game of the Amazons |
| Players | 2 |
| Type | Partisan combinatorial game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Unsolved (standard 10×10); small boards analysed |
| **Game-theoretic value** | Unknown for the standard board |
| Year solved | — |
| Solved by | — |
| State-space complexity | ~10^40 (standard 10×10 board) |
| Game-tree complexity | ~10^212 (standard 10×10 board) |

## Description

Played on a 10×10 board, each side with four "amazons" that move like chess
queens. After moving, an amazon **shoots an arrow** (also moving queen-like)
that permanently blocks a square. Blocked squares and pieces obstruct movement.
A player who cannot move loses — so the game is about walling off territory.

## Solution status

Amazons is **unsolved** on its standard 10×10 board. It is, however, heavily
studied in combinatorial game theory because the endgame *fragments into
independent regions*, each with an exact CGT value, making it an ideal showcase
for [hot-game](../lexicon/README.md#temperature--hot-game) and thermography
techniques. Endgames and small boards have been analysed exhaustively, and the
generalised (n×n) game is known to be PSPACE-complete
([Hearn & Demaine, 2009](../references.md#hearn-demaine2009)). But the value of
the standard initial position is not known. Complexity estimates place Amazons
between Othello and chess/Go.

## Consensus on optimal play

- **Control territory early, not pieces** — the object is to leave your opponent without moves, so expanding your reachable squares matters more than capturing or threatening amazons directly.
- **Shoot arrows that restrict the opponent** — the arrow after each move is as important as the move itself; a well-placed arrow that limits an enemy amazon's future options is often stronger than a distant territorial gain.
- **Keep your amazons mobile** — amazons trapped behind their own arrows become worthless; avoid self-blocking by thinking two moves ahead about where you will shoot next.
- **Fragment the board in your favour** — when the board breaks into independent regions, each region has a CGT value; aim to create more and larger regions on your side than on your opponent's.
- **In the endgame, count liberties** — once regions are isolated, the player whose region contains more "moves remaining" (mobility surplus) wins; thermographic analysis from CGT guides exact endgame play.
- **Opening: anchor amazons near the corners** — moving toward the corners early gives your amazons protected territory to develop from without being cut off.

## Engines & current best play

- **Strongest known program(s):** Amazons Engine / various research bots (e.g., Galactic, 8Q3, NAgents) — minimax/alpha-beta with CGT-based endgame solvers
- **Strength:** Super-human; top engines consistently outperform top human players.
- **Where the proof / tablebase lives (if solved):** Not applicable — standard 10×10 board is unsolved; CGT endgame analysis covers many late-game positions.
- **Notes:** Amazons is a leading benchmark for combining heuristic search (opening/midgame) with exact CGT calculation (endgame); competition results appear in the Computer Olympiad proceedings.

## Complexity

State-space ~10^40, game-tree ~10^212 (figures of the order cited in
[van den Herik et al., 2002](../references.md#vandenherik2002) and subsequent
literature).

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Game_of_the_Amazons) ([archive](http://web.archive.org/web/20260511121116/https://en.wikipedia.org/wiki/Game_of_the_Amazons))
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)
- [Hearn, R. A. & Demaine, E. D. (2009). *Games, Puzzles, and Computation*.](../references.md#hearn-demaine2009)
- [Berlekamp, Conway & Guy (2001). *Winning Ways for Your Mathematical Plays*.](../references.md#bcg2001)

## See also

- [Lines of Action](lines-of-action.md) · [Clobber](clobber.md) · [Go](go.md)
- Lexicon: [temperature / hot game](../lexicon/README.md#temperature--hot-game) · [game-tree complexity](../lexicon/README.md#game-tree-complexity)
