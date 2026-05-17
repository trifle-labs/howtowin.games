# Chess

> The most-studied game in history. Computers play better than any human, we have perfect endgame data for up to 7 pieces, and it is still nowhere near solved.

| Field | Value |
|-------|-------|
| Also known as | Western chess, international chess |
| Players | 2 |
| Type | Partisan board game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Unsolved (endgames strongly solved for ≤7 pieces) |
| **Game-theoretic value** | Unknown (widely conjectured to be a draw) |
| Year solved | — |
| Solved by | — |
| State-space complexity | ~10^44 legal positions |
| Game-tree complexity | ~10^120 (the "Shannon number") |
| **Family** | — |
| **Is head** | Yes |

## Description

The standard 8×8 board game with six types of pieces per side. Special moves
include castling (moving the king and rook together), en passant (a special
pawn capture), and pawn promotion (turning a pawn into a stronger piece when it
reaches the far end). Checkmate wins. Draws can happen through stalemate (no
legal moves but not in check), threefold repetition (same position three times),
the fifty-move rule (no captures or pawn moves in 50 turns), or insufficient
material (not enough pieces left to checkmate).

## Solution status

Chess is **unsolved**, and is expected to remain so indefinitely. The
game-tree complexity — Claude Shannon's classic estimate of about 10^120
([Shannon, 1950](../references.md#shannon1950)) — is astronomically beyond any
conceivable exhaustive search, and the legal-position count is on the order of
10^44.

What *is* solved is the **endgame**: complete
[tablebases](../lexicon/README.md#endgame-tablebase) give the exact
game-theoretic value (and distance to mate) for **every position with 7 or
fewer pieces** ([Lomonosov, 2012](../references.md#lomonosov2012)), built by
[retrograde analysis](../lexicon/README.md#retrograde-analysis) in the tradition
of [Thompson (1986)](../references.md#thompson1986). An 8-piece project is under
way. These are genuine strong solutions — of sub-games, not of chess.

Modern engines (and self-play systems such as
[AlphaZero](../references.md#silver-alphazero2018)) play far above the best
humans, but this is [strong play, not solving](../lexicon/README.md#solving-vs-strong-play):
it proves nothing about the game-theoretic value of the initial position.

## Consensus on optimal play

Almost all experts and chess engines agree that chess is a **draw** with perfect
play — but this is a strong belief based on evidence, not a mathematical proof.

## Engines & current best play

- **Strongest known programs:** [Stockfish](https://stockfishchess.org/) ([archive](http://web.archive.org/web/20260512103017/https://stockfishchess.org/)) (alpha-beta + NNUE evaluation, open source) and [Leela Chess Zero](https://lczero.org/) ([archive](http://web.archive.org/web/20260501191219/https://lczero.org/)) (MCTS + deep residual policy/value network, AlphaZero-style, open source); historically [AlphaZero](../references.md#silver-alphazero2018) (DeepMind, closed) demonstrated the self-play approach.
- **Strength:** Vastly super-human. Top engines rate ~3600 Elo on [CCRL](https://www.computerchess.org.uk/ccrl/) ([archive](http://web.archive.org/web/20251204164819/https://computerchess.org.uk/ccrl/)) lists vs. ~2830 for the strongest human; engine-vs-engine matches (TCEC, CCC) settle a large majority of games as draws under balanced openings.
- **Endgame tablebases (genuine strong solutions of sub-games):** [Syzygy](https://syzygy-tables.info/) ([archive](http://web.archive.org/web/20260512112537/https://syzygy-tables.info/)) (≤7 pieces, distance-to-zeroing) and [Lomonosov 7-piece](../references.md#lomonosov2012) (distance-to-mate). An 8-piece project is under way.
- **Notes:** No engine "solves" chess — they prove only that *they* draw or beat their opponents, not the game-theoretic value of the start position. See [solving vs. strong play](../lexicon/README.md#solving-vs-strong-play).

## Complexity

State-space ~10^44; game-tree ~10^120
([Shannon, 1950](../references.md#shannon1950);
[van den Herik et al., 2002](../references.md#vandenherik2002)). Generalised
(n×n) chess is EXPTIME-complete.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Chess) ([archive](http://web.archive.org/web/20260514055155/https://en.wikipedia.org/wiki/Chess))
- [Shannon, C. E. (1950). *Programming a Computer for Playing Chess*.](../references.md#shannon1950)
- [Thompson, K. (1986). *Retrograde Analysis of Certain Endgames*.](../references.md#thompson1986)
- [Lomonosov 7-piece endgame tablebases (2012).](../references.md#lomonosov2012)
- [Silver et al. (2018). *AlphaZero*.](../references.md#silver-alphazero2018)
- [Zermelo, E. (1913).](../references.md#zermelo1913)

## See also

- [Losing chess](losing-chess.md) · [Minichess](minichess.md) · [Shogi](shogi.md) · [Xiangqi](xiangqi.md) · [Shatranj](shatranj.md) · [Go](go.md)
- Lexicon: [endgame tablebase](../lexicon/README.md#endgame-tablebase) · [solving vs. strong play](../lexicon/README.md#solving-vs-strong-play) · [game-tree complexity](../lexicon/README.md#game-tree-complexity)
