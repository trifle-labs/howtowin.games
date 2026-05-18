# Losing chess

> Chess where the goal is reversed: lose all your pieces to win. Remarkably, this version has been solved.

| Field | Value |
|-------|-------|
| Also known as | Antichess, Suicide chess, Giveaway chess, Take-all |
| Players | 2 |
| Type | Partisan board game (misère-flavoured chess variant) |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Weakly solved |
| **Game-theoretic value** | First-player (White) win |
| Year solved | 2016 |
| Solved by | Mark Watkins |
| State-space complexity | Comparable to chess (smaller in practice; games are forcing) |
| Game-tree complexity | Large, but heavily pruned by compulsory capture |
| **Playable** | losing-chess |

## Description

The pieces and board are the same as in chess, but the goal is reversed: you win by losing all your pieces or by being stalemated (unable to move). Crucially, captures are compulsory — if you can capture, you must (choosing among captures if several are available). The forced-capture rule makes play extremely forcing and is what brings the game within reach of solving.

## Solution status

Losing chess is **weakly solved**. [Mark Watkins (2016)](../references.md#watkins-losingchess2016)
completed a long, distributed proof-tree computation establishing that **White
wins with perfect play**, and that the winning first move is **1. e3**. The
compulsory-capture rule prunes the game tree enormously — most positions have
very few legal moves — which is why a full-blown chess variant could be solved
when chess itself cannot be.

This makes losing chess one of the most complex chess-family games to be
weakly solved, and a striking case where *changing the win condition* turns an
intractable game into a tractable one.

> **[verify]** — Widely reported and accepted; the primary write-up should be
> confirmed and pinned in [references.md](../references.md#watkins-losingchess2016).

## Consensus on optimal play

- **Play 1. e3 as White** — this is the proven winning first move. Any other first move has not been proven to win and may not be a win. The solution is specific to 1. e3.
- **Force captures relentlessly** — losing chess is won by losing pieces fastest. Moves that force the opponent to capture (by offering pieces they must take) are almost always best. Every forced capture the opponent makes is a piece you no longer need to lose.
- **Sacrifice major pieces early** — getting rid of the queen and rooks quickly by forcing the opponent to capture them reduces your material burden dramatically. Do not hoard strong pieces.
- **Use the compulsory-capture rule as a tactical weapon** — if you can offer multiple captures at once, the opponent can only take one. Offer sacrifices that force sequential captures.
- **Stalemate is also a win** — being unable to move is a win condition. In complex endings, steering toward a position where all your pieces are blocked can win outright without losing all pieces.
- **Against sub-optimal opponent play, engines are the guide** — the full winning tree from 1. e3 is large. Fairy-Stockfish in losing-chess mode plays near-optimally and is the practical reference for training.

## Engines & current best play

- **Strongest known program(s):** Fairy-Stockfish ([https://github.com/ianfab/Fairy-Stockfish](https://github.com/ianfab/Fairy-Stockfish) ([archive](http://web.archive.org/web/20230224150112/https://github.com/ianfab/Fairy-Stockfish))) supports antichess/losing-chess mode; Lichess hosts antichess with Fairy-Stockfish.
- **Strength:** Super-human; consistent with the solved weak solution.
- **Where the proof / tablebase lives (if solved):** [Watkins (2016)](../references.md#watkins-losingchess2016) — the distributed proof that 1. e3 wins; also playable on [Lichess antichess variant](https://lichess.org/variant/antichess).
- **Notes:** One of the most complex chess-family games to be weakly solved; the compulsory-capture rule is what makes the game tree small enough to solve.

## Complexity

Nominally chess-scale, but compulsory captures make real game trees far smaller
and far more forcing than ordinary chess.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Losing_chess) ([archive](http://web.archive.org/web/20260420060404/https://en.wikipedia.org/wiki/Losing_chess))
- [Watkins, M. (2016). *Losing Chess: 1. e3 Wins*.](../references.md#watkins-losingchess2016)

## See also

- [Chess](chess.md) · [Minichess](minichess.md) · [Dawson's chess](dawsons-chess.md)
- Lexicon: [weakly solved](../lexicon/README.md#weakly-solved) · [misère play](../lexicon/README.md#misère-play)
